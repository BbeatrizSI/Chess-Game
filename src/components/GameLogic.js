import { Chess } from "chess.js";

class GameLogic {
  constructor() {
    this.game = new Chess();
  }

  move(from, to) {
    let move = this.game.move({ from, to, promotion: "q" });
    return move ? this.game.fen() : null;
  }

  getFen() {
    return this.game.fen();
  }

  resetGame() {
    this.game = new Chess();
  }
}

const gameInstance = new GameLogic();
export default gameInstance;
