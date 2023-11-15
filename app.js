const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require('dotenv').config()


var pool = mysql.createConnection({
  host: process.env.DB_HOST,
  port:process.env.port,
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
          console.log("error");
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

app.get("/employee/options",(req,res)=>{
  console.log("here")
  pool.query("select * from department_info",(error, results) => {
    if (!error) {
    k=JSON.stringify(results)
   console.log(results);
    res.json({results1:results})
    
   
  }
})
})

//Department

app.post("/department/signin", (req, res) => {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; 
  var yyyy = today.getFullYear();
  today = yyyy+'-'+mm+'-'+dd;
  const employeeDetail = {
    role: req.body.dept_emp_role,
    email: req.body.dept_email,
    department: req.body.dept_name,
    pass: req.body.dept_password,
    location: req.body.dept_location,
    contact: req.body.dept_contact,
    date:today
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
  const { login_id, login_role , login_password} = req.body;
  const userId = login_id;
  const role = login_role;
  const userPassword = login_password;
  if(userId && userPassword){
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
  else{
    res.status(200).json(0);
  }
});

app.post("/department/test", (req, res) => {
  const { userdept, roledept } = req.body;
  if (userdept == 0) {
    res.status(500).json(0);
  }
  else {
    if(roledept=='Operator'){
      res.status(200).json(1);
    }
    if(roledept=='Admin'){
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
app.post("/employee/trainning_name",(req,res)=>{
  let {lw}=req.body
  if(lw){
    
    pool.query('select  training  from training_programm where training_subject=(?) ',[lw],(error,result)=>{
      if(!error){
        
        res.send(result)
        
      }
      if(error){

        console.error(error)
      }
    }  )
    
  }
  
  
})
app.post("/employee/subject",(req,res)=>{
let {lw}=req.body;
if(lw){
  pool.query('select distinct training_subject  from training_programm where spipa_location=(?) ',[lw],(error,result)=>{
    if (error) {
      console.error(error)
    }
    if(!error){
      res.send(result)
    }
  }  )
  
}
app.post("/employee/date",(req,res)=>{
  console.log(req.body)
  let {lw,val1,val3}=req.body
  if(lw && val1  && val3){
    pool.query("select start_date,end_date from training_programm where training=(?) and spipa_location=(?) and training_subject=(?) ",[lw,val1,val3],(error,result)=>{
      if (error) {
        console.error(error)
      }
      if(!error){  
        res.send(result)
      }
    })
  }

})
});
app.post("/employee/req-apply", (req, res) => {
  let {getUser,center,subject,training,starting_date,ending_date}=req.body;
  pool.query(
    "select * FROM emp_training_req WHERE emp_id=(?) and emp_training=(?);",
    [getUser,training],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error retrieving");
      } else {
        if(results && results[0]){
          res.status(200).json(2);
        }
        else{
          pool.query(
            "select * FROM spipa_training_req WHERE emp_id=(?) and emp_training=(?);",
            [getUser,training],
            (error, results) => {
              if (error) {
                console.error(error);
                res.status(500).send("Error retrieving company");
              } else {
                if (error) {
                  console.error(error);
                  res.status(500).send("Error retrieving");
                } else {
                  if(results && results[0]){
                    res.status(200).json(2);
                  }
                  else{
                    if(getUser && center && subject && training && starting_date && ending_date){
                      pool.query("select emp_name from employee where emp_id=(?)",[getUser],(error,result)=>{
                        if(error){
                          console.log(error);
                          res.status(500).send("Error retrieving");
                        }
                        if(!error){
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
                            ,(error,result)=>{
                              if(error){
                                console.log(error)
                              }
                              else{
                                console.log("success")
                                res.status(200).json(1);
                              }
                            }
                          );
                          
                        }
                      })
                      
                    }
                     else{
                      console.log(getUser,center,subject,training,starting_date,ending_date)
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
        if(results[0]){
          res.status(200).json(results[0].dept_name);
        }
        
      }
    }
  );
});
app.get("/reject/:id", (req, res) => {
  const req_Id = req.params.id;
  console.log(req_Id);
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
    pool.query('SELECT * from emp_training inner join (SELECT emp_id FROM employee where emp_operator=(?)) e1 on emp_training.emp_id=e1.emp_id',[current_user], (error, results) => {
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
  pool.query("SELECT * FROM emp_exam inner join (SELECT emp_id FROM employee where emp_operator=(?)) e1 on emp_exam.emp_id=e1.emp_id", [current_user], (error, results) => {
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
  pool.query('SELECT * from emp_training_req inner join (SELECT emp_id FROM employee where emp_operator=(?) and emp_dept_name=(?)) e1 on emp_training_req.emp_id=e1.emp_id',[current_user,dept_name], (error, results) => {
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
  pool.query('DELETE FROM dept_req WHERE dept_req_id=(?);', [dept_req_Id], (error, results) => {
      if (error) {
          console.error(error);
          res.status(500).send('Error');
      } else {
          res.status(200).json("deleted");
      }
  });
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
              [dept.dept_name, dept.dept_location, dept.dept_contact, dept.dept_password, dept.dept_email,dept.dept_emp_role], (error, results) => {
                  if (error) {
                      console.error(error);
                      res.status(500).send('Error insert');
                  } else {
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

        if(results[0]!=null){
          res.status(200).json(1);
        }
        else{
          res.status(200).json(0);
        }  
      }
  });
});
app.post('/dept-add/:id', (req, res) => {
  const{dept_location, dept_contact, dept_password, dept_email} = req.body;
  const dept_name=req.params.id;
  const dept_emp_role='operator';
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
  if (userspipa == 0) {
    res.status(500).json(0);
  }
  else {
    if(rolespipa=='Operator'){
      res.status(200).json(1);
    }
    if(rolespipa=='Admin'){
      res.status(200).json(2);
    }
  }
});
app.post("/spipa/login", (req, res) => {
  const { login_id, login_password } = req.body;
  const userId = login_id;
  const userPassword = login_password;
  if(userPassword && userId){
    pool.query(
      "SELECT spipa_password FROM spipa_emp where spipa_emp_id=(?)",
      [userId],
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
  else{
    res.status(200).json(0);
  }
  
});
app.get("/spipa/add-quiz", (req, res) => {
  res.sendFile(__dirname + "/public/pages/spipa/addQuiz.html");
});

app.post("/spipa/signin", (req, res) => {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; 
  var yyyy = today.getFullYear();
  today = yyyy+'-'+mm+'-'+dd;
  const employeeDetail = {
    role: req.body.spipa_emp_role,
    email: req.body.spipa_email,
    department: req.body.spipa_name,
    pass: req.body.spipa_password,
    location: req.body.spipa_location,
    contact: req.body.spipa_contact,
    date:today
  };

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
        if(results[0]){
          res.status(200).json(results[0].spipa_name);
        }
        
      }
    }
  );
});

app.get('/spipa-emptrain-req/:id', (req, res) => {
  console.log(req.params.id,"request")
  const spipa_name = req.params.id;
  pool.query('SELECT * from spipa_training_req where spipa_location=(?)',[spipa_name], (error, results) => {
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
  pool.query(
    "DELETE FROM spipa_training_req WHERE req_id=(?);",
    [req_Id],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error retrieving");
      } else {
        console.log("deleted");
        res.status(200).json(results);
      }
    }
  );
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
  pool.query('DELETE FROM spipa_req WHERE spipa_req_id=(?);', [spipa_req_Id], (error, results) => {
      if (error) {
          console.error(error);
          res.status(500).send('Error');
      } else {
          res.status(200).json("deleted");
      }
  });
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
              [spipa.spipa_name, spipa.spipa_location, spipa.spipa_contact, spipa.spipa_password, spipa.spipa_email,spipa.spipa_emp_role], (error, results) => {
                  if (error) {
                      console.error(error);
                      res.status(500).send('Error insert');
                  } else {
                      res.status(200).send('added in spipa');
                  }
              });

      }
  }
  );
  pool.query('DELETE FROM spipa_req WHERE spipa_req_id=(?);', [spipa_req_Id], (error, results) => {
      if (error) {
          console.error(error);

      } else {
          console.error("deleted");
      }
  });
});
app.post('/add-training/:id', (req, res) => {
  const{training, training_subject, start_date, end_date} = req.body;
  const spipa_location=req.params.id;
  pool.query('INSERT INTO training_programm (training, training_subject,spipa_location, start_date, end_date)'+
  'values((?),(?),(?),(?),(?))',
      [training, training_subject,spipa_location, start_date, end_date], (error, results) => {
          if (error) {
              console.error(error);
              res.status(500).send('Error insert');
          } else {
              res.status(200).send('added in dept');
          }
      });
});
app.post('/add-dept-name', (req, res) => {
  const{dept_name} = req.body;
  pool.query('insert into department_info (dept_name) value(?);', [dept_name], (error, result) => {
          if (error) {
              console.error(error);
              res.status(500).json(0);
          } else {
              res.status(200).json(1);
          }
      });
});
const PORT=3000 | process.env.PORT
app.listen(process.env.PORT, () => {
  console.log(`Server started on ${PORT} `);
});