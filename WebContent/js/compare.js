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

    var tagLocalArray = tagCount;
    for(var i=0;i<tagCount.length;i++){
        if(tagCount[i]){
            cell += ('<button class="btn btn-info btn-xs" type="button" style="margin:1px;" data-toggle="tooltip" data-placement="top" title="'+ tagLocalArray[i] +' project' + (tagLocalArray[i]<2?'':'s') +' related to ' + getTagForCode(i) + '">' + getTagForCode(i) + ' <span class="badge">' + tagLocalArray[i] +'</span></button> ');
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
    return client/(2*tProjects.length);
}

function difficultyAvg(id){
    var tProjects = alasql('SELECT * FROM projects WHERE emp=?', [ parseInt(id) ]);
    var difficulty = 0;
    for(var i=0;i<tProjects.length;i++){
        var tProject = tProjects[i];
        difficulty += tProject.difficulty;
    }
    return difficulty/(2*tProjects.length);
}

function timeEfficiency(id){
    var tProjects = alasql('SELECT * FROM projects WHERE emp=?', [ parseInt(id) ]);
    var time = 0;
    for(var i=0;i<tProjects.length;i++){
        var tProject = tProjects[i];
        time += (tProject.hours_needed / tProject.hours_worked)*5;
    }
    if(time/tProjects.length > 5.0){
        return 5.0;
    }
    return time/tProjects.length;
}

function overallRating(id){
    var client = clientRating(id), difficulty = difficultyAvg(id), time = timeEfficiency(id);
    return ((client*a + difficulty*b + time*c)/( (a + b + c)));
}

function hoursWorked(id){
    var tTempProj = alasql('SELECT id,emp,sum(hours_worked) as sum_hours_worked,hours_worked FROM projects WHERE emp=? GROUP BY emp', [ parseInt(id) ]);
    //console.log(tTempProj[0].sum_hours_worked);
    return tTempProj[0].sum_hours_worked;
}

function getProjects(id){
    var ret = '';
    var tProjects = alasql('SELECT * FROM projects WHERE emp=?', [ parseInt(id) ]);
    for(var i=0;i<tProjects.length;i++){
        var tProject = tProjects[i];
        var tTags = alasql('SELECT * FROM tags WHERE project_id=?', [ tProject.id ]);
        var s = '';
        for(var j=0;j<tTags.length;j++){
            s += tTags[j].tag;
            if(j< tTags.length - 1){
                s += ', ';
            }
        }
        
        ret += ('<span  data-toggle="tooltip" data-placement="top" title="' + s + '" style="cursor:pointer;">' + tProject.name +'</span>');

        if(i < tProjects.length - 1){
            ret += '<br> ';
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
    var tTempProj = alasql('SELECT id,emp,sum(hours_worked) as sum_hours_worked,hours_worked FROM projects WHERE emp=? GROUP BY emp', [ parseInt(id) ]);
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
            if(tTempProj[0].sum_hours_worked){
                return roundOff(clientRating(id));
            }
            return 0;
            break;
        case 4: //Average project difficulty
            if(tTempProj[0].sum_hours_worked){
                return roundOff(difficultyAvg(id));
            }
            return 0;
            break;
        case 5: //Average time efficiency
            if(tTempProj[0].sum_hours_worked){
                return roundOff(timeEfficiency(id));
            }
            return 0;
            break;
        case 6: //Overall rating
            if(tTempProj[0].sum_hours_worked){
                return roundOff(overallRating(id));
            }
            return 0;
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

function getStars(r){
    return '<div class="rating-container rating-xs rating-animate" style="cursor:pointer;"><div class="rating"><span class="empty-stars"><span class="star"><i class="glyphicon glyphicon-star-empty"></i></span><span class="star"><i class="glyphicon glyphicon-star-empty"></i></span><span class="star"><i class="glyphicon glyphicon-star-empty"></i></span><span class="star"><i class="glyphicon glyphicon-star-empty"></i></span><span class="star"><i class="glyphicon glyphicon-star-empty"></i></span></span><span class="filled-stars" style="width: '+ (r*20) +'%;"><span class="star"><i class="glyphicon glyphicon-star"></i></span><span class="star"><i class="glyphicon glyphicon-star"></i></span><span class="star"><i class="glyphicon glyphicon-star"></i></span><span class="star"><i class="glyphicon glyphicon-star"></i></span><span class="star"><i class="glyphicon glyphicon-star"></i></span></span></div><input id="rating-input" type="number" class="hide"></div>';
}

function getInfoIcon(s){
    return '<span class="glyphicon glyphicon-info-sign pull-right" data-toggle="tooltip" title="' + s + '" style="cursor:pointer;"></span>';
}

function getInfo(i){
    switch(i){
        case 2: // skills
            return getInfoIcon('Skills the freelancer is familiar with');
            break;
        case 3: // average client rating
            return getInfoIcon('Average of all ratings by past clients');
            break;
        case 4: //Average project difficulty
            return getInfoIcon('Average of difficulty ratings of previous projects');
            break;
        case 5: //Average time efficiency
            return getInfoIcon('Average of Time efficiency');
            break;
        case 6: //Overall rating
            return getInfoIcon('Average of all the above ratings');
            break;
        case 8: //Projects
            return getInfoIcon('Projects worked on. Hover on each project to know the skills used');
            break;
        default:
            return '';
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
        tr.append('<th class="col-md-2">' + columnName + ' ' +getInfo(i)+'</th>');
        for(var j=0;j<num;j++){
            var stars = '';
            var value = putValue(ids[j], i);
            if(i>2 && i<7 && parseFloat(value)>0.00000000001){
                stars = getStars(parseFloat(value));
            }
            tr.append('<td class="col-md-2 text-center">'+ value + ' ' + stars +'</td>');
        }
        for(var j=num;j<5;j++){
            tr.append('<td class="col-md-2"></td>');
        }
        tr.appendTo(tbody);
    }
}

comparePeople();

$('[data-toggle="tooltip"]').tooltip();
