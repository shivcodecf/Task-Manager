import { Task } from "../models/tasks.model.js";
import mongoose from 'mongoose'

export const createTasks = async(req,res)=>{

    try {

        

        const{title,description,status}  = req.body;

       

      
        


        if(!title || !description )
        {
            return res.status(400).json({

                message:"All fields are required"

            })
        }


        const newTask = await Task.create({
            title,
            description,
            status,
            user:req.user.id,
        })


        return res.status(201).json({

            newTask,
            
            message:"Task is created successfully"

        })
        
    } catch (error) {
        console.log(error);
    }


}



export const getTasks = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User is not authenticated" });
    }

    let tasks;
    console.log("Logged-in User:", req.user); 

    if (req.user.role === 'manager') {
      tasks = await Task.find().populate("user", "name email role"); 
    } else {
      tasks = await Task.find({ user: req.user.id }).populate("user", "name email role"); 
    }

    return res.status(200).json({ tasks });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error while fetching tasks" });
  }
};



export const updateTasks = async(req,res)=>{

    try {

        const {id} = req.params;

        const{title,description,status} = req.body;

        const task = await Task.findById(id);


        if(!task)
        {
            return res.status(401).json({
                message:"tasks is not found"
            })
        }

        if(title)
        {
            task.title = title;
        }
        if(description)
        {
            task.description = description
        }

        if(status)
        {
            task.status = status;
        }

        await task.save();

        return res.status(200).json({
            task,
            message:"task is updated successfully",
            success:true
        })

        
    } catch (error) {
        console.log(error);
    }

}

export const deleteTasks = async(req,res)=>{

    try {

        const{id} = req.params;

        const task = await Task.findByIdAndDelete(id);

        return res.status(200).json({
            task,
            message:"task deleted successfully",

        })
        
    } catch (error) {
        console.log(error);
    }

}

export const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;         
    const userRole = req.user.role;     

    let matchStage = {};

    
    if (userRole !== "manager") {
      matchStage.user = new mongoose.Types.ObjectId(userId);
    }

    const totalTasks = await Task.countDocuments(matchStage);

    const statusCounts = await Task.aggregate([
      { $match: matchStage },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const counts = {};
    statusCounts.forEach((item) => {
      counts[item._id] = item.count;
    });

    res.json({
      totalTasks,
      statusBreakdown: counts,
    });
  } catch (error) {
    console.error("Failed to get stats", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// filter , sorting , keywords searching

export const getAllTasks = async (req, res) => {
  try {
    const { status, sort, search, page = 1, limit = 10 } = req.query;

    const queryObj = {};

   
    if (status && status !== 'All') {
      queryObj.status = status;
    }

    
    if (search) {
      queryObj.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

  
    let query = Task.find(queryObj);

   
    if (sort) {
      const [field, order] = sort.split(':');
      const sortOrder = order === 'desc' ? -1 : 1;
      query = query.sort({ [field]: sortOrder });
    }

    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    query = query.skip(skip).limit(parseInt(limit));

   
    const totalTasks = await Task.countDocuments(queryObj);

 
    const tasks = await query.exec();

    res.status(200).json({
      success: true,
      page: parseInt(page),
      limit: parseInt(limit),
      totalTasks,
      totalPages: Math.ceil(totalTasks / limit),
      tasks,
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};





















