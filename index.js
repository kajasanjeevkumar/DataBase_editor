const { faker } = require('@faker-js/faker');
const mysql=require('mysql2');
const express=require("express");
const app=express();
const path=require("path");
const methodOverride=require("method-override");
const { v4: uuidv4 } = require("uuid");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
// app.use(express.static(path.join(__dirname,"public")));

const connection =mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password:'666666'
  });

  let getRandomUser = () =>{
    return [
      faker.string.uuid(),
       faker.internet.userName(),
      faker.internet.email(),
      faker.internet.password(),
    ];
    };

    
  let q="INSERT INTO user(id,username,email,password) values ?";
  let data=[];
  for(let i=1;i<=50;i++)
  {
    data.push(getRandomUser());
  }
 
  
//Home Route
app.get("/",(req,res)=>{
  let q=`select count(*) from user`;
  try
    {
      connection.query(q,(err,result)=>{
          if (err) throw err;
          let count=(result[0]["count(*)"]);
          res.render("home.ejs",{count});
         
        });
    }
    catch(err)
    {
      console.log(err);
      res.render("Some Error in DB");
    }
});


//show.print all users in form of table
app.get("/user",(req,res)=>{
  let q=`SELECT * FROM USER`;
  try
    {
      connection.query(q,(err,users)=>{
          if (err) throw err;
          // res.send(result);
         res.render("showusers.ejs",{users});
        });
    }
    catch(err)
    {
      console.log(err);
      res.render("Some Error in DB");
    }
});


//edit Route 
app.get("/user/:id/edit",(req,res)=>{
   let {id}=req.params;
   let q=`SELECT * FROM USER WHERE id='${id}'`;
   try
    {
      connection.query(q,(err,result)=>{
          if (err) throw err;
          let user=result[0];
         res.render("edit.ejs",{user});
        });
    }
    catch(err)
    {
      console.log(err);
      res.render("Some Error in DB");
    }
});


//update route
app.patch("/user/:id",(req,res)=>{
  let {id}=req.params;
  let{password:formPass,username:newUsername}=req.body;
   let q=`SELECT * FROM USER WHERE id='${id}'`;
  try
    {
      connection.query(q,(err,result)=>{
          if (err) throw err;
          let user=result[0];
          if(formPass!=user.password)
          {
            res.send("Wrong Password");
          }
          else
          {
             let q2=`UPDATE USER SET username='${newUsername}' where id='${id}'`;
            connection.query(q2,(err,result)=>{
              if(err) throw err;
              res.redirect("/user");
            });
          }
        });
    }
    catch(err)
    {
      console.log(err);
      res.render("Some Error in DB");
    }
});

//take new user input
app.get("/user/new",(req,res)=>{
  res.render("new.ejs");
});
//add new user to database and actual page
app.post("/user/new",(req,res)=>{
  let {email,username,password}=req.body;
  let id=uuidv4();
  let q=`INSERT INTO user(id,email,username,password) VALUES ('${id}','${email}','${username}','${password}')`;
  try
  {
    connection.query(q,(err,result)=>{
        if (err) throw err;
        console.log("New User Added");
        res.redirect("/user");
      });
  }
  catch(err)
  {
    console.log(err);
    res.render("Some Error in DB");
  }
});

//delete user
app.get("/user/:id/delete",(req,res)=>{
  let {id}=req.params;
  let q=`DELETE FROM USER WHERE id='${id}'`;
  try
  {
    connection.query(q,(err,result)=>{
        if (err) throw err;
        console.log("User deleted");
        res.redirect("/user");
      });
  }
  catch(err)
  {
    console.log(err);
    res.render("Some Error in DB");
  }
});


app.listen("8080",()=>{
  console.log("Listening to port 8080");
});


 //pushing 100 users data
// try
//   {
//     connection.query(q,[data],(err,result)=>{
//         if (err) throw err;
//         console.log(result);
       
//       });
//   }
//   catch(err)
//   {
//     console.log(err);
//   }
 
// connection.end();