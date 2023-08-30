const mongoose = require("mongoose");


const mongoConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("Mongo Connected Successfully");
  } catch (error) {
    console.log(error);
  }
};

module.exports = mongoConnect;
