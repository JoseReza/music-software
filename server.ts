console.log("-->Starting Software");

import express from "express";

const port = 3000;
const app = express();

app.use("/", express.static(__dirname));

app.listen(port, function () {
  console.log(`-->App listening on port ${port}`);
});
