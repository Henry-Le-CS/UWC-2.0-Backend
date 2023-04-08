const { validateData } = require("../utils/validate");
const dbo = require("../model/data");
exports.login = async (req, res) => {
  const data = req.body;
  const validation = validateData(data);
  if (!validation.success) {
    return res.status(400).json({ message: validation.message });
  }
  const user = await dbo
    .getDb()
    .collection(`${data.isBO ? "back-officer" : "worker"}`)
    .findOne(
      { email: data.account, password: data.password },
      {projection: {_id: 1, user_id: 1}}
    );
  if (!user)
    return res.status(400).json({ message: "Wrong username or password" });
  return res.json(user);
};
