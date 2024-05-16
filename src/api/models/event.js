const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique:true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    poster: { type: String, required: false },
    attender: [{ type: mongoose.Types.ObjectId,  required:false, ref:"attenders" }],
    user: { type:mongoose.Types.ObjectId, required:false, ref:"users" }
  },
  {
    timestamps: true,
    collection: "events",
  }
);

const Event = mongoose.model("events", eventSchema, "events");

module.exports = Event;
