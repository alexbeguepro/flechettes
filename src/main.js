import './style.css'

// State Management
let state = {
  players: [],
  gameMode: null,
  currentScreen: 'welcome',
  settings: {
    startScore: 301,
    doubleOut: true
  },
  game: {
    currentPlayerIndex: 0,
    history: [],
    winner: null,
    turnDarts: [], 
    currentMultiplier: 1,
    turnScoreInput: ''
  }
};

const APP = document.querySelector('#app');

// Utils
const saveState = () => localStorage.setItem('darts_players_v3', JSON.stringify(state.players));
const loadState = () => {
  const saved = localStorage.getItem('darts_players_v3');
  if (saved) {
    state.players = JSON.parse(saved);
  }
};

const navigate = (screen, pushToHistory = true) => {
  state.currentScreen = screen;
  if (pushToHistory) {
    window.history.pushState({ screen }, '', '#' + screen);
  }
  render();
  window.scrollTo(0, 0);
};

window.addEventListener('popstate', (e) => {
  if (e.state && e.state.screen) {
    navigate(e.state.screen, false);
  } else {
    navigate('welcome', false);
  }
});

// --- LOGIC ---

const getCricketSymbol = (hits) => {
  if (hits === 0) return '';
  if (hits === 1) return '/';
  if (hits === 2) return 'X';
  return 'Ⓧ';
};

// --- SCREENS ---

const WelcomeScreen = () => `
  <div class="screen welcome" style="justify-content: center; align-items: center; text-align: center;">
    <div style="margin-bottom: 50px; position: relative;">
      <h1 style="font-size: 3.8rem; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; text-shadow: 0 4px 20px rgba(0,0,0,0.9); line-height: 1; margin-bottom: 10px;">
        FLECHETTE<br><span style="color: var(--secondary);">MASTER</span>
      </h1>
      <div style="background: rgba(0,0,0,0.5); display: inline-block; padding: 4px 16px; border-radius: 20px; border: 1px solid var(--primary);">
        <p style="color: white; font-weight: 700; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 3px;">
          Tournament Edition
        </p>
      </div>
    </div>
    <div class="glass" style="padding: 40px; text-align: center; border-radius: 32px; width: 100%; max-width: 400px; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
      <button class="btn btn-primary" style="width: 100%; height: 65px; font-size: 1.3rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;" id="btn-start">
        JOUER <i data-lucide="target" style="width: 24px; height: 24px;"></i>
      </button>
    </div>
  </div>
`;

const PlayersScreen = () => `
  <div class="screen">
    <header style="margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;">
      <h2>Joueurs</h2>
      <button id="btn-back-welcome" class="glass" style="width: 40px; height: 40px; border-radius: 12px; border: none; color: white;">
        <i data-lucide="x"></i>
      </button>
    </header>

    <div style="display: flex; gap: 12px; margin-bottom: 20px;">
      <input type="text" id="player-name" placeholder="Nom du joueur..." style="flex: 1;">
      <button class="btn btn-primary" id="btn-add-player" style="width: 56px; border-radius: 16px;">
        <i data-lucide="plus"></i>
      </button>
    </div>

    <div id="players-list" style="flex: 1; overflow-y: auto; padding-right: 5px;">
      ${state.players.length === 0 ? '<p style="text-align: center; color: var(--text-muted); padding: 40px;">Ajoutez des joueurs !</p>' : ''}
      ${state.players.map((p, i) => `
        <div class="player-tag glass" style="margin-bottom: 8px;">
          <div class="avatar" style="background: ${p.color}">${p.name[0].toUpperCase()}</div>
          <span style="flex: 1; font-weight: 600;">${p.name}</span>
          <button class="btn-remove" data-index="${i}" style="background: none; border: none; color: var(--danger); padding: 5px;"><i data-lucide="trash-2"></i></button>
        </div>
      `).join('')}
    </div>

    <div style="padding: 10px 0 20px 0;">
      <button class="btn btn-secondary" style="width: 100%; height: 60px; font-size: 1.1rem;" id="btn-next-modes" ${state.players.length < 1 ? 'disabled style="opacity: 0.3;"' : ''}>
        CONTINUER <i data-lucide="chevron-right"></i>
      </button>
    </div>
  </div>
`;

const ModesScreen = () => `
  <div class="screen">
    <header style="margin-bottom: 30px;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <button id="btn-back-players" style="background: none; border: none; color: white;"><i data-lucide="arrow-left"></i></button>
        <h2>Modes de Jeu</h2>
      </div>
    </header>
    <div class="game-modes" style="grid-template-columns: 1fr; gap: 12px;">
      <div class="mode-card glass" data-mode="301" style="flex-direction: row; justify-content: flex-start; padding: 20px; aspect-ratio: auto;">
        <div style="background: var(--primary-glow); padding: 12px; border-radius: 12px; margin-right: 20px;"><i data-lucide="target" style="color: var(--primary);"></i></div>
        <div><h3 style="font-weight: 800;">301</h3><p style="font-size: 0.8rem; color: var(--text-muted);">Le classique rapide</p></div>
      </div>
      <div class="mode-card glass" data-mode="501" style="flex-direction: row; justify-content: flex-start; padding: 20px; aspect-ratio: auto;">
        <div style="background: var(--primary-glow); padding: 12px; border-radius: 12px; margin-right: 20px;"><i data-lucide="target" style="color: var(--primary);"></i></div>
        <div><h3 style="font-weight: 800;">501</h3><p style="font-size: 0.8rem; color: var(--text-muted);">Le vrai classique</p></div>
      </div>
      <div class="mode-card glass" data-mode="cricket" style="flex-direction: row; justify-content: flex-start; padding: 20px; aspect-ratio: auto;">
        <div style="background: var(--accent-glow); padding: 12px; border-radius: 12px; margin-right: 20px;"><i data-lucide="award" style="color: var(--accent);"></i></div>
        <div><h3 style="font-weight: 800;">CRICKET</h3><p style="font-size: 0.8rem; color: var(--text-muted);">Tactique & Zones</p></div>
      </div>
      <div class="mode-card glass" data-mode="tour-du-monde" style="flex-direction: row; justify-content: flex-start; padding: 20px; aspect-ratio: auto;">
        <div style="background: var(--accent-glow); padding: 12px; border-radius: 12px; margin-right: 20px;"><i data-lucide="globe" style="color: var(--accent);"></i></div>
        <div><h3 style="font-weight: 800;">TOUR DU MONDE</h3><p style="font-size: 0.8rem; color: var(--text-muted);">1 à 20 + Bull (en ordre)</p></div>
      </div>
    </div>
  </div>
`;

const GameScreen = () => {
  const currentPlayer = state.players[state.game.currentPlayerIndex];
  const isX01 = state.gameMode === '301' || state.gameMode === '501';
  const isCricketMode = state.gameMode === 'cricket';
  const isTourDuMonde = state.gameMode === 'tour-du-monde';
  const tdmSequence = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25];

  return `
    <div class="screen">
      <header style="display: flex; justify-content: space-between; margin-bottom: 12px; align-items: center;">
        <div style="background: rgba(255,255,255,0.1); padding: 4px 12px; border-radius: 10px; font-size: 0.6rem; font-weight: 800; color: var(--text-muted);">${state.gameMode.toUpperCase()}</div>
        <div style="display: flex; gap: 8px;">
          <button id="btn-undo" class="glass" style="width: 32px; height: 32px; border-radius: 10px;"><i data-lucide="rotate-ccw" style="width: 14px;"></i></button>
          <button id="btn-quit" class="glass" style="width: 32px; height: 32px; border-radius: 10px; color: var(--danger);"><i data-lucide="log-out" style="width: 14px;"></i></button>
        </div>
      </header>

      <div class="scoreboard" style="gap: 6px;">
        ${state.players.map((p, i) => `
          <div class="player-score-card glass ${i === state.game.currentPlayerIndex ? 'active' : ''}" style="padding: 8px 12px;">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
              <div class="avatar" style="background: ${p.color}; width: 22px; height: 22px; font-size: 0.7rem;">${p.name[0]}</div>
              <div style="flex: 1;">
                <div style="font-size: 0.8rem; font-weight: 700;">${p.name}</div>
              </div>
              <div style="font-size: 1.2rem; font-weight: 800; margin-left: 10px; display: flex; align-items: center; gap: 10px;">
                ${isX01 ? p.score : (isCricketMode ? p.cricketScore : '')}
                ${isTourDuMonde ? `
                  <div style="display: flex; flex-direction: column; align-items: center; line-height: 1;">
                    <span style="font-size: 0.6rem; color: var(--text-muted); font-weight: 600;">CIBLE</span>
                    <span style="color: var(--accent);">${p.tdmIndex < tdmSequence.length ? (tdmSequence[p.tdmIndex] === 25 ? 'B' : tdmSequence[p.tdmIndex]) : 'Gagné!'}</span>
                  </div>
                  <div style="width: 24px; height: 24px; border: 2px solid rgba(255,255,255,0.1); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; background: rgba(0,0,0,0.3);">
                    ${getCricketSymbol(p.tdmHits)}
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      ${isCricketMode ? `
        <div class="glass" style="padding: 10px; margin-top: 10px; border-radius: 16px;">
          <div class="cricket-grid" style="grid-template-columns: 1fr repeat(7, 1fr); gap: 4px;">
            <div class="cricket-header"></div>
            ${[20, 19, 18, 17, 16, 15, 25].map(n => `<div class="cricket-header">${n === 25 ? 'B' : n}</div>`).join('')}
            ${state.players.map(p => `
              <div class="cricket-row">
                <div style="font-size: 0.5rem; font-weight: 700; align-self: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 30px;">${p.name}</div>
                ${[20, 19, 18, 17, 16, 15, 25].map(n => `<div class="cricket-cell ${p.cricket[n] >= 3 ? 'closed' : ''}" style="height: 24px; font-size: 0.6rem;">${getCricketSymbol(p.cricket[n])}</div>`).join('')}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div class="glass" style="padding: 15px; margin: 10px 0; text-align: center; border-radius: 24px; ${isX01 ? 'flex: 1;' : ''} display: flex; flex-direction: column;">
        ${isX01 ? `
          <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 20px; color: var(--text-muted);">
            Score de la volée : <br><span id="turn-score-display" style="color: white; font-size: 3rem; font-weight: 800; line-height: 1; display: inline-block; min-height: 3rem;">${state.game.turnScoreInput || '0'}</span>
          </div>
          <div class="darts-kb" style="grid-template-columns: repeat(3, 1fr); gap: 8px; flex: 1;">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button class="kb-btn numpad" data-val="${n}">${n}</button>`).join('')}
            <button class="kb-btn" id="kb-del-numpad" style="background: rgba(239,68,68,0.2); color: #ef4444;"><i data-lucide="delete"></i></button>
            <button class="kb-btn numpad" data-val="0">0</button>
            <button class="kb-btn" id="kb-bust-numpad" style="background: rgba(245,158,11,0.2); color: #f59e0b; font-size: 0.8rem;">BUST</button>
            <button class="kb-btn btn-primary" id="kb-enter-numpad" style="grid-column: span 3; height: 60px; margin-top: 4px; font-size: 1.2rem;">VALIDER</button>
          </div>
        ` : isTourDuMonde ? `
          <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 15px;">
            ${Array(3).fill(0).map((_, idx) => `
              <div class="glass" style="width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 12px; border-width: 2px; border-color: ${idx < state.game.turnDarts.length ? 'var(--primary)' : 'rgba(255,255,255,0.05)'}">
                <span style="font-weight: 800; font-size: 0.9rem;">
                  ${state.game.turnDarts[idx] ? (state.game.turnDarts[idx].value === 0 ? '0' : (state.game.turnDarts[idx].multiplier === 1 ? 'S' : state.game.turnDarts[idx].multiplier === 2 ? 'D' : 'T')) : ''}
                </span>
              </div>
            `).join('')}
          </div>
          <div class="darts-kb" style="grid-template-columns: 1fr 1fr; gap: 8px; flex: 1;">
            <button class="kb-btn tdm-btn" data-mult="0" style="height: 60px; background: rgba(255,255,255,0.05);">RATÉ (0)</button>
            <button class="kb-btn tdm-btn" data-mult="1" style="height: 60px; background: rgba(16, 185, 129, 0.2); color: #10b981;">SIMPLE (1)</button>
            <button class="kb-btn tdm-btn" data-mult="2" style="height: 60px; background: rgba(245, 158, 11, 0.2); color: #f59e0b;">DOUBLE (2)</button>
            <button class="kb-btn tdm-btn" data-mult="3" style="height: 60px; background: rgba(239, 68, 68, 0.2); color: #ef4444;">TRIPLE (3)</button>
            <button class="kb-btn" id="kb-del-tdm" style="grid-column: span 1; height: 56px;"><i data-lucide="delete"></i></button>
            <button class="kb-btn btn-primary" id="kb-enter-tdm" style="grid-column: span 1; height: 56px;">VALIDER</button>
          </div>
        ` : `
          <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 15px;">
            ${Array(3).fill(0).map((_, idx) => `
              <div class="glass" style="width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 12px; border-width: 2px; border-color: ${idx < state.game.turnDarts.length ? 'var(--primary)' : 'rgba(255,255,255,0.05)'}">
                <span style="font-weight: 800; font-size: 0.9rem;">
                  ${state.game.turnDarts[idx] ? (state.game.turnDarts[idx].multiplier > 1 ? (state.game.turnDarts[idx].multiplier === 2 ? 'D' : 'T') : '') + (state.game.turnDarts[idx].value === 25 ? 'B' : (state.game.turnDarts[idx].value === 0 ? '-' : state.game.turnDarts[idx].value)) : ''}
                </span>
              </div>
            `).join('')}
          </div>

          <div id="multiplier-select" style="display: flex; gap: 6px; justify-content: center; margin-bottom: 10px;">
            <button class="kb-btn ${state.game.currentMultiplier === 1 ? 'active' : ''}" data-mult="1" style="flex: 1; height: 44px; font-size: 0.7rem; border-radius: 12px;">SIMPLE</button>
            <button class="kb-btn ${state.game.currentMultiplier === 2 ? 'active' : ''}" data-mult="2" style="flex: 1; height: 44px; font-size: 0.7rem; border-radius: 12px;">DOUBLE</button>
            <button class="kb-btn ${state.game.currentMultiplier === 3 ? 'active' : ''}" data-mult="3" style="flex: 1; height: 44px; font-size: 0.7rem; border-radius: 12px;">TRIPLE</button>
          </div>

          <div class="darts-kb" style="grid-template-columns: repeat(4, 1fr); gap: 4px; flex: 1;">
            ${[20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(n => `<button class="kb-btn segment" data-val="${n}" style="height: auto; font-size: 0.8rem; border-radius: 10px;">${n}</button>`).join('')}
            <button class="kb-btn segment" data-val="25" style="border-radius: 10px;">BULL</button>
            <button class="kb-btn segment" data-val="0" style="border-radius: 10px;">MISS</button>
            <button class="kb-btn" id="kb-del" style="border-radius: 10px;"><i data-lucide="delete"></i></button>
            <button class="kb-btn btn-primary" id="kb-enter" style="grid-column: span 4; height: 56px; margin-top: 4px; border-radius: 16px; font-size: 1.1rem;">VALIDER LE TOUR</button>
          </div>
        `}
      </div>
    </div>
  `;
};

const WinnerScreen = (winner) => `
  <div class="screen" style="justify-content: center; align-items: center; text-align: center;">
    <div style="margin-bottom: 30px; animation: pulse 2s infinite;">
      <i data-lucide="trophy" style="width: 80px; height: 80px; color: var(--accent);"></i>
    </div>
    <h1 style="font-size: 2.5rem; margin-bottom: 10px;">${winner.name.toUpperCase()}</h1>
    <p style="color: var(--text-muted); margin-bottom: 40px;">A REMPORTÉ LA PARTIE !</p>
    <div style="width: 100%; display: flex; flex-direction: column; gap: 12px;">
      <button class="btn btn-primary" id="btn-restart" style="height: 60px;">REJOUER</button>
      <button class="btn btn-outline" id="btn-home" style="height: 60px; color: white;">ACCUEIL</button>
    </div>
  </div>
`;

// --- RENDER & LOGIC ---

function startGame(mode) {
  state.gameMode = mode;
  state.players.forEach((p, i) => {
    p.score = (state.gameMode === '301') ? 301 : (state.gameMode === '501' ? 501 : 0);
    p.cricket = {};
    if (state.gameMode === 'cricket') {
      [15,16,17,18,19,20,25].forEach(n => p.cricket[n] = 0);
    } else if (state.gameMode === 'tour-du-monde') {
      p.tdmIndex = 0;
      p.tdmHits = 0;
    }
    p.cricketScore = 0;
  });
  state.game.currentPlayerIndex = 0;
  state.game.turnDarts = [];
  state.game.turnScoreInput = '';
  state.game.currentMultiplier = 1;
  state.game.history = [];
  state.game.winner = null;
  navigate('game');
}

function render() {
  if (state.currentScreen === 'welcome') APP.innerHTML = WelcomeScreen();
  else if (state.currentScreen === 'players') APP.innerHTML = PlayersScreen();
  else if (state.currentScreen === 'modes') APP.innerHTML = ModesScreen();
  else if (state.currentScreen === 'game') APP.innerHTML = GameScreen();
  else if (state.currentScreen === 'winner') APP.innerHTML = WinnerScreen(state.game.winner);

  lucide.createIcons();
  attachEvents();
}

function processCricketDart(dart, player) {
  if ([15, 16, 17, 18, 19, 20, 25].includes(dart.value)) {
    const hitsBefore = player.cricket[dart.value];
    player.cricket[dart.value] += dart.multiplier;
    
    if (player.cricket[dart.value] > 3) {
      const extra = Math.max(0, dart.multiplier - (hitsBefore < 3 ? 3 - hitsBefore : 0));
      const anyoneOpen = state.players.some(p => p.cricket[dart.value] < 3);
      if (anyoneOpen) player.cricketScore += dart.value * extra;
    }
  }
}

function processTourDuMondeDart(dart, player) {
  const tdmSequence = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25];
  if (player.tdmIndex >= tdmSequence.length) return; // already finished
  
  if (dart.value === tdmSequence[player.tdmIndex]) {
    player.tdmHits += dart.multiplier;
    if (player.tdmHits >= 3) {
      player.tdmIndex++;
      player.tdmHits = 0; // overflow hits don't carry over
    }
  }
}

function checkGlobalWinner() {
  const player = state.players[state.game.currentPlayerIndex];
  if (state.gameMode === 'cricket') {
    const allClosed = [15, 16, 17, 18, 19, 20, 25].every(n => player.cricket[n] >= 3);
    const topScore = state.players.every(p => p.cricketScore <= player.cricketScore);
    if (allClosed && topScore) state.game.winner = player;
  } else if (state.gameMode === 'tour-du-monde') {
    const tdmSequence = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25];
    if (player.tdmIndex >= tdmSequence.length) {
      state.game.winner = player;
    }
  }
  if (state.game.winner) navigate('winner');
}

function attachEvents() {
  const btnStart = document.querySelector('#btn-start');
  if (btnStart) btnStart.onclick = () => navigate('players');

  const btnAddPlayer = document.querySelector('#btn-add-player');
  const inputPlayer = document.querySelector('#player-name');
  if (btnAddPlayer) btnAddPlayer.onclick = () => {
    const name = inputPlayer.value.trim();
    if (name) {
      state.players.push({ name, color: colors[state.players.length % colors.length] });
      inputPlayer.value = '';
      saveState();
      render();
    }
  };

  const btnBackPlayers = document.querySelector('#btn-back-players');
  if (btnBackPlayers) btnBackPlayers.onclick = () => navigate('players');

  const btnBackWelcome = document.querySelector('#btn-back-welcome');
  if (btnBackWelcome) btnBackWelcome.onclick = () => navigate('welcome');

  document.querySelectorAll('.btn-remove').forEach(btn => btn.onclick = () => {
    state.players.splice(btn.dataset.index, 1);
    saveState();
    render();
  });

  const btnNextModes = document.querySelector('#btn-next-modes');
  if (btnNextModes) btnNextModes.onclick = () => navigate('modes');

  document.querySelectorAll('.mode-card').forEach(card => card.onclick = () => {
    startGame(card.dataset.mode);
  });

  document.querySelectorAll('#multiplier-select .kb-btn').forEach(btn => {
    btn.onclick = () => {
      state.game.currentMultiplier = parseInt(btn.dataset.mult);
      document.querySelectorAll('#multiplier-select .kb-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    };
  });

  // Cricket Segment buttons
  document.querySelectorAll('.kb-btn.segment').forEach(btn => {
    btn.onclick = () => {
      if (state.game.turnDarts.length < 3) {
        const val = parseInt(btn.dataset.val);
        if (val === 25 && state.game.currentMultiplier === 3) return; 

        state.game.history.push(JSON.parse(JSON.stringify({ players: state.players, currentPlayerIndex: state.game.currentPlayerIndex, turnDarts: state.game.turnDarts })));
        
        const dart = { value: val, multiplier: state.game.currentMultiplier };
        state.game.turnDarts.push(dart);
        
        if (state.gameMode === 'cricket') {
          processCricketDart(dart, state.players[state.game.currentPlayerIndex]);
        }
        checkGlobalWinner();

        state.game.currentMultiplier = 1; 
        render();
      }
    };
  });

  // Tour du Monde buttons
  document.querySelectorAll('.tdm-btn').forEach(btn => {
    btn.onclick = () => {
      if (state.game.turnDarts.length < 3) {
        const mult = parseInt(btn.dataset.mult);
        state.game.history.push(JSON.parse(JSON.stringify({ players: state.players, currentPlayerIndex: state.game.currentPlayerIndex, turnDarts: state.game.turnDarts })));
        
        const player = state.players[state.game.currentPlayerIndex];
        const tdmSequence = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25];
        const target = player.tdmIndex < tdmSequence.length ? tdmSequence[player.tdmIndex] : 0;
        
        const dart = { value: mult > 0 ? target : 0, multiplier: mult > 0 ? mult : 1 };
        state.game.turnDarts.push(dart);
        
        processTourDuMondeDart(dart, player);
        checkGlobalWinner();
        render();
      }
    };
  });

  const undoDart = () => {
    if (state.game.history.length > 0) {
      const last = state.game.history.pop();
      state.players = last.players;
      state.game.currentPlayerIndex = last.currentPlayerIndex;
      state.game.turnDarts = last.turnDarts;
      render();
    }
  };
  const btnDel = document.querySelector('#kb-del');
  if (btnDel) btnDel.onclick = undoDart;
  const btnDelTdm = document.querySelector('#kb-del-tdm');
  if (btnDelTdm) btnDelTdm.onclick = undoDart;

  const validateTurn = () => {
    if (state.game.turnDarts.length === 0) return;
    state.game.history.push(JSON.parse(JSON.stringify({ players: state.players, currentPlayerIndex: state.game.currentPlayerIndex, turnDarts: state.game.turnDarts })));
    state.game.currentPlayerIndex = (state.game.currentPlayerIndex + 1) % state.players.length;
    state.game.turnDarts = [];
    render();
  };
  const btnEnter = document.querySelector('#kb-enter');
  if (btnEnter) btnEnter.onclick = validateTurn;
  const btnEnterTdm = document.querySelector('#kb-enter-tdm');
  if (btnEnterTdm) btnEnterTdm.onclick = validateTurn;

  // Numpad events for X01
  document.querySelectorAll('.numpad').forEach(btn => {
    btn.onclick = () => {
      const val = btn.dataset.val;
      if (state.game.turnScoreInput.length < 3) {
        let newVal = state.game.turnScoreInput + val;
        if (parseInt(newVal) > 180) newVal = '180';
        state.game.turnScoreInput = newVal;
        const display = document.getElementById('turn-score-display');
        if (display) display.textContent = state.game.turnScoreInput;
      }
    };
  });

  const btnDelNumpad = document.querySelector('#kb-del-numpad');
  if (btnDelNumpad) btnDelNumpad.onclick = () => {
    state.game.turnScoreInput = state.game.turnScoreInput.slice(0, -1);
    const display = document.getElementById('turn-score-display');
    if (display) display.textContent = state.game.turnScoreInput || '0';
  };

  const btnBustNumpad = document.querySelector('#kb-bust-numpad');
  if (btnBustNumpad) btnBustNumpad.onclick = () => {
    state.game.history.push(JSON.parse(JSON.stringify({ players: state.players, currentPlayerIndex: state.game.currentPlayerIndex, turnScoreInput: state.game.turnScoreInput })));
    state.game.turnScoreInput = '';
    state.game.currentPlayerIndex = (state.game.currentPlayerIndex + 1) % state.players.length;
    render();
  };

  const btnEnterNumpad = document.querySelector('#kb-enter-numpad');
  if (btnEnterNumpad) btnEnterNumpad.onclick = () => {
    if (!state.game.turnScoreInput) return;
    const score = parseInt(state.game.turnScoreInput);
    if (isNaN(score)) return;

    state.game.history.push(JSON.parse(JSON.stringify({ players: state.players, currentPlayerIndex: state.game.currentPlayerIndex, turnScoreInput: state.game.turnScoreInput })));
    
    const player = state.players[state.game.currentPlayerIndex];
    const newScore = player.score - score;
    
    if (newScore === 0) {
      player.score = 0;
      state.game.winner = player;
      navigate('winner');
      return;
    } else if (newScore > 0) { // Keep simple for now: 1 is fine if they don't play strict double out, otherwise we can change it. Let's say > 0 is fine.
      player.score = newScore;
    } // else bust, score remains same

    state.game.turnScoreInput = '';
    state.game.currentPlayerIndex = (state.game.currentPlayerIndex + 1) % state.players.length;
    render();
  };

  const btnUndo = document.querySelector('#btn-undo');
  if (btnUndo) btnUndo.onclick = () => {
    if (state.game.history.length > 0) {
      const last = state.game.history.pop();
      state.players = last.players;
      state.game.currentPlayerIndex = last.currentPlayerIndex;
      if (last.turnDarts !== undefined) state.game.turnDarts = last.turnDarts;
      if (last.turnScoreInput !== undefined) state.game.turnScoreInput = last.turnScoreInput;
      render();
    }
  };

  const btnQuit = document.querySelector('#btn-quit');
  if (btnQuit) btnQuit.onclick = () => { if(confirm('Quitter la partie ?')) navigate('modes'); };
  
  const btnRestart = document.querySelector('#btn-restart');
  if (btnRestart) btnRestart.onclick = () => startGame(state.gameMode);

  const btnHome = document.querySelector('#btn-home');
  if (btnHome) btnHome.onclick = () => navigate('welcome');
}

const colors = ['#06b6d4', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
loadState();
window.history.replaceState({ screen: state.currentScreen }, '', '#' + state.currentScreen);
render();
