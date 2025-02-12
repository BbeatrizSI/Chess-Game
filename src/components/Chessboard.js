import React, { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

const ChessboardComponent = () => {
  const [game, setGame] = useState(new Chess());
  const [status, setStatus] = useState("Turno de Blancas");
  const [engine, setEngine] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("Cargando Stockfish...");
      try {
        const stockfishWorker = new Worker("/stockfish.js");
        stockfishWorker.postMessage("uci");
        stockfishWorker.onmessage = (event) => {
          console.log("Stockfish dice:", event.data);
        };
        setEngine(stockfishWorker);
      } catch (error) {
        console.error("Error cargando Stockfish:", error);
      }
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

  const makeAIMove = (fen) => {
    if (!engine) {
      console.error("Stockfish no está disponible.");
      return;
    }

    engine.onmessage = (event) => {
      if (event.data.startsWith("bestmove")) {
        const bestMove = event.data.split(" ")[1];
        console.log("Mejor movimiento de la IA:", bestMove);

        if (bestMove.length === 4) {
          const from = bestMove.substring(0, 2);
          const to = bestMove.substring(2, 4);

          const newGame = new Chess(fen); // 🔹 Usa el FEN actualizado del jugador
          const move = newGame.move({ from, to, promotion: "q" });

          if (move) {
            setGame(newGame);
            updateStatus(newGame);
          } else {
            console.error("Movimiento de IA inválido:", bestMove);
          }
        }
      }
    };

    engine.postMessage(`position fen ${fen}`);
    engine.postMessage("go depth 5"); // Ajusta la dificultad de la IA
};

  const onDrop = (sourceSquare, targetSquare) => {
    const newGame = new Chess(game.fen()); // Clona el estado actual
    const move = newGame.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // Promociona automáticamente a reina
    });

    if (move) {
      console.log("Movimiento del jugador:", move);
      setGame(newGame); // 🔹 Actualiza el estado del juego ANTES de llamar a la IA
      updateStatus(newGame);

      setTimeout(() => makeAIMove(newGame.fen()), 500); // 🔹 Pasa la posición actualizada a Stockfish
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
