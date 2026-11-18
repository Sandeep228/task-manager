import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Enter a task title."],
      trim: true,
      maxlength: [120, "Keep the title under 120 characters."],
    },
    priority: {
      type: String,
      enum: { values: ["low", "medium", "high"], message: "Priority must be low, medium or high." },
      default: "medium",
    },
    due: {
      type: String,
      default: "",
      match: [/^(\d{4}-\d{2}-\d{2})?$/, "Due date must look like YYYY-MM-DD."],
    },
    done: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
