const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const clientUrl = "http://localhost:3000";
const io = new Server(server, {
  cors: {
    origin: clientUrl,
    methods: ["GET", "POST"],
  },
});

app.use(express.static(path.resolve("")));
app.use(express.json());
app.use(cors());
app.use(express.static(path.resolve(__dirname, "../../client/build")));
let disconnectedCount = 0;

let arr = [];
let playingArray = [];

setInterval(() => {
  console.log("checked for inactive games"); //threshold for inactive game deletion 
  checkPlayingArray(); // currently 5-10 min
}, 5 * 60 * 1000);

const checkPlayingArray = () => {
  let now = Date.now();
  playingArray.forEach((obj) => {
    if ((now - obj.createdAt) > 5 * 60 * 1000){
      console.log("game deleted - " + obj.p1.name + " vs " + obj.p2.name);
      deleteArray(obj);
    } 
  })
}

const deleteArray = (obj) => {
  playingArray = playingArray.filter(arr => {arr != obj});
}

io.on("connection", (socket) => {
  socket.on("find", (e) => {
    console.log(`server recieved socket request with socket id ${socket.id}`);
    if (e.name != null && !checkDupeNames(playingArray, e.name)) {
      arr.push(e.name);

      if (arr.length >= 2) {
        let p1Obj = {
          name: arr[0],
          value: "X",
          move: "",
        };

        let p2Obj = {
          name: arr[1],
          value: "O",
          move: "",
        };

        let obj = {
          p1: p1Obj,
          p2: p2Obj,
          sum: 0,
          createdAt: Date.now()
        };

        playingArray.push(obj);
        arr.splice(0, 2);
        console.log(playingArray + "");
        io.emit("find", { allPlayersArray: playingArray, empty: false });
        console.log('sending reset');
        io.emit("reset", { allPlayersArray: playingArray });
      }
    } else {
      socket.emit("finderror", {});
    }
  });


  socket.on("playing", (e) => {
    console.log("playing recieved");
    let objToChange = undefined;
    for (let i = playingArray.length - 1; i >= 0; i--) {
      //reverse indexing
      let obj = playingArray[i];
      if (e.name == obj.p1.name || e.name == obj.p2.name) {
        console.log(Date(obj.createdAt)); // make game active again
        obj.createdAt = Date.now();
        objToChange = obj;
        break;
      }
    }
    if (objToChange) {
      if (e.value === "X") {
        objToChange.p1.move = e.id;
        objToChange.sum++;
      } else if (e.value === "O") {
        objToChange.p2.move = e.id;
        objToChange.sum++;
      }
      console.log("playing sent");
      console.log(objToChange);
      io.emit("playing", { gamePlayers: objToChange });
      objToChange.p1.move = "";
      objToChange.p2.move = "";
    }
  });

  socket.on("gameend", (e) => {
    //delete game after game end
    playingArray = playingArray.filter(
      (obj) => obj.p1.name != e.name && obj.p2.name != e.name
    );
  });

  socket.on("getmenu", (e) => {
    io.emit("getmenu", { name: e.name });
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
});

server.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

const checkDupeNames = (playingArray, name) => {
  let count = 0;
  for (let i = 0; i < playingArray.length; i++) {
    let arr = playingArray[i];
    if (name == arr.p1.name || name == arr.p2.name) {
      count++;
    }
  }
  if (count > 0) {
    return true;
  } else {
    return false;
  }
};
