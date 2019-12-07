const inquirer = require('inquirer');
const Intern = require("./lib/intern.js");
const Engineer = require("./lib/engineer.js");
const Manager = require("./lib/manager.js");
const mustache = require("mustache");
const fs = require("fs");
const util = require("util");
const jest = require("jest");
const writeFileAsync = util.promisify(fs.writeFile);
let template = "";

const team = [];


init();

function init(){

    inquirer
    .prompt([
        /* Pass your questions in here */
        {
            type:"checkbox",
            message:"Which type of employee would you like to create?",
            choices: ["Intern", "Engineer", "Manager"],
            name: "employeeType"
        }
    
      ])
      .then(answers => {
        // Use user feedback for... whatever!!
        console.log(answers);
        switch(answers.employeeType[0]) {
            case "Intern":
              // code block
              getInternQuestions();
              break;
            case "Engineer":
              getEngineerQuestions();
              break;
            case "Manager":
                getManagerQuestions();
              break;
            default:
              // code block
          }
      }); 
    


}


  function getInternQuestions(){
      inquirer
      .prompt([
          {
              type: "input",
              message: "What is the intern's name?",
              name: "internName"
          },
          {
            type: "input",
            message: "What is the intern's email?",
            name: "internEmail"
        },
        {
            type: "input",
            message: "What is the intern's ID?",
            name: "internID"
        },
        {
            type: "input",
            message: "What is the intern's school?",
            name: "internSchool"
        },
        {
            type:"checkbox",
            message: "Do you want to create another employee?",
            choices: ["Yes", "No"],
            name: "anotherEmployee"
        }

      ]).then(answers => {
        // console.log(answers);
        let employee = new Intern(answers.internName, answers.internID, answers.internEmail,  answers.internSchool);
        team.push(employee);
        console.log(team);

        anotherEmployee(answers);
      })
  }

  function getEngineerQuestions(){
    inquirer
    .prompt([
        {
            type: "input",
            message: "What is the engineer's name?",
            name: "engineerName"
        },
        {
          type: "input",
          message: "What is the engineer's email?",
          name: "engineerEmail"
      },
      {
          type: "input",
          message: "What is the engineer's ID?",
          name: "engineerID"
      },
      {
          type: "input",
          message: "What is the engineer's github username?",
          name: "engineerGithub"
      },
      {
          type:"checkbox",
          message: "Do you want to create another employee?",
          choices: ["Yes", "No"],
          name: "anotherEmployee"
      }

    ]).then(answers => {
      console.log(answers);
      team.push(new Engineer(answers.engineerName,  answers.engineerID, answers.engineerEmail, answers.engineerGithub));

      anotherEmployee(answers);
    })
}

function getManagerQuestions(){
    inquirer
    .prompt([
        {
            type: "input",
            message: "What is the manager's name?",
            name: "managerName"
        },
        {
          type: "input",
          message: "What is the manager's email?",
          name: "managerEmail"
      },
      {
          type: "input",
          message: "What is the manager's ID?",
          name: "managerID"
      },
      {
          type: "input",
          message: "What is the manager's office number?",
          name: "managerOfficeNumber"
      },
      {
          type:"checkbox",
          message: "Do you want to create another employee?",
          choices: ["Yes", "No"],
          name: "anotherEmployee"
      }

    ]).then(answers => {
      console.log(answers);
      team.push(new Manager(answers.managerName, answers.managerID, answers.managerEmail,  answers.managerOfficeNumber));

      anotherEmployee(answers);
    })
}


  function anotherEmployee(answers){
    if (answers.anotherEmployee[0] === "Yes"){
        init();
    } else if (answers.anotherEmployee[0] === "No"){
        // Generate HTML Page
        generateHtml();
    }

  }

  async function generateHtml(){
    try {

    let html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Team Page</title>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
        <link rel="stylesheet" href="style.css">
    </head>
    <body style="background-color: white">
            <h1>
                My Team
            </h1>
            <div class="container" style="max-width: 960px; margin: 50px auto">
            `
          for(let i = 0; i<team.length; i++){
              if(i % 3 == 0){
                html += `<div class="row justify-content-center">
                `
              }
              if(team[i].getRole() == "Manager"){
                template = fs.readFileSync('templates/manager.html', 'utf8');
              }
              else if(team[i].getRole() == "Engineer"){
                template = fs.readFileSync('templates/engineer.html', 'utf8');
              }
              else if(team[i].getRole() == "Intern"){
                template = fs.readFileSync('templates/intern.html', 'utf8');
              }
             
              let filled = mustache.render(template, team[i])
              html += filled;
              if((i % 3 == 2) || (i == (team.length-1))){
                html += `</div>
                `
              }
          }
          html += `  </div>
          </body>
    </html>`
    await writeFileAsync("output/index.html", html);
    console.log("Successfully wrote to index.html in the output folder");
  } catch (err) {
    console.log(err);
  }
  }


