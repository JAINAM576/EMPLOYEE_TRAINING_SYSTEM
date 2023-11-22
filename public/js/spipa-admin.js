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
        console.log(data)
        if (data==2) {
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
$.get(`/spipa-dept-req`, (data, status) => {


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
                    return `<button class='btn btn-danger btnDelete' onclick="reject_d(` + data + `)">reject</button><button class='btnAccept btn btn-primary' onclick="accept_d(` + data + `)">accept</button>`
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
function reject_d(dept_req_id) {

    console.log("reject:" + dept_req_id);
    $.get(`/dept/reject/${dept_req_id}`, (data, status) => {

    });
}
function accept_d(dept_req_id) {
    console.log("accept:" + dept_req_id);
    $.get(`/dept/accept/${dept_req_id}`, (data, status) => {
    });
}
//spipa operator
$.get(`/spipa-opt-req`, (data, status) => {


    $('#opt-req-table').DataTable({

        data: data,
        bLengthChange: false,
        columns: [
            { data: 'spipa_req_id', title: 'Req Id' },
            { data: 'spipa_name', title: 'Center' },
            { data: 'spipa_location', title: 'Location' },
            { data: 'spipa_contact', title: 'Contact' },
            { data: 'spipa_req_date', title: 'Req Date' },
            {
                data: 'spipa_req_id', render: (data, type, row, meta) => {
                    return `<button class='btn btn-danger btnDelete' onclick="reject(` + data + `)">reject</button><button class='btnAccept btn btn-primary' onclick="accept(` + data + `)">accept</button>`
                }, title: 'Accept/Reject'
            }
        ]
    });


});
//remove row in table when accepted or rejected
$(document).ready(function () {
    $("#opt-req-table").on('click', '.btnDelete', function () {
        $(this).closest('tr').remove();
        console.log($(this));
    });
});
$(document).ready(function () {
    $("#opt-req-table").on('click', '.btnAccept', function () {
        $(this).closest('tr').remove();
        console.log($(this));
    });
});
//make changes in daatabase
function reject(spipa_req_id) {

    console.log("reject:" + spipa_req_id);
    $.get(`/spipa/reject/${spipa_req_id}`, (data, status) => {

    });
}
function accept(spipa_req_id) {
    console.log("accept:" + spipa_req_id);
    $.get(`/spipa/accept/${spipa_req_id}`, (data, status) => {
    });
}

//add department
$(document).ready(function () {
    $("#btn-add-dept").click(function () {
        const dept_name = $("#dept_name").val();
        const reqBody = {
            dept_name:dept_name
        };
        console.log(reqBody);
        $.ajax({
            type: 'post',
            url: `/add-dept-name`,
            data: JSON.stringify(reqBody),
            contentType: "application/json; charset=utf-8",
            traditional: true,
            success: function (data) {
                if(data==1){
                    alert("added successfully")
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("already exsist")
            }
            
        });


    });
});
//add training
$(document).ready(function () {
    $("#btn-add-training").click(function () {


        const training = $("#training").val();
        const training_subject = $("#training_subject").val();
        const start_date = $("#start_date").val();
        const end_date = $("#end_date").val();
        const cordinator_id = $("#sel1").val();
        const training_cap = $("#training_cap").val();
console.log(training,typeof(training)," yra")
if(training.length==0 || training_subject.length==0 || start_date.length==0 || end_date.length==0 || cordinator_id.length==0 || training_cap.length==0  ){
    alert("FILL ALL THE DETAILS");
    return ;
}
        const reqBody = {
            training:training,
            training_subject:training_subject,
            start_date:start_date,
            end_date:end_date
        };
        const reqBody1={
            training:training,
            cordinator_id:cordinator_id,
            training_cap:training_cap
        }
        console.log(reqBody);
        $.ajax({
            type: 'post',
            url: `/add-training/${spipaname}`,
            data: JSON.stringify(reqBody),
            contentType: "application/json; charset=utf-8",
            traditional: true,
            success: function (data) {
                alert("added successfully")
            }
        });
        $.ajax({
            type: 'post',
            url: `/add-cordinator/relation`,
            data: JSON.stringify(reqBody1),
            contentType: "application/json; charset=utf-8",
            traditional: true,
            success: function (data) {
            console.log("sucess ")
            }
        });
        $.ajax({
            type: 'post',
            url: `/add-cordinator/send-mail`,
            data: JSON.stringify(reqBody1),
            contentType: "application/json; charset=utf-8",
            traditional: true,
            success: function (data) {
               console.log("sucess")
            }
        });


    });
});


// $.post("/employee/cordinators",[spipaname],(data,error)=>{

// console.log(data);

// }).DONE;
