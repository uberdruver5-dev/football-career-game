/**
 * Main Application Orchestrator & UI Router (10 Leagues x 2 Divisions = 200 Clubs)
 * v3 — Main Menu System, Multi-Save Slots, AZERTY Controls, Settings Panel
 */

class FootballApp {
  constructor() {
    this.currentTab = 'dashboard';
    this.matchSettings = {
      halfLength: 3,
      cameraMode: 'broadcast',
      allowSkipSim: false,
      simSpeed: 1
    };

    this.activeMatchContext = null;
    this.activeSaveSlot = null; // which save slot is currently loaded (index)
    this.gamesSelectedCompetition = 'league';
    this.creationData = {
      position: 'ST',
      age: 17,
      height: 180,
      startYear: 2026,
      attributes: { pace: 75, shooting: 75, passing: 65, dribbling: 72, defending: 40, physical: 72, positioning: 70, def_positioning: 70, diving: 70 },
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
      "#f3c299", "#e0ac69", "#d19261", "#ab6528", "#704423", "#4c2b11", "#2b1404"
    ];

    this.hairColors = [
      "#090909", "#1d110a", "#3d2314", "#5c3317", "#84471e", "#b58c56",
      "#d8a25c", "#f4d081", "#be4e13", "#7a2b11", "#221204", "#2c1608"
    ];

    this.facialHairs = [
      "None", "Stubble", "Goatee", "Full Beard", "Anchor Beard",
      "Short Beard", "Mustache", "Circle Beard", "Mutton Chops", "Van Dyke"
    ];

    this._contractOffers = [];
    this._lastOfferCheckGames = 0;
    this._pendingContractNotifications = [];

    // Cheating Mode Keybinds (AZERTY Layout defaults)
    this.cheatKeybinds = {
      own_goal: "m",
      team_goal: "p",
      opp_goal: "o",
      sub_in: "l",
      role_action: "k",
      user_assist: "i",
      force_win: "w"
    };
    this.rebindTarget = null;
    const savedKeys = localStorage.getItem('career_mode_cheat_keybinds');
    if (savedKeys) {
      try {
        this.cheatKeybinds = { ...this.cheatKeybinds, ...JSON.parse(savedKeys) };
      } catch (e) {}
    }
  }

  init() {

    const runInit = (name, fn) => {
      try {
        fn.call(this);
      } catch (e) {
        console.error(`Init error in ${name}:`, e);
      }
    };

    runInit("bindNavigation", this.bindNavigation);
    runInit("bindCreationForm", this.bindCreationForm);
    runInit("populateCreationDropdowns", this.populateCreationDropdowns);
    runInit("loadSettings", this.loadSettings);
    runInit("showMainMenu", this.showMainMenu);
    runInit("bindCheatKeybindsListener", this.bindCheatKeybindsListener);
    const cheatPanel = document.getElementById('settings-cheat-panel');
    const settingsPage = document.getElementById('page-settings');
    if (cheatPanel && settingsPage) settingsPage.appendChild(cheatPanel); // always last in Settings
  }

  bindCheatKeybindsListener() {
    document.addEventListener('keydown', (e) => {
      // 1. If currently rebinding inside modal:
      if (this.rebindTarget) {
        e.preventDefault();
        const key = e.key.toLowerCase();
        this.cheatKeybinds[this.rebindTarget] = key;
        localStorage.setItem('career_mode_cheat_keybinds', JSON.stringify(this.cheatKeybinds));
        this.updateRebindButtonsUI();
        this.rebindTarget = null;
        return;
      }

      // 2. If simulated match is active and Cheat Mode is enabled!
      if (this._sim && !this._sim.finished && window.userCareer?.profile?.cheatModeEnabled) {
        const key = e.key.toLowerCase();
        
        if (key === this.cheatKeybinds.own_goal) {
          e.preventDefault();
          this.injectCustomGoal(true, false); // own player goal
        } else if (key === this.cheatKeybinds.team_goal) {
          e.preventDefault();
          this.injectCustomGoal(false, false); // teammate goal
        } else if (key === this.cheatKeybinds.opp_goal) {
          e.preventDefault();
          this.injectCustomGoal(false, true); // opponent goal
        } else if (key === this.cheatKeybinds.sub_in) {
          e.preventDefault();
          this.injectCustomSubIn(); // instant bench sub-in!
        } else if (key === this.cheatKeybinds.role_action) {
          e.preventDefault();
          this.injectRoleAction();
        } else if (key === this.cheatKeybinds.user_assist) {
          e.preventDefault();
          this.injectAssistGoal();
        } else if (key === this.cheatKeybinds.force_win) {
          e.preventDefault();
          this._sim.forceWin = true;

        }
      }
    });
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
    // Hide menus, but do NOT show app-container yet to prevent background flashes
    document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));

    // Reset career state for a new game
    window.userCareer = new PlayerCareer();
    this.activeSaveSlot = null;
    this.activeMatchContext = null;
    this._contractOffers = [];
    this._contractOfferSeason = null;
    
    // Clear the squads dropdown to force rebuild with the new game's standings
    const selectTeam = document.getElementById('squad-team-select');
    if (selectTeam) selectTeam.innerHTML = '';

    // Reset leaguesEngine completely so no old league fixtures or data bleeds into the new career!
    if (window.leaguesEngine) {
      window.leaguesEngine.currentLeagueId = "turkey_d2";
      window.leaguesEngine.standings = [];
      window.leaguesEngine.seasonSchedule = [];
      window.leaguesEngine.fixtures = [];
      window.leaguesEngine.activeMatchId = null;
      window.leaguesEngine.clubSquads = {};
      window.leaguesEngine.natGroupStandings = null;
      window.leaguesEngine.nationalQualified = false;
      window.leaguesEngine.natQualPoints = 0;
      window.leaguesEngine.natQualPlayed = 0;
      window.leaguesEngine.natGroupPoints = 0;
      window.leaguesEngine.natGroupPlayed = 0;
      window.leaguesEngine.natStage = 'qualifiers';
      window.leaguesEngine.uclQualified = false;
      window.leaguesEngine.uclStage = 'qualifiers';
      window.leaguesEngine.uclQualifiersPoints = 0;
      window.leaguesEngine.uclQualifiersPlayed = 0;
      window.leaguesEngine.uclGroupPoints = 0;
      window.leaguesEngine.uclGroupPlayed = 0;
      window.leaguesEngine.cupStage = 'r16';
      window.leaguesEngine.cupGroupPoints = 0;
      window.leaguesEngine.cupGroupPlayed = 0;
      window.leaguesEngine.pendingUclNotice = null;
    }

    // Randomize everything for the new player and proposed club!
    this.randomizePlayerCreation();
    
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

    this.showGameNotice("⚙️ Settings Reset", "<div style='font-size:48px;margin-bottom:12px;'>🔄</div><p style='color:#fff;font-size:15px;line-height:1.6;'>✅ Settings have been reset to defaults.</p>");
  }

  loadSettings() {
    try {
      const raw = localStorage.getItem('football_career_settings');
      if (raw) {
        const s = JSON.parse(raw);
        this.matchSettings.halfLength = s.halfLength || 3;
        this.matchSettings.cameraMode = s.cameraMode || 'broadcast';
        this.matchSettings.allowSkipSim = s.allowSkipSim === true;
        this.matchSettings.simSpeed = s.simSpeed || 1;
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
      const saves = raw ? JSON.parse(raw) : [];
      // Migrate pre-v1.6 saves: old fixture/schedule objects each embedded whole squads.
      // Removing only those duplicate references preserves all canonical clubSquads data.
      return saves.map(save => {
        const data = save?.data;
        if (!data) return save;
        let changed = false;
        const compact = value => JSON.parse(JSON.stringify(value || [], (key, item) => {
          if (key === 'squad') { changed = true; return undefined; }
          return item;
        }));
        const compactedData = { ...data };
        ['standings', 'fixtures', 'seasonSchedule'].forEach(key => {
          if (data[key]) compactedData[key] = compact(data[key]);
        });
        return changed ? { ...save, data: compactedData } : save;
      });
    } catch (e) { return []; }
  }

  setSaves(saves) {
    try {
      localStorage.setItem('football_career_saves', JSON.stringify(saves));
      return true;
    } catch (error) {
      // A save failure must never interrupt UI rendering or match/attribute actions.
      console.warn('Career save could not be written:', error);
      return false;
    }
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

      // Clear the squads dropdown to force rebuild on loaded save
      const selectTeam = document.getElementById('squad-team-select');
      if (selectTeam) selectTeam.innerHTML = '';

      this.refreshUI();
    } catch (e) {
      this.showGameNotice("⚠️ Loading Error", "<div style='font-size:48px;margin-bottom:12px;'>❌</div><p style='color:#ef4444;font-size:15px;line-height:1.6;'>Failed to load save file. The save slot may be empty or corrupted.</p>");
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
      season: window.userCareer.stats?.season?.year || 2026,
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

    const saved = this.setSaves(saves);
    if (!saved) {
      if (showAlert) {
        this.showGameNotice("⚠️ Save Not Completed", "<div style='font-size:48px;margin-bottom:12px;'>⚠️</div><p style='color:#fff;font-size:15px;line-height:1.6;'>Your current game is still running, but browser storage is full or unavailable. Delete an old save and try again.</p>");
      }
      return false;
    }
    if (showAlert) this.showGameNotice("💾 Career Saved!", "<div style='font-size:48px;margin-bottom:12px;'>💾</div><p style='color:#fff;font-size:15px;line-height:1.6;'>Your progress, standings, attributes, and settings have been successfully saved!</p>");
    return true;
  }

  loadCareer() {
    // Legacy fallback — try to open saves panel
    this.showMainMenu();
    this.menuPlay();
    this.menuCareerMode();
    this.menuLoadSaves();
  }

  resetCareer() {
    this.showGameNotice('⚠️ Start Over?', `<p>This permanently removes all saves and returns to the main menu.</p><div style="display:flex;gap:10px"><button class="btn btn-secondary" style="flex:1" onclick="app.closeGameNotice()">Cancel</button><button class="btn btn-danger" style="flex:1" onclick="app.confirmResetCareer()">Delete Everything</button></div>`);
  }

  confirmResetCareer() {
    localStorage.removeItem('football_career_saves'); localStorage.removeItem('football_career_settings'); localStorage.removeItem('football_career_save_slot'); localStorage.removeItem('football_career_saved');
    window.userCareer = new PlayerCareer(); window.leaguesEngine.initLeague("turkey_d2"); this.activeSaveSlot = null; this.matchSettings = { halfLength: 3, cameraMode: 'broadcast', allowSkipSim: false, simSpeed: 1 }; this.activeMatchContext = null; this.closeGameNotice(); this.showMainMenu();
  }

  // ===================== NAVIGATION =====================

  populateCreationDropdowns() {
    const natSelect = document.getElementById('create-nationality');
    if (natSelect) {
      // Sort alphabetically for clean user navigation!
      const sortedNats = [...window.leaguesEngine.nationalTeams].sort((a, b) => a.name.localeCompare(b.name));
      natSelect.innerHTML = sortedNats.map(n => `
        <option value="${n.name}">${n.name} ${'⭐'.repeat(n.stars)}</option>
      `).join('');
      const flagPreview = document.getElementById('create-nationality-flag');
      if (flagPreview) flagPreview.innerHTML = window.leaguesEngine.getCountryFlagHtml(natSelect.value || sortedNats[0]?.name, 28);
      natSelect.addEventListener('change', () => { if (flagPreview) flagPreview.innerHTML = window.leaguesEngine.getCountryFlagHtml(natSelect.value, 28); });

      // Recommend a random name matching the first selected nationality if input is empty!
      const defaultNat = sortedNats[0];
      const nameInput = document.getElementById('create-name');
      if (nameInput && (!nameInput.value || nameInput.value === "Jack Sterling") && window.NATIONAL_NAMES) {
        let culturalCountry = defaultNat.name;
        if (window.leaguesEngine && typeof window.leaguesEngine.getCulturalCountry === 'function') {
          culturalCountry = window.leaguesEngine.getCulturalCountry(defaultNat.name);
        }
        if (window.NATIONAL_NAMES[culturalCountry]) {
          const firstNames = window.NATIONAL_NAMES[culturalCountry].first;
          const lastNames = window.NATIONAL_NAMES[culturalCountry].last;
          const randFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
          const randLast = lastNames[Math.floor(Math.random() * lastNames.length)];
          nameInput.value = `${randFirst} ${randLast}`;
        }
      }
    }

    // Gather Starter Clubs (Both Div 1 and Div 2) from ALL 10 major countries!
    const clubSelect = document.getElementById('create-club');
    if (clubSelect) {
      let optionsHTML = "";
      Object.values(window.leaguesEngine.leagues).forEach(lg => {
        optionsHTML += `<optgroup label="🏆 ${lg.name} (${lg.country})">`;
        lg.clubs.forEach(c => {
          optionsHTML += `<option value="${c.id}" data-league="${lg.id}">${c.name} (${'⭐'.repeat(c.stars || 2)})</option>`;
        });
        optionsHTML += `</optgroup>`;
      });
      clubSelect.innerHTML = optionsHTML;
    }

    // Populate start year dropdown dynamically from 1950 to 2050
    const startYearSelect = document.getElementById('create-start-year');
    if (startYearSelect) {
      let optionsHTML = "";
      for (let yr = 1950; yr <= 2050; yr++) {
        const nextYrShort = String(yr + 1).slice(-2);
        const label = `${yr}-${yr + 1} Season (${String(yr).slice(-2)}/${nextYrShort})`;
        optionsHTML += `<option value="${yr}" ${yr === 2026 ? 'selected' : ''}>${label}</option>`;
      }
      startYearSelect.innerHTML = optionsHTML;
    }
  }

  randomizePlayerCreation() {
    // 1. Populate standard dropdowns first
    this.populateCreationDropdowns();

    // 2. Random Nationality
    const nations = window.leaguesEngine.nationalTeams;
    const randNation = nations[Math.floor(Math.random() * nations.length)];

    // 3. Random Name fitting nationality from window.NATIONAL_NAMES with cultural mapping
    let first = "Jack";
    let last = "Sterling";
    let culturalCountry = randNation.name;
    if (window.leaguesEngine && typeof window.leaguesEngine.getCulturalCountry === 'function') {
      culturalCountry = window.leaguesEngine.getCulturalCountry(randNation.name);
    }
    if (window.NATIONAL_NAMES && window.NATIONAL_NAMES[culturalCountry]) {
      const firstNames = window.NATIONAL_NAMES[culturalCountry].first;
      const lastNames = window.NATIONAL_NAMES[culturalCountry].last;
      first = firstNames[Math.floor(Math.random() * firstNames.length)];
      last = lastNames[Math.floor(Math.random() * lastNames.length)];
    }
    const randName = `${first} ${last}`;

    // 4. Propose a balanced mix of Division 1 and Division 2 starting clubs.
    const starterClubs = [];
    Object.values(window.leaguesEngine.leagues).forEach(lg => {
      if (lg.tier === 1 || lg.tier === 2) {
        lg.clubs.forEach(c => {
          starterClubs.push({ clubId: c.id, leagueId: lg.id });
        });
      }
    });
    const randClub = starterClubs[Math.floor(Math.random() * starterClubs.length)] || { clubId: 'galatasaray', leagueId: 'turkey_d1' };

    // Select randomized values in dropdowns and inputs
    const nameInput = document.getElementById('create-name');
    if (nameInput) nameInput.value = randName;

    const natSelect = document.getElementById('create-nationality');
    if (natSelect) { natSelect.value = randNation.name; const fp=document.getElementById('create-nationality-flag'); if(fp) fp.innerHTML=window.leaguesEngine.getCountryFlagHtml(randNation.name,28); }

    const clubSelect = document.getElementById('create-club');
    if (clubSelect) clubSelect.value = randClub.clubId;

    // 5. Random Position
    const positions = ['ST', 'CAM', 'CM', 'RW', 'LW', 'CB', 'LB', 'RB', 'GK'];
    const randPos = positions[Math.floor(Math.random() * positions.length)];
    const posSelect = document.getElementById('create-position');
    if (posSelect) posSelect.value = randPos;
    this.onPositionChange(randPos); // This sets baseline stats and updates creationData.position
    // Recommended player OVR always lands in the requested 69–85 range.
    const targetOvr = Math.floor(Math.random() * 17) + 69;
    Object.keys(this.creationData.attributes).forEach(key => {
      this.creationData.attributes[key] = Math.max(1, Math.min(130, targetOvr + Math.floor(Math.random() * 9) - 4));
    });

    // 6. Random Age (16-20)
    const randAge = Math.floor(Math.random() * 5) + 16;
    const ageSlider = document.getElementById('slider-age');
    if (ageSlider) ageSlider.value = randAge;
    this.onAgeChange(randAge); // Updates creationData.age and display

    // 7. Random Height (160-205)
    const randHeight = Math.floor(Math.random() * 46) + 160;
    const heightSlider = document.getElementById('slider-height');
    if (heightSlider) heightSlider.value = randHeight;
    this.onHeightChange(randHeight); // Updates creationData.height and display

    // 8. Random Appearance
    const randHairIdx = Math.floor(Math.random() * this.hairStyles.length);
    const randHairColor = this.hairColors[Math.floor(Math.random() * this.hairColors.length)];
    
    // Culturally appropriate skin tones selection matching user's nationality
    const fairToneInds = [0, 1]; // Light tones
    const oliveTanInds = [0, 1, 2, 3]; // Olive/Tan tones
    const subSaharanInds = [4, 5, 6]; // Dark brown/Black tones
    const diverseInds = [0, 1, 2, 3, 4, 5, 6]; // Highly diverse tones

    const natGroups = {
      // Fair / Light / Olive (Anglo/European + East Asian)
      "England": fairToneInds, "France": fairToneInds, "Germany": fairToneInds, "Belgium": fairToneInds,
      "Croatia": fairToneInds, "Poland": fairToneInds, "Norway": fairToneInds, "Sweden": fairToneInds,
      "Denmark": fairToneInds, "Canada": fairToneInds, "Japan": fairToneInds, "South Korea": fairToneInds,

      // Olive / Tan / Medium Brown (Hispanic/Mediterranean/Arabic)
      "Spain": oliveTanInds, "Italy": oliveTanInds, "Argentina": oliveTanInds, "Uruguay": oliveTanInds,
      "Colombia": oliveTanInds, "Mexico": oliveTanInds, "Turkey": oliveTanInds, "Morocco": oliveTanInds,
      "Algeria": oliveTanInds, "Egypt": oliveTanInds,

      // Dark Brown / Black (Sub-Saharan African)
      "Nigeria": subSaharanInds, "Ghana": subSaharanInds, "Senegal": subSaharanInds, "Ivory Coast": subSaharanInds,

      // Highly Diverse
      "Brazil": diverseInds, "USA": diverseInds
    };

    const allowedInds = natGroups[randNation.name] || fairToneInds;
    const pickedSkinIdx = allowedInds[Math.floor(Math.random() * allowedInds.length)];
    const randSkinTone = this.skinTones[pickedSkinIdx];

    this.creationData.hairStyleIndex = randHairIdx;
    this.creationData.hairStyle = this.hairStyles[randHairIdx];
    this.creationData.hairColor = randHairColor;
    this.creationData.skinColor = randSkinTone;

    // 9. Random Career Professionality (with realistic probabilities: 8% GOAT, 42% PRO, 30% GOOD, 15% AVG, 5% Under Avg)
    const archs = ['goat', 'pro', 'good', 'avg', 'under_avg'];
    const weights = [0.08, 0.42, 0.30, 0.15, 0.05];
    let rValue = Math.random();
    let randArch = 'pro';
    let cumulative = 0;
    for (let i = 0; i < archs.length; i++) {
      cumulative += weights[i];
      if (rValue < cumulative) {
        randArch = archs[i];
        break;
      }
    }
    const archSelect = document.getElementById('create-professionality');
    if (archSelect) archSelect.value = randArch;

    // Sync appearance studio UI and redraw avatar
    this.initAppearanceUI();
    this.renderAppearanceAvatar();
    this.updatePreviewOvr();
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

    this.refreshUI();
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

    // Render Facial Hair Options
    const fhSelect = document.getElementById('create-facial-hair-select');
    if (fhSelect) {
      fhSelect.innerHTML = this.facialHairs.map(style => `
        <option value="${style}" ${this.creationData.facialHairStyle === style ? 'selected' : ''}>${style}</option>
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

  cycleFacialHair(dir) {
    let curr = this.facialHairs.indexOf(this.creationData.facialHairStyle || 'None');
    if (curr === -1) curr = 0;
    curr = (curr + dir + this.facialHairs.length) % this.facialHairs.length;
    this.selectFacialHairStyle(this.facialHairs[curr]);
  }

  selectFacialHairStyle(style) {
    this.creationData.facialHairStyle = style;
    const select = document.getElementById('create-facial-hair-select');
    if (select) select.value = style;
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

  buildAvatarMarkup({ hairStyle, hairColor, skinColor, facialHairStyle, size = 100, showBody = true, portraitStyle = 'default' }) {
    // CUSTOM APPEARANCE ASSETS (Appearance/ folder): when the manifest is enabled
    // with a head image, the player renders from the user-provided images instead
    // of the built-in flat SVG head.
    const manifest = window.APPEARANCE_MANIFEST;
    if (manifest && manifest.enabled && manifest.head && manifest.head.base) {
      return this.buildCustomAvatarMarkup(manifest, { hairStyle, hairColor, skinColor, size });
    }

    const family = this.getHairStyleFamily(hairStyle);
    const skin = skinColor || '#f3c299';
    const hair = hairColor || '#3d2314';
    const fh = facialHairStyle || 'None';
    const skinDark = this._shade(skin, -26);

    // =====================================================================
    // Head silhouette traced from the user's reference image: rounded top,
    // straight sides, tapered rounded bottom — a head-and-bust in one shape.
    // =====================================================================
    const REF_HEAD_PATH = 'M24.6 46 C24.6 42.3 28.3 41.8 31.9 41.8 L68.1 41.8 C71.7 41.8 75.4 42.3 75.4 46 L75.4 75 C75.4 81.1 71.7 85.9 66.9 88.4 C62.1 90.7 56 91.7 50 91.7 C44 91.7 37.9 90.7 33.1 88.4 C28.3 85.9 24.6 81.1 24.6 75 Z';

    // Hair & facial-hair shapes were designed for the old head geometry; this
    // transform maps them onto the new wider reference head (x stretched 1.16x
    // around x=8, y shifted up 9 so the hair cap sits on the new scalp).
    const HAIR_TRANSFORM = 'translate(0 7) scale(1 0.9)';

    return `
      <svg viewBox="0 0 100 120" width="${size}" height="${Math.round(size * 1.2)}" xmlns="http://www.w3.org/2000/svg" style="display:block;max-width:100%;max-height:100%;">
        <!-- Reference bust silhouette -->
        <path d="${REF_HEAD_PATH}" fill="${skin}" stroke="${skinDark}" stroke-width="1.2"/>

        <!-- Eyes: small solid circles (reference position/proportion) -->
        <circle cx="38.2" cy="56" r="4.2" fill="#141414"/>
        <circle cx="37.1" cy="55" r="1.1" fill="#ffffff" opacity="0.85"/>
        <circle cx="60.2" cy="56" r="4.2" fill="#141414"/>
        <circle cx="59.1" cy="55" r="1.1" fill="#ffffff" opacity="0.85"/>

        <!-- Mouth: small curved smile -->
        <path d="M42.8 74.6 Q47.8 79.3 52.9 74.6" fill="none" stroke="#141414" stroke-width="2.6" stroke-linecap="round"/>

        <g transform="${HAIR_TRANSFORM}">
          ${this._facialHairPath(fh, hair)}
          ${this._hairPath(family, hair, this._shade(hair, -32), this._shade(hair, 26), skinDark)}
        </g>
      </svg>
    `;
  }

  // ---- Custom Appearance/ folder support -------------------------------------

  // Draws the user-provided head + hair images layered over each other, tinted to
  // match the chosen skin tone / hair color via CSS filters (exact tones can be
  // supplied per skin tone in the manifest for pixel-perfect results).
  buildCustomAvatarMarkup(manifest, { hairStyle, hairColor, skinColor, size }) {
    const head = manifest.head || {};
    const skin = skinColor || '#f3c299';
    const skinFile = (head.tones && head.tones[skin]) || head.base;
    const skinFilter = (head.tones && head.tones[skin]) ? '' : this._toneFilter(skin, '#f3c299');
    const idx = this.hairStyles.indexOf(hairStyle);
    const hairDef = (Array.isArray(manifest.hairs) && idx >= 0) ? manifest.hairs[idx] : null;
    const h = Math.round(size * 1.2);

    let hairHtml = '';
    if (hairDef && hairDef.file) {
      const hairFilter = (hairDef.tint === false) ? '' : this._toneFilter(hairColor || '#3d2314', '#3d2314');
      hairHtml = `<img src="${hairDef.file}" alt="" style="position:absolute;left:0;top:0;width:100%;height:100%;object-fit:contain;pointer-events:none;${hairFilter}">`;
    } else {
      // No custom image for this style: fall back to the simple built-in hair shape.
      const skinDark = this._shade(skin, -26);
      const hairC = hairColor || '#3d2314';
      const hairDark = this._shade(hairC, -32);
      const hairLight = this._shade(hairC, 26);
      hairHtml = `<svg viewBox="0 0 100 120" width="${size}" height="${h}" style="position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;">${this._hairPath(this.getHairStyleFamily(hairStyle), hairC, hairDark, hairLight, skinDark)}</svg>`;
    }

    return `
      <div style="position:relative;width:${size}px;height:${h}px;display:inline-block;vertical-align:middle;line-height:0;">
        <img src="${skinFile}" alt="" style="position:absolute;left:0;top:0;width:100%;height:100%;object-fit:contain;${skinFilter}">
        ${hairHtml}
      </div>`;
  }

  // Approximate CSS filter that shifts a base color toward a target hex, used to
  // tint a single head/hair image to the player's chosen skin tone / hair color.
  _toneFilter(targetHex, baseHex) {
    const t = this._hsl(targetHex);
    const b = this._hsl(baseHex);
    if (!t || !b) return '';
    const hue = t.h - b.h;
    const sat = Math.max(0.15, Math.min(3, t.s / Math.max(0.01, b.s)));
    const light = Math.max(0.15, Math.min(3, t.l / Math.max(0.01, b.l)));
    return `filter: sepia(0.4) saturate(${sat.toFixed(2)}) hue-rotate(${hue.toFixed(1)}deg) brightness(${light.toFixed(2)});`;
  }

  _hsl(hex) {
    const h = String(hex || '#000000').replace('#', '');
    if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
    const r = parseInt(h.substring(0, 2), 16) / 255;
    const g = parseInt(h.substring(2, 4), 16) / 255;
    const b = parseInt(h.substring(4, 6), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const d = max - min;
    if (d === 0) return { h: 0, s: 0, l };
    let hue = 0;
    if (max === r) hue = 60 * (((g - b) / d) % 6);
    else if (max === g) hue = 60 * ((b - r) / d + 2);
    else hue = 60 * ((r - g) / d + 4);
    if (hue < 0) hue += 360;
    return { h: hue, s: d / (1 - Math.abs(2 * l - 1)), l };
  }

  _facialHairPath(style, color) {
    switch (style) {
      case 'Stubble':
        return `<path d="M36 78 C36 88, 64 88, 64 78 C64 82, 50 85, 36 82 Z" fill="${color}" opacity="0.25" stroke="none"/>`;
      case 'Goatee':
        return `
          <path d="M43 78 Q50 74 57 78 Q50 80 43 78 Z" fill="${color}"/>
          <path d="M46 80 L54 80 L52 87 L48 87 Z" fill="${color}"/>
        `;
      case 'Full Beard':
        return `<path d="M28 66 C28 92, 72 92, 72 66 C72 82, 66 90, 50 92 C34 90, 28 82, 28 66 Z M40 80 Q50 84 60 80 Q50 87 40 80 Z" fill="${color}" stroke="${color}" stroke-width="1.5" stroke-linejoin="round"/>`;
      case 'Anchor Beard':
        return `
          <path d="M43 77 Q50 74 57 77 Q50 79 43 77 Z" fill="${color}"/>
          <path d="M48 80 L52 80 L50 88 Z M45 84 L55 84" stroke="${color}" stroke-width="1.5" fill="none"/>
        `;
      case 'Short Beard':
        return `<path d="M30 68 C30 88, 70 88, 70 68 C70 78, 66 84, 50 86 C34 84, 30 78, 30 68 Z" fill="${color}" opacity="0.85"/>`;
      case 'Mustache':
        return `<path d="M41 78 Q50 72 59 78 Q50 81 41 78 Z" fill="${color}"/>`;
      case 'Circle Beard':
        return `
          <path d="M42 77 C42 74, 58 74, 58 77 C58 84, 42 84, 42 77 Z" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
        `;
      case 'Mutton Chops':
        return `
          <path d="M27 60 L33 60 L38 80 L30 80 Z" fill="${color}"/>
          <path d="M73 60 L67 60 L62 80 L70 80 Z" fill="${color}"/>
        `;
      case 'Van Dyke':
        return `
          <path d="M41 77 Q50 73 59 77 Z" fill="${color}" stroke="${color}" stroke-width="1"/>
          <path d="M48 81 L52 81 L50 89 Z" fill="${color}"/>
        `;
      default:
        return '';
    }
  }

  _hairPath(fam, hair, hairDark, hairLight, skinDark) {
    const cap = (d) => `<path d="${d}" fill="${hair}" stroke="${hairDark}" stroke-width="1" stroke-linejoin="round"/>`;
    switch (fam) {
      case 'bald':
        return `<path d="M28 54 Q28 42 50 40 Q72 42 72 54" fill="none" stroke="${skinDark}" stroke-width="4" opacity="0.15"/>`;
      case 'short':
        return cap('M25 50 Q25 32 50 28 Q75 32 75 50 Q75 42 66 40 Q50 34 34 40 Q25 42 25 50 Z');
      case 'fade':
        return cap('M28 44 Q28 30 50 26 Q72 30 72 44 Q66 40 50 38 Q34 40 28 44 Z') +
               `<path d="M24 60 L28 44 Q50 38 72 44 L76 60 Q72 50 50 50 Q28 50 24 60 Z" fill="${hair}" opacity="0.35"/>`;
      case 'bowl':
        return cap('M24 50 Q24 24 50 22 Q76 24 76 50 Q76 52 70 52 C65 52, 60 48, 50 48 C40 48, 35 52, 30 52 Q24 52 24 50 Z');
      case 'flat':
        return cap('M25 46 L25 30 Q50 28 75 30 L75 46 Q70 42 50 41 Q30 42 25 46 Z');
      case 'afro':
      case 'curly_afro':
        return cap('M18 52 Q12 40 18 30 Q24 16 38 18 Q50 10 62 18 Q76 16 82 30 Q88 40 82 52 Q84 62 76 64 Q50 54 24 64 Q16 62 18 52 Z');
      case 'curly':
        return cap('M22 52 Q18 32 30 26 Q35 14 50 16 Q65 14 70 26 Q82 32 78 52 Q74 44 64 42 Q50 38 36 42 Q26 44 22 52 Z');
      case 'puff':
        return cap('M20 48 Q10 24 40 20 Q50 10 60 20 Q90 24 80 48 Q76 42 50 42 Q24 42 20 48 Z');
      case 'mohawk':
      case 'frohawk':
        return cap('M38 40 L36 14 Q50 4 64 14 L62 40 Q50 36 38 40 Z');
      case 'high_top':
        return cap('M30 42 L30 18 L70 18 L70 42 Q50 38 30 42 Z');
      case 'undercut':
        return cap('M24 44 Q28 20 48 18 Q68 18 76 34 Q76 42 70 44 Q50 34 24 44 Z') +
               `<path d="M24 55 L25 44 Q50 34 75 44 L76 55 Q72 48 50 48 Q28 48 24 55 Z" fill="${hair}" opacity="0.35"/>`;
      case 'side_part':
        return cap('M24 48 Q28 26 48 24 L50 24 Q72 26 76 48 Q70 42 50 42 Q30 42 24 48 Z') +
               `<path d="M48 24 L50 42" stroke="${skinDark}" stroke-width="1.5" opacity="0.6"/>`;
      case 'spiky':
        return cap('M22 52 L26 32 L32 40 L38 22 L44 38 L50 16 L56 38 L62 22 L68 40 L74 32 L78 52 Q50 42 22 52 Z');
      case 'dreads':
        return cap('M26 44 Q26 24 50 22 Q74 24 74 44') +
               `<path d="M25 44 L20 74 M32 46 L27 82 M68 46 L73 82 M75 44 L80 74" stroke="${hair}" stroke-width="4.5" stroke-linecap="round"/>` +
               `<path d="M21 62 L24 62 M76 62 L79 62" stroke="#ffd700" stroke-width="1.8"/>`;
      case 'braids':
        return cap('M26 44 Q50 24 74 44') +
               `<path d="M34 40 Q50 30 66 40 M38 41 Q50 34 62 41 M42 42 Q50 36 58 42" fill="none" stroke="${hairDark}" stroke-width="2" stroke-linecap="round"/>`;
      case 'tied':
        return cap('M26 46 Q28 26 50 24 Q72 26 76 46 Q70 42 50 42 Q30 42 26 46 Z') +
               `<circle cx="50" cy="18" r="7" fill="${hair}" stroke="${hairDark}" stroke-width="1.2"/>`;
      case 'mullet':
        return cap('M26 46 Q28 32 50 28 Q72 32 72 46 Q68 42 50 41 Q32 42 26 46 Z') +
               `<path d="M24 46 Q18 64 22 84 Q28 82 30 70 M76 46 Q82 64 78 84 Q72 82 70 70" fill="${hair}" stroke="${hairDark}" stroke-width="1.2"/>`;
      case 'long':
        return cap('M24 46 Q16 16 50 14 Q84 16 76 46 L78 86 Q72 84 70 70 L70 46 Q50 44 30 46 L30 70 Q28 84 22 86 Z');
      case 'pompadour':
        return cap('M24 46 Q24 12 50 8 Q76 12 76 46 Q70 40 50 38 Q30 40 24 46 Z');
      case 'crop':
        return cap('M26 46 Q28 28 50 26 Q72 28 74 46 L74 48 Q50 44 26 48 Z');
      default:
        return cap('M25 50 Q25 32 50 28 Q75 32 75 50 Q75 42 66 40 Q50 34 34 40 Q25 42 25 50 Z');
    }
  }

  renderAvatar(targetId, appearance, size = 100, showBody = true) {
    const el = document.getElementById(targetId);
    if (!el) return;
    el.innerHTML = this.buildAvatarMarkup({
      hairStyle: appearance.hairStyle || 'Short Fade',
      hairColor: appearance.hairColor || '#3d2314',
      skinColor: appearance.skinColor || '#f3c299',
      facialHairStyle: appearance.facialHairStyle || 'None',
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

    const fhLabel = document.getElementById('facial-hair-style-label');
    const fhCount = document.getElementById('facial-hair-style-count');
    
    if (fhLabel) fhLabel.innerText = this.creationData.facialHairStyle || 'None';
    if (fhCount) {
      const fhIdx = this.facialHairs.indexOf(this.creationData.facialHairStyle || 'None');
      fhCount.innerText = `${fhIdx === -1 ? 1 : fhIdx + 1} / ${this.facialHairs.length}`;
    }

    this.renderAvatar('avatar-head-display', {
      hairStyle: styleName,
      hairColor: this.creationData.hairColor,
      skinColor: this.creationData.skinColor,
      facialHairStyle: this.creationData.facialHairStyle
    }, 100, true);

    this.renderAvatar('card-avatar-display', {
      hairStyle: styleName,
      hairColor: this.creationData.hairColor,
      skinColor: this.creationData.skinColor,
      facialHairStyle: this.creationData.facialHairStyle
    }, 120, true);
  }

  onPositionChange(pos) {
    this.creationData.position = pos;

    // Calibrated baseline stats per position role to result in exactly 74-78 OVR!
    const baselines = {
      ST:  { pace: 80, shooting: 82, passing: 68, dribbling: 78, defending: 45, physical: 74, positioning: 80, def_positioning: 45, diving: 45 },
      CAM: { pace: 82, shooting: 76, passing: 78, dribbling: 80, defending: 45, physical: 68, positioning: 75, def_positioning: 45, diving: 45 },
      CM:  { pace: 70, shooting: 48, passing: 72, dribbling: 64, defending: 84, physical: 82, positioning: 48, def_positioning: 82, diving: 45 },
      RW:  { pace: 82, shooting: 76, passing: 78, dribbling: 80, defending: 45, physical: 68, positioning: 75, def_positioning: 45, diving: 45 },
      LW:  { pace: 82, shooting: 76, passing: 78, dribbling: 80, defending: 45, physical: 68, positioning: 75, def_positioning: 45, diving: 45 },
      CB:  { pace: 70, shooting: 48, passing: 72, dribbling: 64, defending: 84, physical: 82, positioning: 48, def_positioning: 82, diving: 45 },
      LB:  { pace: 82, shooting: 50, passing: 74, dribbling: 72, defending: 78, physical: 72, positioning: 55, def_positioning: 78, diving: 45 },
      RB:  { pace: 82, shooting: 50, passing: 74, dribbling: 72, defending: 78, physical: 72, positioning: 55, def_positioning: 78, diving: 45 },
      GK:  { pace: 80, shooting: 35, passing: 80, dribbling: 50, defending: 55, physical: 82, positioning: 40, def_positioning: 45, diving: 86 }
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

  onStartYearChange(val) {
    this.creationData.startYear = parseInt(val);
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
    
    // Ensure new attributes are defined on old save loads smoothly!
    if (a.positioning === undefined) a.positioning = 70;
    if (a.def_positioning === undefined) a.def_positioning = 70;
    if (a.diving === undefined) a.diving = 70;

    let ovr = 70;

    switch(pos) {
      case 'ST': {
        const core = (a.shooting * 0.20) + (a.pace * 0.20) + (a.positioning * 0.20) + (a.dribbling * 0.20);
        const rest = (a.passing * 0.10) + (a.physical * 0.10);
        ovr = core + rest;
        break;
      }
      case 'CAM': {
        const core = (a.pace * 0.20) + (a.passing * 0.20) + (a.dribbling * 0.20) + (a.shooting * 0.20);
        const rest = (a.physical * 0.10) + (a.positioning * 0.10);
        ovr = core + rest;
        break;
      }
      case 'CM': {
        const core = (a.passing * 0.20) + (a.defending * 0.20) + (a.dribbling * 0.20) + (a.physical * 0.20);
        const rest = (a.shooting * 0.10) + (a.positioning * 0.10);
        ovr = core + rest;
        break;
      }
      case 'RW':
      case 'LW': {
        const core = (a.pace * 0.20) + (a.passing * 0.20) + (a.dribbling * 0.20) + (a.shooting * 0.20);
        const rest = (a.physical * 0.10) + (a.positioning * 0.10);
        ovr = core + rest;
        break;
      }
      case 'CB': {
        const core = (a.passing * 0.20) + (a.defending * 0.20) + (a.def_positioning * 0.20) + (a.physical * 0.20);
        const rest = (a.shooting * 0.10) + (a.pace * 0.10);
        ovr = core + rest;
        break;
      }
      case 'LB':
      case 'RB': {
        const core = (a.defending * 0.20) + (a.pace * 0.20) + (a.def_positioning * 0.20) + (a.passing * 0.20);
        const rest = (a.physical * 0.10) + (a.shooting * 0.10);
        ovr = core + rest;
        break;
      }
      case 'GK': {
        const core = (a.pace * 0.20) + (a.physical * 0.20) + (a.diving * 0.20) + (a.passing * 0.20);
        const rest = (a.shooting * 0.10) + (a.def_positioning * 0.10);
        ovr = core + rest;
        break;
      }
      default: {
        const sum = (a.pace || 50) + (a.shooting || 50) + (a.passing || 50) + (a.dribbling || 50) + (a.defending || 50) + (a.physical || 50);
        ovr = sum / 6;
      }
    }

    let maxCeiling = 99;
    const selectArch = document.getElementById('create-professionality');
    if (selectArch) {
      const arch = selectArch.value;
      if (arch === 'pro') maxCeiling = 94;
      else if (arch === 'good') maxCeiling = 89;
      else if (arch === 'avg') maxCeiling = 84;
      else if (arch === 'under_avg') maxCeiling = 79;
    }

    const calculatedOvr = Math.min(maxCeiling, Math.max(1, Math.round(ovr)));
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
    // Automatically randomize name when manually changing nationality
    const natSelect = document.getElementById('create-nationality');
    if (natSelect) {
      natSelect.addEventListener('change', (e) => {
        const selectedNat = e.target.value;
        let culturalCountry = selectedNat;
        if (window.leaguesEngine && typeof window.leaguesEngine.getCulturalCountry === 'function') {
          culturalCountry = window.leaguesEngine.getCulturalCountry(selectedNat);
        }
        if (window.NATIONAL_NAMES && window.NATIONAL_NAMES[culturalCountry]) {
          const firstNames = window.NATIONAL_NAMES[culturalCountry].first;
          const lastNames = window.NATIONAL_NAMES[culturalCountry].last;
          const randFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
          const randLast = lastNames[Math.floor(Math.random() * lastNames.length)];
          const nameInput = document.getElementById('create-name');
          if (nameInput) {
            nameInput.value = `${randFirst} ${randLast}`;
          }
        }
      });
    }
  }

  configureStartingTournamentQualification(profile, nationalTeam, startYear) {
    // A new career begins after the real-world qualification campaign for its chosen
    // starting tournament. Strong nations therefore arrive already qualified.
    const stars = nationalTeam?.stars || 0;
    const region = window.leaguesEngine.getNationRegion(profile.nationality);
    const inCycle = (baseYear, cycle) => ((startYear - baseYear) % cycle + cycle) % cycle === 0;

    let requiredStars = null;
    let tournamentName = null;
    if (inCycle(2026, 4)) {
      requiredStars = 4;
      tournamentName = 'World Cup';
    } else if (region === 'africa' && inCycle(2025, 2)) {
      requiredStars = 2;
      tournamentName = 'AFCON';
    } else if ((region === 'europe' || region === 'south_america' || region === 'world') && inCycle(2024, 4)) {
      requiredStars = 3;
      tournamentName = region === 'europe' ? 'Euro Cup' : 'Copa America';
    }

    if (requiredStars !== null) {
      window.leaguesEngine.nationalQualified = stars >= requiredStars;
      profile.startingTournamentQualification = {
        year: startYear,
        tournamentName,
        qualified: window.leaguesEngine.nationalQualified,
        requiredStars
      };
    } else {
      // No tournament is running in the selected opening year; qualification must be
      // earned through that season's scheduled qualifying matches.
      window.leaguesEngine.nationalQualified = false;
      profile.startingTournamentQualification = null;
    }
  }

  submitPlayerCreation() {
    const nameInput = document.getElementById('create-name');
    const rawName = (nameInput && nameInput.value) ? nameInput.value : "Jack Sterling";
    // Store plain text only: player names are rendered in HTML throughout the UI.
    const name = String(rawName).replace(/[<>&"'`]/g, '').trim().slice(0, 40) || "Jack Sterling";
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
    p.facialHairStyle = this.creationData.facialHairStyle || 'None';
    p.nationality = nationalityName;
    p.currentClubId = startingClubId;
    p.growthArchetype = document.getElementById('create-professionality').value;

    // Custom starting year!
    if (window.userCareer.stats && window.userCareer.stats.season) {
      window.userCareer.stats.season.year = this.creationData.startYear || 2026;
    }

    const natObj = window.leaguesEngine.nationalTeams.find(n => n.name === nationalityName);
    p.flag = natObj ? natObj.flag : "⚽";

    // Find club object and check if it's a Division 1 (Tier 1) team
    window.leaguesEngine.initLeague(leagueId);
    const currentClubObj = window.leaguesEngine.standings.find(c => c.clubId === startingClubId);
    if (currentClubObj) p.currentClubName = currentClubObj.name;

    // Update player starting club history with correct starting year and club name!
    if (window.userCareer.stats && window.userCareer.stats.career) {
      const startYear = this.creationData.startYear || 2026;
      window.userCareer.stats.career.clubHistory = [
        { club: p.currentClubName || "Plymouth Argyle 🇬🇧", yearStart: startYear, yearEnd: startYear, matches: 0, goals: 0 }
      ];
    }

    window.userCareer.calculateOvr();

    // Check for immediate National Team Call-up if starting OVR is high enough!
    const nat = window.leaguesEngine.nationalTeams.find(n => n.name === nationalityName);
    const stars = nat ? nat.stars : 3;
    let callUpThreshold = 79;
    if (stars === 1) callUpThreshold = 72;
    else if (stars === 2) callUpThreshold = 75;
    else if (stars === 3) callUpThreshold = 79;
    else if (stars === 4) callUpThreshold = 82;
    else if (stars === 5) callUpThreshold = 83; // dropped from 85 to 83 as requested!

    if (p.ovr >= callUpThreshold) {
      p.isNationalTeamCalledUp = true;
    } else {
      p.isNationalTeamCalledUp = false;
    }

    this.configureStartingTournamentQualification(
      p,
      nat,
      window.userCareer.stats?.season?.year || this.creationData.startYear || 2026
    );

    // Academy Rookie Rule for BOTH Division 1 and Division 2 clubs on game creation!
    const currentLeague = window.leaguesEngine.leagues[leagueId];
    const isDiv1 = currentLeague && currentLeague.tier === 1;
    const isDiv2 = currentLeague && currentLeague.tier === 2;
    let welcomeNotice = null;

    if (p.isNationalTeamCalledUp) {
      welcomeNotice = {
        title: "✉️ National Team Call-up!",
        body: `Incredible! Your starting ${p.ovr} OVR is high enough to immediately represent the <strong>${p.nationality} National Team</strong>! Get ready for international qualifiers and championships!`
      };
    }

    const clubStars = currentClubObj ? (currentClubObj.stars || 3) : 3;
    const div1Threshold = window.leaguesEngine.getStarterThreshold(clubStars);

    if (isDiv1 && p.ovr < div1Threshold) {
      p.weeklyWage = Math.round((Math.floor(Math.random() * 120001) + 100000) * (0.75 + clubStars * 0.12)); // 20,000 - 30,000 a week
      p.goalBonus = Math.round(p.weeklyWage * 1.25);
      p.assistBonus = Math.round(p.weeklyWage * 0.75);
      p.squadRole = "Bench Player";
      if (!welcomeNotice) {
        welcomeNotice = {
          title: "⚽ ACADEMY BENCH ROOKIE",
          body: `You joined the Division 1 club <strong>${p.currentClubName}</strong>, but because your OVR is under ${div1Threshold}, you start on the bench! Your starting bench wage is <strong>$${p.weeklyWage.toLocaleString()}/wk</strong>. Train hard to reach <strong>${div1Threshold}+ OVR</strong> and promote to the starting lineup with massive salaries!`
        };
      }
    } else if (isDiv2 && p.ovr < 72) {
      p.weeklyWage = Math.round((Math.floor(Math.random() * 14000) + 1000) * (0.75 + clubStars * 0.12)); // 2,000 - 7,000 a week
      p.goalBonus = Math.round(p.weeklyWage * 1.25);
      p.assistBonus = Math.round(p.weeklyWage * 0.75);
      p.squadRole = "Bench Player";
      if (!welcomeNotice) {
        welcomeNotice = {
          title: "⚽ DIVISION 2 BENCH ROOKIE",
          body: `You joined the Division 2 club <strong>${p.currentClubName}</strong>, but because your OVR is under 72, you start on the bench! Your starting bench wage is <strong>$${p.weeklyWage.toLocaleString()}/wk</strong>. Train hard to reach <strong>72+ OVR</strong> to earn your starting spot and a Division 2 starting salary!`
        };
      }
    } else {
      p.squadRole = "First Team Regular";
      if (isDiv2) {
        // Division 2 main player starts with 15,000 - 24,000 a week!
        p.weeklyWage = Math.round((Math.floor(Math.random() * 45000) + 10000) * (0.75 + clubStars * 0.12));
      } else {
        // Division 1 starting main player starts with 50,000 - 100,000 a week!
        p.weeklyWage = Math.round((Math.floor(Math.random() * 180001) + 160000) * (0.75 + clubStars * 0.12));
      }
      p.goalBonus = Math.round(p.weeklyWage * 1.25);
      p.assistBonus = Math.round(p.weeklyWage * 0.75);
    }

    window.leaguesEngine.buildSeasonSchedule(p);

    // Clear the squads dropdown to force rebuild with new league clubs
    const selectTeam = document.getElementById('squad-team-select');
    if (selectTeam) selectTeam.innerHTML = '';

    // Hide the start menu and show app container now that player creation is successful!
    const menu = document.getElementById('main-menu');
    if (menu) menu.classList.add('hidden');
    const appContainer = document.getElementById('app-container');
    if (appContainer) appContainer.style.display = '';

    this.closeModal('modal-creation');
    this.saveCareer(false);
    this.switchTab('dashboard');

    if (welcomeNotice) {
      setTimeout(() => {
        this.showGameNotice(welcomeNotice.title, welcomeNotice.body);
      }, 1200);
    }
  }

  socialPlayerBaseline(pl) {
    const hash = [...String(pl.id || pl.name)].reduce((sum, char) => ((sum * 31) + char.charCodeAt(0)) >>> 0, 7);
    const nation = String(pl.nationality || '');
    const major = ['England','France','Germany','Spain','Italy','Brazil','Argentina','Portugal','Netherlands','USA','Mexico'];
    const medium = ['Belgium','Croatia','Uruguay','Colombia','Turkey','Japan','South Korea','Morocco','Nigeria','Egypt','Poland','Denmark','Norway','Sweden'];
    const nationFactor = major.includes(nation) ? 1 : (medium.includes(nation) ? 0.62 : 0.20);
    const ovrFactor = Math.pow(Math.max(0, (pl.ovr || 70) - 55) / 40, 3);
    const uniqueness = 0.72 + (hash % 57) / 100; // breaks ties and creates large ranking gaps
    return Math.round(430000000 * ovrFactor * nationFactor * uniqueness);
  }

  getSocial() {
    const p = window.userCareer.profile;
    if (!p.social) p.social = { ready:false, displayName:'', handle:'', followers:10000, posts:0, likes:0, postsAvailable:2, lastClubId:null };
    return p.social;
  }

  setupSocial() {
    const d=document.getElementById('social-display')?.value.trim(); const h=document.getElementById('social-handle')?.value.trim().replace(/^@/,'');
    if(!d || !h) return; const social=this.getSocial(); social.ready=true; social.displayName=d.slice(0,30); social.handle='@'+h.replace(/[^a-zA-Z0-9_.]/g,'').slice(0,25); this.saveCareer(false); this.refreshUI();
  }

  socialPost() {
    const p=window.userCareer.profile, x=this.getSocial(); if(!x.ready||x.postsAvailable<=0)return;
    const lg=window.leaguesEngine.getLeagueMeta(); const tier=lg?.tier===1?1:0.28; const stars=lg?.clubs?.find(c=>c.id===p.currentClubId)?.stars||2;
    const luck=.25+Math.random()*2.4; const reach=Math.max(1,x.followers/10000);
    // Engagement scales with your audience: big accounts always get a meaningful
    // minimum response instead of occasionally gaining only a few thousand.
    //   likes:     1.2% - 4.0% of followers (minimum floor, scaled by tier/luck)
    //   followers: 0.15% - 0.65% of followers gained per post
    const likes=Math.round(Math.max(x.followers*0.012, (x.followers*0.012+Math.random()*x.followers*0.028)*tier*luck*Math.pow(reach,.42)));
    const gained=Math.round(Math.max(x.followers*0.0015, (x.followers*0.0015+Math.random()*x.followers*0.005)*tier*luck*Math.pow(reach,.30)));
    x.posts++;x.likes+=likes;x.followers+=gained;x.postsAvailable--;this.saveCareer(false);this.showGameNotice('📱 Post Published!',`<p><strong>+${likes.toLocaleString()} likes</strong><br><strong>+${gained.toLocaleString()} followers</strong></p>`);this.refreshUI();
  }

  _hash(str) {
    let h = 7;
    for (let i = 0; i < String(str).length; i++) h = ((h * 31) + String(str).charCodeAt(i)) >>> 0;
    return h;
  }

  ensureSocialTopList() {
    const p = window.userCareer?.profile;
    const x = this.getSocial();
    if (!p || !x || !window.leaguesEngine?.clubSquads) return;
    if (p.socialTopInitialized) return; // only build the celebrity world once per season

    // Per-career random seed → the celebrity list is different in every save.
    if (!p.socialSeed) p.socialSeed = Math.floor(Math.random() * 1000000) + 1;
    const seedStr = String(p.socialSeed);

    // Candidate pool: unique outfield players (club squads take priority over national dupes)
    const unique = new Map();
    Object.entries(window.leaguesEngine.clubSquads || {}).forEach(([clubId, sq]) => {
      (sq || []).forEach(pl => {
        if (pl.position === 'GK') return;
        const key = pl.id || `${pl.name}-${pl.age}-${pl.position}`;
        const existing = unique.get(key);
        if (!existing || (!clubId.startsWith('nat_') && existing.clubId.startsWith('nat_'))) unique.set(key, { ...pl, clubId });
      });
    });
    const candidates = [...unique.values()];
    if (candidates.length === 0) return;

    // Deterministic per-seed ordering, then take the 80 highest-OVR candidates.
    candidates.sort((a, b) => (this._hash(seedStr + '|' + a.name) - this._hash(seedStr + '|' + b.name)));
    const pool = [...candidates].sort((a, b) => b.ovr - a.ovr).slice(0, 80);
    pool.sort((a, b) => this._hash(seedStr + '|' + a.name) - this._hash(seedStr + '|' + b.name));

    // Celebrity curve: #1 lands between ~250M and ~600M (randomized per save),
    // then drops 15%, 12%, 10%, easing from 7% toward 2% down to ~20-60M at #50.
    let previous = 250000000 + (this._hash(seedStr + '|top') % 350000001);
    const top50Ids = new Set();
    pool.slice(0, 50).forEach((pl, index) => {
      if (index === 0) {
        pl.socialFollowers = previous;
      } else {
        const multiplier = index === 1 ? 0.85 : (index === 2 ? 0.88 : (index === 3 ? 0.90 : 0.93 + ((index - 4) / 45) * 0.05));
        previous = Math.round(previous * multiplier);
        pl.socialFollowers = previous;
      }
      top50Ids.add(pl.id || pl.name);
      const source = window.leaguesEngine.clubSquads?.[pl.clubId]?.find(candidate => candidate.id === pl.id);
      if (source) source.socialFollowers = pl.socialFollowers;
    });

    // EVERYONE outside the top 50 is capped to a modest 1M-9M baseline (even on
    // old saves that carried inflated values) so the ranking is meaningful — a
    // player with 78M followers must rank in the 20s, not 500th.
    candidates.forEach(pl => {
      if (top50Ids.has(pl.id || pl.name)) return;
      const cap = 1000000 + (this._hash(seedStr + '|' + pl.name) % 8000000);
      const baseline = this.socialPlayerBaseline(pl);
      const value = Math.min(Math.max(pl.socialFollowers || 0, 5000), Math.min(baseline, cap));
      pl.socialFollowers = Math.round(value);
      const source = window.leaguesEngine.clubSquads?.[pl.clubId]?.find(candidate => candidate.id === pl.id);
      if (source) source.socialFollowers = pl.socialFollowers;
    });

    p.socialTopInitialized = true;
    this.saveCareer(false);
  }

  updateSocialAfterMatch(goals, assists, won, compKey, roleActions=0) {
    const p=window.userCareer.profile,x=this.getSocial(); x.postsAvailable=2;
    const lg=window.leaguesEngine.getLeagueMeta(); const club=lg?.clubs?.find(c=>c.id===p.currentClubId); if(x.lastClubId!==p.currentClubId && lg?.tier===1){x.followers+=100000+((club?.stars||0)>=5?100000:0);x.lastClubId=p.currentClubId;}
    const trophyFollowers={league_d1:5000000,league_d2:2000000,cup:7000000,continental:20000000,euros_copas:25000000,world_cup:50000000,ballon_dor:60000000,golden_boot:15000000};
    x.trophyAwards=x.trophyAwards||{}; Object.entries(trophyFollowers).forEach(([key,value])=>{const count=p.trophies?.[key]||0;const paid=x.trophyAwards[key]||0;if(count>paid){for(let i=paid;i<count;i++) x.followers += Math.round(value / (1 + i * 1.4)); x.trophyAwards[key]=count;}});
    const boost=Math.round((won?2500:0)+goals*7000+assists*3000+(goals>=3?50000:0)+roleActions*300+(compKey.includes('ucl')?goals*12000:0)); x.followers+=boost;
    // AI players: newcomers get a modest baseline; established stars get a
    // meaningful matchday swing (thousands to millions depending on fame) so the
    // leaderboard actually moves after every matchday.
    Object.values(window.leaguesEngine.clubSquads||{}).forEach(sq=>sq.forEach(pl=>{
      const current = pl.socialFollowers || 0;
      if (current < 1000000) {
        // New/unknown player: initialize to a modest baseline (never a celebrity count)
        pl.socialFollowers = Math.round(Math.min(this.socialPlayerBaseline(pl), 1000000 + (this._hash((pl.id||pl.name)+'init') % 8000000)));
      } else if (current >= 10000000) {
        // Celebrity: swings by thousands-to-millions each matchday, scaled by fame
        const fame = Math.min(1, current / 400000000);
        const delta = Math.round((Math.random() - 0.44) * (25000 + 4000000 * fame) * (0.5 + (pl.ovr || 70) / 100));
        pl.socialFollowers = Math.max(1000000, current + delta);
      } else {
        // Mid-tier: modest but visible movement
        const delta = Math.round((Math.random() - 0.44) * 22000 * (0.5 + (pl.ovr || 70) / 100));
        pl.socialFollowers = Math.max(50000, current + delta);
      }
    }));
  }

  renderSocial() {
    const box=document.getElementById('social-content');if(!box)return; const x=this.getSocial(),p=window.userCareer.profile;
    if(!x.ready){box.innerHTML=`<div style="max-width:450px;margin:auto;display:grid;gap:12px"><h3>Create your account</h3><input id="social-display" class="form-input" placeholder="Display name"><input id="social-handle" class="form-input" placeholder="@ username"><button class="btn btn-primary" onclick="app.setupSocial()">Create Account</button></div>`;return;}
    // Build the celebrity world once per season (per-career random seed). Rendering
    // afterwards never recomputes follower counts — it only reads the live values
    // that matches/posts have moved, so the list actually changes over time.
    this.ensureSocialTopList();
    const unique=new Map();Object.entries(window.leaguesEngine.clubSquads||{}).forEach(([clubId,sq])=>sq.forEach(pl=>{const key=pl.id||`${pl.name}-${pl.age}-${pl.position}`;const candidate={...pl,clubId,followers:pl.socialFollowers||0};const existing=unique.get(key);if(!existing||(!clubId.startsWith('nat_')&&existing.clubId.startsWith('nat_')))unique.set(key,candidate);}));
    const players=[...unique.values()].sort((a,b)=>b.followers-a.followers);
    // Rank is computed against the real world: celebrities at the top (hundreds
    // of millions) and everyone else capped well below, so your rank is accurate.
    const rank=players.filter(pl=>pl.followers>x.followers).length+1;const top=players.slice(0,50);
    box.innerHTML=`<div class="glass-panel" style="margin-bottom:16px"><h2>${x.displayName} <span style="color:var(--primary)">${x.handle}</span></h2><div style="display:flex;gap:20px;flex-wrap:wrap"><b>👥 ${x.followers.toLocaleString()} Followers</b><b>📝 ${x.posts} Posts</b><b>❤️ ${x.likes.toLocaleString()} Likes</b><b>Posts available: ${x.postsAvailable}/2</b></div><button class="btn btn-primary" style="margin-top:12px" onclick="app.socialPost()" ${x.postsAvailable<=0?'disabled':''}>Create Post</button></div><h3>🌍 Most Followed Footballers</h3><div class="table-wrapper"><table class="data-table"><thead><tr><th>#</th><th>Player</th><th>Club</th><th>Followers</th></tr></thead><tbody>${top.map((pl,i)=>`<tr><td>${i+1}</td><td>${window.leaguesEngine.getCountryFlagHtml(pl.nationality, 18)} ${pl.name}</td><td>${window.leaguesEngine.findClubById(pl.clubId)?.name||'National Team'}</td><td>${(pl.followers||0).toLocaleString()}</td></tr>`).join('')}<tr style="background:rgba(0,255,136,.08)"><td>${rank}</td><td>⭐ ${window.leaguesEngine.getCountryFlagHtml(p.nationality, 18)} ${p.name} (You)</td><td>${p.currentClubName}</td><td>${x.followers.toLocaleString()}</td></tr></tbody></table></div>`;
  }

  sponsorCatalog() {
    const roots = ['Adidaz','Nice','Pumah','Coca-Kola','PepsiCoa','Samsing','Appel','Microhard','Googel','Amazoom','Toyoda','Hondar','Sonni','Nintondo','PlayStasion','Uberr','Lyftt','Starbux','McDonnels','Burger Prince','Red Bison','Monstra','Rolexx','Guccy','Praddi','Legoz','Ikeea','Spotifyy','Tessla','Netflicks'];
    const divisions = ['Sport','Elite','Global','Pro','Prime'];
    return roots.flatMap(root => divisions.map((division, index) => ({ id: `${root}-${index}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name: `${root} ${division}`, tier: index })));
  }

  generateSponsorOffers() {
    const p = window.userCareer.profile;
    if (!p.sponsorship) p.sponsorship = { offers: [], active: null, season: null, firstMatchSeen: false };
    const catalog = [...this.sponsorCatalog()].sort(() => Math.random() - 0.5).slice(0, 10);
    const reputation = Math.max(0, (p.ovr - 65) * 0.012 + (window.userCareer.stats.season.goals || 0) * 0.01 + Math.log10(Math.max(1, this.getSocial().followers / 10000)) * 0.10);
    p.sponsorship.offers = catalog.map(company => {
      const base = 90000 + company.tier * 23000 + Math.floor(Math.random() * 26000);
      return { ...company, weeklyWage: Math.round(base * (1 + reputation)), years: 1 + Math.floor(Math.random() * 3), multiplier: 1 };
    });
    p.sponsorship.season = window.userCareer.stats.season.year;
  }

  updateSponsorOffersAfterMatch(goals, rating, won, roleActions = 0) {
    const p = window.userCareer.profile;
    if (!p.sponsorship) p.sponsorship = { offers: [], active: null, season: null, firstMatchSeen: false };
    if (!p.sponsorship.firstMatchSeen && !p.sponsorship.active) {
      p.sponsorship.firstMatchSeen = true;
      this.generateSponsorOffers();
      return;
    }
    if (p.sponsorship.active) return;
    const change = (!won && goals === 0) ? -0.25 : Math.min(0.18, (won ? 0.05 : 0) + goals * 0.04 + (goals >= 3 ? 0.08 : 0) + roleActions * 0.003 + Math.max(0, rating - 7) * 0.02);
    p.sponsorship.offers.forEach(offer => offer.weeklyWage = Math.max(25000, Math.round(offer.weeklyWage * (1 + change))));
  }

  openSponsorChange(id) {
    const offer = window.userCareer.profile.sponsorship?.offers?.find(o => o.id === id); if (!offer) return;
    this.showGameNotice('✍️ Change Sponsor Offer', `<div style="text-align:left;display:grid;gap:12px"><label>Weekly wage <input class="form-input" id="sponsor-new-wage" type="number" min="1" value="${offer.weeklyWage}"></label><label>Contract duration <select class="form-select" id="sponsor-new-years"><option value="1">1 season</option><option value="2">2 seasons</option><option value="3">3 seasons</option><option value="4">4 seasons</option><option value="5">5 seasons</option></select></label><button class="btn btn-primary" onclick="app.submitSponsorChange('${id}')">Send Changed Offer</button></div>`);
  }

  submitSponsorChange(id) { const wage = Number(document.getElementById('sponsor-new-wage')?.value); const years = Number(document.getElementById('sponsor-new-years')?.value); const offer=window.userCareer.profile.sponsorship?.offers?.find(o=>o.id===id); if(offer && years) offer.years=years; this.closeGameNotice(); this.acceptSponsor(id, wage); }

  acceptSponsor(id, requestedWage = null) {
    const p = window.userCareer.profile; const offer = p.sponsorship?.offers?.find(o => o.id === id); if (!offer) return;
    if (requestedWage && requestedWage > offer.weeklyWage) {
      const increase = (requestedWage / offer.weeklyWage) - 1;
      const chance = Math.max(0.08, 0.82 - increase * 1.6);
      if (Math.random() > chance) { p.sponsorship.offers = p.sponsorship.offers.filter(o => o.id !== id); this.showGameNotice('❌ Negotiation Declined', `${offer.name} rejected the requested raise and withdrew for this season.`); this.refreshUI(); return; }
      offer.weeklyWage = Math.round(requestedWage);
    }
    p.sponsorship.active = { ...offer, seasonsLeft: offer.years };
    p.sponsorship.offers = [];
    this.saveCareer(false); this.showGameNotice('🤝 Sponsorship Signed!', `<p>You signed with <strong>${offer.name}</strong> for <strong>$${offer.weeklyWage.toLocaleString()}/week</strong> for ${offer.years} season(s).</p>`); this.refreshUI();
  }

  renderSponsors() {
    const box = document.getElementById('sponsors-content'); if (!box) return;
    const sp = window.userCareer.profile.sponsorship;
    if (!sp || !sp.firstMatchSeen) { box.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:28px;">Complete your first match to receive sponsorship offers.</p>'; return; }
    if (sp.active) { const a=sp.active; box.innerHTML=`<div class="glass-panel" style="border-color:var(--primary);text-align:center"><h2>✅ ${a.name}</h2><div style="font-size:28px;color:var(--primary);font-weight:900">$${a.weeklyWage.toLocaleString()} / week</div><p>${a.seasonsLeft} season(s) remaining</p><button class="btn btn-secondary" onclick="app.cancelSponsor()">End Early — Pay $${(a.weeklyWage*40).toLocaleString()}</button></div>`; return; }
    box.innerHTML=sp.offers.map(o=>`<div class="glass-panel" style="margin-bottom:12px"><b style="font-size:18px">${o.name}</b><div>$${o.weeklyWage.toLocaleString()}/week • ${o.years} season(s)</div><div style="margin-top:8px"><button class="btn btn-primary" onclick="app.acceptSponsor('${o.id}')">Accept</button> <button class="btn btn-secondary" onclick="app.openSponsorChange('${o.id}')">Change Offer</button></div></div>`).join('');
  }

  cancelSponsor() { const p=window.userCareer.profile; const a=p.sponsorship?.active; if(!a || p.bankBalance<a.weeklyWage*40) return this.showGameNotice('⚠️ Cannot End Contract','You need the 25-week penalty in your bank balance.'); p.bankBalance-=a.weeklyWage*40; p.sponsorship.active=null; this.generateSponsorOffers(); this.saveCareer(false); this.refreshUI(); }

  // ===================== RENDERING =====================

  refreshUI() {
    // Render immediately for buttons/actions, then once more after the browser has painted.
    // The second pass prevents hidden initial dashboard markup from surviving a new-game or
    // simulation state change on a freshly refreshed page.
    this.renderAll();
    if (this._refreshQueued) return;
    this._refreshQueued = true;
    const renderAfterPaint = () => {
      this._refreshQueued = false;
      this.renderAll();
    };
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(renderAfterPaint);
    else setTimeout(renderAfterPaint, 0);
  }

  renderAll() {
    const runRenderer = (name, fn) => {
      try {
        fn.call(this);
      } catch (e) {
        console.error(`Render error in ${name}:`, e);
      }
    };

    runRenderer("renderHeaderMeta", this.renderHeaderMeta);
    runRenderer("renderFifaCard", this.renderFifaCard);
    runRenderer("renderNextMatchBanner", this.renderNextMatchBanner);
    runRenderer("renderGamesSchedule", this.renderGamesSchedule);
    runRenderer("renderStandings", this.renderStandings);
    runRenderer("renderSquad", this.renderSquad);
    runRenderer("renderTransfers", this.renderTransfers);
    runRenderer("renderSponsors", this.renderSponsors);
    runRenderer("renderSocial", this.renderSocial);
    runRenderer("renderAttributes", this.renderAttributes);
    runRenderer("renderStats", this.renderStats);
    runRenderer("renderTrophies", this.renderTrophies);
    runRenderer("renderComparison", this.renderComparison);
    runRenderer("renderTraining", this.renderTraining);
    runRenderer("renderMultipliers", this.renderMultipliers);
    runRenderer("renderBallon", this.renderBallon);
    runRenderer("syncCheatModeUI", this.syncCheatModeUI);
    runRenderer("renderPastSeasons", this.renderPastSeasons);
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
    if (clubEl) {
      if (p.squadRole === "Bench Player") {
        clubEl.innerText = `${p.currentClubName} (bench)`;
      } else {
        clubEl.innerText = p.currentClubName;
      }
    }
    if (bankEl) bankEl.innerText = `$${p.bankBalance.toLocaleString()}`;

    // Update the Blue Level Bar
    const lvlCircle = document.getElementById('level-circle');
    const xpInner = document.getElementById('xp-bar-inner');
    const xpText = document.getElementById('xp-bar-text');
    
    if (lvlCircle) lvlCircle.innerText = p.level !== undefined ? p.level : 0;
    if (xpText) xpText.innerText = `${p.xp || 0} / ${p.xpToNextLevel || 1000} XP`;
    if (xpInner) {
      const pct = Math.min(100, Math.max(0, ((p.xp || 0) / (p.xpToNextLevel || 1000)) * 100));
      xpInner.style.width = `${pct}%`;
    }
  }

  renderFifaCard() {
    const p = window.userCareer.profile;
    const a = p.attributes;

    // Swap between Gold and Silver player card dynamically based on player OVR (<80 is silver, >=80 is gold!)
    const cardEl = document.querySelector('.fifa-card');
    if (cardEl) {
      if (p.ovr < 80) {
        cardEl.className = 'fifa-card silver-rare';
      } else {
        cardEl.className = 'fifa-card gold-rare';
      }
    }

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
    const allMatches = window.leaguesEngine.seasonSchedule || [];

    if (!allMatches || allMatches.length === 0) {
      container.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 24px 0;">No matches scheduled right now.</p>`;
      return;
    }

    const matchesHtml = allMatches.map((g, idx) => {
      const homeName = g.displayHomeName || g.home?.name || 'Home';
      const awayName = g.displayAwayName || g.away?.name || 'Away';
      const subtitle = [g.competitionName, g.stageLabel, g.matchLabel].filter(Boolean).join(' \u2022 ');
      const isActive = window.leaguesEngine.activeMatchId === g.id;
      const actionLabel = isActive ? 'Selected Next Match' : 'Set as Next Match';
      
      // Determine score color based on match outcome for the player's team (Green for win, Red for loss, Orange for draw)
      let scoreColor = 'var(--primary)'; // Default
      if (g.played) {
        const isNational = g.competitionKey.startsWith('national_');
        const userIsHome = isNational ? (g.displayHomeName === p.nationality) : (g.userSide === 'home');
        const uGoals = userIsHome ? g.homeScore : g.awayScore;
        const oGoals = userIsHome ? g.awayScore : g.homeScore;
        
        if (uGoals > oGoals) {
          scoreColor = '#00ff88'; // WIN: GREEN!
        } else if (uGoals < oGoals) {
          scoreColor = '#ef4444'; // LOSS: RED!
        } else {
          scoreColor = '#ff9f00'; // DRAW: ORANGE!
        }
      }

      return `
        <div class="glass-panel" style="margin-bottom: 14px; border: 1px solid ${isActive ? 'rgba(0, 255, 136, 0.45)' : 'rgba(255,255,255,0.08)'}; background: ${isActive ? 'rgba(0, 255, 136, 0.03)' : 'rgba(255,255,255,0.01)'}; transition: border 0.2s;">
          <div style="display:flex; justify-content:space-between; gap: 14px; align-items:center; flex-wrap: wrap;">
            <div style="flex: 1 1 320px;">
              <div style="font-size: 11px; color: var(--accent-gold); font-weight: 900; letter-spacing: 0.6px; text-transform: uppercase; margin-bottom: 4px;">${subtitle}</div>
              <div style="font-size: 18px; font-weight: 900;">${homeName} vs ${awayName}</div>
              <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Week ${g.week || (idx + 1)} \u2022 ${g.matchContext || 'Fixture'}</div>
            </div>
            <div style="text-align:right; min-width: 150px; display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
              <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Status</div>
              <div style="font-size: 15px; font-weight: 900; color: ${g.played ? scoreColor : 'var(--primary)'};">
                ${g.played ? `${g.homeScore} - ${g.awayScore} (Full Time)` : 'Scheduled'}
              </div>
              ${isActive && !g.played ? `<span style="font-size: 11px; background: rgba(0, 255, 136, 0.15); color: #00ff88; padding: 5px 12px; border-radius: 12px; font-weight: 800; border: 1px solid rgba(0, 255, 136, 0.3);">🔔 Next Match</span>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="glass-panel" style="margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.08);">
        <div style="display:flex; justify-content:space-between; gap: 14px; align-items:center; flex-wrap: wrap;">
          <div>
            <div style="font-size: 12px; color: var(--accent-gold); font-weight: 900; letter-spacing: 0.8px; text-transform: uppercase;">Full Calendar</div>
            <div style="font-size: 24px; font-weight: 900; margin-top: 4px;">🗓️ Season Match Schedule</div>
            <div style="font-size: 13px; color: var(--text-muted); margin-top: 6px;">
              Below is the complete chronological list of all matches (League, Champions League, Cup, and National) scheduled for your player this season. Set your desired next matchup.
            </div>
          </div>
          <div style="text-align:right; min-width: 140px;">
            <div style="font-size: 12px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Total Season Games</div>
            <div style="font-size: 24px; font-weight: 900; color: var(--primary);">${allMatches.length}</div><div style="font-size:12px;color:var(--accent-gold);margin-top:4px;">Remaining: ${allMatches.filter(g => !g.played).length}</div>
          </div>
        </div>
      </div>
      ${matchesHtml}
    `;
  }

  selectNextMatch(matchId) {
    window.leaguesEngine.setActiveMatch(matchId);
    this.activeMatchContext = null;
    this.renderNextMatchBanner();
    this.renderGamesSchedule();
    this.saveCareer(false);
  }

  populateStandingsSelect() {
    const select = document.getElementById('standings-competition-select');
    if (!select) return;

    const p = window.userCareer?.profile;
    const s = window.userCareer?.stats?.season;
    const year = s?.year || 2026;
    const region = window.leaguesEngine?.getNationRegion(p?.nationality);

    let html = `
      <option value="league" ${this.standingsSelectedCompetition === 'league' ? 'selected' : ''}>🏠 League Standings</option>
      <option value="cup" ${this.standingsSelectedCompetition === 'cup' ? 'selected' : ''}>🏆 Domestic Cup Group</option>
      <option value="ucl" ${this.standingsSelectedCompetition === 'ucl' ? 'selected' : ''}>🌍 Champions League Group</option>
    `;

    // Add World Cup if played this season
    const isWcYear = (year - 2030) % 4 === 0;
    if (isWcYear) {
      html += `<option value="national_wc" ${this.standingsSelectedCompetition === 'national_wc' ? 'selected' : ''}>🌍 FIFA World Cup</option>`;
    }

    // Add Continental Cup based on region if played this season
    let isContYear = false;
    let contLabel = "Continental Cup";
    if (region === 'europe') {
      isContYear = (year - 2028) % 4 === 0;
      contLabel = "🇪🇺 UEFA Euro Cup";
    } else if (region === 'south_america' || region === 'world') {
      isContYear = (year - 2028) % 4 === 0;
      contLabel = "🌎 Copa America";
    } else {
      isContYear = (year - 2027) % 2 === 0;
      contLabel = "🌍 AFCON Cup";
    }

    if (isContYear) {
      html += `<option value="national_cont" ${this.standingsSelectedCompetition === 'national_cont' ? 'selected' : ''}>${contLabel}</option>`;
    }

    select.innerHTML = html;
  }

  onStandingsCompetitionChange(val) {
    this.standingsSelectedCompetition = val;
    this.renderStandings();
  }

  renderStandings() {
    this.populateStandingsSelect();
    const select = document.getElementById('standings-competition-select');
    if (select && !this.standingsSelectedCompetition) {
      this.standingsSelectedCompetition = select.value || 'league';
    }
    const compKey = this.standingsSelectedCompetition || 'league';

    const tbody = document.getElementById('table-standings-body');
    if (!tbody) return;

    const userClubId = window.userCareer.profile.currentClubId;
    const userClub = window.leaguesEngine.standings.find(s => s.clubId === userClubId) || window.leaguesEngine.standings[0];

    let standings = [];

    if (compKey === 'league') {
      standings = window.leaguesEngine.standings;
    } else if (compKey === 'national_wc' || compKey === 'national_cont') {
      standings = window.leaguesEngine.natGroupStandings || [];
    } else if (compKey === 'cup') {
      // Simulate/Generate Cup Group Standings (4 Teams)
      const played = window.leaguesEngine.cupGroupPlayed || 0;
      const pts = window.leaguesEngine.cupGroupPoints || 0;
      const won = pts >= 6 ? 2 : (pts >= 3 ? 1 : 0);
      const drawn = pts === 4 || pts === 1 ? 1 : (pts === 2 ? 2 : (pts === 5 ? 2 : 0));
      const lost = played - won - drawn;

      // User team
      standings.push({
        clubId: userClubId,
        name: userClub.name,
        stars: userClub.stars,
        logo: userClub.logo,
        played: played, won: won, drawn: drawn, lost: lost,
        gd: won * 2 - lost * 2,
        points: pts
      });

      // Use the actual opponents drawn in this season's Cup Group calendar.
      const others = [];
      (window.leaguesEngine.seasonSchedule || []).filter(g => g.competitionKey === 'cup_qual').forEach(g => {
        const opponent = g.home?.clubId === userClubId ? g.away : g.home;
        if (opponent && !others.some(o => (o.clubId || o.id) === (opponent.clubId || opponent.id))) others.push(opponent);
      });
      if (!others.length) window.leaguesEngine.standings.filter(s => s.clubId !== userClubId).slice(0, 3).forEach(o => others.push(o));
      others.forEach((o, idx) => {
        // Deterministic points
        const oPts = idx === 0 ? (played * 2) : (idx === 1 ? Math.max(0, played - 1) : 0);
        const oWon = oPts >= 6 ? 2 : (oPts >= 3 ? 1 : 0);
        const oDrawn = oPts % 3;
        const oLost = played - oWon - oDrawn;
        standings.push({
          clubId: o.clubId,
          name: o.name,
          stars: o.stars,
          logo: o.logo,
          played: played, won: oWon, drawn: oDrawn, lost: oLost,
          gd: oWon * 1 - oLost * 2,
          points: oPts
        });
      });
    } else if (compKey === 'ucl') {
      // Simulate/Generate UCL Group Standings (4 Teams)
      const played = window.leaguesEngine.uclGroupPlayed || 0;
      const pts = window.leaguesEngine.uclGroupPoints || 0;
      const won = pts >= 6 ? 2 : (pts >= 3 ? 1 : 0);
      const drawn = pts % 3 === 1 ? 1 : (pts % 3 === 2 ? 2 : 0);
      const lost = played - won - drawn;

      // User team
      standings.push({
        clubId: userClubId,
        name: userClub.name,
        stars: userClub.stars,
        logo: userClub.logo,
        played: played, won: won, drawn: drawn, lost: lost,
        gd: won * 3 - lost * 2,
        points: pts
      });

      // Gather your actual 3 group opponents from the active season calendar schedule!
      const uclOpps = [];
      (window.leaguesEngine.seasonSchedule || []).forEach(g => {
        if (g.competitionKey === 'ucl' && g.stageLabel === 'Group Stage') {
          const homeId = g.home.clubId || g.home.id;
          const opp = (homeId === userClubId) ? g.away : g.home;
          if (opp && !uclOpps.some(o => (o.clubId || o.id) === (opp.clubId || opp.id))) {
            uclOpps.push(opp);
          }
        }
      });
      
      // Fallback if UCL group is not generated/spliced yet this season
      if (uclOpps.length === 0) {
        const pool = window.leaguesEngine.getTopClubsPool(userClubId);
        uclOpps.push(pool[0], pool[1], pool[2]);
      }

      uclOpps.forEach((o, idx) => {
        const oPts = idx === 0 ? (played * 3 - idx) : (idx === 1 ? Math.max(0, played * 2 - 1) : 1);
        const oWon = oPts >= 6 ? 2 : (oPts >= 3 ? 1 : 0);
        const oDrawn = oPts % 3;
        const oLost = played - oWon - oDrawn;
        const oName = o.name || o.clubName || "European Elite";
        
        standings.push({
          clubId: o.clubId || o.id,
          name: oName,
          stars: o.stars || 4,
          logo: o.logo || "⚽",
          played: played, won: oWon, drawn: oDrawn, lost: oLost,
          gd: oWon * 2 - oLost * 1,
          points: Math.max(0, oPts)
        });
      });
    }

    // Sort standings descending
    standings.sort((a, b) => b.points - a.points || b.gd - a.gd);

    tbody.innerHTML = standings.map((s, idx) => `
      <tr class="${s.clubId === userClubId || s.isUser ? 'user-team' : ''}">
        <td>#${idx + 1}</td>
        <td style="display: flex; align-items: center; gap: 10px;">${window.leaguesEngine.getClubBadgeHtml(s.name, 26)} <b>${s.name}</b> ${'★'.repeat(s.stars || 2)}</td>
        <td>${s.played}</td>
        <td>${s.won}</td>
        <td>${s.drawn}</td>
        <td>${s.lost}</td>
        <td>${s.gd > 0 ? '+' + s.gd : s.gd}</td>
        <td><strong>${s.points}</strong></td>
      </tr>
    `).join('');
  }

  onSquadCategoryChange(val) {
    this.squadCategory = val; // 'club' or 'national'
    
    const searchLabel = document.getElementById('squad-search-label');
    const searchInput = document.getElementById('squad-team-search');
    const statsSelect = document.getElementById('squad-stats-select');
    
    if (searchLabel) {
      searchLabel.innerText = val === 'national' ? "🔍 Select National Team:" : "🔍 Select Club Roster:";
    }
    if (searchInput) {
      searchInput.placeholder = val === 'national' ? "Type to filter countries..." : "Type to filter clubs...";
      searchInput.value = "";
    }
    
    // Repopulate stats select options
    if (statsSelect) {
      if (val === 'national') {
        statsSelect.innerHTML = `
          <option value="season" selected>Overall Season</option>
          <option value="national_world_cup">🌍 World Cup</option>
          <option value="national_euro">🏆 Continental Cup</option>
        `;
      } else {
        statsSelect.innerHTML = `
          <option value="season" selected>Overall Season</option>
          <option value="league">League</option>
          <option value="ucl">Champions League</option>
          <option value="cup">Domestic Cup</option>
        `;
      }
    }
    
    // Repopulate squad select dropdown and render
    this.populateSquadTeamSelect();
    this.renderSquad();
  }

  renderSquad() {
    const p = window.userCareer.profile;
    const s = window.userCareer.stats.season;
    
    // Populate dropdown once if empty
    const selectTeam = document.getElementById('squad-team-select');
    if (selectTeam && selectTeam.options.length === 0) {
      this.populateSquadTeamSelect();
      if (selectTeam) {
        selectTeam.value = this.squadCategory === 'national' ? `nat_${window.leaguesEngine.nationalTeams.find(n => n.name === p.nationality)?.id}` : p.currentClubId;
      }
    }

    const selectedClubId = selectTeam ? (selectTeam.value || p.currentClubId) : p.currentClubId;
    const isNational = this.squadCategory === 'national';

    const selectStats = document.getElementById('squad-stats-select');
    const viewKey = selectStats ? selectStats.value : 'season';
    const tbody = document.getElementById('table-squad-body');
    if (!tbody) return;

    // Check if selecting a national tournament not played this season!
    if (isNational && (viewKey === 'national_world_cup' || viewKey === 'national_euro')) {
      const year = s.year || 2026;
      const region = window.leaguesEngine?.getNationRegion(p.nationality);
      const remaining = window.leaguesEngine.getSeasonsRemaining(year, viewKey, region);
      
      if (remaining > 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--accent-gold);padding:40px;font-weight:700;">⏳ This event is available in ${remaining} seasons.</td></tr>`;
        return; // Lock and stop render!
      }
    }

    // Retrieve team from standings, global database or national pool
    let currentClub = null;
    if (isNational) {
      const countryObj = window.leaguesEngine.nationalTeams.find(n => `nat_${n.id}` === selectedClubId);
      if (countryObj) {
        currentClub = {
          clubId: `nat_${countryObj.id}`,
          name: countryObj.name,
          squad: this._getClubSquad(`nat_${countryObj.id}`) || []
        };
      }
    } else {
      const dbClub = window.leaguesEngine.standings.find(cl => cl.clubId === selectedClubId) || window.leaguesEngine.findClubById(selectedClubId);
      if (dbClub) {
        currentClub = {
          clubId: dbClub.clubId || dbClub.id,
          name: dbClub.name,
          squad: this._getClubSquad(dbClub.clubId || dbClub.id) || []
        };
      }
    }

    if (!currentClub) return;

    let rowsHtml = '';

    // If the selected team is the user's team/country, show the user at the very top!
    const isUserActiveRoster = isNational ? (currentClub.name === p.nationality) : (selectedClubId === p.currentClubId);
    if (isUserActiveRoster) {
      let userGoals = 0;
      let userAssists = 0;
      let userMatches = 0;
      if (viewKey === 'season') {
        userGoals = s.goals || 0;
        userAssists = s.assists || 0;
        userMatches = s.matches || 0;
      } else {
        userGoals = (s.compStats && s.compStats[viewKey] && s.compStats[viewKey].goals) || 0;
        userAssists = (s.compStats && s.compStats[viewKey] && s.compStats[viewKey].assists) || 0;
        userMatches = (s.compStats && s.compStats[viewKey] && s.compStats[viewKey].matches) || 0;
      }

      rowsHtml += `
        <tr style="background:rgba(0,255,136,0.06); font-weight:bold; border-left:3px solid var(--primary);">
          <td><strong style="color: var(--primary);">${p.position}</strong></td>
          <td>⭐ ${p.name} (You)</td>
          <td>OVR ${p.ovr}</td>
          <td>${p.age} y/o</td>
          <td style="text-align:center; font-weight:900; color:var(--accent-gold);">${userMatches}</td>
          <td style="text-align:center; font-weight:900; color:var(--primary);">${userGoals}</td>
          <td style="text-align:center; font-weight:900; color:var(--accent-blue);">${userAssists}</td>
          <td style="text-align:center; font-weight:900; color:var(--accent-gold);">${p.position === 'GK' ? (s.goalkeeperSaves || 0) : (['CB','LB','RB','CM'].includes(p.position) ? (s.defensiveActions || 0) : (['ST','LW','RW','CAM'].includes(p.position) ? (s.shotsOnGoal || 0) : '—'))}</td>
        </tr>
      `;
    }

    // Map other squad players
    const squadPlayers = currentClub.squad || [];
    const teammatesHtml = squadPlayers.map(tm => {
      let tmGoals = 0;
      let tmAssists = 0;
      let tmMatches = 0;
      if (tm.stats) {
        tmGoals = (tm.stats[viewKey] && tm.stats[viewKey].goals) || 0;
        tmAssists = (tm.stats[viewKey] && tm.stats[viewKey].assists) || 0;
        tmMatches = (tm.stats[viewKey] && tm.stats[viewKey].matches) || 0;
      }
      return `
        <tr>
          <td><strong style="color: var(--text-muted);">${tm.position}</strong></td>
          <td>${tm.name}</td>
          <td>OVR ${tm.ovr}</td>
          <td>${tm.age} y/o</td>
          <td style="text-align:center; font-weight:700; color:var(--accent-gold);">${tmMatches}</td>
          <td style="text-align:center; font-weight:700; color:var(--primary);">${tmGoals}</td>
          <td style="text-align:center; font-weight:700; color:var(--accent-blue);">${tmAssists}</td>
          <td style="text-align:center; font-weight:700; color:var(--accent-gold);">${tm.position === 'GK' ? (tm.goalkeeperSaves || 0) : (['CB','LB','RB','CM'].includes(tm.position) ? (tm.defensiveActions || 0) : (['ST','LW','RW','CAM'].includes(tm.position) ? (tm.shotsOnGoal || 0) : '—'))}</td>
        </tr>
      `;
    }).join('');

    tbody.innerHTML = rowsHtml + teammatesHtml;
  }

  renderTransfers() {
    const p = window.userCareer.profile;
    const season = window.userCareer.stats.season.year;
    if (this._contractOfferSeason !== season || !this._contractOffers || this._contractOffers.length === 0) {
      this._contractOffers = window.leaguesEngine.evaluateContractOffers(p.ovr, p.currentClubId);
      this._contractOfferSeason = season;
    }
    const offers = this._contractOffers;
    const container = document.getElementById('transfers-offers-list');
    if (!container) return;

    if (window.userCareer.pendingTransfer) {
      const t=window.userCareer.pendingTransfer;
      const tRoleBonus = ['CB','LB','RB','CM','GK'].includes(p.position) ? ` • ${p.position === 'GK' ? '🧤 +$${(t.roleBonus||5000).toLocaleString()}/save' : '🛡️ +$${(t.roleBonus||5000).toLocaleString()}/action'}` : '';
      container.innerHTML=`<div class="glass-panel" style="border-color:var(--primary);text-align:center"><div style="color:var(--primary);font-weight:900">✅ CONTRACT SIGNED</div><h2>${t.clubName}</h2><div>$${t.wage.toLocaleString()}/week • +$${t.goalBonus}/Goal • +$${t.assistBonus}/Assist${tRoleBonus}</div><div style="color:var(--text-muted);font-size:12px;margin-top:5px;">Role: ${t.squadRole || 'First Team Regular'}</div><p style="color:var(--text-muted)">This transfer becomes official next season.</p></div>`;
      return;
    }
    const currentRoleBonus = (p.roleBonus || 5000).toLocaleString();
    const currentContract = `<div class="glass-panel" style="margin-bottom:16px;border-color:var(--primary);"><div style="color:var(--primary);font-weight:900;font-size:12px;">CURRENT CLUB CONTRACT</div><h3 style="margin:6px 0;">${p.currentClubName}</h3><div>💰 $${p.weeklyWage.toLocaleString()}/week &nbsp; • &nbsp; ${p.position === 'GK' ? `🧤 +$${currentRoleBonus}/save` : (['CB','LB','RB','CM'].includes(p.position) ? `🛡️ +$${currentRoleBonus}/action` : `⚽ +$${p.goalBonus}/goal`)} &nbsp; • &nbsp; 🎯 +$${p.assistBonus}/assist</div><div style="color:var(--text-muted);font-size:12px;margin-top:5px;">Role: ${p.squadRole || 'First Team Regular'}</div></div>`;
    if (offers.length === 0) {
      container.innerHTML = currentContract + `<p style="color: var(--text-muted);">No new contract offers available yet. Increase your OVR to attract top clubs!</p>`;
      return;
    }

    container.innerHTML = currentContract + offers.map(o => `
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
          <div style="font-size: 12px; color: var(--accent-gold);">${p.position === 'GK' ? `+$${(o.roleBonus||5000).toLocaleString()}/Save` : (['CB','LB','RB','CM'].includes(p.position) ? `+$${(o.roleBonus||5000).toLocaleString()}/Defensive Action` : `+$${o.goalBonus}/Goal`)} • +$${o.assistBonus}/Assist</div>
          <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 8px;">
            <button class="btn btn-secondary btn-sm" onclick="app.openContractChange('${o.clubId}')">✍️ Change Offer</button>
            <button class="btn btn-primary btn-sm" onclick="app.acceptContractOffer('${o.clubId}')">Sign Contract ✍️</button>
          </div>
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
      { key: 'physical', name: '💪 Physical & Stamina' },
      { key: 'positioning', name: '🎯 Attack Positioning' },
      { key: 'def_positioning', name: '🛡️ Def Positioning' },
      { key: 'diving', name: '🧤 Goalkeeper Diving' }
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

    // Hattricks Rendering (only for Striker (ST) or Wingers (RW, LW))
    const pos = p.position || "ST";
    const isAttacker = ['ST', 'RW', 'LW'].includes(pos);
    
    const elSeasonHattricksRow = document.getElementById('stat-season-hattricks-row');
    const elSeasonHattricks = document.getElementById('stat-season-hattricks');
    if (elSeasonHattricksRow) {
      elSeasonHattricksRow.style.display = isAttacker ? 'flex' : 'none';
    }
    if (elSeasonHattricks) {
      elSeasonHattricks.innerText = s.hattricks || 0;
    }
    const roleRow = document.getElementById('stat-season-role-row');
    const roleLabel = document.getElementById('stat-season-role-label');
    const roleValue = document.getElementById('stat-season-role-value');
    const isDefensiveRole = ['CB', 'LB', 'RB', 'CM'].includes(pos);
    const isGoalkeeper = pos === 'GK';
    if (roleRow) roleRow.style.display = (isDefensiveRole || isGoalkeeper) ? 'flex' : 'none';
    if (roleLabel) roleLabel.innerText = isGoalkeeper ? 'Goalkeeper Saves:' : 'Defensive Actions:';
    if (roleValue) roleValue.innerText = isGoalkeeper ? (s.goalkeeperSaves || 0) : (s.defensiveActions || 0);

    const elCareerAssists = document.getElementById('stat-career-assists');
    const elCareerHattricksBox = document.getElementById('stat-career-hattricks-box');
    const elCareerHattricks = document.getElementById('stat-career-hattricks');
    if (elCareerAssists) {
      elCareerAssists.innerText = c.totalAssists || 0;
    }
    if (elCareerHattricksBox) {
      elCareerHattricksBox.style.display = isAttacker ? 'block' : 'none';
    }
    if (elCareerHattricks) {
      elCareerHattricks.innerText = c.totalHattricks || 0;
    }
    const careerRoleBox = document.getElementById('stat-career-role-box');
    const careerRoleLabel = document.getElementById('stat-career-role-label');
    const careerRoleValue = document.getElementById('stat-career-role-value');
    if (careerRoleBox) careerRoleBox.style.display = (isDefensiveRole || isGoalkeeper) ? 'block' : 'none';
    if (careerRoleLabel) careerRoleLabel.innerText = isGoalkeeper ? 'CAREER GOALKEEPER SAVES' : 'CAREER DEFENSIVE ACTIONS';
    if (careerRoleValue) careerRoleValue.innerText = isGoalkeeper ? (p.goalkeeperSaves || 0) : (p.defensiveActions || 0);

    const ageBadge = document.getElementById('age-decay-warning');
    if (ageBadge) {
      // Dynamic age decay starting age based on professionality archetype
      const arch = p.growthArchetype || "pro";
      let decayAge = 34;
      if (arch === 'inhuman') decayAge = 38;
      else if (arch === 'goat') decayAge = 36;
      else if (arch === 'pro') decayAge = 34;
      else if (arch === 'good') decayAge = 33;
      else if (arch === 'avg') decayAge = 32;
      else if (arch === 'under_avg') decayAge = 31;

      ageBadge.style.display = (p.age >= decayAge) ? 'flex' : 'none';
      ageBadge.innerHTML = `⚠️ <strong>AGEING MECHANIC ACTIVE:</strong> Player is ${p.age} y/o (${arch.toUpperCase()} Level). Physical attributes (Pace, Physical) decay over time.`;
    }
  }

  renderTrophies() {
    const container = document.getElementById('trophy-cabinet-container');
    if (!container) return;

    const p = window.userCareer?.profile;
    const trophies = p?.trophies || {
      league_d1: 0,
      league_d2: 0,
      cup: 0,
      continental: 0,
      world_cup: 0,
      ballon_dor: 0,
      golden_boot: 0,
      national_cap: 0
    };

    const catalog = [
      {
        key: 'league_d1',
        title: 'Division 1 Champions 🏆',
        desc: 'Finish 1st in a top-flight professional division (e.g., Premier League, Süper Lig).',
        icon: '👑',
        color: '#ffd700'
      },
      {
        key: 'league_d2',
        title: 'Division 2 Champions 🏆',
        desc: 'Finish 1st in any second-tier starter league (e.g., EFL Championship, TFF 1. Lig).',
        icon: '🥈',
        color: '#c0c0c0'
      },
      {
        key: 'cup',
        title: 'Domestic Cup Winner 🥤',
        desc: 'Claim victory in your country\'s national knockout tournament.',
        icon: '🏆',
        color: '#b87333'
      },
      {
        key: 'continental',
        title: 'Champions League Winner 🌍',
        desc: 'Conquer Europe in the UEFA Champions League.',
        icon: '⭐',
        color: '#00d2ff'
      },
      {
        key: 'euros_copas',
        title: 'Continental Cup Winner 🏆',
        desc: 'Win the Euro Cup, Copa America, or AFCON with your National Team.',
        icon: '👑',
        color: '#a855f7'
      },
      {
        key: 'world_cup',
        title: 'World Cup Winner 🌎',
        desc: 'Lead your national team to ultimate glory in the International Championship.',
        icon: '⚜️',
        color: '#ff4500'
      },
      {
        key: 'ballon_dor',
        title: 'Ballon d\'Or Winner ⚽',
        desc: 'Be named the world\'s best player (OVR 85+ and exceptional season stats).',
        icon: '👑',
        color: '#ffaa00'
      },
      {
        key: 'golden_boot',
        title: 'Golden Boot Award 👟',
        desc: 'Finish as the top goal scorer in any league or cup competition.',
        icon: '⚡',
        color: '#ff7700'
      },
      {
        key: 'national_cap',
        title: 'International Cap 🧢',
        desc: 'Make your official debut for your National Team (unlocked via 80+ OVR and great form).',
        icon: '🛡️',
        color: '#00ff88'
      }
    ];

    let html = '';
    catalog.forEach(t => {
      const count = trophies[t.key] || 0;
      const unlocked = count > 0;

      html += `
        <div class="glass-panel" style="
          text-align: center; 
          padding: 24px 16px; 
          border-radius: 16px; 
          background: ${unlocked ? 'rgba(0, 255, 136, 0.05)' : 'rgba(255, 255, 255, 0.02)'};
          border: ${unlocked ? '1px solid ' + t.color : '1px solid rgba(255, 255, 255, 0.08)'};
          transition: transform 0.2s, box-shadow 0.2s;
          opacity: ${unlocked ? '1.0' : '0.45'};
        " onmouseover="this.style.transform='translateY(-5px) scale(1.02)'" onmouseout="this.style.transform='none'">
          <div style="
            font-size: 48px; 
            margin-bottom: 12px; 
            filter: ${unlocked ? 'drop-shadow(0 0 8px ' + t.color + ')' : 'grayscale(1)'};
          ">${t.icon}</div>
          <h4 style="font-size: 16px; font-weight: 800; color: ${unlocked ? '#fff' : '#94a3b8'}; margin-bottom: 6px;">
            ${t.title}
          </h4>
          <p style="font-size: 11px; color: var(--text-muted); line-height: 1.4; margin-bottom: 14px; min-height: 34px;">
            ${t.desc}
          </p>
          <div style="
            display: inline-block;
            background: ${unlocked ? t.color : 'rgba(255,255,255,0.1)'};
            color: ${unlocked ? '#000' : '#fff'};
            font-size: 11px;
            font-weight: 900;
            padding: 4px 12px;
            border-radius: 20px;
            text-transform: uppercase;
          ">
            ${unlocked ? `Unlocked (x${count})` : 'Locked'}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  onComparisonCompetitionChange(val) {
    this.comparisonSelectedCompetition = val;
    this.renderComparison();
  }

  renderComparison() {
    const select = document.getElementById('comparison-competition-select');
    if (select) {
      if (!this.comparisonSelectedCompetition) {
        this.comparisonSelectedCompetition = 'league';
      }
      select.value = this.comparisonSelectedCompetition;
    }
    const compKey = this.comparisonSelectedCompetition || 'league';

    const p = window.userCareer?.profile;
    if (!p) return;

    const s = window.userCareer.stats.season;
    const leaguePlayedCount = window.leaguesEngine?.standings?.[0]?.played || 0;
    const currentMatches = leaguePlayedCount;
    const seed = s.year || 2026;

    // Check if selecting a national tournament not played this season!
    const isWc = compKey === 'world_cup';
    const isCont = ['euro', 'copa', 'afcon'].includes(compKey);
    const region = window.leaguesEngine?.getNationRegion(p.nationality);

    if (isWc || isCont) {
      const remaining = window.leaguesEngine.getSeasonsRemaining(seed, compKey, region);
      if (remaining > 0) {
        const scorersBody = document.getElementById('table-scorers-body');
        const assistersBody = document.getElementById('table-assisters-body');
        const lockMsg = `<tr><td colspan="5" style="text-align:center;color:var(--accent-gold);padding:40px;font-weight:700;">⏳ This event is available in ${remaining} seasons.</td></tr>`;
        if (scorersBody) scorersBody.innerHTML = lockMsg;
        if (assistersBody) assistersBody.innerHTML = lockMsg;
        return; // Lock and stop render!
      }
    }

    // Helper map of league ID to cultural country and flag
    const leagueToCountry = {
      turkey_d1: "Turkey", turkey_d2: "Turkey",
      england_d1: "England", england_d2: "England",
      spain_d1: "Spain", spain_d2: "Spain",
      italy_d1: "Italy", italy_d2: "Italy",
      germany_d1: "Germany", germany_d2: "Germany",
      france_d1: "France", france_d2: "France",
      dutch_d1: "Netherlands", dutch_d2: "Netherlands",
      portugal_d1: "Portugal", portugal_d2: "Portugal",
      mls_d1: "USA", mls_d2: "USA",
      saudi_d1: "Egypt", saudi_d2: "Egypt",
      india_d1: "India",
      brazil_d1: "Brazil",
      argentina_d1: "Argentina",
      mexico_d1: "Mexico",
      japan_d1: "Japan",
      korea_d1: "South Korea",
      scotland_d1: "Scotland",
      belgium_d1: "Belgium",
      greece_d1: "Greece",
      norway_d1: "Norway"
    };

    const countryToFlag = {
      "Turkey": "🇹🇷", "England": "🇬🇧", "Spain": "🇪🇸", "Italy": "🇮🇹", "Germany": "🇩🇪",
      "France": "🇫🇷", "Netherlands": "🇳🇱", "Portugal": "🇵🇹", "USA": "🇺🇸", "Egypt": "🇪🇬",
      "India": "🇮🇳", "Brazil": "🇧🇷", "Argentina": "🇦🇷", "Mexico": "🇲🇽", "Japan": "🇯🇵",
      "South Korea": "🇰🇷", "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "Belgium": "🇧🇪", "Greece": "🇬🇷", "Norway": "🇳🇴"
    };

    const userClubId = p.currentClubId;
    const userLeagueId = window.leaguesEngine.findLeagueForClub(userClubId) || "turkey_d2";
    
    // Choose which clubs to show based on competition
    let clubs = [];
    if (compKey === 'world_cup') {
      clubs = window.leaguesEngine.getNationalPool();
    } else if (['euro', 'copa', 'afcon'].includes(compKey)) {
      const reg = compKey === 'euro' ? 'europe' : (compKey === 'copa' ? 'south_america' : 'africa');
      clubs = window.leaguesEngine.getNationalPool(null, reg);
    } else if (compKey === 'ucl' || compKey === 'season') {
      // Gather top European elite clubs + local standings
      clubs = [...window.leaguesEngine.standings];
      const topPool = window.leaguesEngine.getTopClubsPool() || [];
      topPool.forEach(tc => {
        if (!clubs.some(c => (c.clubId || c.id) === (tc.clubId || tc.id))) {
          clubs.push({ clubId: tc.clubId || tc.id, name: tc.name, logo: tc.logo || "⚽", ovr: tc.ovr });
        }
      });
    } else {
      // League and Cup are played among current league standing clubs
      clubs = window.leaguesEngine.standings;
    }

    const hashCode = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return Math.abs(hash);
    };

    const getPseudoRandom = (str, field, min, max) => {
      const hash = hashCode(str + field + seed + compKey);
      return min + (hash % (max - min + 1));
    };

    const scorersList = [];
    const assistersList = [];

    // Extract user stats for this specific competition key
    const compStats = s.compStats || {
      league: { goals: 0, assists: 0, matches: 0 },
      cup: { goals: 0, assists: 0, matches: 0 },
      ucl: { goals: 0, assists: 0, matches: 0 }
    };
    let activeCompStats = null;
    let userCompMatches = 0;

    if (compKey === 'season') {
      activeCompStats = { goals: s.goals || 0, assists: s.assists || 0 };
      userCompMatches = s.matches || 0;
    } else {
      activeCompStats = compStats[compKey] || { goals: 0, assists: 0, matches: 0 };
      userCompMatches = activeCompStats.matches || 0;
    }

    const userFlagHtml = window.leaguesEngine.getCountryFlagHtml(p.nationality || 'England', 18);
    scorersList.push({
      name: `⭐ ${p.name} ${userFlagHtml}`,
      club: p.currentClubName,
      matches: userCompMatches,
      val: activeCompStats.goals || 0,
      ovr: p.ovr,
      goals: activeCompStats.goals || 0,
      assists: activeCompStats.assists || 0,
      isUser: true
    });

    assistersList.push({
      name: `⭐ ${p.name} ${userFlagHtml}`,
      club: p.currentClubName,
      matches: userCompMatches,
      val: activeCompStats.assists || 0,
      ovr: p.ovr,
      goals: activeCompStats.goals || 0,
      assists: activeCompStats.assists || 0,
      isUser: true
    });

    // Populate unique players for other clubs
    clubs.forEach((c, idx) => {
      const isUserClub = c.clubId === userClubId;
      const clubSeedName = c.name || c.clubId || 'Club';
      
      // Determine country and flag dynamically for this club's actual league country!
      const clubLeagueId = window.leaguesEngine.findLeagueForClub(c.clubId || c.id) || userLeagueId;
      const country = leagueToCountry[clubLeagueId] || "Turkey";
      const flag = ['world_cup', 'euro', 'copa', 'afcon'].includes(compKey) ? (c.logo || "🌍") : (countryToFlag[country] || "🇹🇷");

      let squad = window.leaguesEngine.clubSquads[c.clubId || c.id];
      if (!squad || squad.length === 0) {
        squad = window.leaguesEngine.generateSquad(c.clubId || c.id, c.ovr || 75);
        window.leaguesEngine.clubSquads[c.clubId || c.id] = squad;
      }

      squad.forEach(pl => {
        // Skip user as we already pushed them at the top of the lists
        if (pl.name === p.name) return;

        const key = compKey.includes('cup') ? 'cup' : (compKey.includes('ucl') ? 'ucl' : 'league');
        const isNationalComp = ['world_cup', 'euro', 'copa', 'afcon'].includes(compKey);
        let goals = 0;
        let assists = 0;
        let compMatches = 0;

        // Knockout survival model: teams that exit in the group stage play only the
        // group games; teams that keep winning advance round by round, so only the
        // two finalists play the full 7-game cup / 7-game international tournament,
        // and only UCL finalists play all 10 UCL games. Survival odds grow with OVR.
        const eliminationMatches = (baseMatches) => {
          let matches = baseMatches;
          for (let r = 0; r < 4; r++) {
            const chance = Math.min(0.86, Math.max(0.20, 0.42 + (pl.ovr || 75) * 0.004 - 0.28 + getPseudoRandom(clubSeedName + pl.name, compKey + '_adv' + r, 0, 12) * 0.008));
            if (getPseudoRandom(clubSeedName + pl.name, compKey + '_survive' + r, 0, 99) / 100 < chance) matches++;
          }
          return Math.max(baseMatches, Math.min(baseMatches + 4, matches));
        };

        if (compKey === 'season') {
          compMatches = currentMatches;
          goals = (pl.stats?.season?.goals) || 0;
          assists = (pl.stats?.season?.assists) || 0;

          // Fallback to position-based pseudo-random estimation only if stats are completely 0
          if (goals === 0 && assists === 0) {
            const keys = ['league', 'cup', 'ucl'];
            keys.forEach(k => {
              let kMatches = currentMatches;
              if (k === 'cup') kMatches = eliminationMatches(3);
              else if (k === 'ucl') kMatches = eliminationMatches(6);
              
              const pos = pl.position || 'CM';
              const baseRate = pos === 'ST' ? 0.28 : (['LW', 'RW'].includes(pos) ? 0.22 : (pos === 'CAM' ? 0.14 : (pos === 'CM' ? 0.08 : 0.02)));
              const assistBase = ['CAM', 'CM'].includes(pos) ? 0.22 : (['LW', 'RW'].includes(pos) ? 0.16 : (pos === 'ST' ? 0.10 : 0.04));

              const kHash = hashCode(clubSeedName + pl.name + 'goals' + seed + k);
              const goalRate = baseRate + ((pl.ovr || 75) - 60) * 0.015 + (kHash % 11) * 0.01;
              goals += Math.max(0, Math.round(goalRate * kMatches));

              const kHashAssist = hashCode(clubSeedName + pl.name + 'assists' + seed + k);
              const assistRate = assistBase + ((pl.ovr || 75) - 60) * 0.010 + (kHashAssist % 11) * 0.01;
              assists += Math.max(0, Math.round(assistRate * kMatches));
            });
          }
        } else if (isNationalComp) {
          // World Cup / Euro / Copa / AFCON: 3 group games + up to 4 knockouts.
          compMatches = eliminationMatches(3);
        } else if (compKey === 'cup' || compKey === 'ucl') {
          // Domestic cup: 3 group games + up to 4 knockouts (3-7).
          // Champions League: 6 group games + up to 4 knockouts (6-10).
          compMatches = eliminationMatches(compKey === 'ucl' ? 6 : 3);

          goals = (pl.stats && pl.stats[key] && pl.stats[key].goals) || 0;
          assists = (pl.stats && pl.stats[key] && pl.stats[key].assists) || 0;

          // Fallback to position-based pseudo-random estimation only if stats are completely 0
          if (goals === 0 && assists === 0) {
            const pos = pl.position || 'CM';
            const baseRate = pos === 'ST' ? 0.28 : (['LW', 'RW'].includes(pos) ? 0.22 : (pos === 'CAM' ? 0.14 : (pos === 'CM' ? 0.08 : 0.02)));
            const assistBase = ['CAM', 'CM'].includes(pos) ? 0.22 : (['LW', 'RW'].includes(pos) ? 0.16 : (pos === 'ST' ? 0.10 : 0.04));

            const kHash = hashCode(clubSeedName + pl.name + 'goals' + seed + compKey);
            const goalRate = baseRate + ((pl.ovr || 75) - 60) * 0.015 + (kHash % 11) * 0.01;
            goals = Math.max(0, Math.round(goalRate * compMatches));

            const kHashAssist = hashCode(clubSeedName + pl.name + 'assists' + seed + compKey);
            const assistRate = assistBase + ((pl.ovr || 75) - 60) * 0.010 + (kHashAssist % 11) * 0.01;
            assists = Math.max(0, Math.round(assistRate * compMatches));
          }
        } else {
          // League: everyone plays the same number of league matchdays.
          compMatches = currentMatches;
          goals = (pl.stats && pl.stats[key] && pl.stats[key].goals) || 0;
          assists = (pl.stats && pl.stats[key] && pl.stats[key].assists) || 0;

          // Fallback to position-based pseudo-random estimation only if stats are completely 0
          if (goals === 0 && assists === 0) {
            const pos = pl.position || 'CM';
            const baseRate = pos === 'ST' ? 0.28 : (['LW', 'RW'].includes(pos) ? 0.22 : (pos === 'CAM' ? 0.14 : (pos === 'CM' ? 0.08 : 0.02)));
            const assistBase = ['CAM', 'CM'].includes(pos) ? 0.22 : (['LW', 'RW'].includes(pos) ? 0.16 : (pos === 'ST' ? 0.10 : 0.04));

            const kHash = hashCode(clubSeedName + pl.name + 'goals' + seed + compKey);
            const goalRate = baseRate + ((pl.ovr || 75) - 60) * 0.015 + (kHash % 11) * 0.01;
            goals = Math.max(0, Math.round(goalRate * compMatches));

            const kHashAssist = hashCode(clubSeedName + pl.name + 'assists' + seed + compKey);
            const assistRate = assistBase + ((pl.ovr || 75) - 60) * 0.010 + (kHashAssist % 11) * 0.01;
            assists = Math.max(0, Math.round(assistRate * compMatches));
          }
        }

        // Each player shows THEIR OWN games played: national tournaments use the
        // elimination count, cup/UCL use tracked stats when available (real games
        // for the user's teammates) otherwise the elimination count, and the season
        // view uses the player's own season appearances instead of the user's.
        let plMatches = compMatches;
        if (compKey === 'league') plMatches = currentMatches;
        else if (compKey === 'season') plMatches = (pl.stats?.season?.matches) || currentMatches;
        else if (!isNationalComp) plMatches = (pl.stats && (pl.stats[key]?.matches || 0)) || compMatches;
        const plFlag = pl.flag || flag;

        scorersList.push({
          name: `${c.logo || "⚽"} ${pl.name} ${plFlag}`,
          club: c.name,
          matches: plMatches,
          val: goals,
          ovr: pl.ovr || 75,
          goals: goals,
          assists: assists,
          isUser: false
        });

        assistersList.push({
          name: `${c.logo || "⚽"} ${pl.name} ${plFlag}`,
          club: c.name,
          matches: plMatches,
          val: assists,
          ovr: pl.ovr || 75,
          goals: goals,
          assists: assists,
          isUser: false
        });
      });
    });

    // 1st: Sort by primary stat (val), 2nd: Sort by OVR, 3rd: Sort by secondary stat
    scorersList.sort((a, b) => {
      if (b.val !== a.val) {
        return b.val - a.val; // First: Goals (val)
      }
      if (b.ovr !== a.ovr) {
        return b.ovr - a.ovr; // Second: OVR
      }
      return b.assists - a.assists; // Third: Assists
    });

    assistersList.sort((a, b) => {
      if (b.val !== a.val) {
        return b.val - a.val; // First: Assists (val)
      }
      if (b.ovr !== a.ovr) {
        return b.ovr - a.ovr; // Second: OVR
      }
      return b.goals - a.goals; // Third: Goals
    });

    const topScorers = scorersList.slice(0, 20);
    const topAssisters = assistersList.slice(0, 20);

    // Render Goals Table
    const scorersBody = document.getElementById('table-scorers-body');
    if (scorersBody) {
      if (currentMatches === 0) {
        scorersBody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:20px;">No games played yet this season! Complete your first matchday to initialize stats rankings.</td></tr>`;
      } else {
        scorersBody.innerHTML = topScorers.map((s, idx) => `
          <tr style="${s.isUser ? 'background:rgba(0,255,136,0.12);font-weight:bold;border-left:3px solid var(--primary);' : ''}">
            <td style="text-align:center;font-weight:900;">${idx + 1}</td>
            <td>${s.name}</td>
            <td style="color:var(--text-muted);">${s.club}</td>
            <td style="text-align:center;">${s.matches}</td>
            <td style="text-align:center;font-weight:900;color:var(--primary);">${s.val}</td>
          </tr>
        `).join('');
      }
    }

    // Render Assists Table
    const assistersBody = document.getElementById('table-assisters-body');
    if (assistersBody) {
      if (currentMatches === 0) {
        assistersBody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:20px;">No games played yet this season! Complete your first matchday to initialize stats rankings.</td></tr>`;
      } else {
        assistersBody.innerHTML = topAssisters.map((a, idx) => `
          <tr style="${a.isUser ? 'background:rgba(0,136,255,0.12);font-weight:bold;border-left:3px solid var(--accent-blue);' : ''}">
            <td style="text-align:center;font-weight:900;">${idx + 1}</td>
            <td>${a.name}</td>
            <td style="color:var(--text-muted);">${a.club}</td>
            <td style="text-align:center;">${a.matches}</td>
            <td style="text-align:center;font-weight:900;color:var(--accent-blue);">${a.val}</td>
          </tr>
        `).join('');
      }
    }
  }

  renderTraining() {
    const p = window.userCareer?.profile;
    if (!p) return;

    const hasTrained = p.hasTrainedThisMatchday || false;
    const statusPill = document.getElementById('training-status-pill');
    const lockedScreen = document.getElementById('training-locked-screen');
    const hubScreen = document.getElementById('training-hub-screen');
    const activeScreen = document.getElementById('training-active-screen');

    if (hasTrained) {
      if (statusPill) {
        statusPill.innerText = "Completed";
        statusPill.style.color = "var(--text-muted)";
      }
      if (lockedScreen) lockedScreen.style.display = "block";
      if (hubScreen) hubScreen.style.display = "none";
      if (activeScreen) activeScreen.style.display = "none";
    } else {
      if (statusPill) {
        statusPill.innerText = "Available";
        statusPill.style.color = "var(--accent-gold)";
      }
      if (lockedScreen) lockedScreen.style.display = "none";
      if (hubScreen) hubScreen.style.display = "block";
      if (activeScreen) activeScreen.style.display = "none";
    }
  }

  renderMultipliers() {
    const container = document.getElementById('multipliers-list-container');
    const totalEl = document.getElementById('val-total-multiplier');
    const b2 = document.getElementById('est-bench-d2');
    const s2 = document.getElementById('est-starter-d2');
    const b1 = document.getElementById('est-bench-d1');
    const s1 = document.getElementById('est-starter-d1');
    if (!container || !totalEl || !s1) return;

    const p = window.userCareer?.profile;
    if (!p) return;

    const mult = window.userCareer.getSalaryMultiplier();
    totalEl.innerText = `x${mult.toFixed(2)}`;
    
    if (b2) b2.innerText = `$${Math.round(4500 * mult).toLocaleString()} / week`;
    if (s2) s2.innerText = `$${Math.round(19500 * mult).toLocaleString()} / week`;
    if (b1) b1.innerText = `$${Math.round(25000 * mult).toLocaleString()} / week`;
    if (s1) s1.innerText = `$${Math.round(75000 * mult).toLocaleString()} / week`;

    // Displayed factors mirror PlayerCareer.getSalaryMultiplier() exactly so the
    // tab never lies about what each milestone actually gives.
    const list = [
      { name: "Reaching 80+ OVR 📈", factor: "x1.15", achieved: p.ovr >= 80, desc: "Upgrade attributes to reach 80 overall rating." },
      { name: "Reaching 85+ OVR 📈", factor: "x1.15", achieved: p.ovr >= 85, desc: "Upgrade attributes to reach 85 overall rating." },
      { name: "Reaching 90+ OVR 📈", factor: "x1.15", achieved: p.ovr >= 90, desc: "Upgrade attributes to reach 90 overall rating." },
      { name: "Champions League Winner 🌍", factor: "x1.25 per win", achieved: (p.trophies.continental || 0) > 0, count: p.trophies.continental || 0, desc: "Conquer Europe in the UEFA Champions League Final!" },
      { name: "World Cup Winner 🌎", factor: "x1.30 per win", achieved: (p.trophies.world_cup || 0) > 0, count: p.trophies.world_cup || 0, desc: "Lead your national team to ultimate World Cup glory!" },
      { name: "Ballon d'Or Winner 👑", factor: "x1.30 per win", achieved: (p.trophies.ballon_dor || 0) > 0, count: p.trophies.ballon_dor || 0, desc: "Be named the world's best player at the end of a season!" },
      { name: "Golden Boot Scorer 👟", factor: "x1.15 per win", achieved: (p.trophies.golden_boot || 0) > 0, count: p.trophies.golden_boot || 0, desc: "Finish as the top goal scorer in any league or cup competition." },
      { name: "Euro Cup / Copa America 🛡️", factor: "x1.25 per win", achieved: (p.trophies.euros_copas || 0) > 0, count: p.trophies.euros_copas || 0, desc: "Win the Euro Cup or Copa America with your national team." },
      { name: "National Team Call-Up 🧢", factor: "x1.20", achieved: p.isNationalTeamCalledUp || false, desc: "Reach your national call-up OVR threshold and get invited!" },
      { name: "Domestic Cup Winner 🏆", factor: "x1.25 per win", achieved: (p.trophies.cup || 0) > 0, count: p.trophies.cup || 0, desc: "Win your country's domestic cup knockout final." },
      { name: "League Title Champion 🏆", factor: "x1.15 per win", achieved: ((p.trophies.league_d1 || 0) + (p.trophies.league_d2 || 0)) > 0, count: (p.trophies.league_d1 || 0) + (p.trophies.league_d2 || 0), desc: "Finish 1st in any league division standings!" }
    ];

    container.innerHTML = list.map(m => `
      <div class="glass-panel" style="
        padding: 16px; 
        border-radius: 12px; 
        background: ${m.achieved ? 'rgba(0,255,136,0.05)' : 'rgba(255,255,255,0.02)'};
        border: 1px solid ${m.achieved ? 'var(--primary)' : 'rgba(255,255,255,0.08)'};
        opacity: ${m.achieved ? '1.0' : '0.55'};
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      ">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 6px;">
            <span style="font-weight: 800; font-size: 14px; color:#fff;">${m.name}</span>
            <span style="font-size: 13px; font-weight: 900; color: ${m.achieved ? 'var(--primary)' : 'var(--text-muted)'};">${m.factor}</span>
          </div>
          <p style="font-size: 11px; color: var(--text-muted); line-height: 1.4; margin-bottom: 12px;">${m.desc}</p>
        </div>
        <div style="
          display: inline-block;
          background: ${m.achieved ? 'var(--primary)' : 'rgba(255,255,255,0.1)'};
          color: ${m.achieved ? '#000' : '#fff'};
          font-size: 10px;
          font-weight: 900;
          padding: 3px 10px;
          border-radius: 12px;
          text-transform: uppercase;
          align-self: flex-start;
        ">
          ${m.achieved ? `Achieved ${m.count ? '(x' + m.count + ')' : ''}` : 'Locked'}
        </div>
      </div>
    `).join('');
  }

  renderBallon() {
    const prestart = document.getElementById('ballon-prestart-screen');
    const live = document.getElementById('ballon-live-screen');
    const tbody = document.getElementById('table-ballon-body');
    if (!prestart || !live || !tbody) return;

    const p = window.userCareer?.profile;
    const s = window.userCareer?.stats?.season;
    if (!p || !s) return;

    const leaguePlayedCount = window.leaguesEngine?.standings?.[0]?.played || 0;
    const currentMatches = leaguePlayedCount;

    if (leaguePlayedCount === 0) {
      prestart.style.display = "block";
      live.style.display = "none";
      return;
    }

    prestart.style.display = "none";
    live.style.display = "block";

    // Determine user's active league
    const currentLeague = window.leaguesEngine?.getLeagueMeta();
    const isDiv1 = currentLeague && currentLeague.tier === 1;

    // Calculate user's Ballon d'Or probability score based on real achievements!
    // Uses the SAME scoring language as the AI superstars (OVR x2 + goals x1.2 +
    // assists x0.8 + rating) so a high OVR alone can never put you above players
    // who are actually having better seasons.
    let userScore = 0;
    if (isDiv1) {
      userScore += Math.max(0, (p.ovr - 80) * 2.0); // base score on OVR
      
      // Add major tournament performance modifiers
      const sGoals = s.goals || 0;
      const sAssists = s.assists || 0;
      userScore += sGoals * 1.2;
      userScore += sAssists * 0.8;

      // Match rating multiplier
      const rating = parseFloat(s.avgRating || 6.0);
      userScore += Math.max(0, (rating - 6.5) * 10);
      
      // Small bonuses for merely being in continental/cup campaigns (no longer a
      // free +30 that used to catapult an 89 OVR player straight to #1).
      const lgId = window.leaguesEngine?.currentLeagueId || "turkey_d2";
      if (window.leaguesEngine?.uclQualified) userScore += 5;
      if (window.leaguesEngine?.cupStage !== 'none') userScore += 3;
    }

    const seed = s.year || 2026;
    // Generate AI candidates from big teams inside our game dynamically to avoid copyright issues!
    const allBigClubs = window.leaguesEngine?.getTopClubsPool(p.currentClubId).filter(c => c.ovr >= 82) || [];
    
    // Always pad with rich fallback big clubs to avoid infinite loops and low-pool issues
    const extraElite = [
      { id: "realmadrid", name: "Real Madrid", ovr: 88, logo: "👑" },
      { id: "mancity", name: "Manchester City", ovr: 87, logo: "🔵" },
      { id: "barcelona", name: "FC Barcelona", ovr: 86, logo: "🔵🔴" },
      { id: "bayern", name: "FC Bayern München", ovr: 86, logo: "🔴" },
      { id: "psg", name: "Paris Saint-Germain", ovr: 85, logo: "🗼" },
      { id: "arsenal", name: "Arsenal FC", ovr: 84, logo: "🔴⚪" },
      { id: "liverpool", name: "Liverpool FC", ovr: 84, logo: "🔴" },
      { id: "juventus", name: "Juventus", ovr: 83, logo: "⚪⚫" },
      { id: "inter", name: "Inter Milan", ovr: 84, logo: "🔵⚫" },
      { id: "milan", name: "AC Milan", ovr: 82, logo: "🔴⚫" },
      { id: "dortmund", name: "Borussia Dortmund", ovr: 83, logo: "🟡⚫" },
      { id: "atletico", name: "Atlético Madrid", ovr: 83, logo: "🔴⚪" }
    ];
    extraElite.forEach(c => {
      if (!allBigClubs.some(bc => (bc.clubId || bc.id) === c.id)) {
        allBigClubs.push(c);
      }
    });

    const eligibleClubs = [];
    allBigClubs.forEach(cl => {
      const squad = window.leaguesEngine?.clubSquads[cl.clubId || cl.id] || [];
      const squadSorted = [...squad].sort((a, b) => b.ovr - a.ovr);
      const topStar = squadSorted[0];
      // STRICTOR CRITERIA: AI players must have an OVR score of 89 or above, and belong to a Division 1 team!
      if (topStar && topStar.ovr >= 88) {
        eligibleClubs.push({ club: cl, star: topStar });
      }
    });

    // Fallback list of superstars if eligibleClubs is empty
    if (eligibleClubs.length === 0) {
      const fallbackSquad = [
        { name: "Antoine Laurent", ovr: 91 },
        { name: "Marcus Sterling", ovr: 90 },
        { name: "Luca Rossi", ovr: 89 },
        { name: "Thomas Müller", ovr: 89 },
        { name: "Diego Santos", ovr: 92 }
      ];
      fallbackSquad.forEach((tm, idx) => {
        eligibleClubs.push({
          club: { id: `fallback_${idx}`, name: "Elite Club", logo: "🏆" },
          star: tm
        });
      });
    }

    // Determine how many opponents to pick (5 if user doesn't meet criteria, 4 if user does)
    const userMeetsCriteria = isDiv1 && p.ovr >= 88 && p.squadRole !== "Bench Player";
    const numOpponents = userMeetsCriteria ? 4 : 5;
    
    // Pick unique clubs deterministically using seed
    const pickedEligible = [];
    for (let i = 0; i < numOpponents; i++) {
      const idx = (seed + i * 7) % eligibleClubs.length;
      let el = eligibleClubs[idx];
      let offset = 1;
      while (pickedEligible.some(x => (x.club.clubId || x.club.id) === (el.club.clubId || el.club.id))) {
        if (offset >= eligibleClubs.length) {
          break;
        }
        el = eligibleClubs[(idx + offset) % eligibleClubs.length];
        offset++;
      }
      pickedEligible.push(el);
    }

    const getClubCountry = (clubId) => {
      const lgId = window.leaguesEngine?.findLeagueForClub(clubId);
      const lg = window.leaguesEngine?.leagues[lgId];
      if (lg && lg.country) {
        const parts = lg.country.split(" ");
        return { name: parts[0], flag: parts[1] || "🌍" };
      }
      return { name: "Spain", flag: "🇪🇸" };
    };

    const opponents = pickedEligible.map((el, idx) => {
      const cl = el.club;
      const topStar = el.star;
      const clubInfo = getClubCountry(cl.clubId || cl.id);
      
      const aiOvr = topStar.ovr;
      const aiGoals = (topStar.stats && topStar.stats.season && topStar.stats.season.goals) || Math.max(1, Math.round((0.45 + (aiOvr - 85) * 0.02) * (currentMatches * 0.8 + 5)));
      const baseScore = (aiOvr - 80) * 2 + aiGoals * 1.2;
      
      return {
        name: topStar.name,
        club: cl.name + " " + (cl.logo || "⚽"),
        flag: clubInfo.flag,
        ovr: aiOvr,
        score: baseScore,
        isUser: false
      };
    });

    const candidates = [];

    if (userMeetsCriteria) {
      const userFlag = window.leaguesEngine.getCountryFlagHtml(p.nationality, 16);
      candidates.push({
        name: `⭐ ${p.name} ${userFlag}`,
        club: p.currentClubName,
        ovr: p.ovr,
        score: userScore,
        isUser: true
      });
    }

    opponents.forEach(o => {
      candidates.push({
        name: `${o.flag} ${o.name}`,
        club: o.club,
        ovr: o.ovr,
        score: o.score,
        isUser: false
      });
    });

    // Sort by score descending
    candidates.sort((a, b) => b.score - a.score);

    // Filter to top 5
    const top5 = candidates.slice(0, 5);

    // Calculate sum of scores to turn them into dynamic percentage chances
    const sumScores = top5.reduce((acc, curr) => acc + Math.max(1, curr.score), 0);
    
    tbody.innerHTML = top5.map((c, idx) => {
      const pct = Math.round((Math.max(1, c.score) / sumScores) * 100);
      return `
        <tr style="${c.isUser ? 'background:rgba(0,255,136,0.12);font-weight:bold;border-left:3px solid var(--primary);' : ''}">
          <td style="text-align:center;font-weight:900;">${idx + 1}</td>
          <td>${c.name}</td>
          <td style="color:var(--text-muted);">${c.club}</td>
          <td style="text-align:center;">OVR ${c.ovr}</td>
          <td style="text-align:center;font-weight:900;color:var(--primary);">${pct}%</td>
        </tr>
      `;
    }).join('');
  }

  toggleCheatButtons() { const p=window.userCareer.profile;p.cheatShowButtons=!p.cheatShowButtons;this.saveCareer(false);this.syncCheatModeUI(); }
  renderMobileCheatControls() { const p=window.userCareer?.profile,box=document.getElementById('mobile-cheat-controls');if(!box)return; if(!p?.cheatModeEnabled||!p.cheatShowButtons||!window.matchMedia('(max-width:768px)').matches){box.innerHTML='';return;} box.innerHTML=`<button onclick="app.injectCustomGoal(true,false)" class="cheat-goal">Goal</button><button onclick="app.injectAssistGoal()" class="cheat-assist">Assist</button><button onclick="app.injectCustomGoal(false,false)" class="cheat-team">Teammate</button><button onclick="app.injectCustomGoal(false,true)" class="cheat-opp">Opponent</button><button onclick="app.injectRoleAction()" class="cheat-role">Role +1</button>`; }

  toggleCheatMode() {
    const p = window.userCareer?.profile;
    if (!p) return;

    p.cheatModeEnabled = !p.cheatModeEnabled;
    this.saveCareer(false);
    this.syncCheatModeUI();
  }

  syncCheatModeUI() {
    const p = window.userCareer?.profile;
    const btn = document.getElementById('btn-cheat-mode');
    if (!btn || !p) return;

    const enabled = p.cheatModeEnabled || false;
    btn.innerText = enabled ? "Enabled (ON)" : "Disabled";
    btn.className = enabled ? "btn btn-primary" : "btn btn-secondary";
    const cheatButtonsBtn=document.getElementById('btn-cheat-buttons'); if(cheatButtonsBtn){cheatButtonsBtn.innerText=p.cheatShowButtons?'Enabled (ON)':'Disabled';cheatButtonsBtn.className=p.cheatShowButtons?'btn btn-primary':'btn btn-secondary';}
    const noGoalsBtn = document.getElementById('btn-no-goals');
    if (noGoalsBtn) { noGoalsBtn.innerText = p.cheatNoGoals ? 'Enabled (ON)' : 'Disabled'; noGoalsBtn.className = p.cheatNoGoals ? 'btn btn-primary' : 'btn btn-secondary'; }
    if (enabled) {
      btn.style.borderColor = "#00ff88";
      btn.style.color = "#00ff88";
    } else {
      btn.style.borderColor = "";
      btn.style.color = "";
    }
  }

  injectCheatGoal() {
    const sim = this._sim;
    if (!sim || sim.finished) return;

    const p = window.userCareer?.profile;
    if (p && p.squadRole === "Bench Player" && !sim.swappedIn) {
      this.showGameNotice("⚠️ Benched", "You are currently sitting on the bench! You cannot inject goals until you get swapped into the match.");
      return;
    }

    // Pause clock
    sim.paused = true;

    // Roll goal type: Penalty: 8%, Free kick: 4%, Normal: 88%
    const r = Math.random();
    let isPenalty = false;
    let isFreekick = false;
    let assist = null;

    if (r < 0.08) {
      isPenalty = true;
    } else if (r < 0.12) {
      isFreekick = true;
    } else {
      // Normal goal
      // Only 40% of normal goals scored with the inject button have an assist
      if (Math.random() < 0.40) {
        const squad = this._getClubSquad(p.currentClubId).filter(pl => pl.name !== p.name && pl.position !== 'GK');
        if (squad.length > 0) {
          assist = squad[Math.floor(Math.random() * squad.length)].name;
        }
      }
    }

    const minute = Math.floor(sim.clock);
    const ev = {
      type: 'goal',
      minute: minute,
      team: sim.userTeam,
      player: sim.userName,
      isUser: true,
      assist,
      isPenalty,
      isFreekick
    };

    // Insert the cheat event into sim.events at the current index, and increment eventIdx so the clock ticker bypasses it!
    sim.events.splice(sim.eventIdx, 0, ev);
    sim.eventIdx++;
    this._processSimEvent(ev);
    this._updateSimScore();

    // Auto-resume after 2.0 seconds (incorporating delay for goal message)
    setTimeout(() => {
      if (this._sim) this._sim.paused = false;
    }, 2000);
  }

  startTrainingSession() {
    const p = window.userCareer?.profile;
    if (!p || p.hasTrainedThisMatchday) return;

    const hubScreen = document.getElementById('training-hub-screen');
    const activeScreen = document.getElementById('training-active-screen');
    if (hubScreen) hubScreen.style.display = "none";
    if (activeScreen) activeScreen.style.display = "block";

    // Show prestart START button initially
    const prestartControls = document.getElementById('training-prestart-controls');
    if (prestartControls) prestartControls.style.display = "block";

    // Initialize Training State (in 'prestart' mode!)
    this.trainingState = {
      timer: 15.00,
      goals: 0,
      attempts: 0,
      active: true, // keeps the loop running to render the background/entities
      countdownState: 'prestart', // prestart, counting, playing, ended
      countdownValue: 3,
      lastTime: Date.now()
    };

    // UI Elements
    const timerEl = document.getElementById('training-timer');
    const goalsEl = document.getElementById('training-goals');
    const attemptsEl = document.getElementById('training-attempts');
    if (timerEl) timerEl.innerText = "15.00s";
    if (goalsEl) goalsEl.innerText = "0 / 3";
    if (attemptsEl) attemptsEl.innerText = "0 / 5";

    // Canvas Setup
    const canvas = document.getElementById('trainingCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Fit canvas resolution properly
    canvas.width = 720;
    canvas.height = 380;

    // Game Entities
    const goal = {
      x: 130,
      y: 100,
      width: 460,
      height: 140
    };

    const ball = {
      x: 360,
      y: 330,
      radius: 15,
      state: 'idle', // idle, drawing, shooting, resolved
      vx: 0, vy: 0,
      scale: 1.0,
      path: [],
      pathIndex: 0,
      timer: 0
    };

    const goalie = {
      x: 360,
      y: 180,
      width: 45,
      height: 65,
      vx: 0, vy: 0,
      state: 'center', // center, diving
      targetX: 360,
      targetY: 180
    };

    // Tracking drawing path
    let isDrawing = false;
    let pathPoints = [];

    // Helper to get mouse coordinates relative to canvas
    const getMousePos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    };

    // Mouse Listeners
    const onMouseDown = (e) => {
      // Only allow shooting when game is actually 'playing'!
      if (this.trainingState.countdownState !== 'playing' || ball.state !== 'idle') return;
      const mouse = getMousePos(e);
      const distToBall = Math.hypot(mouse.x - ball.x, mouse.y - ball.y);
      
      if (distToBall < ball.radius + 15) {
        isDrawing = true;
        pathPoints = [{ x: ball.x, y: ball.y }];
        ball.state = 'drawing';
      }
    };

    const onMouseMove = (e) => {
      if (!isDrawing) return;
      const mouse = getMousePos(e);
      pathPoints.push({ x: mouse.x, y: mouse.y });
    };

    const onMouseUp = (e) => {
      if (!isDrawing) return;
      isDrawing = false;

      if (pathPoints.length > 2) {
        // Runup Pause: Set ball to 'runup' state for 0.5s before shooting!
        ball.state = 'runup';
        ball.path = [...pathPoints];
        ball.pathIndex = 0;
        ball.timer = 0;

        setTimeout(() => {
          if (this.trainingState.countdownState === 'ended') return;
          ball.state = 'shooting';
          
          // Keeper reacts and dives!
          const finalPoint = pathPoints[pathPoints.length - 1];
          goalie.state = 'diving';
          
          const shootingAttr = p.attributes.shooting || 70;
          const goalieAccuracy = Math.max(0.4, 0.95 - (shootingAttr - 50) * 0.009);
          
          if (Math.random() < goalieAccuracy) {
            goalie.targetX = Math.max(goal.x, Math.min(goal.x + goal.width, finalPoint.x));
            goalie.targetY = Math.max(goal.y, Math.min(goal.y + goal.height + 20, finalPoint.y));
          } else {
            goalie.targetX = goalie.x + (Math.random() - 0.5) * 200;
            goalie.targetY = goalie.y + (Math.random() - 0.5) * 50;
          }
        }, 500); // 0.5-second runup delay!
      } else {
        ball.state = 'shooting';
        ball.path = [
          { x: ball.x, y: ball.y },
          { x: ball.x + (Math.random() - 0.5) * 40, y: ball.y - 40 }
        ];
        ball.pathIndex = 0;
        ball.timer = 0;
        goalie.state = 'center';
      }
    };

    // Attach listeners
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);

    // Main Training Loop
    const loop = () => {
      if (this.trainingState.countdownState === 'ended') {
        canvas.removeEventListener('mousedown', onMouseDown);
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('mouseup', onMouseUp);
        return;
      }

      const now = Date.now();
      const dt = (now - this.trainingState.lastTime) / 1000;
      this.trainingState.lastTime = now;

      // 1. Tick Timer Down ONLY when state is 'playing'!
      if (this.trainingState.countdownState === 'playing') {
        this.trainingState.timer -= dt;
        if (this.trainingState.timer <= 0) {
          this.trainingState.timer = 0;
          this.endTrainingSession(false, "Timeout! Time ran out before completing all attempts.");
          return;
        }
        if (timerEl) timerEl.innerText = this.trainingState.timer.toFixed(2) + "s";

        // Physics & Logic Update
        if (ball.state === 'shooting') {
          if (ball.pathIndex < ball.path.length) {
            const travelSpeed = 3;
            ball.pathIndex += travelSpeed;
            const targetPt = ball.path[Math.min(ball.path.length - 1, Math.floor(ball.pathIndex))];
            
            if (targetPt) {
              ball.x = targetPt.x;
              ball.y = targetPt.y;
            }

            const depthPct = (ball.y - goal.y) / (330 - goal.y);
            ball.scale = 0.55 + Math.max(0, depthPct) * 0.45;

            if (goalie.state === 'diving') {
              const ease = 0.32; // Elite professional reaction slide speed (lightning fast!)
              goalie.x += (goalie.targetX - goalie.x) * ease;
              goalie.y += (goalie.targetY - goalie.y) * ease;
            }
          } else {
            const isInsideGoalX = ball.x > goal.x + 10 && ball.x < (goal.x + goal.width - 10);
            const isInsideGoalY = ball.y > goal.y + 10 && ball.y < (goal.y + goal.height + 20);
            
            let resolvedStatus = 'miss';

            if (isInsideGoalX && isInsideGoalY) {
              const distToGoalie = Math.hypot(ball.x - goalie.x, ball.y - (goalie.y + 20));
              const shootingAttr = p.attributes.shooting || 70;
              const saveRange = Math.max(28, 48 - (shootingAttr - 50) * 0.25); // Elite goalie hand-reach coverage radius!

              if (distToGoalie < saveRange) {
                // Within reach: Goalkeeper usually saves, but has a 25% chance of a fumble/slip!
                if (Math.random() < 0.25) {
                  resolvedStatus = 'goal';
                } else {
                  resolvedStatus = 'save';
                }
              } else {
                // Out of reach: Usually a goal, but has a 20% chance of a miraculous fingertip save!
                if (Math.random() < 0.20) {
                  resolvedStatus = 'save';
                } else {
                  resolvedStatus = 'goal';
                }
              }
            }

            ball.state = 'resolved';
            this.trainingState.attempts++;
            if (resolvedStatus === 'goal') {
              this.trainingState.goals++;
            }
            
            if (goalsEl) goalsEl.innerText = `${this.trainingState.goals} / 3`;
            if (attemptsEl) attemptsEl.innerText = `${this.trainingState.attempts} / 5`;

            ball.resolvedText = resolvedStatus.toUpperCase();

            setTimeout(() => {
              if (this.trainingState.countdownState === 'ended') return;
              
              if (this.trainingState.attempts >= 5) {
                const success = this.trainingState.goals >= 3;
                this.endTrainingSession(success);
              } else {
                ball.x = 360;
                ball.y = 330;
                ball.scale = 1.0;
                ball.state = 'idle';
                ball.path = [];
                ball.resolvedText = null;

                goalie.x = 360;
                goalie.y = 180;
                goalie.state = 'center';
              }
            }, 1000);
          }
        }
      }

      // 3. Render Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grass Pitch background
      const grassGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grassGrad.addColorStop(0, '#020617');
      grassGrad.addColorStop(1, '#0b1329');
      ctx.fillStyle = grassGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stripes
      ctx.fillStyle = 'rgba(255,255,255,0.015)';
      for (let x = 0; x < canvas.width; x += 80) {
        ctx.fillRect(x, 0, 40, canvas.height);
      }

      // Draw Goal Frame
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 6;
      ctx.lineJoin = 'round';
      ctx.strokeRect(goal.x, goal.y, goal.width, goal.height);

      // Netting
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      for (let lx = goal.x; lx <= goal.x + goal.width; lx += 15) {
        ctx.beginPath(); ctx.moveTo(lx, goal.y); ctx.lineTo(lx, goal.y + goal.height); ctx.stroke();
      }
      for (let ly = goal.y; ly <= goal.y + goal.height; ly += 15) {
        ctx.beginPath(); ctx.moveTo(goal.x, ly); ctx.lineTo(goal.x + goal.width, ly); ctx.stroke();
      }

      // Draw Trajectory Path if drawing (glowing green line)
      if (ball.state === 'drawing' && pathPoints.length > 0) {
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
        for (let idx = 1; idx < pathPoints.length; idx++) {
          ctx.lineTo(pathPoints[idx].x, pathPoints[idx].y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      }

      // Draw Goalkeeper
      const gSkin = p.skinColor || '#f3c299';
      ctx.fillStyle = gSkin;
      ctx.beginPath(); ctx.arc(goalie.x, goalie.y - 10, 10, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(goalie.x - 14, goalie.y, 28, 30);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(goalie.x - 12, goalie.y + 30, 8, 20);
      ctx.fillRect(goalie.x + 4, goalie.y + 30, 8, 20);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(goalie.x - 22, goalie.y + 10, 6, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(goalie.x + 22, goalie.y + 10, 6, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(goalie.x - 14, goalie.y + 5); ctx.lineTo(goalie.x - 20, goalie.y + 10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(goalie.x + 14, goalie.y + 5); ctx.lineTo(goalie.x + 20, goalie.y + 10); ctx.stroke();

      // Draw Soccer Ball
      const bRad = ball.radius * ball.scale;
      ctx.save();
      ctx.translate(ball.x, ball.y);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(0, 0, bRad, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#000000'; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.arc(0, 0, bRad * 0.4, 0, Math.PI*2); ctx.fill();
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 2.5) {
        ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(Math.cos(a) * bRad * 0.35, Math.sin(a) * bRad * 0.35);
        ctx.lineTo(Math.cos(a) * bRad, Math.sin(a) * bRad);
        ctx.stroke();
      }
      ctx.restore();

      // Draw Floating Resolved Text (GOAL! or SAVED!)
      if (ball.resolvedText) {
        ctx.fillStyle = ball.resolvedText === 'GOAL' ? 'var(--primary)' : 'var(--accent-gold)';
        ctx.font = '900 28px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(ball.resolvedText + "!", 360, 80);
      }

      // Draw Large Countdown Overlay if counting! (3... 2... 1...)
      if (this.trainingState.countdownState === 'counting') {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ffffff'; // White letters as requested!
        ctx.font = '900 72px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const displayVal = this.trainingState.countdownValue > 0 ? this.trainingState.countdownValue : "GO!";
        ctx.fillText(displayVal, 360, 190);
      }

      // Loop again
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  startTrainingCountdown() {
    if (!this.trainingState || this.trainingState.countdownState !== 'prestart') return;

    // Hide Start button container
    const prestartControls = document.getElementById('training-prestart-controls');
    if (prestartControls) prestartControls.style.display = "none";

    this.trainingState.countdownState = 'counting';
    this.trainingState.countdownValue = 3;

    // Countdown interval (1s per tick)
    const tick = () => {
      if (this.trainingState.countdownValue > 1) {
        this.trainingState.countdownValue--;
        setTimeout(tick, 1000);
      } else {
        // Change state to 'playing'!
        this.trainingState.countdownState = 'playing';
        this.trainingState.lastTime = Date.now();
      }
    };

    setTimeout(tick, 1000);
  }

  endTrainingSession(success, reasonMsg = "") {
    this.trainingState.countdownState = 'ended';
    const p = window.userCareer?.profile;
    if (!p) return;

    p.hasTrainedThisMatchday = true;

    if (success) {
      p.skillPoints += 1;
      this.saveCareer(false);
      this.showGameNotice(
        "🏆 Training Completed perfectly!",
        `
          <div style="font-size: 64px; margin-bottom: 12px;">🏅</div>
          <p style="font-size: 15px; color: #fff; line-height: 1.6;">
            Sensational finishing on the pitch! You successfully scored <strong>${this.trainingState.goals} / 5</strong> penalties and completed the drill!
          </p>
          <div style="font-size: 20px; font-weight: 900; color: var(--primary); margin-top: 14px;">
            +1 Skill Point Awarded! 🎯
          </div>
        `
      );
    } else {
      this.saveCareer(false);
      this.showGameNotice(
        "❌ Training Completed (Failed)",
        `
          <div style="font-size: 64px; margin-bottom: 12px;">⚽</div>
          <p style="font-size: 15px; color: var(--text-muted); line-height: 1.6;">
            ${reasonMsg || `You scored only <strong>${this.trainingState.goals} / 5</strong> penalties. You needed at least 3 goals to earn the skill point.`}
          </p>
          <div style="font-size: 16px; font-weight: 800; color: #ef4444; margin-top: 14px;">
            Better luck next matchday! 🏃
          </div>
        `
      );
    }

    this.refreshUI();
  }  upgradeAttr(key) {
    if (window.userCareer.upgradeAttribute(key)) {
      this.saveCareer(false);
      this.refreshUI();
    }
  }

  acceptContractOffer(clubId) {
    const offer = (this._contractOffers || []).find(o => String(o.clubId) === String(clubId));
    if (!offer) {
      this.showGameNotice("⚠️ Offer Unavailable", "<p style='color:#ef4444;'>This contract offer is no longer available.</p>");
      return;
    }
    const currentClubName = window.userCareer.profile.currentClubName;
    const cleanName = String(offer.clubName).replace(' (Renewal)', '');
    window.userCareer.pendingTransfer = {
      clubId: offer.clubId,
      clubName: cleanName,
      wage: offer.wage,
      goalBonus: offer.goalBonus,
      assistBonus: offer.assistBonus,
      roleBonus: offer.roleBonus || 5000,
      squadRole: offer.squadRole || 'First Team Regular'
    };

    this.saveCareer(false);
    this.showGameNotice(
      "✍️ Contract Signed!",
      `
        <div style="font-size: 54px; margin-bottom: 12px;">✍️</div>
        <p style="font-size: 15px; color: #fff; line-height: 1.6;">
          Summer Transfer Contract Signed! You agreed to join <strong>${cleanName}</strong> starting <strong>NEXT</strong> season!
        </p>
        <p style="font-size: 13px; color: var(--text-muted); margin-top: 10px;">
          Finish playing out the current season with your current club, <strong>${currentClubName}</strong>. Your transfer will officially complete during the summer break!
        </p>
      `
    );
    this.refreshUI();
  }

  openContractChange(clubId) {
    const offer = (this._contractOffers || []).find(o => String(o.clubId) === String(clubId));
    if (!offer) return;
    const p = window.userCareer?.profile;
    const roleLabel = p?.position === 'GK' ? 'Save Bonus ($ per save)' : 'Role Bonus ($ per defensive action)';
    this.showGameNotice('✍️ Change Contract Offer', `
      <div style="text-align:left;display:grid;gap:12px">
        <div style="font-weight:800;color:#fff;font-size:16px;">${offer.clubName} — Negotiate Terms</div>
        <label style="display:grid;gap:4px;font-weight:700;">Weekly wage
          <input class="form-input" id="contract-new-wage" type="number" min="1" value="${offer.wage}">
        </label>
        <label style="display:grid;gap:4px;font-weight:700;">Goal bonus ($ per goal)
          <input class="form-input" id="contract-new-goal" type="number" min="0" value="${offer.goalBonus}">
        </label>
        <label style="display:grid;gap:4px;font-weight:700;">Assist bonus ($ per assist)
          <input class="form-input" id="contract-new-assist" type="number" min="0" value="${offer.assistBonus}">
        </label>
        <label style="display:grid;gap:4px;font-weight:700;">${roleLabel}
          <input class="form-input" id="contract-new-role" type="number" min="0" value="${offer.roleBonus || 5000}">
        </label>
        <button class="btn btn-primary" onclick="app.submitContractChange('${clubId}')">Send Changed Offer</button>
      </div>`);
  }

  submitContractChange(clubId) {
    const offer = (this._contractOffers || []).find(o => String(o.clubId) === String(clubId));
    if (!offer) { this.closeGameNotice(); return; }

    const wage = Number(document.getElementById('contract-new-wage')?.value);
    const goal = Number(document.getElementById('contract-new-goal')?.value);
    const assist = Number(document.getElementById('contract-new-assist')?.value);
    const role = Number(document.getElementById('contract-new-role')?.value);

    if (!wage || wage <= 0 || isNaN(wage)) {
      this.showGameNotice("⚠️ Invalid Offer", "<p style='color:#ef4444;'>The weekly wage must be a positive number.</p>");
      return;
    }

    // Asking for a raise risks the club walking away (same negotiation logic as sponsors).
    if (wage > offer.wage) {
      const increase = (wage / offer.wage) - 1;
      const chance = Math.max(0.08, 0.82 - increase * 1.6);
      if (Math.random() > chance) {
        this._contractOffers = this._contractOffers.filter(o => o !== offer);
        this.closeGameNotice();
        this.showGameNotice('❌ Negotiation Declined', `${offer.clubName} rejected the requested terms and withdrew the offer.`);
        this.refreshUI();
        return;
      }
    }

    offer.wage = Math.round(wage);
    offer.goalBonus = Math.round(goal || 0);
    offer.assistBonus = Math.round(assist || 0);
    offer.roleBonus = Math.round(role || 0);
    this.closeGameNotice();
    this.showGameNotice('✅ Offer Updated', `${offer.clubName} accepted your adjusted terms! The offer below now shows your new conditions.`);
    this.refreshUI();
  }


  simulateMatch() {
    if (this._sim && !this._sim.finished) return;

    const p = window.userCareer.profile;
    this.activeMatchContext = window.leaguesEngine.getNextMatch(p.currentClubId, p.nationality);
    if (!this.activeMatchContext) {
      this.showGameNotice("⚠️ No Match Available", "<div style='font-size:48px;margin-bottom:12px;'>🥅</div><p style='color:#cbd5e1;font-size:15px;line-height:1.6;'>There is currently no active match available to play or simulate. Check your Games Calendar!</p>");
      return;
    }

    const ctx = this.activeMatchContext;
    const homeName = ctx.displayHomeName || (ctx.home && ctx.home.name) || 'Home';
    const awayName = ctx.displayAwayName || (ctx.away && ctx.away.name) || 'Away';
    const userIsHome = ctx.participantType === 'national' ? (ctx.home?.name === p.nationality) : (ctx.home && ctx.home.clubId === p.currentClubId);
    const userName = p.name;

    const homeClubId = ctx.home?.clubId || ctx.home?.id;
    const awayClubId = ctx.away?.clubId || ctx.away?.id;
    const homeSquad = (this._getClubSquad(homeClubId) || []).filter(pl => pl.position !== 'GK');
    const awaySquad = (this._getClubSquad(awayClubId) || []).filter(pl => pl.position !== 'GK');

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
    let userGoals = randGoals(ovrBonus);
    let oppGoals = randGoals(-ovrBonus * 0.5);
    const events = [];

    // Total team shots on target for the whole match. These drive the goalkeeper
    // save model: saves = opponent shots - opponent goals (see below), so a keeper
    // who faces 30 shots and concedes 3 is credited with 27 saves.
    const userTeamShots = Math.floor(Math.random() * 25) + 8;  // 8 - 32 shots
    const oppTeamShots = Math.floor(Math.random() * 23) + 6;   // 6 - 28 shots

    // Dynamically balance scoring rate based on player's position role
    const pos = p.position || "ST";
    let baseScoringRate = 0.35;
    let ovrScoringFactor = 0.005;

    if (pos === "ST") {
      baseScoringRate = 0.35;
    } else if (pos === "RW" || pos === "LW") {
      baseScoringRate = 0.28;
      ovrScoringFactor = 0.004;
    } else if (pos === "CAM") {
      baseScoringRate = 0.20;
      ovrScoringFactor = 0.003;
    } else if (pos === "CM") {
      baseScoringRate = 0.12;
      ovrScoringFactor = 0.002;
    } else if (pos === "CB" || pos === "LB" || pos === "RB") {
      baseScoringRate = 0.03; // Defenders score extremely rarely!
      ovrScoringFactor = 0.0005;
    } else if (pos === "GK") {
      baseScoringRate = 0.001; // Miracle goalkeeper goals
      ovrScoringFactor = 0;
    }

    // Dynamic assist chances per position role
    let assistChance = 0.25;
    if (pos === 'CAM' || pos === 'CM') {
      assistChance = 0.35 + (p.attributes.passing - 70) * 0.005; // Playmakers assist most!
    } else if (pos === 'RW' || pos === 'LW') {
      assistChance = 0.30 + (p.attributes.passing - 70) * 0.004;
    } else if (pos === 'CB' || pos === 'LB' || pos === 'RB') {
      assistChance = 0.14 + (p.attributes.passing - 70) * 0.002; // moderate assists for defenders
    } else if (pos === 'GK') {
      assistChance = 0.005; // extremely rare assist from goalkeeper long kicks (brings down to 1-2 assists a season!)
    } else {
      assistChance = 0.22 + (p.attributes.passing - 70) * 0.003; // ST or others
    }

    const isBench = p && p.squadRole === "Bench Player";
    let subMinute = 0;
    let playsThisMatch = true;

    if (isBench) {
      playsThisMatch = Math.random() < 0.50; // 50% chance to join the game
      if (playsThisMatch) {
        if (Math.random() < 0.80) {
          // 80% chance to enter at 75+ minutes
          subMinute = Math.floor(Math.random() * 11) + 75; // 75 to 85
        } else {
          // 20% chance to enter at 55-74 minutes
          subMinute = Math.floor(Math.random() * 20) + 55; // 55 to 74
        }
      } else {
        subMinute = 999; // Never enters
      }
    }

    const pickWeightedScorer = (squad, fallbackName) => {
      if (!squad || squad.length === 0) return fallbackName;
      const weights = {
        'ST': 40, 'LW': 20, 'RW': 20, 'CAM': 12, 'CM': 6, 'RM': 10, 'LM': 10,
        'CB': 1, 'LB': 2, 'RB': 2, 'LWB': 2, 'RWB': 2
      };
      const candidates = squad.map(pl => ({ pl, w: weights[pl.position] || 5 }));
      const totalWeight = candidates.reduce((sum, c) => sum + c.w, 0);
      let rand = Math.random() * totalWeight;
      for (let i = 0; i < candidates.length; i++) {
        rand -= candidates[i].w;
        if (rand <= 0) return candidates[i].pl.name;
      }
      return squad[0].name;
    };

    const pickWeightedAssister = (squad, scorerName, extraPlayer = null) => {
      const weights = { LW: 35, RW: 35, CAM: 20, LM: 20, RM: 20, CM: 5, ST: 3, LB: 2, RB: 2, CB: 1, GK: 0.2 };
      const pool = [...(squad || [])];
      if (extraPlayer && !pool.some(pl => pl.name === extraPlayer.name)) pool.push(extraPlayer);
      const candidates = pool.filter(pl => pl.name !== scorerName);
      const total = candidates.reduce((sum, pl) => sum + (weights[pl.position] || 2) * (1 + Math.max(-0.10, Math.min(0.15, ((pl.ovr || 70) - 70) * 0.005))), 0);
      let roll = Math.random() * total;
      return candidates.find(pl => (roll -= (weights[pl.position] || 2) * (1 + Math.max(-0.10, Math.min(0.15, ((pl.ovr || 70) - 70) * 0.005)))) <= 0)?.name || null;
    };

    // User team goals
    for (let i = 0; i < userGoals; i++) {
      const minute = Math.floor(Math.random() * 89) + 1;
      let isUserScorer = false;
      if (!isBench || (playsThisMatch && minute >= subMinute)) {
        isUserScorer = Math.random() < (baseScoringRate + (ovr - 70) * ovrScoringFactor);
      }
      const scorer = isUserScorer ? userName : pickWeightedScorer(userSquad, 'Teammate');
      // 70% normal-goal assist rate; weighted 35% LW, 35% RW, 20% CAM, 10% other.
      // The controlled player joins that same weighted pool, with only a small passing/OVR influence.
      const canUserAssist = !isBench || (playsThisMatch && minute >= subMinute);
      const userCreator = canUserAssist ? { name: userName, position: pos, ovr: p.ovr + (p.attributes.passing - 70) * 0.15 } : null;
      let assist = Math.random() < 0.70 ? pickWeightedAssister(userSquad, scorer, userCreator) : null;

      // If the scorer is a CM or defender (CB, LB, RB), most (97%) of their goals should be dead-balls (penalties or freekicks)
      const scorerPl = isUserScorer ? p : userSquad.find(pl => pl.name === scorer);
      const scorerPos = scorerPl ? scorerPl.position : pos;

      let isPenalty = Math.random() < 0.15;
      let isFreekick = !isPenalty && Math.random() < 0.12;

      if (['CB', 'LB', 'RB', 'CM'].includes(scorerPos)) {
        if (Math.random() < 0.97) { // 97% are dead-balls!
          if (Math.random() < 0.60) {
            isPenalty = true; isFreekick = false;
          } else {
            isPenalty = false; isFreekick = true;
          }
        }
      }

      if (isPenalty || isFreekick) {
        assist = null;
      }
      events.push({ type: 'goal', minute, team: userTeam, player: scorer, isUser: isUserScorer, assist, isPenalty, isFreekick });
    }

    // Opponent goals
    for (let i = 0; i < oppGoals; i++) {
      const minute = Math.floor(Math.random() * 89) + 1;
      const scorer = pickWeightedScorer(oppSquad, 'Opponent');
      let assist = Math.random() < 0.70 ? pickWeightedAssister(oppSquad, scorer) : null;

      const oppScorerPl = oppSquad.find(pl => pl.name === scorer);
      const oppScorerPos = oppScorerPl ? oppScorerPl.position : 'ST';

      let isPenalty = Math.random() < 0.15;
      let isFreekick = !isPenalty && Math.random() < 0.12;

      if (['CB', 'LB', 'RB', 'CM'].includes(oppScorerPos)) {
        if (Math.random() < 0.97) { // 97% are dead-balls!
          if (Math.random() < 0.60) {
            isPenalty = true; isFreekick = false;
          } else {
            isPenalty = false; isFreekick = true;
          }
        }
      }

      if (isPenalty || isFreekick) {
        assist = null;
      }
      events.push({ type: 'goal', minute, team: oppTeam, player: scorer, isUser: false, assist, isPenalty, isFreekick });
    }

    // Position actions happen at fully random moments; they are not distributed by half.
    // Attacker shots use a decaying distribution: 0-1 shots is far more likely than
    // double digits, so shot counts follow a realistic "mostly quiet, sometimes busy" curve.
    if (['ST', 'LW', 'RW', 'CAM'].includes(pos)) {
      const shotCap = pos === 'CAM' ? (p.ovr >= 90 ? 12 : 8) : (p.ovr >= 90 ? 16 : 11);
      const shots = Math.min(this._skewedShots(shotCap), userTeamShots);
      for (let i = 0; i < shots; i++) events.push({ type: 'shot', minute: Math.floor(Math.random() * 90) + 1, team: userTeam, player: userName, isUser: true });
    }
    if (['CB', 'LB', 'RB', 'CM'].includes(pos) || pos === 'GK') {
      const roleActionType = pos === 'GK' ? 'save' : 'defensive_action';
      // Goalkeeper saves = every opponent shot that did NOT become a goal.
      const roleActionCount = pos === 'GK' ? Math.max(0, oppTeamShots - oppGoals) : (Math.floor(Math.random() * 14) + 2);
      for (let i = 0; i < roleActionCount; i++) {
        events.push({ type: roleActionType, minute: Math.floor(Math.random() * 90) + 1, team: userTeam, player: userName, isUser: true });
      }
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

    // Push the sub-in event chronologically if benched and set to play this match!
    if (isBench && playsThisMatch) {
      events.push({
        type: 'sub_in',
        minute: subMinute,
        team: userTeam,
        player: userName,
        isUser: true
      });
    }

    if (p.cheatNoGoals) {
      for (let i = events.length - 1; i >= 0; i--) if (events[i].type === 'goal') events.splice(i, 1);
      userGoals = 0; oppGoals = 0;
    }
    events.sort((a, b) => a.minute - b.minute);

    this._sim = {
      ctx, events, homeName, awayName, userIsHome, userName, userTeam, oppTeam,
      userGoals, oppGoals,
      userTeamShots, oppTeamShots,
      scoreHome: 0, scoreAway: 0,
      clock: 0, half: 1, paused: false, finished: false, skipped: false,
      eventIdx: 0, timer: null,
      isBench, subMinute, swappedIn: !isBench, speed: this.matchSettings.simSpeed || 1, userSquad, oppSquad,
      roleActions: 0, roleActionLabel: pos === 'GK' ? 'Saves' : 'Defensive Actions',
      liveGoals: 0, liveAssists: 0, liveXp: 0, liveRating: 6.5, shots: 0, motm: '—', motmScores: {}, motmTeams: {}
    };

    this._showSimOverlay();
    this._startSimClock();
  }

  // Decaying shot-count distribution: each additional shot is less likely than the
  // previous one, so low shot counts (1-3) are the norm and 10+ is rare.
  _skewedShots(cap) {
    let count = 0;
    while (count < cap && Math.random() < 0.62) count++;
    return count;
  }

  _getClubSquad(clubInput) {
    if (!clubInput) return [];
    
    // Extract clubId from either string or object
    let clubId = typeof clubInput === 'string' ? clubInput : (clubInput.clubId || clubInput.id);
    if (!clubId) return [];

    let rawSquad = [];

    // 1. Check window.leaguesEngine.clubSquads (Primary checker for persistent squads - clubs and national teams!)
    if (window.leaguesEngine?.clubSquads && window.leaguesEngine.clubSquads[clubId]) {
      rawSquad = window.leaguesEngine.clubSquads[clubId];
    }
    // 2. Check if the club is in active standings first
    else {
      const club = window.leaguesEngine?.standings?.find(s => s.clubId === clubId || s.id === clubId);
      if (club && club.squad && club.squad.length > 0) {
        rawSquad = club.squad;
      }
    }

    // 3. Handle National Teams Fallback (if not persistently generated yet)
    if (rawSquad.length === 0 && (clubId.startsWith("nat_") || (typeof clubInput === 'object' && clubInput.participantType === 'national'))) {
      const countryCode = clubId.replace("nat_", "");
      const natTeam = window.leaguesEngine?.nationalTeams?.find(nt => nt.id === countryCode || nt.name.toLowerCase() === countryCode.toLowerCase());
      const countryName = natTeam ? natTeam.name : (typeof clubInput === 'object' && clubInput.name ? clubInput.name : "Germany");
      
      let culturalCountry = countryName;
      if (window.leaguesEngine && typeof window.leaguesEngine.getCulturalCountry === 'function') {
        culturalCountry = window.leaguesEngine.getCulturalCountry(countryName);
      }
      const firstNames = window.NATIONAL_NAMES[culturalCountry]?.first || window.NATIONAL_NAMES["Germany"]?.first || ["Hans"];
      const lastNames = window.NATIONAL_NAMES[culturalCountry]?.last || window.NATIONAL_NAMES["Germany"]?.last || ["Müller"];
      
      const squad = [];
      const positions = ['CB', 'CB', 'LB', 'RB', 'CM', 'CM', 'CAM', 'RW', 'LW', 'ST'];
      positions.forEach((pos, idx) => {
        const fName = firstNames[(idx * 7) % firstNames.length];
        const lName = lastNames[(idx * 11) % lastNames.length];
        squad.push({
          name: `${fName} ${lName}`,
          position: pos,
          ovr: 80,
          age: 18 + (idx % 12),
          nationality: countryName,
          flag: natTeam ? natTeam.flag : "🌍",
          stats: {
            season: { goals: 0, assists: 0, matches: 0 },
            league: { goals: 0, assists: 0, matches: 0 },
            cup: { goals: 0, assists: 0, matches: 0 },
            ucl: { goals: 0, assists: 0, matches: 0 }
          }
        });
      });
      rawSquad = squad;
    }

    // 4. If the club is an external opponent, find it in the global database and generate their squad!
    if (rawSquad.length === 0) {
      const extClub = window.leaguesEngine?.findClubById(clubId);
      if (extClub) {
        const squad = window.leaguesEngine.generateSquad(clubId, extClub.ovr || 75);
        if (window.leaguesEngine.clubSquads) {
          window.leaguesEngine.clubSquads[clubId] = squad;
        }
        rawSquad = squad;
      }
    }

    // 5. Ultimate Fallback: Generate a random squad using country names
    if (rawSquad.length === 0) {
      const country = "England";
      const firstNames = window.NATIONAL_NAMES[country]?.first || window.NATIONAL_NAMES["Turkey"].first;
      const lastNames = window.NATIONAL_NAMES[country]?.last || window.NATIONAL_NAMES["Turkey"].last;
      const squad = [];
      const positions = ['CB', 'CB', 'LB', 'RB', 'CM', 'CM', 'CAM', 'RW', 'LW', 'ST'];
      positions.forEach((pos, idx) => {
        const fName = firstNames[(idx * 13) % firstNames.length];
        const lName = lastNames[(idx * 17) % lastNames.length];
        squad.push({
          name: `${fName} ${lName}`,
          position: pos,
          ovr: 75,
          age: 18 + (idx % 15),
          stats: {
            season: { goals: 0, assists: 0, matches: 0 },
            league: { goals: 0, assists: 0, matches: 0 },
            cup: { goals: 0, assists: 0, matches: 0 },
            ucl: { goals: 0, assists: 0, matches: 0 }
          }
        });
      });
      rawSquad = squad;
    }

    return this._filterDuplicatePositionIfStarter(rawSquad, clubId);
  }

  _filterDuplicatePositionIfStarter(squad, clubId) {
    if (!squad || squad.length === 0) return squad;

    const p = window.userCareer?.profile;
    if (!p) return squad;

    const isUserClub = (clubId === p.currentClubId);
    
    let isUserNationalTeam = false;
    if (p.isNationalTeamCalledUp && clubId && (clubId.startsWith("nat_") || clubId.toLowerCase() === p.nationality?.toLowerCase())) {
      const countryCode = clubId.replace("nat_", "").toLowerCase();
      const nat = window.leaguesEngine?.nationalTeams?.find(
        n => n.id.toLowerCase() === countryCode || n.name.toLowerCase() === countryCode
      );
      if ((nat && nat.name === p.nationality) || countryCode === p.nationality?.toLowerCase()) {
        isUserNationalTeam = true;
      }
    }

    if (isUserClub || isUserNationalTeam) {
      if (p.squadRole === 'Bench Player') {
        return squad;
      }

      const userPos = p.position;

      if (userPos === 'CM' || userPos === 'CB') {
        let foundCount = 0;
        return squad.filter(tm => {
          if (tm.position === userPos) {
            foundCount++;
            return foundCount <= 1;
          }
          return true;
        });
      } else {
        return squad.filter(tm => tm.position !== userPos);
      }
    }

    return squad;
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
        <div id="sim-controls"><div id="mobile-cheat-controls" class="mobile-cheat-controls"></div>
          <div id="sim-player-stats" style="display:flex;justify-content:space-around;gap:8px;flex-wrap:wrap;margin:0 0 14px;padding:14px;background:rgba(0,255,136,0.08);border:1px solid rgba(0,255,136,0.3);border-radius:12px;font-size:13px;font-weight:800;"></div>
          <div style="display:flex;gap:8px;align-items:center;justify-content:center;margin-bottom:10px"><button class="btn btn-secondary" onclick="app.changeSimSpeed(-1)" style="padding:3px 8px;font-size:11px;min-width:30px">◀</button><b id="sim-speed">${sim.speed}x</b><button class="btn btn-secondary" onclick="app.changeSimSpeed(1)" style="padding:3px 8px;font-size:11px;min-width:30px">▶</button></div>${this.matchSettings.allowSkipSim ? `<button class="btn btn-secondary" style="width:100%;" onclick="app.skipSim()">Skip to Full Time ⏩</button>` : ``}
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    this.renderMobileCheatControls();
    this._updateLiveSimPlayerStats();
  }

  _startSimClock() {
    const sim = this._sim;
    if (!sim) return;

    const p = window.userCareer?.profile;

    sim.timer = setInterval(() => {
      if (!this._sim || sim.skipped || sim.finished) return;
      if (sim.paused) return;

      sim.clock += 0.15 * (sim.speed || 1);
      // Secure-win cheat influences future play rather than adding instant scorelines.
      const userScore = sim.userTeam === 'home' ? sim.scoreHome : sim.scoreAway;
      const oppScore = sim.userTeam === 'home' ? sim.scoreAway : sim.scoreHome;
      if (sim.forceWin && userScore <= oppScore && Math.random() < 0.035 * (sim.speed || 1)) {
        const scorer = (sim.userSquad || []).find(pl => pl.position === 'ST') || (sim.userSquad || [])[0] || { name: sim.userName };
        const ev = { type:'goal', minute:Math.floor(sim.clock), team:sim.userTeam, player:scorer.name, isUser:scorer.name===sim.userName, assist:null, isPenalty:false, isFreekick:false };
        sim.events.splice(sim.eventIdx,0,ev); sim.eventIdx++; this._processSimEvent(ev);
      }

      // Process events at current minute
      while (sim.eventIdx < sim.events.length && sim.events[sim.eventIdx].minute <= Math.floor(sim.clock)) {
        const ev = sim.events[sim.eventIdx];
        this._processSimEvent(ev);
        sim.eventIdx++;
        
        // Only major visible incidents pause the clock; role stats update without slowing play.
        if (['goal', 'card', 'sub_in'].includes(ev.type)) {
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

      // Full time / extra time
      const endMinute = sim.extraTimeStarted ? 120 : 90;
      if (sim.clock >= endMinute) {
        sim.clock = endMinute;
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
      if (sim.sentOff?.has(ev.player)) { ev.cancelled = true; return; }
      if (ev.team === 'home') sim.scoreHome++;
      else sim.scoreAway++;

      const tags = [];
      if (ev.isPenalty) tags.push('penalty');
      if (ev.isFreekick) tags.push('freekick');
      if (ev.assist === sim.userName) tags.push('assist');
      else if (ev.assist) tags.push('assist: ' + ev.assist);

      if (ev.isUser) { sim.liveGoals++; sim.shots++; sim.liveXp += 100; }
      if (ev.assist === sim.userName) { sim.liveAssists++; sim.liveXp += 50; }
      sim.liveRating = Math.min(10, sim.liveRating + (ev.isUser ? 1.2 : 0) + (ev.assist === sim.userName ? 0.7 : 0));
      sim.motmScores[ev.player]=(sim.motmScores[ev.player]||0)+6; sim.motmTeams[ev.player]=ev.team; if(ev.assist){sim.motmScores[ev.assist]=(sim.motmScores[ev.assist]||0)+3;sim.motmTeams[ev.assist]=ev.team;} this._refreshMotm();
      this._updateLiveSimPlayerStats();
      const label = ev.minute + "' " + ev.player + (tags.length ? ' (' + tags.join(', ') + ')' : '');
      this._addSimFeedItem(label, isUserTeam, 'goal');
      this._updateSimScore();
    } else if (ev.type === 'card') {
      if (ev.cardType === 'red') { if (!sim.sentOff) sim.sentOff = new Set(); sim.sentOff.add(ev.player); }
      const icon = ev.cardType === 'red' ? '🟥' : '🟨';
      const label = ev.minute + "' " + icon + ' ' + ev.player;
      this._addSimFeedItem(label, isUserTeam, 'card');
    } else if (ev.type === 'shot') {
      sim.shots++; sim.liveXp += 5; sim.liveRating=Math.min(10,sim.liveRating+0.05); sim.motmScores[sim.userName]=(sim.motmScores[sim.userName]||0)+0.35;sim.motmTeams[sim.userName]=sim.userTeam; this._refreshMotm(); this._updateLiveSimPlayerStats();
    } else if (ev.type === 'defensive_action' || ev.type === 'save') {
      sim.roleActions = (sim.roleActions || 0) + 1;
      sim.liveXp += 10;
      sim.liveRating = Math.min(10, sim.liveRating + 0.08);
      // Saves are now counted as shots-minus-goals (often 20+ per game), so each
      // one contributes far less to MOTM than before to keep the race fair.
      const motmValue = ev.type === 'save' ? 0.12 : 0.5;
      sim.motmScores[sim.userName]=(sim.motmScores[sim.userName]||0)+motmValue;sim.motmTeams[sim.userName]=sim.userTeam; this._refreshMotm();
      this._updateLiveSimPlayerStats();
    } else if (ev.type === 'sub_in') {
      sim.swappedIn = true;
      this._addSimFeedItem(`${ev.minute}' ${ev.player} entered the game`, true, "sub");
      const btn = document.getElementById('btn-inject-goal');
      if (btn) {
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.innerText = "😈 INJECT GOAL (CHEAT)";
      }
    }
  }

  _refreshMotm() {
    const sim=this._sim;if(!sim)return;
    const winner = sim.scoreHome === sim.scoreAway ? null : (sim.scoreHome > sim.scoreAway ? 'home' : 'away');
    let entries=Object.entries(sim.motmScores||{});
    if (winner) { const winning=entries.filter(([name])=>sim.motmTeams?.[name]===winner); if(winning.length) entries=winning; }
    entries.sort((a,b)=>b[1]-a[1]); sim.motm=entries.length?entries[0][0]:'—';
  }

  _updateLiveSimPlayerStats() {
    const sim = this._sim;
    const el = document.getElementById('sim-player-stats');
    if (!sim || !el) return;
    const playerPos=window.userCareer?.profile?.position; const isRolePlayer = ['CB', 'LB', 'RB', 'CM', 'GK'].includes(playerPos); const isAttacker=['ST','LW','RW','CAM'].includes(playerPos);
    el.innerHTML = `
      <div>⚽ Goals: <strong style="color:var(--primary);">${sim.liveGoals || 0}</strong></div>
      <div>🎯 Assists: <strong style="color:var(--accent-blue);">${sim.liveAssists || 0}</strong></div>
      ${isRolePlayer ? `<div>🛡️ ${sim.roleActionLabel}: <strong style="color:var(--accent-gold);">${sim.roleActions || 0}</strong></div>` : ''}${isAttacker ? `<div>🎯 Shots: <strong style="color:var(--accent-gold);">${sim.shots || 0}</strong></div>` : ''}
      <div>⭐ Rating: <strong style="color:var(--accent-gold);">${(sim.liveRating || 7).toFixed(1)}</strong></div>
      <div>✨ XP: <strong style="color:var(--accent-blue);">+${sim.liveXp || 0}</strong></div><div>🏅 MOTM: <strong style="color:var(--primary);">${sim.motm || '—'}</strong></div>`;
  }

  _updateSimClock() {
    const sim = this._sim;
    if (!sim) return;
    const el = document.getElementById('sim-clock');
    if (el) el.innerText = Math.min(sim.extraTimeStarted ? 120 : 90, Math.floor(sim.clock)) + "'";
  }

  _updateSimScore() {
    const sim = this._sim;
    if (!sim) return;
    const el = document.getElementById('sim-score');
    if (el) el.innerText = sim.penaltyStarted ? `${sim.scoreHome}(${sim.penHome||0}) - ${sim.scoreAway}(${sim.penAway||0})` : sim.scoreHome + ' - ' + sim.scoreAway;
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
    let userGoals = sim.events.filter(e => e.type === 'goal' && e.isUser && !e.cancelled).length;
    let oppGoals = sim.userIsHome ? sim.scoreAway : sim.scoreHome;
    let userTeamGoals = sim.userIsHome ? sim.scoreHome : sim.scoreAway;
    const assists = sim.events.filter(e => e.type === 'goal' && e.assist === sim.userName).length;

    const compKey = (sim.ctx && sim.ctx.competitionKey) || "league";
    let drew = userTeamGoals === oppGoals;
    
    let wonOnPenalties = !!sim.wonOnPenalties;
    let lostOnPenalties = !!sim.lostOnPenalties;
    let penUserScore = 0;
    let penOppScore = 0;

    const isSingleLegDecider = sim.ctx && (
      sim.ctx.isFinal || 
      sim.ctx.isLeg2 || 
      sim.ctx.id.includes('final') || 
      (compKey === 'cup' && sim.ctx.stageLabel !== 'Group Stage') || 
      ['national_knockout', 'national_final'].includes(compKey) ||
      (sim.ctx.id && (sim.ctx.id.includes('knockout') || sim.ctx.id.includes('final')))
    );

    // After live extra time, run an asynchronous named-player penalty shootout.
    if (drew && isSingleLegDecider && sim.extraTimeStarted && !sim.penaltyStarted) {
      sim.penaltyStarted = true; sim.paused = true; sim.penHome = 0; sim.penAway = 0;
      this._addSimFeedItem("⏰ 120' END OF EXTRA TIME: Still tied! Heading to Penalties!", true, 'sub');
      const homeSquad=this._getClubSquad(sim.ctx.home?.clubId).filter(pl=>pl.position!=='GK');
      const awaySquad=this._getClubSquad(sim.ctx.away?.clubId).filter(pl=>pl.position!=='GK');
      const kicks=[]; for(let i=0;i<5;i++){kicks.push({team:'home',player:homeSquad[i%homeSquad.length]?.name||'Home Player'});kicks.push({team:'away',player:awaySquad[i%awaySquad.length]?.name||'Away Player'});}
      let index=0; const take=()=>{if(!this._sim)return; const kick=kicks[index++]; const scored=Math.random()<0.74; if(scored){if(kick.team==='home')sim.penHome++;else sim.penAway++;} this._addSimFeedItem(`🥅 Pen ${Math.ceil(index/2)}: ${kick.player} ${scored?'SCORES':'MISSES'} (${sim.penHome}-${sim.penAway})`,kick.team===sim.userTeam,'sub'); this._updateSimScore(); if(index<kicks.length){setTimeout(take,5000);return;} if(sim.penHome===sim.penAway){ if(Math.random()<.5)sim.penHome++;else sim.penAway++; } sim.wonOnPenalties=(sim.userTeam==='home'?sim.penHome>sim.penAway:sim.penAway>sim.penHome);sim.lostOnPenalties=!sim.wonOnPenalties;sim.penaltyFinished=true;sim.paused=false;this._finishSim();}; setTimeout(take,5000); return;
    }

    // A tied decider transitions into a real live extra-time phase instead of ending at 90'.
    if (drew && isSingleLegDecider && !sim.extraTimeStarted) {
      sim.extraTimeStarted = true;
      sim.clock = 90;
      this._updateSimClock();
      sim.half = 3;
      sim.paused = true;
      this._updateSimPeriod('Extra Time');
      this._addSimFeedItem("⏰ 90' FULL TIME: The match is tied! Heading to Extra Time!", true, 'sub');
      // Extra-time incidents remain part of the normal event engine and update live stats/MOTM.
      const etEvents = Math.random() < 0.45 ? 1 + (Math.random() < 0.22 ? 1 : 0) : 0;
      for (let i=0;i<etEvents;i++) {
        const userScores = Math.random() < 0.5;
        const squad = userScores ? this._getClubSquad(p.currentClubId) : this._getClubSquad(sim.ctx.away?.clubId || sim.ctx.home?.clubId);
        const scorer = squad.find(pl=>pl.position==='ST') || squad[0] || {name:userScores?p.name:'Opponent'};
        sim.events.push({type:'goal',minute:91+Math.floor(Math.random()*29),team:userScores?sim.userTeam:sim.oppTeam,player:scorer.name,isUser:userScores&&scorer.name===p.name,assist:null,isPenalty:false,isFreekick:false});
      }
      sim.events.sort((a,b)=>a.minute-b.minute);
      setTimeout(()=>{if(this._sim){this._sim.paused=false;this._updateSimPeriod('Extra Time');}},4000);
      return;
    }

    // If a draw happens in an important decider, head to Extra Time & Penalties!
    if (drew && isSingleLegDecider && !sim.penaltyFinished) {
      this._addSimFeedItem("⏰ 90' FULL TIME: The match is tied! Heading to Extra Time!", true, "sub");
      
      // Extra time was already played live above; do not simulate it again.
      let etUserGoals = 0;
      let etOppGoals = 0;
      if (!sim.extraTimeStarted && Math.random() < 0.15) {
        if (Math.random() < 0.5) etUserGoals = 1;
        else etOppGoals = 1;
      }
      
      if (etUserGoals > 0 || etOppGoals > 0) {
        if (etUserGoals > 0) {
          userTeamGoals += 1;
          if (sim.userIsHome) sim.scoreHome += 1;
          else sim.scoreAway += 1;
          this._addSimFeedItem("⚽ 108' GOAL!!! User Team scores in extra time!", true, "goal");
        } else {
          oppGoals += 1;
          if (sim.userIsHome) sim.scoreAway += 1;
          else sim.scoreHome += 1;
          this._addSimFeedItem("⚽ 114' GOAL!!! Opponent scores in extra time!", false, "goal");
        }
        this._updateSimScore();
        drew = false; // no longer tied!
      } else {
        this._addSimFeedItem("⏰ 120' END OF EXTRA TIME: Still tied! Heading to Penalties!", true, "sub");
      }

      // Simulate Penalty Shootout if still tied!
      if (drew) {
        let userPenTaken = 0;
        let oppPenTaken = 0;
        
        while (userPenTaken < 5 || oppPenTaken < 5 || penUserScore === penOppScore) {
          if (userPenTaken === oppPenTaken) {
            userPenTaken++;
            const scored = Math.random() < 0.75; // 75% pen conversion rate
            if (scored) {
              penUserScore++;
              this._addSimFeedItem(`⚽ Pen ${userPenTaken}: User Team SCORES! (${penUserScore}-${penOppScore})`, true, "goal");
            } else {
              this._addSimFeedItem(`🧤 Pen ${userPenTaken}: User Team SHOT SAVED! (${penUserScore}-${penOppScore})`, false, "card");
            }
          } else {
            oppPenTaken++;
            const scored = Math.random() < 0.70;
            if (scored) {
              penOppScore++;
              this._addSimFeedItem(`⚽ Pen ${oppPenTaken}: Opponent SCORES! (${penUserScore}-${penOppScore})`, false, "goal");
            } else {
              this._addSimFeedItem(`🧤 Pen ${oppPenTaken}: Opponent SHOT SAVED! (${penUserScore}-${penOppScore})`, true, "card");
            }
          }

          if (userPenTaken >= 5 && oppPenTaken >= 5 && penUserScore !== penOppScore) {
            break;
          }
        }

        if (penUserScore > penOppScore) {
          wonOnPenalties = true;
          this._addSimFeedItem(`🏆 PENALTY OUTCOME: User Team WINS ${penUserScore}-${penOppScore} on penalties!`, true, "sub");
        } else {
          lostOnPenalties = true;
          this._addSimFeedItem(`❌ PENALTY OUTCOME: Opponent WINS ${penOppScore}-${penUserScore} on penalties!`, false, "sub");
        }
      }
    }

    if (sim.forceWin && userTeamGoals <= oppGoals) { while (userTeamGoals <= oppGoals) { const ev={type:'goal',minute:90,team:sim.userTeam,player:p.name,isUser:true,assist:null,isPenalty:false,isFreekick:false}; this._processSimEvent(ev); userTeamGoals++; } this._updateSimScore(); }
    sim.finished = true;
    if (sim.timer) clearInterval(sim.timer);
    const won = (userTeamGoals > oppGoals) || wonOnPenalties;
    const finalDrew = (userTeamGoals === oppGoals) && !wonOnPenalties && !lostOnPenalties;
    const p = window.userCareer.profile;

    let baseRating = 6.5;
    baseRating += userGoals * 1.6;
    baseRating += assists * 1.1;
    baseRating += (won ? 0.7 : (finalDrew ? 0.1 : -0.6));
    baseRating += (p.ovr - 70) * 0.04; // overall quality modifier

    // ---- Performance deductions (bad games now score below average) ----
    const isAttackerRole = ['ST', 'LW', 'RW', 'CAM'].includes(p.position);
    const missedShots = Math.max(0, (sim.shots || 0) - userGoals);
    // 1. Wayward shooting: every shot that didn't score lowers the rating (cap -2.0).
    if (isAttackerRole) baseRating -= Math.min(2.0, missedShots * 0.15);
    // 2. Ghost game: an attacking player who barely touched the ball (no goals,
    //    no assists, max 1 shot, no role actions) is marked down heavily, so a
    //    single lucky assist no longer guarantees an above-average rating.
    if (isAttackerRole && userGoals === 0 && assists === 0 && (sim.shots || 0) <= 1 && (sim.roleActions || 0) === 0) {
      baseRating -= 1.4;
    }
    // 3. Heavy concession: conceding 3+ is a bad day for defenders and keepers alike.
    if (oppGoals >= 3) baseRating -= 0.3;

    baseRating += (Math.random() * 1.0 - 0.5); // small organic variation

    const rating = parseFloat(Math.min(10.0, Math.max(4.0, baseRating)).toFixed(1));

    const outcome = won ? 'win' : (finalDrew ? 'draw' : 'loss');
    let { xpEarned, matchMoney } = window.userCareer.recordMatchPerformance(
      userGoals, 
      assists, 
      80, 
      rating, 
      compKey, 
      !sim.isBench || sim.swappedIn, 
      outcome, 
      oppGoals,
      sim.roleActions
    );

    // Every role action is worth 10 XP during the match simulation.
    if (sim.roleActions > 0) {
      const roleXp = sim.roleActions * 10;
      window.userCareer.addXp(roleXp);
      xpEarned += roleXp;
    }

    if (sim.shots > 0) {
      p.shotsOnGoal = (p.shotsOnGoal || 0) + sim.shots;
      window.userCareer.stats.season.shotsOnGoal = (window.userCareer.stats.season.shotsOnGoal || 0) + sim.shots;
    }

    // Sponsor offers react to every performance; an active deal pays once per completed match.
    this.updateSponsorOffersAfterMatch(userGoals, rating, outcome === 'win', sim.roleActions || 0);
    this.updateSocialAfterMatch(userGoals, assists, outcome === 'win', compKey, sim.roleActions || 0);
    const sponsor = p.sponsorship?.active;
    if (sponsor) {
      p.bankBalance += sponsor.weeklyWage;
      p.totalCareerEarnings += sponsor.weeklyWage;
      matchMoney += sponsor.weeklyWage;
    }

    // Record actual teammate goals/assists for Squad tab stats view!
    const squad = sim.ctx?.participantType === 'national' ? this._getClubSquad(sim.ctx.home?.name === p.nationality ? sim.ctx.home?.clubId : sim.ctx.away?.clubId) : this._getClubSquad(p.currentClubId);
    // Goalkeeper save model: saves = opponent shots - opponent goals (both keepers).
    const userGkSaves = Math.max(0, (sim.oppTeamShots || 0) - oppGoals);
    const oppGkSaves = Math.max(0, (sim.userTeamShots || 0) - userTeamGoals);
    squad.forEach(tm => {
      if (!tm.stats) {
        tm.stats = {
          season: { goals: 0, assists: 0, matches: 0 },
          league: { goals: 0, assists: 0, matches: 0 },
          cup: { goals: 0, assists: 0, matches: 0 },
          ucl: { goals: 0, assists: 0, matches: 0 }
        };
      }
      tm.stats.season.matches = (tm.stats.season.matches || 0) + 1;
      const key = compKey.includes('cup') ? 'cup' : (compKey.includes('ucl') ? 'ucl' : 'league');
      if (!(compKey.endsWith('_qual') && compKey !== 'cup_qual') && tm.stats[key]) {
        tm.stats[key].matches = (tm.stats[key].matches || 0) + 1;
      }
      if (['CB','LB','RB','CM'].includes(tm.position)) tm.defensiveActions = (tm.defensiveActions || 0) + Math.floor(Math.random() * 14) + 2;
      else if (tm.position === 'GK') tm.goalkeeperSaves = (tm.goalkeeperSaves || 0) + userGkSaves;
      else if (['ST','LW','RW','CAM'].includes(tm.position)) tm.shotsOnGoal = (tm.shotsOnGoal || 0) + this._skewedShots(11);
    });
    // The opponent goalkeeper's saves come from the user's team shot count.
    // (sim.oppSquad excludes keepers, so fetch the full persistent squad.)
    const oppClubId = sim.userIsHome ? (sim.ctx.away?.clubId || sim.ctx.away?.id) : (sim.ctx.home?.clubId || sim.ctx.home?.id);
    const oppFullSquad = this._getClubSquad(oppClubId);
    const oppGk = (oppFullSquad || []).find(tm => tm.position === 'GK');
    if (oppGk) oppGk.goalkeeperSaves = (oppGk.goalkeeperSaves || 0) + oppGkSaves;

    sim.events.forEach(ev => {
      if (ev.type === 'goal' && ev.team === sim.userTeam) {
        if (ev.player !== sim.userName) {
          const teammate = squad.find(tm => tm.name === ev.player);
          if (teammate) {
            if (!teammate.stats) {
              teammate.stats = {
                season: { goals: 0, assists: 0, matches: 0 },
                league: { goals: 0, assists: 0, matches: 0 },
                cup: { goals: 0, assists: 0, matches: 0 },
                ucl: { goals: 0, assists: 0, matches: 0 }
              };
            }
            teammate.stats.season.goals += 1;
            const key = compKey.includes('cup') ? 'cup' : (compKey.includes('ucl') ? 'ucl' : 'league');
            if (teammate.stats[key]) teammate.stats[key].goals += 1;
          }
        }
        
        if (ev.assist && ev.assist !== sim.userName) {
          const teammate = squad.find(tm => tm.name === ev.assist);
          if (teammate) {
            if (!teammate.stats) {
              teammate.stats = {
                season: { goals: 0, assists: 0, matches: 0 },
                league: { goals: 0, assists: 0, matches: 0 },
                cup: { goals: 0, assists: 0, matches: 0 },
                ucl: { goals: 0, assists: 0, matches: 0 }
              };
            }
            teammate.stats.season.assists += 1;
            const key = compKey.includes('cup') ? 'cup' : (compKey.includes('ucl') ? 'ucl' : 'league');
            if (teammate.stats[key]) teammate.stats[key].assists += 1;
          }
        }
      }
    });

    window.leaguesEngine.simulateGameweek(
      window.userCareer.profile.currentClubId,
      { 
        userGoals: userTeamGoals, 
        oppGoals: oppGoals,
        wonOnPenalties: wonOnPenalties,
        lostOnPenalties: lostOnPenalties,
        penUserScore: penUserScore,
        penOppScore: penOppScore
      },
      sim.ctx,
      window.userCareer.profile.nationality
    );

    if (window.leaguesEngine.pendingUclNotice) {
      const notice = window.leaguesEngine.pendingUclNotice;
      window.leaguesEngine.pendingUclNotice = null;
      setTimeout(() => {
        this.showGameNotice(notice.title, notice.body);
      }, 1000);
    }

    // League/trophy awards fire as soon as ALL club competitions are done (league,
    // UCL, domestic cup) — right after the final club game, never delayed until the
    // national tournament segment ends. The Ballon d'Or ceremony waits for the
    // entire season (including World Cup/Euros) to finish.
    const allClubPlayed = window.leaguesEngine.seasonSchedule && window.leaguesEngine.seasonSchedule.every(g => g.played || g.competitionKey?.startsWith('national_'));
    if (allClubPlayed) {
      setTimeout(() => {
        this.checkLeagueEndAwards();
      }, 1500);
    }
    const allPlayed = window.leaguesEngine.seasonSchedule && window.leaguesEngine.seasonSchedule.every(g => g.played);
    if (allPlayed) {
      setTimeout(() => {
        this.checkBallonDorCeremony();
      }, 2500);
    }

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
          <div style="font-size:24px;font-weight:900;color:#fff;margin-bottom:14px;">${sim.penaltyStarted ? `${sim.scoreHome}(${sim.penHome}) - ${sim.scoreAway}(${sim.penAway})` : `${sim.scoreHome} - ${sim.scoreAway}`}</div>
          <div style="display:flex;justify-content:space-around;font-size:13px;flex-wrap:wrap;gap:8px;">
            <div>⚽ Goals: <strong style="color:var(--primary);">${userGoals}</strong></div>
            <div>🎯 Assists: <strong style="color:var(--accent-blue);">${assists}</strong></div>
            <div>⭐ Rating: <strong style="color:var(--accent-gold);">${rating}</strong></div>
            ${['CB','LB','RB','CM','GK'].includes(window.userCareer.profile.position) ? `<div>🛡️ ${sim.roleActionLabel}: <strong style="color:var(--accent-gold);">${sim.roleActions || 0}</strong></div>` : ''}
            ${['ST','LW','RW','CAM'].includes(window.userCareer.profile.position) ? `<div>🎯 Shots: <strong style="color:var(--accent-gold);">${sim.shots || 0}</strong></div>` : ''}
            <div>🏅 MOTM: <strong style="color:var(--primary);">${sim.motm || '—'}</strong></div>
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

  changeSimSpeed(direction) { const sim=this._sim;if(!sim)return;const speeds=[0.25,0.5,0.75,1,1.5,2,2.5,3];let i=speeds.indexOf(sim.speed||1);sim.speed=speeds[Math.max(0,Math.min(speeds.length-1,i+direction))];const el=document.getElementById('sim-speed');if(el)el.innerText=`${sim.speed}x`; }

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
    this.switchTab('dashboard');
  }

  advanceSeason() {
    const notes = window.userCareer.advanceSeason();
    this._contractOffers = [];
    this._contractOfferSeason = null;
    const sponsorship = window.userCareer.profile.sponsorship;
    if (sponsorship?.active) {
      sponsorship.active.seasonsLeft--;
      if (sponsorship.active.seasonsLeft <= 0) { sponsorship.active = null; this.generateSponsorOffers(); }
    } else if (sponsorship?.firstMatchSeen) this.generateSponsorOffers();
    this.saveCareer(false);

    // Fallback: ensure a new season with matches is available
    const p = window.userCareer.profile;
    if (window.leaguesEngine && !window.leaguesEngine.getNextMatch(p.currentClubId, p.nationality)) {
      const leagueId = window.leaguesEngine.findLeagueForClub(p.currentClubId) || window.leaguesEngine.currentLeagueId;
      window.leaguesEngine.initLeague(leagueId);
    }

    const notesHtml = notes.map(n => `<div style="margin-bottom:8px;font-size:13px;color:#cbd5e1;line-height:1.6;text-align:left;">${n}</div>`).join('') || '<div style="font-size:14px;color:#cbd5e1;">Fresh fixtures and new league campaign generated!</div>';
    this.showGameNotice(
      `🏆 Season Advanced to ${window.userCareer.stats.season.year}!`,
      `
        <div style="font-size:54px;margin-bottom:12px;">🗓️</div>
        <p style="font-size:15px;color:#fff;font-weight:700;margin-bottom:14px;">Welcome to the new season campaign!</p>
        ${notesHtml}
      `
    );
    this.refreshUI();
  }

  renderPastSeasons() {
    const container = document.getElementById('past-seasons-container');
    const tabBtn = document.querySelector('.tab-btn[data-tab="pastseasons"]');
    if (!container) return;

    const history = (window.userCareer.stats.career && window.userCareer.stats.career.seasonHistory) || [];

    if (tabBtn) {
      tabBtn.style.display = ''; // Keep it always visible as requested!
    }

    if (history.length === 0) {
      container.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 20px;">No completed past seasons yet. Complete your current season to view career history!</p>`;
      return;
    }

    container.innerHTML = `
      <table class="data-table" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="padding: 12px 16px; text-align: left;">Season</th>
            <th style="padding: 12px 16px; text-align: left;">Age</th>
            <th style="padding: 12px 16px; text-align: left;">Club</th>
            <th style="padding: 12px 16px; text-align: center;">OVR</th>
            <th style="padding: 12px 16px; text-align: center;">Matches</th>
            <th style="padding: 12px 16px; text-align: center;">Goals</th>
            <th style="padding: 12px 16px; text-align: center;">Assists</th>
            <th style="padding: 12px 16px; text-align: center;">Avg Rating</th>
            <th style="padding: 12px 16px; text-align: right;">Earnings</th>
          </tr>
        </thead>
        <tbody>
          ${history.map(s => `
            <tr>
              <td style="padding: 16px; font-weight: 800; color: #fff; text-align: left;"><strong>${s.year}</strong></td>
              <td style="padding: 16px; text-align: left;">${s.age} y/o</td>
              <td style="padding: 16px; text-align: left;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  ${window.leaguesEngine.getClubBadgeHtml(s.clubName, 22)} <strong>${s.clubName}</strong>
                </div>
              </td>
              <td style="padding: 16px; text-align: center;"><span style="font-size: 14px; font-weight: 800; color: #ffd700;">${s.ovr}</span></td>
              <td style="padding: 16px; text-align: center;">${s.matches}</td>
              <td style="padding: 16px; text-align: center; color: var(--primary); font-weight: 800;">⚽ ${s.goals}</td>
              <td style="padding: 16px; text-align: center; color: var(--accent-blue); font-weight: 800;">🎯 ${s.assists}</td>
              <td style="padding: 16px; text-align: center; color: var(--accent-gold); font-weight: 800;">${s.avgRating} ⭐</td>
              <td style="padding: 16px; text-align: right; color: #00ff88; font-weight: 800;">+$${(s.earnings || 0).toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  openCheatKeybindsModal() {
    this.openModal('modal-cheat-keybinds');
    this.updateRebindButtonsUI();
  }

  startRebind(target) {
    this.rebindTarget = target;
    const btnMap = {
      own_goal: 'rebind-own-goal',
      team_goal: 'rebind-team-goal',
      opp_goal: 'rebind-opp-goal',
      sub_in: 'rebind-sub-in'
    };
    const el = document.getElementById(btnMap[target]);
    if (el) {
      el.innerText = "Press key...";
      el.style.color = "#a1a1aa";
    }
  }

  updateRebindButtonsUI() {
    const btnMap = {
      own_goal: 'rebind-own-goal',
      team_goal: 'rebind-team-goal',
      opp_goal: 'rebind-opp-goal',
      sub_in: 'rebind-sub-in'
    };
    Object.keys(btnMap).forEach(target => {
      const el = document.getElementById(btnMap[target]);
      if (el) {
        el.innerText = (this.cheatKeybinds[target] || '').toUpperCase();
        el.style.color = "";
      }
    });
  }

  resetCheatKeybinds() {
    this.cheatKeybinds = {
      own_goal: "m",
      team_goal: "p",
      opp_goal: "o",
      sub_in: "l",
      role_action: "k",
      user_assist: "i",
      force_win: "w"
    };
    localStorage.setItem('career_mode_cheat_keybinds', JSON.stringify(this.cheatKeybinds));
    this.updateRebindButtonsUI();
  }

  toggleNoGoalSimulation() { const p=window.userCareer.profile; p.cheatNoGoals=!p.cheatNoGoals; this.syncCheatModeUI(); this.saveCareer(false); }

  injectRoleAction() {
    const sim=this._sim,p=window.userCareer?.profile;if(!sim||!p)return;
    if (['CB','LB','RB','CM','GK'].includes(p.position)) { sim.roleActions=(sim.roleActions||0)+1; sim.liveXp=(sim.liveXp||0)+10; }
    else if (['ST','LW','RW','CAM'].includes(p.position)) { sim.shots=(sim.shots||0)+1; sim.liveXp=(sim.liveXp||0)+5; }
    sim.liveRating=Math.min(10,(sim.liveRating||6.5)+0.08); this._updateLiveSimPlayerStats();
  }

  injectAssistGoal() {
    const sim=this._sim,p=window.userCareer?.profile;if(!sim||!p)return;
    const squad=this._getClubSquad(p.currentClubId).filter(pl=>pl.name!==p.name&&pl.position!=='GK');
    const scorer=squad.length?squad[Math.floor(Math.random()*squad.length)].name:'Teammate';
    const ev={type:'goal',minute:Math.floor(sim.clock),team:sim.userTeam,player:scorer,isUser:false,assist:p.name,isPenalty:false,isFreekick:false}; sim.events.splice(sim.eventIdx,0,ev); sim.eventIdx++; sim.paused=true; this._processSimEvent(ev); setTimeout(()=>{if(this._sim)this._sim.paused=false;},2000);
  }

  injectCustomGoal(isUser, isOpponent) {
    const sim = this._sim;
    if (!sim || sim.finished) return;

    const p = window.userCareer?.profile;
    
    // Check if benched
    if (p && p.squadRole === "Bench Player" && !sim.swappedIn && !isOpponent) {
      this.showGameNotice("⚠️ Benched", "You are currently sitting on the bench! You cannot inject goals until you get swapped into the match (Hotkey: L).");
      return;
    }

    sim.paused = true;

    // Roll goal type: Penalty: 8%, Free kick: 4%, Normal: 88%
    const r = Math.random();
    let isPenalty = false;
    let isFreekick = false;
    let assist = null;

    if (r < 0.08) {
      isPenalty = true;
    } else if (r < 0.12) {
      isFreekick = true;
    } else {
      // Normal goal: 40% chance of assist from teammate
      if (Math.random() < 0.40) {
        const opponentClubId = sim.userIsHome ? sim.ctx.away?.clubId : sim.ctx.home?.clubId;
    const squad = (isOpponent ? (sim.oppSquad || this._getClubSquad(opponentClubId)) : this._getClubSquad(p.currentClubId)).filter(pl => pl.name !== p.name && pl.position !== 'GK');
        if (squad.length > 0) {
          assist = squad[Math.floor(Math.random() * squad.length)].name;
        }
      }
    }

    const opponentClubId = sim.userIsHome ? sim.ctx.away?.clubId : sim.ctx.home?.clubId;
    const squad = (isOpponent ? (sim.oppSquad || this._getClubSquad(opponentClubId)) : this._getClubSquad(p.currentClubId)).filter(pl => pl.name !== p.name && pl.position !== 'GK');
    let scorerName = "";
    if (isUser) {
      scorerName = p.name;
    } else if (isOpponent) {
      scorerName = squad.length ? squad[Math.floor(Math.random() * squad.length)].name : 'Opponent';
    } else {
      if (squad.length) { const weights={ST:45,LW:25,RW:25,CAM:15,CM:6,LB:2,RB:2,CB:1}; const total=squad.reduce((n,pl)=>n+(weights[pl.position]||1),0); let roll=Math.random()*total; scorerName=(squad.find(pl=>(roll-=(weights[pl.position]||1))<=0)||squad[0]).name; } else scorerName='Teammate';
    }

    const minute = Math.floor(sim.clock);
    const ev = {
      type: 'goal',
      minute: minute,
      team: isOpponent ? sim.oppTeam : sim.userTeam,
      player: scorerName,
      isUser: isUser,
      assist,
      isPenalty,
      isFreekick
    };

    sim.events.splice(sim.eventIdx, 0, ev);
    sim.eventIdx++;
    this._processSimEvent(ev);
    this._updateSimScore();

    setTimeout(() => { if (this._sim) this._sim.paused = false; }, 2000);
  }

  injectCustomSubIn() {
    const sim = this._sim;
    if (!sim || !sim.isBench || sim.swappedIn || sim.finished) return;

    sim.swappedIn = true;
    const p = window.userCareer?.profile;
    const minute = Math.floor(sim.clock);
    
    // Log sub-in message in ticker feed
    this._addSimFeedItem(`${minute}' ${p.name} entered the game`, true, "sub");

    // Filter out any pre-generated sub-in event to prevent duplicates!
    sim.events = sim.events.filter(ev => ev.type !== 'sub_in');

    // Pause clock for 2.0s
    sim.paused = true;
    setTimeout(() => { if (this._sim) this._sim.paused = false; }, 2000);
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
    if (!this.noticeQueue) this.noticeQueue = [];
    
    // If modal is active, queue this notice so we display them sequentially!
    const modal = document.getElementById('modal-game-notice');
    if (modal && modal.classList.contains('active')) {
      this.noticeQueue.push({ title, bodyHtml });
      return;
    }

    const titleEl = document.getElementById('game-notice-title');
    const bodyEl = document.getElementById('game-notice-body');
    if (titleEl) titleEl.innerText = title;
    if (bodyEl) bodyEl.innerHTML = bodyHtml;
    this.openModal('modal-game-notice');
  }

  closeGameNotice() {
    this.closeModal('modal-game-notice');
    if (this.noticeQueue && this.noticeQueue.length > 0) {
      const next = this.noticeQueue.shift();
      setTimeout(() => {
        this.showGameNotice(next.title, next.bodyHtml);
      }, 300);
    }
  }

  populateSquadTeamSelect() {
    const select = document.getElementById('squad-team-select');
    if (!select) return;

    const p = window.userCareer?.profile;
    const isNational = this.squadCategory === 'national';

    let html = '';
    if (isNational) {
      // Group national teams by star power for a highly intuitive, gorgeous list!
      const starsMap = { 
        5: "⭐⭐⭐⭐⭐ Elite World Power", 
        4: "⭐⭐⭐⭐ Strong Power", 
        3: "⭐⭐⭐ Moderate Power", 
        2: "⭐⭐ Growing Power", 
        1: "⭐ Emerging Power" 
      };
      for (let s = 5; s >= 1; s--) {
        const nats = window.leaguesEngine.nationalTeams.filter(n => n.stars === s);
        if (nats.length > 0) {
          html += `<optgroup label="🌍 ${starsMap[s]}">`;
          nats.forEach(n => {
            html += `<option value="nat_${n.id}" ${p && p.nationality === n.name ? 'selected' : ''}>${n.flag} ${n.name}</option>`;
          });
          html += `</optgroup>`;
        }
      }
    } else {
      const userClubId = p ? p.currentClubId : "plymouth";
      // Group clubs by league division!
      Object.keys(window.leaguesEngine.leagues).forEach(leagueId => {
        const lg = window.leaguesEngine.leagues[leagueId];
        html += `<optgroup label="${lg.name} (${lg.country})">`;
        lg.clubs.forEach(c => {
          html += `<option value="${c.id}" ${c.id === userClubId ? 'selected' : ''}>${c.name}</option>`;
        });
        html += `</optgroup>`;
      });
    }

    select.innerHTML = html;
  }

  filterSquadClubs(query) {
    const select = document.getElementById('squad-team-select');
    if (!select) return;

    const lowerQuery = query.toLowerCase();
    const isNational = this.squadCategory === 'national';
    let html = '';
    
    if (isNational) {
      const matched = window.leaguesEngine.nationalTeams.filter(n => n.name.toLowerCase().includes(lowerQuery));
      if (matched.length > 0) {
        html += `<optgroup label="🌍 Matched Countries">`;
        matched.forEach(n => {
          html += `<option value="nat_${n.id}">${n.flag} ${n.name}</option>`;
        });
        html += `</optgroup>`;
      }
    } else {
      const p = window.userCareer?.profile;
      const userClubId = p ? p.currentClubId : "plymouth";
      Object.keys(window.leaguesEngine.leagues).forEach(leagueId => {
        const lg = window.leaguesEngine.leagues[leagueId];
        const matchedClubs = lg.clubs.filter(c => c.name.toLowerCase().includes(lowerQuery));
        
        if (matchedClubs.length > 0) {
          html += `<optgroup label="${lg.name} (${lg.country})">`;
          matchedClubs.forEach(c => {
            html += `<option value="${c.id}" ${c.id === userClubId ? 'selected' : ''}>${c.name}</option>`;
          });
          html += `</optgroup>`;
        }
      });
    }

    select.innerHTML = html || `<option value="">No matches found...</option>`;
  }

  checkLeagueEndAwards() {
    const p = window.userCareer.profile;
    const s = window.userCareer.stats.season;
    
    // Check if we already processed awards for this season
    if (p.seasonAwardsProcessed === s.year) return;
    p.seasonAwardsProcessed = s.year;

    // Get final standing of user's club
    const userClubId = p.currentClubId;
    const standings = window.leaguesEngine.standings;
    const userRank = standings.findIndex(cl => cl.clubId === userClubId) + 1;
    const currentLeague = window.leaguesEngine.getLeagueMeta();
    const isDiv1 = currentLeague.tier === 1;

    // Notice 1: Finished Rank (League Finish)
    let rankTitle = `League Finished - ${userRank} Place!`;
    let rankBody = `<div style="font-size:54px;margin-bottom:12px;">📈</div><p style="font-size:16px;color:#fff;">You and <strong>${p.currentClubName}</strong> have finished the season in <strong>${userRank} place</strong> in the ${currentLeague.name}!</p>`;
    
    if (userRank === 1) {
      rankTitle = `🏆 LEAGUE CHAMPIONS!!!`;
      rankBody = `<div style="font-size:54px;margin-bottom:12px;">🏆</div><p style="font-size:16px;color:#fff;">CONGRATULATIONS! You finished <strong>1st Place</strong> in the ${currentLeague.name}! You are the League Champions!</p>`;
    }
    
    this.showGameNotice(rankTitle, rankBody);

    // Notice 2: Trophy (if finished 1st)
    if (userRank === 1) {
      const trophyTitle = `🏆 Trophy Awarded!`;
      let trophyBody = `<div style="font-size:54px;margin-bottom:12px;">🎖️</div><p style="font-size:16px;color:#fff;">Your team has been awarded the official <strong>${currentLeague.name} Trophy</strong>!</p>`;
      
      // Award trophy to profile
      if (isDiv1) {
        p.trophies.league_d1 = (p.trophies.league_d1 || 0) + 1;
        window.userCareer.awardFirstTrophySkill('league_d1', 1);
        p.awardsCabinet.leagueTitles.push(`${s.year} ${currentLeague.name}`);
        trophyBody += `<p style="font-size:13px;color:var(--accent-gold);margin-top:10px;">Division 1 League Trophy added to your silverware cabinet!</p>`;
      } else {
        p.trophies.league_d2 = (p.trophies.league_d2 || 0) + 1;
        window.userCareer.awardFirstTrophySkill('league_d1', 1);
        p.awardsCabinet.leagueTitles.push(`${s.year} ${currentLeague.name}`);
        trophyBody += `<p style="font-size:13px;color:var(--accent-gold);margin-top:10px;">Division 2 League Trophy added to your silverware cabinet!</p>`;
      }
      this.showGameNotice(trophyTitle, trophyBody);
    }

    // Notice 3: League Golden Boot (if won)
    const gbResult = window.userCareer.checkGoldenBoot('league');
    if (gbResult && gbResult.won) {
      p.trophies.golden_boot = (p.trophies.golden_boot || 0) + 1;
      if (!p.awardsCabinet.goldenBoots) {
        p.awardsCabinet.goldenBoots = { league: 0, cup: 0, ucl: 0, international: 0 };
      }
      p.awardsCabinet.goldenBoots.league = (p.awardsCabinet.goldenBoots.league || 0) + 1;
      
      const gbTitle = `👟 GOLDEN BOOT WINNER!!!`;
      const gbBody = `<div style="font-size:54px;margin-bottom:12px;">⚡</div><p style="font-size:16px;color:#fff;">UNBELIEVABLE! You are the <strong>Top Scorer</strong> of the ${currentLeague.name} with an astounding <strong>${gbResult.userGoals} goals</strong>!</p><p style="font-size:13px;color:var(--accent-gold);margin-top:10px;">The Golden Boot Award has been added to your trophies cabinet!</p>`;
      this.showGameNotice(gbTitle, gbBody);
    }

    // Social media follower rewards for newly-awarded silverware apply IMMEDIATELY
    // (no waiting until the next season's first match). League title +5M, Golden
    // Boot +15M etc. — see updateSocialAfterMatch's trophy table.
    this.updateSocialAfterMatch(0, 0, false, 'league', 0);
    this.saveCareer(false);
  }

  // Ballon d'Or ceremony: runs only after the ENTIRE season (including World Cup,
  // Euros/Copa/AFCON) is finished, so international glory counts toward the award.
  checkBallonDorCeremony() {
    const p = window.userCareer.profile;
    const s = window.userCareer.stats.season;

    // Check if we already processed the ceremony for this season
    if (p.ballonAwardsProcessed === s.year) return;
    p.ballonAwardsProcessed = s.year;

    // Ballon d'Or Winner selection!
    const bResult = window.userCareer.checkBallonDorWinner();
    if (bResult) {
      if (bResult.userWon) {
        p.trophies.ballon_dor = (p.trophies.ballon_dor || 0) + 1;
        if (!p.awardsCabinet.ballonDors) {
          p.awardsCabinet.ballonDors = [];
        }
        p.awardsCabinet.ballonDors.push(`${s.year} Ballon d'Or`);
        
        const bTitle = `👑 BALLON D'OR WINNER!!!`;
        const bBody = `<div style="font-size:54px;margin-bottom:12px;">👑</div><p style="font-size:16px;color:#fff;">HISTORIC GLORY! You have been named the best player in the world and officially awarded the prestigious <strong>Ballon d'Or</strong> for your legendary individual campaign!</p><p style="font-size:13px;color:var(--accent-gold);margin-top:10px;">The Golden Ball trophy has been placed in your trophies cabinet!</p>`;
        this.showGameNotice(bTitle, bBody);
      } else {
        const bTitle = `👑 Ballon d'Or Ceremony`;
        const bBody = `<div style="font-size:54px;margin-bottom:12px;">🎭</div><p style="font-size:15px;color:#fff;">The annual Ballon d'Or awards ceremony has concluded.</p><p style="font-size:14px;color:#e2e8f0;margin-top:8px;">The prestigious trophy for this season has been awarded to <strong>${bResult.winnerName}</strong> (<em>${bResult.winnerClub}</em>) after an unbelievable individual campaign!</p><p style="font-size:13px;color:var(--text-muted);margin-top:10px;">(Your Ballon d'Or rating score was <strong>${Math.round(bResult.userScore)}</strong> vs winner's score of <strong>${Math.round(bResult.winnerScore)}</strong>. Keep upgrading your attributes to win next year!)</p>`;
        this.showGameNotice(bTitle, bBody);
      }
      // Ballon d'Or (+60M) and international golden boot followers apply at once.
      this.updateSocialAfterMatch(0, 0, false, 'national_final', 0);
      this.saveCareer(false);
    }
  }


}

window.app = new FootballApp();
document.addEventListener('DOMContentLoaded', () => {
  window.app.init();
  window.managerUI.bind();
});
