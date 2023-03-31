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
      { projection: { user_id: 1, _id: 0 } }
    );
  if (!user)
    return res.status(400).json({ message: "Wrong username or password" });
  console.log(user);
  return res.json(user);
};
