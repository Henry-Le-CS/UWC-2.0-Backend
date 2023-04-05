const dbo = require("../model/data");
const { ObjectId } = require("mongodb");

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

exports.assignUser = async (req, res) => {
  const MCPs = req.body.mcp_id;
  const Workers = req.body.worker_id;
  const timeStamp = req.body.timeStamp;
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
    const GroupCollection = await dbo.getDb().collection("group").insertOne({
      worker_id: Workers,
      vehicle_id: "",
      mcp_id: MCPs,
      day: timeStamp.day,
      month: timeStamp.month,
      year: timeStamp.year,
    });
    res.send("Assign task successfully");
  } catch (err) {
    res.send(err);
  }
};
exports.viewGroup = async (req, res) => {
  try {
    const GroupCollection = await dbo
      .getDb()
      .collection("group")
      .find({})
      .toArray();
    res.send(GroupCollection);
  } catch (err) {
    console.log(err);
  }
};
exports.viewVehicle = async (req, res) => {
  try {
    const VehicleCollection = await dbo
      .getDb()
      .collection("vehicles")
      .find({})
      .toArray();
    res.send(VehicleCollection);
  } catch (err) {
    console.log(err);
  }
};
exports.assignVehicle = async (req, res) => {
  try {
    const vehicleID = req.body.selectedVehicle_id;
    const Group = req.body.selectedGroup;
    console.log(vehicleID, Group._id);
    await dbo
      .getDb()
      .collection("group")
      .updateOne(
        { _id: new ObjectId(Group._id) },
        {
          $set: { vehicle_id: vehicleID },
        }
      )
      .then(() => console.log("hi"));
    await dbo
      .getDb()
      .collection("vehicles")
      .updateOne(
        { _id: new ObjectId(vehicleID) },
        {
          $set: {
            isAssigned: true,
            workers: Group.worker_id,
            to_MCP: Group.mcp_id,
            current_capacity: Group.worker_id.length,
          },
        }
      );
    res.send("successfully");
  } catch (err) {}
};

exports.findGroup = async (req, res) => {
  const removeGroup = await dbo
    .getDb()
    .collection("group")
    .find({ _id: new ObjectId(req.body.removeGroup) })
    .toArray();
  res.send(removeGroup);
};
exports.removeGroup = async (req, res) => {
  const group = await dbo
    .getDb()
    .collection("group")
    .find({ _id: new ObjectId(req.body.group) })
    .toArray();
  const Workers = group[0].worker_id;
  const MCPs = group[0].mcp_id;
  const WorkerCollection = await dbo.getDb().collection("worker");
  await Promise.all(
    Workers.map(async (Worker) => {
      const filter = { _id: new ObjectId(Worker)};
      const update = { $set: { is_avail: true, tasks: [] } };
      await WorkerCollection.updateOne(filter, update);
    })
  );
  const TaskCollection = await dbo.getDb().collection("tasks");
  await Promise.all(
    MCPs.map(async (mcp_id) => {
      const filter = { _id: new ObjectId(mcp_id) };
      const update = { $set: { isAssigned: false } };
      await TaskCollection.updateOne(filter, update);
    })
  );
  await dbo
    .getDb()
    .collection("group")
    .deleteOne({ _id: new ObjectId(req.body.group) });
  res.send("Assign successfully")
};
