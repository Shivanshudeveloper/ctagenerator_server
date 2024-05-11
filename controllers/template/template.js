const tempModel = require("../../models/tempJsonData");
const projectModel = require("../../models/Project");
const emailTempModel = require("../../models/emailTempData");

const tempData = async (req, res) => {
  // Sample payload
  const tempData = await tempModel.find();
  // console.log("tempData :>> ", tempData);
  res.status(200).json({ status: true, data: tempData });
};
const getTempImage = async (req, res) => {
  // Sample payload
  let id = req.params.id;
  const tempData = await tempModel.findOne({ _id: id });
  // console.log("tempData :>> ", tempData);
  res.status(200).json({ status: true, data: tempData });
};
const emailTemp = async (req, res) => {
  // Sample payload
  let id = req.params.id;
  let projectId = req.params.projectId;
  const tempData = await tempModel.findOne({ _id: id });
  const emailTemp = await emailTempModel.findOne({ _id: id });
  // console.log("emailTemp :>> ", emailTemp);
  if (tempData) {
    // console.log("tempData", tempData);
    let journeyTitle = req.body.journeyTitle;
    let email = req.body.email;
    let data = {
      journeyTitle: journeyTitle,
      name: tempData.name,
      templateID: tempData.id,
      email: email,
      category: tempData.Category,
      status: "enable",
      imageUrl: tempData.imageUrl,
      projectId: projectId,
    };
    console.log("tempData :>> ", data);
    let saveData = await emailTempModel.create(data);
    // console.log("saveData", saveData);
    res.status(200).json({ status: true, data: saveData });
  }
  if (emailTemp) {
    res.status(200).json({ status: true, data: emailTemp });
  }
};
const getEmailTempData = async (req, res) => {
  // Sample payload
  const tempData = await emailTempModel.find();
  // console.log("tempData :>> ", tempData);
  res.status(200).json({ status: true, data: tempData });
};
const getNewTempData = async (req, res) => {
  // Sample payload
  const id = req.params.id;
  const tempData = await emailTempModel.findOne({ _id: id });
  // console.log("tempData :>> ", tempData);
  res.status(200).json({ status: true, data: tempData });
};
const getViewMoreData = async (req, res) => {
  // Sample payload
  const id = req.params.id;
  const tempData = await emailTempModel.findOne({ _id: id });
  // console.log("tempData :>> ", tempData);
  res.status(200).json({ status: true, data: tempData });
};

module.exports = {
  tempData,
  getTempImage,
  getEmailTempData,
  emailTemp,
  getNewTempData,
  getViewMoreData,
};
