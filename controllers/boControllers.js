const dbo = require("../model/data");
const { ObjectId } = require('mongodb');

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

exports.viewWorker = async (req, res) => {
  const worker = await dbo.getDb().collection("worker").find({}).toArray();
  res.send(worker);
};

// const { ObjectId } = require("mongodb");
// const dbo = require("../db/db");

exports.assignUser = async (req, res) => {
  const MCPs = req.body.mcp_id;
  const Workers = req.body.worker_id;
  try {
    const WorkerCollection = await dbo.getDb().collection("worker");
    await Promise.all(
      Workers.map(async (worker_id) => {
        const filter = { _id: new ObjectId(worker_id) };
        const update = { $set: { is_avail: false, tasks: MCPs } };
        await WorkerCollection.updateOne(filter, update);
      })
    );
    const TaskCollection = await dbo.getDb().collection("tasks");
    await Promise.all(
      MCPs.map(async (mcp_id) => {
        const filter = { _id: new ObjectId(mcp_id) };
        const update = { $set: { isAssigned: true } };
        await TaskCollection.updateOne(filter, update);
      })
    );
    const GroupCollection = await dbo
      .getDb()
      .collection("group")
      .insertOne({ worker_id: Workers, vehicle_id: "", mcp_id: MCPs });
    res.send("Assign task successfully");
  } catch (err) {
    res.send(err);
  }
};


// exports.assignUser = async (req, res) => {
//   const MCPs = req.body.mcp_id;
//   const Workers = req.body.worker_id;
//   try {
//     // const WorkerCollection = await dbo.getDb().collection("worker");
//     // const filter = {
//     //   _id: { $in: Workers.map((worker_id) => ObjectId(worker_id)) },
//     // };
//     // const update = {
//     //   $push: { tasks: { $each: MCPs } },
//     //   $set: { is_avail: false },
//     // };
//     // await WorkerCollection.updateMany(filter, update);

//     // const TaskCollection = await dbo.getDb().collection("tasks");
//     // const filterMCPs = { _id: { $in: MCPs.map((mcp_id) => ObjectId(mcp_id)) } };
//     // const updateMCPs = { $set: { isAssigned: true } };
//     // await TaskCollection.updateMany(filterMCPs, updateMCPs);

//     const groupDoc = { worker_id: Workers, vehicle_id: "", mcp_id: MCPs };
//     await dbo.getDb().collection("group").insertOne(groupDoc);

//     res.send("Assign task successfully");
//   } catch (err) {
//     res.send(err);
//   }
// };
