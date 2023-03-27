const express = require('express')
const cors = require('cors');
const app = express()
app.use(cors());
app.get('/api',(req,res)=>{
    res.send("hello world");
});
const port = 4000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
