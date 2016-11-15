var compareIDs = [$.url().param('id1'), $.url().param('id2'), $.url().param('id3'), $.url().param('id4'), $.url().param('id5')];
var ids = [];
for(var i=0;i<compareIDs.length;i++){
    if(compareIDs[i]){
        ids.push(compareIDs[i]);
    }
}
var num = ids.length;
var emps = alasql('SELECT * FROM emp', []);

var a = 1, b = 1, c = 1;

function setPhotos(){
    for(var i=0;i<num;i++){
        var tempID = ids[i];
        var image = 'img/%20(' + tempID + ').jpg';
        
        $('#profile-pic-'+i).attr('src', image);
    }
}

var columns = [
    "Name",
    "Number",
    "Skills",
    "Average client rating",
    "Average project difficulty",
    "Average time efficiency",
    "Overall rating",
    "Total hours worked",
    "Projects",
    ""
];

function roundOff(n){
    n = parseFloat(n);
    return (Math.round((n*Math.pow(10,2)).toFixed(1))/Math.pow(10,2)).toFixed(2);;
}

function getTagForCode(code){
    var ret;
    var ar = [
        'C++',
        'Java',
        'JavaScript',
        'HTML',
        'C#',
        'CSS',
        'PHP',
        'Python',
        'Scala',
        'Ruby',
        'Android',
        'Windows',
        'Linux'
    ];
    ret = ar[code];
    return ret;
}
// --------------------------------- get code for tag ---------------------------------
function getCodeForTag(tag){
    var ret = 0;
    switch(tag){
        case 'C++':
            ret = 0;
            break;
        case 'Java':
            ret = 1;
            break;
        case 'JavaScript':
            ret = 2;
            break;
        case 'HTML':
            ret = 3;
            break;
        case 'C#':
            ret = 4;
            break;
        case 'CSS':
            ret = 5;
            break;
        case 'PHP':
            ret = 6;
            break;
        case 'Python':
            ret = 7;
            break;
        case 'Scala':
            ret = 8;
            break;
        case 'Ruby':
            ret = 9;
            break;
        case 'Android':
            ret = 10;
            break;
        case 'Windows':
            ret = 11;
            break;
        case 'Linux':
            ret = 12;
            break;
    }
    return ret;
}

function getTags(id){
    var cell = '';
    var tagCount = [0,0,0,0,0,0,0,0,0,0,0,0,0];
    var projectList = alasql('SELECT * FROM projects WHERE emp=?', [ parseInt(id) ]);
    //console.log(projectList.length);

    for(var j=0;j<projectList.length;j++){
        var project = projectList[j];
        var tagList = alasql('SELECT * FROM tags WHERE project_id=?', [ project.id ]);
        for(var k=0;k<tagList.length;k++){
            tagCount[getCodeForTag(tagList[k].tag)]++;
        }
        //alert(project.name);
    }

    //var tagLocalArray = tagCount;
    for(var i=0;i<tagCount.length;i++){
        if(tagCount[i]){
            cell += ('<button class="btn btn-info btn-xs" type="button" style="margin:1px;">' + getTagForCode(i) + ' <span class="badge">' + tagCount[i] +'</span></button> ');
        }
    }
    
    return cell;
}

function clientRating(id){
    var tProjects = alasql('SELECT * FROM projects WHERE emp=?', [ parseInt(id) ]);
    var client = 0;
    for(var i=0;i<tProjects.length;i++){
        var tProject = tProjects[i];
        client += tProject.client_rating;
    }
    return client/tProjects.length;
}

function difficultyAvg(id){
    var tProjects = alasql('SELECT * FROM projects WHERE emp=?', [ parseInt(id) ]);
    var difficulty = 0;
    for(var i=0;i<tProjects.length;i++){
        var tProject = tProjects[i];
        difficulty += tProject.difficulty;
    }
    return difficulty/tProjects.length;
}

function timeEfficiency(id){
    var tProjects = alasql('SELECT * FROM projects WHERE emp=?', [ parseInt(id) ]);
    var time = 0;
    for(var i=0;i<tProjects.length;i++){
        var tProject = tProjects[i];
        time += (tProject.hours_needed / tProject.hours_worked)*10;
    }
    return time/tProjects.length;
}

function overallRating(id){
    var client = clientRating(id), difficulty = difficultyAvg(id), time = timeEfficiency(id);
    return ((client*a + difficulty*b + time*c)/(2 * (a + b + c)));
}

function hoursWorked(id){
    var tempEmps = alasql('SELECT emp,sum(hours_worked) as sum_hours_worked FROM projects GROUP BY emp', []);
    return tempEmps[id - 1].sum_hours_worked;
}

function getProjects(id){
    var ret = '';
    var tProjects = alasql('SELECT * FROM projects WHERE emp=?', [ parseInt(id) ]);
    for(var i=0;i<tProjects.length;i++){
        var tProject = tProjects[i];
        ret += tProject.name;
        if(i < tProjects.length - 1){
            ret += ', ';
        }
    }
    return ret;
}

function getHireButton(id){
    id = parseInt(id);
    var emp = emps[id - 1];
    if(emp.hire){
        return '<a href="mailto:' + emp.email + '?subject=New%20Opportunity!" id="hire-button-' + emp.id + '" class="btn btn-success" target="_blank"><span class="glyphicon glyphicon-briefcase"></span> Hire</a>';
    }else{
        return '';
    }
}

function putValue(id, i){
    var emp = emps[id - 1];
    switch(i){
        case 0: // name
            return emp.name;
            break;
        case 1: //num
            return '<a href="emp.html?id=' + emp.id + '">' + emp.number + '</a>';
            break;
        case 2: // skills
            return getTags(id);
            break;
        case 3: // average client rating
            return roundOff(clientRating(id));
            break;
        case 4: //Average project difficulty
            return roundOff(difficultyAvg(id));
            break;
        case 5: //Average time efficiency
            return roundOff(timeEfficiency(id));
            break;
        case 6: //Overall rating
            return roundOff(overallRating(id));
            break;
        case 7: //Total hours worked
            return hoursWorked(id);
            break;
        case 8: //Projects
            return getProjects(id);
            break;
        case 9: // hire button
            return getHireButton(id);
            break;
        default:
            return 0;
    }
}

function comparePeople(){
    setPhotos();
    var tbody = $('#tbody-compare');
    tbody.empty();
    for (var i = 0; i < columns.length; i++) {
        var columnName = columns[i];
        //var emp = emps[i];
        //var tempTags = allTags[emp.id - 1];
        var tr = $('<tr class="row"></tr>');
        tr.append('<th class="col-md-2">' + columnName +'</th>');
        for(var j=0;j<num;j++){
            tr.append('<td class="col-md-2">'+ putValue(ids[j], i) +'</td>');
        }
        for(var j=num;j<5;j++){
            tr.append('<td class="col-md-2"></td>');
        }
        tr.appendTo(tbody);
    }
}

comparePeople();