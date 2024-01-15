const express = require("express");
const app = express();
const port = 3000;

const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server)
app.use(express.static(path.resolve("")));

let isReady = false;


let name;
app.get("/game", (req, res) =>{
  name = req.body;
  console.log("/game listened");
  
})

server.listen(port, ()=> {
    console.log(`Server is listening at http://localhost:${port}`);
})