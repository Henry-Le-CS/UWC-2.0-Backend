const validateData = (data) => {
  if (!data.account || !data.password) {
    console.log(data.account, data.password);
    console.log(!data.account, !data.password);
    return { success: false, message: "Invalid data" };
  }
  // additional validation logic if needed
  return { success: true };
};

module.exports = {
  validateData: validateData,
};
