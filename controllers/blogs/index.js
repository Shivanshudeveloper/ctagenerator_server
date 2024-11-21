
const Blogs_Model = require("../../models/Blogs");
const BlogCounter_Model = require("../../models/BlogCounter");

const { v4: uuidv4 } = require("uuid");

const submitBlog = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const { title, content, author, plainContent, status  } = req.body;
  
    try {
      // Find an existing blog by title
      let existingBlog = await Blogs_Model.findOne({ title });

      if (existingBlog) {
        const data = await Blogs_Model.updateOne(
            { blogPublicId },
            { $set: { title, content, author, plainContent, status }}
        )
        return res.status(200).json({ status: true, data });
      } else {
        const blogUid = `${Date.now()}_${uuidv4()}_BLOG`;

        const counter = await BlogCounter_Model.findByIdAndUpdate(
          "blogUid",
          { $inc: { sequence_value: 1 } },
          { new: true, upsert: true }
        );

        const newBlog = new Blogs_Model({
          blogUid,
          blogPublicId: Number(counter?.sequence_value),
          title,
          content,
          author,
          plainContent,
          status
        });
        const resdata = await newBlog.save();
        console.log(resdata);
        return res.status(200).json({ status: true, data: resdata });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: false, data: "Error while creating new blog" });
    }
};

// Get all blogs
const getAllBlogs = async (req, res) => {
    try {
        const allBlogs = await Blogs_Model.find({ status: "PUBLISH" }).sort({
          createdAt: -1,
        });
        return res.status(200).json({ success: true, data: allBlogs });
    } catch (error) {
        console.log(error);
        return res
          .status(500)
          .json({ success: false, data: "Something went wrong" });
    }
};

// Get particular blog
const getParticularBlog = async (req, res) => {
    try {
      const { blogPublicId } = req.params;
      const allBlogs = await Blogs_Model.findOne({ blogPublicId }).sort({
        createdAt: -1,
      });
      return res.status(200).json({ success: true, data: allBlogs });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, data: "Something went wrong" });
    }
};

// Update blog
const updateBlog = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const { blogPublicId } = req.params;
    const { title, content, author, plainContent, status } = req.body;
    console.log("hi updateCtaDetails");

    try {
        const data = await Blogs_Model.updateOne(
            { blogPublicId },
            { $set: { title, content, author, plainContent, status }}
        )

        return res.status(200).json({ status: true, data });
    } catch (error) {
        return res.status(500).json({ status: false, data: "Something went wrong" });
    }
};


module.exports = {
    submitBlog,
    getAllBlogs,
    getParticularBlog,
    updateBlog,
}