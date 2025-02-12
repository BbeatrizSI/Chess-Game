import React, { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

const ChessboardComponent = () => {
  const [game, setGame] = useState(new Chess());
  const [status, setStatus] = useState("Turno de Blancas");
  const [engine, setEngine] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stockfishWorker = new Worker("/stockfish.js"); // Cargar desde /public
      stockfishWorker.postMessage("uci");
      setEngine(stockfishWorker);
    }
  }, []);

  const updateStatus = (chess) => {
    if (chess.isCheckmate()) {
      setStatus(`¡Jaque Mate! Ganador: ${chess.turn() === "w" ? "Negras" : "Blancas"}`);
    } else if (chess.isDraw()) {
      setStatus("¡Tablas!");
    } else {
      setStatus(`Turno de: ${chess.turn() === "w" ? "Blancas" : "Negras"}`);
    }
  };

  const makeAIMove = () => {
    if (!engine) return;

    engine.onmessage = (event) => {
      if (event.data.startsWith("bestmove")) {
        const bestMove = event.data.split(" ")[1];
        const newGame = new Chess(game.fen());
        newGame.move({ from: bestMove.substring(0, 2), to: bestMove.substring(2, 4), promotion: "q" });
        setGame(newGame);
        updateStatus(newGame);
      }
    };

    engine.postMessage(`position fen ${game.fen()}`);
    engine.postMessage("go depth 10"); // Ajusta la dificultad de la IA
  };

  const onDrop = (sourceSquare, targetSquare) => {
    const newGame = new Chess(game.fen());
    const move = newGame.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (move) {
      setGame(newGame);
      updateStatus(newGame);
      setTimeout(() => makeAIMove(), 500); // La IA responde
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <h2>Juego de Ajedrez vs IA</h2>
      <p>{status}</p>
      <Chessboard position={game.fen()} onPieceDrop={onDrop} boardWidth={500} customBoardStyle={{borderRadius: '5px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, 0%)'}}/>
      <button onClick={() => { setGame(new Chess()); setStatus("Turno de Blancas"); }} style={{ marginTop: "600px" }}>
        Reiniciar Partida
      </button>
    </div>
  );
};

export default ChessboardComponent;
