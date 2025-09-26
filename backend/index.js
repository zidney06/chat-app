import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { connectDb } from "./db/db.js";
import cors from "cors";
import route from "./routes/routes.js";
import socketHandler from "./socket/socket.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({ debug: true, encoding: "utf8" });

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const port = process.env.PORT;

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

// Get the absolute path to your frontend dist directory
const FRONTEND_DIST_PATH = path.join(import.meta.dirname, "../frontend/dist");
// Or, if using CJS (require): path.resolve(__dirname, "../frontend/dist")

// production
if (process.env.isproduction === "true") {
  // 1. Tell Express to serve ALL files from the dist directory
  // When the browser requests `/assets/index-....js`, Express will look for
  // `[...]/frontend/dist/assets/index-....js`
  app.use(express.static(FRONTEND_DIST_PATH));

  // 2. Handle the "root" request, which serves the entry HTML file
  app.get("/", (req, res) => {
    res.sendFile(path.join(FRONTEND_DIST_PATH, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

io.listen(3001, () => {
  console.log("oy");
});

app.listen(port, () => {
  connectDb();
  console.log("Server running at http://localhost:" + port);
});

// sandi akun dev: uk7wydviwyd
