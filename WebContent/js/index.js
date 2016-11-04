// read data from database
var q;
var emps;
if (q) {
	emps = alasql('SELECT * FROM emp WHERE number LIKE ?', [ '%' + q + '%' ]);
} else {
	emps = alasql('SELECT * FROM emp', []);
    // create employee list
    var tbody = $('#tbody-emps');
    tbody.empty();
    for (var i = 0; i < emps.length; i++) {
        var emp = emps[i];
        var tr = $('<tr></tr>');
        tr.append('<td><img height=40 class="img-circle" src="img/' + emp.id + '.jpg"></td>');
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
    emps = alasql('SELECT * FROM emp WHERE name LIKE ?', [ '%' + q + '%' ]);
    // create employee list
    var tbody = $('#tbody-emps');
    tbody.empty();
    for (var i = 0; i < emps.length; i++) {
        var emp = emps[i];
        var tr = $('<tr></tr>');
        tr.append('<td><img height=40 class="img-circle" src="img/' + emp.id + '.jpg"></td>');
        tr.append('<td><a href="emp.html?id=' + emp.id + '">' + emp.number + '</a></td>');
        tr.append('<td>' + emp.name + '</td>');
        tr.append('<td>' + DB.choice(emp.sex) + '</td>');
        tr.append('<td>' + emp.birthday + '</td>');
        tr.append('<td>' + emp.tel + '</td>');
        tr.appendTo(tbody);
    }
});


