/**
 * Main Application Orchestrator & UI Router (10 Leagues x 2 Divisions = 200 Clubs)
 * v3 — Main Menu System, Multi-Save Slots, AZERTY Controls, Settings Panel
 */

class FootballApp {
  constructor() {
    this.currentTab = 'dashboard';
    this.matchSettings = {
      halfLength: 3,
      cameraMode: 'broadcast'
    };

    this.activeMatchContext = null;
    this.activeSaveSlot = null; // which save slot is currently loaded (index)
    this.gamesSelectedCompetition = 'league';
    this.creationData = {
      position: 'ST',
      age: 17,
      height: 180,
      attributes: { pace: 75, shooting: 75, passing: 65, dribbling: 72, defending: 40, physical: 72 },
      hairStyleIndex: 0,
      hairStyle: 'Short Fade',
      hairColor: '#3d2314',
      skinColor: '#f3c299'
    };

    this.hairStyles = [
      "Short Fade", "Buzz Cut", "Spiky Top", "Afro Puff", "Dreadlocks",
      "Side Part", "Man Bun", "Ponytail", "Curly Top", "Braids / Cornrows",
      "Undercut", "Mohawk", "Slick Back", "Bowl Cut", "Top Knot",
      "Wavy Fringe", "Messy Locks", "High Top Fade", "Mullet", "Shaggy Crop",
      "Caesar Cut", "Frohawk", "Flat Top", "Long Waves", "Taper Fade",
      "Retro Dreads", "Half Knot", "Surfer Hair", "Spiky Mohawk", "Curly Afro",
      "Pompadour", "Textured Crop", "Twin Braids", "Bald / Shaved", "Golden Locks"
    ];

    this.skinTones = [
      "#fce4ec", "#f3c299", "#e0ac69", "#d19261", "#ab6528", "#704423", "#4c2b11", "#2b1404"
    ];

    this.hairColors = [
      "#0f0f0f", "#3d2314", "#6a3814", "#e6c875", "#f3e5ab", "#b83b1d",
      "#ff4500", "#9e9e9e", "#ffffff", "#00ff88", "#00d2ff", "#d946ef"
    ];

    this._contractOffers = [];
    this._lastOfferCheckGames = 0;
    this._pendingContractNotifications = [];
  }

  init() {
    this.bindNavigation();
    this.bindCreationForm();
    this.populateCreationDropdowns();
    this.loadSettings();
    this.showMainMenu();
  }

  // ===================== MAIN MENU SYSTEM =====================

  showMainMenu() {
    const menu = document.getElementById('main-menu');
    const appContainer = document.getElementById('app-container');
    if (menu) menu.classList.remove('hidden');
    if (appContainer) appContainer.style.display = 'none';
    // Close all panels
    document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
  }

  menuPlay() {
    document.getElementById('panel-play-modes').classList.add('active');
  }

  menuSettings() {
    // Sync current settings into dropdown values
    const halfEl = document.getElementById('menu-setting-half');
    const camEl = document.getElementById('menu-setting-camera');
    if (halfEl) halfEl.value = this.matchSettings.halfLength;
    if (camEl) camEl.value = this.matchSettings.cameraMode;
    document.getElementById('panel-settings-menu').classList.add('active');
  }

  menuCareerMode() {
    document.getElementById('panel-play-modes').classList.remove('active');
    document.getElementById('panel-career').classList.add('active');
  }

  menuNewGame() {
    // Hide menus and show creation form
    document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
    const menu = document.getElementById('main-menu');
    if (menu) menu.classList.add('hidden');
    const appContainer = document.getElementById('app-container');
    if (appContainer) appContainer.style.display = '';

    // Reset career state for a new game
    window.userCareer = new PlayerCareer();
    window.leaguesEngine.initLeague("turkey_d2");
    this.activeSaveSlot = null;
    this.activeMatchContext = null;
    this.populateCreationDropdowns();
    this.renderAll();
    this.openModal('modal-creation');
  }

  menuLoadSaves() {
    document.getElementById('panel-career').classList.remove('active');
    this.renderSavesList();
    document.getElementById('panel-saves').classList.add('active');
  }

  menuBack(panelId) {
    document.getElementById(panelId).classList.remove('active');
  }

  resetSettings() {
    this.matchSettings.halfLength = 3;
    this.matchSettings.cameraMode = 'broadcast';
    this.saveSettings();

    const halfEl = document.getElementById('menu-setting-half');
    const camEl = document.getElementById('menu-setting-camera');
    if (halfEl) halfEl.value = '3';
    if (camEl) camEl.value = 'broadcast';

    alert("✅ Settings reset to defaults.");
  }

  loadSettings() {
    try {
      const raw = localStorage.getItem('football_career_settings');
      if (raw) {
        const s = JSON.parse(raw);
        this.matchSettings.halfLength = s.halfLength || 3;
        this.matchSettings.cameraMode = s.cameraMode || 'broadcast';
      }
    } catch (e) {}
  }

  saveSettings() {
    localStorage.setItem('football_career_settings', JSON.stringify(this.matchSettings));
  }

  // ===================== MULTI-SAVE SYSTEM =====================

  getSaves() {
    try {
      const raw = localStorage.getItem('football_career_saves');
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  setSaves(saves) {
    localStorage.setItem('football_career_saves', JSON.stringify(saves));
  }

  renderSavesList() {
    const container = document.getElementById('saves-list-container');
    if (!container) return;

    const saves = this.getSaves();

    if (saves.length === 0) {
      container.innerHTML = '<div class="no-saves-msg">📭 No saved games found.<br>Start a New Game to begin your career!</div>';
      return;
    }

    container.innerHTML = saves.map((s, idx) => `
      <div class="save-slot" onclick="app.loadSaveSlot(${idx})">
        <div class="save-slot-info">
          <h4>${s.name} ${s.flag || '⚽'}</h4>
          <p>${s.nationality} • ${s.clubName} • Age ${s.age} • Season ${s.season || 1}</p>
        </div>
        <div class="save-slot-meta">
          <div class="ovr-badge">OVR ${s.ovr}</div>
          <div class="money-text">$${(s.money || 0).toLocaleString()}</div>
        </div>
        <button class="save-slot-delete" onclick="event.stopPropagation(); app.deleteSaveSlot(${idx});">✕</button>
      </div>
    `).join('');
  }

  loadSaveSlot(index) {
    const saves = this.getSaves();
    if (index < 0 || index >= saves.length) return;

    try {
      window.userCareer.importSaveData(saves[index].data);
      this.activeSaveSlot = index;
      this.activeMatchContext = null;

      // Hide menus, show game
      document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
      const menu = document.getElementById('main-menu');
      if (menu) menu.classList.add('hidden');
      const appContainer = document.getElementById('app-container');
      if (appContainer) appContainer.style.display = '';

      if (!window.leaguesEngine.seasonSchedule || window.leaguesEngine.seasonSchedule.length === 0) {
        window.leaguesEngine.buildSeasonSchedule(window.userCareer.profile);
      }

      this.renderAll();
    } catch (e) {
      alert("⚠️ Failed to load save file.");
      console.error(e);
    }
  }

  deleteSaveSlot(index) {
    if (!confirm("🗑️ Delete this save? This cannot be undone!")) return;
    const saves = this.getSaves();
    saves.splice(index, 1);
    this.setSaves(saves);
    this.renderSavesList();
  }

  saveCareer(showAlert = true) {
    // Build save summary
    const p = window.userCareer.profile;
    const exportData = window.userCareer.exportSaveData();

    const saveSummary = {
      name: p.name,
      flag: p.flag,
      nationality: p.nationality,
      clubName: p.currentClubName,
      age: p.age,
      ovr: p.ovr,
      money: p.bankBalance,
      season: p.season || 1,
      savedAt: new Date().toISOString(),
      data: exportData
    };

    const saves = this.getSaves();

    if (this.activeSaveSlot !== null && this.activeSaveSlot < saves.length) {
      // Update existing save slot
      saves[this.activeSaveSlot] = saveSummary;
    } else {
      // Create new save slot
      saves.push(saveSummary);
      this.activeSaveSlot = saves.length - 1;
    }

    this.setSaves(saves);
    if (showAlert) alert("💾 Career Saved!");
  }

  loadCareer() {
    // Legacy fallback — try to open saves panel
    this.showMainMenu();
    this.menuPlay();
    this.menuCareerMode();
    this.menuLoadSaves();
  }

  resetCareer() {
    if (confirm("⚠️ Are you sure you want to COMPLETELY START OVER?\nThis will erase ALL saved data and return to the main menu.")) {
      localStorage.removeItem('football_career_saves');
      localStorage.removeItem('football_career_settings');
      localStorage.removeItem('football_career_save_slot');
      localStorage.removeItem('football_career_saved');
      window.userCareer = new PlayerCareer();
      window.leaguesEngine.initLeague("turkey_d2");
      this.activeSaveSlot = null;
      this.matchSettings = { halfLength: 3, cameraMode: 'broadcast' };
      this.activeMatchContext = null;
      const matchContainer = document.getElementById('match-container');
      if (matchContainer) matchContainer.classList.remove('active');
      this.showMainMenu();
    }
  }

  // ===================== NAVIGATION =====================

  populateCreationDropdowns() {
    const natSelect = document.getElementById('create-nationality');
    if (natSelect) {
      natSelect.innerHTML = window.leaguesEngine.nationalTeams.map(n => `
        <option value="${n.name}">${n.name} ${n.flag}</option>
      `).join('');
    }

    // Gather Div 2 Starter Clubs from ALL 10 major countries!
    const clubSelect = document.getElementById('create-club');
    if (clubSelect) {
      let optionsHTML = "";
      Object.values(window.leaguesEngine.leagues).forEach(lg => {
        if (lg.tier === 2) {
          optionsHTML += `<optgroup label="🏆 ${lg.name} (${lg.country})">`;
          lg.clubs.forEach(c => {
            optionsHTML += `<option value="${c.id}" data-league="${lg.id}">${c.name} (${'⭐'.repeat(c.stars)})</option>`;
          });
          optionsHTML += `</optgroup>`;
        }
      });
      clubSelect.innerHTML = optionsHTML;
    }
  }

  bindNavigation() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        this.switchTab(tab);
      });
    });
  }

  switchTab(tabId) {
    this.currentTab = tabId;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.view-page').forEach(p => p.classList.remove('active'));

    const activeBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    const activePage = document.getElementById(`page-${tabId}`);

    if (activeBtn) activeBtn.classList.add('active');
    if (activePage) activePage.classList.add('active');

    this.renderAll();
  }

  // ===================== PLAYER CREATION CUSTOMIZER =====================

  openAttributesModal() {
    this.openModal('modal-attributes');
  }

  closeAttributesModal() {
    this.closeModal('modal-attributes');
    this.updateCreationSummary();
  }

  openAppearanceModal() {
    this.initAppearanceUI();
    this.openModal('modal-appearance');
  }

  closeAppearanceModal() {
    this.closeModal('modal-appearance');
  }

  initAppearanceUI() {
    const hairSelect = document.getElementById('create-hair-style-select');
    if (hairSelect) {
      hairSelect.innerHTML = this.hairStyles.map((style, idx) => `
        <option value="${idx}" ${idx === (this.creationData.hairStyleIndex || 0) ? 'selected' : ''}>${idx + 1}. ${style}</option>
      `).join('');
    }

    // Render Hair Color Swatches
    const hairContainer = document.getElementById('hair-color-swatches');
    if (hairContainer) {
      hairContainer.innerHTML = this.hairColors.map(c => `
        <div onclick="app.setHairColor('${c}')" style="background: ${c}; height: 36px; border-radius: 8px; cursor: pointer; border: ${this.creationData.hairColor === c ? '3px solid #00ff88' : '2px solid rgba(255,255,255,0.2)'}; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'"></div>
      `).join('');
    }

    // Render Skin Tone Swatches
    const skinContainer = document.getElementById('skin-tone-swatches');
    if (skinContainer) {
      skinContainer.innerHTML = this.skinTones.map(s => `
        <div onclick="app.setSkinTone('${s}')" style="background: ${s}; height: 36px; border-radius: 8px; cursor: pointer; border: ${this.creationData.skinColor === s ? '3px solid #00ff88' : '2px solid rgba(255,255,255,0.2)'}; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'"></div>
      `).join('');
    }

    this.renderAppearanceAvatar();
  }

  cycleHairStyle(dir) {
    let curr = this.creationData.hairStyleIndex || 0;
    curr = (curr + dir + this.hairStyles.length) % this.hairStyles.length;
    this.selectHairStyle(curr);
  }

  selectHairStyle(idx) {
    this.creationData.hairStyleIndex = idx;
    this.creationData.hairStyle = this.hairStyles[idx];
    const select = document.getElementById('create-hair-style-select');
    if (select) select.value = idx;
    this.renderAppearanceAvatar();
  }

  setHairColor(color) {
    this.creationData.hairColor = color;
    this.initAppearanceUI();
  }

  setSkinTone(tone) {
    this.creationData.skinColor = tone;
    this.initAppearanceUI();
  }

  getHairStyleFamily(styleName = '') {
    const name = String(styleName || '').toLowerCase();
    if (name.includes('bald') || name.includes('shaved')) return 'bald';
    if (name.includes('buzz') || name.includes('crew') || name.includes('caesar')) return 'short';
    if (name.includes('fade') || name.includes('taper')) return 'fade';
    if (name.includes('bowl')) return 'bowl';
    if (name.includes('flat top') || name.includes('flattop')) return 'flat';
    if (name.includes('high top')) return 'high_top';
    if (name.includes('afro puff') || name.includes('puff')) return 'puff';
    if (name.includes('curly afro')) return 'curly_afro';
    if (name.includes('curly') || name.includes('wavy')) return 'curly';
    if (name.includes('mohawk') || name.includes('frohawk')) return 'mohawk';
    if (name.includes('undercut')) return 'undercut';
    if (name.includes('side part')) return 'side_part';
    if (name.includes('dread') || name.includes('loc')) return 'dreads';
    if (name.includes('braid') || name.includes('cornrow') || name.includes('twist')) return 'braids';
    if (name.includes('bun') || name.includes('knot') || name.includes('ponytail')) return 'tied';
    if (name.includes('mullet')) return 'mullet';
    if (name.includes('long') || name.includes('waves') || name.includes('shag') || name.includes('surfer') || name.includes('locks') || name.includes('fringe')) return 'long';
    if (name.includes('pompadour') || name.includes('quiff')) return 'pompadour';
    if (name.includes('spiky')) return 'spiky';
    if (name.includes('crop') || name.includes('textured')) return 'crop';
    if (name.includes('slick') || name.includes('part')) return 'side_part';
    return 'short';
  }

  _shade(hex, percent) {
    const h = String(hex || '#000000').replace('#', '');
    const r = parseInt(h.substring(0, 2), 16) || 0;
    const g = parseInt(h.substring(2, 4), 16) || 0;
    const b = parseInt(h.substring(4, 6), 16) || 0;
    const adj = (c) => Math.max(0, Math.min(255, Math.round(c + (percent / 100) * 255)));
    return '#' + [adj(r), adj(g), adj(b)].map(c => c.toString(16).padStart(2, '0')).join('');
  }

  buildAvatarMarkup({ hairStyle, hairColor, skinColor, size = 100, showBody = true, portraitStyle = 'default' }) {
    const family = this.getHairStyleFamily(hairStyle);
    const skin = skinColor || '#f3c299';
    const hair = hairColor || '#3d2314';
    const uid = 'av' + Math.random().toString(36).slice(2, 8);
    const skinDark = this._shade(skin, -26);
    const skinLight = this._shade(skin, 20);
    const hairDark = this._shade(hair, -32);
    const hairLight = this._shade(hair, 26);

    const cap = (d) => `<path d="${d}" fill="${hair}" stroke="${hairDark}" stroke-width="1.2" stroke-linejoin="round"/>`;
    const cap2 = (d, fill, op) => `<path d="${d}" fill="${fill}" opacity="${op}" stroke="none"/>`;

    const hairPath = (fam) => {
      switch (fam) {
        case 'bald':
          return `<path d="M30 32 Q50 20 70 32" fill="none" stroke="${skinDark}" stroke-width="2" opacity="0.3"/>`;
        case 'short':
          return cap('M28 44 Q28 24 50 22 Q72 24 72 44 Q72 50 68 52 Q50 48 32 52 Q28 50 28 44 Z');
        case 'fade':
          return cap('M26 46 Q26 22 50 20 Q74 22 74 46 Q74 52 70 54 Q50 50 30 54 Q26 52 26 46 Z') + cap2('M30 50 Q50 46 70 50 L70 58 Q50 56 30 58 Z', hairDark, 0.45);
        case 'bowl':
          return cap('M24 52 Q24 18 50 16 Q76 18 76 52 Q66 58 50 58 Q34 58 24 52 Z');
        case 'flat':
          return cap('M20 34 Q20 22 50 20 Q80 22 80 34 Q80 40 76 42 Q50 40 24 42 Q20 40 20 34 Z') + cap2('M28 40 Q50 36 72 40 L72 48 Q50 46 28 48 Z', hair, 0.7);
        case 'afro':
        case 'curly_afro':
          return cap('M14 50 Q10 12 50 8 Q90 12 86 50 Q86 60 80 62 Q50 58 20 62 Q14 60 14 50 Z');
        case 'curly':
          return cap('M18 50 Q16 16 50 14 Q84 16 82 50 Q82 58 78 60 Q50 56 22 60 Q18 58 18 50 Z');
        case 'puff':
          return cap('M10 52 Q6 8 50 4 Q94 8 90 52 Q90 62 84 64 Q50 60 16 64 Q10 62 10 52 Z');
        case 'mohawk':
        case 'frohawk':
          return cap('M38 16 Q50 6 62 16 L62 56 Q50 52 38 56 Z') + cap2('M34 52 Q50 48 66 52 L66 60 Q50 58 34 60 Z', '#000000', 0.18);
        case 'high_top':
          return cap('M34 12 L66 12 L66 56 Q50 52 34 56 Z') + cap2('M38 16 L62 16 L62 50 Q50 46 38 50 Z', hairLight, 0.5);
        case 'undercut':
          return cap('M26 48 Q26 24 50 22 Q74 24 74 48 Q74 54 70 56 Q50 52 30 56 Q26 54 26 48 Z') + cap2('M34 52 Q50 48 66 52 L66 58 Q50 56 34 58 Z', hair, 0.7);
        case 'side_part':
          return cap('M26 46 Q26 22 50 20 Q74 22 74 46 Q74 52 70 54 Q50 50 30 54 Q26 52 26 46 Z') + `<path d="M52 24 L48 56" stroke="${hairDark}" stroke-width="2" opacity="0.5"/>`;
        case 'spiky':
          return cap('M24 50 L28 18 L34 44 L40 12 L46 42 L52 10 L58 42 L64 14 L70 44 L76 18 L76 50 Q50 46 24 50 Z');
        case 'dreads':
          return cap('M28 44 Q28 24 50 22 Q72 24 72 44 Q72 48 70 50 Q50 46 30 50 Q28 48 28 44 Z')
            + cap('M26 50 Q24 70 26 86 Q30 88 34 86 Q32 70 30 50 Z')
            + cap('M36 52 Q34 74 36 90 Q40 92 44 90 Q42 74 40 52 Z')
            + cap('M46 52 Q44 76 46 92 Q50 94 54 92 Q52 76 50 52 Z')
            + cap('M56 52 Q54 76 56 92 Q60 94 64 92 Q62 76 60 52 Z')
            + cap('M66 50 Q64 74 66 90 Q70 92 74 90 Q72 74 70 50 Z');
        case 'braids':
          return cap('M28 44 Q28 24 50 22 Q72 24 72 44 Q72 48 70 50 Q50 46 30 50 Q28 48 28 44 Z')
            + cap('M24 50 Q22 74 24 90 Q28 92 32 90 Q30 74 28 50 Z')
            + cap('M40 52 Q38 76 40 92 Q44 94 48 92 Q46 76 44 52 Z')
            + cap('M56 52 Q54 76 56 92 Q60 94 64 92 Q62 76 60 52 Z')
            + cap('M72 50 Q70 74 72 90 Q76 92 80 90 Q78 74 76 50 Z');
        case 'tied':
          return cap('M28 44 Q28 24 50 22 Q72 24 72 44 Q72 48 70 50 Q50 46 30 50 Q28 48 28 44 Z')
            + `<circle cx="50" cy="18" r="8" fill="${hair}" stroke="${hairDark}" stroke-width="1.2"/>`;
        case 'mullet':
          return cap('M28 44 Q28 24 50 22 Q72 24 72 44 Q72 48 70 50 Q50 46 30 50 Q28 48 28 44 Z')
            + cap('M24 48 Q22 72 24 92 Q28 94 32 92 Q30 72 28 48 Z')
            + cap('M72 48 Q70 72 72 92 Q76 94 80 92 Q78 72 76 48 Z');
        case 'long':
          return cap('M20 50 Q18 16 50 14 Q82 16 80 50 L80 92 Q76 94 72 92 L72 54 Q50 50 28 54 L28 92 Q24 94 20 92 Z')
            + cap('M24 48 Q22 18 50 16 Q78 18 76 48 Q76 54 72 56 Q50 52 28 56 Q24 54 24 48 Z');
        case 'pompadour':
          return cap('M22 50 Q22 14 50 10 Q78 14 78 50 Q78 56 74 58 Q50 54 26 58 Q22 56 22 50 Z') + `<path d="M54 18 Q58 30 50 40" stroke="${hairDark}" stroke-width="2" fill="none" opacity="0.4"/>`;
        case 'crop':
          return cap('M26 46 Q26 22 50 20 Q74 22 74 46 Q74 52 70 54 Q50 50 30 54 Q26 52 26 46 Z') + cap2('M30 44 Q50 40 70 44 L70 50 Q50 48 30 50 Z', hairLight, 0.4);
        default:
          return cap('M28 44 Q28 24 50 22 Q72 24 72 44 Q72 50 68 52 Q50 48 32 52 Q28 50 28 44 Z');
      }
    };

    const body = showBody ? `
      <path d="M14 120 Q14 96 30 90 L42 86 L42 82 L58 82 L58 86 L70 90 Q86 96 86 120 Z" fill="url(#${uid}-shirt)" stroke="rgba(0,0,0,0.25)" stroke-width="1"/>
      <path d="M42 86 L42 82 L58 82 L58 86 Q50 90 42 86 Z" fill="${skinDark}" stroke="rgba(0,0,0,0.2)" stroke-width="0.8"/>` : '';

    return `
      <svg viewBox="0 0 100 120" width="${size}" height="${Math.round(size * 1.2)}" xmlns="http://www.w3.org/2000/svg" style="display:block;max-width:100%;max-height:100%;">
        <defs>
          <linearGradient id="${uid}-skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${skinLight}"/>
            <stop offset="100%" stop-color="${skin}"/>
          </linearGradient>
          <linearGradient id="${uid}-shirt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(255,255,255,0.25)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.25)"/>
          </linearGradient>
        </defs>
        ${body}
        <ellipse cx="22" cy="62" rx="6" ry="9" fill="url(#${uid}-skin)" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
        <ellipse cx="78" cy="62" rx="6" ry="9" fill="url(#${uid}-skin)" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
        <path d="M30 88 Q28 70 34 56 Q40 44 50 44 Q60 44 66 56 Q72 70 70 88 Q60 96 50 96 Q40 96 30 88 Z" fill="url(#${uid}-skin)" stroke="rgba(0,0,0,0.22)" stroke-width="1.2"/>
        <path d="M36 54 Q50 50 64 54" fill="none" stroke="${skinDark}" stroke-width="1.5" opacity="0.25"/>
        <ellipse cx="40" cy="66" rx="4.5" ry="5.5" fill="#ffffff" stroke="rgba(0,0,0,0.3)" stroke-width="0.8"/>
        <ellipse cx="60" cy="66" rx="4.5" ry="5.5" fill="#ffffff" stroke="rgba(0,0,0,0.3)" stroke-width="0.8"/>
        <circle cx="40" cy="67" r="2.6" fill="#3a2410"/>
        <circle cx="60" cy="67" r="2.6" fill="#3a2410"/>
        <circle cx="41" cy="66" r="0.9" fill="#ffffff"/>
        <circle cx="61" cy="66" r="0.9" fill="#ffffff"/>
        <path d="M34 60 Q40 57 46 60" fill="none" stroke="${hairDark}" stroke-width="1.8" stroke-linecap="round" opacity="0.85"/>
        <path d="M54 60 Q60 57 66 60" fill="none" stroke="${hairDark}" stroke-width="1.8" stroke-linecap="round" opacity="0.85"/>
        <path d="M50 70 L48 80 Q50 82 52 80 Z" fill="none" stroke="${skinDark}" stroke-width="1.2" opacity="0.4"/>
        <path d="M44 84 Q50 88 56 84" fill="none" stroke="rgba(0,0,0,0.55)" stroke-width="1.6" stroke-linecap="round"/>
        ${hairPath(family)}
      </svg>
    `;
  }

  renderAvatar(targetId, appearance, size = 100, showBody = true) {
    const el = document.getElementById(targetId);
    if (!el) return;
    el.innerHTML = this.buildAvatarMarkup({
      hairStyle: appearance.hairStyle || 'Short Fade',
      hairColor: appearance.hairColor || '#3d2314',
      skinColor: appearance.skinColor || '#f3c299',
      size,
      showBody,
      portraitStyle: targetId === 'card-avatar-display' ? 'card' : 'default'
    });
  }

  renderAppearanceAvatar() {
    const idx = this.creationData.hairStyleIndex || 0;
    const styleName = this.hairStyles[idx] || "Short Fade";

    const label = document.getElementById('hair-style-label');
    const count = document.getElementById('hair-style-count');
    const nameEl = document.getElementById('avatar-style-name');

    if (label) label.innerText = styleName;
    if (count) count.innerText = `${idx + 1} / ${this.hairStyles.length}`;
    if (nameEl) nameEl.innerText = styleName;

    this.renderAvatar('avatar-head-display', {
      hairStyle: styleName,
      hairColor: this.creationData.hairColor,
      skinColor: this.creationData.skinColor
    }, 100, true);

    this.renderAvatar('card-avatar-display', {
      hairStyle: styleName,
      hairColor: this.creationData.hairColor,
      skinColor: this.creationData.skinColor
    }, 120, true);
  }

  onPositionChange(pos) {
    this.creationData.position = pos;

    // Standard baseline stats per position role
    const baselines = {
      ST:  { pace: 75, shooting: 75, passing: 65, dribbling: 72, defending: 40, physical: 72 },
      CAM: { pace: 72, shooting: 70, passing: 78, dribbling: 78, defending: 48, physical: 64 },
      CM:  { pace: 70, shooting: 65, passing: 75, dribbling: 72, defending: 68, physical: 72 },
      RW:  { pace: 84, shooting: 72, passing: 70, dribbling: 80, defending: 42, physical: 62 },
      LW:  { pace: 84, shooting: 72, passing: 70, dribbling: 80, defending: 42, physical: 62 },
      CB:  { pace: 62, shooting: 40, passing: 60, dribbling: 58, defending: 78, physical: 80 },
      LB:  { pace: 80, shooting: 50, passing: 66, dribbling: 70, defending: 72, physical: 70 },
      RB:  { pace: 80, shooting: 50, passing: 66, dribbling: 70, defending: 72, physical: 70 },
      GK:  { pace: 50, shooting: 30, passing: 55, dribbling: 45, defending: 78, physical: 75 }
    };

    if (baselines[pos]) {
      this.creationData.attributes = { ...baselines[pos] };
      Object.keys(baselines[pos]).forEach(key => {
        const slider = document.getElementById(`slider-${key}`);
        const valSpan = document.getElementById(`val-${key}`);
        if (slider) slider.value = baselines[pos][key];
        if (valSpan) valSpan.innerText = baselines[pos][key];
      });
    }
    this.updatePreviewOvr();
  }

  onAgeChange(val) {
    this.creationData.age = parseInt(val);
    const el = document.getElementById('val-age');
    if (el) el.innerText = val;
    this.updateCreationSummary();
  }

  onHeightChange(val) {
    this.creationData.height = parseInt(val);
    const el = document.getElementById('val-height');
    if (el) el.innerText = val;
    this.updateCreationSummary();
  }

  onAttrSliderChange(key, val) {
    this.creationData.attributes[key] = parseInt(val);
    const valSpan = document.getElementById(`val-${key}`);
    if (valSpan) valSpan.innerText = val;
    this.updatePreviewOvr();
  }

  updatePreviewOvr() {
    const pos = this.creationData.position;
    const a = this.creationData.attributes;
    let ovr = 70;

    switch(pos) {
      case 'ST':
        ovr = (a.shooting * 0.4) + (a.pace * 0.25) + (a.dribbling * 0.15) + (a.physical * 0.15) + (a.passing * 0.05);
        break;
      case 'CAM':
        ovr = (a.passing * 0.35) + (a.dribbling * 0.3) + (a.shooting * 0.2) + (a.pace * 0.15);
        break;
      case 'CM':
        ovr = (a.passing * 0.3) + (a.defending * 0.2) + (a.dribbling * 0.2) + (a.physical * 0.15) + (a.shooting * 0.15);
        break;
      case 'RW': case 'LW':
        ovr = (a.pace * 0.35) + (a.dribbling * 0.3) + (a.shooting * 0.2) + (a.passing * 0.15);
        break;
      case 'CB':
        ovr = (a.defending * 0.4) + (a.physical * 0.35) + (a.pace * 0.15) + (a.passing * 0.1);
        break;
      case 'LB': case 'RB':
        ovr = (a.pace * 0.3) + (a.defending * 0.3) + (a.passing * 0.2) + (a.physical * 0.1) + (a.dribbling * 0.1);
        break;
      case 'GK':
        ovr = (a.defending * 0.45) + (a.physical * 0.35) + (a.pace * 0.1) + (a.passing * 0.1);
        break;
      default:
        ovr = (a.pace + a.shooting + a.passing + a.dribbling + a.defending + a.physical) / 6;
    }

    const calculatedOvr = Math.min(99, Math.max(40, Math.round(ovr)));
    const el = document.getElementById('preview-calculated-ovr');
    if (el) el.innerText = calculatedOvr;
    this.updateCreationSummary(calculatedOvr);
    return calculatedOvr;
  }

  updateCreationSummary(ovr) {
    const posEl = document.getElementById('summary-pos');
    const ageEl = document.getElementById('summary-age');
    const heightEl = document.getElementById('summary-height');
    const ovrEl = document.getElementById('summary-ovr');

    if (posEl) posEl.innerText = this.creationData.position;
    if (ageEl) ageEl.innerText = this.creationData.age;
    if (heightEl) heightEl.innerText = `${this.creationData.height} cm`;
    if (ovrEl && ovr !== undefined) ovrEl.innerText = ovr;
  }

  bindCreationForm() {
    const form = document.getElementById('creation-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('create-name').value || "Alex Hunter";
        const nationalityName = document.getElementById('create-nationality').value;
        const clubSelect = document.getElementById('create-club');
        const startingClubId = clubSelect.value;
        const selectedOption = clubSelect.options[clubSelect.selectedIndex];
        const leagueId = selectedOption ? selectedOption.dataset.league : "turkey_d2";

        const p = window.userCareer.profile;
        p.name = name;
        p.position = this.creationData.position;
        p.age = this.creationData.age;
        p.height = this.creationData.height;
        p.attributes = { ...this.creationData.attributes };
        p.hairStyle = this.creationData.hairStyle || this.hairStyles[this.creationData.hairStyleIndex || 0] || 'Short Fade';
        p.hairColor = this.creationData.hairColor || '#3d2314';
        p.skinColor = this.creationData.skinColor || '#f3c299';
        p.nationality = nationalityName;
        p.currentClubId = startingClubId;

        const natObj = window.leaguesEngine.nationalTeams.find(n => n.name === nationalityName);
        p.flag = natObj ? natObj.flag : "⚽";

        // Find club object
        window.leaguesEngine.initLeague(leagueId);
        const currentClubObj = window.leaguesEngine.standings.find(c => c.clubId === startingClubId);
        if (currentClubObj) p.currentClubName = currentClubObj.name;

        window.userCareer.calculateOvr();
        window.leaguesEngine.buildSeasonSchedule(p);

        this.closeModal('modal-creation');
        this.saveCareer(false);
        this.renderAll();
      });
    }
  }

  // ===================== RENDERING =====================

  renderAll() {
    this.renderHeaderMeta();
    this.renderFifaCard();
    this.renderNextMatchBanner();
    this.renderGamesSchedule();
    this.renderStandings();
    this.renderSquad();
    this.renderTransfers();
    this.renderAttributes();
    this.renderStats();
    this.renderPastSeasons();
  }

  renderHeaderMeta() {
    const p = window.userCareer.profile;

    const nameEl = document.getElementById('meta-player-name');
    const ageEl = document.getElementById('meta-age');
    const ovrEl = document.getElementById('meta-ovr');
    const clubEl = document.getElementById('meta-club');
    const bankEl = document.getElementById('meta-bank');

    const flagHtml = window.leaguesEngine.getCountryFlagHtml(p.nationality || 'England', 22);
    if (nameEl) nameEl.innerHTML = `${p.name} ${flagHtml}`;
    if (ageEl) ageEl.innerText = `${p.age} y/o`;
    if (ovrEl) ovrEl.innerText = `OVR ${p.ovr}`;
    if (clubEl) clubEl.innerText = p.currentClubName;
    if (bankEl) bankEl.innerText = `$${p.bankBalance.toLocaleString()}`;
  }

  renderFifaCard() {
    const p = window.userCareer.profile;
    const a = p.attributes;

    const cardName = document.getElementById('card-name');
    const cardOvr = document.getElementById('card-ovr');
    const cardPos = document.getElementById('card-pos');
    const cardFlag = document.getElementById('card-flag');

    if (cardName) cardName.innerText = p.name;
    if (cardOvr) cardOvr.innerText = p.ovr;
    if (cardPos) cardPos.innerText = p.position;
    if (cardFlag) cardFlag.innerHTML = window.leaguesEngine.getCountryFlagHtml(p.nationality || 'England', 32);

    const attrs = ['pac', 'sho', 'pas', 'dri', 'def', 'phy'];
    const keys = ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical'];

    attrs.forEach((tag, idx) => {
      const el = document.getElementById(`card-attr-${tag}`);
      if (el) el.innerText = a[keys[idx]];
    });

    this.renderAvatar('card-avatar-display', {
      hairStyle: p.hairStyle || this.creationData.hairStyle || 'Short Fade',
      hairColor: p.hairColor || this.creationData.hairColor || '#3d2314',
      skinColor: p.skinColor || this.creationData.skinColor || '#f3c299'
    }, 120, true);
  }

  renderNextMatchBanner() {
    const p = window.userCareer.profile;
    const nextFix = window.leaguesEngine.getNextMatch(p.currentClubId, p.nationality);
    const container = document.getElementById('next-match-box');
    if (!container) return;

    if (!nextFix) {
      container.innerHTML = `
        <div style="text-align: center; width: 100%;">
          <h3>🏆 Season Completed!</h3>
          <p style="color: var(--text-muted); margin: 10px 0;">All scheduled games have been played.</p>
          <button class="btn btn-accent btn-lg" onclick="app.advanceSeason()">Advance to Next Season ⏩</button>
        </div>
      `;
      return;
    }

    const homeName = nextFix.displayHomeName || nextFix.home?.name || 'Home';
    const awayName = nextFix.displayAwayName || nextFix.away?.name || 'Away';
    const contextLine = nextFix.matchLabel || 'League Match';

    container.innerHTML = `
      <div class="match-banner">
        <div style="width:100%; margin-bottom: 14px; text-align: center; text-transform: uppercase; letter-spacing: 1px; font-size: 12px; color: var(--accent-gold); font-weight: 900;">
          ${contextLine}
        </div>
        <div class="teams-vs">
          <div class="team-box">
            <div class="team-badge" style="display: flex; align-items: center; justify-content: center;">${window.leaguesEngine.getClubBadgeHtml(homeName, 48)}</div>
            <div style="font-weight: 800; margin-top: 6px;">${homeName}</div>
          </div>
          <div class="vs-text">VS</div>
          <div class="team-box">
            <div class="team-badge" style="display: flex; align-items: center; justify-content: center;">${window.leaguesEngine.getClubBadgeHtml(awayName, 48)}</div>
            <div style="font-weight: 800; margin-top: 6px;">${awayName}</div>
          </div>
        </div>
        <div style="display: flex; gap: 12px;">
          <button class="btn btn-primary btn-lg" onclick="app.simulateMatch()">⚽ Simulate Match</button>
        </div>
      </div>
    `;
  }

  renderGamesSchedule() {
    const container = document.getElementById('games-schedule-list');
    if (!container) return;

    const p = window.userCareer.profile;
    const games = window.leaguesEngine.getUpcomingGames(p.currentClubId, p.nationality);

    if (!games || games.length === 0) {
      container.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 24px 0;">No future games scheduled right now.</p>`;
      return;
    }

    container.innerHTML = games.map((g) => {
      const homeName = g.displayHomeName || g.home?.name || 'Home';
      const awayName = g.displayAwayName || g.away?.name || 'Away';
      const subtitle = [g.competitionName, g.stageLabel, g.matchLabel].filter(Boolean).join(' • ');
      return `
        <div class="glass-panel" style="margin-bottom: 14px;">
          <div style="display:flex; justify-content:space-between; gap: 14px; align-items:flex-start; flex-wrap: wrap;">
            <div>
              <div style="font-size: 12px; color: var(--accent-gold); font-weight: 900; letter-spacing: 0.6px; text-transform: uppercase; margin-bottom: 4px;">${subtitle}</div>
              <div style="font-size: 18px; font-weight: 900;">${homeName} vs ${awayName}</div>
              <div style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">${g.matchContext || 'Upcoming fixture'}</div>
            </div>
            <div style="text-align:right; min-width: 140px;">
              <div style="font-size: 12px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Status</div>
              <div style="font-size: 15px; font-weight: 900; color: ${g.played ? 'var(--accent-gold)' : 'var(--primary)'};">${g.played ? `${g.homeScore} - ${g.awayScore}` : 'Scheduled'}</div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  selectGamesCompetition(competitionKey) {
    if (!competitionKey) return;
    const profile = window.userCareer && window.userCareer.profile ? window.userCareer.profile : null;
    if (!window.leaguesEngine.isCompetitionUnlocked(profile, competitionKey)) return;
    this.gamesSelectedCompetition = competitionKey;
    this.renderGamesSchedule();
  }

  selectNextMatch(matchId) {
    window.leaguesEngine.setActiveMatch(matchId);
    this.activeMatchContext = null;
    this.renderNextMatchBanner();
    this.renderGamesSchedule();
    this.saveCareer(false);
  }

  selectLatestMatchForCompetition(competitionKey) {
    const p = window.userCareer.profile;
    const matches = window.leaguesEngine.getCompetitionMatches(p, competitionKey);
    const latest = matches[matches.length - 1];
    if (latest) this.selectNextMatch(latest.id);
  }

  renderGamesSchedule() {
    const container = document.getElementById('games-schedule-list');
    if (!container) return;

    const p = window.userCareer.profile;
    const catalog = window.leaguesEngine.getCompetitionCatalog(p);
    const unlockedKeys = catalog.filter(c => !c.locked).map(c => c.key);

    if (!this.gamesSelectedCompetition || !catalog.some(c => c.key === this.gamesSelectedCompetition)) {
      this.gamesSelectedCompetition = unlockedKeys[0] || 'league';
    }

    const selectedCompetition = catalog.find(c => c.key === this.gamesSelectedCompetition) || catalog[0];
    const selectedKey = selectedCompetition ? selectedCompetition.key : 'league';
    const selectedMatches = window.leaguesEngine.getCompetitionMatches(p, selectedKey);
    const currentSeasonMatches = p?.stats?.season?.matches || 0;
    const helperText = currentSeasonMatches < 5
      ? 'Finish your first 5 league matches to unlock the other competitions.'
      : 'Pick a competition below, then choose the fixture you want as your next match.';

    const competitionButtons = catalog.map((c) => {
      const isSelected = c.key === selectedKey;
      const disabled = c.locked ? 'disabled' : '';
      const count = c.locked ? 'Locked' : `${window.leaguesEngine.getCompetitionMatches(p, c.key).length} matches`;
      return `
        <button class="btn ${isSelected ? 'btn-primary' : 'btn-secondary'}" ${disabled}
          style="min-width: 170px; justify-content: space-between; display: inline-flex; align-items: center; gap: 10px; margin-bottom: 10px; opacity: ${c.locked ? 0.55 : 1};"
          onclick="app.selectGamesCompetition('${c.key}')">
          <span>${c.label}</span>
          <small style="font-size: 11px; font-weight: 900; opacity: 0.9;">${count}</small>
        </button>
      `;
    }).join('');

    const setLatestBtn = selectedMatches.length > 0
      ? `<button class="btn btn-accent" onclick="app.selectLatestMatchForCompetition('${selectedKey}')">Use Latest Upcoming</button>`
      : '';

    const matchesHtml = selectedMatches.length > 0
      ? selectedMatches.map((g, idx) => {
        const homeName = g.displayHomeName || g.home?.name || 'Home';
        const awayName = g.displayAwayName || g.away?.name || 'Away';
        const subtitle = [g.competitionName, g.stageLabel, g.matchLabel].filter(Boolean).join(' \u2022 ');
        const isActive = window.leaguesEngine.activeMatchId === g.id;
        const actionLabel = isActive ? 'Selected Next Match' : 'Set as Next Match';
        return `
          <div class="glass-panel" style="margin-bottom: 14px; border: 1px solid ${isActive ? 'rgba(255, 215, 0, 0.55)' : 'rgba(255,255,255,0.08)'};">
            <div style="display:flex; justify-content:space-between; gap: 14px; align-items:flex-start; flex-wrap: wrap;">
              <div style="flex: 1 1 320px;">
                <div style="font-size: 12px; color: var(--accent-gold); font-weight: 900; letter-spacing: 0.6px; text-transform: uppercase; margin-bottom: 4px;">${subtitle}</div>
                <div style="font-size: 18px; font-weight: 900;">${homeName} vs ${awayName}</div>
                <div style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">${g.matchContext || 'Upcoming fixture'}</div>
                <div style="font-size: 12px; margin-top: 8px; color: ${isActive ? 'var(--accent-gold)' : 'var(--text-muted)'}; font-weight: 800;">${isActive ? 'This is your current next match.' : `Fixture ${idx + 1} in this competition.`}</div>
              </div>
              <div style="text-align:right; min-width: 150px;">
                <div style="font-size: 12px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Status</div>
                <div style="font-size: 15px; font-weight: 900; color: ${g.played ? 'var(--accent-gold)' : 'var(--primary)'};">${g.played ? `${g.homeScore} - ${g.awayScore}` : 'Scheduled'}</div>
                <button class="btn ${isActive ? 'btn-secondary' : 'btn-primary'}" style="margin-top: 10px;" onclick="app.selectNextMatch('${g.id}')">${actionLabel}</button>
              </div>
            </div>
          </div>
        `;
      }).join('')
      : `<p style="color: var(--text-muted); text-align: center; padding: 24px 0;">No future matches are available for ${selectedCompetition.label} yet.</p>`;

    container.innerHTML = `
      <div style="margin-bottom: 14px;">
        <div style="font-size: 12px; color: var(--accent-gold); font-weight: 900; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 8px;">Choose Competition</div>
        <div style="display:flex; flex-wrap: wrap; gap: 10px;">${competitionButtons}</div>
      </div>
      <div class="glass-panel" style="margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.08);">
        <div style="display:flex; justify-content:space-between; gap: 14px; align-items:flex-start; flex-wrap: wrap;">
          <div>
            <div style="font-size: 12px; color: var(--accent-gold); font-weight: 900; letter-spacing: 0.8px; text-transform: uppercase;">${selectedCompetition.subtitle || 'Competition'}</div>
            <div style="font-size: 24px; font-weight: 900; margin-top: 4px;">${selectedCompetition.label}</div>
            <div style="font-size: 13px; color: var(--text-muted); margin-top: 6px; max-width: 620px;">${helperText}</div>
          </div>
          <div style="text-align:right; min-width: 180px;">
            <div style="font-size: 12px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Unlocked Fixtures</div>
            <div style="font-size: 18px; font-weight: 900; color: var(--primary);">${selectedMatches.length}</div>
            ${setLatestBtn}
          </div>
        </div>
      </div>
      <div style="margin-bottom: 14px; font-size: 12px; color: var(--text-muted); font-weight: 700;">${currentSeasonMatches < 5 ? 'League only for now.' : 'Select the fixture you want to face next from the list below.'}</div>
      ${matchesHtml}
    `;
  }

  renderStandings() {
    const standings = window.leaguesEngine.standings;
    const tbody = document.getElementById('table-standings-body');
    if (!tbody) return;

    const userClubId = window.userCareer.profile.currentClubId;

    tbody.innerHTML = standings.map((s, idx) => `
      <tr class="${s.clubId === userClubId ? 'user-team' : ''}">
        <td>#${idx + 1}</td>
        <td style="display: flex; align-items: center; gap: 10px;">${window.leaguesEngine.getClubBadgeHtml(s.name, 26)} <b>${s.name}</b> ${'⭐'.repeat(s.stars || 2)}</td>
        <td>${s.played}</td>
        <td>${s.won}</td>
        <td>${s.drawn}</td>
        <td>${s.lost}</td>
        <td>${s.gd > 0 ? '+' + s.gd : s.gd}</td>
        <td><strong>${s.points}</strong></td>
      </tr>
    `).join('');
  }

  renderSquad() {
    const userClubId = window.userCareer.profile.currentClubId;
    const currentClub = window.leaguesEngine.standings.find(s => s.clubId === userClubId);
    const tbody = document.getElementById('table-squad-body');
    if (!tbody || !currentClub) return;

    tbody.innerHTML = currentClub.squad.map(p => `
      <tr>
        <td><strong style="color: var(--primary);">${p.position}</strong></td>
        <td>${p.name}</td>
        <td>OVR ${p.ovr}</td>
        <td>${p.age} y/o</td>
      </tr>
    `).join('');
  }

  renderTransfers() {
    const p = window.userCareer.profile;
    const offers = window.leaguesEngine.evaluateContractOffers(p.ovr, p.currentClubId);
    const container = document.getElementById('transfers-offers-list');
    if (!container) return;

    if (offers.length === 0) {
      container.innerHTML = `<p style="color: var(--text-muted);">No contract offers available yet. Increase your OVR to attract top clubs!</p>`;
      return;
    }

    container.innerHTML = offers.map(o => `
      <div class="glass-panel" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div>${window.leaguesEngine.getClubBadgeHtml(o.clubName, 36)}</div>
          <div>
            <h4 style="font-size: 18px; font-weight: 900;">${o.clubName} ${'⭐'.repeat(o.stars)}</h4>
            <div style="font-size: 13px; color: var(--text-muted);">${o.leagueName} • Role: ${o.squadRole}</div>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 16px; font-weight: 900; color: var(--primary);">$${o.wage.toLocaleString()}/wk</div>
          <div style="font-size: 12px; color: var(--accent-gold);">+$${o.goalBonus}/Goal • +$${o.assistBonus}/Assist</div>
          <button class="btn btn-primary" style="margin-top: 8px;" onclick="app.acceptContractOffer('${o.clubId}', '${o.clubName}', ${o.wage}, ${o.goalBonus}, ${o.assistBonus})">Sign Contract ✍️</button>
        </div>
      </div>
    `).join('');
  }

  renderAttributes() {
    const p = window.userCareer.profile;
    const container = document.getElementById('attributes-upgrade-list');
    const spEl = document.getElementById('available-sp');
    if (!container) return;

    if (spEl) spEl.innerText = p.skillPoints;

    const attrs = [
      { key: 'pace', name: '⚡ Pace & Sprint' },
      { key: 'shooting', name: '🎯 Shooting & Finishing' },
      { key: 'passing', name: '⚽ Passing & Vision' },
      { key: 'dribbling', name: '🏃 Dribbling & Agility' },
      { key: 'defending', name: '🛡️ Defending & Tackling' },
      { key: 'physical', name: '💪 Physical & Stamina' }
    ];

    container.innerHTML = attrs.map(a => `
      <div class="upgrade-item">
        <div>
          <div style="font-weight: 700;">${a.name}</div>
          <div style="font-size: 13px; color: var(--text-muted);">Current: ${p.attributes[a.key]} / 99</div>
        </div>
        <div style="display: flex; align-items: center; gap: 16px;">
          <div class="upgrade-bar">
            <div class="upgrade-fill" style="width: ${p.attributes[a.key]}%;"></div>
          </div>
          <button class="btn btn-secondary" onclick="app.upgradeAttr('${a.key}')" ${p.skillPoints <= 0 ? 'disabled' : ''}>Upgrade +1</button>
        </div>
      </div>
    `).join('');
  }

  renderStats() {
    const s = window.userCareer.stats.season;
    const c = window.userCareer.stats.career;
    const p = window.userCareer.profile;

    const elSeasonM = document.getElementById('stat-season-matches');
    const elSeasonG = document.getElementById('stat-season-goals');
    const elSeasonA = document.getElementById('stat-season-assists');
    const elSeasonR = document.getElementById('stat-season-rating');

    const elCareerM = document.getElementById('stat-career-matches');
    const elCareerG = document.getElementById('stat-career-goals');
    const elCareerEarnings = document.getElementById('stat-career-earnings');

    if (elSeasonM) elSeasonM.innerText = s.matches;
    if (elSeasonG) elSeasonG.innerText = s.goals;
    if (elSeasonA) elSeasonA.innerText = s.assists;
    if (elSeasonR) elSeasonR.innerText = s.avgRating;

    if (elCareerM) elCareerM.innerText = c.totalMatches;
    if (elCareerG) elCareerG.innerText = c.totalGoals;
    if (elCareerEarnings) elCareerEarnings.innerText = `$${p.totalCareerEarnings.toLocaleString()}`;

    const ageBadge = document.getElementById('age-decay-warning');
    if (ageBadge) {
      ageBadge.style.display = (p.age >= 34) ? 'flex' : 'none';
    }
  }

  // ===================== ACTIONS =====================

  upgradeAttr(key) {
    if (window.userCareer.upgradeAttribute(key)) {
      this.saveCareer(false);
      this.renderAll();
    }
  }

  acceptContractOffer(clubId, clubName, wage, goalBonus, assistBonus) {
    const currentClubName = window.userCareer.profile.currentClubName;
    window.userCareer.pendingTransfer = { clubId, clubName, wage, goalBonus, assistBonus };

    this.saveCareer(false);
    alert(`✍️ Summer Transfer Contract Signed!\n\nYou agreed to join ${clubName} starting NEXT season!\nFinish playing out the current season with ${currentClubName}.`);
    this.renderAll();
  }

  playMatch3D() {
    this.saveSettings(); // persist settings before match
    const p = window.userCareer.profile;
    this.activeMatchContext = window.leaguesEngine.getNextMatch(p.currentClubId, p.nationality);
    const container = document.getElementById('match-container');
    if (container) container.classList.add('active');

    if (window.match3DEngine && typeof window.match3DEngine.dispose === 'function') {
      window.match3DEngine.dispose();
    }

    window.match3DEngine.init('canvas3d');
    window.match3DEngine.startMatch();
  }

  endMatch3D(results) {
    const container = document.getElementById('match-container');
    if (container) container.classList.remove('active');

    const { xpEarned, matchMoney } = window.userCareer.recordMatchPerformance(
      results.userGoals,
      results.userAssists,
      85,
      results.userRating
    );

    window.leaguesEngine.simulateGameweek(
      window.userCareer.profile.currentClubId,
      { userGoals: results.userGoals, oppGoals: results.oppGoals },
      this.activeMatchContext,
      window.userCareer.profile.nationality
    );

    const matchTitle = this.activeMatchContext
      ? [this.activeMatchContext.competitionName, this.activeMatchContext.stageLabel, this.activeMatchContext.matchLabel].filter(Boolean).join(' • ')
      : 'Match Result';

    this.showGameNotice(
      matchTitle,
      `
        <div style="font-size: 18px; font-weight: 900; color: #fff; margin-bottom: 10px;">${results.userGoals} - ${results.oppGoals}</div>
        <div>Rating: <strong style="color: var(--accent-gold);">${results.userRating}/10</strong></div>
        <div>Money Earned: <strong style="color: var(--primary);">+$${matchMoney.toLocaleString()}</strong></div>
        <div>XP Earned: <strong style="color: var(--accent-blue);">+${xpEarned}</strong></div>
      `
    );

    this.activeMatchContext = null;
    this.saveCareer(false);
    this.renderAll();
  }

  simulateMatch() {
    if (this._sim && !this._sim.finished) return;

    const p = window.userCareer.profile;
    this.activeMatchContext = window.leaguesEngine.getNextMatch(p.currentClubId, p.nationality);
    if (!this.activeMatchContext) {
      alert('⚠️ No match available to simulate!');
      return;
    }

    const ctx = this.activeMatchContext;
    const homeName = ctx.displayHomeName || (ctx.home && ctx.home.name) || 'Home';
    const awayName = ctx.displayAwayName || (ctx.away && ctx.away.name) || 'Away';
    const userIsHome = (ctx.home && ctx.home.clubId === p.currentClubId);
    const userName = p.name;

    const homeSquad = ((ctx.home && ctx.home.squad) || this._getClubSquad(ctx.home && ctx.home.clubId) || []).filter(pl => pl.position !== 'GK');
    const awaySquad = ((ctx.away && ctx.away.squad) || this._getClubSquad(ctx.away && ctx.away.clubId) || []).filter(pl => pl.position !== 'GK');

    const userTeam = userIsHome ? 'home' : 'away';
    const oppTeam = userIsHome ? 'away' : 'home';
    const userSquad = userIsHome ? homeSquad : awaySquad;
    const oppSquad = userIsHome ? awaySquad : homeSquad;

    const ovr = p.ovr || 70;
    const randGoals = (bonus = 0) => {
      const r = Math.random() + bonus;
      return r < 0.30 ? 0 : r < 0.65 ? 1 : r < 0.88 ? 2 : 3;
    };
    const ovrBonus = (ovr - 70) * 0.012;
    const userGoals = randGoals(ovrBonus);
    const oppGoals = randGoals(-ovrBonus * 0.5);
    const events = [];

    // User team goals
    for (let i = 0; i < userGoals; i++) {
      const minute = Math.floor(Math.random() * 89) + 1;
      const isUserScorer = Math.random() < (0.35 + (ovr - 70) * 0.005);
      const scorer = isUserScorer ? userName : (userSquad.length ? userSquad[Math.floor(Math.random() * userSquad.length)].name : 'Teammate');
      let assist = null;
      if (isUserScorer) {
        if (Math.random() < 0.25 && userSquad.length) {
          assist = userSquad[Math.floor(Math.random() * userSquad.length)].name;
        }
      } else {
        if (Math.random() < 0.30) {
          assist = userName;
        } else if (Math.random() < 0.25 && userSquad.length) {
          assist = userSquad[Math.floor(Math.random() * userSquad.length)].name;
        }
      }
      const isPenalty = Math.random() < 0.15;
      const isFreekick = !isPenalty && Math.random() < 0.12;
      events.push({ type: 'goal', minute, team: userTeam, player: scorer, isUser: isUserScorer, assist, isPenalty, isFreekick });
    }

    // Opponent goals
    for (let i = 0; i < oppGoals; i++) {
      const minute = Math.floor(Math.random() * 89) + 1;
      const scorer = oppSquad.length ? oppSquad[Math.floor(Math.random() * oppSquad.length)].name : 'Opponent';
      let assist = null;
      if (Math.random() < 0.30 && oppSquad.length) {
        assist = oppSquad[Math.floor(Math.random() * oppSquad.length)].name;
      }
      const isPenalty = Math.random() < 0.15;
      const isFreekick = !isPenalty && Math.random() < 0.12;
      events.push({ type: 'goal', minute, team: oppTeam, player: scorer, isUser: false, assist, isPenalty, isFreekick });
    }

    // Cards (20% chance of at least one card in the game)
    if (Math.random() < 0.20) {
      const numCards = Math.random() < 0.25 ? 2 : 1;
      for (let i = 0; i < numCards; i++) {
        const minute = Math.floor(Math.random() * 89) + 1;
        const isUserTeamCard = Math.random() < 0.50;
        const squad = isUserTeamCard ? userSquad : oppSquad;
        const player = squad.length ? squad[Math.floor(Math.random() * squad.length)].name : 'Player';
        const cardType = Math.random() < 0.80 ? 'yellow' : 'red';
        events.push({ type: 'card', minute, team: isUserTeamCard ? userTeam : oppTeam, player, cardType });
      }
    }

    events.sort((a, b) => a.minute - b.minute);

    this._sim = {
      ctx, events, homeName, awayName, userIsHome, userName, userTeam, oppTeam,
      userGoals, oppGoals,
      scoreHome: 0, scoreAway: 0,
      clock: 0, half: 1, paused: false, finished: false, skipped: false,
      eventIdx: 0, timer: null
    };

    this._showSimOverlay();
    this._startSimClock();
  }

  _getClubSquad(clubId) {
    if (!clubId) return [];
    const club = window.leaguesEngine.standings.find(s => s.clubId === clubId);
    return (club && club.squad) || [];
  }

  _simTitle() {
    const sim = this._sim;
    if (!sim || !sim.ctx) return 'Simulate Match';
    const ctx = sim.ctx;
    return [ctx.competitionName, ctx.stageLabel, ctx.matchLabel].filter(Boolean).join(' • ') || 'Simulate Match';
  }

  _showSimOverlay() {
    const sim = this._sim;
    if (!sim) return;

    const existing = document.getElementById('sim-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'sim-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px);';

    overlay.innerHTML = `
      <div style="background:linear-gradient(135deg,#0a1628 0%,#1e293b 100%);border:2px solid var(--primary);border-radius:20px;padding:28px;max-width:540px;width:100%;box-shadow:0 20px 60px rgba(0,255,136,0.25);">
        <div style="text-align:center;font-size:12px;color:var(--accent-gold);font-weight:900;text-transform:uppercase;letter-spacing:1px;margin-bottom:18px;">${this._simTitle()}</div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:20px;">
          <div style="flex:1;text-align:center;font-size:15px;font-weight:900;color:#fff;word-break:break-word;">${sim.homeName}</div>
          <div style="font-size:34px;font-weight:900;color:var(--primary);min-width:70px;text-align:center;" id="sim-score">0 - 0</div>
          <div style="flex:1;text-align:center;font-size:15px;font-weight:900;color:#fff;word-break:break-word;">${sim.awayName}</div>
        </div>
        <div style="text-align:center;margin-bottom:18px;">
          <div style="font-size:26px;font-weight:900;color:var(--accent-gold);" id="sim-clock">0'</div>
          <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;font-weight:700;" id="sim-period">First Half</div>
        </div>
        <div id="sim-feed" style="max-height:180px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;margin-bottom:18px;padding-right:4px;"></div>
        <div id="sim-controls">
          <button class="btn btn-secondary" style="width:100%;" onclick="app.skipSim()">Skip to Full Time ⏩</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
  }

  _startSimClock() {
    const sim = this._sim;
    if (!sim) return;

    sim.timer = setInterval(() => {
      if (!this._sim || sim.skipped || sim.finished) return;
      if (sim.paused) return;

      sim.clock += 0.15;

      // Process events at current minute
      while (sim.eventIdx < sim.events.length && sim.events[sim.eventIdx].minute <= Math.floor(sim.clock)) {
        const ev = sim.events[sim.eventIdx];
        this._processSimEvent(ev);
        sim.eventIdx++;
        if (ev.type === 'goal') {
          sim.paused = true;
          setTimeout(() => { if (this._sim) this._sim.paused = false; }, 2000);
          break;
        }
      }

      // Halftime check
      if (sim.half === 1 && sim.clock >= 45 && !sim.paused) {
        sim.paused = true;
        this._updateSimPeriod('Halftime');
        setTimeout(() => {
          if (!this._sim) return;
          this._sim.half = 2;
          this._sim.paused = false;
          this._updateSimPeriod('Second Half');
        }, 4000);
      }

      // Full time
      if (sim.clock >= 90) {
        sim.clock = 90;
        this._finishSim();
        return;
      }

      this._updateSimClock();
    }, 100);
  }

  _processSimEvent(ev) {
    const sim = this._sim;
    if (!sim) return;

    const isUserTeam = (ev.team === sim.userTeam);

    if (ev.type === 'goal') {
      if (ev.team === 'home') sim.scoreHome++;
      else sim.scoreAway++;

      const tags = [];
      if (ev.isPenalty) tags.push('penalty');
      if (ev.isFreekick) tags.push('freekick');
      if (ev.assist === sim.userName) tags.push('assist');
      else if (ev.assist) tags.push('assist: ' + ev.assist);

      const label = ev.minute + "' " + ev.player + (tags.length ? ' (' + tags.join(', ') + ')' : '');
      this._addSimFeedItem(label, isUserTeam, 'goal');
      this._updateSimScore();
    } else if (ev.type === 'card') {
      const icon = ev.cardType === 'red' ? '🟥' : '🟨';
      const label = ev.minute + "' " + icon + ' ' + ev.player;
      this._addSimFeedItem(label, isUserTeam, 'card');
    }
  }

  _updateSimClock() {
    const sim = this._sim;
    if (!sim) return;
    const el = document.getElementById('sim-clock');
    if (el) el.innerText = Math.min(90, Math.floor(sim.clock)) + "'";
  }

  _updateSimScore() {
    const sim = this._sim;
    if (!sim) return;
    const el = document.getElementById('sim-score');
    if (el) el.innerText = sim.scoreHome + ' - ' + sim.scoreAway;
  }

  _updateSimPeriod(text) {
    const el = document.getElementById('sim-period');
    if (el) el.innerText = text;
  }

  _addSimFeedItem(label, isUserTeam, type) {
    const feed = document.getElementById('sim-feed');
    if (!feed) return;

    const item = document.createElement('div');
    const borderColor = isUserTeam ? '#0088ff' : '#ef4444';
    item.style.cssText = 'padding:8px 12px;background:rgba(255,255,255,0.06);border-left:3px solid ' + borderColor + ';border-radius:6px;font-size:13px;color:#fff;font-weight:600;opacity:0;transition:opacity 0.3s;';
    item.innerText = label;
    feed.appendChild(item);
    feed.scrollTop = feed.scrollHeight;
    setTimeout(() => { item.style.opacity = '1'; }, 50);
  }

  _finishSim() {
    const sim = this._sim;
    if (!sim || sim.finished) return;
    sim.finished = true;
    if (sim.timer) clearInterval(sim.timer);

    const userGoals = sim.events.filter(e => e.type === 'goal' && e.isUser).length;
    const oppGoals = sim.userIsHome ? sim.scoreAway : sim.scoreHome;
    const assists = sim.events.filter(e => e.type === 'goal' && e.assist === sim.userName).length;
    const rating = parseFloat((6.5 + Math.random() * 3.0).toFixed(1));

    const { xpEarned, matchMoney } = window.userCareer.recordMatchPerformance(userGoals, assists, 80, rating);

    window.leaguesEngine.simulateGameweek(
      window.userCareer.profile.currentClubId,
      { userGoals: userGoals, oppGoals: oppGoals },
      sim.ctx,
      window.userCareer.profile.nationality
    );

    this._showSimFinalResult({ userGoals, oppGoals, assists, rating, xpEarned, matchMoney });
  }

  _showSimFinalResult({ userGoals, oppGoals, assists, rating, xpEarned, matchMoney }) {
    const sim = this._sim;
    if (!sim) return;

    const clockEl = document.getElementById('sim-clock');
    if (clockEl) clockEl.innerText = "90'";
    const periodEl = document.getElementById('sim-period');
    if (periodEl) periodEl.innerText = 'Full Time';

    const controls = document.getElementById('sim-controls');
    if (controls) {
      controls.innerHTML = `
        <div style="background:rgba(0,255,136,0.08);border:1px solid rgba(0,255,136,0.3);border-radius:12px;padding:16px;margin-bottom:14px;text-align:center;">
          <div style="font-size:13px;color:var(--text-muted);margin-bottom:4px;text-transform:uppercase;font-weight:700;">Full Time Result</div>
          <div style="font-size:24px;font-weight:900;color:#fff;margin-bottom:14px;">${sim.scoreHome} - ${sim.scoreAway}</div>
          <div style="display:flex;justify-content:space-around;font-size:13px;flex-wrap:wrap;gap:8px;">
            <div>⚽ Goals: <strong style="color:var(--primary);">${userGoals}</strong></div>
            <div>🎯 Assists: <strong style="color:var(--accent-blue);">${assists}</strong></div>
            <div>⭐ Rating: <strong style="color:var(--accent-gold);">${rating}</strong></div>
          </div>
          <div style="margin-top:12px;font-size:13px;">
            <span style="color:var(--primary);font-weight:700;">+$${matchMoney.toLocaleString()}</span>
            <span style="color:var(--text-muted);margin:0 6px;">•</span>
            <span style="color:var(--accent-blue);font-weight:700;">+${xpEarned} XP</span>
          </div>
        </div>
        <button class="btn btn-primary btn-lg" style="width:100%;" onclick="app.closeSim()">Continue ✅</button>
      `;
    }
  }

  skipSim() {
    const sim = this._sim;
    if (!sim || sim.finished) return;
    if (sim.timer) clearInterval(sim.timer);
    sim.skipped = true;

    // Process all remaining events instantly
    while (sim.eventIdx < sim.events.length) {
      const ev = sim.events[sim.eventIdx];
      this._processSimEvent(ev);
      sim.eventIdx++;
    }

    sim.clock = 90;
    this._updateSimClock();
    this._finishSim();
  }

  closeSim() {
    const overlay = document.getElementById('sim-overlay');
    if (overlay) overlay.remove();

    if (this._sim && this._sim.timer) {
      clearInterval(this._sim.timer);
    }
    this._sim = null;
    this.activeMatchContext = null;
    this.saveCareer(false);
    this.renderAll();
  }

  advanceSeason() {
    const notes = window.userCareer.advanceSeason();
    this.saveCareer(false);

    // Fallback: ensure a new season with matches is available
    const p = window.userCareer.profile;
    if (window.leaguesEngine && !window.leaguesEngine.getNextMatch(p.currentClubId, p.nationality)) {
      const leagueId = window.leaguesEngine.findLeagueForClub(p.currentClubId) || window.leaguesEngine.currentLeagueId;
      window.leaguesEngine.initLeague(leagueId);
    }

    alert(`🏆 Season Advanced to Year ${window.userCareer.stats.season.year}!\n\n${notes.join('\n') || 'Fresh fixtures and new league campaign generated!'}`);
    this.renderAll();
  }

  renderPastSeasons() {
    const container = document.getElementById('past-seasons-container');
    const tabBtn = document.querySelector('.tab-btn[data-tab="pastseasons"]');
    if (!container) return;

    const history = (window.userCareer.stats.career && window.userCareer.stats.career.seasonHistory) || [];

    if (history.length > 0 && tabBtn) {
      tabBtn.style.display = '';
    } else if (tabBtn) {
      tabBtn.style.display = 'none';
    }

    if (history.length === 0) {
      container.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 20px;">No completed past seasons yet. Complete your current season to view career history!</p>`;
      return;
    }

    container.innerHTML = `
      <table class="table-standings" style="width: 100%;">
        <thead>
          <tr>
            <th>Season</th>
            <th>Age</th>
            <th>Club</th>
            <th>OVR</th>
            <th>Matches</th>
            <th>Goals</th>
            <th>Assists</th>
            <th>Avg Rating</th>
            <th>Earnings</th>
          </tr>
        </thead>
        <tbody>
          ${history.map(s => `
            <tr>
              <td><strong>${s.year}</strong></td>
              <td>${s.age} y/o</td>
              <td style="display: flex; align-items: center; gap: 8px;">${window.leaguesEngine.getClubBadgeHtml(s.clubName, 22)} <strong>${s.clubName}</strong></td>
              <td><span class="ovr-badge" style="font-size: 14px; font-weight: 800; color: #ffd700;">${s.ovr}</span></td>
              <td>${s.matches}</td>
              <td>⚽ ${s.goals}</td>
              <td>🎯 ${s.assists}</td>
              <td>${s.avgRating} ⭐</td>
              <td style="color: #00ff88; font-weight: 700;">+$${(s.earnings || 0).toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  openModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add('active');
  }

  closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove('active');
  }

  showGameNotice(title, bodyHtml) {
    const titleEl = document.getElementById('game-notice-title');
    const bodyEl = document.getElementById('game-notice-body');
    if (titleEl) titleEl.innerText = title;
    if (bodyEl) bodyEl.innerHTML = bodyHtml;
    this.openModal('modal-game-notice');
  }
}

window.app = new FootballApp();
document.addEventListener('DOMContentLoaded', () => window.app.init());
