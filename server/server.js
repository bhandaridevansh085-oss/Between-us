const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:3100",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
  })
);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

const waitingUsers = [];
const blockedPairs = new Set();

function removeFromWaiting(socketId) {
  for (let i = waitingUsers.length - 1; i >= 0; i--) {
    if (waitingUsers[i].socketId === socketId) {
      waitingUsers.splice(i, 1);
    }
  }
}

function addToWaiting(socket, userId, name) {
  removeFromWaiting(socket.id);

  waitingUsers.push({
    socketId: socket.id,
    userId,
    name,
  });
}

function getBlockKey(userA, userB) {
  return [userA, userB].sort().join(":");
}

function isBlocked(userA, userB) {
  return blockedPairs.has(getBlockKey(userA, userB));
}

function findWaitingUser(userId) {
  return waitingUsers.findIndex(
    (user) =>
      user.userId !== userId &&
      !isBlocked(userId, user.userId)
  );
}

function clearRoom(roomId) {
  const room = io.sockets.adapter.rooms.get(roomId);

  if (!room) return;

  room.forEach((socketId) => {
    const roomSocket = io.sockets.sockets.get(socketId);

    if (roomSocket) {
      roomSocket.leave(roomId);
      roomSocket.data.roomId = null;
    }
  });
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("find-stranger", ({ userId, name }) => {
    if (!userId || !name) return;

    removeFromWaiting(socket.id);

    socket.data.userId = userId;
    socket.data.name = name;

    if (socket.data.roomId) {
      return;
    }

    const strangerIndex = findWaitingUser(userId);

    if (strangerIndex === -1) {
      addToWaiting(socket, userId, name);

      socket.emit("waiting");

      console.log("Added to waiting queue:", name);
      return;
    }

    const stranger = waitingUsers.splice(strangerIndex, 1)[0];

    const strangerSocket = io.sockets.sockets.get(
      stranger.socketId
    );

    if (!strangerSocket) {
      addToWaiting(socket, userId, name);
      socket.emit("waiting");
      return;
    }

    if (
      isBlocked(userId, stranger.userId) ||
      strangerSocket.data.roomId
    ) {
      addToWaiting(socket, userId, name);
      socket.emit("waiting");
      return;
    }

    const roomId = `${stranger.socketId}-${socket.id}`;

    socket.join(roomId);
    strangerSocket.join(roomId);

    socket.data.roomId = roomId;
    strangerSocket.data.roomId = roomId;

    socket.emit("matched", {
      roomId,
      strangerName: stranger.name,
    });

    strangerSocket.emit("matched", {
      roomId,
      strangerName: name,
    });

    console.log(
      "Matched:",
      stranger.name,
      "with",
      name
    );
  });

  socket.on("send-message", ({ roomId, message }) => {
    if (!roomId || !message) return;

    if (socket.data.roomId !== roomId) return;

    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    socket.to(roomId).emit("receive-message", {
      message: trimmedMessage,
      senderId: socket.id,
    });
  });

  socket.on("next-stranger", ({ roomId, userId, name }) => {
    removeFromWaiting(socket.id);

    if (roomId && socket.data.roomId === roomId) {
      socket.to(roomId).emit("stranger-left");

      clearRoom(roomId);
    }

    socket.data.roomId = null;

    addToWaiting(socket, userId, name);

    socket.emit("waiting");

    console.log("Looking for next stranger:", name);
  });

  socket.on("leave-chat", ({ roomId }) => {
    removeFromWaiting(socket.id);

    if (!roomId || socket.data.roomId !== roomId) {
      socket.data.roomId = null;
      return;
    }

    socket.to(roomId).emit("stranger-left");

    clearRoom(roomId);

    socket.leave(roomId);
    socket.data.roomId = null;

    console.log("User left chat:", socket.id);
  });

  socket.on("report-user", ({ roomId, reason }) => {
    if (!roomId) return;

    if (socket.data.roomId !== roomId) return;

    console.log("Report received:", {
      reporter: socket.data.userId,
      roomId,
      reason: reason || "No reason provided",
    });
  });

  socket.on("block-user", ({ roomId }) => {
    if (!roomId) return;

    if (socket.data.roomId !== roomId) return;

    const room = io.sockets.adapter.rooms.get(roomId);

    if (!room) return;

    const otherSocketId = [...room].find(
      (socketId) => socketId !== socket.id
    );

    if (otherSocketId) {
      const otherSocket = io.sockets.sockets.get(
        otherSocketId
      );

      if (otherSocket) {
        blockedPairs.add(
          getBlockKey(
            socket.data.userId,
            otherSocket.data.userId
          )
        );

        otherSocket.emit("blocked");

        otherSocket.leave(roomId);
        otherSocket.data.roomId = null;
      }
    }

    socket.leave(roomId);
    socket.data.roomId = null;

    addToWaiting(
      socket,
      socket.data.userId,
      socket.data.name
    );

    socket.emit("waiting");

    console.log(
      "User blocked and added back to queue:",
      socket.data.name
    );
  });

  socket.on("disconnect", () => {
    removeFromWaiting(socket.id);

    const roomId = socket.data?.roomId;

    if (roomId) {
      socket.to(roomId).emit("stranger-left");
    }

    console.log("User disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Between Us server is running",
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `Between Us server running on port ${PORT}`
  );
});