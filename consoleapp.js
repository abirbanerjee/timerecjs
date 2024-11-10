import inquirer from "inquirer";
import select, { Separator } from "@inquirer/select";
import sqlite3 from "sqlite3";
const db = new sqlite3.Database("projects.db");
function showProjects() {
  db.each("select rowid,* from recordings", (err, row) => {
    if (err) console.log(err);
    else console.log(row);
  });
}

async function promptMonthYear() {
  const timestamp = await inquirer.prompt({
    type: "text",
    name: "monthYear",
    message: "Select the month and the year:",
    prefix: " 🌎 ",
    default:
      (new Date().getMonth() + 1).toString().padStart(2, 0) +
      "-" +
      new Date().getFullYear(),
    clearable: true,
  });
  let monthYear = timestamp.monthYear.split("-");
  return monthYear;
}

async function getAllProjects() {
  return new Promise((resolve, reject) => {
    let projects = [];
    db.all("select rowid, * from projects", (err, rows) => {
      if (!err) {
        rows.forEach((row) => {
          projects.push([row.rowid, row.name, row.project_name]);
        });
        resolve(projects);
      }
    });
  });
}

async function promptProjects() {
  const projects = await getAllProjects();
  const projectNames = [];
  const comapanies = [];
  const projectIds = [];
  projects.forEach((project) => {
    comapanies.push(project[1]);
    projectIds.push(project[0]);
    projectNames.push(`${project[1]} - ${project[2]}`);
  });

  const choices = [];
  projectNames.forEach((name, index) => {
    choices.push({
      name: name,
      value: projectIds[index],
    });
  });
  const answer = await select({
    message: "Choose a project",
    choices: choices,
  });
  //   return answer.split("-").map((item) => item.trim());
  return {
    company: comapanies[parseInt(answer) - 1],
    project: projectNames[parseInt(answer) - 1],
  };
}

async function getProjectDetails(companyName, monthYear) {
  return new Promise((resolve, reject) => {
    let details = [];
    db.all(
      `select projects.project_id,projects.project_name, recordings.hours from projects left join recordings on projects.project_id = recordings.project_id where projects.name = '${companyName}' and recordings.date like '${monthYear}%'`,
      (err, rows) => {
        if (err) reject(err);
        rows.forEach((row) => {
          details.push(row);
        });
        let projectDetail = {};
        details.forEach((detail) => {
          if (Object.keys(projectDetail).indexOf(detail.project_name) === -1) {
            projectDetail[`${detail.project_name}`] = detail.hours;
          } else {
            projectDetail[`${detail.project_name}`] += detail.hours;
          }
        });
        resolve(projectDetail);
      }
    );
  });
}

async function hoursForACompany(companyName) {
  let totHours = 0;
  console.log(companyName.company);
  db.all(
    `select projects.project_id,projects.project_name, recordings.hours from projects left join recordings on projects.project_id = recordings.project_id where name = '${companyName}'`,
    (err, rows) => {
      console.log(rows, err);
    }
  );
}

async function start() {
  while (1 === 1) {
    const answer = await select({
      message: "Select an option to proceed",
      choices: [
        {
          name: "Create a new time entry.",
          value: 1,
          description: "Creates a new time recording entry",
        },
        {
          name: "Get hours in a month",
          value: 2,
          description: "Get monthly hours for a company",
        },
        new Separator(),
        {
          name: "Exit",
          value: 3,
          disabled: false,
        },
        {
          name: "pnpm",
          value: "pnpm",
          disabled: "(pnpm is not available)",
        },
      ],
    });
    console.log(answer);
    switch (answer) {
      case 2:
        const monthYear = await promptMonthYear();
        const company = await promptProjects();
        console.log(monthYear, company);
        const hours = await getProjectDetails(
          company.company,
          monthYear.reverse().join("-")
        );
        console.log(hours);
        continue;
      case 3:
        return;
    }
  }
}

function test() {
  let name = "abcGropper";
  db.all(`select name from projects where name like '%ropper'`, (err, rows) => {
    if (err) console.log(err);
    else console.log(rows);
  });
}

// test();
// start();
// getProjectDetails("Gropper");
let functions = {
  getAllProjects,
  getProjectDetails,
};
export default functions;
