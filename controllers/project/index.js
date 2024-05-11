const Project_Model = require("../../models/Project");
const emailModel = require("../../models/emailTempData");
const { v4: uuidv4 } = require("uuid");

const createNewProject = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const submitrequest = req.body;

  try {
    const projectId = `${Date.now()}_${uuidv4()}`;
    const existingProject = await Project_Model.findOne({
      name: submitrequest?.name,
      organizationId: submitrequest?.organizationId,
    });

    if (existingProject) {
      return res
        .status(400)
        .json({ status: false, data: "Project name already exist" });
    }

    const newProject = new Project_Model({
      name: submitrequest?.name,
      email: submitrequest?.email,
      organizationId: submitrequest?.organizationId,
      projectId: projectId,
      status: 1,
    });

    await newProject.save();

    return res.status(200).json({ status: true, data: projectId });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, data: "Error while creating Project" });
  }
};

// Get User Details
const getProjectDetails = async (req, res) => {
  const { projectId } = req.params;
  //   console.log("projectId", projectId);
  let alldata = await emailModel
    .find({ projectId: projectId })
    .sort({ createdAt: -1 })
    .then((data) => {
      //   console.log("data :>> ", data);
      return data;
    })
    .catch((err) => console.log(err));
  let name = await Project_Model.findOne({ projectId: projectId });
  // console.log("name", name);
  res
    .status(200)
    .json({ status: true, data: { name: name, allData: alldata } });
};

// Only get the users of the organization not admin
const deleteProjectDetails = async (req, res) => {
  const { projectId } = req.params;
  Project_Model.findOneAndDelete({ projectId })
    .then((data) => {
      res.status(200).json({ status: true, data });
    })
    .catch((err) => console.log(err));
};

// Only get the users of the organization not admin
const getAllProject = async (req, res) => {
  const { organizationId } = req.params;
  let dataa = await Project_Model.find({ organizationId })
    .sort({ createdAt: -1 })
    .then((data) => {
      return data;
    })
    .catch((err) => console.log(err));

  if (dataa) res.status(200).json({ status: true, data: dataa });
};
const getProjectNameById = async (req, res) => {
  const id = req.params.id;
  Project_Model.find({ _id: id })
    .sort({ createdAt: -1 })
    .then((data) => {
      res.status(200).json({ status: true, data });
    })
    .catch((err) => console.log(err));
};

module.exports = {
  createNewProject,
  getProjectDetails,
  deleteProjectDetails,
  getAllProject,
  getProjectNameById,
};
