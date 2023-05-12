const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const cors = require("cors");
const morgan = require("morgan");

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(morgan());

let server = http.createServer(app);
let io = socketIO(server);

app.use(express.json());

app.use("/", express.static("client/dist"));
app.post("/transcribe", (req, res) => {
  try {
    const message = req.body.message;
    res.send(`${message} transcribed`);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(`${message} transcribed`);
  }
});

io.on("connection", (socket) => {
  console.log("New user connected", socket.id);
});

server.listen(port, () => console.log(`Server running on ${port}`));
