import React from "react";
import io from "socket.io-client";

function Game({ name1, name2, value }) {
  const socket = io();
  console.log(name1);
  console.log(name2);
  socket.on("find", (e) => {
    let allPlayersArray = e.allPlayersArray;
  });

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
          <p id="whosTurn">X's Turn</p>
        </div>
      </div>
      <div id="bigCont" className="row">
        <div id="cont" className="col-md-12">
          <button id="btn1" className="btn"></button>
          <button id="btn2" className="btn"></button>
          <button id="btn3" className="btn"></button>
          <br />
          <button id="btn4" className="btn"></button>
          <button id="btn5" className="btn"></button>
          <button id="btn6" className="btn"></button>
          <br />
          <button id="btn7" className="btn"></button>
          <button id="btn8" className="btn"></button>
          <button id="btn9" className="btn"></button>
        </div>
      </div>
    </div>
  );
}

export default Game;
