// read data from database
var q;
var emps;

var compareIDs = [];
var compareNumber = 0;

var colors = ['#ffb3ff', '#b3ecff', '#b3ffb3', '#fad581', '#ff9a9a'];

if (q) {
	emps = alasql('SELECT * FROM emp WHERE number LIKE ?', [ '%' + q + '%' ]);
} else {
	emps = alasql('SELECT * FROM emp', []);
    // create employee list
    var tbody = $('#tbody-emps');
    tbody.empty();
    for (var i = 0; i < emps.length; i++) {
        var emp = emps[i];
        var tr = $('<tr id="row-' + emp.id + '"></tr>');
        tr.append('<td><input type="checkbox" name="checkbox-' + emp.id + '" id="checkbox-' + emp.id + '" onclick="comparisonProcedure(' + emp.id + ')"></td>');
        tr.append('<td><img height=40 class="img-circle" src="img/ (' + emp.id + ').jpg"></td>');
        tr.append('<td><a href="emp.html?id=' + emp.id + '">' + emp.number + '</a></td>');
        tr.append('<td>' + emp.name + '</td>');
        tr.append('<td>' + DB.choice(emp.sex) + '</td>');
        tr.append('<td>' + emp.birthday + '</td>');
        tr.append('<td>' + emp.tel + '</td>');
        tr.appendTo(tbody);
    }
}

$('#input-search').on('input',function(){
    q = $(this).val();
    switch($('#search-col').text()){
        case 'Number':
            emps = alasql('SELECT * FROM emp WHERE number LIKE ?', [ '%' + q + '%' ]);
            break;
        case 'Name':
            emps = alasql('SELECT * FROM emp WHERE name LIKE ?', [ '%' + q + '%' ]);
            break;
        case 'Skills':
            emps = alasql('SELECT * FROM emp WHERE name LIKE ?', [ '%' + q + '%' ]);
            break;
    }
    // create employee list
    var tbody = $('#tbody-emps');
    tbody.empty();
    for (var i = 0; i < emps.length; i++) {
        var emp = emps[i];
        var tr = $('<tr id="row-' + emp.id + '"></tr>');
        tr.append('<td><input type="checkbox" name="checkbox-' + emp.id + '" id="checkbox-' + emp.id + '" onclick="comparisonProcedure(' + emp.id + ')"></td>');
        tr.append('<td><img height=40 class="img-circle" src="img/ (' + emp.id + ').jpg"></td>');
        tr.append('<td><a href="emp.html?id=' + emp.id + '">' + emp.number + '</a></td>');
        tr.append('<td>' + emp.name + '</td>');
        tr.append('<td>' + DB.choice(emp.sex) + '</td>');
        tr.append('<td>' + emp.birthday + '</td>');
        tr.append('<td>' + emp.tel + '</td>');
        tr.appendTo(tbody);
    }
    updateCheckBoxes();
});

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
    showComparisonMenuAtTheTop();
    setBackgroundColorOfSelectedIDsForComparison();
}

function showComparisonMenuAtTheTop(){
    //TODO----------------------------------------------------------------------------------------------
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
    document.getElementById('checkbox-'+id).disabled = true;
}

function enableCheckbox(id){
    document.getElementById('checkbox-'+id).disabled = false;
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