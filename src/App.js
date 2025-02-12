import React from "react";
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import ChessboardComponent from "./components/Chessboard";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h1>Juego de Ajedrez</h1>
        <ChessboardComponent />
      </div>
    </DndProvider>
  );
}

export default App;
