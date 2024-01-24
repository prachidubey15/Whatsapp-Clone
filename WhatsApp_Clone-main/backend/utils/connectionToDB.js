const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URI;

const connectionToDB=async()=>{
    try {
        await mongoose.connect(mongoURI);
        // mongoose.createConnection(mongoURI, {
        //   useNewUrlParser: true,
        //   useUnifiedTopology: true,
        // });
        console.log('DB Connected!');
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = connectionToDB;