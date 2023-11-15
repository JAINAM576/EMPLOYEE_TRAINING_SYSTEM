//check cookie
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
        if (data==1) {
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

$.get(`/emp-training-req/${userdept}/${deptname}`, (data, status) => {


    $('#training-req-table').DataTable({

        data: data,
        bLengthChange: false,
        columns: [
            { data: 'req_id', title: 'Req' },
            { data: 'emp_id', title: 'Emp_Id' },
            { data: 'emp_name', title: 'Name' },
            { data: 'emp_training_subject', title: 'Subject' },
            { data: 'emp_training', title: 'Training' },
            { data: 'emp_start_date', title: 'Start' },
            { data: 'emp_ending_date', title: 'end' },
            
            {
                data: 'req_id', render: (data, type, row, meta) => {
                    return `<button class='btn btn-danger btnDelete' onclick="reject(` + data + `)">reject</button><button class='btnAccept btn btn-primary' onclick="accept(` + data + `)">accept</button>`
                }, title: 'Accept/Reject'
            }
        ]
    });


});
$.get(`/all/emp-training/${userdept}`, (data, status) => {


    $('#all-employee-table').DataTable({
        data: data,
        bLengthChange: false,
        columns: [
            { data: 'emp_id', title: 'Id' },
            { data: 'emp_training', title: 'Training Name' },
            { data: 'emp_start_date', title: 'Start' },
            { data: 'emp_ending_date', title: 'end' }
        ]
    });


});
$.get(`/all/emp-exam/${userdept}`, (data, status) => {


    $('#all-marks-table').DataTable({
        data: data,
        bLengthChange: false,
        columns: [
            { data: 'emp_id', title: 'Id' },
            { data: 'emp_training_subject', title: 'Subject' },
            { data: 'emp_training', title: 'Training' },
            { data: 'emp_marks', title: 'Marks' },
            { data: 'date', title: 'Date' }
        ]
    });


});

function reject(req_id) {

    console.log("reject:" + req_id);
    $.get(`/reject/${req_id}`, (data, status) => {




    });



}
function accept(req_id) {
    console.log("accept:" + req_id);
    $.get(`/accept/${req_id}`, (data, status) => {




    });
}
$(document).ready(function () {
    $("#training-req-table").on('click', '.btnDelete', function () {
        $(this).closest('tr').remove();
        console.log($(this));
    });
});
$(document).ready(function () {
    $("#training-req-table").on('click', '.btnAccept', function () {
        $(this).closest('tr').remove();
        console.log($(this));
    });
});