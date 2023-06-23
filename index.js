import express from "express";
import bodyParser from "body-parser";
import { todoRoutes } from "./source/routes/todo-routes.js";

const app = express();
const port = 3000;

app.use(express.static("source/public"));
app.use(bodyParser.json());
app.use("/todos", todoRoutes);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening at http://localhost:${port}`);
});
