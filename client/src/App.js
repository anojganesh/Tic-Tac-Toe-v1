import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Title from "./components/Title";
import Game from "./components/Game";
import "./styles/Home.css";
import "./styles/Title.css";
import "./styles/Game.css";
import { useState } from "react";
import io from "socket.io-client";

function App() {
  /*http://localhost:3000*/
  /*https://cs.torontomu.ca/~a3ganesh/Tic-Tac-Toe-v1/src/index.js*/
  const server = "https://cs.torontomu.ca/~a3ganesh/Tic-Tac-Toe-v1/src/index.js";
  const [displayGame, setDisplayGame] = useState(false);
  const [pName1, setPName1] = useState("");
  const [pName2, setPName2] = useState("");
  const [letterValue, setValue] = useState("");
  const socket = io(server);

  socket.on("find", (e) => {
    if (!e.empty) {
      let allPlayersArray = e.allPlayersArray;
      let value = "default";
      let oppName = "";
      let name = "";

      try {
        name = document.getElementById("name").value;
      } catch (e) {
        try {
          name = document.getElementById("user").textContent;
        } catch (e) {}
      }
      let foundObj = undefined;
      for (let i = allPlayersArray.length - 1; i >= 0; i--) {
        //reverse indexing
        let obj = allPlayersArray[i];
        if (obj.p1.name == `${name}` || obj.p2.name == `${name}`) {
          foundObj = obj;
          break;
        }
      }
      if (foundObj) {
        if (foundObj.p1.name == foundObj.p2.name) {
          alert("Match aborted: Same name as opponent!");
          document.getElementById("name").value = "";
          document.getElementById("find").disabled = false;
          document.getElementById("loading").style.display = "none";
        } else {
          foundObj.p1.name == `${name}`
            ? (oppName = foundObj.p2.name)
            : (oppName = foundObj.p1.name);
          foundObj.p1.name == `${name}`
            ? (value = foundObj.p1.value)
            : (value = foundObj.p2.value);
          setPName1(name);
          setPName2(oppName);
          setValue(value);
          setDisplayGame(true);
        }
      }
    }
  });


  socket.on("getmenu", (e) => {
    if (pName1 == e.name) {
      setDisplayGame(false);
    }
  });

  return (
    <div className="App container-fluid">
      <div>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <title>Tic-Tac-Toe</title>
        <link rel="stylesheet" href="style.css" />
      </div>

      <Title />
      {displayGame ? (
        <Game name1={pName1} name2={pName2} value={letterValue} />
      ) : (
        <Home />
      )}
    </div>
  );
}

export default App;
