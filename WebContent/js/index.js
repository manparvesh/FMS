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
        tr.append('<td>' + DB.choice(emp.sex) + '</td>'); // rating
        tr.append('<td>' + emp.birthday + '</td>'); //hours
        tr.append('<td>' + emp.tel + '</td>'); // experienced in
        tr.append('<td>' + emp.tel + '</td>'); // Available for hire?
        tr.append('<td>' + emp.tel + '</td>'); // hire button
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
    if(compareNumber > 0){
        showComparisonMenuAtTheTop();
    }else{
        hideComparisonMenu();
    }
    setBackgroundColorOfSelectedIDsForComparison();
    displayUsersInComparisonBar();
    updateCompareURL();
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

// --------------------------------- set wage function ---------------------------------
var wage = 0;
function setWage(){
    $( function() {
        $( "#setWageDialog" ).dialog({
            closeOnEscape: true,
            open: function(event, ui) {
                $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
            }
        });
        $( "#wageSpinner" ).spinner();
    } );
    document.getElementById('setWageDialog').style.display = 'block';
}

$('#doneWage').on('click', function(){
    var spinner = $( "#wageSpinner" ).spinner();
    wage = spinner.spinner( "value" );
    $( "#setWageDialog" ).dialog('close');
    //alert(wage);
});


// starting and ending comment template:
// ---------------------------------  ---------------------------------
// sample label with count:
// <h4><span class="label label-primary">Primary <span class="badge">4</span></span></h4>
