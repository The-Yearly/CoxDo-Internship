import express from "express";
import { router } from "./routes/api";
var cors = require("cors");
const port = 3001;
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", router);

app.listen(process.env.PORT || port);
app.get("/test", (req, res) => {
  res.json("Hello");
});
console.log("Server started at http://localhost:" + port);

module.exports = app;
