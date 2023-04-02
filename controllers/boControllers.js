const dbo = require("../model/data");

exports.infoBO = async (req, res) => {
  const user = await dbo
    .getDb()
    .collection("back-officer")
    .findOne({ user_id: req.body.user_id });
  res.send(user);
};

exports.viewMCP = async (req, res) => {
  const MCPs = await dbo
    .getDb()
    .collection("tasks")
    .find({ isAssigned: false })
    .toArray();
  res.send(MCPs);
};

exports.viewWorker = async (req,res) =>{
    const worker = await dbo.getDb().collection("worker").find({}).toArray();
    console.log(worker)
    res.send(worker);
}