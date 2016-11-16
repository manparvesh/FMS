// read data from database
var q;

//tables
var emps;
var projects;
var tags;

var compareIDs = [];
var compareNumber = 0;

var allTags;

var colors = ['#b3ecff', '#b3ecff', '#b3ecff', '#b3ecff', '#b3ecff'];

var skillFilter = {
    'C++' : false,
    'Java' : false,
    'JavaScript' : false,
    'HTML' : false,
    'C#' : false,
    'CSS' : false,
    'PHP' : false,
    'Python' : false,
    'Scala' : false,
    'Ruby' : false,
    'Android' : false,
    'Windows' : false,
    'Linux' : false
};

var hireable = 2;
var wage = 10;
var stars = 0;
var ratingFilter = 3;

var a = 1, b = 1, c = 1;

initTags();

function roundOff(n){
    n = parseFloat(n);
    return (Math.round((n*Math.pow(10,2)).toFixed(1))/Math.pow(10,2)).toFixed(2);;
}

if (q) {
	//emps = alasql('SELECT * FROM emp WHERE number LIKE ?', [ '%' + q + '%' ]);
} else {
    showEntries();
}

$('#input-search').on('input',function(){
    q = $(this).val();
    showEntries($('#search-col').text(), q);
});

// searchColumn, search query, hireable, rating criteria, skills
function showEntries(searchCol, q){
    if(hireable == 2){
        if(searchCol){
            switch(searchCol){
                case 'Number':
                    emps = alasql('SELECT * FROM emp WHERE number LIKE ?', [ '%' + q + '%' ]);
                    break;
                case 'Name':
                    emps = alasql('SELECT * FROM emp WHERE name LIKE ?', [ '%' + q + '%' ]);
                    break;
                case 'Skills':
                    emps = alasql('SELECT * FROM emp WHERE name LIKE ?', [ '%' + q + '%' ]);
                    break;
                case '':
                    emps = alasql('SELECT * FROM emp', []);
                    break;
            }
        }else{
            emps = alasql('SELECT * FROM emp', []);
        }
    }else{
        if(searchCol){
            switch(searchCol){
                case 'Number':
                    emps = alasql('SELECT * FROM emp WHERE number LIKE ? AND hire=?', [ '%' + q + '%', hireable ]);
                    break;
                case 'Name':
                    emps = alasql('SELECT * FROM emp WHERE name LIKE ? AND hire=?', [ '%' + q + '%', hireable ]);
                    break;
                case 'Skills':
                    emps = alasql('SELECT * FROM emp WHERE name LIKE ? AND hire=?', [ '%' + q + '%', hireable ]);
                    break;
                case '':
                    emps = alasql('SELECT * FROM emp WHERE hire=?', [ hireable ]);
                    break;
            }
        }else{
            emps = alasql('SELECT * FROM emp WHERE hire=?', [ hireable ]);
        }
    }
    
    // input values into table
    populateDatabase();

    // update checkboxes and row backgrounds
    updateCheckBoxes();
}

//$('#search-col').text()
$('#cols-num').on('click',function(){
    $('#search-col').text('Number');
});

$('#cols-name').on('click',function(){
    $('#search-col').text('Name');
});

$('#cols-skills').on('click',function(){
    $('#search-col').text('Skills');
});

// ----------------------------- comparison bar functions with UI ans stuff -----------------------------
function comparisonProcedure(id){
    if(compareIDs.includes(id)){
        removeFromCompare(id);
    }else{
        addToCompare(id);
    }
}
function addToCompare(id){
    compareIDs.push(id);
    compareNumber++;
    if(checkIfCompareIsFull()){
        disableOtherCheckboxes();
    }
    //showIDs();
    ui();
}
function removeFromCompare(id){
    if(checkIfCompareIsFull()){
        enableAllCheckBoxes();
    }
    compareIDs.splice(compareIDs.indexOf(id),1);
    compareNumber--;
    $('#row-'+id).css('background-color', 'white');
    ui();
}
function showIDs(){
    alert(compareIDs);
}
function checkIfCompareIsFull(){
    return compareNumber >= 5;
}
function ui(){
    if(compareNumber > 0){
        showComparisonMenuAtTheTop();
    }else{
        hideComparisonMenu();
    }
    setBackgroundColorOfSelectedIDsForComparison();
    displayUsersInComparisonBar();
    updateCompareURL();
    if(compareNumber < 2){
        document.getElementById("button-compare").onclick = function() { return false; };
    }else{
        document.getElementById("button-compare").onclick = function() { return true; };
    }
}
function displayUsersInComparisonBar(){
    var tempEmps = alasql('SELECT * FROM emp', []);
    for(var i=0;i<compareNumber;i++){
        var id = compareIDs[i];
        var name = tempEmps[id - 1].name;
        var number = tempEmps[id - 1].number;
        var image = 'img/%20(' + id + ').jpg';
        
        //set values
        $('#compare-number-'+i).text(number);
        $('#compare-name-'+i).text(name);
        $('#profile-pic-'+i).attr('src', image);
        document.getElementById('close-button-'+i).style.display = 'block';
    }
    if(compareNumber < 5){
        for(var i=compareNumber;i<5;i++){
            $('#compare-number-'+i).text('ID');
            $('#compare-name-'+i).text('Name');
            $('#profile-pic-'+i).attr('src', 'img/demo.jpg');
            document.getElementById('close-button-'+i).style.display = 'none';
        }
    }
}
function showComparisonMenuAtTheTop(){
    document.getElementById('comparison-bar').style.display = 'block';
}
function hideComparisonMenu(){
    document.getElementById('comparison-bar').style.display = 'none';
}
function setBackgroundColorOfSelectedIDsForComparison(){
    for(var i=0;i<compareIDs.length;i++){
        var id = compareIDs[i];
        $('#row-'+id).css('background-color', colors[i]);
    }
}
function disableOtherCheckboxes(){
    for(var i=0;i<emps.length;i++){
        if(!compareIDs.includes(emps[i].id)){
            disableCheckbox(emps[i].id);
        }
    }
}
function enableAllCheckBoxes(){
    for(var i=0;i<emps.length;i++){
        enableCheckbox(emps[i].id);
    }
}
function disableCheckbox(id){
    if(document.getElementById('checkbox-'+id)){
        document.getElementById('checkbox-'+id).disabled = true;
    }
}
function enableCheckbox(id){
    if(document.getElementById('checkbox-'+id)){
        document.getElementById('checkbox-'+id).disabled = false;
    }
}
function updateCheckBoxes(){
    for(var i = 0;i < compareIDs.length;i++){
        var id = compareIDs[i];
        if(isIDThere(id)){
            document.getElementById('checkbox-'+id).checked = true;
        }
    }
    if(checkIfCompareIsFull()){
        disableOtherCheckboxes();
    }
    ui();
}
function isIDThere(id){
    for(var i=0;i<emps.length;i++){
        var emp = emps[i];
        if(emp.id === id){
            return true;
        }
    }
    return false;
}
// ----------------------------- / comparison bar functions with UI ans stuff -----------------------------

// --------------------------------- delete buttons in comparison bar ---------------------------------
$('#close-button-0').on('click', function(){
    var id = compareIDs[0];
    removeFromCompare(id);
    if(isIDThere(id)){
        document.getElementById('checkbox-'+id).checked = false;
    }
});
$('#close-button-1').on('click', function(){
    var id = compareIDs[1];
    removeFromCompare(id);
    if(isIDThere(id)){
        document.getElementById('checkbox-'+id).checked = false;
    }
});
$('#close-button-2').on('click', function(){
    var id = compareIDs[2];
    removeFromCompare(id);
    if(isIDThere(id)){
        document.getElementById('checkbox-'+id).checked = false;
    }
});
$('#close-button-3').on('click', function(){
    var id = compareIDs[3];
    removeFromCompare(id);
    if(isIDThere(id)){
        document.getElementById('checkbox-'+id).checked = false;
    }
});
$('#close-button-4').on('click', function(){
    var id = compareIDs[4];
    removeFromCompare(id);
    if(isIDThere(id)){
        document.getElementById('checkbox-'+id).checked = false;
    }
});
// --------------------------------- / delete buttons in comparison bar ---------------------------------

// --------------------------------- update compare button href url ---------------------------------
function updateCompareURL(){
    var url = 'compare.html?';
    for(var i=0;i<compareNumber;i++){
        url += ('id' + (i+1) + '=');
        url += (compareIDs[i] + '&');
    }
    for(var i=compareNumber;i<5;i++){
        url += ('id' + (i+1) + '=&');
    }
    //alert(url);
    $('#button-compare').attr('href', url);
}
// --------------------------------- / update compare button href url ---------------------------------

// --------------------------------- set wage function ---------------------------------

$( "#wageSpinner" ).spinner();
$( "#wageSpinner" ).spinner().spinner("value", wage);

$('#doneWage').on('click', function(){
    var spinner = $( "#wageSpinner" ).spinner();
    wage = spinner.spinner( "value" );
    //$( "#setWageDialog" ).hide();
    //alert($('#star-rating-test').value);
    //alert(stars);
});
$(':radio').change(
    function(){
        //alert(this.value+" stars");
        stars = this.value;
    }
); 
// --------------------------------- / set wage function ---------------------------------

// --------------------------------- Hire button visibility toggler ---------------------------------
function toggleHireButtonVisibility(id){
    var tempEmps =  alasql('SELECT * FROM emp WHERE id = ?', [ id ]);
    var emp = tempEmps[0];
    
    var x;
    var hire = [];
    if(emp.hire){
        hire.push(0);
        x = 0;
    }else{
        hire.push(1);
        x = 1;
    }
    hire.push(id);
    alasql(
        'UPDATE emp SET \
        hire = ? \
        WHERE id = ?',
        hire);
    if(x){
        $('#hire-button-' + id).css('visibility', 'visible');
    }else{
        $('#hire-button-' + id).css('visibility', 'hidden');
    }
}
// --------------------------------- / Hire button visibility toggler ---------------------------------

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
// --------------------------------- / get code for tag ---------------------------------

// --------------------------------- get tag from code ---------------------------------
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
/*"C++",
			"Java",
			"JavaScript",
			"HTML",
			"C#",
			"CSS",
			"PHP",
			"Python",
			"Scala",
			"Ruby",
			"Android",
			"Windows",
			"Linux"
            */
// --------------------------------- / get tag from code ---------------------------------

// --------------------------------- get tags + count cell  ---------------------------------
function getTagsHTML(id){
    var cell = '<td class="col-md-4">';
    var tagLocalArray = allTags[id - 1];
    for(var i=0;i<tagLocalArray.length;i++){
        if(tagLocalArray[i]){
            cell += ('<button class="btn btn-info btn-xs" type="button" style="margin:1px;">' + getTagForCode(i) + ' <span class="badge">' + tagLocalArray[i] +'</span></button> ');
        }
    }
    cell += '</td>';
    return cell;
}
// --------------------------------- / get tags + count cell  ---------------------------------

// --------------------------------- populate tables based on the database ---------------------------------
function populateDatabase(){
        // set tables 
	//projects = alasql('SELECT id,emp,difficulty,sum(hours_worked) as sum_hours_worked,hours_worked,client_rating,date_of_completion,money_earned FROM projects GROUP BY emp', []);
    //alert(projects[0].sum_hours_worked);
	tags = alasql('SELECT * FROM tags', []);
    
    
    // create employee list
    var tbody = $('#tbody-emps');
    tbody.empty();
    for (var i = 0; i < emps.length; i++) {
        var emp = emps[i];
        var tempTags = allTags[emp.id - 1];
        if(matchesTags(tempTags)){
            var tr = $('<tr id="row-' + emp.id + '" class="row"></tr>');
            tr.append('<td><input type="checkbox" name="checkbox-' + emp.id + '" id="checkbox-' + emp.id + '" onclick="comparisonProcedure(' + emp.id + ')"></td>');
            tr.append('<td><img height=40 class="img-circle" src="img/ (' + emp.id + ').jpg"></td>');
            tr.append('<td class="col-md-1"><a href="emp.html?id=' + emp.id + '">' + emp.number + '</a></td>');
            tr.append('<td class="col-md-2">' + emp.name + '</td>');
            var tempProj = alasql('SELECT id,emp,sum(hours_worked) as sum_hours_worked,hours_worked FROM projects WHERE emp=? GROUP BY emp', [ emp.id ]);
            //console.log(tempProj.length);
            if(tempProj[0].sum_hours_worked){
                tr.append('<td class="col-md-1"><a href="#rating" data-toggle="modal" onclick="showRating(' + emp.id + ')">' + roundOff(calculateRating(emp.id)) + '</a></td>'); // rating
                tr.append('<td class="col-md-1">' + tempProj[0].sum_hours_worked + '</td>'); //hours
                tr.append(getTagsHTML(emp.id)); // experienced in
            }else{
                tr.append('<td class="col-md-1"><a href="#rating" data-toggle="modal" onclick="showRating(' + emp.id + ')">0</a></td>'); // rating
                tr.append('<td class="col-md-1">' + 0 + '</td>'); //hours
                tr.append('<td class="col-md-4">-</td>'); //experienced in
            }

            if(emp.hire){
                tr.append('<td class="col-md-1"><input type="checkbox" id="canhire-' + emp.id + '" onclick="toggleHireButtonVisibility(' + emp.id + ')" checked></td>'); // Available for hire?
                tr.append('<td class="col-md-1"><a href="mailto:' + emp.email + '?subject=New%20Opportunity!" id="hire-button-' + emp.id + '" class="btn btn-success" target="_blank"><span class="glyphicon glyphicon-briefcase"></span> Hire</a></td>'); // hire button
            }else{
                tr.append('<td class="col-md-1"><input type="checkbox" id="canhire-' + emp.id + '" onclick="toggleHireButtonVisibility(' + emp.id + ')"></td>'); // Available for hire?
                tr.append('<td class="col-md-1"><a href="mailto:' + emp.email + '?subject=New%20Opportunity!" id="hire-button-' + emp.id + '" class="btn btn-success" target="_blank" style="visibility:hidden;"><span class="glyphicon glyphicon-briefcase"></span> Hire</a></td>'); // hire button
            }
            tr.appendTo(tbody);
        }
    }
}
// --------------------------------- / populate tables based on the database ---------------------------------

// --------------------------------- init values of project tags etc to be used later quickly ---------------------------------
function initTags(){
    var tempEmps = alasql('SELECT * FROM emp', []);
    
    allTags = [];
    
    for(var i=0;i<tempEmps.length;i++){
        var emp = tempEmps[i];
        var tagCount = [0,0,0,0,0,0,0,0,0,0,0,0,0];
        var projectList = alasql('SELECT * FROM projects WHERE emp=?', [emp.id]);
        
        for(var j=0;j<projectList.length;j++){
            var project = projectList[j];
            var tagList = alasql('SELECT * FROM tags WHERE project_id=?', [ project.id ]);
            for(var k=0;k<tagList.length;k++){
                tagCount[getCodeForTag(tagList[k].tag)]++;
            }
        }
        
        allTags.push(tagCount);
    }
}
// --------------------------------- / init values of project tags etc to be used later quickly ---------------------------------

// --------------------------------- rating caulculator ---------------------------------
function calculateRating(id){
    //var tEmp =  = alasql('SELECT * FROM emp WHERE id=?', [ id ]);
    var tProjects = alasql('SELECT * FROM projects WHERE emp=?', [ id ]);
    var client = 0, difficulty = 0, time = 0;
    for(var i=0;i<tProjects.length;i++){
        var tProject = tProjects[i];
        client += tProject.client_rating;
        difficulty += tProject.difficulty;
        time += (tProject.hours_needed / tProject.hours_worked)*10;
    }
    return ((client*a + difficulty*b + time*c)/(tProjects.length * 2 * (a + b + c)));
}
// --------------------------------- / rating caulculator ---------------------------------

// --------------------------------- table sorting \m/ ---------------------------------
function tableSorter(order, n) {
    var rows = $('#tbody-emps tr').get();

    rows.sort(function (a, b) {

        var A = getVal(a);
        var B = getVal(b);

        if (A < B) {
            return -1 * order;
        }
        if (A > B) {
            return 1 * order;
        }
        return 0;
    });

    function getVal(element) {
        var v = $(element).children('td').eq(n).text().toUpperCase();
        if ($.isNumeric(v)) {
            v = parseFloat(v, 10);
        }
        return v;
    }

    $.each(rows, function (index, row) {
        $('#tbody-emps').append(row);
    });
}
// --------------------------------- / table sorting \m/ ---------------------------------

// --------------------------------- onclick functions to sort \m/ ---------------------------------
var colSort = [1, -1, -1, -1]; //num, name, rating, hours

function displayArrows(){
    $('#num-desc').hide();
    $('#num-asc').hide();
    $('#name-desc').hide();
    $('#name-asc').hide();
    $('#rating-desc').hide();
    $('#rating-asc').hide();
    $('#hours-desc').hide();
    $('#hours-asc').hide();

    $('#num-sort').show();
    $('#name-sort').show();
    $('#rating-sort').show();
    $('#hours-sort').show();
    
    $("#col-num").css('background-color', 'white');
    $("#col-name").css('background-color', 'white');
    $("#col-rating").css('background-color', 'white');
    $("#col-hours").css('background-color', 'white');
}

//in the beginning
displayArrows();
$('#num-sort').hide();
$('#num-asc').show();
$("#col-num").css('background-color', '#98dfff');

$("#col-num").click(function () {
    displayArrows();
    var pos = 0;
    var order = colSort[pos];
    $('#num-sort').hide();
    if (order === -1) {
        $('#num-asc').show();
    } else {
        $('#num-desc').show();
    }
    $("#col-num").css('background-color', '#98dfff');
    colSort[pos] *= -1; // toggle the sorting order
    var n = $(this).prevAll().length;
    tableSorter(colSort[pos], n);
});

$("#col-name").click(function () {
    displayArrows();
    var pos = 1;
    var order = colSort[pos];
    $('#name-sort').hide();
    if (order === -1) {
        $('#name-asc').show();
    } else {
        $('#name-desc').show();
    }
    $("#col-name").css('background-color', '#98dfff');
    colSort[pos] *= -1; // toggle the sorting order
    var n = $(this).prevAll().length;
    tableSorter(colSort[pos], n);
});

$("#col-rating").click(function () {
    displayArrows();
    var pos = 2;
    var order = colSort[pos];
    $('#rating-sort').hide();
    if (order === -1) {
        $('#rating-asc').show();
    } else {
        $('#rating-desc').show();
    }
    $("#col-rating").css('background-color', '#98dfff');
    colSort[pos] *= -1; // toggle the sorting order
    var n = $(this).prevAll().length;
    tableSorter(colSort[pos], n);
});

$("#col-hours").click(function () {
    displayArrows();
    var pos = 3;
    var order = colSort[pos];
    $('#hours-sort').hide();
    if (order === -1) {
        $('#hours-asc').show();
    } else {
        $('#hours-desc').show();
    }
    $("#col-hours").css('background-color', '#98dfff');
    colSort[pos] *= -1; // toggle the sorting order
    var n = $(this).prevAll().length;
    tableSorter(colSort[pos], n);
});
// --------------------------------- / onclick functions to sort \m/ ---------------------------------

/*
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(231,233,237)'
*/

// --------------------------------- chart ---------------------------------
var projectCount = 0;

var config = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: "Overall rating",
            backgroundColor: window.chartColors.red,
            borderColor: window.chartColors.red,
            pointRadius: 5,
            pointHoverRadius: 10,
            data: [
            ],
            fill: false,
        }, {
            label: "Client rating",
            fill: false,
            backgroundColor: window.chartColors.blue,
            borderColor: window.chartColors.blue,
            borderDash: [5, 5],
            data: [
            ],
        }, {
            label: "Difficulty",
            fill: false,
            backgroundColor: window.chartColors.green,
            borderColor: window.chartColors.green,
            borderDash: [5, 5],
            data: [
            ],
        }, {
            label: "Time efficiency",
            fill: false,
            backgroundColor: window.chartColors.orange,
            borderColor: window.chartColors.orange,
            borderDash: [5, 5],
            data: [
            ],
        }]
    },
    options: {
        responsive: true,
        title:{
            display:true,
            text:'Rating history'
        },
        tooltips: {
            mode: 'index',
            intersect: false
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Project serial number'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Rating'
                }
            }]
        }
    }
};

function addDataToChart(projData) {
    if (config.data.datasets.length > 0) {
        projectCount++;
        config.data.labels.push(projectCount);

        for(var i=0;i<4;i++){
            config.data.datasets[i].data.push(projData[i]);
        }

        window.myLine.update();
    }
};

function clearChartData(){
    if (config.data.datasets.length > 0) {
        projectCount = 0;
        var len = config.data.labels.length;
        for(var i=0;i<len;i++){
            config.data.labels.pop();
        }

        len = config.data.datasets[0].data.length;
        
        for(var i=0;i<len;i++){
            config.data.datasets[0].data.pop();
            config.data.datasets[1].data.pop();
            config.data.datasets[2].data.pop();
            config.data.datasets[3].data.pop();
        }

        window.myLine.update();
    }
}

function showChart(id){
    var ctx = document.getElementById("canvas").getContext("2d");
    window.myLine = new Chart(ctx, config);
    var projDataList = alasql('SELECT * FROM projects WHERE emp=?', [ id ]);
    clearChartData();
    for(var i=0;i<projDataList.length;i++){
        var proj = projDataList[i];
        var projData = [];
        
        var tClient = proj.client_rating / 2, tDiff = proj.difficulty / 2, tTimeNeeded = proj.hours_needed, tTimeWorked = proj.hours_worked;
        
        var tTime = (tTimeNeeded / tTimeWorked) * 5;
        
        var overallRating = (tClient * a + tDiff * b + tTime * c) / (a + b + c);
        
        //projData.push((proj.name)); // name of project 
        projData.push(roundOff(overallRating)); // overall 
        projData.push(roundOff(tClient)); // client
        projData.push(roundOff(tDiff)); // diff
        projData.push(roundOff(tTime)); // time
        
        // add this to chart
        addDataToChart(projData);
    }
}
// --------------------------------- / chart  ---------------------------------

// --------------------------------- function to set rating history and stuff in a cool modal ---------------------------------

function getProjectTags(project_id){
    var ret = '';
    var tTags = alasql('SELECT * FROM tags WHERE project_id=?', [ project_id ]);
    for(var i=0;i<tTags.length;i++){
        var tTag = tTags[i];
        ret += '<span class="label label-info">' + tTag.tag + '</span> ';
    }
    return ret;
}

function showRating(id){
    var tbody = $('#tbody-projects');
    tbody.empty();
    projects = alasql('SELECT * FROM projects WHERE emp=?', [ id ]);
    var tempWage = wage;
    var totalMoneyEarned = 0;
    for (var i = 0; i < projects.length; i++) {
        var project = projects[i];
        var tr = $('<tr class="row"></tr>');
        tr.append('<td class="col-md-1">'+ (i+1) + '</td>'); //no
        tr.append('<td class="col-md-2">'+ project.name + '</td>'); //name
        
        //overall rating for this project
        var tempRating = (a * project.client_rating + b *  project.difficulty + c * (project.hours_needed / project.hours_worked)*10)/(2*(a+b+c));
        tr.append('<td class="col-md-1">'+ roundOff(tempRating) + '</td>'); //rating
        
        // hourly wages for this project
        //tr.append('<td>'+ tempWage + '</td>');
        
        // total money earned from this project
        //tr.append('<td>'+ (tempWage * project.hours_worked) + '</td>');
        //totalMoneyEarned += (tempWage * project.hours_worked);
        
        //if(i){
        //    tempWage *= ((tempRating - 2.5)/5 + 1);
        //}
        
        tr.append('<td class="col-md-8 text-center">'+ getProjectTags(project.id) + '</td>'); //rating
        
        
        tr.appendTo(tbody);
    }
    
    /*var cell = '';
    var tagLocalArray = allTags[id - 1];
    for(var i=0;i<tagLocalArray.length;i++){
        if(tagLocalArray[i]){
            cell += ('<button class="btn btn-info btn-xs" type="button" style="margin:1px;">' + getTagForCode(i) + ' <span class="badge">' + tagLocalArray[i] +'</span></button> ');
        }
    }
    
    $('#projectTags').empty();
    $('#projectTags').append(cell);
    */
    showChart(id);
    
    // display totalMoneyEarned also
}
// --------------------------------- / function to set rating history and stuff in a cool modal ---------------------------------

// --------------------------------- checkboxes for filters ---------------------------------

// hireable options
$("#option-no").change(function() {
    if(this.checked) {
        hireable = 0;
    }
});
$("#option-yes").change(function() {
    if(this.checked) {
        hireable = 1;
    }
});
$("#option-both").change(function() {
    if(this.checked) {
        hireable = 2;
    }
});

// type of rating to compute
$("#option-client").change(function() {
    if(this.checked) {
        ratingFilter = 0;
    }
});
$("#option-difficulty").change(function() {
    if(this.checked) {
        ratingFilter = 1;
    }
});
$("#option-time").change(function() {
    if(this.checked) {
        ratingFilter = 2;
    }
});
$("#option-simple").change(function() {
    if(this.checked) {
        ratingFilter = 3;
    }
});

// filters for skill tags

$("#skill-filter-cpp").change(function() {
    if(this.checked) {
        skillFilter['C++'] = true;
    }else{
        skillFilter['C++'] = false;
    }
});
$("#skill-filter-java").change(function() {
    if(this.checked) {
        skillFilter['Java'] = true;
    }else{
        skillFilter['Java'] = false;
    }
});
$("#skill-filter-js").change(function() {
    if(this.checked) {
        skillFilter['JavaScript'] = true;
    }else{
        skillFilter['JavaScript'] = false;
    }
});
$("#skill-filter-html").change(function() {
    if(this.checked) {
        skillFilter['HTML'] = true;
    }else{
        skillFilter['HTML'] = false;
    }
});
$("#skill-filter-cs").change(function() {
    if(this.checked) {
        skillFilter['C#'] = true;
    }else{
        skillFilter['C#'] = false;
    }
});
$("#skill-filter-css").change(function() {
    if(this.checked) {
        skillFilter['CSS'] = true;
    }else{
        skillFilter['CSS'] = false;
    }
});
$("#skill-filter-php").change(function() {
    if(this.checked) {
        skillFilter['PHP'] = true;
    }else{
        skillFilter['PHP'] = false;
    }
});
$("#skill-filter-py").change(function() {
    if(this.checked) {
        skillFilter['Python'] = true;
    }else{
        skillFilter['Python'] = false;
    }
});
$("#skill-filter-scala").change(function() {
    if(this.checked) {
        skillFilter['Scala'] = true;
    }else{
        skillFilter['Scala'] = false;
    }
});
$("#skill-filter-rb").change(function() {
    if(this.checked) {
        skillFilter['Ruby'] = true;
    }else{
        skillFilter['Ruby'] = false;
    }
});
$("#skill-filter-android").change(function() {
    if(this.checked) {
        skillFilter['Android'] = true;
    }else{
        skillFilter['Android'] = false;
    }
});
$("#skill-filter-windows").change(function() {
    if(this.checked) {
        skillFilter['Windows'] = true;
    }else{
        skillFilter['Windows'] = false;
    }
});
$("#skill-filter-linux").change(function() {
    if(this.checked) {
        skillFilter['Linux'] = true;
    }else{
        skillFilter['Linux'] = false;
    }
});

//button to apply filters
$('#doneFilters').click(function(){
    //do everything bruh
    // 1. skills
    
    // 3. rating preference
    switch(ratingFilter){
        case 0:
            a = 2;
            b = 1;
            c = 1;
            break;
        case 1:
            a = 1;
            b = 2;
            c = 1;
            break;
        case 2:
            a = 1;
            b = 1;
            c = 2;
            break;
        case 3:
            a = 2;
            b = 2;
            c = 2;
            break;
    }
    
    // 2. hireable
    if(hireable == 2){
        emps = alasql('SELECT * FROM emp', []);
    }else{
        emps = alasql('SELECT * FROM emp WHERE hire=?', [ hireable ]);
    }
    
    // input values into table
    populateDatabase();
    
    // update checkboxes and row backgrounds
    updateCheckBoxes();
    
    //alert(a + ' ' + b + ' ' + c);
});
// --------------------------------- / checkboxes for filters ---------------------------------

// --------------------------------- check if tags in this cell match with the filters ---------------------------------
function allFalse(){
    var ar = [];
    for(var i=0;i<13;i++){
        //alert(skillFilter[getTagForCode(i)]);
        if(skillFilter[getTagForCode(i)]){
            return false;
        }
    }
    return true;
}

// skillFilter[getTagForCode(i)]
function matchesTags(tempTags){
    if(allFalse()){
        //console.log(allFalse());
        return true;
    }
    for(var i=0;i<13;i++){
        if(skillFilter[getTagForCode(i)]){
            if(tempTags[i] < 1){
                return false;
            }
        }
    }
    return true;
}
// --------------------------------- / check if tags in this cell match with the filters ---------------------------------

// starting and ending comment template:
// ---------------------------------  ---------------------------------
