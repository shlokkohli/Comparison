import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {};

async function dbConnect() : Promise<void> {
    // check if there is already a connection
    if(connection.isConnected){
        console.log("Already connected to database");
        return;
    }

    // if not connected to database, then connect
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '');
        connection.isConnected = db.connections[0].readyState;

        console.log("DB connection established");
        
    } catch (error) {

        console.log("Database connection failed", error);
        process.exit(1);
        
    }

}