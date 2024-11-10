import express from "express";
import cors from "cors";
import * as dbops from "./database.js";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("build"));
app.listen(process.env.PORT, () => {
  console.log("http://localhost:" + process.env.PORT);
});

app.get("/getprojects", async (req, res) => {
  const response = await dbops.default.getAllProjects();
  return res.send(response);
});

app.get("/getmonthlyreport/:monthyear", async (req, res) => {
  const { monthyear } = req.params;
  const response = await dbops.default.getMonthlyReport(monthyear);
  console.log(response);
  return res.send(response);
});

app.get("/getcompanyreport/:company", async (req, res) => {
  const { company } = req.params;
  const response = await dbops.default.getProjectLifetimeDets(company);
  response.forEach((item) => {
    delete item.project_id;
  });
  return res.send(response);
});

app.post("/record", async (req, res) => {
  const { company, project, date, hours } = req.body;
  return res.send(
    await dbops.default.insertNewRecord(company, project, date, hours)
  );
});
