const { Server } = require("socket.io");
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const userModel = require("../Model/user.model");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  io.use(async(socket , next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
    console.log("socket connection cookies", cookies)
    if(!cookies.token){
       next(new Error("Authentication error : No token provided"))
    }

    try{
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRETKEY);
      const user = await userModel.findById(decoded.id);
      socket.user = user;
      next();
    }catch(err){
      next(new Error("Authentication error : Invalid token"))
    }
  })

  io.on("connection", (socket) => {
    socket.on("ai-message", async(messagePayload) => {
      console.log(messagePayload)
    })
  });
}

module.exports = initSocketServer;
