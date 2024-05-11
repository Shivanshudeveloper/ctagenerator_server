const mongoose = require("mongoose");

const tempJsonSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  Category: {
    type: String,
    required: true,
  },
  subcategory: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

});

const temp = mongoose.model("templateJsonData", tempJsonSchema);
module.exports = temp;
