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
    if (game.in_checkmate()) status = 'Checkmate!';
    else if (game.in_draw()) status = 'Draw!';
    else status = (game.turn() === 'w' ? 'White' : 'Black') + ' to move';
    if (game.in_check()) status += ' (Check!)';
    console.log(status);
  }

  updateStatus();
});
