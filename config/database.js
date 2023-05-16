const mongoose = require("mongoose");
const { MONGO_URI } = process.env;
console.log(MONGO_URI, "monuri");
const connect = () => {
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //   useCreateIndex: true,
      //   useFindAndModify: false,
    })
    .then(() => {
      console.log("Database connected successfully....");
    })
    .catch((e) => {
      console.log("Error while connecting to DB: ", e);
    });
};

module.exports = { connect };
