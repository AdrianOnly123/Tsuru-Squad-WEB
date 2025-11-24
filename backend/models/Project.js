const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  type: { type: String, required: true },
  seed: { type: String },
  action: { type: String }
}, { _id: false });

const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  crop: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, default: "Activo" },
  humidity: { type: Number, default: null },
  bioFertilizer: { type: String, default: null },
  sowingDate: { type: Date, default: null },
  observations: { type: String, default: "" },
  recommendations: { type: String, default: "" },
  history: [historySchema],
  synced: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});



module.exports = mongoose.model("Project", projectSchema);