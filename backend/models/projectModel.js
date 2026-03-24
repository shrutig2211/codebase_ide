const mongoose = require("mongoose");

let projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  projLanguage: {
    type: String,
    required: true,
    // Add the new languages here:
    enum: ["python", "java", "javascript", "cpp", "c", "go", "bash", "ruby", "typescript", "csharp", "rust", "php"]
  },
  code: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  version: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Project", projectSchema);