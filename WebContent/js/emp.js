// read personal info
var id = parseInt($.url().param('id'));
var emp = alasql('SELECT * FROM emp WHERE id=?', [ id ])[0];
$('#number').text(emp.number);
$('#name').text(emp.name);
$('#sex').text(DB.choice(emp.sex));
$('#birthday').text(emp.birthday);
$('#tel').text(emp.tel);
$('#email').text(emp.email);
$('#ctct_name').text(emp.ctct_name);
$('#ctct_addr').text(emp.ctct_addr);
$('#ctct_tel').text(emp.ctct_tel);
$('#pspt_no').text(emp.pspt_no);
$('#pspt_date').text(emp.pspt_date);
$('#pspt_name').text(emp.pspt_name);
$('#rental').text(DB.choice(emp.rental));

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

function getStars(r){
    return '<div class="rating-container rating-xs rating-animate" style="cursor:pointer;"><div class="rating"><span class="empty-stars"><span class="star"><i class="glyphicon glyphicon-star-empty"></i></span><span class="star"><i class="glyphicon glyphicon-star-empty"></i></span><span class="star"><i class="glyphicon glyphicon-star-empty"></i></span><span class="star"><i class="glyphicon glyphicon-star-empty"></i></span><span class="star"><i class="glyphicon glyphicon-star-empty"></i></span></span><span class="filled-stars" style="width: '+ (r*20) +'%;"><span class="star"><i class="glyphicon glyphicon-star"></i></span><span class="star"><i class="glyphicon glyphicon-star"></i></span><span class="star"><i class="glyphicon glyphicon-star"></i></span><span class="star"><i class="glyphicon glyphicon-star"></i></span><span class="star"><i class="glyphicon glyphicon-star"></i></span></span></div><input id="rating-input" type="number" class="hide"></div>';
}


// set image and name
$('#img-emp').attr('src', 'img/ (' + emp.id + ').jpg');
$('#div-name_kanji').text(emp.name);
$('#div-number').text(emp.number);
$('#nav-emp').text(emp.name);
$('#form-emp').attr('href', 'emp-form.html?id=' + id);

// read address info
var addrs = alasql('SELECT * FROM addr WHERE emp=?', [ id ]);
for (var i = 0; i < addrs.length; i++) {
	var addr = addrs[i];
	var tr = $('<tr>').appendTo('#tbody-addr');
	tr.append('<td>' + addr.zip + '</td>');
	tr.append('<td>' + addr.state + '</td>');
	tr.append('<td>' + addr.city + '</td>');
	tr.append('<td>' + addr.street + '</td>');
	tr.append('<td>' + addr.bldg + '</td>');
	tr.append('<td>' + DB.choice(addr.house) + '</td>');
	var td = $('<td class="text-right">').appendTo(tr);
	$('<a href="addr-form.html?id=' + addr.id + '" class="btn btn-xs btn-primary">').html(
			'<span class="glyphicon glyphicon-pencil"></span> Edit').appendTo(td);
	$('<span> </span>').appendTo(td);
	$('<a class="btn btn-xs btn-danger">').html('<span class="glyphicon glyphicon-remove"></span> Delete').appendTo(td);
}
$('#ins-addr').attr('href', 'addr-form.html?emp=' + id);

// read family info
var families = alasql('SELECT * FROM family WHERE emp=?', [ id ]);
for (var i = 0; i < families.length; i++) {
	var family = families[i];
	var tr = $('<tr>').appendTo('#tbody-family');
	tr.append('<td>' + family.name + '</td>');
	tr.append('<td>' + DB.choice(family.sex) + '</td>');
	tr.append('<td>' + family.birthday + '</td>');
	tr.append('<td>' + family.relation + '</td>');
	tr.append('<td>' + DB.choice(family.cohabit) + '</td>');
	tr.append('<td>' + DB.choice(family.care) + '</td>');
	var td = $('<td class="text-right">').appendTo(tr);
	$('<a href="family-form.html?id=' + family.id + '" class="btn btn-xs btn-primary">').html(
			'<span class="glyphicon glyphicon-pencil"></span> Edit').appendTo(td);
	$('<span> </span>').appendTo(td);
	$('<a class="btn btn-xs btn-danger">').html('<span class="glyphicon glyphicon-remove"></span> Delete').appendTo(td);
}
$('#ins-family').attr('href', 'family-form.html?emp=' + id);

// read academic history
var edus = alasql('SELECT * FROM edu WHERE emp=?', [ id ]);
for (var i = 0; i < edus.length; i++) {
	var edu = edus[i];
	var tr = $('<tr>').appendTo('#tbody-edu');
	tr.append('<td>' + edu.school + '</td>');
	tr.append('<td>' + edu.major + '</td>');
	tr.append('<td>' + edu.grad + '</td>');
	var td = $('<td class="text-right">').appendTo(tr);
	$('<a href="edu-form.html?id=' + edu.id + '" class="btn btn-xs btn-primary">').html(
			'<span class="glyphicon glyphicon-pencil"></span> Edit').appendTo(td);
	$('<span> </span>').appendTo(td);
	$('<a class="btn btn-xs btn-danger">').html('<span class="glyphicon glyphicon-remove"></span> Delete').appendTo(td);
}
$('#ins-edu').attr('href', 'edu-form.html?emp=' + id);

// delete employee
function destroy() {
	if (window.confirm('Are you sure to delete employee?')) {
		alasql('DELETE FROM emp WHERE id=?', [ id ]);
		window.location.assign('index.html');
	}
}

function getProjectTags(project_id){
    var ret = '';
    var tTags = alasql('SELECT * FROM tags WHERE project_id=?', [ project_id ]);
    for(var i=0;i<tTags.length;i++){
        var tTag = tTags[i];
        ret += '<span class="label label-info">' + tTag.tag + '</span> ';
    }
    return ret;
}

var a = 1, b = 1, c = 1;

function roundOff(n){
    n = parseFloat(n);
    return (Math.round((n*Math.pow(10,2)).toFixed(1))/Math.pow(10,2)).toFixed(2);;
}

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
        if(tTime > 5.0){
            tTime = 5.0;
        }
        
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


function showRating(){
    var tbody = $('#tbody-projects');
    tbody.empty();
    projects = alasql('SELECT * FROM projects WHERE emp=?', [ id ]);
    var tempWage = 10;
    var totalMoneyEarned = 0;
    var totalHours = 0;
    var totalRating = 0;
    for (var i = 0; i < projects.length; i++) {
        var project = projects[i];
        var tr = $('<tr class="row"></tr>');
        tr.append('<td class="col-md-1">'+ (i+1) + '</td>'); //no
        tr.append('<td class="col-md-2">'+ project.name + '</td>'); //name
        
        //overall rating for this project
        var tempX = project.hours_needed / project.hours_worked;
        if(tempX > 1.0){
            tempX = 1.0;
        }
        var tempRating = (a * project.client_rating + b *  project.difficulty + c * (tempX)*10)/(2*(a+b+c));
        tr.append('<td class="col-md-1 text-center">'+ roundOff(tempRating) + ' ' + getStars(roundOff(tempRating)) + '</td>'); //rating
        totalRating += tempRating;
        // hourly wages for this project
        //tr.append('<td>'+ tempWage + '</td>');
        
        // total money earned from this project
        //tr.append('<td>'+ (tempWage * project.hours_worked) + '</td>');
        totalMoneyEarned += (tempWage * project.hours_worked);
        totalHours += project.hours_worked;
        if(i){
            tempWage *= ((tempRating - 2.5)/5 + 1);
        }
        
        tr.append('<td class="col-md-7 text-center">'+ getProjectTags(project.id) + '</td>'); //rating

        tr.append('<td class="col-md-1"><a class="btn btn-danger pull-right btn-xs" onclick="removeProject(' + project.id +')"><span class="glyphicon glyphicon-remove"></span> Remove</a></td>'); //rremove
        
        
        tr.appendTo(tbody);
    }
    
    showChart(id);
    
    totalRating /= projects.length;
    
    $('#rating').empty();
    if(totalHours){
        $('#rating').append(roundOff(totalRating) + ' ' +getStars(totalRating));
    }else{
        $('#rating').append(0);
    }
    
    $('#hours').text(totalHours);
    $('#wage').text(roundOff(tempWage));
    $('#totalMoney').text(roundOff(totalMoneyEarned));
    
    if(totalHours == 0){
        $('#projectsTable').hide();
    }
    
    if(emp.hire){
        $('#hire').empty();
        $('#hire').append('Yes <a href="mailto:' + emp.email + '?subject=New%20Opportunity!" class="btn btn-success pull-right" target="_blank"><span class="glyphicon glyphicon-briefcase"></span> Hire</a>');
    }else{
        $('#hire').empty();
        $('#hire').append('No');
    }
    
    // display totalMoneyEarned also
}

showRating();
toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": true,
  "progressBar": false,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "100",
  "hideDuration": "1000",
  "timeOut": "3000",
  "extendedTimeOut": "100",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
};

function disableAddButton(){
    $( "#doneAddProject" ).prop( "disabled", true );
}

disableAddButton();

function enableAddButton(){
    $( "#doneAddProject" ).prop( "disabled", false );
}

function allOK(){
    if($('#newProjName').val() && (parseFloat($('#newProjClient').val())<=10) && (parseFloat($('#newProjDifficulty').val())<=10) && (parseFloat($('#newProjHoursNeeded').val())) && (parseFloat($('#newProjHoursWorked').val())) ){
        return true;
    }
    
    return false;
}

$('#newProjName').on('input', function(){
    if(allOK()){
        enableAddButton();
    }else{
        disableAddButton();
        //toastr["warning"]("Project name cannot be empty", "Warning");
    }
});

$('#newProjClient').on('input', function(){
    if(allOK()){
        enableAddButton();
    }else{
        disableAddButton();
        //toastr["warning"]("Project name cannot be empty", "Warning");
    }
});

$('#newProjDifficulty').on('input', function(){
    if(allOK()){
        enableAddButton();
    }else{
        disableAddButton();
        //toastr["warning"]("Project name cannot be empty", "Warning");
    }
});

$('#newProjHoursNeeded').on('input', function(){
    if(allOK()){
        enableAddButton();
    }else{
        disableAddButton();
        //toastr["warning"]("Project name cannot be empty", "Warning");
    }
});

$('#newProjHoursWorked').on('input', function(){
    if(allOK()){
        enableAddButton();
    }else{
        disableAddButton();
        //toastr["warning"]("Project name cannot be empty", "Warning");
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

function setAllTagsFalse(){
    for(var i=0;i<13;i++){
        //alert(skillFilter[getTagForCode(i)]);
        skillFilter[getTagForCode(i)] = false;
    }
}

function insertTag(proj_id, tag){
    var tag_id = alasql('SELECT MAX(id) + 1 as id FROM tags')[0].id;
    var tTag = [];
    tTag.push(tag_id);
    tTag.push(proj_id);
    tTag.push(tag);
    
    alasql(
        'INSERT INTO tags(\
        id, \
        project_id, \
        tag) \
        VALUES(?,?,?);',
        tTag);
    
    var tempTag = alasql('SELECT * FROM tags WHERE id=?', [tag_id])[0];
    
    //console.log(tempTag.id + ' ' + tempTag.project_id + ' ' + tempTag.tag);
}

function insertTags(proj_id){
    for(vari=0;i<13;i++){
        if(skillFilter[getTagForCode(i)]){
            insertTag(proj_id, getTagForCode(i));
        }
    }
}

$('#doneAddProject').click(function(){
    var newProjName = $('#newProjName').val();
    var newProjClient = $('#newProjClient').val();
    var newProjDifficulty = $('#newProjDifficulty').val();
    var newProjHoursNeeded = $('#newProjHoursNeeded').val();
    var newProjHoursWorked = $('#newProjHoursWorked').val();
    //if()
    var proj_id = alasql('SELECT MAX(id) + 1 as id FROM projects')[0].id;
    
    var proj = [];
    proj.push(proj_id);
    proj.push(id);
    proj.push(newProjName);
    proj.push(parseInt(newProjDifficulty));
    proj.push(parseInt(newProjHoursWorked));
    proj.push(parseInt(newProjHoursNeeded));
    proj.push(parseInt(newProjClient));
    proj.push('1990-01-01');
    proj.push(0);
    
    //alert(proj);
    
    alasql(
        'INSERT INTO projects(\
        id, \
        emp, \
        name, \
        difficulty, \
        hours_worked, \
        hours_needed, \
        client_rating, \
        date_of_completion, \
        money_earned) \
        VALUES(?,?,?,?,?,?,?,?,?);',
        proj);
    
    insertTags(proj_id);
    
    toastr["success"]("Project added", "Success");
    showRating();
    
    var tempProj = alasql('SELECT * FROM projects WHERE id=?', [proj_id])[0];
    
    //alert(tempProj.id + ' ' + tempProj.emp + ' ' + tempProj.hours_worked + ' ' + tempProj.difficulty + ' ' + tempProj.client_rating);
});

function removeProject(proj_id){
    //alert(proj_id);
    alasql('DELETE FROM projects WHERE id=?', [ proj_id ]);
    showRating();
}

function cleanAddProjectForm(){
    disableAddButton();
    
    $('#newProjName').val('');
    $('#newProjClient').val('');
    $('#newProjDifficulty').val('');
    $('#newProjHoursNeeded').val('');
    $('#newProjHoursWorked').val('');
    
    //setAllTagsFalse();
//    $("#skill-filter-cpp").prop('checked', false);
//    $("#skill-filter-java").prop('checked', false);
//    $("#skill-filter-js").prop('checked', false);
//    $("#skill-filter-html").prop('checked', false);
//    $("#skill-filter-cs").prop('checked', false);
//    $("#skill-filter-css").prop('checked', false);
//    $("#skill-filter-php").prop('checked', false);
//    $("#skill-filter-py").prop('checked', false);
//    $("#skill-filter-scala").prop('checked', false);
//    $("#skill-filter-rb").prop('checked', false);
//    $("#skill-filter-android").prop('checked', false);
//    $("#skill-filter-windows").prop('checked', false);
//    $("#skill-filter-linux").prop('checked', false);
}

$('[data-toggle="tooltip"]').tooltip();