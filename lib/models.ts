import mongoose, { Schema } from "mongoose"

// Define the WorkloadInput schema
const WorkloadInputSchema = new Schema({
  modelType: {
    type: String,
    required: true,
  },
  taskType: {
    type: String,
    required: true,
  },
  datasetSize: {
    type: Number,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  operatingSystem: {
    type: String,
    required: true,
  },
  gpu: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Create the model if it doesn't exist
export const WorkloadInputModel = mongoose.models.WorkloadInput || mongoose.model("WorkloadInput", WorkloadInputSchema)