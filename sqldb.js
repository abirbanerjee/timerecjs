import * as mysql from "mysql2";
import "dotenv/config";

let connection = mysql.createConnection({
  host: process.env.DATABASE_URL,
  port: process.env.DATABASE_PORT,
  user: process.env.dbuser,
  password: process.env.dbpassword,
  database: process.env.DATABASE_NAME,
});

// connection.query(
//   "CREATE table recordings ( record_id int auto_increment,project_id int , date varchar(10), hours float, primary key(record_id) )",
//   (err, result, fields) => {
//     if (err) console.log(err);
//     else {
//       console.log(result, fields);
//     }
//   }
// );

export async function createEntry(company, project, date, hours) {
  return new Promise((resolve, reject) => {
    connection.connect();
    connection.query(
      `SELECT project_id from projects where name = ${company} and prject_name = ${project}`,
      (err, rows) => {
        if (err) reject(err);
        console.log(rows);
        connection.query(
          `insert into recordings values(${rows[0].project_id},'${date}', '${hours}' )`,
          (err, rows) => {
            if (err) reject(err);
            else resolve({ status: "success" });
          }
        );
      }
    );
  });
}

// export async function getProjectDetails(companyName, monthYear) {
//   return new Promise((resolve, reject) => {
//     let details = [];
//     connection.query(
//       `select projects.project_id,projects.project_name, recordings.hours from projects left join recordings on projects.project_id = recordings.project_id where projects.name = '${companyName}' and recordings.date like '${monthYear}%'`,
//       (err, rows, fields) => {
//         if (err) reject(err);
//         rows.forEach((row) => {
//           details.push(row);
//         });
//         let projectDetail = {};
//         details.forEach((detail) => {
//           if (Object.keys(projectDetail).indexOf(detail.project_name) === -1) {
//             projectDetail[`${detail.project_name}`] = detail.hours;
//           } else {
//             projectDetail[`${detail.project_name}`] += detail.hours;
//           }
//         });
//         resolve(projectDetail);
//       }
//     );
//   });
// }

// connection.query("SELECt * from projects", (err, result, fields) => {
//   if (err) console.log(err);
//   else {
//     console.log(result, fields);
//   }
// });
