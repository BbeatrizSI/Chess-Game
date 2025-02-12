const stockfish = () => {
    const worker = new Worker(
      URL.createObjectURL(
        new Blob(
          [
            `
            var stockfish = null;
            function uciCmd(cmd) { postMessage(cmd); stockfish && stockfish.postMessage(cmd); }
            onmessage = function(event) {
              if (!stockfish) {
                stockfish = new Worker('https://raw.githubusercontent.com/official-stockfish/Stockfish-scripts/master/stockfish.js');
                stockfish.onmessage = function(event) { postMessage(event.data); };
              }
              uciCmd(event.data);
            };
            `
          ],
          { type: "application/javascript" }
        )
      )
    );
    return worker;
  };
  
  export default stockfish;
  