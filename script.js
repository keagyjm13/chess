window.addEventListener('DOMContentLoaded', () => {
  const game = new Chess();

  // dictionary of openings
  const openings = {
    ruy: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'], // Ruy Lopez
    sicilian: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6'] // Sicilian
  };

  let currentOpening = null; // holds the current opening array
  let moveIndex = 0;

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

      // if practicing an opening, check move correctness
      if (currentOpening) {
        const expected = currentOpening[moveIndex];
        if (expected && move.san !== expected) {
          alert(`Expected ${expected}, not ${move.san}`);
          game.undo();
          board.position(game.fen());
          return 'snapback';
        }
        moveIndex++;
      }

      updateStatus();
    }
  });

  function updateStatus() {
    let status = '';
    if (game.in_checkmate()) status = 'Checkmate!';
    else if (game.in_draw()) status = 'Draw!';
    else status = (game.turn() === 'w' ? 'White' : 'Black') + ' to move';
    if (game.in_check()) status += ' (Check!)';
    document.getElementById('status').textContent = 'Status: ' + status;
  }

  document.getElementById('resetBtn').addEventListener('click', () => {
    game.reset();
    board.start();
    moveIndex = 0;
    currentOpening = null;
    document.getElementById('openingSelect').style.display = 'none';
    updateStatus();
  });

  document.getElementById('flipBtn').addEventListener('click', () => {
    board.flip();
  });

  // when the user clicks “Practice Opening” show dropdown
  document.getElementById('startOpeningBtn').addEventListener('click', () => {
    document.getElementById('openingSelect').style.display = 'inline';
  });

  // when an opening is chosen from dropdown
  document.getElementById('openingSelect').addEventListener('change', (e) => {
    const val = e.target.value;
    if (!val) return;
    currentOpening = openings[val];
    moveIndex = 0;
    game.reset();
    board.start();
    updateStatus();
    alert(`Practicing ${e.target.options[e.target.selectedIndex].text}`);
  });

  updateStatus();
});
