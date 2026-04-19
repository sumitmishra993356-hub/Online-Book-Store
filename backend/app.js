const express = require("express");
const app = express();
const cors = require("cors");
// import cookieParser from "cookie-parser";

require("dotenv").config();
require("./conn/conn");

const User = require("./routes/user");
const Books = require("./routes/book");
const Favourite = require("./routes/favourite");
const Cart = require("./routes/cart");
const Order = require("./routes/order");

// app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000', // your frontend
  credentials: true,
}));
app.use(express.json());
// app.use(cookieParser());


// app.get("/", (req, res) => {
//   res.send("Hello from the backend!");
// });

// routes
app.use("/api/v1", User);
app.use("/api/v1", Books);
app.use("/api/v1", Favourite);
app.use("/api/v1", Cart);
app.use("/api/v1", Order);


// crating post 
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});