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
        if(emp.hire){
            tr.append('<td><input type="checkbox" id="canhire-' + emp.id + '" onclick="toggleHireButtonVisibility(' + emp.id + ')" checked></td>'); // Available for hire?
            tr.append('<td><a href="mailto:' + emp.email + '?subject=New%20Opportunity!" id="hire-button-' + emp.id + '" class="btn btn-success" target="_blank"><span class="glyphicon glyphicon-briefcase"></span> Hire</a></td>'); // hire button
        }else{
            tr.append('<td><input type="checkbox" id="canhire-' + emp.id + '" onclick="toggleHireButtonVisibility(' + emp.id + ')"></td>'); // Available for hire?
            tr.append('<td><a href="mailto:' + emp.email + '?subject=New%20Opportunity!" id="hire-button-' + emp.id + '" class="btn btn-success" target="_blank" style="visibility:hidden;"><span class="glyphicon glyphicon-briefcase"></span> Hire</a></td>'); // hire button
        }
        tr.appendTo(tbody);
    }
    updateCheckBoxes();
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
        case '':
            emps = alasql('SELECT * FROM emp', []);
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
        tr.append('<td>' + DB.choice(emp.sex) + '</td>'); // rating
        tr.append('<td>' + emp.birthday + '</td>'); //hours
        tr.append('<td>' + emp.tel + '</td>'); // experienced in
        tr.append('<td><input type="checkbox" id="canhire-' + emp.id + '" onclick=""></td>'); // Available for hire?
        tr.append('<td><a href="mailto:' + emp.email + '?subject=New%20Opportunity!" class="btn btn-success" target="_blank"><span class="glyphicon glyphicon-briefcase"></span> Hire</a></td>'); // hire button
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
var wage = 10;
function setWage(){
    $( function() {
        $( "#setWageDialog" ).dialog({
            closeOnEscape: true,
            open: function(event, ui) {
                $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
            }
        });
        $( "#wageSpinner" ).spinner();
        $( "#wageSpinner" ).spinner().spinner("value", wage);
    } );
    document.getElementById('setWageDialog').style.display = 'block';
}

var stars = 0;

$('#doneWage').on('click', function(){
    var spinner = $( "#wageSpinner" ).spinner();
    wage = spinner.spinner( "value" );
    $( "#setWageDialog" ).dialog('close');
    //alert($('#star-rating-test').value);
    alert(stars);
});

$(':radio').change(
  function(){
    //alert(this.value+" stars");
      stars = this.value;
  }
);

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

// starting and ending comment template:
// ---------------------------------  ---------------------------------
// sample label with count:
// <h4><span class="label label-primary">Primary <span class="badge">4</span></span></h4>
