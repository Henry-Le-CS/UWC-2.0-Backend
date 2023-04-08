const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express()
const dbo = require('./model/data')
let db = dbo.getDb();
const userRouter = require("./routes/userRouter")
const boRouter = require("./routes/boRouter")
const workerRouter = require("./routes/workerRouter")
app.use(cors());
app.use(bodyParser.json()); 
app.use("/",userRouter);
app.use("/",boRouter);
app.use("/",workerRouter);
const port = 8000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
