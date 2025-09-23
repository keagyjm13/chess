window.addEventListener('DOMContentLoaded', () => {
  const game = new Chess();

  // define openings
  const openings = {
  // 1. Ruy Lopez
    ruy: [
      'e4','e5','Nf3','Nc6','Bb5'
    ],
    // 2. Italian Game
    italian: [
      'e4','e5','Nf3','Nc6','Bc4','Bc5'
    ],
    // 3. Sicilian Defense (Open Sicilian main line)
    sicilian: [
      'e4','c5','Nf3','d6','d4','cxd4','Nxd4','Nf6','Nc3','a6' // Najdorf
    ],
    // 4. French Defense
    french: [
      'e4','e6','d4','d5','Nc3'
    ],
    // 5. Caro-Kann Defense
    carokann: [
      'e4','c6','d4','d5','Nc3','dxe4','Nxe4','Bf5'
    ],
    // 6. Scandinavian Defense
    scandinavian: [
      'e4','d5','exd5','Qxd5','Nc3','Qa5'
    ],
    // 7. Pirc Defense
    pirc: [
      'e4','d6','d4','Nf6','Nc3','g6'
    ],
    // 8. Modern Defense
    modern: [
      'e4','g6','d4','Bg7','Nc3','d6'
    ],
    // 9. King's Indian Defense
    kingsindian: [
      'd4','Nf6','c4','g6','Nc3','Bg7','e4','d6'
    ],
    // 10. Nimzo-Indian Defense
    nimzo: [
      'd4','Nf6','c4','e6','Nc3','Bb4'
    ],
    // 11. Queen's Gambit
    queensgambit: [
      'd4','d5','c4','e6','Nc3','Nf6'
    ],
    // 12. London System
    london: [
      'd4','d5','Nf3','Nf6','Bf4','e6','e3','c5','c3','Nc6'
    ],
    // 13. English Opening
    english: [
      'c4','e5','Nc3','Nf6'
    ]
  };

  let currentOpening = null;
  let moveIndex = 0;

  const board = Chessboard('board', {
    draggable: true,
    position: 'start',
    onDragStart: (source, piece) => {
      // block moving opponent pieces
      const userColor = board.orientation(); // 'white' or 'black'
      if ((userColor === 'white' && piece.startsWith('b')) ||
          (userColor === 'black' && piece.startsWith('w'))) return false;
      if (game.game_over()) return false;
    },
    onDrop: (source, target) => {
      const move = game.move({ from: source, to: target, promotion: 'q' });
      if (move === null) return 'snapback';

      // if practicing an opening, check user move correctness
      if (currentOpening) {
        const expected = currentOpening[moveIndex];
        if (expected && move.san !== expected) {
          alert(`Expected ${expected}, not ${move.san}`);
          game.undo();
          board.position(game.fen());
          return 'snapback';
        }
        moveIndex++;

        // after user makes a correct move, auto-play the next opening move for the opponent **with delay**
        const oppMove = currentOpening[moveIndex];
        if (oppMove) {
          setTimeout(() => {
            game.move(oppMove);
            board.position(game.fen());
            moveIndex++;
            updateStatus();
          }, 450); // delay
        }
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
    updateStatus();
  });

  // show opening dropdown
  document.getElementById('startOpeningBtn').addEventListener('click', () => {
    document.getElementById('openingSelect').style.display = 'inline';
  });

  // start practicing the selected opening
  document.getElementById('openingSelect').addEventListener('change', (e) => {
    const val = e.target.value;
    if (!val) return;

    // load the chosen opening
    currentOpening = openings[val];
    moveIndex = 0;
    game.reset();
    board.start();
    updateStatus();

    alert(`Practicing ${e.target.options[e.target.selectedIndex].text}`);

    // Determine which color the user is playing by board orientation
    const userColor = board.orientation(); // 'white' or 'black'

    // If the user is black, the opening starts with a white move, so play it automatically after a short delay
    if (userColor === 'black') {
      const oppMove = currentOpening[0]; // first move of the opening
      setTimeout(() => {
        game.move(oppMove);
        board.position(game.fen());
        moveIndex = 1;
        updateStatus();
      }, 700); // 700ms delay before opponent's move
    }
  });


  updateStatus();
});
