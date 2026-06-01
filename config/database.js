import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`🛡️ MongoDB Pipeline Connected via ES6 Modules: ${conn.connection.host}`);
    } catch (error) {
        console.error(`🚨 Database Connection Fault: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;