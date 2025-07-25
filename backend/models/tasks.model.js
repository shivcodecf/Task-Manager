import mongoose from "mongoose";

const tasksSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],

      default: "pending",
    },

    user:{
       type:mongoose.Schema.Types.ObjectId,
       ref:'User',
       required:true
    }

  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", tasksSchema);
