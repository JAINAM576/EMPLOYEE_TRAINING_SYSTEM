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
            alert("welcome "+ getCookie("user"))
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
            { data: 'emp_subject', title: 'Subject' },
            { data: 'emp_training', title: 'Training' },
            { data: 'marks', title: 'Marks' },
            { data: 'out_of', title: 'Outof' },

        ]
    });


});

$.get(`/employee/status-1/${user}`, (data, status)=>{
    if(data){
        $("#status").html("->Status");$("#status-heading").html(`<tr>
        <th>Req Id</th>
        <th>Training</th>
        <th>Subject</th>
        <th>Status</th>
      </tr>`);
        for (let x = 0; x < data.length; x++) {
            $('#status-table').append(
                "<tr><td>"+data[x].req_id+"</td><td>"+data[x].emp_training+"</td><td>"+data[x].emp_training_subject+"</td><td>Department</td></tr>"
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
        <th>Status</th>
      </tr>`);
        for (let x = 0; x < data.length; x++) {
            $('#status-table').append(
                "<tr><td>"+data[x].req_id+"</td><td>"+data[x].emp_training+"</td><td>"+data[x].emp_training_subject+"</td><td>Spipa</td></tr>"
            );
        }
    }   
});