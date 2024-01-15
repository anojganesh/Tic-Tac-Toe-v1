import React from "react";

function Game() {
  return (
    <>
      <div>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
          crossOrigin="anonymous"
        />
      </div>
      <div className="row row2">
        <div className="col-md-6">
          <h2 id="userCont" className="names">
            You: <span id="user"></span>
          </h2>
        </div>
        <div className="col-md-6">
          <h2 id="oppNameCont" className="names">
            Opponent: <span id="oppName"></span>
          </h2>
        </div>
      </div>
      <br />
      <p id="valueCont">
        You are playing as <span id="value"></span>
      </p>
      <br />
      <p id="whosTurn">X's Turn</p>
      <div id="bigCont">
          <div id="cont">
            <button id="btn1" className="btn"></button>
            <button id="btn2" className="btn"></button>
            <button id="btn3" className="btn"></button>
            <button id="btn4" className="btn"></button>
            <button id="btn5" className="btn"></button>
            <button id="btn6" className="btn"></button>
            <button id="btn7" className="btn"></button>
            <button id="btn8" className="btn"></button>
            <button id="btn9" className="btn"></button>
          </div>
        </div>
    </>
  );
}

export default Game;
