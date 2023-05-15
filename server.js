const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const cors = require("cors");
const morgan = require("morgan");

const appRouter = require("./route");

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(morgan("common"));

let server = http.createServer(app);
let io = socketIO(server);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", appRouter);

io.on("connection", (socket) => {
  console.log("New user connected", socket.id);
});

server.listen(port, () => console.log(`Server running on ${port}`));
