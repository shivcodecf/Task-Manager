import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({

    name:{

     type:String,
    

    },

    email:{

       type:String,
       required:true,
       unique:true 

    },

    password:{

        type:String,

        required:true
        
    },

    

    role:{
      type:String,
      enum:["user","manager"],
      default:"user",
      required:true  
    },

   




},{timestamps:true})


export const User = mongoose.model('User', userSchema);





