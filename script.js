window.addEventListener('DOMContentLoaded', () => {
  const game = new Chess();

  const board = Chessboard('board', {
    draggable: true,
    position: 'start',
    onDragStart: (source, piece) => {
      if ((game.turn() === 'w' && piece.startsWith('b')) ||
          (game.turn() === 'b' && piece.startsWith('w'))) return false;
      if (game.game_over()) return false;
    },
    onDrop: (source, target) => {
      const move = game.move({ from: source, to: target, promotion: 'q' });
      if (move === null) return 'snapback';
      updateStatus();
    }
  });

  function updateStatus() {
    let status = '';
    if (game.in_checkmate()) status = "Checkmate!";
    else if (game.in_draw()) status = "Draw!";
    else status = (game.turn() === 'w' ? "White" : "Black") + " to move";
    if (game.in_check()) status += " (Check!)";

    document.getElementById('status').textContent = 'Status: ' + status;
    document.getElementById('moves').textContent = 'Moves: ' + game.pgn();
  }

  document.getElementById('resetBtn').addEventListener('click', () => {
    game.reset();
    board.start();
    updateStatus();
  });

  document.getElementById('loadScenarioBtn').addEventListener('click', () => {
    const fen = "r1bqkbnr/pppppppp/n7/8/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 2 2";
    game.load(fen);
    board.position(fen);
    updateStatus();
  });

  updateStatus();
});
