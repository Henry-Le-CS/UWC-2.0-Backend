const dbo = require("../model/data");
const { ObjectId } = require("mongodb");

exports.findGroups = async (req,res)=>{
    const groups = await dbo.getDb().collection("group").find({ worker_id: { $in: [req.body._id] } }).toArray()
    res.send(groups)
}