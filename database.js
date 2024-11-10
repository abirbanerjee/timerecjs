import sqlite3 from "sqlite3";
const db = new sqlite3.Database("projects.js");

export default {
  getProjectDetails: async function getProjectDetails(companyName, monthYear) {
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
            if (
              Object.keys(projectDetail).indexOf(detail.project_name) === -1
            ) {
              projectDetail[`${detail.project_name}`] = detail.hours;
            } else {
              projectDetail[`${detail.project_name}`] += detail.hours;
            }
          });
          resolve(projectDetail);
        }
      );
    });
  },
  getAllProjects: async function getAllProjects() {
    return new Promise((resolve, reject) => {
      let projects = {};
      db.all("select rowid, * from projects", (err, rows) => {
        if (!err) {
          rows.forEach((row) => {
            if (Object.keys(projects).indexOf(row.name) === -1) {
              projects[`${row.name}`] = [row.project_name];
            } else {
              projects[`${row.name}`].push(row.project_name);
            }
          });
          resolve(projects);
        }
      });
    });
  },
  getMonthlyReport: async function getMonthlyReport(monthYear) {
    return new Promise((resolve, reject) => {
      let details = [];
      db.all(
        `select projects.name,projects.project_id,projects.project_name, recordings.hours from projects left join recordings on projects.project_id = recordings.project_id where recordings.date like '${monthYear}%'`,
        (err, rows) => {
          if (err) reject(err);
          rows.forEach((row) => {
            details.push(row);
          });
          let projectDetail = {};
          details.forEach((detail) => {
            if (
              Object.keys(projectDetail).indexOf(
                `${detail.name} - ${detail.project_name}`
              ) === -1
            ) {
              projectDetail[`${detail.name} - ${detail.project_name}`] =
                detail.hours;
            } else {
              projectDetail[`${detail.name} - ${detail.project_name}`] +=
                detail.hours;
            }
          });
          resolve(projectDetail);
        }
      );
    });
  },

  getProjectLifetimeDets: async (companyName) => {
    return new Promise((resolve, reject) => {
      let detail = {};
      db.all(
        `select projects.name,projects.project_id,projects.project_name, recordings.date, recordings.hours from projects left join recordings on projects.project_id = recordings.project_id where projects.name like '${companyName}'`,
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  },
  insertNewRecord: async (company, project, date, time) => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT project_id from projects where name ='${company}' and project_name = '${project}'`,
        (err, rows) => {
          if (err) reject(err);
          db.run(
            `INSERT into recordings values('${rows[0].project_id}', '${date}','${time}')`,
            (result, error) => {
              if (error) reject(err);
              resolve({ status: "success" });
            }
          );
        }
      );
    });
  },
};
