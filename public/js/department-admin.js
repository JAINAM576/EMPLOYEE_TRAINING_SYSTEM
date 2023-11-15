//operator req table
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
const userdept=getCookie("userdept");
const roledept=getCookie("roledept");
const reqBody = {
    userdept: getCookie("userdept").length,
    roledept: getCookie("roledept")
};
//check profile
$.ajax({
    type: 'post',
    url: '/department/test',
    data: JSON.stringify(reqBody),
    contentType: "application/json; charset=utf-8",
    traditional: true,
    success: function (data) {
        if (data==2) {
            alert("welcome " + getCookie("userdept"))
        }
        else{
            window.location.assign("/department/login")
        }
    },
    error: function (xhr, ajaxOptions, thrownError) {
        window.location.assign("/department/login")
    }
});
//set dept-name:
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

$.get(`/dept-name/${userdept}`, (data, status) => {
    setCookie("deptname",data,1)
});
//deptname
const deptname=getCookie("deptname");
$.get(`/dept-req/${deptname}`, (data, status) => {


    $('#dept-req-table').DataTable({

        data: data,
        bLengthChange: false,
        columns: [
            { data: 'dept_req_id', title: 'Req Id' },
            { data: 'dept_name', title: 'Dept Name' },
            { data: 'dept_location', title: 'Location' },
            { data: 'dept_contact', title: 'Contact' },
            { data: 'dept_req_date', title: 'Req Date' },
            {
                data: 'dept_req_id', render: (data, type, row, meta) => {
                    return `<button class='btn btn-danger btnDelete' onclick="reject(` + data + `)">reject</button><button class='btnAccept btn btn-primary' onclick="accept(` + data + `)">accept</button>`
                }, title: 'Accept/Reject'
            }
        ]
    });


});
//remove row in table when accepted or rejected
$(document).ready(function () {
    $("#dept-req-table").on('click', '.btnDelete', function () {
        $(this).closest('tr').remove();
        console.log($(this));
    });
});
$(document).ready(function () {
    $("#dept-req-table").on('click', '.btnAccept', function () {
        $(this).closest('tr').remove();
        console.log($(this));
    });
});
//make changes in daatabase
function reject(dept_req_id) {

    console.log("reject:" + dept_req_id);
    $.get(`/dept/reject/${dept_req_id}`, (data, status) => {

    });
}
function accept(dept_req_id) {
    console.log("accept:" + dept_req_id);
    $.get(`/dept/accept/${dept_req_id}`, (data, status) => {
    });
}
//department
$.get(`/department/${deptname}`, (data, status) => {
    $('#current-operator').DataTable({
        data: data,
        bLengthChange: false,
        columns: [
            { data: 'dept_emp_id', title: 'Operator' },
            { data: 'dept_name', title: 'Dept. Name' },
            { data: 'dept_location', title: 'Location' },
            { data: 'dept_contact', title: 'Contact' }
        ]
    });
});

//remove department
function remove_dept() {
    const dept_emp_id = $("#dept_emp_id").val();
    $.get(`/remove-dept/${dept_emp_id}`, (data, status) => {
        if(data==1){
            alert(dept_emp_id+' deleted');
        }
        else if(data==0){
            alert(dept_emp_id+' not exists');
        }
        else if(data==2){
            alert('server error');
        }
    });
}
//add department
$(document).ready(function () {
    $("#btn-add-dept").click(function () {
        const dept_location = $("#dept_location").val();
        const dept_contact = $("#dept_contact").val();
        const dept_password = $("#dept_password").val();
        const dept_email = $("#dept_email").val();
        const reqBody = {
            dept_location:dept_location,
            dept_contact: dept_contact,
            dept_password: dept_password,
            dept_email: dept_email
        };
        console.log(reqBody);
        $.ajax({
            type: 'post',
            url: `/dept-add/${deptname}`,
            data: JSON.stringify(reqBody),
            contentType: "application/json; charset=utf-8",
            traditional: true,
            success: function (data) {
                alert("added successfully")
            }
        });


    });
});