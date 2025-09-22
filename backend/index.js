import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { connectDb } from "./db/db.js";
import cors from "cors";
import route from "./routes/routes.js";
import socketHandler from "./socket/socket.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});
const port = 3000;

dotenv.config({ debug: true, encoding: "utf8" });

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware untuk memverifikasi token pada socket.io
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  console.log(token);

  if (!token) {
    return next(new Error("Authentication error"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error("Authentication error"));
    }

    socket.user = decoded;
    next();
  });
});

app.use("/api", route);

// socket connection
socketHandler(io);

io.listen(3001, () => {
  console.log("oy");
});

app.listen(port, () => {
  connectDb();
  console.log("Server running at http://localhost:" + port);
});

// sandi akun dev: uk7wydviwyd
