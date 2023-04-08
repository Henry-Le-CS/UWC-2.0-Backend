const dbo = require("../model/data");
const { ObjectId } = require("mongodb");

exports.findGroups = async (req, res) => {
  const groups = await dbo
    .getDb()
    .collection("group")
    .find({ worker_id: { $in: [req.body._id] } })
    .toArray();
  res.send(groups);
};

exports.listInfo = async (req, res) => {
  const _id = req.body._id;
  const mcp_id = req.body.mcp_id;
  const worker_id = req.body.worker_id.filter((id) => id != req.body.user_ID);
  const vehicle_id = req.body.vehicle_id;

  const MCPs = await Promise.all(
    mcp_id.map(async (mcp) => {
      const MCP = await dbo
        .getDb()
        .collection("tasks")
        .findOne(
          { _id: new ObjectId(mcp) },
          { location: 1, priority: 1, _id: 1 }
        );
      return { location: MCP.location, priority: MCP.priority, _id: MCP._id };
    })
  );
  const Workers = await Promise.all(
    worker_id.map(async (id) => {
      const workers = await dbo
        .getDb()
        .collection("worker")
        .findOne(
          { _id: new ObjectId(id) },
          { first_name: 1, last_name: 1, phone_number: 1, _id: 1 }
        );
      return {
        first_name: workers.first_name,
        last_name: workers.last_name,
        phone_number: workers.phone_number,
        _id: workers._id,
      };
    })
  );

  const Vehicle = await dbo
    .getDb()
    .collection("vehicles")
    .findOne({ _id: new ObjectId(vehicle_id) }, { name: 1, _id: 0 });
  res.send({ workers: Workers, mcps: MCPs, vehicle: Vehicle });
};
