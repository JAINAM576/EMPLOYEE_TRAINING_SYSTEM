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
const user=getCookie("user");
const pass=getCookie("pass");

const reqBody = {
    user: getCookie("user").length,
};


//check profile
$.ajax({
    type: 'post',
    url: '/employee/test',
    data: JSON.stringify(reqBody),
    contentType: "application/json; charset=utf-8",
    traditional: true,
    success: function (data) {
        if (data) {
           
        }
    },
    error: function (xhr, ajaxOptions, thrownError) {
        window.location.assign("/employee/login")
    }
});

//emp training table
$.get(`./emp-training/${user}`, (data, status) => {


    $('#training-table').DataTable({
        data: data,
        bLengthChange: false,
        columns: [
            { data: 'emp_id', title: 'Id' },
            { data: 'emp_training', title: 'Training Name' },
            { data: 'emp_training_subject', title: 'Subject Name' },
            { data: 'emp_start_date', title: 'Start' },
            { data: 'emp_ending_date', title: 'end' }
        ]
    });


});
$.get(`./emp-exam/${user}`, (data, status) => {


    $('#marks-table').DataTable({
        data: data,
        bLengthChange: false,
        columns: [
            { data: 'emp_id', title: 'Employee_id'},
            { data: 'emp_subject', title: 'Subject' },
            { data: 'emp_training', title: 'Training' },
            { data: 'marks', title: 'Marks' },
            { data: 'out_of', title: 'OUT_OF' },
        ]
    });


});

$.get(`/employee/status-1/${user}`, (data, status)=>{
    if(data){
        $("#status").html("->Status");$("#status-heading").html(`<tr>
        <th>Req Id</th>
        <th>Training</th>
        <th>Subject</th>
        <th>Req. With</th>
        <th>Reject</th>
      </tr>`);
        for (let x = 0; x < data.length; x++) {
            $('#status-table').append(
                `<tr><td>`+data[x].req_id+`</td><td>`+data[x].emp_training+`</td><td>`+data[x].emp_training_subject+`</td><td>Department</td></td><td><button class='btn btn-danger btnDelete' onclick="reject(` + data[x].req_id + `)">Delete Req</button></td></tr>`
            );
        }
    }   
});
$.get(`/employee/status-2/${user}`, (data, status)=>{
    if(data){
        $("#status").html("->Status");
        $("#status-heading").html(`<tr>
        <th>Req Id</th>
        <th>Training</th>
        <th>Subject</th>
        <th>Req. With</th>
        <th>Reject</th>
      </tr>`);
        for (let x = 0; x < data.length; x++) {
            $('#status-table').append(
                `<tr><td>`+data[x].req_id+`</td><td>`+data[x].emp_training+`</td><td>`+data[x].emp_training_subject+`</td><td>Spipa</td></td><td><button class='btn btn-danger btnDelete' onclick="reject2(` + data[x].req_id + `)">Delete Req</button></td></tr>`
         );
        }
    }   
});
function reject(req_id) { 
    $.get(`/status/reject/${req_id}/${user}`, (data, status) => {
        
    });
}
function reject2(req_id) { 
    $.get(`/status/reject2/${req_id}/${user}`, (data, status) => {
        
    });
}
$(document).ready(function () {
    $("#status-table").on('click', '.btnDelete', function () {
        $(this).closest('tr').remove();
        console.log($(this));
    });
});

$.get(`/employee/${user}`, (data, status) => {
    if (data) {
      var name = data[0].emp_name;
      $(".user-title").html(" Welcome : " + name);
    }
  });
  
  $.get(`/employee/training_count/${user}`, (data, status) => {
    if (data) {
      $(".training_count").html(data[0].training_count);
    }
  });
  
  $.get(`/employee/exam_count/${user}`, (data, status) => {
      if (data) {
        $(".exam_count").html(data[0].exam_count);
      }
    });
    
    $.get(`/employee/applied_count/${user}`, (data, status) => {
      if (data) {
        $(".applied_count").html(data[0].applied_count);
      }
    });