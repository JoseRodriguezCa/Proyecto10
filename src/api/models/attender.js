const mongoose = require("mongoose");

const attenderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    event: [{ type: mongoose.Types.ObjectId,  required:true, ref:"events" }],
    user: { type:mongoose.Types.ObjectId, required:false, ref:"users" }
  },
  {
    timestamps: true,
    collection: "attenders",
  }
);

const Attender = mongoose.model("attenders", attenderSchema, "attenders");

module.exports = Attender;