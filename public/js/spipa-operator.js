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
const userspipa=getCookie("userspipa");
const rolespipa=getCookie("rolespipa");
const reqBody = {
    userspipa: getCookie("userspipa").length,
    rolespipa: getCookie("rolespipa")
};
//check profile
$.ajax({
    type: 'post',
    url: '/spipa/test',
    data: JSON.stringify(reqBody),
    contentType: "application/json; charset=utf-8",
    traditional: true,
    success: function (data) {
        if (data==1) {
            alert("welcome " + getCookie("userspipa"))
        }
        else{
            window.location.assign("/spipa/login")
        }
    },
    error: function (xhr, ajaxOptions, thrownError) {
        window.location.assign("/spipa/login")
    }
});
//set dept-name:
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

$.get(`/spipa-name/${userspipa}`, (data, status) => {
    setCookie("spipaname",data,1)
});

//spipaname
const spipaname=getCookie("spipaname");

$.get(`/spipa-emptrain-req/${spipaname}`, (data, status) => {


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
function reject(req_id) {
    console.log("reject:" + req_id);
    $.get(`/emp-reject/${req_id}`, (data, status) => {




    });
}
function accept(req_id) {
    console.log("accept:" + req_id);
    $.get(`/spipa-accept/${req_id}`, (data, status) => {




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