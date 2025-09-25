window.addEventListener('DOMContentLoaded', () => {
  const game = new Chess();

  // openings: now with branch trees
  // tree: keys = moves played so far separated by spaces, values = array of allowed opponent replies
  const openings = {
    ruy: {
      name: 'Ruy Lopez',
      color: 'white',
      tree: {
        // 1.e4
        '': ['e4'],
        'e4': ['e5'],

        // 2.Nf3
        'e4 e5': ['Nf3'],

        // 2...Nc6 or 2...d6
        'e4 e5 Nf3': ['Nc6', 'd6'], // mainline or Steinitz

        // Main line 3.Bb5
        'e4 e5 Nf3 Nc6': ['Bb5'],

        // Anti-Steinitz 3.d4
        'e4 e5 Nf3 d6': ['d4'],

        // After 3.Bb5 black has a few options
        'e4 e5 Nf3 Nc6 Bb5': ['a6', 'Nf6', 'd6', 'Bc5'],

        // Morphy Defense 3...a6
        'e4 e5 Nf3 Nc6 Bb5 a6': ['Ba4', 'Bxc6'], // Retreat or Exchange

        // 4.Ba4 Nf6/d6
        'e4 e5 Nf3 Nc6 Bb5 a6 Ba4': ['Nf6', 'd6'],

        // 4.Ba4 Nf6 5.O-O (main line) or 5.d3 (quiet)
        'e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6': ['O-O', 'd3'],

        // after 5.O-O black has 5...Be7 or 5...b5
        'e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O': ['Be7', 'b5'],

        // after 5.O-O Be7 6.Re1 (main)
        'e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7': ['Re1'],

        // Exchange variation 4.Bxc6
        'e4 e5 Nf3 Nc6 Bb5 a6 Bxc6': ['dxc6'], // black must recapture

        // Berlin Defense 3...Nf6 4.O-O or 4.d3
        'e4 e5 Nf3 Nc6 Bb5 Nf6': ['O-O', 'd3'],

        // after 4.O-O black’s 4...Nxe4 or 4...Be7
        'e4 e5 Nf3 Nc6 Bb5 Nf6 O-O': ['Nxe4', 'Be7'],

        // Steinitz Deferred 3...d6 4.c3 or 4.O-O
        'e4 e5 Nf3 Nc6 Bb5 d6': ['c3', 'O-O'],

        // Classical 3...Bc5 4.c3 or 4.O-O
        'e4 e5 Nf3 Nc6 Bb5 Bc5': ['c3', 'O-O']
      }
    },

    italian: {
      name: 'Italian Game',
      color: 'white',
      tree: {
        // 1.e4
        '': ['e4'],
        'e4': ['e5'],

        // 2.Nf3
        'e4 e5': ['Nf3'],
        'e4 e5 Nf3': ['Nc6'],

        // 3.Bc4 (Italian) or 3.Bb5 (Evans Gambit transposition)
        'e4 e5 Nf3 Nc6': ['Bc4', 'Bb5'],

        // === 3.Bc4 lines ===
        // 3...Bc5 (Giuoco) or 3...Nf6 (Two Knights)
        'e4 e5 Nf3 Nc6 Bc4': ['Bc5', 'Nf6'],

        // 4.c3 (Giuoco Piano mainline) or 4.b4 (Evans Gambit)
        'e4 e5 Nf3 Nc6 Bc4 Bc5': ['c3','b4'],

        // after 4.c3 Nf6 or Qf6
        'e4 e5 Nf3 Nc6 Bc4 Bc5 c3': ['Nf6','Qf6'],

        // after 4.b4 (Evans Gambit) Bxb4 or Bb6
        'e4 e5 Nf3 Nc6 Bc4 Bc5 b4': ['Bxb4','Bb6'],

        // Two Knights Defense 3...Nf6
        'e4 e5 Nf3 Nc6 Bc4 Nf6': ['Ng5','d3'], // Fried Liver or quiet

        // 4.Ng5 d5
        'e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5': ['d5'],

        // 5.exd5 Na5 or Nxd5
        'e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5': ['Na5','Nxd5'],

        // 4.d3 (slow Italian)
        'e4 e5 Nf3 Nc6 Bc4 Nf6 d3': ['Be7','Bc5'],

        // === 3.Bb5 (Evans Gambit–style / Ruy transposition) ===
        'e4 e5 Nf3 Nc6 Bb5': ['Nf6','a6']
      }
    },

    sicilian: {
      name: 'Sicilian Defense',
      color: 'black',
      tree: {
        // 1.e4
        '': ['e4'],
        'e4': ['c5'],

        // 2.Nf3
        'e4 c5': ['Nf3'],

        // 2...d6 (Najdorf/Dragon/Sheveningen) or 2...Nc6 (Classical/Accelerated)
        'e4 c5 Nf3': ['d6','Nc6','e6'],  // added 2...e6 for Taimanov/Kan flavour

        // === 2...d6 branch ===
        'e4 c5 Nf3 d6': ['d4'],                // Open Sicilian
        'e4 c5 Nf3 d6 d4': ['cxd4'],           // main recapture
        'e4 c5 Nf3 d6 d4 cxd4': ['Nxd4'],
        'e4 c5 Nf3 d6 d4 cxd4 Nxd4': ['Nf6','a6','g6'], // Classical, Najdorf, Dragon

        // after 5.Nc3 in Najdorf
        'e4 c5 Nf3 d6 d4 cxd4 Nxd4 a6': ['Nc3','Be3'], // Najdorf vs English Attack

        // === 2...Nc6 branch ===
        'e4 c5 Nf3 Nc6': ['d4','Bb5'], // Open vs Moscow
        'e4 c5 Nf3 Nc6 d4': ['cxd4'],
        'e4 c5 Nf3 Nc6 d4 cxd4': ['Nxd4'],
        'e4 c5 Nf3 Nc6 d4 cxd4 Nxd4': ['g6','Nf6','e6'], // Accelerated Dragon, Classical, Sveshnikov

        // === 2...e6 branch (Kan/Taimanov) ===
        'e4 c5 Nf3 e6': ['d4','c3'],
        'e4 c5 Nf3 e6 d4': ['cxd4'],
        'e4 c5 Nf3 e6 d4 cxd4': ['Nxd4'],
        'e4 c5 Nf3 e6 d4 cxd4 Nxd4': ['a6','Qc7'] // Kan main moves
      }
    },

    french: {
      name: 'French Defense',
      color: 'black',
      tree: {
        // 1.e4
        '': ['e4'],
        'e4': ['e6'],

        // 2.d4
        'e4 e6': ['d4'],

        // 2...d5
        'e4 e6 d4': ['d5'],

        // 3.Nc3 (Classical), 3.Nd2 (Tarrasch), 3.e5 (Advance), 3.exd5 (Exchange)
        'e4 e6 d4 d5': ['Nc3','Nd2','e5','exd5'],

        // === Nc3 Classical branch ===
        'e4 e6 d4 d5 Nc3': ['Nf6','Bb4'], // Winawer or Classical
        'e4 e6 d4 d5 Nc3 Nf6': ['Bg5','e5'], // Steinitz or main line
        'e4 e6 d4 d5 Nc3 Bb4': ['e5','exd5'], // Winawer main vs Exchange

        // === Nd2 Tarrasch branch ===
        'e4 e6 d4 d5 Nd2': ['c5','Nf6'], // main Tarrasch or Guimard
        'e4 e6 d4 d5 Nd2 c5': ['exd5','Ngf3'], // open or closed Tarrasch

        // === e5 Advance branch ===
        'e4 e6 d4 d5 e5': ['c5','Bd7'], // Advance main moves
        'e4 e6 d4 d5 e5 c5': ['c3','Nf3'],

        // === Exchange branch ===
        'e4 e6 d4 d5 exd5': ['exd5'],
        'e4 e6 d4 d5 exd5 exd5': ['Nf3','c4'] // Exchange options
      }
    },

    carokann: {
      name: 'Caro–Kann Defense',
      color: 'black',
      tree: {
        // 1.e4
        '': ['e4'],
        'e4': ['c6'],

        // 2.d4
        'e4 c6': ['d4'],

        // 2...d5
        'e4 c6 d4': ['d5'],

        // 3.Nc3 (Two Knights), 3.dxe5 (Advance), 3.Nd2 (Tartakower)
        'e4 c6 d4 d5': ['Nc3','Nd2','e5','exd5'],

        // === Nc3 branch ===
        'e4 c6 d4 d5 Nc3': ['dxe4','Nf6'],          // Classical or 2 Knights
        'e4 c6 d4 d5 Nc3 dxe4': ['Nxe4'],
        'e4 c6 d4 d5 Nc3 Nf6': ['e5'],              // Two Knights variation

        // === Nd2 branch ===
        'e4 c6 d4 d5 Nd2': ['dxe4','Nf6'],          // Main Tarrasch or 2 Knights variation
        'e4 c6 d4 d5 Nd2 dxe4': ['Nxe4'],

        // === Advance branch ===
        'e4 c6 d4 d5 e5': ['Bf5','c5'],            // main or Karpov line
        'e4 c6 d4 d5 e5 Bf5': ['Nf3','h4'],

        // === Exchange branch ===
        'e4 c6 d4 d5 exd5': ['cxd5'],
        'e4 c6 d4 d5 exd5 cxd5': ['Bd3','Nf3']
      }
    },

    scandinavian: {
      name: 'Scandinavian Defense',
      color: 'black',
      tree: {
        // 1.e4
        '': ['e4'],
        'e4': ['d5'],

        // 2.exd5
        'e4 d5': ['exd5'],

        // 2...Qxd5 or 2...Nf6 (mainline or Modern Scandinavian)
        'e4 d5 exd5': ['Qxd5','Nf6'],

        // === Qxd5 branch ===
        'e4 d5 exd5 Qxd5': ['Nc3','Nf3'],         // 3.Nc3 main, or 3.Nf3 sideline
        'e4 d5 exd5 Qxd5 Nc3': ['Qa5','Qd6','Qd8'], // 3...Qa5 main, or rare …Qd6/…Qd8
        'e4 d5 exd5 Qxd5 Nc3 Qa5': ['d4','Nf3','b4'], // 4.d4 classical, or 4.Nf3, or b4 gambit

        // === Nf6 branch === (Modern Scandinavian)
        'e4 d5 exd5 Nf6': ['c4','d4','Bb5+'],    // gambit, main, or check
        'e4 d5 exd5 Nf6 d4': ['Nxd5','Bg4'],     // 3…Nxd5 main, 3…Bg4 sideline
        'e4 d5 exd5 Nf6 c4': ['c6','e6']         // 3.c4 c6 or 3…e6 to prepare recapture
      }
    },

    pirc: {
      name: 'Pirc Defense',
      color: 'black',
      tree: {
        '': ['e4'],
        'e4': ['d6'],
        'e4 d6': ['d4'],
        'e4 d6 d4': ['Nf6'],
        'e4 d6 d4 Nf6': ['Nc3','f3'],                     // Classical or Austrian

        // === Classical (5.Nc3) ===
        'e4 d6 d4 Nf6 Nc3': ['g6','c6'],                  // 4…g6 main, 4…c6 Czech Pirc
        'e4 d6 d4 Nf6 Nc3 g6': ['Nf3','Be3','Bg5'],       // main developing moves after 4…g6

        // === Austrian (5.f3) ===
        'e4 d6 d4 Nf6 f3': ['g6','c6'],                   // 4…g6 main, 4…c6 sideline
        'e4 d6 d4 Nf6 f3 g6': ['Nc3','Be3']               // Austrian mainline follow-ups
      }
    },

    modern: {
      name: 'Modern Defense',
      color: 'black',
      tree: {
        '': ['e4'],
        'e4': ['g6'],
        'e4 g6': ['d4'],
        'e4 g6 d4': ['Bg7'],
        'e4 g6 d4 Bg7': ['Nc3','c3','Nf3'],           // main or slow build or flexible

        // after 5.Nc3 Black can play d6 (transposes to Pirc)
        'e4 g6 d4 Bg7 Nc3': ['d6','c6'],              // d6 = Pirc-like, c6 = Gurgenidze

        // after 5.c3 Black can still play d6
        'e4 g6 d4 Bg7 c3': ['d6','c5'],               // c5 = Modern with early ...c5

        // after 5.Nf3 Black has options too
        'e4 g6 d4 Bg7 Nf3': ['d6','c5']               // d6 normal, c5 immediate strike
      }
    },

    kingsindian: {
      name: "King's Indian Defense",
      color: 'black',
      tree: {
        '': ['d4'],
        'd4': ['Nf6'],
        'd4 Nf6': ['c4','Nf3'],                 // main or flexible move order
        'd4 Nf6 c4': ['g6'],
        'd4 Nf6 Nf3': ['g6'],

        // After 3...g6, White has several common moves
        'd4 Nf6 c4 g6': ['Nc3','Nf3','f3'],     // classical, Sämisch, or Averbakh setups
        'd4 Nf6 Nf3 g6': ['c4','Nc3','f3'],

        // After 4.Nc3, Black continues development
        'd4 Nf6 c4 g6 Nc3': ['Bg7','d5'],       // standard King's Indian, or early Benoni-style
        'd4 Nf6 Nf3 g6 Nc3': ['Bg7','d5'],

        // After 4.Nf3, Black’s typical replies
        'd4 Nf6 c4 g6 Nf3': ['Bg7','d5'],
        'd4 Nf6 Nf3 g6 Nf3': ['Bg7','d5']       // allows flexible lines
      }
    },

    nimzo: {
      name: 'Nimzo–Indian Defense',
      color: 'black',
      tree: {
        '': ['d4'],
        'd4': ['Nf6'],
        'd4 Nf6': ['c4','Nf3'],                 // main or flexible move order
        'd4 Nf6 c4': ['e6'],
        'd4 Nf6 Nf3': ['e6','g6'],             // allow flexible move order
        'd4 Nf6 c4 e6': ['Nc3','Nf3'],         // classical or flexible move order
        'd4 Nf6 c4 e6 Nc3': ['Bb4','d5'],      // main Nimzo–Indian or Queen's Gambit Declined
        'd4 Nf6 c4 e6 Nf3': ['Bb4','d5'],
        'd4 Nf6 Nf3 e6': ['Nc3','c4'],
        
        // After 4.Nc3 Bb4, some typical White continuations
        'd4 Nf6 c4 e6 Nc3 Bb4': ['e3','Qb3','f3'],   // classical, Rubinstein, or Sämisch setups
        'd4 Nf6 Nf3 e6 Nc3 Bb4': ['e3','Qb3','f3'],
        
        // Black’s flexible replies
        'd4 Nf6 c4 e6 Nc3 Bb4 e3': ['O-O','d5'],    // classical or Rubinstein
        'd4 Nf6 c4 e6 Nc3 Bb4 Qb3': ['c5','Nc6'],   // Qb3 lines
        'd4 Nf6 c4 e6 Nc3 Bb4 f3': ['O-O','d5']     // Sämisch setups
      }
    },

    queensgambit: {
      name: "Queen's Gambit",
      color: 'white',
      tree: {
        '': ['d4'],
        'd4': ['d5'],
        'd4 d5': ['c4'],
        'd4 d5 c4': ['e6','dxc4'],                // QGD or QGA
        'd4 d5 c4 e6': ['Nc3','Nf3'],            // mainline development
        'd4 d5 c4 dxc4': ['Nf3','e3'],           // Queen’s Gambit Accepted responses
        'd4 d5 c4 e6 Nc3': ['Nf6','Be7'],        // QGD mainlines: Orthodox or Tartakower
        'd4 d5 c4 e6 Nf3': ['Nf6','Be7'],        // flexible move order
        'd4 d5 c4 e6 Nc3 Nf6': ['Bg5','Nf3','cxd5'], // main lines
        'd4 d5 c4 e6 Nc3 Be7': ['Nf3','Bg5','cxd5'],
        'd4 d5 c4 dxc4 Nf3': ['Nf6','a6'],       // QGA development
        'd4 d5 c4 dxc4 e3': ['b5','Nf6'],        // QGA variations
        'd4 d5 c4 dxc4 Nf3 Nf6': ['Bxc4','Nc3'], // typical QGA plans
      }
    },

    london: {
      name: 'London System',
      color: 'white',
      tree: {
        '': ['d4'],
        'd4': ['d5'],
        'd4 d5': ['Nf3'],
        'd4 d5 Nf3': ['Nf6','Bf5'],                  // normal or early Bg4/Bf5
        'd4 d5 Nf3 Nf6': ['Bf4','e6'],               // classical vs setup with e6 first
        'd4 d5 Nf3 Nf6 Bf4': ['e6','c5','Bf5'],      // main London ideas: e6, c5, or counter-Bf5
        'd4 d5 Nf3 Nf6 Bf4 e6': ['e3','c5'],         // standard development
        'd4 d5 Nf3 Nf6 Bf4 c5': ['e3','cxd4'],       // classical or exchange variation
        'd4 d5 Nf3 Nf6 Bf4 Bf5': ['e3','c5'],        // mirrored bishop setup
        'd4 d5 Nf3 Nf6 Bf4 e6 e3': ['c5','Bd6'],     // normal development
        'd4 d5 Nf3 Nf6 Bf4 c5 e3': ['Nc6','cxd4'],   // main lines against London
      }
    },

    english: {
      name: 'English Opening',
      color: 'white',
      tree: {
        '': ['c4'],
        'c4': ['e5','c5'],                  // Reversed Sicilian or Symmetrical
        'c4 e5': ['Nc3','g3'],              // Main lines: Open English or Fianchetto
        'c4 e5 Nc3': ['Nc6','Nf6'],         // Classical vs Flexible setups
        'c4 e5 Nc3 Nc6': ['g3','Nf3'],      // Mainline or Four Knights
        'c4 e5 Nc3 Nf6': ['g3','Nf3'],      // King's Fianchetto vs standard
        'c4 e5 g3': ['Nc6','Nf6'],          // Fianchetto setups
        'c4 c5': ['Nc3','g3'],              // Symmetrical English
        'c4 c5 Nc3': ['Nc6','Nf6'],         // Classical or Hedgehog approach
        'c4 c5 g3': ['Nc6','Nf6']           // Fianchetto Symmetrical
      }
    }
  };


  let currentOpening = null;

  // Build dropdown
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

      // Assisted mode: check against tree
      if (currentOpening && assistedMode) {
        const prevMoves = game.history().slice(0, -1).join(' ');
        const allowed = currentOpening.tree[prevMoves];
        if (allowed && !allowed.includes(move.san)) {
          alert(`This move is not allowed in assisted mode. Allowed: ${allowed.join(', ')}`);
          game.undo();
          //board.position(game.fen());
          return 'snapback';
        }
      }

      // Update board after user's move
      //board.position(game.fen());
      updateStatus();

      // Opponent move after short delay
      if (currentOpening) {
        const afterMoves = game.history().join(' ');
        const oppChoices = currentOpening.tree[afterMoves];

        if (oppChoices && oppChoices.length > 0) {
          // Filter only legal moves
          const legalSANs = oppChoices.filter(san => game.moves().includes(san));
          if (legalSANs.length > 0) {
            setTimeout(() => {
              const oppMoveSan = legalSANs[Math.floor(Math.random() * legalSANs.length)];
              game.move(oppMoveSan);
              board.position(game.fen());
              updateStatus();
            }, 300); // 300ms delay
          }
        }
      }
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
      const oppChoices = opening.tree[''];
      if (oppChoices) {
        const oppMoveSan = oppChoices[Math.floor(Math.random() * oppChoices.length)];
        setTimeout(() => {
          game.move(oppMoveSan);
          board.position(game.fen());
          updateStatus();
        }, 700);
      }
    }
  });

  let assistedMode = false; // default: free mode

  // Show/hide the tree
  document.getElementById('showTreeBtn').addEventListener('click', () => {
    if (!currentOpening) {
      alert("Select an opening first!");
      return;
    }

    const display = document.getElementById('treeDisplay');
    display.style.display = display.style.display === 'none' ? 'block' : 'none';

    if (display.style.display === 'block') {
      assistedMode = true;
      display.innerHTML = formatTree(currentOpening.tree);
    } else {
      assistedMode = false;
    }
  });

  // Format tree as readable text
  function formatTree(tree) {
    let html = '';
    for (const key in tree) {
      const nextMoves = tree[key].join(', ');
      html += `<strong>${key || 'Start'}</strong> → ${nextMoves}<br/>`;
    }
    return html;
  }

  updateStatus();
});
