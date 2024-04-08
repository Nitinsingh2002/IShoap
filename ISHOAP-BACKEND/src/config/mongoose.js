import dotenv from 'dotenv';
import mongoose, { connect } from "mongoose";

dotenv.config();

const url = process.env.DB_URL;


export const mongoConnection = async () => {
    try {
      await  mongoose.connect(url);
      console.log("database connected sucessfully");
    } catch (error) {
        console.log("error in connecting with database", error);
    }

}