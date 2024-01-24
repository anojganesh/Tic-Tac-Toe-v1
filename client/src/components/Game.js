import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import loading from "../assets/loading-gif (1).gif";

function Game({ name1, name2, value }) {
  const server = "http://localhost:3001";
  const [myName, setName1] = useState(name1);
  const [oppName, setName2] = useState(name2);
  const [myValue, setValue] = useState(value);
  const [turn, setTurn] = useState("X");
  useEffect(() => {
    setName1(name1);
    setName2(name2);
    setValue(value);
  }, [name1, name2, value]);

  const socket = io(server);

  const buttonClicked = (e) => {
    if (value === turn) {
      e.innerText = myValue;
      socket.emit("playing", {
        value: myValue,
        id: e.target.id,
        name: myName,
      });
    }
  };

  socket.on("reset", (e) => {
    let foundObj = undefined;
    for (let i = e.allPlayersArray.length - 1; i >= 0; i--) {
      //reverse indexing
      let obj = e.allPlayersArray[i];
      if (obj.p1.name == `${name1}` || obj.p2.name == `${name1}`) {
        foundObj = obj;
        break;
      }
    }
    if (foundObj) {
      setButtons();
      setTurn('X');
    }

    socket.off("reset");
  });

  const setButtons = () => {
    Array.from(document.getElementById("cont").children).map((button) => {
      button.disabled = false;
      button.textContent = "";
      button.style.color = 'rgba(0, 0, 0, 0.75)';
      document.getElementById("requeueBtn").style.display = "none";
      document.getElementById("requeueBtn").disabled = false;
      document.getElementById("btnloading").style.display = "none";
      document.getElementById("menuBtn").style.display = "none";
    });
  };

  socket.on("playing", (e) => playingFunc(e));

  const playingFunc = (e) => {
    console.log("playing was run");
    console.log(e.gamePlayers);
    let p1Id = e.gamePlayers.p1.move;
    let p2Id = e.gamePlayers.p2.move;
    if (myName == e.gamePlayers.p1.name || myName == e.gamePlayers.p2.name) {
      console.log("playing got through");
      if (e.gamePlayers.sum % 2 == 0) {
        setTurn("X");
      } else {
        setTurn("O");
      }
      if (p1Id != "") {
        updateButtons(p1Id, "X");
      } else if (p2Id != "") {
        updateButtons(p2Id, "O");
      }
      if (!checkWin()) {
        if (e.gamePlayers.sum == 9) {
          //tie
          socket.off("playing");
          setTimeout(function () {
            alert("It's a Tie!");
          }, 100);
          showReplayButtons();
          socket.emit("gameend", { position: "tie", name: name1 });
        }
      }
      socket.off("playing");
    }
  };

  socket.on("areyouhere", function (e) {
    console.log("I am here");
    socket.emit("areyouhere", { name: name1 });
  });

  function updateButtons(id, myValue) {
    document.getElementById(id).innerText = myValue;
    document.getElementById(id).disabled = true;
  }

  function showReplayButtons() {
    document.getElementById("requeueBtn").style.display = "block";
    document.getElementById("requeueBtn").disabled = false;
    document.getElementById("menuBtn").style.display = "block";
    document.getElementById("btnloading").style.display = "none";
  }

  const checkWin = () => {
    //checking dynamically incase I want to expand to a bigger board
    let buttons = [];
    let idButtons = [];
    let grid = document.getElementById("cont").children;
    grid = Array.from(grid).filter((element) => element.tagName !== "BR");
    const row = Math.sqrt(Number(grid.length));
    let count = 0;
    for (let i = 0; i < row; i++) {
      let rowArr = [];
      let idArr = [];
      for (let j = 0; j < row; j++) {
        rowArr.push(document.getElementById(grid[count].id).innerText);
        idArr.push(document.getElementById(grid[count].id));
        count++;
      }
      buttons.push(rowArr);
      idButtons.push(idArr);
    }
    let oppValue = "";
    myValue == "X" ? (oppValue = "O") : (oppValue = "X");
    if (
      diagonalCheck(buttons, myValue) ||
      horizontalCheck(buttons, myValue) ||
      verticalCheck(buttons, myValue)
    ) {
      //win
      socket.off("playing");
      setTimeout(function () {
        alert("You Win!");
      }, 100);
      showReplayButtons();
      socket.emit("gameend", { position: "winner", name: name1 });
      return true;
    } else if (
      diagonalCheck(buttons, oppValue) ||
      horizontalCheck(buttons, oppValue) ||
      verticalCheck(buttons, oppValue)
    ) {
      //lose
      socket.off("playing");
      setTimeout(function () {
        alert("You Lose!");
      }, 100);
      showReplayButtons();
      socket.emit("gameend", { position: "loser", name: name1 });
      return true;
    }

    function colorButtons(toColor) {
      for (let i = 0; i < toColor.length; i++) {
        document.getElementById(toColor[i].id).style.color = "red";
      }
    }

    function diagonalCheck(buttons, value) {
      let toColor = [];
      const row = Number(buttons.length);
      for (let i = 0; i < row; i++) {
        if (buttons[i][i] != value) {
          break;
        } else if (i == row - 1) {
          toColor.push(idButtons[i][i]);
          colorButtons(toColor);
          return true;
        } else {
          toColor.push(idButtons[i][i]);
        }
      }
      toColor = [];
      for (let i = 0; i < row; i++) {
        if (buttons[i][row - i - 1] != value) {
          break;
        } else if (i == row - 1) {
          toColor.push(idButtons[i][row - i - 1]);
          colorButtons(toColor);
          return true;
        } else {
          toColor.push(idButtons[i][row - i - 1]);
        }
      }
      return false;
    }

    function horizontalCheck(buttons, value) {
      let toColor = [];
      const row = Number(buttons.length);
      for (let i = 0; i < row; i++) {
        for (let j = 0; j < row; j++) {
          if (buttons[i][j] != value) {
            break;
          } else if (j == row - 1) {
            toColor.push(idButtons[i][j]);
            colorButtons(toColor);
            return true;
          } else {
            toColor.push(idButtons[i][j]);
          }
        }
        toColor = [];
      }
      return false;
    }

    function verticalCheck(buttons, value) {
      let toColor = [];
      const row = Number(buttons.length);
      for (let i = 0; i < row; i++) {
        for (let j = 0; j < row; j++) {
          if (buttons[j][i] != value) {
            break;
          } else if (j == row - 1) {
            toColor.push(idButtons[j][i]);
            colorButtons(toColor);
            return true;
          } else {
            toColor.push(idButtons[j][i]);
          }
        }
        toColor = [];
      }
      return false;
    }
    return false;
  };

  const getMenu = () => {
    Array.from(document.getElementById("cont").children).map((button) => {
      button.disabled = false;
    });
    socket.emit("getmenu", { name: myName });
  };

  const getRequeue = () => {
    document.getElementById("btnloading").style.display = "inline-block";
    document.getElementById("requeueBtn").disabled = true;

    socket.emit("find", { name: myName });
    console.log("game.js - ", myName);
  };

  return (
    <div id="canvas2">
      <div>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
          crossOrigin="anonymous"
        />
      </div>
      <div className="row row2">
        <div className="col-sm-6">
          <h2 id="userCont" className="names">
            You: <span id="user">{name1}</span>
          </h2>
        </div>
        <div className="col-sm-6">
          <h2 id="oppNameCont" className="names">
            Opponent: <span id="oppName">{name2}</span>
          </h2>
        </div>
      </div>
      <div className="row row5">
        <div>
          <br />
          <p id="valueCont">
            You are playing as <span id="value">{value}</span>
          </p>
          <br />
          <p id="whosTurn">{turn + "'s Turn"}</p>
        </div>
      </div>
      <div id="bigCont" className="row">
        <div id="cont" className="col-md-12">
          <button onClick={buttonClicked} id="btn1" className="btn"></button>
          <button onClick={buttonClicked} id="btn2" className="btn"></button>
          <button onClick={buttonClicked} id="btn3" className="btn"></button>
          <br />
          <button onClick={buttonClicked} id="btn4" className="btn"></button>
          <button onClick={buttonClicked} id="btn5" className="btn"></button>
          <button onClick={buttonClicked} id="btn6" className="btn"></button>
          <br />
          <button onClick={buttonClicked} id="btn7" className="btn"></button>
          <button onClick={buttonClicked} id="btn8" className="btn"></button>
          <button onClick={buttonClicked} id="btn9" className="btn"></button>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6 replay">
          <button onClick={getRequeue} id="requeueBtn">
            Requeue
            <img id="btnloading" src={loading} />
          </button>
        </div>
        <div className="col-sm-6 replay">
          <button onClick={getMenu} id="menuBtn">
            Menu
          </button>
        </div>
      </div>
    </div>
  );
}

export default Game;
