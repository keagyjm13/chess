window.addEventListener('DOMContentLoaded', () => {
  const game = new Chess();

  // openings: name, color, moves
  const openings = {
    ruy: { name:'Ruy Lopez', color:'white', moves:['e4','e5','Nf3','Nc6','Bb5'] },
    italian: { name:'Italian Game', color:'white', moves:['e4','e5','Nf3','Nc6','Bc4','Bc5'] },
    sicilian: { name:'Sicilian Defense', color:'black', moves:['e4','c5','Nf3','d6','d4','cxd4','Nxd4','Nf6','Nc3','a6'] },
    french: { name:'French Defense', color:'black', moves:['e4','e6','d4','d5','Nc3'] },
    carokann: { name:'Caro–Kann Defense', color:'black', moves:['e4','c6','d4','d5','Nc3','dxe4','Nxe4','Bf5'] },
    scandinavian: { name:'Scandinavian Defense', color:'black', moves:['e4','d5','exd5','Qxd5','Nc3','Qa5'] },
    pirc: { name:'Pirc Defense', color:'black', moves:['e4','d6','d4','Nf6','Nc3','g6'] },
    modern: { name:'Modern Defense', color:'black', moves:['e4','g6','d4','Bg7','Nc3','d6'] },
    kingsindian: { name:'King\'s Indian Defense', color:'black', moves:['d4','Nf6','c4','g6','Nc3','Bg7','e4','d6'] },
    nimzo: { name:'Nimzo–Indian Defense', color:'black', moves:['d4','Nf6','c4','e6','Nc3','Bb4'] },
    queensgambit: { name:'Queen\'s Gambit', color:'white', moves:['d4','d5','c4','e6','Nc3','Nf6'] },
    london: { name:'London System', color:'white', moves:['d4','d5','Nf3','Nf6','Bf4','e6','e3','c5','c3','Nc6'] },
    english: { name:'English Opening', color:'white', moves:['c4','e5','Nc3','Nf6'] }
  };

  let currentOpening = null;
  let moveIndex = 0;

  // build the dropdown dynamically
  const sel = document.getElementById('openingSelect');
  for (const key in openings) {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = openings[key].name;
    sel.appendChild(opt);
  }

  document.getElementById('startOpeningBtn').addEventListener('click', () => {
    document.getElementById('openingSelect').style.display = 'inline';
  });

  const board = Chessboard('board', {
    draggable: true,
    position: 'start',
    onDragStart: (source, piece) => {
      const userColor = board.orientation();
      if ((userColor === 'white' && piece.startsWith('b')) ||
          (userColor === 'black' && piece.startsWith('w'))) return false;
      if (game.game_over()) return false;
    },
    onDrop: (source, target) => {
      const move = game.move({ from: source, to: target, promotion: 'q' });
      if (move === null) return 'snapback';

      // if practicing an opening, check the user move correctness
      if (currentOpening) {
        const expected = currentOpening.moves[moveIndex];
        if (expected && move.san !== expected) {
          alert(`Expected ${expected}, not ${move.san}`);
          game.undo();
          board.position(game.fen());
          return 'snapback';
        }
        moveIndex++;

        // opponent auto move
        const oppMove = currentOpening.moves[moveIndex];
        if (oppMove) {
          setTimeout(() => {
            game.move(oppMove);
            board.position(game.fen());
            moveIndex++;
            updateStatus();
          }, 500);
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
    updateStatus();
  });

  document.getElementById('flipBtn').addEventListener('click', () => {
    board.flip();
    updateStatus();
  });

  document.getElementById('openingSelect').addEventListener('change', (e) => {
    const val = e.target.value;
    if (!val) return;

    const opening = openings[val];
    currentOpening = opening;
    moveIndex = 0;
    game.reset();

    // orient board based on opening color
    if (opening.color === 'black') {
      board.orientation('black');
    } else {
      board.orientation('white');
    }
    board.start();
    updateStatus();

    alert(`Practicing ${opening.name}`);

    // If the user is black, white’s first move plays automatically after a delay
    if (opening.color === 'black') {
      const oppMove = currentOpening.moves[0];
      setTimeout(() => {
        game.move(oppMove);
        board.position(game.fen());
        moveIndex = 1;
        updateStatus();
      }, 700);
    }
  });

  updateStatus();
});