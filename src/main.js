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
    currentMultiplier: 1 
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
  <div class="screen welcome" style="justify-content: center;">
    <div style="text-align: center; margin-bottom: 60px;">
      <h1 style="font-size: 3.5rem; letter-spacing: -1px; line-height: 1;">FLECHETTE<br><span class="text-gradient">MASTER</span></h1>
      <p style="color: var(--text-muted); font-weight: 500; margin-top: 10px;">L'app ultime pour vos parties</p>
    </div>
    <div class="glass" style="padding: 30px; text-align: center; border-radius: 32px; margin: 0 20px;">
      <button class="btn btn-primary" style="width: 100%; height: 60px; font-size: 1.2rem;" id="btn-start">
        JOUER MAINTENANT <i data-lucide="play"></i>
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
        <div><h3 style="font-weight: 800;">301 / 501</h3><p style="font-size: 0.8rem; color: var(--text-muted);">Le classique</p></div>
      </div>
      <div class="mode-card glass" data-mode="cricket" style="flex-direction: row; justify-content: flex-start; padding: 20px; aspect-ratio: auto;">
        <div style="background: var(--accent-glow); padding: 12px; border-radius: 12px; margin-right: 20px;"><i data-lucide="award" style="color: var(--accent);"></i></div>
        <div><h3 style="font-weight: 800;">CRICKET</h3><p style="font-size: 0.8rem; color: var(--text-muted);">Tactique & Zones</p></div>
      </div>
      <div class="mode-card glass" data-mode="around-the-clock" style="flex-direction: row; justify-content: flex-start; padding: 20px; aspect-ratio: auto;">
        <div style="background: var(--primary-glow); padding: 12px; border-radius: 12px; margin-right: 20px;"><i data-lucide="clock" style="color: var(--primary);"></i></div>
        <div><h3 style="font-weight: 800;">HORLOGE</h3><p style="font-size: 0.8rem; color: var(--text-muted);">De 1 à 20</p></div>
      </div>
      <div class="mode-card glass" data-mode="killer" style="flex-direction: row; justify-content: flex-start; padding: 20px; aspect-ratio: auto;">
        <div style="background: rgba(239, 68, 68, 0.2); padding: 12px; border-radius: 12px; margin-right: 20px;"><i data-lucide="skull" style="color: #ef4444;"></i></div>
        <div><h3 style="font-weight: 800;">KILLER</h3><p style="font-size: 0.8rem; color: var(--text-muted);">Dernier survivant</p></div>
      </div>
    </div>
  </div>
`;

const GameScreen = () => {
  const currentPlayer = state.players[state.game.currentPlayerIndex];
  const isX01 = state.gameMode === '301' || state.gameMode === '501';
  const isCricket = state.gameMode === 'cricket';
  const isKiller = state.gameMode === 'killer';
  const isClock = state.gameMode === 'around-the-clock';

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
                <div style="font-size: 0.8rem; font-weight: 700;">${p.name} ${p.isKiller ? '<span class="killer-tag">KILLER</span>' : ''}</div>
                ${isKiller ? `<div class="lives-container" style="justify-content: flex-start; margin-top: 2px;">${Array(3).fill(0).map((_, idx) => `<i data-lucide="heart" class="life-heart ${idx >= p.lives ? 'empty' : ''}" style="width: 10px; height: 10px;"></i>`).join('')}</div>` : ''}
              </div>
              ${isKiller ? `<div style="font-size: 0.8rem; color: var(--primary); font-weight: 800; background: rgba(6,182,212,0.1); padding: 2px 6px; border-radius: 6px;">#${p.target}</div>` : ''}
              ${isClock ? `<div style="font-size: 0.8rem; color: var(--primary); font-weight: 800;">Cible: ${p.clockTarget === 25 ? 'BULL' : p.clockTarget}</div>` : ''}
              <div style="font-size: 1.2rem; font-weight: 800; margin-left: 10px;">
                ${isX01 ? p.score : (isCricket ? p.cricketScore : '')}
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      ${isCricket ? `
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

      <div class="glass" style="padding: 15px; margin: 10px 0; text-align: center; border-radius: 24px; flex: 1; display: flex; flex-direction: column;">
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

function render() {
  if (state.currentScreen === 'welcome') APP.innerHTML = WelcomeScreen();
  else if (state.currentScreen === 'players') APP.innerHTML = PlayersScreen();
  else if (state.currentScreen === 'modes') APP.innerHTML = ModesScreen();
  else if (state.currentScreen === 'game') APP.innerHTML = GameScreen();
  else if (state.currentScreen === 'winner') APP.innerHTML = WinnerScreen(state.game.winner);

  lucide.createIcons();
  attachEvents();
}

function processDart(dart, player) {
  const score = dart.value * dart.multiplier;

  if (state.gameMode.includes('01')) {
    const newScore = player.score - score;
    if (newScore === 0) { player.score = 0; state.game.winner = player; }
    else if (newScore > 1) player.score = newScore;
  } 
  else if (state.gameMode === 'cricket') {
    if ([15,16,17,18,19,20,25].includes(dart.value)) {
      const hitsBefore = player.cricket[dart.value];
      player.cricket[dart.value] += dart.multiplier;
      
      if (player.cricket[dart.value] > 3) {
        const extra = Math.max(0, dart.multiplier - (hitsBefore < 3 ? 3 - hitsBefore : 0));
        const anyoneOpen = state.players.some(p => p.cricket[dart.value] < 3);
        if (anyoneOpen) player.cricketScore += dart.value * extra;
      }
    }
  }
  else if (state.gameMode === 'killer') {
    if (dart.value === player.target) {
      player.cricket[player.target] = (player.cricket[player.target] || 0) + dart.multiplier;
      if (player.cricket[player.target] >= 3) player.isKiller = true;
    } else if (player.isKiller) {
      const targetPlayer = state.players.find(p => p.target === dart.value);
      if (targetPlayer) targetPlayer.lives = Math.max(0, targetPlayer.lives - dart.multiplier);
    }
  }
  else if (state.gameMode === 'around-the-clock') {
    if (dart.value === player.clockTarget) {
      if (player.clockTarget === 25) {
        state.game.winner = player;
      } else {
        player.clockTarget++;
        if (player.clockTarget > 20) player.clockTarget = 25; // Bullseye is final
      }
    }
  }
}

function checkGlobalWinner() {
  const player = state.players[state.game.currentPlayerIndex];
  if (state.gameMode === 'cricket') {
    const allClosed = [15,16,17,18,19,20,25].every(n => player.cricket[n] >= 3);
    const topScore = state.players.every(p => p.cricketScore <= player.cricketScore);
    if (allClosed && topScore) state.game.winner = player;
  }
  if (state.gameMode === 'killer') {
    const alive = state.players.filter(p => p.lives > 0);
    if (alive.length === 1) state.game.winner = alive[0];
  }
  if (state.gameMode === 'around-the-clock') {
    if (player.clockTarget === 25 && state.game.turnDarts.some(d => d.value === 25)) {
       // Already handled in processDart but good to keep double check
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
    state.gameMode = card.dataset.mode;
    const targetNumbers = Array.from({length: 20}, (_, i) => i + 1).sort(() => Math.random() - 0.5);
    state.players.forEach((p, i) => {
      p.score = (state.gameMode === '301') ? 301 : 501;
      p.cricket = { 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 25: 0 };
      p.cricketScore = 0;
      p.lives = 3;
      p.isKiller = false;
      p.target = targetNumbers[i]; 
      p.clockTarget = 1; // Start at 1 for Around the Clock
    });
    state.game.currentPlayerIndex = 0;
    state.game.turnDarts = [];
    state.game.currentMultiplier = 1;
    state.game.history = [];
    navigate('game');
  });

  document.querySelectorAll('#multiplier-select .kb-btn').forEach(btn => {
    btn.onclick = () => {
      state.game.currentMultiplier = parseInt(btn.dataset.mult);
      render();
    };
  });

  document.querySelectorAll('.kb-btn.segment').forEach(btn => {
    btn.onclick = () => {
      if (state.game.turnDarts.length < 3) {
        const val = parseInt(btn.dataset.val);
        if (val === 25 && state.game.currentMultiplier === 3) return; 

        // Save history before change for undo-ability of a single dart
        state.game.history.push(JSON.parse(JSON.stringify({ players: state.players, currentPlayerIndex: state.game.currentPlayerIndex, turnDarts: state.game.turnDarts })));
        
        const dart = { value: val, multiplier: state.game.currentMultiplier };
        state.game.turnDarts.push(dart);
        
        // Update immediately!
        processDart(dart, state.players[state.game.currentPlayerIndex]);
        checkGlobalWinner();

        state.game.currentMultiplier = 1; 
        render();
      }
    };
  });

  const btnDel = document.querySelector('#kb-del');
  if (btnDel) btnDel.onclick = () => {
    if (state.game.history.length > 0) {
      const last = state.game.history.pop();
      state.players = last.players;
      state.game.currentPlayerIndex = last.currentPlayerIndex;
      state.game.turnDarts = last.turnDarts;
      render();
    }
  };

  const btnEnter = document.querySelector('#kb-enter');
  if (btnEnter) btnEnter.onclick = () => {
    if (state.game.turnDarts.length === 0) return;
    
    // Save history of the turn to allow undoing the previous player's turn
    state.game.history.push(JSON.parse(JSON.stringify({ players: state.players, currentPlayerIndex: state.game.currentPlayerIndex, turnDarts: state.game.turnDarts })));

    // Clear turn darts and move to next player
    do {
      state.game.currentPlayerIndex = (state.game.currentPlayerIndex + 1) % state.players.length;
    } while (state.players[state.game.currentPlayerIndex].lives <= 0 && state.gameMode === 'killer' && state.players.filter(p => p.lives > 0).length > 1);

    state.game.turnDarts = [];
    render();
  };

  const btnUndo = document.querySelector('#btn-undo');
  if (btnUndo) btnUndo.onclick = () => {
    if (state.game.history.length > 0) {
      const last = state.game.history.pop();
      state.players = last.players;
      state.game.currentPlayerIndex = last.currentPlayerIndex;
      state.game.turnDarts = last.turnDarts;
      render();
    }
  };

  const btnQuit = document.querySelector('#btn-quit');
  if (btnQuit) btnQuit.onclick = () => { if(confirm('Quitter la partie ?')) navigate('modes'); };
  
  const btnRestart = document.querySelector('#btn-restart');
  if (btnRestart) btnRestart.onclick = () => navigate('modes');

  const btnHome = document.querySelector('#btn-home');
  if (btnHome) btnHome.onclick = () => navigate('welcome');
}

const colors = ['#06b6d4', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
loadState();
window.history.replaceState({ screen: state.currentScreen }, '', '#' + state.currentScreen);
render();
