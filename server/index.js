const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { jwtAuth } = require("./middleware.js");

const PORT = process.env.PORT || 9000;

// Init server
const server = app.listen(PORT, () => {
  console.log(`Server running on port - ${PORT}`);
});
const io = require("socket.io")(server);

app.use(express.json());
app.use(
  cors({
    // origin: '*'
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

// Connect to mongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log("Not connected to Database ERROR!", err);
  });

// Status to see if warehouse is running
app.get("/status", function (req, res) {
  res.status(200).send("OK");
});

app.get("/versionCheck", function (req, res) {
  res.status(200).send("Version 10");
});

app.get("/protectedstatus", jwtAuth, function (req, res) {
  console.log(req.uid);
  res.status(200).send("OK");
});

// Routes
app.use("/api/user", require("./router/userRouter.js"));
app.use("/api/goods", require("./router/goodsRouter.js"));
app.use("/api/warehouses", require("./router/warehouseRouter.js"));
app.use("/api/stripe", require("./router/stripeRouter.js"));

app.get("/test", function (req, res) {
  console.log(req.cookies.authToken);
  res.status(200).send({ message: "OK" });
});

// app.get('/protected', cookieJwtAuth, protectedRoute);

// chat stuff

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData.uid);
    socket.emit("connected");
  });

  socket.on("join", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData.uid);
  });
});
