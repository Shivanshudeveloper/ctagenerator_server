const ProjectTimeline_model = require("../../models/projectTimeline"); // Update the path as needed


// Create a new project
const createProject = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const requestData = req.body;

  try {
    const newProject = new ProjectTimeline_model(requestData);
    const savedProject = await newProject.save();

    return res.status(200).json({ status: true, data: savedProject });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, data: "Error while creating Project" });
  }
};

// Get a project by ID
const getProjectById = async (req, res) => {
  {
    const { organizationId, data } = req.params;
    try {
      let projects;

      if (data === "all") {
          // Use the correct field name and provide a valid ObjectId or string
          projects = await ProjectTimeline_model.find({ organizationId }).sort({ date: -1 });
      } else {
          // Use the correct field name and provide a valid ObjectId or string
          projects = await ProjectTimeline_model.find({ organizationId }).sort({ date: -1 }).limit(5);
      }
      
  
      if (!projects || projects.length === 0) {
        return res.status(202).json({ status: false, data: "No projects found for this organisation" });
      }
  
      return res.status(200).json({ status: true, data: projects });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, data: "Error while fetching projects" });
    }
    }   
};

// Update a project by ID
const updateProjectById = async (req, res) => {
  const { organizationId } = req.params; // Use organisationId
  const updateData = req.body;

  try {
    const updatedProject = await ProjectTimeline_model.findOneAndUpdate(
      { organizationId }, // Use organisation_id
      updateData,
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ status: false, data: "Project not found" });
    }

    return res.status(200).json({ status: true, data: updatedProject });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, data: "Error while updating Project" });
  }
};


// Delete a project by ID
const deleteProjectById = async (req, res) => {
  const { organizationId } = req.params; // Use organisationId

  try {
    const deletedProject = await ProjectTimeline_model.findOneAndDelete({
      organizationId, // Use organisation_id
    });

    if (!deletedProject) {
      return res.status(404).json({ status: false, data: "Project not found" });
    }

    return res.status(200).json({ status: true, data: deletedProject });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, data: "Error while deleting Project" });
  }
};


// Get all projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectTimeline_model.find();

    return res.status(200).json({ status: true, data: projects });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, data: "Error while fetching Projects" });
  }
};

module.exports = {
  createProject,
  getProjectById,
  updateProjectById,
  deleteProjectById,
  getAllProjects,
};
