const dbo = require("../model/data");
const { ObjectId } = require("mongodb");

exports.infoBO = async (req, res) => {
  const user = await dbo
    .getDb()
    .collection("back-officer")
    .findOne({ user_id: req.body.user_id });
  res.send(user);
};

exports.conversation = async (req, res) => {
  //display conversation between 2 users
// - from_userid: the current user
// - to_userid: the user that the current user is chatting with
// - timestamp: the time that the message is sent
// - message: the message content
  const from_userid = req.body.from_userid;
  const to_userid = req.body.to_userid;
  const messages = await dbo
    .getDb()
    .collection("messages")
    .find({
      $or: [
        { from_userid: from_userid, to_userid: to_userid },
        { from_userid: to_userid, to_userid: from_userid },
      ],
    })
    .toArray();
  res.send(messages);
};

exports.listMessages = async (req, res) => {
  //console.log("Hello");
  //console.log(req.body);
  const user_id = req.body.user_id;
  const messages = await dbo
    .getDb()
    .collection("messages")
    .find({
      $or: [
        { from_userid: user_id },
        { to_userid: user_id }
      ]
    })
    .toArray();
  
  const avaUrl = await dbo
    .getDb()
    .collection("back-officer")
    .find({})
    .toArray();
  
  for (let i = 0; i < messages.length; i++) {
    // for each messages, we need to find avaUrl user_id
    for (let j = 0; j < avaUrl.length; j++) {
      if (messages[i].to_userid == avaUrl[j].user_id) {
        messages[i].target_url = avaUrl[j].ava_url;
      }
    }
  }

  console.log(messages);
  res.send(messages);
};

//add a message to the database.The mongoDB has the following structure:
// - from_userid: the current user
// - to_userid: the user that the current user is chatting with
// - timestamp: the time that the message is sent
// - message: the message content
exports.addMessages = async (req, res) => {
  const from_userid = req.body.from_userid;
  const to_userid = req.body.to_userid;
  const timestamp = Date.now();
  const message = req.body.message;
  const newMessage = {
    from_userid: from_userid,
    to_userid: to_userid,
    timestamp: timestamp,
    message: message,
  };
  const result = await dbo
    .getDb()
    .collection("messages")
    .insertOne(newMessage);
  res.send(result);
};

exports.getAvaUrl = async (req, res) => {
  const user_id = req.body.user_id;
  const avaUrl = await dbo
    .getDb()
    .collection("back-officer")
    .findOne({ user_id: user_id });
  res.send(avaUrl.ava_url);
};

exports.viewMCP = async (req, res) => {
  const MCPs = await dbo
    .getDb()
    .collection("tasks")
    .find({})
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
    await dbo
      .getDb()
      .collection("group")
      .updateOne(
        { _id: new ObjectId(Group._id) },
        {
          $set: { vehicle_id: vehicleID },
        }
      )
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
      const filter = { _id: new ObjectId(Worker) };
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
  res.send("Assign successfully");
};

exports.findWorker = async (req, res) => {
  const userID = req.body._id;
  const Group = await dbo
    .getDb()
    .collection("group")
    .find({ worker_id: { $in: [userID] } })
    .toArray();
  const User = await dbo
    .getDb()
    .collection("worker")
    .find({ _id: new ObjectId(userID) })
    .toArray();
  res.send({ user: User, group: Group });
};
exports.listInfo = async (req, res) => {
  const _id = req.body._id;
  const mcp_id = req.body.mcp_id;
  const worker_id = req.body.worker_id.filter(id => id!=_id);
  const MCPs = await Promise.all(
    mcp_id.map(async (mcp) => {
      const MCP = await dbo
        .getDb()
        .collection("tasks")
        .findOne(
          { _id: new ObjectId(mcp) },
          { location: 1, priority: 1, _id: 0 }
        );
      return { location: MCP.location, priority: MCP.priority };
    })
  );
  const Workers = await Promise.all(
    worker_id.map(async (id) => {
      const workers = await dbo
        .getDb()
        .collection("worker")
        .findOne(
          { _id: new ObjectId(id) },
          { first_name: 1, last_name: 1,phone_number: 1,  _id: 0 }
        );
        return {first_name: workers.first_name, last_name: workers.last_name, phone_number: workers.phone_number};
    })
  );
  res.send({workers: Workers, mcps: MCPs});
};
exports.writeDescription = async (req,res) =>{
  await dbo
  .getDb()
  .collection("tasks")
  .updateOne(
    { _id: new ObjectId(req.body._id) }, // convert _id to ObjectId
    { $set: { description: req.body.description } }
  )
  const MCP = await dbo.getDb().collection("tasks").find({}).toArray();
  res.send(MCP)

}
