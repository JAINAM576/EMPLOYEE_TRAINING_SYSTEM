const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const nodemailer = require("nodemailer");
const XLSX = require("xlsx")
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path')

const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require('dotenv').config();


var pool = mysql.createConnection({
  host: process.env.DB_HOST,
  port:process.env.port1,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DBNAME,
  dateStrings: true
});


pool.connect(function (err) {
  if (err) {
    console.log("database not connected");
    throw err;
  }
  else {
    console.log("database connected");
  }

});

app.get("/", (req, res) => {
  res.redirect("/employee");
});
app.get("/employee/login", (req, res) => {
  res.sendFile(__dirname + "/public/pages/employee/login.html");
});
app.get("/employee/signin", (req, res) => {

  res.sendFile(__dirname + "/public/pages/employee/signin.html");
});
app.get("/employee", (req, res) => {
  res.sendFile(__dirname + "/public/pages/employee/employee.html");
});

app.get("/department/login", (req, res) => {
  res.sendFile(__dirname + "/public/pages/department/login.html");
});
app.get("/department/signin", (req, res) => {
  res.sendFile(__dirname + "/public/pages/department/signin.html");
});
app.get("/department/message", (req, res) => {
  res.sendFile(__dirname + "/public/pages/department/message.html");
});
app.get("/department/operator", (req, res) => {
  res.sendFile(__dirname + "/public/pages/department/department-operator.html");
});
app.get("/department/admin", (req, res) => {
  res.sendFile(__dirname + "/public/pages/department/department-admin.html");
});
app.get("/employee/req", (req, res) => {
  res.sendFile(__dirname + "/public/pages/employee/Req-apply/index.html");
});
app.get("/spipa/login", (req, res) => {
  res.sendFile(__dirname + "/public/pages/spipa/login.html");
});
app.get("/spipa/signin", (req, res) => {
  res.sendFile(__dirname + "/public/pages/spipa/signin.html");
});
app.get("/spipa/message", (req, res) => {
  res.sendFile(__dirname + "/public/pages/spipa/message.html");
});
app.get("/spipa/operator", (req, res) => {
  res.sendFile(__dirname + "/public/pages/spipa/spipa-operator.html");
});
app.get("/spipa/admin", (req, res) => {
  res.sendFile(__dirname + "/public/pages/spipa/spipa-admin.html");
});
app.get("/spipa/cordinator", (req, res) => {
  res.sendFile(__dirname + "/public/pages/spipa/spipa-cordinator.html");
});
app.get("/spipa/dashboard", (req, res) => {
  res.sendFile(__dirname + "/public/pages/spipa/spipa-dashboard.html");
});

app.get("/add/quiz", (req, res) => {
  res.sendFile(__dirname + "/public/pages/quiz/addquiz.html");
});
app.get("/login/quiz", (req, res) => {
  res.sendFile(__dirname + "/public/pages/quiz/examlogin.html");
});
app.get("/give/quiz", (req, res) => {
  res.sendFile(__dirname + "/public/pages/quiz/exam.html");
});


//passing the pass
let training;
app.post('/post_trainings_from_cordinator',(req,res)=>{
training=req.body
res.status(200).json(1)
})
app.get('/get_trainings_from_cordinator',(req,res)=>{
res.send(training)
})
//employee
app.post("/employee/signin", (req, res) => {
  const employeeDetail = {
    name: req.body.emp_name,
    email: req.body.emp_email,
    phoneNumber: req.body.emp_phone_no,
    department: req.body.emp_dept_name,
    pass: req.body.emp_password,
    bDate: req.body.emp_birth_date,
    gender: req.body.emp_gender,
    operator: req.body.emp_operator
  };

  pool.query(
    "INSERT INTO employee (emp_name, emp_email, emp_phone_no ,emp_dept_name," +
    "emp_password,emp_birth_date,emp_gender,emp_operator) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      employeeDetail.name,
      employeeDetail.email,
      employeeDetail.phoneNumber,
      employeeDetail.department,
      employeeDetail.pass,
      employeeDetail.bDate,
      employeeDetail.gender,
      employeeDetail.operator,
    ]
  );
  pool.query(
    "SELECT emp_id FROM employee where emp_email=(?) order by emp_id desc",
    [employeeDetail.email],
    (error, results) => {
      console.log(results[0].emp_id);

      async function send(to_mail, message, subject) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "jainamsanghavi008@gmail.com",
            pass: "wmcnnvjipuyqawpf",
          },
        });
        const mailoptions = {
          from: "jainamsanghavi008@gmail.com",
          to: to_mail,
          text: message,
          subject: subject,
        };
        try {
          const result = await transporter.sendMail(mailoptions);
          console.log("success");
        } catch (error) {
          console.log("error", error);
        }
      }
      send(
        employeeDetail.email,
        `Hello ,${employeeDetail.name}
        Your User id:${results[0].emp_id}
        Password:${employeeDetail.pass}
        Thanks For registration.
        `,
        "Email confirmation + user id and password"
      );
    }
  );
  res.redirect("/employee/login");
});

app.post("/employee/login", (req, res) => {
  const { login_id, login_password } = req.body;
  const userId = login_id;
  const userPassword = login_password;

  pool.query(
    "SELECT emp_password FROM employee where emp_id=(?)",
    [userId],
    (error, results) => {
      if (error) {
        console.error(error)
      }
      if (results && results[0]) {
        if (results[0].emp_password == userPassword) {
          res.status(200).json(1);
        }
      }
      else {
        res.status(200).json(0);
      }
    }
  );
});

app.get("/emp-training/:id", (req, res) => {
  console.log("coming")
  const current_user = req.params.id;
  pool.query(
    "SELECT * FROM emp_training where emp_id=(?)",
    [current_user],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error retrieving company");
      } else {
        res.status(200).json(results);
      }
    }
  );
});
app.get("/emp-exam/:id", (req, res) => {
  const current_user = req.params.id;
  pool.query(
    "SELECT * FROM emp_exam_result where emp_id=(?)",
    [current_user],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error retrieving company");
      } else {
        res.status(200).json(results);
      }
    }
  );
});

app.post("/employee/test", (req, res) => {
  const { user } = req.body;
  if (user == 0) {
    res.status(500).json(0);
  }
  else {
    res.status(200).json(1);
  }
});
app.get("/emp-training/:id", (req, res) => {
  const current_user = req.params.id;
  pool.query(
    "SELECT * FROM emp_training where emp_id=(?)",
    [current_user],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error retrieving company");
      } else {
        res.status(200).json(results);
      }
    }
  );
});
app.get("/emp-exam/:id", (req, res) => {
  const current_user = req.params.id;
  pool.query(
    "SELECT * FROM emp_exam where emp_id=(?)",
    [current_user],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error retrieving company");
      } else {
        res.status(200).json(results);
      }
    }
  );
});

app.get("/employee/options", (req, res) => {
  console.log("here")
  pool.query("select * from department_info", (error, results) => {
    if (!error) {
      k = JSON.stringify(results)
      console.log(results);
      res.json({ results1: results })


    }
  })
})
app.post("/employee/cordinators", (req, res) => {

  console.log("here", req.body)
  let { loc } = req.body
  let loclow = loc.toLowerCase()
  pool.query("select * from spipa_emp where spipa_emp_role=(?)  and (spipa_name=(?) or spipa_name=(?))", ["cordinator", loc, loclow], (error, results) => {
    if (!error) {
      k = JSON.stringify(results)
      console.log(results);
      res.json({ results1: results })


    }
  })

})



//Department

app.post("/department/signin", (req, res) => {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;
  const employeeDetail = {
    role: req.body.dept_emp_role,
    email: req.body.dept_email,
    department: req.body.dept_name,
    pass: req.body.dept_password,
    location: req.body.dept_location,
    contact: req.body.dept_contact,
    date: today
  };

  pool.query(
    "INSERT INTO dept_req (dept_emp_role, dept_name, dept_location, dept_email,dept_contact," +
    "dept_password, dept_req_date ) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      employeeDetail.role,
      employeeDetail.department,
      employeeDetail.location,
      employeeDetail.email,
      employeeDetail.contact,
      employeeDetail.pass,
      employeeDetail.date
    ]
  );
  res.redirect("/department/message");
});

app.post("/department/login", (req, res) => {
  const { login_id, login_role, login_password } = req.body;
  const userId = login_id;
  const role = login_role;
  const userPassword = login_password;
  if (userId && userPassword) {
    pool.query(
      "SELECT dept_password FROM dept_emp where dept_emp_id=(?) and dept_emp_role=(?)",
      [userId, role],
      (error, results) => {
        if (error) {
          console.error(error)
        }
        if (results && results[0]) {
          if (results[0].dept_password == userPassword) {
            res.status(200).json(1);
          }
        }
        else {
          res.status(200).json(0);
        }
      }
    );
  }
  else {
    res.status(200).json(0);
  }
});

app.post("/department/test", (req, res) => {
  const { userdept, roledept } = req.body;
  if (userdept == 0) {
    res.status(500).json(0);
  }
  else {
    if (roledept == 'Operator') {
      res.status(200).json(1);
    }
    if (roledept == 'Admin') {
      res.status(200).json(2);
    }
  }
});
app.post("/employee/req", (req, res) => {
  const { getUser, center, city, training, dates } = req.body;
  const apply_center = req.body.center;
  const apply_city = req.body.city;
  const apply_training = req.body.training;
  const apply_dates = req.body.dates;
  const user_id = req.body.getUser;

  console.log(req.body);

  pool.query(
    "INSERT INTO emp_training (emp_id,emp_center, emp_start_date,emp_end_date,emp_training," +
    "emp_city) VALUES (?,?, ?, ?, ?,?)",
    [
      user_id,
      apply_center,
      apply_dates,
      apply_dates,
      apply_training,
      apply_city,
    ]
  );
  console.log("success");
});
//apply training
app.post("/employee/trainning_name", (req, res) => {
  let { lw } = req.body
  if (lw) {

    pool.query('select  training  from training_programm where training_subject=(?) ', [lw], (error, result) => {
      if (!error) {

        res.send(result)

      }
      if (error) {

        console.error(error)
      }
    })

  }


})
app.post("/employee/subject", (req, res) => {
  let { lw } = req.body;
  if (lw) {
    pool.query('select distinct training_subject  from training_programm where spipa_location=(?) ', [lw], (error, result) => {
      if (error) {
        console.error(error)
      }
      if (!error) {
        res.send(result)
      }
    })

  }
  app.post("/employee/date", (req, res) => {
    console.log(req.body)
    let { lw, val1, val3 } = req.body
    if (lw && val1 && val3) {
      pool.query("select start_date,end_date from training_programm where training=(?) and spipa_location=(?) and training_subject=(?) ", [lw, val1, val3], (error, result) => {
        if (error) {
          console.error(error)
        }
        if (!error) {
          res.send(result)
        }
      })
    }

  })
});
app.post("/employee/req-apply", (req, res) => {
  let { getUser, center, subject, training, starting_date, ending_date } = req.body;
  pool.query(
    "select * FROM emp_training_req WHERE emp_id=(?) and emp_training=(?);",
    [getUser, training],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error retrieving");
      } else {
        if (results && results[0]) {
          res.status(200).json(2);
        }
        else {
          pool.query(
            "select * FROM spipa_training_req WHERE emp_id=(?) and emp_training=(?);",
            [getUser, training],
            (error, results) => {
              if (error) {
                console.error(error);
                res.status(500).send("Error retrieving company");
              } else {
                if (error) {
                  console.error(error);
                  res.status(500).send("Error retrieving");
                } else {
                  if (results && results[0]) {
                    res.status(200).json(2);
                  }
                  else {
                    if (getUser && center && subject && training && starting_date && ending_date) {
                      pool.query("select emp_name from employee where emp_id=(?)", [getUser], (error, result) => {
                        if (error) {
                          console.log(error);
                          res.status(500).send("Error retrieving");
                        }
                        if (!error) {
                          pool.query(
                            "INSERT INTO emp_training_req (emp_id,emp_name,emp_training, emp_start_date,emp_ending_date,emp_training_subject,spipa_location) VALUES (?,?, ?, ?, ?,?,?)",
                            [
                              getUser,
                              result[0].emp_name,
                              training,
                              starting_date,
                              ending_date,
                              subject,
                              center

                            ]
                            , (error, result) => {
                              if (error) {
                                console.log(error)
                              }
                              else {
                                console.log("success")
                                res.status(200).json(1);
                              }
                            }
                          );

                        }
                      })

                    }
                    else {
                      console.log(getUser, center, subject, training, starting_date, ending_date)
                      console.log("error req retriving")
                    }

                  }
                }
              }
            }
          );
        }
      }
    }
  );
});


//dept-operator
app.get("/dept-name/:id", (req, res) => {
  const dept_emp_id = req.params.id;
  pool.query(
    "select dept_name FROM dept_emp WHERE dept_emp_id=(?);",
    [dept_emp_id],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error retrieving company");
      } else {
        if (results[0]) {
          res.status(200).json(results[0].dept_name);
        }

      }
    }
  );
});
app.get("/reject/:id", (req, res) => {
  const req_Id = req.params.id;
  console.log(req_Id);
  let email;
  pool.query("select emp_id,emp_name,emp_training_subject,emp_training from emp_training_req where req_id=(?)", [req_Id], (error, result) => {
    if (error || result.length == 0) {
      console.log("error in dept reject")
      res.json(0)
    } else {
      pool.query("select emp_email from employee where emp_id=(?)", [result[0].emp_id], (error, result1) => {
        if (error || result1.length == 0) {
          console.log("error in dept reject")
          res.json(0)
        }
        else {
          email = result1[0].emp_email
          console.log(email, "email in dept req reject")
          pool.query(
            "DELETE FROM emp_training_req WHERE req_id=(?);",
            [req_Id],
            (error, results) => {
              if (error) {
                console.error(error);
                res.status(500).send("Error retrieving company");
              } else {
                console.log("deleted");
                async function send(to_mail, message, subject, email) {
                  const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                      user: "jainamsanghavi008@gmail.com",
                      pass: "wmcnnvjipuyqawpf",
                    },
                  });
                  const mailoptions = {
                    from: "jainamsanghavi008@gmail.com",
                    to: to_mail,
          
                    html: email,
                    subject: subject,
                  };
                  try {
                    const result = await transporter.sendMail(mailoptions);
                    console.log("success");
                  } catch (error) {
          
                    console.log("error in dept req reject ", error);
                  }
                }
                send(
                  email,
                 '',
                  "Regarding Training Request ",
                  `<h3>Hello ${result[0].emp_name}</h3> 
                 
                  <hr>
                 Sorry but your request for training ${result[0].emp_training} and subject ${result[0].emp_training_subject}
                 has been rejected by department operator.  
                 
                  <hr>
                  
                 <div>For more detail you can contact to your department head</div>
                  <hr>
                  
                 <div>Best regards.</div>
                  <hr>
          
                 `,
                );
                res.status(200).json(results);
              }
            }
          );
        }
      })
    }
  })

  // pool.query(
  //   "DELETE FROM emp_training_req WHERE req_id=(?);",
  //   [req_Id],
  //   (error, results) => {
  //     if (error) {
  //       console.error(error);
  //       res.status(500).send("Error retrieving company");
  //     } else {
  //       console.log("deleted");
  //       res.status(200).json(results);
  //     }
  //   }
  // );
});
app.get("/accept/:id", (req, res) => {
  const req_Id = req.params.id;
  console.log(req_Id);
  pool.query(
    "select * FROM emp_training_req WHERE req_id=(?);",
    [req_Id],
    (error, results) => {
      if (error) {
        console.error(error);
      } else {
        var emp = {
          req_id: results[0].req_id,
          emp_id: results[0].emp_id,
          emp_name: results[0].emp_name,
          emp_training: results[0].emp_training,
          emp_training_subject: results[0].emp_training_subject,
          spipa_location: results[0].spipa_location,
          emp_start_date: results[0].emp_start_date,
          emp_ending_date: results[0].emp_ending_date,
        };

        pool.query(
          "INSERT INTO spipa_training_req (req_id,emp_id,emp_name, emp_training, emp_training_subject, emp_start_date," +
          "emp_ending_date, spipa_location) VALUES (?, ?, ?, ?, ?,?,?,?)",
          [
            emp.req_id,
            emp.emp_id,
            emp.emp_name,
            emp.emp_training,
            emp.emp_training_subject,
            emp.emp_start_date,
            emp.emp_ending_date,
            emp.spipa_location,
          ],
          (error, results) => {
            if (error) {
              console.error(error);
              res.status(500).send("Error insert");
            } else {
              pool.query(
                "DELETE FROM emp_training_req WHERE req_id=(?);",
                [req_Id],
                (error, results) => {
                  if (error) {
                    console.error(error);
                    res.status(500).send("Error retrieving company");
                  } else {
                    console.log("deleted");
                    res.status(200).json(results);
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

app.get("/all/emp-training/:id", (req, res) => {
  pool.query("SELECT * FROM emp_training", (error, results) => {
    const current_user = req.params.id;
    pool.query('SELECT * from emp_training inner join (SELECT emp_id FROM employee where emp_operator=(?) and status=1) e1 on emp_training.emp_id=e1.emp_id', [current_user], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error retrieving company');
      } else {
        res.status(200).json(results);
      }
    });
  });
});

app.get("/all/emp-exam/:id", (req, res) => {
  const current_user = req.params.id;
  pool.query("SELECT * FROM emp_exam_result inner join (SELECT emp_id FROM employee where emp_operator=(?)) e1 on emp_exam_result.emp_id=e1.emp_id", [current_user], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error retrieving company");
    } else {
      res.status(200).json(results);
    }
  });
});

app.get('/emp-training-req/:id/:id2', (req, res) => {
  const current_user = req.params.id;
  const dept_name = req.params.id2;
  pool.query('SELECT * from emp_training_req inner join (SELECT emp_id FROM employee where emp_operator=(?) and emp_dept_name=(?)) e1 on emp_training_req.emp_id=e1.emp_id', [current_user, dept_name], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error retrieving company');
    } else {
      res.status(200).json(results);
    }
  });
});
//dept admin
app.get('/dept-req/:id', (req, res) => {
  const current_dept_name = req.params.id;
  console.log(current_dept_name,"dep")
  const dept_emp_role = 'operator';
  pool.query('SELECT * FROM dept_req WHERE dept_name=(?) AND dept_emp_role=(?);', [current_dept_name, dept_emp_role], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error');
    } else {
      res.status(200).json(results);
    }
  });
});
app.get('/dept/reject/:id', (req, res) => {
  const dept_req_Id = req.params.id;
  pool.query('select dept_email,dept_emp_role,dept_name from dept_req where dept_req_id=(?)',[dept_req_Id],(error,result)=>{
    if (error) {
      console.error(error);
      res.status(500).send('Error');
    }
    else{

      pool.query('DELETE FROM dept_req WHERE dept_req_id=(?);', [dept_req_Id], (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).send('Error');
        } else {
          async function send(to_mail, message, subject, email) {
            const transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "jainamsanghavi008@gmail.com",
                pass: "wmcnnvjipuyqawpf",
              },
            });
            const mailoptions = {
              from: "jainamsanghavi008@gmail.com",
              to: to_mail,
    
              html: email,
              subject: subject,
            };
            try {
              const result = await transporter.sendMail(mailoptions);
              console.log("success");
            } catch (error) {
    
              console.log("error in dept req reject ", error);
            }
          }
          send(
            result[0].dept_email,
           '',
            "Regarding Department Request ",
            `<h3>Hello </h3> 
           
            <hr>
           Sorry but your request for department ${result[0].dept_name} as ${result[0].dept_emp_role}
           has been rejected by Authority.  
           
            <hr>
            
           <div>For more detail you can contact to your department head</div>
            <hr>
            
           <div>Best regards.</div>
            <hr>
    
           `,
          );
          res.status(200).json("deleted");
        }
      });
    }
  })
});
app.get('/dept/accept/:id', (req, res) => {
  const dept_req_Id = req.params.id;
  console.log(dept_req_Id);
  pool.query('select * FROM dept_req WHERE dept_req_id=(?);', [dept_req_Id], (error, results) => {
    if (error) {
      console.error(error);
    }
    else {

      var dept = {
        dept_name: results[0].dept_name,
        dept_location: results[0].dept_location,
        dept_contact: results[0].dept_contact,
        dept_password: results[0].dept_password,
        dept_emp_role: results[0].dept_emp_role,
        dept_email: results[0].dept_email
      }

      pool.query('INSERT INTO dept_emp (dept_name,dept_location, dept_contact, dept_password,' +
        'dept_email,dept_emp_role) VALUES (?, ?, ?, ?, ?, ?)',
        [dept.dept_name, dept.dept_location, dept.dept_contact, dept.dept_password, dept.dept_email, dept.dept_emp_role], (error, results) => {
          if (error) {
            console.error(error);
            res.status(500).send('Error insert');
          } else {
            async function send(to_mail, message, subject, email) {
              const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: "jainamsanghavi008@gmail.com",
                  pass: "wmcnnvjipuyqawpf",
                },
              });
              const mailoptions = {
                from: "jainamsanghavi008@gmail.com",
                to: to_mail,
      
                html: email,
                subject: subject,
              };
              try {
                const result = await transporter.sendMail(mailoptions);
                console.log("success");
              } catch (error) {
      
                console.log("error in dept req reject ", error);
              }
            }
            send(
              dept.dept_email ,
             '',
              "Regarding Department Request ",
              `<h3>Hello </h3> 
             
              <hr>
             Congratulation !  your request for department ${dept.dept_name} as ${dept.dept_emp_role}
             has been accepted by Authority.  
             
              <hr>
              
             <div>For more detail you can contact to your department head
             and you can see your dashboard when you log into your account.</div>
              <hr>
              
             <div>Best regards.</div>
              <hr>
      
             `,
            );
            res.status(200).send('added in dept');
          }
        });

    }
  }
  );
  pool.query('DELETE FROM dept_req WHERE dept_req_id=(?);', [dept_req_Id], (error, results) => {
    if (error) {
      console.error(error);

    } else {
      console.error("deleted");
    }
  });
});
app.get('/department/:id', (req, res) => {
  const current_dept_name = req.params.id;
  const dept_emp_role = 'operator';
  pool.query('SELECT * FROM dept_emp WHERE dept_name=(?) AND dept_emp_role=(?);', [current_dept_name, dept_emp_role], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error');
    } else {
      res.status(200).json(results);
    }
  });
});
app.get('/remove-dept/:id', (req, res) => {
  const dept_emp_id = req.params.id;
  pool.query('DELETE FROM dept_emp WHERE dept_emp_id=(?) and dept_emp_role="operator";', [dept_emp_id], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send(2);
    } else {

      if (results[0] != undefined) {
        res.status(200).json(1);
      }
      else {
        res.status(200).json(0);
      }
    }
  });
});
app.post('/dept-add/:id', (req, res) => {
  const { dept_location, dept_contact, dept_password, dept_email } = req.body;
  const dept_name = req.params.id;
  const dept_emp_role = 'operator';
  pool.query('INSERT INTO dept_emp (dept_emp_role, dept_name,dept_location, dept_contact, dept_password,' +
    'dept_email) VALUES (?, ?, ?, ?, ?, ?)',
    [dept_emp_role, dept_name, dept_location, dept_contact, dept_password, dept_email], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error insert');
      } else {
        res.status(200).send('added in dept');
      }
    });
});
//For spipa

app.post("/spipa/test", (req, res) => {
  const { userspipa, rolespipa } = req.body;
  console.log("role", rolespipa)
  if (userspipa == 0) {
    res.status(500).json(0);
  }
  else {
    if (rolespipa == 'operator') {
      res.status(200).json(1);
    }
    if (rolespipa == 'admin') {
      res.status(200).json(2);
    }
    if (rolespipa == 'cordinator') {
      res.status(200).json(2);
    }
  }
});
app.post("/spipa/login", (req, res) => {
  const { login_id, login_password, login_role } = req.body;
  const userId = login_id;
  const userPassword = login_password;
  const role = login_role
  console.log(role, "roling")
  if (userPassword && userId) {
    pool.query(
      "SELECT spipa_password FROM spipa_emp where spipa_emp_id=(?) and spipa_emp_role=(?)",
      [userId, role],
      (error, results) => {
        if (error) {
          console.error(error)
        }
        if (results && results[0]) {
          if (results[0].spipa_password == userPassword) {
            res.status(200).json(1);
          }
        }
        else {
          res.status(200).json(0);
        }
      }
    );
  }
  else {
    res.status(200).json(0);
  }

});
app.get("/spipa/add-quiz", (req, res) => {
  res.sendFile(__dirname + "/public/pages/spipa/addQuiz.html");
});

app.post("/spipa/signin", (req, res) => {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;
  const employeeDetail = {
    role: (req.body.spipa_emp_role).toLowerCase(),
    email: req.body.spipa_email,
    department: req.body.spipa_name,
    pass: req.body.spipa_password,
    location: (req.body.spipa_location).toLowerCase(),
    contact: req.body.spipa_contact,
    date: today
  };

  console.log(employeeDetail.role)
  if (employeeDetail.role != "cordinator") {

    pool.query(
      "INSERT INTO spipa_req (spipa_emp_role, spipa_name, spipa_location, spipa_email, spipa_contact," +
      "spipa_password, spipa_req_date ) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        employeeDetail.role,
        employeeDetail.department,
        employeeDetail.location,
        employeeDetail.email,
        employeeDetail.contact,
        employeeDetail.pass,
        employeeDetail.date
      ]
    );
    res.redirect("/department/message");
    return;
  }
  else {
    pool.query(
      "INSERT INTO spipa_emp (spipa_emp_role, spipa_name, spipa_location, spipa_email, spipa_contact," +
      "spipa_password) VALUES ( ?, ?, ?, ?, ?, ?)",
      [
        employeeDetail.role,
        employeeDetail.department,
        employeeDetail.location,
        employeeDetail.email,
        employeeDetail.contact,
        employeeDetail.pass,
      ],(error,result)=>{
        if(!error){
          pool.query("select spipa_emp_id from spipa_emp where spipa_emp_role='cordinator' order by spipa_emp_id desc",(error,result1)=>{
            if(!error){

              async function send(to_mail, message, subject, email) {
                const transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "jainamsanghavi008@gmail.com",
                pass: "wmcnnvjipuyqawpf",
              },
            });
            const mailoptions = {
              from: "jainamsanghavi008@gmail.com",
              to: to_mail,
    
              html: email,
              subject: subject,
            };
            try {
              const result = await transporter.sendMail(mailoptions);
              console.log("success");
            } catch (error) {
    
              console.log("error in spipa sigin ", error);
            }
          }
          send(
            email,
           '',
            "Regarding Spipa signin ",
            `<h3>Hello </h3> 
           
            <hr>
            Your employee id is ${result1[0].spipa_emp_id}.
            Password: ${employeeDetail.pass}

            <hr>
            Spipa admin will add training for You untill u can't login into your account.

            <div>Thanks For Registartion.</div>

            <hr>
            
            <div>Best regards.</div>
            <hr>
            
            `,
            );
          }
        })
          }
        }
    );
    res.sendFile(__dirname + "/public/pages/spipa/cordinator_message.html");
  }
});


//spipa operator
app.get("/spipa-name/:id", (req, res) => {
  const spipa_emp_id = req.params.id;
  pool.query(
    "select spipa_name FROM spipa_emp WHERE spipa_emp_id=(?);",
    [spipa_emp_id],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error retrieving company");
      } else {
        if (results[0]) {
          res.status(200).json(results[0].spipa_name);
        }

      }
    }
  );
});

app.get('/spipa-emptrain-req/:id', (req, res) => {
  console.log(req.params.id, "request")
  const spipa_name = req.params.id;
  pool.query('SELECT * from spipa_training_req where spipa_location=(?)', [spipa_name], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error retrieving employee');
    } else {
      res.status(200).json(results);
    }
  });
});
app.get("/emp-reject/:id", (req, res) => {
  const req_Id = req.params.id;
  console.log(req_Id);
  let email;
  pool.query("select emp_id,emp_name,emp_training_subject,emp_training from spipa_training_req where req_id=(?)", [req_Id], (error, result) => {
    if (error || result.length == 0) {
      console.log("error in spipa reject")
      res.json(0)
    } else {
      pool.query("select emp_email from employee where emp_id=(?)", [result[0].emp_id], (error, result1) => {
        if (error || result1.length == 0) {
          console.log("error in spipa reject")
          res.json(0)
        }
        else {
          email = result1[0].emp_email
          console.log(email, "email in dept req reject")
          pool.query(
            "DELETE FROM spipa_training_req WHERE req_id=(?);",
            [req_Id],
            (error, results) => {
              if (error) {
                console.error(error);
                res.status(500).send("Error retrieving company");
              } else {
                console.log("deleted");
                async function send(to_mail, message, subject, email) {
                  const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                      user: "jainamsanghavi008@gmail.com",
                      pass: "wmcnnvjipuyqawpf",
                    },
                  });
                  const mailoptions = {
                    from: "jainamsanghavi008@gmail.com",
                    to: to_mail,
          
                    html: email,
                    subject: subject,
                  };
                  try {
                    const result = await transporter.sendMail(mailoptions);
                    console.log("success");
                  } catch (error) {
          
                    console.log("error in dept req reject ", error);
                  }
                }
                send(
                  email,
                 '',
                  "Regarding Training Request ",
                  `<h3>Hello ${result[0].emp_name}</h3> 
                 
                  <hr>
                 Sorry but your request for training ${result[0].emp_training} and subject ${result[0].emp_training_subject}
                 has been rejected by spipa operator.  
                 
                  <hr>
                  
                 <div>For more detail you can contact to your spipa head</div>
                  <hr>
                  
                 <div>Best regards.</div>
                  <hr>
          
                 `,
                );
                res.status(200).json(results);
              }
            }
          );
        }
      })
    }
  })

  // pool.query(
  //   "DELETE FROM spipa_training_req WHERE req_id=(?);",
  //   [req_Id],
  //   (error, results) => {
  //     if (error) {
  //       console.error(error);
  //       res.status(500).send("Error retrieving");
  //     } else {
  //       console.log("deleted");
  //       res.status(200).json(results);
  //     }
  //   }
  // );
});
app.get("/spipa-accept/:id", (req, res) => {
  const req_Id = req.params.id;
  console.log(req_Id);
  pool.query(
    "select * FROM spipa_training_req WHERE req_id=(?);",
    [req_Id],
    (error, results) => {
      if (error) {
        console.error(error);
      } else {
        var emp = {
          req_id: results[0].req_id,
          emp_id: results[0].emp_id,
          emp_name: results[0].emp_name,
          emp_training: results[0].emp_training,
          emp_training_subject: results[0].emp_training_subject,
          spipa_location: results[0].spipa_location,
          emp_start_date: results[0].emp_start_date,
          emp_ending_date: results[0].emp_ending_date,
        };

        pool.query(
          "INSERT INTO emp_training (emp_id, emp_training, emp_training_subject, emp_start_date," +
          "emp_ending_date, spipa_location) VALUES ( ?, ?, ?,?,?,?)",
          [
            emp.emp_id,
            emp.emp_training,
            emp.emp_training_subject,
            emp.emp_start_date,
            emp.emp_ending_date,
            emp.spipa_location,
          ],
          (error, results) => {
            if (error) {
              console.error(error);
              res.status(500).send("Error insert");
            } else {
              pool.query(
                "DELETE FROM spipa_training_req WHERE req_id=(?);",
                [req_Id],
                (error, results) => {
                  if (error) {
                    console.error(error);
                    res.status(500).send("Error retrieving company");
                  } else {
                    pool.query("select emp_email from employee where emp_id=(?)", [emp.emp_id], (error, result1) => {
                      if (error || result1.length == 0) {
                        console.log("error in spipa reject")
                        res.json(0)
                      }
                      else {
                        email = result1[0].emp_email
                        console.log(email, "email in dept req reject")
                        async function send(to_mail, message, subject, email) {
                          const transporter = nodemailer.createTransport({
                            service: "gmail",
                            auth: {
                              user: "jainamsanghavi008@gmail.com",
                              pass: "wmcnnvjipuyqawpf",
                            },
                          });
                          const mailoptions = {
                            from: "jainamsanghavi008@gmail.com",
                            to: to_mail,
                  
                            html: email,
                            subject: subject,
                          };
                          try {
                            const result = await transporter.sendMail(mailoptions);
                            console.log("success");
                          } catch (error) {
                  
                            console.log("error in spipa req accept ", error);
                          }
                        }
                        send(
                          email,
                         '',
                          "Regarding Training Request ",
                          `<h3>Hello ${emp.emp_name}</h3> 
                         
                          <hr>
                         Congratulations!  your request for training ${emp.emp_training} and subject ${emp.emp_training_subject}
                         has been accepted by spipa operator.  
                         
                          <hr>
                          
                         <div>For more detail you can contact to your spipa head and u can see your on your id.</div>
                          <hr>
                          
                         <div>Best regards.</div>
                          <hr>
                  
                         `,
                        );
                      }
                    })

                    console.log("deleted");

                    res.status(200).json(results);
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});
//spipa admin
app.get('/spipa-dept-req', (req, res) => {
  const role = 'admin';
  pool.query('SELECT * FROM dept_req WHERE dept_emp_role=(?);', [role], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error');
    } else {
      res.status(200).json(results);
    }
  });
});
app.get('/spipa-opt-req', (req, res) => {
  const role = 'operator';
  pool.query('SELECT * FROM spipa_req WHERE spipa_emp_role=(?);', [role], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error');
    } else {
      res.status(200).json(results);
    }
  });
});
app.get('/spipa/reject/:id', (req, res) => {
  const spipa_req_Id = req.params.id;
  pool.query("select spipa_name,spipa_email,spipa_emp_role FROM spipa_req WHERE spipa_req_id=(?) ",[spipa_req_Id],(error,result)=>{
    if (error) {
      console.error(error);
      res.status(500).send('Error');
    }
    else{

      pool.query('DELETE FROM spipa_req WHERE spipa_req_id=(?);', [spipa_req_Id], (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).send('Error');
        } else {
          async function send(to_mail, message, subject, email) {
            const transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "jainamsanghavi008@gmail.com",
                pass: "wmcnnvjipuyqawpf",
              },
            });
            const mailoptions = {
              from: "jainamsanghavi008@gmail.com",
              to: to_mail,
    
              html: email,
              subject: subject,
            };
            try {
              const result = await transporter.sendMail(mailoptions);
              console.log("success");
            } catch (error) {
    
              console.log("error in dept req reject ", error);
            }
          }
          send(
            result[0].spipa_email ,
           '',
            "Regarding Spipa-Operator Request ",
            `<h3>Hello </h3> 
           
            <hr>
           Sorry !  your request for spipa  ${result[0].spipa_emp_role} in ${result[0].spipa_name}
           has been rejected by Authority.  
           
            <hr>
            
           <div>For more detail you can contact to your spipa head</div>
            <hr>
            
           <div>Best regards.</div>
            <hr>
    
           `,
          );
          res.status(200).json("deleted");
        }
      });
    }
  })
});
app.get('/spipa/accept/:id', (req, res) => {
  const spipa_req_Id = req.params.id;
  console.log(spipa_req_Id);
  pool.query('select * FROM spipa_req WHERE spipa_req_id=(?);', [spipa_req_Id], (error, results) => {
    if (error) {
      console.error(error);
    }
    else {

      var spipa = {
        spipa_name: results[0].spipa_name,
        spipa_location: results[0].spipa_location,
        spipa_contact: results[0].spipa_contact,
        spipa_password: results[0].spipa_password,
        spipa_emp_role: results[0].spipa_emp_role,
        spipa_email: results[0].spipa_email
      }

      pool.query('INSERT INTO spipa_emp (spipa_name,spipa_location, spipa_contact, spipa_password,' +
        'spipa_email,spipa_emp_role) VALUES (?, ?, ?, ?, ?, ?)',
        [spipa.spipa_name, spipa.spipa_location, spipa.spipa_contact, spipa.spipa_password, spipa.spipa_email, spipa.spipa_emp_role], (error, results) => {
          if (error) {
            console.error(error);
            res.status(500).send('Error insert');
          } else {
            pool.query('DELETE FROM spipa_req WHERE spipa_req_id=(?);', [spipa_req_Id], (error, results) => {
              if (error) {
                console.error(error);
          
              } else {
                async function send(to_mail, message, subject, email) {
                  const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                      user: "jainamsanghavi008@gmail.com",
                      pass: "wmcnnvjipuyqawpf",
                    },
                  });
                  const mailoptions = {
                    from: "jainamsanghavi008@gmail.com",
                    to: to_mail,
          
                    html: email,
                    subject: subject,
                  };
                  try {
                    const result = await transporter.sendMail(mailoptions);
                    console.log("success");
                  } catch (error) {
          
                    console.log("error in dept req reject ", error);
                  }
                }
                send(
                  spipa.spipa_email ,
                 '',
                  "Regarding Spipa Request ",
                  `<h3>Hello </h3> 
                 
                  <hr>
                 Congratulation !  your request for spipa  ${spipa.spipa_emp_role} role in ${spipa.spipa_name}
                 has been accepted by Authority.  
                 
                  <hr>
                  
                 <div>For more detail you can contact to your spipa head
                 and you can see your dashboard when you log into your account.</div>
                  <hr>
                  
                 <div>Best regards.</div>
                  <hr>
          
                 `,
                );
                console.error("deleted");
                res.status(200).send('added in spipa');
              }
            });
          }
        });

    }
  }
  );
});
app.post('/add-training/:id', (req, res) => {
  const { training, training_subject, start_date, end_date } = req.body;
  const spipa_location = req.params.id;
  pool.query('INSERT INTO training_programm (training, training_subject,spipa_location, start_date, end_date)' +
    'values((?),(?),(?),(?),(?))',
    [training, training_subject, spipa_location, start_date, end_date], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error insert');
      } else {
        res.status(200).send('added in dept');
      }
    });
});
app.post('/add-dept-name', (req, res) => {
  const { dept_name } = req.body;
  pool.query('insert into department_info (dept_name) value(?);', [dept_name], (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json(0);
    } else {
      res.status(200).json(1);
    }
  });
});

//adding-quiz



//spipa-cordinator requests
app.post('/add-info', (req, res) => {
  const { title_info, about_info, subject, training } = req.body;
  pool.query('insert into training_info (title_info, about_info, training_subject, training) values((?),(?),(?),(?));', [title_info, about_info, subject, training], (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json(0);
    } else {
      res.status(200).json(1);
    }
  });
});


app.post("/add-cordinator/relation", (req, res) => {
  // console.log("add-training ",req.body);
  let { training, cordinator_id, training_cap } = req.body
  pool.query("insert into spipa_cordinator_training values(?,?,?)", [training, cordinator_id, training_cap])
  res.status(200).send('sucess')
})
app.post("/add-cordinator/send-mail", (req, res) => {
  // console.log("add-training ",req.body);
  let { training, cordinator_id, training_cap } = req.body
  pool.query("select spipa_email from  spipa_emp where spipa_emp_id=(?)", [cordinator_id], (error, result) => {
    if (!error) {
      console.log(result)
      async function send(to_mail, message, subject, email) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "jainamsanghavi008@gmail.com",
            pass: "wmcnnvjipuyqawpf",
          },
        });
        const mailoptions = {
          from: "jainamsanghavi008@gmail.com",
          to: to_mail,

          html: email,
          subject: subject,
        };
        try {
          const result = await transporter.sendMail(mailoptions);
          console.log("success");
        } catch (error) {

          console.log("error", error);
        }
      }
      send(
        result[0].spipa_email,
        `Hello 
         New ${training} is now added under your guidens 
         by spipa admin 

         Now it's your job to handle this training programe .

         Hopefully you will do  your best.

         You will get further details related to your trainning
         when you login to your account 

        `,
        "Training Program Management",
        `<h3>Hello</h3> 
        New <b>${training} training</b> is now added under your guidens 
        by spipa admin .
        <hr>
        
        <div>Now it's your job to handle this training programe .</div>
        <hr>
        
       <div> Hopefully you will do  your best.</div>
        <hr>
        
       <div> You will get further details related to your trainning
        when you login to your account </div>
        <hr>

       `,
      );
    }
  })
  res.status(200).send('sucess')
})


app.get('/training/:id', (req, res) => {
  let cordinator_id = req.params.id;
  pool.query("select training_name from spipa_cordinator_training where cordinator_id=(?)", [cordinator_id], (error, result) => {
    if (!error) {
      res.status(200).send(result)
    }
  })

})


app.post('/spipa/test_role', (req, res) => {
  let { login_id } = req.body;
  pool.query("select * from spipa_cordinator_training where cordinator_id=(?)", [login_id], (error, result) => {
    if (!error) {
      console.log(result)
      if (result.length == 0) {
        res.status(200).send("0")
      }
      else {

        res.status(200).send("1")
      }
    }

  })
})

app.post('/spipa-training-req/:id', (req, res) => {
  let training_name = req.params.id;
  console.log(training_name)
  pool.query("select e.emp_training_subject,e.emp_start_date,e.emp_ending_date,e.spipa_location,e.emp_id,t.emp_name from employee as t inner join emp_training as e on t.emp_id=e.emp_id where emp_training=(?)", [training_name], (error, result) => {
    if (!error) {
      res.status(201).send(result)
    }
  })
})

app.post('/adding_marks', (req, res) => {
  let { mark, emp_id } = req.body
  mark = Number(mark)
  let de = 100
  pool.query("select emp_training,emp_training_subject from emp_training where emp_id=(?)", [emp_id], (error, result) => {
    console.log(result, "result")
    if (!error) {
      result.forEach(element => {
        pool.query("insert into emp_exam_result values(?,?,?,?,?)", [
          emp_id,
          element.emp_training,
          element.emp_training_subject,
          mark,
          100
        ], (error, result) => {
        })
      })
    } else {
      res.status(500).json(0);
    }
  })
})




//testing

app.post("/spipa-training-marks/:id", (req, res) => {
  let training_name = req.params.id;
  console.log(training_name)
  pool.query("select e.emp_subject,e.marks,e.emp_id,t.emp_name from employee as t inner join emp_exam_result as e on t.emp_id=e.emp_id where e.emp_training=(?)", [training_name], (error, result) => {
    if (!error) {
      res.status(201).send(result)
    }
  })
})

app.post("/spipa_exam_check", (req, res) => {
  console.log(req.body, "someh")
  let { training_name, subject } = req.body
  console.log("training", training_name, "subject", subject)
  pool.query("select e.emp_subject,e.marks,e.emp_id,t.emp_name from employee as t inner join emp_exam_result as e on t.emp_id=e.emp_id where e.emp_training=(?) and e.emp_subject=(?)", [training_name, subject], (error, result) => {
    if (!error) {
      res.json(result)
    }

  })
})
app.post("/spipa-training-req-subject", (req, res) => {
  console.log(req.body, "somek")
  let { training_name, subject } = req.body
  console.log("training", training_name, "subject", subject)
  pool.query("select e.emp_start_date,e.emp_ending_date,e.spipa_location,e.emp_id,t.emp_name from employee as t inner join emp_training as e on t.emp_id=e.emp_id where emp_training=(?) and e.emp_training_subject=(?)", [training_name, subject], (error, result) => {
    if (!error) {
      res.json(result)
    }

  })
})


//download excel from table
app.get("/excel/emp_exam/:id/:id2", async (req, res) => {
  const train=req.params.id;
  const sub=req.params.id2;
  try {
    pool.query('SELECT * FROM  emp_exam_result where emp_training=(?) and emp_subject=(?)',[train,sub], (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json(0);
      } else {
        const heading = [["Employee_id", "Training", "Subject", "Marks", "Out_Of"]]
        const workbook = XLSX.utils.book_new()
        const worksheet = XLSX.utils.json_to_sheet(result)
        XLSX.utils.sheet_add_aoa(worksheet, heading)
        XLSX.utils.book_append_sheet(workbook, worksheet, 'employee')
        const buffer = XLSX.write(workbook, { booktype: 'xlsx', type: 'buffer' })
        res.attachment("result.xlsx")
        return res.send(buffer)
      }
    });
  } catch (error) {
    console.log(error)
  }
});

//result showing

app.get('/spipa/result', (req, res) => {
  res.sendFile(__dirname + "/public/pages/result/emp_result.html")
}
)

app.post('/emp_year_check', (req, res) => {
  console.log(req.body)
  let { date, emp_id, training_name, subject } = req.body
  date += "-01-01";

  console.log(date, "date")
  pool.query("SELECT * FROM emp_training WHERE (YEAR(emp_start_date) = YEAR(?) or YEAR(emp_ending_date) = YEAR(?)  )and  emp_id=?   ", [date, date, emp_id], (error, result) => {
    if (error) {
      console.log(error)
    }
    else {
      res.json(result)
    }
  })
})
app.post('/emp_marks_check', (req, res) => {
  console.log(req.body, "in checking")
  let { emp_id, training_name, subject } = req.body

  pool.query("select e.emp_name,e.emp_gender,e.emp_email,e.emp_birth_date,e.emp_phone_no,t.marks,t.out_of from emp_exam_result as t inner join employee as e on e.emp_id=t.emp_id where t.emp_id=? and t.emp_training=? and t.emp_subject=?", [emp_id, training_name, subject], (error, result) => {
    if (error) {
      console.log(error)
    }
    else {
      res.json(result)
    }
  })
})

app.get('/give', (req, res) => {
  res.sendFile(__dirname + '/public/pages/result/certificate.jpg')
})

//for status 
app.get('/employee/status-1/:id', (req, res) => {
  const current_user = req.params.id;
  pool.query('SELECT * FROM emp_training_req where emp_id=(?)', [current_user], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error retrieving');
    } else {
      if (results[0]) {
        res.status(200).json(results);
      }
      else {
        console.log(0)
      }
    }
  });
});
app.get('/employee/status-2/:id', (req, res) => {
  const current_user = req.params.id;
  pool.query('SELECT * FROM spipa_training_req where emp_id=(?)', [current_user], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error retrieving');
    } else {
      if (results[0]) {
        res.status(200).json(results);
      }
      else {
        console.log(0)
      }
    }
  });
});

//for spipa dashboard
app.get('/dashboard/training-info', (req, res) => {
  pool.query('select * from training_info', (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json(0);
    } else {
      res.status(200).json(result);
    }
  });
});
app.get('/dashboard/numberemp', (req, res) => {
  pool.query('select sum(case when emp_start_date LIKE "2022%" then 1 end) as data_2022' +
    ',sum(case when emp_start_date LIKE "2023%" then 1 end) as data_2023,' +
    'sum(case when emp_start_date LIKE "2021%" then 1 end) as data_2021,' +
    'sum(case when emp_start_date LIKE "2020%" then 1 end) as data_2020 from emp_training', (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json(0);
      } else {
        res.status(200).json(result);
      }
    });
});
app.get('/dashboard/gender', (req, res) => {
  pool.query('select count(case when e1.emp_gender="Male" then 1 end) as male_cnt,' +
    'count(case when e1.emp_gender="Female" then 1 end) as female_cnt  from employee as e1 ' +
    'inner join emp_training as e2 on e1.emp_id=e2.emp_id;', (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json(0);
      } else {
        res.status(200).json(result);
      }
    });
});


//adding quiz queries
app.post('/quiz/add-quiz', (req, res) => {
  console.log("", req.body)
  pool.query('insert into exam_info (exam_name, exam_sub, exam_training, exam_time, total_marks) values((?),(?),(?),(?),(?));', [req.body.quiz_name, req.body.quiz_sub_name, req.body.quiz_training, req.body.quiz_time, req.body.total_marks], (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json("error in adding into exam info you might entered same name of quiz");
    } else {
      var i = 0, j = 5, option = {}, que, toughness, correct, marks;
      while (i != (Number(req.body.total_question))) {
        que = Object.values(req.body)[j - 1];
        for (x = 0; x < 4; x++) {
          option[x] = Object.values(req.body)[j];
          j++;
        }
        toughness = Object.values(req.body)[j];
        correct = Object.values(req.body)[j + 1];
        if (toughness == "Easy") {
          marks = req.body.easy_marks;
        }
        else if (toughness == "Medium") {
          marks = req.body.medium_marks;
        }
        else {
          marks = req.body.hard_marks;
        }
        if (correct == "Option-1") {
          correct = 1;
        }
        else if (correct == "Option-2") {
          correct = 2;
        }
        else if (correct == "Option-3") {
          correct = 3;
        }
        else {
          correct = 4;
        }
        pool.query('insert into exam_que (exam_name, que_no, que_statement, que_option_1, que_option_2, que_option_3, que_option_4, marks, correct) values((?),(?),(?),(?),(?),(?),(?),(?),(?));'
          , [req.body.quiz_name, i + 1, que, option[0], option[1], option[2], option[3], marks, correct], (error, result) => {
            if (error) {
              console.error(error);
              res.status(500).json("error in question adding");
            }
          });
        j = j + 3;
        i++;
      }
      res.status(200).json("Successful");
    }
  });
});
app.get("/quiz/exam_name", (req, res) => {

  pool.query('SELECT exam_name FROM exam_info', (error, results) => {
      if (error) {
        console.error(error);
      } else {
          res.status(200).json(results);
      }
    });

});
app.post("/quiz/login", (req, res) => {
  pool.query('SELECT exam_sub,exam_training FROM exam_info where exam_name=(?)',[req.body.exam], (error, results) => {
    if (error) {
      console.error(error);
    } else {
     
      pool.query('SELECT * FROM emp_training where emp_id=(?) and emp_training=(?) and emp_training_subject=(?)'
      ,[req.body.user, results[0].exam_training,results[0].exam_sub], (error2, results2) => {
        if (error2) {
          console.error(error2);
        } else {
            if(results2[0]){
              res.status(200).json(1);
            }
            else{
              res.status(200).json(0);
            }
        }
      });
    }
  });
});
app.get("/quiz/exam-info/:id", (req, res) => {
  const exam=req.params.id;
  pool.query('SELECT * FROM exam_info where exam_name=(?)',[exam], (error, results) => {
    if (error) {
      console.error(error);
    } else {
        res.status(200).json(results);
    }
  });
});
app.get("/quiz/questions/:id", (req, res) => {
  const exam=req.params.id;
  pool.query('SELECT exam_name, que_no, que_statement, que_option_1, que_option_2, que_option_3, que_option_4, marks FROM exam_que where exam_name=(?)',[exam], (error, results) => {
    if (error) {
      console.error(error);
    } else {
        res.status(200).json(results);
    }
  });
});
app.post("/quiz/submit", (req, res) => {
  if(!req.body.user){
    res.status(200).json(3)
  }
  else{
    pool.query('SELECT * FROM exam_info where exam_name=(?)',[req.body.exam], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json(0);
      } else {
          var emp_id=req.body.user,out_of = results[0].total_marks, emp_subject = results[0].exam_sub,
          emp_training = results[0].exam_training,marks=0;
          pool.query('SELECT correct,marks FROM exam_que where exam_name=(?)',[req.body.exam], (error2, results2) => {
            if (error2) {
              console.error(error2);
              res.status(500).json(0);
            } else {
              console.log("correct:",results2)
              console.log("que_ans:",req.body.que_ans)
              for (let x = 0; x < results2.length; x++) {
                if(results2[x].correct==req.body.que_ans[x]){
                  marks+=results2[x].marks
                }
              }
              //insert evrything
              pool.query('insert into emp_exam_result (emp_id, out_of,emp_subject,emp_training, marks) values((?),(?),(?),(?),(?));'
            , [emp_id, out_of,emp_subject,emp_training, marks], (error3, result3) => {
              if (error3) {
                res.status(200).json(2)
              }
              else{
                res.status(200).json(1);
              }
            });
            }
          });
      }
    });
  }
  
});


//for attendance 

app.get("/attendence/:training/:subject", (req, res) => {
  let train=req.params.training
  let sub=req.params.subject
  console.log(train,sub,"in attendance")
  pool.query(
    'select * from employee inner join emp_training on employee.emp_id = emp_training.emp_id where emp_training = (?) and emp_training_subject = (?) ',[train,sub],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error retrieving company");
      } else {
        res.status(200).json(results);
      }
    }
  );
});


app.get("/attendence/present/:id/:name/:utc/:subject/:training", (req, res) => {
  const emp_id = req.params.id;
  const emp_training = req.params.training;
  const emp_subject = req.params.subject;
  const emp_name = req.params.name;
  const attendenceDate = req.params.utc;
  const pa = "present";

  pool.query(
    "INSERT INTO attendence (emp_id,emp_name,emp_training, emp_subject, emp_date,pa )VALUES (?, ?, ?, ?, ?,?)",
    [emp_id, emp_name, emp_training, emp_subject, attendenceDate, pa],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(200).json(0);
      } else {
        res.status(200).json(1);
      }
    }
  );
});

app.get("/attendence/absent/:id/:name/:utc/:subject/:training", (req, res) => {
  const emp_id = req.params.id;
  const emp_training = req.params.training;
  const emp_subject = req.params.subject;
  const emp_name = req.params.name;
  const attendenceDate = req.params.utc;
  const pa = "absent";

  pool.query(
    "INSERT INTO attendence (emp_id,emp_name,emp_training, emp_subject, emp_date,pa )VALUES (?, ?, ?, ?, ?,?)",
    [emp_id, emp_name, emp_training, emp_subject, attendenceDate, pa],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(200).json(0);
      } else {
        res.status(200).json(1);
      }
    }
  );
});


app.get('/attendence/excel/:id/:id2/:id3', (req, res) => {
  const train=req.params.id;
  const sub=req.params.id2;
  const date=req.params.id3;
  console.log(train+sub+date)
  try {
    pool.query('SELECT * FROM attendence where emp_training=(?) and emp_subject=(?) and emp_date=(?)',[train,sub,date], (error, result) => {
      if (error) {
        console.error(error);
        res.status(200).json(0);
      } else {
        
        const heading = [["Employee_id", "Name" ,"Training", "Subject", "Date", "P/A"]]
        const workbook = XLSX.utils.book_new()
        const worksheet = XLSX.utils.json_to_sheet(result)
        XLSX.utils.sheet_add_aoa(worksheet, heading)
        XLSX.utils.book_append_sheet(workbook, worksheet, 'employee')
        const buffer = XLSX.write(workbook, { booktype: 'xlsx', type: 'buffer' })
        res.attachment("result.xlsx")
        return res.send(buffer)
      }
    });
  } catch (error) {
    console.log(error)
  }

  });



const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started on ${PORT} `);
});