/**
 * Player Career Manager (Financial Contracts, Attributes, Aging, Stats, Save/Load)
 */

class PlayerCareer {
  constructor() {
    this.profile = {
      name: "Jack Sterling",
      nationality: "England",
      flag: "🇬🇧",
      age: 18,
      height: 182,
      weight: 75,
      position: "ST",
      
      skinColor: "#f3c299",
      hairStyle: "short",
      hairColor: "#3d2314",
      bootColor: "#00ff88",
      kitNumber: 9,
      
      attributes: {
        pace: 75,
        shooting: 72,
        passing: 68,
        dribbling: 74,
        defending: 45,
        physical: 70,
        positioning: 70,
        def_positioning: 70,
        diving: 70
      },
      
      ovr: 72,
      skillPoints: 1,
      xp: 0,
      xpToNextLevel: 1000,
      level: 0,
      form: 8.0,
      
      currentClubId: "plymouth",
      currentClubName: "Plymouth Argyle 🇬🇧",
      weeklyWage: 2500,
      goalBonus: 500,
      assistBonus: 250,
      bankBalance: 10000,
      totalCareerEarnings: 10000,
      marketValue: 1500000,
      growthArchetype: "pro", // Default professionality level: "goat", "pro", "good", "avg", "under_avg"
      hasTrainedThisMatchday: false, // Tracks if player completed their training for this matchday
      trophies: {
        league_d1: 0,
        league_d2: 0,
        cup: 0,
        continental: 0,
        world_cup: 0,
        ballon_dor: 0,
        golden_boot: 0,
        euros_copas: 0, // Euro Cup / Copa America championships
        national_cap: 0
      },
      awardsCabinet: {
        leagueTitles: [], // List of league championships, e.g., ["2026 TFF 1. Lig"]
        goldenBoots: {
          league: 0,
          cup: 0,
          ucl: 0,
          international: 0
        },
        domesticCups: [], // List of cup trophies, e.g., ["2027 FA Cup"]
        championsLeagues: [], // e.g., ["2029 UEFA Champions League"]
        internationalCups: [], // e.g., ["2028 Euro Cup", "2030 World Cup"]
        ballonDors: [], // list of years won, e.g., ["2031 Ballon d'Or"]
        clubWorldCups: [] // e.g., ["2029 Club World Cup"]
      }
    };

    this.stats = {
      season: {
        year: 2026,
        matches: 0,
        goals: 0,
        assists: 0,
        hattricks: 0,
        avgRating: 0.0,
        ratingsHistory: [],
        earningsThisSeason: 0,
        compStats: {
          league: { goals: 0, assists: 0, matches: 0 },
          cup: { goals: 0, assists: 0, matches: 0 },
          ucl: { goals: 0, assists: 0, matches: 0 }
        }
      },
      career: {
        totalMatches: 0,
        totalGoals: 0,
        totalAssists: 0,
        totalHattricks: 0,
        clubHistory: [
          { club: "Plymouth Argyle 🇬🇧", yearStart: 2026, yearEnd: 2026, matches: 0, goals: 0 }
        ]
      }
    };

    this.calculateOvr();
  }

  calculateOvr() {
    const a = this.profile.attributes;
    
    // Ensure new attributes are defined on old save loads smoothly!
    if (a.positioning === undefined) a.positioning = 70;
    if (a.def_positioning === undefined) a.def_positioning = 70;
    if (a.diving === undefined) a.diving = 70;

    let ovr = 70;

    switch(this.profile.position) {
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
    const arch = this.profile.growthArchetype || "pro";
    if (arch === 'pro') maxCeiling = 94;
    else if (arch === 'good') maxCeiling = 89;
    else if (arch === 'avg') maxCeiling = 84;
    else if (arch === 'under_avg') maxCeiling = 79;

    this.profile.ovr = Math.min(maxCeiling, Math.max(40, Math.round(ovr)));

    let threshold = 82;
    if (window.leaguesEngine) {
      // Find the player's current club to check its stars
      const clubId = this.profile.currentClubId;
      const club = window.leaguesEngine.standings?.find(s => s.clubId === clubId) || window.leaguesEngine.findClubById?.(clubId);
      if (club) {
        const stars = club.stars || 3;
        const leagueId = window.leaguesEngine.findLeagueForClub(clubId);
        const league = window.leaguesEngine.leagues[leagueId];
        const isDiv1 = league && league.tier === 1;
        const isDiv2 = league && league.tier === 2;

        if (isDiv1) {
          threshold = (stars === 5) ? 82 : 78;
        } else if (isDiv2) {
          threshold = 72; // Division 2 starting threshold remains 72!
        }
      }
    }

    // Bench Player to First Team Regular upgrade!
    if (this.profile.squadRole === "Bench Player" && this.profile.ovr >= threshold) {
      this.profile.squadRole = "First Team Regular";
      const mult = this.getSalaryMultiplier();
      const baseDiv2Offer = Math.floor(Math.random() * 7001) + 18000; // 18,000 to 25,000
      this.profile.weeklyWage = Math.round(baseDiv2Offer * mult);
      this.profile.goalBonus = Math.round(this.profile.weeklyWage * 0.1);
      this.profile.assistBonus = Math.round(this.profile.weeklyWage * 0.05);
      if (window.app) {
        setTimeout(() => {
          window.app.showGameNotice(
            "🌟 PROMOTED TO FIRST TEAM!",
            `<p style="font-size:15px;color:#fff;line-height:1.6;">Sensational development! You reached <strong>${this.profile.ovr} OVR</strong> and the manager has promoted you to a <strong>First Team Regular</strong>!</p><p style="font-size:13px;color:var(--text-muted);">Your contract has been upgraded to a standard Division 1 starting salary of <strong>$${this.profile.weeklyWage.toLocaleString()}/wk</strong> + performance bonuses (calculated based on Division 2 starting offers with your contract multiplier of <strong>x${mult}</strong> applied)!</p>`
          );
        }, 1200);
      }
    }

    this.updateMarketValue();
    return this.profile.ovr;
  }

  getSalaryMultiplier() {
    let mult = 1.0;
    const p = this.profile;

    // 1. OVR Milestones (changed from 2.0x to 1.5x)
    if (p.ovr >= 80) mult *= 1.5;
    if (p.ovr >= 85) mult *= 1.5;
    if (p.ovr >= 90) mult *= 1.5;

    // 2. Champions League Trophies (changed from 2x to 1.5x per win)
    const uclCount = p.trophies.continental || 0;
    if (uclCount > 0) {
      mult *= Math.pow(1.5, uclCount);
    }

    // 3. World Cup Trophies (changed from 3x to 1.75x per win)
    const wcCount = p.trophies.world_cup || 0;
    if (wcCount > 0) {
      mult *= Math.pow(1.75, wcCount);
    }

    // 4. Ballon d'Or Trophies (changed from 3x to 1.75x per win)
    const ballonCount = p.trophies.ballon_dor || 0;
    if (ballonCount > 0) {
      mult *= Math.pow(1.75, ballonCount);
    }

    // 5. Golden Boot Awards (changed from 1.5x to 1.25x per win)
    const gbCount = p.trophies.golden_boot || 0;
    if (gbCount > 0) {
      mult *= Math.pow(1.25, gbCount);
    }

    // 6. Euro Cup / Copa America Trophies (changed from 2x to 1.5x per win)
    const ecCount = p.trophies.euros_copas || 0;
    if (ecCount > 0) {
      mult *= Math.pow(1.5, ecCount);
    }

    // 7. National Team Call-Up (changed from 2x to 1.5x)
    if (p.isNationalTeamCalledUp) {
      mult *= 1.5;
    }

    // 8. Domestic Cup Trophies (changed from 2x to 1.5x per win)
    const cupCount = p.trophies.cup || 0;
    if (cupCount > 0) {
      mult *= Math.pow(1.5, cupCount);
    }

    // 9. League Title Champion (1.25x per win!)
    const leagueTitlesCount = (p.trophies.league_d1 || 0) + (p.trophies.league_d2 || 0);
    if (leagueTitlesCount > 0) {
      mult *= Math.pow(1.25, leagueTitlesCount);
    }

    return parseFloat(mult.toFixed(2));
  }

  updateMarketValue() {
    const baseVal = Math.pow(this.profile.ovr / 50, 4) * 600000;
    const ageMultiplier = this.profile.age < 24 ? 1.5 : (this.profile.age > 33 ? 0.4 : 1.0);
    this.profile.marketValue = Math.round(baseVal * ageMultiplier);
  }

  upgradeAttribute(attrName) {
    if (this.profile.skillPoints <= 0) return false;
    if (!this.profile.attributes[attrName] || this.profile.attributes[attrName] >= 99) return false;

    this.profile.attributes[attrName] += 1;
    this.profile.skillPoints -= 1;
    this.calculateOvr();
    return true;
  }

  recordMatchPerformance(goals, assists, passAccuracy, rating, compKey = "league", didPlay = true, matchOutcome = 'draw', oppGoals = 0) {
    const s = this.stats.season;
    const c = this.stats.career;
    const p = this.profile;

    if (!didPlay) {
      // Unused substitute: only earn base weekly wage, no performance stats/XP/bonuses recorded
      p.bankBalance += p.weeklyWage;
      p.totalCareerEarnings += p.weeklyWage;
      s.earningsThisSeason += p.weeklyWage;
      return { xpEarned: 0, matchMoney: p.weeklyWage };
    }

    s.matches += 1;
    s.goals += goals;
    s.assists += assists;
    
    // Log goals/assists by specific competition key
    if (!s.compStats) {
      s.compStats = {
        league: { goals: 0, assists: 0, matches: 0 },
        cup: { goals: 0, assists: 0, matches: 0 },
        ucl: { goals: 0, assists: 0, matches: 0 }
      };
    }
    const key = compKey || "league";
    if (s.compStats[key]) {
      s.compStats[key].goals += goals;
      s.compStats[key].assists += assists;
      s.compStats[key].matches = (s.compStats[key].matches || 0) + 1;
    }
    
    // Track hattricks for Striker (ST) or Wingers (RW, LW) if 3+ goals are scored in a single match
    const pos = p.position || "ST";
    if (goals >= 3 && ['ST', 'RW', 'LW'].includes(pos)) {
      s.hattricks = (s.hattricks || 0) + 1;
      c.totalHattricks = (c.totalHattricks || 0) + 1;
    }
    
    s.ratingsHistory.push(rating);

    const sumRatings = s.ratingsHistory.reduce((a, b) => a + b, 0);
    s.avgRating = (sumRatings / s.ratingsHistory.length).toFixed(1);

    c.totalMatches += 1;
    const oldGoals = c.totalGoals || 0;
    c.totalGoals = oldGoals + goals;
    c.totalAssists += assists;

    const oldMilestones = Math.floor(oldGoals / 5);
    const newMilestones = Math.floor(c.totalGoals / 5);
    if (newMilestones > oldMilestones) {
      const spEarned = newMilestones - oldMilestones;
      p.skillPoints += spEarned;
      if (window.app) {
        setTimeout(() => {
          window.app.showGameNotice(
            "⚽ GOALSCORING ACHIEVEMENT!",
            `<div style="font-size:54px;margin-bottom:12px;">🎯</div><p style="font-size:16px;color:#fff;font-weight:700;">Career Milestones Reached!</p><p style="font-size:14px;color:#cbd5e1;line-height:1.6;">You have scored an amazing total of <strong>${c.totalGoals} career goals</strong>! Every 5 goals awards a skill point. You earned <strong>+${spEarned} Skill Points</strong>! Spend them in the Skills tab to upgrade your player!</p>`
          );
        }, 1200);
      }
    }

    const matchMoney = p.weeklyWage + (goals * p.goalBonus) + (assists * p.assistBonus);
    p.bankBalance += matchMoney;
    p.totalCareerEarnings += matchMoney;
    s.earningsThisSeason += matchMoney;

    p.form = ((p.form * 0.7) + (rating * 0.3)).toFixed(1);

    // Dynamic, balanced XP System:
    // Win: 100 XP, Draw: 50 XP, Loss: 0 XP
    let outcomeXp = 0;
    if (matchOutcome === 'win') outcomeXp = 100;
    else if (matchOutcome === 'draw') outcomeXp = 50;

    // Goals: 100 XP, Assists: 50 XP
    let perfXp = (goals * 100) + (assists * 50);

    // Defensive / GK balance:
    let defBonus = 0;
    if (['CB', 'LB', 'RB', 'GK'].includes(pos)) {
      // Clean sheet (+100 XP)
      if (oppGoals === 0) defBonus += 100;
      // Match rating conversion (+10 XP per rating point)
      defBonus += Math.round(rating * 10);
    }

    let xpEarned = outcomeXp + perfXp + defBonus;
    this.addXp(xpEarned);
    return { xpEarned, matchMoney };
  }

  addXp(amount) {
    this.profile.xp += amount;
    while (this.profile.xp >= this.profile.xpToNextLevel) {
      this.profile.xp -= this.profile.xpToNextLevel;
      this.profile.level += 1;
      this.profile.skillPoints += 3; // +3 skill points per level up!
      this.profile.xpToNextLevel = (this.profile.level + 1) * 1000; // Level 0 needs 1000, Level 1 needs 2000, Level 2 needs 3000...
    }
  }

  checkGoldenBoot(compKey) {
    const s = this.stats.season;
    const p = this.profile;
    const currentMatches = s.matches || 0;
    const seed = s.year || 2026;
    
    // Determine user's active league
    const currentLeagueId = window.leaguesEngine?.currentLeagueId || "turkey_d2";
    const clubs = window.leaguesEngine?.standings || [];
    
    // User goals
    const userGoals = (s.compStats && s.compStats[compKey] && s.compStats[compKey].goals) || 0;

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

    const country = leagueToCountry[currentLeagueId] || "Turkey";
    const firstNames = window.NATIONAL_NAMES[country]?.first || window.NATIONAL_NAMES["Turkey"].first;
    const lastNames = window.NATIONAL_NAMES[country]?.last || window.NATIONAL_NAMES["Turkey"].last;

    let matchesRatio = 1.0;
    if (compKey === 'cup') matchesRatio = 0.15;
    else if (compKey === 'ucl') matchesRatio = 0.35;
    const compMatches = Math.max(1, Math.round(currentMatches * matchesRatio));

    let maxAiGoals = 0;
    let bestAiName = "";

    clubs.forEach((c, idx) => {
      if (c.clubId === p.currentClubId) return;

      const clubSeedName = c.name || c.clubId || 'Club';
      const strikerFirstIdx = (idx * 5 + (compKey === 'cup' ? 11 : 0)) % firstNames.length;
      const strikerLastIdx = (idx * 5 + 3 + (compKey === 'cup' ? 17 : 0)) % lastNames.length;
      const sFirst = firstNames[strikerFirstIdx];
      const sLast = lastNames[strikerLastIdx];

      const goalRate = 0.28 + ((c.ovr || 75) - 60) * 0.015 + getPseudoRandom(clubSeedName, 'goalRate', 0, 15) * 0.01;
      const goals = Math.max(0, Math.round(goalRate * compMatches));
      
      if (goals > maxAiGoals) {
        maxAiGoals = goals;
        bestAiName = `${sFirst} ${sLast}`;
      }
    });

    if (userGoals > maxAiGoals) {
      return { won: true, userGoals, maxAiGoals, winnerName: p.name };
    } else {
      return { won: false, userGoals, maxAiGoals, winnerName: bestAiName };
    }
  }

  checkBallonDorWinner() {
    const p = this.profile;
    const s = this.stats.season;
    
    const currentLeague = window.leaguesEngine?.getLeagueMeta();
    const isDiv1 = currentLeague && currentLeague.tier === 1;
    const currentMatches = s.matches || 0;
    const seed = s.year || 2026;

    // Strict criteria:
    const userMeetsCriteria = isDiv1 && p.ovr >= 89 && p.squadRole !== "Bench Player";
    
    // Evaluate user score
    let userScore = 0;
    if (userMeetsCriteria) {
      userScore += Math.max(0, (p.ovr - 80) * 1.5);
      const sGoals = s.goals || 0;
      const sAssists = s.assists || 0;
      userScore += sGoals * 1.5;
      userScore += sAssists * 1.0;
      const rating = parseFloat(s.avgRating || 6.0);
      userScore += Math.max(0, (rating - 6.5) * 15);
      if (window.leaguesEngine?.uclQualified) userScore += 20;
      if (window.leaguesEngine?.cupStage !== 'none') userScore += 10;
    }

    // Generate AI candidates from big teams
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
      // STRICTOR CRITERIA: Candidates must have OVR >= 89!
      if (topStar && topStar.ovr >= 89) {
        eligibleClubs.push({ club: cl, star: topStar });
      }
    });

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

    const numOpponents = userMeetsCriteria ? 4 : 5;
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

    const candidates = [];
    if (userMeetsCriteria) {
      candidates.push({
        name: p.name,
        club: p.currentClubName,
        score: userScore,
        isUser: true
      });
    }

    pickedEligible.forEach((el, idx) => {
      const cl = el.club;
      const topStar = el.star;
      const clubInfo = getClubCountry(cl.clubId || cl.id);
      
      const aiOvr = topStar.ovr;
      const aiGoals = (topStar.stats && topStar.stats.season && topStar.stats.season.goals) || Math.max(10, Math.round((0.45 + (aiOvr - 85) * 0.02) * (currentMatches * 0.8 + 5)));
      const baseScore = (aiOvr - 80) * 2 + aiGoals * 1.2;

      candidates.push({
        name: topStar.name,
        club: cl.name + " " + (cl.logo || "⚽"),
        score: baseScore,
        isUser: false
      });
    });

    candidates.sort((a, b) => b.score - a.score);
    const winner = candidates[0];
    
    return {
      userWon: winner.isUser,
      winnerName: winner.name,
      winnerClub: winner.club,
      winnerScore: winner.score,
      userScore: userScore
    };
  }

  advanceSeason() {
    let notification = [];
    const s = this.stats.season;

    // 1. Record completed season into Past Seasons History
    if (!this.stats.career.seasonHistory) this.stats.career.seasonHistory = [];
    this.stats.career.seasonHistory.push({
      year: s.year,
      age: this.profile.age,
      clubName: this.profile.currentClubName,
      ovr: this.profile.ovr,
      matches: s.matches,
      goals: s.goals,
      assists: s.assists,
      hattricks: s.hattricks || 0,
      avgRating: s.avgRating || '7.0',
      earnings: s.earningsThisSeason || 0
    });

    // 2. Execute Pending Agreed Transfer if signed during season
    let transferred = false;
    if (this.pendingTransfer) {
      const pt = this.pendingTransfer;
      this.profile.currentClubId = pt.clubId;
      this.profile.currentClubName = pt.clubName;
      this.profile.weeklyWage = pt.wage;
      this.profile.goalBonus = pt.goalBonus;
      this.profile.assistBonus = pt.assistBonus;
      notification.push(`✈️ Summer Transfer Official: Joined ${pt.clubName} for the new season!`);
      this.pendingTransfer = null;
      transferred = true;
    }

    // 3. Increment Age and Season Year
    this.profile.age += 1;
    s.year += 1;

    // 4. Age Decay / Youth Growth based on Professionality (growthArchetype)
    const arch = this.profile.growthArchetype || "pro";
    let decayAge = 34;
    let youthBonusPoints = 3;
    let decayMultiplier = 1.0;

    if (arch === 'goat') {
      decayAge = 36;
      youthBonusPoints = 5;
      decayMultiplier = 0.5;
    } else if (arch === 'pro') {
      decayAge = 34;
      youthBonusPoints = 3;
      decayMultiplier = 1.0;
    } else if (arch === 'good') {
      decayAge = 33;
      youthBonusPoints = 2;
      decayMultiplier = 1.0;
    } else if (arch === 'avg') {
      decayAge = 32;
      youthBonusPoints = 1;
      decayMultiplier = 1.5;
    } else if (arch === 'under_avg') {
      decayAge = 31;
      youthBonusPoints = 0;
      decayMultiplier = 2.0;
    }

    if (this.profile.age >= decayAge) {
      const paceLoss = Math.max(1, Math.round((Math.floor(Math.random() * 3) + 2) * decayMultiplier));
      const physicalLoss = Math.max(1, Math.round((Math.floor(Math.random() * 2) + 1) * decayMultiplier));
      this.profile.attributes.pace = Math.max(40, this.profile.attributes.pace - paceLoss);
      this.profile.attributes.physical = Math.max(40, this.profile.attributes.physical - physicalLoss);
      notification.push(`⚠️ Age Decay (${this.profile.age} y/o - ${arch.toUpperCase()} Level)! Physical attributes declined: Pace -${paceLoss}, Physical -${physicalLoss}.`);
    } else if (this.profile.age < 28 && youthBonusPoints > 0) {
      this.profile.skillPoints += youthBonusPoints;
      notification.push(`🌟 Youth Growth Bonus (${arch.toUpperCase()} Level): You earned +${youthBonusPoints} bonus Skill Points for the new season!`);
    }

    this.calculateOvr();

    // 4.5 National Team Invitation Check
    if (window.leaguesEngine) {
      const nat = window.leaguesEngine.nationalTeams.find(n => n.name === this.profile.nationality);
      const stars = nat ? nat.stars : 3;
      let callUpThreshold = 79;
      if (stars === 1) callUpThreshold = 72;
      else if (stars === 2) callUpThreshold = 75;
      else if (stars === 3) callUpThreshold = 79;
      else if (stars === 4) callUpThreshold = 82;
      else if (stars === 5) callUpThreshold = 83;
      
      if (this.profile.ovr >= callUpThreshold) {
        if (!this.profile.isNationalTeamCalledUp) {
          this.profile.isNationalTeamCalledUp = true;
          notification.push(`✉️ National Team Call-up: Your impressive ${this.profile.ovr} OVR has earned you an official invitation to represent the ${this.profile.nationality} National Team (${"★".repeat(stars)} team)!`);
        }
      } else {
        if (this.profile.isNationalTeamCalledUp) {
          this.profile.isNationalTeamCalledUp = false;
          notification.push(`✉️ Dropped from National Team: Your current performance is below the ${this.profile.nationality} standard of ${callUpThreshold} OVR. Focus on upgrading your attributes to get recalled!`);
        }
      }
    }

    // 5. Reset Season Counters
    s.matches = 0;
    s.goals = 0;
    s.assists = 0;
    s.hattricks = 0;
    s.ratingsHistory = [];
    s.avgRating = 0.0;
    s.earningsThisSeason = 0;
    s.compStats = {
      league: { goals: 0, assists: 0, matches: 0 },
      cup: { goals: 0, assists: 0, matches: 0 },
      ucl: { goals: 0, assists: 0, matches: 0 }
    };

    // 6. Reset League Standings & Generate Fresh Schedule
    if (window.leaguesEngine) {
      if (transferred) {
        // Re-initialize the league for the new club's league
        const newLeagueId = window.leaguesEngine.findLeagueForClub(this.profile.currentClubId);
        if (newLeagueId) {
          window.leaguesEngine.initLeague(newLeagueId);
        } else {
          window.leaguesEngine.resetSeason();
        }
      } else {
        window.leaguesEngine.resetSeason();
      }
    }

    return notification;
  }

  // --- SAVE / LOAD DATA METHODS ---
  exportSaveData() {
    const le = window.leaguesEngine || {};
    return {
      profile: this.profile,
      stats: this.stats,
      standings: le.standings,
      fixtures: le.fixtures,
      seasonSchedule: le.seasonSchedule,
      currentLeagueId: le.currentLeagueId,
      clubSquads: le.clubSquads,
      
      // Preserve all dynamic tournament progress variables!
      uclStage: le.uclStage,
      uclQualified: le.uclQualified,
      uclQualifiersPoints: le.uclQualifiersPoints,
      uclQualifiersPlayed: le.uclQualifiersPlayed,
      uclGroupPoints: le.uclGroupPoints,
      uclGroupPlayed: le.uclGroupPlayed,
      cupStage: le.cupStage,
      cupGroupPoints: le.cupGroupPoints,
      cupGroupPlayed: le.cupGroupPlayed,
      nationalQualified: le.nationalQualified,
      natQualPoints: le.natQualPoints,
      natQualPlayed: le.natQualPlayed,
      natGroupPoints: le.natGroupPoints,
      natGroupPlayed: le.natGroupPlayed,
      natStage: le.natStage
    };
  }

  importSaveData(data) {
    if (!data) return false;
    if (data.profile) this.profile = data.profile;
    if (data.stats) this.stats = data.stats;
    
    const le = window.leaguesEngine;
    if (le) {
      if (data.standings) le.standings = data.standings;
      if (data.fixtures) le.fixtures = data.fixtures;
      if (data.seasonSchedule) le.seasonSchedule = data.seasonSchedule;
      if (data.currentLeagueId) le.currentLeagueId = data.currentLeagueId;
      if (data.clubSquads) le.clubSquads = data.clubSquads;
      
      // Restore all dynamic tournament progress variables!
      if (data.uclStage !== undefined) le.uclStage = data.uclStage;
      if (data.uclQualified !== undefined) le.uclQualified = data.uclQualified;
      if (data.uclQualifiersPoints !== undefined) le.uclQualifiersPoints = data.uclQualifiersPoints;
      if (data.uclQualifiersPlayed !== undefined) le.uclQualifiersPlayed = data.uclQualifiersPlayed;
      if (data.uclGroupPoints !== undefined) le.uclGroupPoints = data.uclGroupPoints;
      if (data.uclGroupPlayed !== undefined) le.uclGroupPlayed = data.uclGroupPlayed;
      if (data.cupStage !== undefined) le.cupStage = data.cupStage;
      if (data.cupGroupPoints !== undefined) le.cupGroupPoints = data.cupGroupPoints;
      if (data.cupGroupPlayed !== undefined) le.cupGroupPlayed = data.cupGroupPlayed;
      if (data.nationalQualified !== undefined) le.nationalQualified = data.nationalQualified;
      if (data.natQualPoints !== undefined) le.natQualPoints = data.natQualPoints;
      if (data.natQualPlayed !== undefined) le.natQualPlayed = data.natQualPlayed;
      if (data.natGroupPoints !== undefined) le.natGroupPoints = data.natGroupPoints;
      if (data.natGroupPlayed !== undefined) le.natGroupPlayed = data.natGroupPlayed;
      if (data.natStage !== undefined) le.natStage = data.natStage;
    }
    
    if (le && (!le.seasonSchedule || le.seasonSchedule.length === 0)) {
      le.buildSeasonSchedule(this.profile);
    }
    this.calculateOvr();
    return true;
  }
}

window.userCareer = new PlayerCareer();
