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
const userspipa = getCookie("userspipa");
const rolespipa = getCookie("rolespipa");
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
        if (data == 2) {
            alert("welcome " + getCookie("userspipa"))
        }
        else {
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
    setCookie("spipaname", data, 1)
});

//spipaname
const spipaname = getCookie("spipaname");


//set training 
$.get(`/training/${userspipa}`, (data, status) => {
    console.log(data, "here");
    setCookie("cordinator_training", JSON.stringify(data), 1)
});

const cordinator_training = getCookie("cordinator_training");
//subject


//for storing emp_ids

let emp_id = [];

$(document).ready(function () {
    $('#sel1').on('change', (e) => {
        console.log(e.target.value, "haha")
        let training_name = e.target.value;


        $.post(`/spipa-training-req/${training_name}`, (data, status) => {
            console.log(status, " status")
            if (document.getElementById("dept-req-table1").innerHTML.length === 1 || document.getElementById("dept-req-table1").innerHTML.length == 0) {

                table = $('#dept-req-table').DataTable({
                    destroy: true,
                    data: data,
                    bLengthChange: false,
                    columns: [
                        { data: 'emp_id', title: 'Emp_id' },
                        { data: 'emp_training_subject', title: 'Subject' },
                        { data: 'emp_name', title: 'Employee' },
                        { data: 'emp_start_date', title: 'Starting_date' },
                        { data: 'emp_ending_date', title: 'Ending_date' },
                        { data: 'spipa_location', title: 'Location' },
                    ]
                });

            } else {

                $.post(`/spipa-training-req/${training_name}`, (data, status) => {

                    let sel2 = document.getElementById('sel2')
                    let j = `<option selected value=-1>Select subject</option>`;
                    data.forEach(element => {
                        j += `<option value=${element.emp_training_subject}>${element.emp_training_subject}</option>`;
                    }
                    )
                    sel2.innerHTML = j;
                    sel2.disable = true
                    $('#sel2').on('change', function () {
                        let subject = $('#sel2').val()
                        let obj = {
                            training_name: $('#sel1').val(),
                            subject: subject
                        }
                        console.log(obj, "obj")
                        $.ajax({
                            type: 'post',
                            url: '/spipa_exam_check',
                            data: JSON.stringify(obj),
                            contentType: "application/json; charset=utf-8",
                            traditional: true,
                            success: function (data) {
                                console.log(data, " data success")
                                if (data.length == 0 && getCookie("check")=="1") {
                                    $.ajax({
                                        type: 'post',
                                        url: '/spipa-training-req-subject',
                                        data: JSON.stringify(obj),
                                        contentType: "application/json; charset=utf-8",
                                        traditional: true,
                                        success: function (data) {

                                            emp_id = []


                                            data.forEach(element => {
                                                emp_id.push(element.emp_id)
                                            })
                                            table = $('#dept-req-table1').DataTable({
                                                destroy: true,
                                                data: data,
                                                bLengthChange: false,
                                                columns: [
                                                    { data: 'emp_id', title: 'Emp_id' },
                                                    { data: 'emp_name', title: 'Employee' },
                                                    {
                                                        data: 'emp_id', render: (data, type, row, meta) => {
                                                            return `   <input class="form-control btn-default mark" id=${data} type="number" placeholder="Marks"/>`
                                                        }, title: 'Enter marks here'
                                                    }
                                                ]
                                            });
                                        }

                                    })
                                }
                                else {
                                
                                    table = $('#dept-req-table1').DataTable({
                                        destroy: true,
                                        data: data,
                                        bLengthChange: false,
                                        columns: [
                                            { data: 'emp_id', title: 'Emp_id' },

                                            { data: 'emp_name', title: 'Employee' },
                                            {
                                                data: 'marks', title: 'Marks'
                                            }
                                        ]
                                    });
                                }

                            }
                        })
                        return;
                        $.ajax({
                            type: 'post',
                            url: '/spipa_training_emps',
                            data: JSON.stringify(obj),
                            contentType: "applicate/json; charset=utf-8",
                            traditional: true,
                            success: function (data) {

                                emp_id = []


                                data.forEach(element => {
                                    emp_id.push(element.emp_id)
                                })

                            }
                        })
                    })




                });

            }


        });
    })
})

let table;
$(document).ready(function () {
    let training_name = $('#sel1').val()

    $.post(`/spipa-training-req/${training_name}`, (data, status) => {


        table = $('#dept-req-table').DataTable({
            destroy: true,
            data: data,
            bLengthChange: false,
            columns: [
                { data: 'emp_id', title: 'Emp_id' },
                { data: 'emp_training_subject', title: 'Subject' },
                { data: 'emp_name', title: 'Employee' },
                { data: 'emp_start_date', title: 'Starting_date' },
                { data: 'emp_ending_date', title: 'Ending_date' },
                { data: 'spipa_location', title: 'Location' },
            ]
        });


    });

})


$(document).ready(function () {
    $("#exam_type").on('change', function (e) {
        if (e.target.value == "offline" ||  e.target.value=="online") {
            if(e.target.value=="online"){
         setCookie("check","0",1)
        }
        else{
           setCookie("check","1",1)

       }
            // document.getElementById("exam_type").value = "-1"
            document.getElementById('sel1').value = -1;
            let training_name = $('#sel1').val();
            $.post(`/spipa-training-req/${training_name}`, (data, status) => {
                emp_id = []


                data.forEach(element => {
                    emp_id.push(element.emp_id)
                })


                table = $('#dept-req-table1').DataTable({
                    destroy: true,
                    data: data,
                    bLengthChange: false,
                    columns: [
                        { data: 'emp_id', title: 'Emp_id' },

                        { data: 'emp_name', title: 'Employee' },
                        {
                            data: 'emp_id', render: (data, type, row, meta) => {
                                return `   <input class="form-control btn-default mark" id=${data}  type="number" min="0" max="100" placeholder="Marks"/>`
                            }, title: 'Enter marks here'
                        }
                    ]
                });


            });
        
        }
   if(getCookie("check")=="0"){
    document.getElementById("submit_btn").innerHTML="Download"
}
else{
       document.getElementById("submit_btn").innerHTML="Submit"

   }
    })
})


//for responsive
$(document).ready(function () {
    $("#exam_type1").on('change', function (e) {
        if (e.target.value == "offline" ||  e.target.value=="online") {
            if(e.target.value=="online"){
         setCookie("check","0",1)
        }
        else{
           setCookie("check","1",1)

       }
            // document.getElementById("exam_type").value = "-1"
            document.getElementById('sel1').value = -1;
            let training_name = $('#sel1').val();
            $.post(`/spipa-training-req/${training_name}`, (data, status) => {
                emp_id = []


                data.forEach(element => {
                    emp_id.push(element.emp_id)
                })


                table = $('#dept-req-table1').DataTable({
                    destroy: true,
                    data: data,
                    bLengthChange: false,
                    columns: [
                        { data: 'emp_id', title: 'Emp_id' },

                        { data: 'emp_name', title: 'Employee' },
                        {
                            data: 'emp_id', render: (data, type, row, meta) => {
                                return `   <input class="form-control btn-default mark" id=${data}  type="number" min="0" max="100" placeholder="Marks"/>`
                            }, title: 'Enter marks here'
                        }
                    ]
                });


            });
        
        }
   if(getCookie("check")=="0"){
    document.getElementById("submit_btn").innerHTML="Download"
}
else{
       document.getElementById("submit_btn").innerHTML="Submit"

   }
    })
})


//handling submit button 

$(document).ready(function () {
    $('#submit_btn').on('click', function () {
        let training_name = $('#sel1').val();
        console.log(emp_id, "emp id s")
        let check = false;
        emp_id.forEach((element, index) => {
            if (check) return -1;

            if ($(`#${element}`).val().length == 0 && !check) {
                alert("Fill all employee marks")
                check = true


            }
            if (!check) {
                console.log($(`#${element}`).val(), typeof ($(`#${element}`).val()))
                let marks = {
                    mark: $(`#${element}`).val(),
                    emp_id: element
                }
                $.ajax({
                    type: 'post',
                    url: `/adding_marks`,
                    data: JSON.stringify(marks),
                    contentType: 'application/json; charset=utf-8',
                    traditional: true,
                    success: function (data) {
                        console.log(data, "json data")
                        if (data == 1 && index == emp_id.length - 1) {
                            alert('added sucessfully')
                        }

                        if (data == 0 && index == emp_id.length - 1) {
                            check = true
                            alert("Something went wrong")

                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {




                    }


                })
            }
            // document.getElementById(`${element}`).disabled=true


        })
        if (!check) {
            var train=$("#sel1").val();
            var sub=$("#sel2").val();
            window.open(`/excel/emp_exam/${train}/${sub}`, '_blank')
            // $.get('/excel/emp_exam', (data, error) => {
            //     console.log(data, "exvel data")
            //     if (data == 1 && getCookie("check")=="1") {
            //         alert("File is added sucessfully to  download folder")
            //     }
            //     if(getCookie("check")=="0"){
            //         alert("File is added sucessfully to  download folder.\nIf excel file finds its empty means there is nothin in table ")
            //     }
            //     // alert("downloaded sucessfully")

            // })
        }
        console.log(check, " check hua")
    })

})




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
            dept_name: dept_name
        };
        console.log(reqBody);
        $.ajax({
            type: 'post',
            url: `/add-dept-name`,
            data: JSON.stringify(reqBody),
            contentType: "application/json; charset=utf-8",
            traditional: true,
            success: function (data) {
                if (data == 1) {
                    alert("added successfully")
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("already exsist")
            }

        });


    });
});

$(document).ready(function () {
    $("#btn-add-info").click(function () {
        const title_info = $("#title_info").val();
        const about_info = $("#about_info").val();
        const reqBody = {
            title_info:title_info,
            about_info:about_info,
            subject:"EDP",
            training:"special-1"
        };
        console.log(reqBody);
        $.ajax({
            type: 'post',
            url: `/add-info`,
            data: JSON.stringify(reqBody),
            contentType: "application/json; charset=utf-8",
            traditional: true,
            success: function (data) {
                alert("added successfully")
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("already exsist same title")
            }
        });


    });
});

let training1;
let subject1;
$(document).ready(function(){
$('#attendance_sub').on('change',function(){
 training1=$('#attendance_training').val()
 subject1=$('#attendance_sub').val()
$.get(`/attendence/${training1}/${subject1}`, (data, status) => {
  
    $("#training-req-table").DataTable({
        destroy:true,
      data: data,
      bLengthChange: false,
      columns: [
        { data: "emp_id", title: "Emp_Id" },
        { data: "emp_name", title: "Name" },
        { data: "emp_training_subject", title: "Subject" },
        { data: "emp_training", title: "Training" },
  
        {
          data: "emp_id",
          render: (data, type, row, meta) => {
            return (`<input type="checkbox" id="`+ data + `" name="pa">`);
          },
          title: "present/absent",
        },
      ],
    });
  });
})



  
  
})
function check(){
    const  utc = $("#attendenceDate").val();
    training1=$('#attendance_training').val()
    subject1=$('#attendance_sub').val()
    if(utc.length==0 || !utc || utc==undefined){
        alert("First Select the date:")
        return ;
    }
    $.get(`/attendence/${training1}/${subject1}`, (data, status) => {
        console.log("data in attendance", data)
        for(let i=0; i<data.length;i++){
           
            if ( $("#"+data[i].emp_id+"").prop("checked")==true) {
               present(data[i].emp_id,data[i].emp_name,utc,data[i].emp_training_subject,data[i].emp_training)
            }
            else{
                absent(data[i].emp_id,data[i].emp_name,utc,data[i].emp_training_subject,data[i].emp_training)
            }
        }
        window.open(`/attendence/excel/${training1}/${subject1}/${utc}`, '_blank');
    });

    
    
}

function present(id, name, utc, subject, training) {
  $.get(
    `/attendence/present/${id}/${name}/${utc}/${subject}/${training}`,
    (data, status) => {
        if(data==0){
            alert("You have already selected this date")
        }
    }
  );
  
}
function absent(id, name, utc, subject, training) {
  $.get(
    `/attendence/absent/${id}/${name}/${utc}/${subject}/${training}`,
    (data, status) => {
        if(data==0){
            alert("You have already selected this date")
        }
    }
  );
}

