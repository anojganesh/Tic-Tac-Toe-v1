const express = require("express");
const app = express();
const port = 3001;
const cors = require('cors');
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
app.use(express.static(path.resolve("")));
app.use(express.json());
app.use(cors());
app.use(express.static(path.resolve(__dirname, '../../client/build')));
let isReady = false;

let arr = [];
let playingArray = [];
io.on("connection", (socket) => {
  socket.on("find", (e) => {
    console.log("server recieved socket request");
    
    if (e.name!=null){
      arr.push(e.name);

      if (arr.length >= 2){
        
        let p1Obj = {
          name : arr[0],
          value : "X",
          move : ""
        }

        let p2Obj = {
          name : arr[1],
          value : "O",
          move : "",
        }

        let obj = {
          p1 : p1Obj,
          p2 : p2Obj
        }
        playingArray.push(obj);
        arr.splice(0,2);
        io.emit("find", {allPlayersArray : playingArray})
        console.log("playingArray: ");
        console.log(playingArray);
      }
    }
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

server.listen(port, ()=> {
    console.log(`Server is listening at http://localhost:${port}`);
})