const dbo = require("../model/data");

exports.infoBO = async (req, res) => {
    const user = await dbo
      .getDb()
      .collection("back-officer")
      .findOne({ user_id: req.body.user_id });
      console.log(user)
    res.send(user);
  };