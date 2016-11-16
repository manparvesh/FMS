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
        totalMoneyEarned += (tempWage * project.hours_worked);
        totalHours += project.hours_worked;
        if(i){
            tempWage *= ((tempRating - 2.5)/5 + 1);
        }
        
        tr.append('<td class="col-md-8 text-center">'+ getProjectTags(project.id) + '</td>'); //rating
        
        
        tr.appendTo(tbody);
    }
    
    showChart(id);
    
    $('#hours').text(totalHours);
    $('#wage').text(roundOff(tempWage));
    $('#totalMoney').text(roundOff(totalMoneyEarned));
    
    if(totalHours == 0){
        $('#projectsTable').hide();
    }
    
    if(emp.hire){
        $('#hire').append('Yes <a href="mailto:' + emp.email + '?subject=New%20Opportunity!" class="btn btn-success pull-right" target="_blank"><span class="glyphicon glyphicon-briefcase"></span> Hire</a>');
    }else{
        $('#hire').append('No');
    }
    
    // display totalMoneyEarned also
}

showRating();