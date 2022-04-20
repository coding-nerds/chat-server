const http = require("http");
const server = http.createServer();

const socketio = require("socket.io");

const io = socketio(server, {
  cors: {
    origin: "http://bookin.link",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join", (roomId) => {
    socket.join(roomId);
    io.to(roomId).emit("join", `room id is ${roomId}`);
  });
  socket.on("sendMessage", ({ message, roomId, user }) => {
    if (
      Array.from(socket.adapter.rooms).filter(
        (room) => room[0] === roomId
      )[0][1].size === 1
    ) {
      io.to(roomId).emit("sendMessage", {
        message: message,
        user: user,
        userCount: 1,
      });
    } else {
      io.to(roomId).emit("sendMessage", {
        message: message,
        user: user,
        userCount: 2,
      });
    }
  });
});

server.listen(8000, () => console.log("listening on port 8000"));
