import "./App.css";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from "./components/Home";
import Title from "./components/Title";
import Game from "./components/Game";
import "./styles/Home.css";
import "./styles/Title.css";
import { useState } from "react";
 
function App() {
  const [displayGame, setDisplayGame] = useState(false);
  
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
      {displayGame ? <Game /> : <Home />}
    </div>
  );
}

export default App;
