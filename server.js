const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/api/item");
 
const path = require("path");

const app = express();

//middleware to resolve the cor-policy issue
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "*");
  next();
});
const port = process.env.PORT || 3001;
app.use(express.json());
app.use(router);

//check if we are in production
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/client/build")));

//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'))
//   })
// }

mongoose
  .connect(process.env.MONGODB_URL,
    
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDb connected.."))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`starting server at ${port}`);
});
