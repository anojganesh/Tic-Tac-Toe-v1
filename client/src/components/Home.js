import React, { useState } from "react";
import loadingGif from "../assets/loading-gif (1).gif";
import Axios from "axios";
import io from "socket.io-client";
function Home() {
  const [player, setPlayer] = useState("");
  const socket = io();

  let name;
  const verifyGame = () => {
    name = document.getElementById("name").value;
    if (name.length === 0){
      name = "Player1";
    }
    console.log(`name: ${name}`);
    Axios.post("http://localhost:3001/game", name);
  
  
  };

  const updateName = (event) => {
    setPlayer(event.target.value);
  };

  return (
    <>
      <div className="row row3">
        <div className="col-md-12">
          <h1 id="enterName">Enter your Name : </h1>
          <input
            type="text"
            placeholder="Player1"
            id="name"
            autoComplete="off"
          />
        </div>
      </div>
      <div className="row row4">
        <div className="col-md-12">
          <button onClick={(event) => {updateName(event); verifyGame();}} id="find">
            Search for a player
          </button>
          <br />
          <a href="/game">test</a>
          <img src={loadingGif} id="loading" alt="loading" />
        </div>
      </div>
    </>
  );
}
export default Home;
