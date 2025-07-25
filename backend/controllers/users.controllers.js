
import { User } from "../models/users.model.js";

import bcrypt from 'bcryptjs';                   

import { generateToken } from '../utils/generateToken.js';
import { sendTokenCookie } from '../utils/sendTokenCookie.js';

export const  Signup = async(req,res)=>{

    try {

        const {name,email,password,role} = req.body;

        if(!name || !email || !password || !role)
        {
            return res.status(400).json({

               message:"All fields are required",
                
             
            })

            
        }

        const user = await User.findOne({email});


        if(user)
        {
            return res.status(400).json({
                message:"User is already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = await User.create({

            name,
            email,
            password:hashedPassword,
            role
           
        })

      


        return res.status(201).json({

            newUser,

            message:"Users created successfully",
            success:true

        })




        
    } catch (error) {

         console.log(error);
    return res.status(500).json({
        message: "Server Error",
        error: error.message
    });
        
    }

}



export const Login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    sendTokenCookie(res, token);


    res.status(200).json({ message: 'Login successful', user });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Server Error',
      error: error.message,
    });
  }
};