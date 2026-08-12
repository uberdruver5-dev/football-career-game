/**
 * MANAGER MODE — Manager Career Engine (v3.0.0)
 * Separate game mode: manage a club (finances, stadium, signings, sponsors,
 * formation/lineup) with a random Manager Score that boosts team performance.
 */

// Deterministic PRNG (mulberry32) so the player database is identical per save seed
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

class ManagerGame {
  constructor() {
    this.profile = {
      name: "José Manager",
      nationality: "Spain",
      flag: "🇪🇸",
      age: 45,
      clubId: "barcelona",
      clubName: "FC Barcelona",
      stars: 5,
      startYear: 2026,
      managerScore: 70
    };
    this.bank = 200000000;
    this.season = {
      year: 2026,
      matches: 0, wins: 0, draws: 0, losses: 0,
      goalsFor: 0, goalsAgainst: 0,
      shots: 0, defActions: 0, saves: 0,
      avgRating: 0, ratings: [],
      profit: 0, revenue: 0, costs: 0, wages: 0,
      sponsorIncome: 0, sponsorOut: 0, stadiumNet: 0
    };
    this.career = { seasonHistory: [], leagueTitles: 0, totalProfit: 0 };
    this.stadium = {
      capacity: 15000, ticketPrice: 20, drinkPrice: 3, foodPrice: 5,
      parkingPrice: 8, parkingSlots: 4500, attention: 1, maintenance: 1
    };
    this.sponsors = { offersIn: [], activeIn: null, lastResult: null, outSponsors: [], activeOut: [] };
    this.contracts = {};   // playerId -> { wage, goalBonus, assistBonus, roleBonus, yearsLeft, joinedYear }
    this.lineup = [];      // 11 player ids
    this.worldSeed = 1;
    this.world = { players: [] };
    this.awardsProcessed = null;
    this.lastStadium = null;
  }

  hashCode(str) {
    let h = 7;
    for (let i = 0; i < String(str).length; i++) h = ((h * 31) + String(str).charCodeAt(i)) >>> 0;
    return h;
  }

  // ---------------- WORLD DATABASE ----------------
  generateWorld(seed) {
    this.worldSeed = seed || Math.floor(Math.random() * 999999) + 1;
    const rng = mulberry32(this.worldSeed);
    const origRandom = Math.random;
    Math.random = rng;
    try {
      window.leaguesEngine.initializeAllClubSquads();
    } finally {
      Math.random = origRandom;
    }
    const players = [];
    const le = window.leaguesEngine;
    Object.keys(le.clubSquads).forEach(clubId => {
      if (clubId.startsWith('nat_')) return;
      (le.clubSquads[clubId] || []).forEach(pl => {
        const starClub = le.findClubById(clubId);
        const stars = starClub ? (starClub.stars || 3) : 3;
        const p = {
          id: pl.id,
          name: pl.name,
          position: pl.position,
          ovr: pl.ovr,
          age: pl.age,
          nationality: pl.nationality,
          flag: pl.flag,
          clubId: clubId,
          marketValue: this.calcMarketValue(pl.ovr, pl.age, stars),
          preferredWage: this.calcPreferredWage(pl.ovr, pl.age, stars, pl.position),
          history: this.genPlayerHistory(pl, this.profile.startYear, stars),
          seasonStats: { matches: 0, goals: 0, assists: 0, roleActions: 0 },
          careerStats: { matches: 0, goals: 0, assists: 0 }
        };
        p.history.forEach(h => {
          p.careerStats.matches += h.matches || 0;
          p.careerStats.goals += h.goals || 0;
          p.careerStats.assists += h.assists || 0;
        });
        players.push(p);
      });
    });
    this.world.players = players;
    return players;
  }

  calcMarketValue(ovr, age, stars) {
    const base = Math.pow(ovr / 50, 4) * 600000;
    const ageMult = age < 24 ? 1.5 : (age > 33 ? 0.4 : 1.0);
    const starMult = 1 + Math.max(0, (stars - 2)) * 0.35;
    return Math.round(base * ageMult * starMult);
  }

  calcPreferredWage(ovr, age, stars, position) {
    const base = 2000 + Math.pow(ovr, 2.2) * 2.2;
    const starMult = 1 + Math.max(0, (stars - 2)) * 0.12;
    const ageMult = age > 33 ? 0.7 : 1;
    const gkBonus = position === 'GK' ? 0.9 : 1;
    return Math.round(base * starMult * ageMult * gkBonus);
  }

  genPlayerHistory(pl, startYear, stars) {
    const history = [];
    const seasonsPlayed = Math.max(0, Math.min(18, (pl.age || 22) - 17));
    const rng = mulberry32(this.hashCode((pl.id || pl.name) + '|' + this.worldSeed));
    let clubId = pl.clubId;
    const le = window.leaguesEngine;
    for (let i = 0; i < seasonsPlayed; i++) {
      const year = startYear - 1 - i;
      const matches = 20 + Math.floor(rng() * 18);
      const goalRate = pl.position === 'ST' ? 0.30 : (['LW', 'RW'].includes(pl.position) ? 0.22 : (pl.position === 'CAM' ? 0.14 : (['CM', 'LB', 'RB'].includes(pl.position) ? 0.07 : (pl.position === 'CB' ? 0.03 : 0.01))));
      const assistRate = ['CAM', 'CM'].includes(pl.position) ? 0.24 : (['LW', 'RW'].includes(pl.position) ? 0.17 : (pl.position === 'ST' ? 0.10 : (['LB', 'RB'].includes(pl.position) ? 0.06 : 0.03)));
      const goals = Math.max(0, Math.round(goalRate * matches * (0.6 + rng() * 0.8)));
      const assists = Math.max(0, Math.round(assistRate * matches * (0.6 + rng() * 0.8)));
      const finish = 1 + Math.floor(rng() * 18);
      const trophies = [];
      if (finish === 1) trophies.push('League Champion');
      if (pl.ovr > 82 && rng() < 0.10) trophies.push('Champions League');
      if (rng() < 0.14) trophies.push('Domestic Cup');
      if (pl.ovr > 84 && rng() < 0.16) trophies.push("Ballon d'Or Nominee");
      if (i > 0 && rng() < 0.25) {
        const leagueId = le.findLeagueForClub(clubId);
        const league = le.leagues[leagueId];
        if (league) {
          const pool = league.clubs.filter(c => c.id !== clubId);
          if (pool.length) clubId = pool[Math.floor(rng() * pool.length)].id;
        }
      }
      history.push({ year, clubId, clubName: (le.findClubById(clubId) || {}).name || 'Unknown', matches, goals, assists, finish, trophies });
    }
    return history.reverse();
  }

  // ---------------- BUDGET RECOMMENDATION ----------------
  getRecommendedBudget(clubId, seasonYear) {
    const le = window.leaguesEngine;
    const club = le.findClubById(clubId);
    const stars = club ? (club.stars || 3) : 3;
    const ovr = club ? (club.ovr || 70) : 70;
    const year = seasonYear || 2026;
    const tierBase = { 1: 15e6, 2: 30e6, 3: 60e6, 4: 120e6, 5: 250e6 };
    const growth = Math.pow(1.07, year - 2000);
    const megaClubs = ['realmadrid', 'barcelona', 'mancity', 'manutd', 'bayern', 'liverpool', 'arsenal', 'psg', 'juventus', 'inter', 'acmilan', 'chelsea'];
    let mega = megaClubs.includes(clubId) ? 1.7 : 1;
    if (['alhilal', 'alnassr'].includes(clubId)) mega = 0.75;
    const jitter = 0.88 + (this.hashCode(clubId + '|budget') % 25) / 100;
    const ovrFactor = 0.85 + Math.max(0, ovr - 60) * 0.006;
    const raw = tierBase[stars] * growth * mega * jitter * ovrFactor;
    return Math.round(raw / 1e6) * 1e6;
  }

  // ---------------- MATCH SIMULATION ----------------
  getStrength() {
    const le = window.leaguesEngine;
    const club = le.findClubById(this.profile.clubId);
    const base = club ? club.ovr : 75;
    return base + (this.profile.managerScore - 50) * 0.1;
  }

  getXI() {
    const byId = {};
    this.world.players.forEach(p => byId[p.id] = p);
    return this.lineup.map(id => byId[id]).filter(Boolean);
  }

  getClubPlayers() {
    return this.world.players.filter(p => p.clubId === this.profile.clubId);
  }

  getInventory() {
    const xiIds = new Set(this.lineup);
    return this.getClubPlayers().filter(p => !xiIds.has(p.id));
  }

  pickWeightedScorer(squad) {
    const weights = { 'ST': 40, 'LW': 20, 'RW': 20, 'CAM': 12, 'CM': 6, 'CB': 1, 'LB': 2, 'RB': 2 };
    const candidates = squad.map(pl => ({ pl, w: weights[pl.position] || 5 }));
    const total = candidates.reduce((s, c) => s + c.w, 0);
    let rand = Math.random() * total;
    for (const c of candidates) {
      rand -= c.w;
      if (rand <= 0) return c.pl;
    }
    return squad[0];
  }

  pickWeightedAssister(squad, scorerName) {
    const weights = { 'LW': 35, 'RW': 35, 'CAM': 20, 'CM': 5, 'ST': 3, 'LB': 2, 'RB': 2, 'CB': 1 };
    const candidates = squad.filter(pl => pl.name !== scorerName);
    if (!candidates.length) return null;
    const total = candidates.reduce((s, pl) => s + (weights[pl.position] || 2), 0);
    let roll = Math.random() * total;
    return candidates.find(pl => (roll -= (weights[pl.position] || 2)) <= 0) || candidates[0];
  }

  buildMatchEvents() {
    const le = window.leaguesEngine;
    const ctx = this.nextMatchCtx;
    const myStrength = this.getStrength();
    const oppClub = le.findClubById(ctx.away && (ctx.away.clubId || ctx.away.id));
    const oppStrength = oppClub ? oppClub.ovr : 75;
    const bonus = (myStrength - oppStrength) * 0.015;

    const randGoals = (b = 0) => {
      const r = Math.random() + b;
      return r < 0.28 ? 0 : r < 0.62 ? 1 : r < 0.86 ? 2 : 3;
    };
    let myGoals = randGoals(bonus);
    let oppGoals = randGoals(-bonus * 0.6);

    const mySquad = this.getXI();
    const oppId = ctx.userSide === 'home' ? (ctx.away?.clubId || ctx.away?.id) : (ctx.home?.clubId || ctx.home?.id);
    const oppSquad = (le.clubSquads[oppId] || []).filter(p => p.position !== 'GK');

    const events = [];
    for (let i = 0; i < myGoals; i++) {
      const minute = Math.floor(Math.random() * 89) + 1;
      const scorer = this.pickWeightedScorer(mySquad);
      const assist = Math.random() < 0.70 ? this.pickWeightedAssister(mySquad, scorer.name) : null;
      events.push({ type: 'goal', minute, team: 'home', player: scorer.name, playerId: scorer.id, assist: assist ? assist.name : null, assistId: assist ? assist.id : null, isPenalty: Math.random() < 0.12, isFreekick: Math.random() < 0.10 });
    }
    for (let i = 0; i < oppGoals; i++) {
      const minute = Math.floor(Math.random() * 89) + 1;
      const scorer = this.pickWeightedScorer(oppSquad);
      events.push({ type: 'goal', minute, team: 'away', player: scorer.name, playerId: scorer.id, assist: null, isPenalty: Math.random() < 0.12, isFreekick: false });
    }
    const myShots = 8 + Math.floor(Math.random() * 23);
    const oppShots = 6 + Math.floor(Math.random() * 21);
    const myDefActions = 8 + Math.floor(Math.random() * 12);
    const mySaves = Math.max(0, oppShots - oppGoals);
    if (Math.random() < 0.25) {
      const cards = 1 + (Math.random() < 0.3 ? 1 : 0);
      for (let i = 0; i < cards; i++) {
        const side = Math.random() < 0.5 ? 'home' : 'away';
        const squad = side === 'home' ? mySquad : oppSquad;
        events.push({ type: 'card', minute: Math.floor(Math.random() * 89) + 1, team: side, player: (squad[Math.floor(Math.random() * squad.length)] || { name: 'Player' }).name, cardType: Math.random() < 0.8 ? 'yellow' : 'red' });
      }
    }
    events.sort((a, b) => a.minute - b.minute);
    return { events, myGoals, oppGoals, myShots, oppShots, myDefActions, mySaves };
  }

  applyMatchResult(simData) {
    const le = window.leaguesEngine;
    const s = this.season;
    const ctx = this.nextMatchCtx;
    const { events, myGoals, oppGoals, myShots, oppShots, myDefActions, mySaves } = simData;
    const isHome = ctx.userSide === 'home';

    s.matches++;
    if (myGoals > oppGoals) s.wins++;
    else if (myGoals === oppGoals) s.draws++;
    else s.losses++;
    s.goalsFor += myGoals;
    s.goalsAgainst += oppGoals;
    s.shots += myShots;
    s.defActions += myDefActions;
    s.saves += mySaves;

    const won = myGoals > oppGoals;
    const drew = myGoals === oppGoals;
    let rating = 6.5 + (won ? 1.0 : drew ? 0.3 : -0.8) + Math.min(2, (myGoals - oppGoals) * 0.2) + (Math.random() * 0.6 - 0.3);
    rating = Math.min(10, Math.max(1, Math.round(rating * 10) / 10));
    s.ratings.push(rating);
    s.avgRating = Math.round((s.ratings.reduce((a, b) => a + b, 0) / s.ratings.length) * 10) / 10;

    const byId = {};
    this.world.players.forEach(p => byId[p.id] = p);
    const xi = new Set(this.lineup);
    let wageTotal = 0;
    let bonusTotal = 0;
    this.getClubPlayers().forEach(p => {
      p.seasonStats.matches = (p.seasonStats.matches || 0) + 1;
      const con = this.contracts[p.id];
      const wage = con ? con.wage : Math.round(p.preferredWage * 0.5);
      wageTotal += xi.has(p.id) ? wage : Math.round(wage * 0.5);
    });
    events.forEach(ev => {
      if (ev.type !== 'goal') return;
      if (ev.team === 'home') {
        const scorer = byId[ev.playerId];
        if (scorer) {
          scorer.seasonStats.goals = (scorer.seasonStats.goals || 0) + 1;
          scorer.careerStats.goals = (scorer.careerStats.goals || 0) + 1;
          const con = this.contracts[ev.playerId];
          if (con) bonusTotal += con.goalBonus || 0;
        }
        if (ev.assistId) {
          const assister = byId[ev.assistId];
          if (assister) {
            assister.seasonStats.assists = (assister.seasonStats.assists || 0) + 1;
            assister.careerStats.assists = (assister.careerStats.assists || 0) + 1;
            const con = this.contracts[ev.assistId];
            if (con) bonusTotal += con.assistBonus || 0;
          }
        }
      }
    });
    if (myDefActions > 0) {
      const defenders = this.getXI().filter(p => ['CB', 'LB', 'RB', 'CM'].includes(p.position));
      defenders.forEach(p => {
        const con = this.contracts[p.id];
        if (con) bonusTotal += Math.round((con.roleBonus || 0) * myDefActions / Math.max(1, defenders.length));
        p.seasonStats.roleActions = (p.seasonStats.roleActions || 0) + Math.max(1, Math.floor(myDefActions / Math.max(1, defenders.length)));
      });
      const gk = this.getXI().find(p => p.position === 'GK');
      if (gk) {
        const con = this.contracts[gk.id];
        if (con) bonusTotal += Math.round((con.roleBonus || 0) * mySaves);
        gk.seasonStats.roleActions = (gk.seasonStats.roleActions || 0) + mySaves;
      }
    }

    s.wages += wageTotal;
    s.costs += wageTotal + bonusTotal;

    let sponsorPay = 0;
    if (this.sponsors.activeIn) {
      const sp = this.sponsors.activeIn;
      let payout = sp.weeklyWage;
      if (this.sponsors.lastResult === 'loss') payout = Math.round(sp.weeklyWage * 0.5);
      if (won) payout += Math.round(sp.weeklyWage * 0.1);
      sponsorPay = payout;
      this.sponsors.lastResult = won ? 'win' : 'loss';
    }
    s.sponsorIncome += sponsorPay;
    s.revenue += sponsorPay;

    let outCost = 0;
    this.sponsors.activeOut.forEach(sp => outCost += sp.weeklyWage);
    s.sponsorOut += outCost;
    s.costs += outCost;

    let stadiumNet = 0;
    if (isHome) {
      stadiumNet = this.calcStadiumMatchNet();
      s.stadiumNet += stadiumNet;
      if (stadiumNet >= 0) s.revenue += stadiumNet; else s.costs += -stadiumNet;
    }

    const net = sponsorPay + (isHome ? stadiumNet : 0) - wageTotal - bonusTotal - outCost;
    this.bank += net;
    s.profit += net;
    this.career.totalProfit += net;

    le.simulateGameweek(this.profile.clubId, {
      userGoals: myGoals, oppGoals,
      wonOnPenalties: false, lostOnPenalties: false, penUserScore: 0, penOppScore: 0
    }, ctx, null);

    if (le.pendingUclNotice) {
      const notice = le.pendingUclNotice;
      le.pendingUclNotice = null;
      setTimeout(() => window.app.showGameNotice(notice.title, notice.body), 900);
    }
  }

  calcStadiumMatchNet() {
    const st = this.stadium;
    const maxCap = this.maxCapacity();
    const cap = Math.min(maxCap, st.capacity);
    const form = this.season.avgRating || 6.5;
    const attendance = Math.min(cap, Math.round(cap * 0.75 * (0.8 + Math.min(0.5, (form - 6.5) * 0.15)) * (1 + (st.attention - 1) * 0.04) * (1 + this.sponsors.activeOut.length * 0.025)));
    const ticketRev = attendance * st.ticketPrice;
    const drinkRev = attendance * st.drinkPrice * 0.55;
    const foodRev = attendance * st.foodPrice * 0.45;
    const parkRev = Math.min(st.parkingSlots, Math.round(attendance * 0.3)) * st.parkingPrice;
    const revenue = ticketRev + drinkRev + foodRev + parkRev;
    const goodsCost = (drinkRev + foodRev) * 0.45;
    const maintCost = (cap / 1000) * (8 - st.maintenance * 0.6) * 800;
    const net = Math.round(revenue - goodsCost - maintCost);
    this.lastStadium = { attendance, ticketRev, drinkRev, foodRev, parkRev, goodsCost, maintCost, revenue: Math.round(revenue), net };
    return net;
  }

  // ---------------- SIGNINGS ----------------
  signingChance(offerWage, prefWage, goalBonus, prefGoal, bonusAbove) {
    const ratio = prefWage > 0 ? offerWage / prefWage : 1;
    let chance;
    if (ratio < 0.5) chance = 0.05;
    else if (ratio < 0.8) chance = 0.12 + ratio * 0.35;
    else if (ratio < 1.0) chance = 0.4 + (ratio - 0.8) * 0.5;
    else if (ratio < 1.2) chance = 0.55 + (ratio - 1) * 1.5;
    else chance = 0.85 + Math.min(0.13, (ratio - 1.2) * 0.4);
    chance += (this.profile.managerScore - 50) * 0.003;
    const club = window.leaguesEngine.findClubById(this.profile.clubId);
    chance += ((club ? club.stars : 3) - 3) * 0.03;
    if (bonusAbove) chance += 0.05;
    return Math.max(0.04, Math.min(0.98, chance));
  }

  signPlayer(playerId, contract) {
    const player = this.world.players.find(p => p.id === playerId);
    if (!player) return false;
    this.contracts[playerId] = { ...contract, yearsLeft: contract.years };
    player.clubId = this.profile.clubId;
    return true;
  }

  // ---------------- SPONSORS ----------------
  sponsorCatalogIn() {
    const roots = ['VoltEnergy', 'AirJet', 'NovaBank', 'GlobalTel', 'MegaCola', 'SportX', 'PrimeOil', 'CityAuto', 'HyperTech', 'StarFood'];
    const divisions = ['Sport', 'Elite', 'Global', 'Pro', 'Prime'];
    return roots.flatMap((root, i) => divisions.map((division, idx) => ({ id: `${root}-${idx}`, name: `${root} ${division}`, tier: i + idx })));
  }

  generateSponsorInOffers() {
    const year = this.season.year;
    const stars = this.profile.stars || 3;
    const score = this.profile.managerScore;
    const catalog = [...this.sponsorCatalogIn()].sort(() => Math.random() - 0.5).slice(0, 10);
    this.sponsors.offersIn = catalog.map(c => {
      const base = (stars * 400000 + c.tier * 250000) * (1 + (year - 2000) * 0.05) * (1 + (score - 50) * 0.008);
      return { ...c, weeklyWage: Math.round(base * (0.8 + Math.random() * 0.4)), years: 1 + Math.floor(Math.random() * 3) };
    });
  }

  generateSponsorOutList() {
    const year = this.season.year;
    const list = [];
    const names = ['VoltEnergy', 'AirJet', 'NovaBank', 'GlobalTel', 'MegaCola', 'SportX', 'PrimeOil', 'CityAuto', 'HyperTech', 'StarFood', 'AeroLine', 'BlueWave', 'CryptoX', 'FastShip', 'GreenFuel', 'KingMall', 'LuxWatch', 'MediaOne', 'NutriFit', 'OceanDrink', 'PixelGames', 'QuickPay', 'RailNet', 'SunBank', 'TechHub', 'UrbanWear', 'VitaJuice', 'WorldNews', 'Xpresso', 'YourFit', 'Zenith', 'AlphaBuild', 'BetaSoft', 'CrestBank', 'DeltaAir', 'EchoSound', 'FalconGas', 'GoldLine', 'HarborPort', 'IceCola', 'JadeHotel', 'KiloFood', 'LunaLight', 'MetroBus', 'NimbusCloud', 'OrbitSat', 'PulseFm', 'Quantum', 'RocketRide', 'SilverSpa', 'TitanSteel', 'UnityTel', 'VortexVR', 'WingJet', 'XtraMart', 'YellowCab', 'ZodiacBank'];
    names.forEach((name, idx) => {
      const popularity = 50 - idx;
      const pref = Math.round((40000 + popularity * 12000) * (1 + (year - 2000) * 0.04));
      list.push({ id: `out_${idx}`, name, popularity, prefWage: pref });
    });
    this.sponsors.outSponsors = list;
  }

  // ---------------- SAVE / LOAD ----------------
  // The world player database is fully deterministic from worldSeed, so saves
  // only store the seed + gameplay deltas (contracts, lineups, our club's stats)
  // — this keeps saves tiny and guarantees the database never changes.
  exportSaveData() {
    const le = window.leaguesEngine;
    // Our club's player stats (original + signed players)
    const clubStats = {};
    this.getClubPlayers().forEach(p => {
      clubStats[p.id] = { seasonStats: p.seasonStats, careerStats: p.careerStats };
    });
    return {
      profile: this.profile,
      bank: this.bank,
      season: this.season,
      career: this.career,
      stadium: this.stadium,
      sponsors: this.sponsors,
      contracts: this.contracts,
      lineup: this.lineup,
      worldSeed: this.worldSeed,
      clubStats: clubStats,
      lastStadium: this.lastStadium || null,
      standings: JSON.parse(JSON.stringify(le.standings || [], (k, v) => k === 'squad' ? undefined : v)),
      fixtures: JSON.parse(JSON.stringify(le.fixtures || [], (k, v) => k === 'squad' ? undefined : v)),
      seasonSchedule: JSON.parse(JSON.stringify(le.seasonSchedule || [], (k, v) => k === 'squad' ? undefined : v)),
      currentLeagueId: le.currentLeagueId,
      uclStage: le.uclStage, uclQualified: le.uclQualified,
      uclQualifiersPoints: le.uclQualifiersPoints, uclQualifiersPlayed: le.uclQualifiersPlayed,
      uclGroupPoints: le.uclGroupPoints, uclGroupPlayed: le.uclGroupPlayed,
      cupStage: le.cupStage, cupGroupPoints: le.cupGroupPoints, cupGroupPlayed: le.cupGroupPlayed,
      activeMatchId: le.activeMatchId
    };
  }

  importSaveData(data) {
    if (!data) return false;
    this.profile = data.profile;
    this.bank = data.bank;
    this.season = data.season;
    this.career = data.career || this.career;
    this.stadium = data.stadium || this.stadium;
    this.sponsors = data.sponsors || this.sponsors;
    this.contracts = data.contracts || {};
    this.lineup = data.lineup || [];
    this.worldSeed = data.worldSeed;
    this.lastStadium = data.lastStadium || null;

    const le = window.leaguesEngine;
    if (data.standings) le.standings = data.standings;
    if (data.fixtures) le.fixtures = data.fixtures;
    if (data.seasonSchedule) le.seasonSchedule = data.seasonSchedule;
    if (data.currentLeagueId) le.currentLeagueId = data.currentLeagueId;
    if (data.uclStage !== undefined) le.uclStage = data.uclStage;
    if (data.uclQualified !== undefined) le.uclQualified = data.uclQualified;
    if (data.uclQualifiersPoints !== undefined) le.uclQualifiersPoints = data.uclQualifiersPoints;
    if (data.uclQualifiersPlayed !== undefined) le.uclQualifiersPlayed = data.uclQualifiersPlayed;
    if (data.uclGroupPoints !== undefined) le.uclGroupPoints = data.uclGroupPoints;
    if (data.uclGroupPlayed !== undefined) le.uclGroupPlayed = data.uclGroupPlayed;
    if (data.cupStage !== undefined) le.cupStage = data.cupStage;
    if (data.cupGroupPoints !== undefined) le.cupGroupPoints = data.cupGroupPoints;
    if (data.cupGroupPlayed !== undefined) le.cupGroupPlayed = data.cupGroupPlayed;
    if (data.activeMatchId !== undefined) le.activeMatchId = data.activeMatchId;

    // Rebuild the deterministic world from the seed
    this.generateWorld(this.worldSeed);

    // Signed players join our club; restore their stats
    const byId = {};
    this.world.players.forEach(p => byId[p.id] = p);
    Object.keys(this.contracts || {}).forEach(pid => {
      if (byId[pid]) byId[pid].clubId = this.profile.clubId;
    });
    const clubStats = data.clubStats || {};
    Object.keys(clubStats).forEach(pid => {
      if (byId[pid]) {
        byId[pid].seasonStats = clubStats[pid].seasonStats;
        byId[pid].careerStats = clubStats[pid].careerStats;
      }
    });

    this.rebuildClubSquads();
    return true;
  }

  rebuildClubSquads() {
    const le = window.leaguesEngine;
    const squads = {};
    this.world.players.forEach(p => {
      if (!squads[p.clubId]) squads[p.clubId] = [];
      squads[p.clubId].push({ ...p, stats: {} });
    });
    le.clubSquads = squads;
  }

  advanceSeason() {
    const s = this.season;
    this.career.seasonHistory.push({
      year: s.year,
      clubName: this.profile.clubName,
      matches: s.matches, wins: s.wins, draws: s.draws, losses: s.losses,
      goalsFor: s.goalsFor, goalsAgainst: s.goalsAgainst,
      avgRating: s.avgRating, profit: Math.round(s.profit)
    });
    const le = window.leaguesEngine;
    const rank = le.standings.findIndex(x => x.clubId === this.profile.clubId) + 1;
    if (rank === 1) {
      this.career.leagueTitles++;
      this.bank += 20000000;
      this.profile.managerScore = Math.min(99, this.profile.managerScore + 1);
    }
    this.profile.age++;
    s.year++;
    s.matches = 0; s.wins = 0; s.draws = 0; s.losses = 0;
    s.goalsFor = 0; s.goalsAgainst = 0; s.shots = 0; s.defActions = 0; s.saves = 0;
    s.avgRating = 0; s.ratings = [];
    s.profit = 0; s.revenue = 0; s.costs = 0; s.wages = 0; s.sponsorIncome = 0; s.sponsorOut = 0; s.stadiumNet = 0;
    this.awardsProcessed = null;
    Object.keys(this.contracts).forEach(pid => {
      this.contracts[pid].yearsLeft--;
      if (this.contracts[pid].yearsLeft <= 0) {
        delete this.contracts[pid];
        const pl = this.world.players.find(p => p.id === pid);
        if (pl) pl.clubId = null;
      }
    });
    if (!this.sponsors.activeIn) this.generateSponsorInOffers();
    if (!this.sponsors.activeOut.length) this.generateSponsorOutList();
    le.resetSeason();
    le.buildSeasonSchedule({ currentClubId: this.profile.clubId });
    this.rebuildClubSquads();
    return this.career.seasonHistory[this.career.seasonHistory.length - 1];
  }

  // ---------------- STADIUM UPGRADES ----------------
  stadiumUpgradeCosts() {
    const st = this.stadium;
    const c = (base, level, pow = 1.5) => Math.round(base * Math.pow(level + 1, pow));
    return {
      capacity: { label: 'Stadium Capacity (+5,000)', cost: c(2000000, (st.capacity - this.baseCapacity()) / 5000), maxed: st.capacity >= this.maxCapacity() },
      ticketPrice: { label: 'Ticket Price (+$5)', cost: c(500000, (st.ticketPrice - 20) / 5, 1.4), maxed: st.ticketPrice >= 100 },
      drinkPrice: { label: 'Drink Price (+$1)', cost: c(300000, st.drinkPrice - 3, 1.4), maxed: st.drinkPrice >= 15 },
      foodPrice: { label: 'Food Price (+$1)', cost: c(300000, st.foodPrice - 5, 1.4), maxed: st.foodPrice >= 15 },
      parkingPrice: { label: 'Parking Price (+$2)', cost: c(250000, (st.parkingPrice - 8) / 2, 1.4), maxed: st.parkingPrice >= 40 },
      parkingSlots: { label: 'Parking Slots (+500)', cost: c(400000, (st.parkingSlots - Math.round(this.baseCapacity() * 0.3)) / 500, 1.5), maxed: st.parkingSlots >= Math.round(this.maxCapacity() * 0.3) },
      attention: { label: 'Stadium Attention (+1)', cost: c(200000, st.attention - 1, 1.3), maxed: st.attention >= 10 },
      maintenance: { label: 'Maintenance Efficiency (+1)', cost: c(400000, st.maintenance - 1, 1.3), maxed: st.maintenance >= 10 }
    };
  }

  baseCapacity() {
    const stars = this.profile.stars || 3;
    if (stars <= 1) return 2000;
    if (stars === 2) return 3000;
    if (stars === 3) return 5000;
    if (stars === 4) return 10000;
    return 15000; // 5 stars
  }

  maxCapacity() {
    const stars = this.profile.stars || 3;
    if (stars <= 1) return 60000;
    if (stars === 2) return 80000;
    if (stars === 3) return 100000;
    if (stars === 4) return 120000;
    return 150000; // 5 stars
  }

  upgradeStadium(key) {
    const st = this.stadium;
    const costs = this.stadiumUpgradeCosts();
    const u = costs[key];
    if (!u || u.maxed || this.bank < u.cost) return false;
    this.bank -= u.cost;
    switch (key) {
      case 'capacity': st.capacity += 5000; break;
      case 'ticketPrice': st.ticketPrice += 5; break;
      case 'drinkPrice': st.drinkPrice += 1; break;
      case 'foodPrice': st.foodPrice += 1; break;
      case 'parkingPrice': st.parkingPrice += 2; break;
      case 'parkingSlots': st.parkingSlots += 500; break;
      case 'attention': st.attention += 1; break;
      case 'maintenance': st.maintenance += 1; break;
    }
    return true;
  }
}

/**
 * MANAGER MODE — UI layer (rendering + menu flow)
 */

window.ManagerGame = ManagerGame;

class ManagerUI {
  constructor() {
    this.game = null;
    this.mTab = 'dashboard';
    this.sim = null;
    this.activeSaveSlot = null;
    this.creationData = {
      age: 45,
      startYear: 2026,
      budget: null,
      managerScore: 70,
      clubId: null
    };
    this.sigFilters = { name: '', mvMin: 0, mvMax: 500000000, ageMin: 16, ageMax: 45, pos: '', ovrMin: 50, ovrMax: 99 };
    this.signingTarget = null;
    this.spinChangeTarget = null;
    this.spoutTarget = null;
  }

  // ================= MENU FLOW =================
  menuManagerMode() {
    document.getElementById('panel-play-modes').classList.remove('active');
    document.getElementById('panel-manager').classList.add('active');
  }

  menuManagerNewGame() {
    document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
    window.managerGame = new ManagerGame();
    this.game = window.managerGame;
    this.randomizeManagerCreation();
    window.app.openModal('modal-manager-creation');
  }

  menuManagerLoadSaves() {
    document.getElementById('panel-manager').classList.remove('active');
    this.renderManagerSavesList();
    document.getElementById('panel-manager-saves').classList.add('active');
  }

  getManagerSaves() {
    try { return JSON.parse(localStorage.getItem('football_manager_saves') || '[]'); } catch (e) { return []; }
  }

  setManagerSaves(saves) {
    try { localStorage.setItem('football_manager_saves', JSON.stringify(saves)); return true; } catch (e) { return false; }
  }

  renderManagerSavesList() {
    const container = document.getElementById('manager-saves-list-container');
    if (!container) return;
    const saves = this.getManagerSaves();
    if (!saves.length) {
      container.innerHTML = '<div class="no-saves-msg">📭 No manager saves found.<br>Start a New Manager Career!</div>';
      return;
    }
    container.innerHTML = saves.map((s, idx) => `
      <div class="save-slot" onclick="managerUI.loadManagerSaveSlot(${idx})">
        <div class="save-slot-info">
          <h4>👔 ${s.name} ${s.flag || '⚽'}</h4>
          <p>${s.clubName} • Age ${s.age} • Season ${s.season || 1} • Score ${s.score}</p>
        </div>
        <div class="save-slot-meta">
          <div class="money-text">$${(s.bank || 0).toLocaleString()}</div>
        </div>
        <button class="save-slot-delete" onclick="event.stopPropagation(); managerUI.deleteManagerSaveSlot(${idx});">✕</button>
      </div>
    `).join('');
  }

  loadManagerSaveSlot(index) {
    const saves = this.getManagerSaves();
    if (index < 0 || index >= saves.length) return;
    try {
      const game = new ManagerGame();
      game.importSaveData(saves[index].data);
      window.managerGame = game;
      this.game = game;
      this.activeSaveSlot = index;
      this.enterManagerMode();
    } catch (e) {
      console.error(e);
      window.app.showGameNotice('⚠️ Loading Error', "<p style='color:#ef4444;'>Failed to load manager save.</p>");
    }
  }

  deleteManagerSaveSlot(index) {
    if (!confirm('🗑️ Delete this manager save? This cannot be undone!')) return;
    const saves = this.getManagerSaves();
    saves.splice(index, 1);
    this.setManagerSaves(saves);
    this.renderManagerSavesList();
  }

  saveManagerGame(showNotice = false) {
    if (!this.game) return false;
    const g = this.game;
    const saves = this.getManagerSaves();
    const summary = {
      name: g.profile.name,
      flag: g.profile.flag,
      clubName: g.profile.clubName,
      age: g.profile.age,
      score: g.profile.managerScore,
      bank: g.bank,
      season: g.season.year,
      savedAt: new Date().toISOString(),
      data: g.exportSaveData()
    };
    if (this.activeSaveSlot != null && this.activeSaveSlot < saves.length) {
      saves[this.activeSaveSlot] = summary;
    } else {
      saves.push(summary);
      this.activeSaveSlot = saves.length - 1;
    }
    const ok = this.setManagerSaves(saves);
    if (showNotice && ok) window.app.showGameNotice('💾 Manager Career Saved!', "<p style='color:#fff;'>Your manager save has been saved successfully.</p>");
    return ok;
  }

  // ================= CREATION =================
  randomizeManagerCreation() {
    const le = window.leaguesEngine;
    this.populateManagerCreationDropdowns();
    const nations = le.nationalTeams;
    const randNation = nations[Math.floor(Math.random() * nations.length)];
    const natSelect = document.getElementById('m-create-nationality');
    if (natSelect) natSelect.value = randNation.name;
    const nameInput = document.getElementById('m-create-name');
    let first = 'José', last = 'Manager';
    if (window.NATIONAL_NAMES) {
      const cc = le.getCulturalCountry(randNation.name);
      if (window.NATIONAL_NAMES[cc]) {
        const f = window.NATIONAL_NAMES[cc].first;
        const l = window.NATIONAL_NAMES[cc].last;
        first = f[Math.floor(Math.random() * f.length)];
        last = l[Math.floor(Math.random() * l.length)];
      }
    }
    if (nameInput) nameInput.value = `${first} ${last}`;
    const clubSelect = document.getElementById('m-create-club');
    const allClubs = [];
    Object.values(le.leagues).forEach(lg => lg.clubs.forEach(c => allClubs.push({ clubId: c.id, leagueId: lg.id, stars: c.stars })));
    const randClub = allClubs[Math.floor(Math.random() * allClubs.length)];
    if (clubSelect) clubSelect.value = randClub.clubId;
    this.creationData.clubId = randClub.clubId;
    this.onManagerClubChange(randClub.clubId);
    const age = 35 + Math.floor(Math.random() * 16);
    this.creationData.age = age;
    const ageSlider = document.getElementById('m-slider-age');
    if (ageSlider) ageSlider.value = age;
    const ageVal = document.getElementById('m-val-age');
    if (ageVal) ageVal.innerText = age;
    this.rerollManagerScore();
    const seasonSelect = document.getElementById('m-create-season');
    if (seasonSelect) seasonSelect.value = 2026;
    this.onManagerSeasonChange(2026);
  }

  populateManagerCreationDropdowns() {
    const le = window.leaguesEngine;
    const natSelect = document.getElementById('m-create-nationality');
    if (natSelect && natSelect.options.length === 0) {
      const sorted = [...le.nationalTeams].sort((a, b) => a.name.localeCompare(b.name));
      natSelect.innerHTML = sorted.map(n => `<option value="${n.name}">${n.name} ${'⭐'.repeat(n.stars)}</option>`).join('');
      natSelect.onchange = () => {
        const nameInput = document.getElementById('m-create-name');
        const cc = le.getCulturalCountry(natSelect.value);
        if (window.NATIONAL_NAMES && window.NATIONAL_NAMES[cc] && nameInput) {
          const f = window.NATIONAL_NAMES[cc].first, l = window.NATIONAL_NAMES[cc].last;
          nameInput.value = `${f[Math.floor(Math.random() * f.length)]} ${l[Math.floor(Math.random() * l.length)]}`;
        }
      };
    }
    const clubSelect = document.getElementById('m-create-club');
    if (clubSelect && clubSelect.options.length === 0) {
      let html = '';
      Object.values(le.leagues).forEach(lg => {
        html += `<optgroup label="🏆 ${lg.name} (${lg.country})">`;
        lg.clubs.forEach(c => html += `<option value="${c.id}" data-league="${lg.id}">${c.name} (${'⭐'.repeat(c.stars || 2)})</option>`);
        html += `</optgroup>`;
      });
      clubSelect.innerHTML = html;
      clubSelect.onchange = () => this.onManagerClubChange(clubSelect.value);
    }
    const seasonSelect = document.getElementById('m-create-season');
    if (seasonSelect && seasonSelect.options.length === 0) {
      let html = '';
      for (let yr = 2000; yr <= 2026; yr++) {
        const next = String(yr + 1).slice(-2);
        html += `<option value="${yr}" ${yr === 2026 ? 'selected' : ''}>${yr}-${yr + 1} Season</option>`;
      }
      seasonSelect.innerHTML = html;
      seasonSelect.onchange = () => this.onManagerSeasonChange(parseInt(seasonSelect.value));
    }
  }

  onManagerClubChange(clubId) {
    this.creationData.clubId = clubId;
    const club = window.leaguesEngine.findClubById(clubId);
    const stars = club ? (club.stars || 3) : 3;
    const el = document.getElementById('m-create-club-stars');
    if (el) el.innerHTML = '⭐'.repeat(stars);
    this.onManagerSeasonChange(this.creationData.startYear || 2026);
  }

  onManagerSeasonChange(year) {
    this.creationData.startYear = year;
    const g = new ManagerGame();
    g.profile.startYear = year;
    const rec = g.getRecommendedBudget(this.creationData.clubId || 'barcelona', year);
    this.creationData.budget = rec;
    const budgetEl = document.getElementById('m-create-budget');
    if (budgetEl) budgetEl.value = rec;
    const recEl = document.getElementById('m-create-budget-rec');
    if (recEl) recEl.innerText = `Recommended: $${rec.toLocaleString()}`;
  }

  rerollManagerScore() {
    const score = 1 + Math.floor(Math.random() * 99);
    this.creationData.managerScore = score;
    const el = document.getElementById('m-manager-score');
    if (el) el.innerText = score;
    const desc = document.getElementById('m-manager-score-desc');
    if (desc) {
      if (score >= 85) desc.innerText = 'Legendary — your team plays far above its level';
      else if (score >= 70) desc.innerText = 'Elite — strong tactical boost';
      else if (score >= 50) desc.innerText = 'Solid — modest boost';
      else if (score >= 30) desc.innerText = 'Developing — small boost';
      else desc.innerText = 'Under pressure — little boost';
    }
  }

  onManagerAgeChange(val) {
    this.creationData.age = parseInt(val);
    const el = document.getElementById('m-val-age');
    if (el) el.innerText = val;
  }

  submitManagerCreation() {
    const g = this.game;
    if (!g) return;
    const nameRaw = (document.getElementById('m-create-name') || {}).value || 'José Manager';
    const name = String(nameRaw).replace(/[<>&"'`]/g, '').trim().slice(0, 40) || 'José Manager';
    const natName = document.getElementById('m-create-nationality').value;
    const clubId = this.creationData.clubId || document.getElementById('m-create-club').value;
    const budget = parseInt(document.getElementById('m-create-budget').value) || this.creationData.budget;

    const natObj = window.leaguesEngine.nationalTeams.find(n => n.name === natName);
    const clubObj = window.leaguesEngine.findClubById(clubId);
    const leagueId = window.leaguesEngine.findLeagueForClub(clubId) || 'turkey_d2';

    g.profile.name = name;
    g.profile.nationality = natName;
    g.profile.flag = natObj ? natObj.flag : '⚽';
    g.profile.clubId = clubId;
    g.profile.clubName = clubObj ? clubObj.name : 'Club';
    g.profile.stars = clubObj ? (clubObj.stars || 3) : 3;
    g.profile.age = this.creationData.age;
    g.profile.startYear = this.creationData.startYear;
    g.profile.managerScore = this.creationData.managerScore;
    g.bank = budget || g.getRecommendedBudget(clubId, this.creationData.startYear);
    g.season.year = this.creationData.startYear;

    window.leaguesEngine.initLeague(leagueId);
    window.leaguesEngine.buildSeasonSchedule({ currentClubId: clubId });

    g.generateWorld(Math.floor(Math.random() * 999999) + 1);
    g.rebuildClubSquads();

    const squad = window.leaguesEngine.clubSquads[clubId] || [];
    g.lineup = squad.map(p => p.id).filter(Boolean);

    g.stadium.capacity = g.baseCapacity();
    g.stadium.parkingSlots = Math.round(g.baseCapacity() * 0.3);
    g.stadium.ticketPrice = 20; g.stadium.drinkPrice = 3; g.stadium.foodPrice = 5; g.stadium.parkingPrice = 8;

    g.generateSponsorInOffers();
    g.generateSponsorOutList();

    this.activeSaveSlot = null;
    window.app.closeModal('modal-manager-creation');
    this.enterManagerMode();
    this.saveManagerGame();
    setTimeout(() => {
      window.app.showGameNotice('👔 Welcome, Manager!', `<p style="color:#fff;line-height:1.6;">You are now the manager of <strong>${g.profile.clubName}</strong>!<br><br>💼 Starting Budget: <strong style="color:var(--primary);">$${g.bank.toLocaleString()}</strong><br>🎯 Manager Score: <strong style="color:var(--accent-gold);">${g.profile.managerScore}</strong><br><br>Manage your team, sign players, upgrade the stadium and chase trophies!</p>`);
    }, 1000);
  }

  // ================= MODE ENTRY =================
  enterManagerMode() {
    const g = this.game;
    if (!g) return;
    document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
    const menu = document.getElementById('main-menu');
    if (menu) menu.classList.add('hidden');
    const appContainer = document.getElementById('app-container');
    if (appContainer) appContainer.style.display = '';
    const playerNav = document.getElementById('nav-tabs');
    if (playerNav) playerNav.style.display = 'none';
    const managerNav = document.getElementById('manager-nav');
    if (managerNav) managerNav.style.display = 'flex';
    const lvl = document.getElementById('level-bar-container');
    if (lvl) lvl.style.display = 'none';
    document.querySelectorAll('.view-page').forEach(pg => pg.classList.remove('active'));
    document.querySelectorAll('.m-page').forEach(pg => pg.classList.remove('active'));
    const dash = document.getElementById('page-m-dashboard');
    if (dash) dash.classList.add('active');
    document.querySelectorAll('.m-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.mtab === 'dashboard'));
    this.mTab = 'dashboard';
    this.refreshManagerUI();
  }

  exitToMenu() {
    window.app.showMainMenu();
    const playerNav = document.getElementById('nav-tabs');
    if (playerNav) playerNav.style.display = '';
    const managerNav = document.getElementById('manager-nav');
    if (managerNav) managerNav.style.display = 'none';
    document.querySelectorAll('.m-page').forEach(pg => pg.classList.remove('active'));
    const lvl = document.getElementById('level-bar-container');
    if (lvl) lvl.style.display = '';
  }

  switchMTab(tabId) {
    if (tabId === 'games' || tabId === 'standings') {
      document.querySelectorAll('.m-page').forEach(pg => pg.classList.remove('active'));
      document.querySelectorAll('.view-page').forEach(pg => pg.classList.remove('active'));
      const page = document.getElementById(`page-${tabId}`);
      if (page) page.classList.add('active');
    } else {
      document.querySelectorAll('.view-page').forEach(pg => pg.classList.remove('active'));
      document.querySelectorAll('.m-page').forEach(pg => pg.classList.remove('active'));
      const page = document.getElementById(`page-m-${tabId}`);
      if (page) page.classList.add('active');
    }
    document.querySelectorAll('.m-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.mtab === tabId));
    this.mTab = tabId;
    this.refreshManagerUI();
  }

  refreshManagerUI() {
    const run = (name, fn) => { try { fn.call(this); } catch (e) { console.error('Manager render error:', name, e); } };
    run('header', this.renderManagerHeader);
    run('dashboard', this.renderMDashboard);
    run('team', this.renderMTeam);
    run('signings', this.renderMSignings);
    run('sponsors', this.renderMSponsors);
    run('stadium', this.renderMStadium);
    run('games', this.renderMGames);
    run('standings', this.renderMStandings);
  }

  renderManagerHeader() {
    const g = this.game;
    if (!g) return;
    const p = g.profile;
    const nameEl = document.getElementById('meta-player-name');
    const ageEl = document.getElementById('meta-age');
    const ovrEl = document.getElementById('meta-ovr');
    const clubEl = document.getElementById('meta-club');
    const bankEl = document.getElementById('meta-bank');
    const flagHtml = window.leaguesEngine.getCountryFlagHtml(p.nationality || 'Spain', 22);
    if (nameEl) nameEl.innerHTML = `👔 ${p.name} ${flagHtml}`;
    if (ageEl) ageEl.innerText = `${p.age} y/o`;
    if (ovrEl) ovrEl.innerText = `SCORE ${p.managerScore}`;
    if (clubEl) clubEl.innerText = p.clubName;
    if (bankEl) bankEl.innerText = `$${g.bank.toLocaleString()}`;
  }

  // ================= DASHBOARD =================
  renderMDashboard() {
    const g = this.game;
    if (!g) return;
    const container = document.getElementById('m-next-match-box');
    if (container) {
      const nextFix = window.leaguesEngine.getNextMatch(g.profile.clubId);
      if (!nextFix) {
        container.innerHTML = `<div style="text-align:center;width:100%;"><h3>🏆 Season Completed!</h3><p style="color:var(--text-muted);margin:10px 0;">All scheduled games have been played.</p><button class="btn btn-accent btn-lg" onclick="managerUI.advanceSeason()">Advance to Next Season ⏩</button></div>`;
      } else {
        const homeName = nextFix.displayHomeName || 'Home';
        const awayName = nextFix.displayAwayName || 'Away';
        const isHome = nextFix.userSide === 'home';
        container.innerHTML = `
          <div class="match-banner" style="padding:14px;">
            <div style="width:100%;margin-bottom:10px;text-align:center;text-transform:uppercase;letter-spacing:1px;font-size:12px;color:var(--accent-gold);font-weight:900;">${nextFix.matchLabel || 'Match'} ${isHome ? '🏟️ (Home)' : '✈️ (Away)'}</div>
            <div class="teams-vs">
              <div class="team-box"><div class="team-badge">${window.leaguesEngine.getClubBadgeHtml(homeName, 44)}</div><div style="font-weight:800;margin-top:6px;">${homeName}</div></div>
              <div class="vs-text">VS</div>
              <div class="team-box"><div class="team-badge">${window.leaguesEngine.getClubBadgeHtml(awayName, 44)}</div><div style="font-weight:800;margin-top:6px;">${awayName}</div></div>
            </div>
            <button class="btn btn-primary btn-lg" style="margin-top:12px;" onclick="managerUI.simulateMatch()">⚽ Simulate Match</button>
          </div>`;
      }
    }
    const s = g.season;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
    set('m-sum-matches', s.matches);
    set('m-sum-wins', `${s.wins} / ${s.draws} / ${s.losses}`);
    set('m-sum-losses', s.losses);
    set('m-sum-draws', s.draws);
    set('m-sum-goals', s.goalsFor);
    set('m-sum-ga', s.goalsAgainst);
    set('m-sum-shots', s.shots);
    set('m-sum-def', s.defActions);
    set('m-sum-saves', s.saves);
    set('m-sum-rating', s.avgRating || '0.0');
    set('m-sum-profit', `${s.profit >= 0 ? '+' : ''}$${Math.round(s.profit).toLocaleString()}`);
    set('m-sum-bank', `$${g.bank.toLocaleString()}`);
    const strengthEl = document.getElementById('m-sum-strength');
    if (strengthEl) strengthEl.innerText = `${Math.round(g.getStrength())} OVR`;
  }

  // ================= TEAM TAB =================
  renderMTeam() {
    const g = this.game;
    if (!g) return;
    const view = (document.getElementById('m-team-view') || {}).value || 'stats';
    const statsView = document.getElementById('m-team-stats-view');
    const formView = document.getElementById('m-team-formation-view');
    if (statsView) statsView.style.display = view === 'stats' ? 'block' : 'none';
    if (formView) formView.style.display = view === 'formation' ? 'block' : 'none';
    if (view === 'stats') this.renderMTeamStats();
    else this.renderMFormation();
  }

  renderMTeamStats() {
    const g = this.game;
    const tbody = document.getElementById('m-team-stats-body');
    if (!tbody) return;
    const xiIds = new Set(g.lineup);
    const players = [...g.getXI(), ...g.getInventory()];
    const con = (p) => {
      const c = g.contracts[p.id];
      return c ? `$${c.wage.toLocaleString()}/wk` : `$${(p.preferredWage * 0.5).toLocaleString()}/wk`;
    };
    tbody.innerHTML = players.map(p => {
      const c = g.contracts[p.id];
      const ss = p.seasonStats || {};
      const role = p.position === 'GK' ? `${ss.roleActions || 0} saves` : (['CB','LB','RB','CM'].includes(p.position) ? `${ss.roleActions || 0} actions` : `${ss.roleActions || 0}`);
      const years = c ? c.yearsLeft : '—';
      return `
        <tr ${xiIds.has(p.id) ? 'style="background:rgba(0,255,136,0.06);font-weight:bold;"' : ''}>
          <td>${xiIds.has(p.id) ? '⭐' : '🪑'} ${p.position}</td>
          <td>${window.leaguesEngine.getCountryFlagHtml(p.nationality, 18)} ${p.name}</td>
          <td>OVR ${p.ovr}</td>
          <td>${p.age} y/o</td>
          <td style="text-align:center;font-weight:900;color:var(--accent-gold);">${ss.matches || 0}</td>
          <td style="text-align:center;font-weight:900;color:var(--primary);">${ss.goals || 0}</td>
          <td style="text-align:center;font-weight:900;color:var(--accent-blue);">${ss.assists || 0}</td>
          <td style="text-align:center;font-weight:900;color:var(--accent-gold);">${role}</td>
          <td>${con(p)} • ${years}yr</td>
        </tr>`;
    }).join('');
  }

  // ============ FORMATION ============
  formationSlots() {
    return [
      { pos: 'GK', x: 50, y: 128 },
      { pos: 'LB', x: 14, y: 104 },
      { pos: 'CB', x: 37, y: 108 },
      { pos: 'CB', x: 63, y: 108 },
      { pos: 'RB', x: 86, y: 104 },
      { pos: 'CM', x: 26, y: 78 },
      { pos: 'CM', x: 74, y: 78 },
      { pos: 'CAM', x: 50, y: 66 },
      { pos: 'LW', x: 18, y: 40 },
      { pos: 'ST', x: 50, y: 32 },
      { pos: 'RW', x: 82, y: 40 }
    ];
  }

  renderMFormation() {
    const g = this.game;
    const container = document.getElementById('m-formation-container');
    if (!container) return;
    const byId = {};
    g.world.players.forEach(p => byId[p.id] = p);
    const slots = this.formationSlots();
    const lineupIds = [...g.lineup];
    while (lineupIds.length < 11) lineupIds.push(null);

    const tile = (p, pos, slotIdx, isBench) => {
      if (!p) return `<div class="m-tile m-tile-empty" data-slot="${slotIdx}">—</div>`;
      const c = g.contracts[p.id];
      const years = c ? c.yearsLeft : '—';
      return `<div class="m-tile ${isBench ? 'm-tile-bench' : ''}" data-pid="${p.id}" data-slot="${slotIdx}"
        onmouseover="managerUI.showPlayerTooltip(event,'${p.id}')" onmouseout="managerUI.hidePlayerTooltip()">
        <div class="m-tile-ovr">${p.ovr}</div>
        <div class="m-tile-pos">${pos}</div>
        <div class="m-tile-years">${years}y</div>
      </div>`;
    };

    const bench = g.getInventory();
    const benchHtml = bench.map((p, i) => tile(p, p.position, i, true)).join('') || '<div style="color:var(--text-muted);font-size:13px;padding:10px;">No reserve players. Sign players to add them here!</div>';

    // Build pitch with absolutely positioned tiles
    let pitchHtml = '';
    slots.forEach((slot, idx) => {
      const pid = lineupIds[idx];
      const p = pid ? byId[pid] : null;
      pitchHtml += `<div style="position:absolute;left:calc(${slot.x}% - 34px);top:calc(${slot.y / 140 * 100}% - 34px);">${tile(p, slot.pos, idx, false)}</div>`;
    });

    container.innerHTML = `
      <div style="display:flex;gap:20px;flex-wrap:wrap;">
        <div style="flex:1;min-width:320px;background:linear-gradient(180deg,#0b3d1f,#14532d);border-radius:14px;padding:16px;border:2px solid #22c55e;position:relative;">
          <svg viewBox="0 0 100 140" style="position:absolute;inset:0;width:100%;height:100%;">
            <rect x="2" y="2" width="96" height="136" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="0.8"/>
            <line x1="50" y1="2" x2="50" y2="138" stroke="rgba(255,255,255,0.35)" stroke-width="0.8"/>
            <circle cx="50" cy="70" r="16" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="0.8"/>
            <rect x="28" y="2" width="44" height="26" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="0.8"/>
            <rect x="28" y="112" width="44" height="26" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="0.8"/>
          </svg>
          <div style="position:relative;width:100%;aspect-ratio:100/140;max-width:360px;margin:0 auto;">${pitchHtml}</div>
        </div>
        <div style="flex:1;min-width:240px;">
          <h4 style="color:var(--accent-gold);margin-bottom:10px;">🧑‍🤝‍🧑 Reserve Players (${bench.length})</h4>
          <div style="display:flex;flex-wrap:wrap;gap:8px;" id="m-bench-list">
            ${benchHtml}
          </div>
          <p style="color:var(--text-muted);font-size:12px;margin-top:12px;">Click a reserve player to put them into their position in the starting XI (the current starter moves to reserves). Hover a tile for full details.</p>
        </div>
      </div>`;
  }

  showPlayerTooltip(e, pid) {
    const g = this.game;
    const p = g.world.players.find(x => x.id === pid);
    if (!p) return;
    const c = g.contracts[p.id];
    const el = document.getElementById('m-tooltip');
    if (!el) return;
    el.innerHTML = `
      <div style="font-weight:900;font-size:15px;">${window.leaguesEngine.getCountryFlagHtml(p.nationality, 18)} ${p.name}</div>
      <div style="margin-top:6px;font-size:13px;">⚽ ${p.position} • OVR <b>${p.ovr}</b> • Age <b>${p.age}</b></div>
      <div style="font-size:13px;">🌍 ${p.nationality}</div>
      <div style="font-size:13px;">💰 Market Value: <b>$${p.marketValue.toLocaleString()}</b></div>
      <div style="font-size:13px;">💵 Wage: <b>$${(c ? c.wage : p.preferredWage).toLocaleString()}/wk</b></div>
      <div style="font-size:13px;">📅 Years left: <b>${c ? c.yearsLeft : '—'}</b></div>`;
    el.style.display = 'block';
    const rect = el.getBoundingClientRect();
    let x = e.clientX + 14, y = e.clientY + 14;
    if (x + rect.width > window.innerWidth - 10) x = e.clientX - rect.width - 14;
    if (y + rect.height > window.innerHeight - 10) y = e.clientY - rect.height - 14;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
  }

  hidePlayerTooltip() {
    const el = document.getElementById('m-tooltip');
    if (el) el.style.display = 'none';
  }

  swapPlayerIntoXI(pid) {
    const g = this.game;
    const p = g.world.players.find(x => x.id === pid);
    if (!p) return;
    const slots = this.formationSlots();
    const lineupIds = [...g.lineup];
    const slotIdx = slots.findIndex((s, i) => s.pos === p.position && lineupIds[i] !== pid);
    if (slotIdx === -1) {
      window.app.showGameNotice('⚠️ No Position', `<p style="color:#ef4444;">${p.name} (${p.position}) has no matching starting spot. Only GK, LB, CB, RB, CM, CAM, LW, ST, RW slots exist.</p>`);
      return;
    }
    lineupIds[slotIdx] = pid;
    g.lineup = lineupIds;
    this.saveManagerGame();
    this.renderMTeam();
  }

  // ================= SIGNINGS =================
  renderMSignings() {
    const g = this.game;
    const tbody = document.getElementById('m-signing-results');
    if (!tbody) return;
    const f = this.sigFilters;
    const pool = g.world.players.filter(p => {
      if (p.clubId === g.profile.clubId) return false;
      if (f.name && !p.name.toLowerCase().includes(f.name.toLowerCase())) return false;
      if (p.marketValue < f.mvMin || p.marketValue > f.mvMax) return false;
      if (p.age < f.ageMin || p.age > f.ageMax) return false;
      if (f.pos && p.position !== f.pos) return false;
      if (p.ovr < f.ovrMin || p.ovr > f.ovrMax) return false;
      return true;
    }).sort((a, b) => b.ovr - a.ovr).slice(0, 40);

    if (!pool.length) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:30px;">No players match your filters.</td></tr>`;
      return;
    }
    tbody.innerHTML = pool.map(p => `
      <tr>
        <td>${window.leaguesEngine.getCountryFlagHtml(p.nationality, 18)} ${p.name}</td>
        <td>${p.position}</td>
        <td>OVR ${p.ovr}</td>
        <td>${p.age} y/o</td>
        <td>$${p.marketValue.toLocaleString()}</td>
        <td style="display:flex;gap:8px;">
          <button class="btn btn-secondary btn-sm" onclick="managerUI.openPlayerStats('${p.id}')">📊 Stats</button>
          <button class="btn btn-primary btn-sm" onclick="managerUI.openOfferModal('${p.id}')">✍️ Offer</button>
        </td>
      </tr>
    `).join('');
  }

  applySigFilter() {
    const get = id => document.getElementById(id);
    this.sigFilters = {
      name: (get('m-sig-name') || {}).value || '',
      mvMin: parseInt((get('m-sig-mv-min') || {}).value) || 0,
      mvMax: parseInt((get('m-sig-mv-max') || {}).value) || 500000000,
      ageMin: parseInt((get('m-sig-age-min') || {}).value) || 16,
      ageMax: parseInt((get('m-sig-age-max') || {}).value) || 45,
      pos: (get('m-sig-pos') || {}).value || '',
      ovrMin: parseInt((get('m-sig-ovr-min') || {}).value) || 50,
      ovrMax: parseInt((get('m-sig-ovr-max') || {}).value) || 99
    };
    this.renderMSignings();
  }

  openPlayerStats(pid) {
    const g = this.game;
    const p = g.world.players.find(x => x.id === pid);
    if (!p) return;
    const body = document.getElementById('mplayer-stats-body');
    if (!body) return;
    const club = window.leaguesEngine.findClubById(p.clubId);
    const historyRows = (p.history || []).slice(-10).reverse().map(h => `
      <tr>
        <td>${h.year}</td>
        <td>${h.clubName}</td>
        <td>${h.matches}</td>
        <td style="text-align:center;color:var(--primary);">${h.goals}</td>
        <td style="text-align:center;color:var(--accent-blue);">${h.assists}</td>
        <td style="text-align:center;">${h.finish}${h.finish === 1 ? ' 🏆' : ''}</td>
        <td>${(h.trophies || []).join(', ') || '—'}</td>
      </tr>
    `).join('');
    body.innerHTML = `
      <div style="text-align:center;margin-bottom:14px;">
        <div style="font-size:20px;font-weight:900;">${window.leaguesEngine.getCountryFlagHtml(p.nationality, 24)} ${p.name}</div>
        <div style="font-size:13px;color:var(--text-muted);">${p.position} • OVR <b style="color:var(--primary);">${p.ovr}</b> • Age ${p.age}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:13px;margin-bottom:16px;">
        <div>🏟️ Current Club: <b>${club ? club.name : 'Free Agent'}</b></div>
        <div>🌍 Nationality: <b>${p.nationality}</b></div>
        <div>💰 Market Value: <b>$${p.marketValue.toLocaleString()}</b></div>
        <div>💵 Preferred Wage: <b>$${p.preferredWage.toLocaleString()}/wk</b></div>
        <div>📅 Career Matches: <b>${p.careerStats.matches}</b></div>
        <div>⚽ Career Goals: <b style="color:var(--primary);">${p.careerStats.goals}</b></div>
        <div>🎯 Career Assists: <b style="color:var(--accent-blue);">${p.careerStats.assists}</b></div>
        <div>🏆 Trophies: <b>${p.history.reduce((n, h) => n + (h.trophies || []).length, 0)}</b></div>
      </div>
      <div style="font-weight:800;color:var(--accent-gold);margin-bottom:8px;">📜 Previous Seasons</div>
      <div class="table-wrapper"><table class="data-table" style="font-size:12px;">
        <thead><tr><th>Season</th><th>Club</th><th>P</th><th>G</th><th>A</th><th>League Pos</th><th>Trophies</th></tr></thead>
        <tbody>${historyRows || '<tr><td colspan="7" style="text-align:center;">No history</td></tr>'}</tbody>
      </table></div>`;
    window.app.openModal('modal-mplayer-stats');
  }

  openOfferModal(pid) {
    const g = this.game;
    const p = g.world.players.find(x => x.id === pid);
    if (!p) return;
    this.signingTarget = pid;
    const body = document.getElementById('moffer-body');
    if (!body) return;
    body.innerHTML = `
      <div style="text-align:center;margin-bottom:12px;">
        <div style="font-size:18px;font-weight:900;">${window.leaguesEngine.getCountryFlagHtml(p.nationality, 20)} ${p.name}</div>
        <div style="font-size:13px;color:var(--text-muted);">${p.position} • OVR ${p.ovr} • Age ${p.age}</div>
      </div>
      <div style="display:grid;gap:12px;text-align:left;">
        <label style="display:grid;gap:4px;font-weight:700;">Weekly Wage <span style="font-size:12px;color:var(--accent-gold);">Preferred: $${p.preferredWage.toLocaleString()}/wk</span>
          <input class="form-input" id="m-offer-wage" type="number" value="${Math.round(p.preferredWage * 1.05)}" min="1000">
        </label>
        <label style="display:grid;gap:4px;font-weight:700;">Goal Bonus <span style="font-size:12px;color:var(--accent-gold);">Preferred: $${Math.round(p.preferredWage * 1.25).toLocaleString()}/goal</span>
          <input class="form-input" id="m-offer-goal" type="number" value="${Math.round(p.preferredWage * 1.25)}" min="0">
        </label>
        <label style="display:grid;gap:4px;font-weight:700;">Assist Bonus <span style="font-size:12px;color:var(--accent-gold);">Preferred: $${Math.round(p.preferredWage * 0.75).toLocaleString()}/assist</span>
          <input class="form-input" id="m-offer-assist" type="number" value="${Math.round(p.preferredWage * 0.75)}" min="0">
        </label>
        <label style="display:grid;gap:4px;font-weight:700;">${p.position === 'GK' ? 'Save Bonus' : 'Role Bonus'} (${p.position === 'GK' ? '$/save' : '$/defensive action'})
          <input class="form-input" id="m-offer-role" type="number" value="5000" min="0">
        </label>
        <label style="display:grid;gap:4px;font-weight:700;">Contract Length (seasons)
          <select class="form-select" id="m-offer-years"><option value="1">1</option><option value="2" selected>2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select>
        </label>
        <div style="font-size:13px;color:var(--text-muted);" id="m-offer-chance">Acceptance chance: calculating...</div>
        <button class="btn btn-primary" onclick="managerUI.submitOffer()">Send Contract Offer ✍️</button>
      </div>`;
    const wageEl = document.getElementById('m-offer-wage');
    if (wageEl) wageEl.oninput = () => this.updateOfferChance();
    const goalEl = document.getElementById('m-offer-goal');
    if (goalEl) goalEl.oninput = () => this.updateOfferChance();
    this.updateOfferChance();
    window.app.openModal('modal-moffer');
  }

  updateOfferChance() {
    const g = this.game;
    const p = g.world.players.find(x => x.id === this.signingTarget);
    if (!p) return;
    const wage = parseInt(document.getElementById('m-offer-wage')?.value) || 0;
    const goal = parseInt(document.getElementById('m-offer-goal')?.value) || 0;
    const prefGoal = Math.round(p.preferredWage * 1.25);
    const chance = g.signingChance(wage, p.preferredWage, goal, prefGoal, goal >= prefGoal);
    const el = document.getElementById('m-offer-chance');
    if (el) {
      el.innerHTML = `Acceptance chance: <b style="color:${chance > 0.6 ? 'var(--primary)' : chance > 0.35 ? 'var(--accent-gold)' : '#ef4444'};font-size:16px;">${Math.round(chance * 100)}%</b> <span style="font-size:11px;">(Manager score ${g.profile.managerScore} ${g.profile.managerScore >= 50 ? 'boosts' : 'hurts'} this)</span>`;
    }
  }

  submitOffer() {
    const g = this.game;
    const p = g.world.players.find(x => x.id === this.signingTarget);
    if (!p) return;
    const wage = parseInt(document.getElementById('m-offer-wage')?.value) || 0;
    const goal = parseInt(document.getElementById('m-offer-goal')?.value) || 0;
    const assist = parseInt(document.getElementById('m-offer-assist')?.value) || 0;
    const role = parseInt(document.getElementById('m-offer-role')?.value) || 0;
    const years = parseInt(document.getElementById('m-offer-years')?.value) || 2;
    if (wage <= 0) return;
    const prefGoal = Math.round(p.preferredWage * 1.25);
    const chance = g.signingChance(wage, p.preferredWage, goal, prefGoal, goal >= prefGoal);
    window.app.closeModal('modal-moffer');
    if (Math.random() < chance) {
      g.signPlayer(p.id, { wage, goalBonus: goal, assistBonus: assist, roleBonus: role, years });
      this.saveManagerGame();
      window.app.showGameNotice('✅ Contract Signed!', `<p style="color:#fff;line-height:1.6;">${p.name} has agreed to join <b>${g.profile.clubName}</b>!<br><br>💵 $${wage.toLocaleString()}/wk for ${years} season(s)<br>⚽ +$${goal.toLocaleString()}/goal • 🎯 +$${assist.toLocaleString()}/assist<br><br>The player has been added to your reserve list. Go to Team → Formation to put them in the XI!</p>`);
      this.renderMTeam();
      this.renderMSignings();
    } else {
      window.app.showGameNotice('❌ Offer Rejected', `<p style="color:#ef4444;line-height:1.6;">${p.name} has rejected your offer. A better wage, better bonuses, or a higher manager score would help.</p>`);
    }
  }

  // ================= SPONSORS =================
  renderMSponsors() {
    const g = this.game;
    const inBox = document.getElementById('m-sponsors-in');
    const outBox = document.getElementById('m-sponsors-out');
    if (!inBox || !outBox) return;

    if (g.sponsors.activeIn) {
      const a = g.sponsors.activeIn;
      inBox.innerHTML = `
        <div class="glass-panel" style="border-color:var(--primary);text-align:center;">
          <h2 style="font-size:20px;">✅ ${a.name}</h2>
          <div style="font-size:28px;color:var(--primary);font-weight:900;">$${a.weeklyWage.toLocaleString()} / week</div>
          <div style="font-size:13px;color:var(--text-muted);margin-top:4px;">${a.yearsLeft} season(s) remaining</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:8px;">🏆 Win match: +10% of weekly wage • ❌ Loss: next week's payout cut to 50%</div>
        </div>`;
    } else {
      if (!g.sponsors.offersIn.length) g.generateSponsorInOffers();
      inBox.innerHTML = g.sponsors.offersIn.map(o => `
        <div class="glass-panel" style="margin-bottom:12px;">
          <b style="font-size:18px;">${o.name}</b>
          <div style="color:var(--primary);font-weight:900;font-size:16px;">$${o.weeklyWage.toLocaleString()}/week</div>
          <div style="font-size:12px;color:var(--text-muted);">${o.years} season(s) • Win bonus +10% • Loss cuts next week to 50%</div>
          <div style="margin-top:8px;display:flex;gap:8px;">
            <button class="btn btn-primary btn-sm" onclick="managerUI.acceptSponsorIn('${o.id}')">Accept</button>
            <button class="btn btn-secondary btn-sm" onclick="managerUI.openSponsorInChange('${o.id}')">Change Offer</button>
          </div>
        </div>`).join('');
    }

    if (!g.sponsors.outSponsors.length) g.generateSponsorOutList();
    const outList = g.sponsors.outSponsors;
    const activeTotal = g.sponsors.activeOut.reduce((n, s) => n + s.weeklyWage, 0);
    outBox.innerHTML = `
      <div style="font-size:12px;color:var(--text-muted);margin-bottom:14px;">Sponsoring brands promotes your club — each active brand boosts stadium attendance by 2.5%. ${g.sponsors.activeOut.length ? `<b style="color:var(--primary);">Active: ${g.sponsors.activeOut.length}</b> ($${activeTotal.toLocaleString()}/week total)` : ''}</div>
      ${outList.map((s, i) => `
        <div class="glass-panel" style="margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <div>
            <b>#${i + 1} ${s.name}</b>
            <div style="font-size:12px;color:var(--text-muted);">Popularity: ${s.popularity}/50 • Preferred: $${s.prefWage.toLocaleString()}/wk</div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="managerUI.openSponsorOutOffer(${i})">Offer ✍️</button>
        </div>`).join('')}`;
  }

  acceptSponsorIn(id) {
    const g = this.game;
    const offer = g.sponsors.offersIn.find(o => o.id === id);
    if (!offer) return;
    g.sponsors.activeIn = { ...offer, yearsLeft: offer.years };
    g.sponsors.offersIn = [];
    g.sponsors.lastResult = null;
    this.saveManagerGame();
    window.app.showGameNotice('🤝 Sponsor Signed!', `<p style="color:#fff;">${offer.name} will pay <b>$${offer.weeklyWage.toLocaleString()}/week</b> for ${offer.years} season(s). Win matches for a +10% bonus!</p>`);
    this.renderMSponsors();
  }

  openSponsorInChange(id) {
    const g = this.game;
    const offer = g.sponsors.offersIn.find(o => o.id === id);
    if (!offer) return;
    this.spinChangeTarget = id;
    const body = document.getElementById('spin-change-body');
    if (!body) return;
    body.innerHTML = `
      <div style="display:grid;gap:12px;text-align:left;">
        <b style="font-size:16px;">${offer.name} — Negotiate Terms</b>
        <label style="display:grid;gap:4px;font-weight:700;">Weekly wage
          <input class="form-input" id="spin-new-wage" type="number" min="1" value="${offer.weeklyWage}">
        </label>
        <label style="display:grid;gap:4px;font-weight:700;">Contract length
          <select class="form-select" id="spin-new-years"><option value="1">1</option><option value="2">2</option><option value="3">3</option></select>
        </label>
        <button class="btn btn-primary" onclick="managerUI.submitSponsorInChange()">Send Changed Offer</button>
      </div>`;
    window.app.openModal('modal-spin-change');
  }

  submitSponsorInChange() {
    const g = this.game;
    const offer = g.sponsors.offersIn.find(o => o.id === this.spinChangeTarget);
    if (!offer) { window.app.closeModal('modal-spin-change'); return; }
    const wage = parseInt(document.getElementById('spin-new-wage')?.value) || offer.weeklyWage;
    const years = parseInt(document.getElementById('spin-new-years')?.value) || offer.years;
    window.app.closeModal('modal-spin-change');
    if (wage > offer.weeklyWage) {
      const increase = (wage / offer.weeklyWage) - 1;
      const chance = Math.max(0.08, 0.82 - increase * 1.6);
      if (Math.random() > chance) {
        g.sponsors.offersIn = g.sponsors.offersIn.filter(o => o.id !== offer.id);
        this.saveManagerGame();
        window.app.showGameNotice('❌ Negotiation Declined', `<p style="color:#ef4444;">${offer.name} rejected the requested raise and withdrew.</p>`);
        this.renderMSponsors();
        return;
      }
    }
    offer.weeklyWage = Math.round(wage);
    offer.years = years;
    this.saveManagerGame();
    window.app.showGameNotice('✅ Offer Updated', `<p style="color:#fff;">${offer.name} accepted your adjusted terms!</p>`);
    this.renderMSponsors();
  }

  openSponsorOutOffer(idx) {
    const g = this.game;
    const s = g.sponsors.outSponsors[idx];
    if (!s) return;
    this.spoutTarget = idx;
    const body = document.getElementById('spout-offer-body');
    if (!body) return;
    body.innerHTML = `
      <div style="display:grid;gap:12px;text-align:left;">
        <b style="font-size:16px;">${s.name} — Sponsorship Proposal</b>
        <div style="font-size:13px;color:var(--text-muted);">Popularity: ${s.popularity}/50 • Preferred: $${s.prefWage.toLocaleString()}/week</div>
        <label style="display:grid;gap:4px;font-weight:700;">Weekly payment
          <input class="form-input" id="spout-wage" type="number" min="1" value="${Math.round(s.prefWage * 0.9)}">
        </label>
        <label style="display:grid;gap:4px;font-weight:700;">Contract length (seasons)
          <select class="form-select" id="spout-years"><option value="1">1</option><option value="2" selected>2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select>
        </label>
        <div style="font-size:12px;color:var(--text-muted);" id="spout-chance">Acceptance chance: calculating...</div>
        <button class="btn btn-primary" onclick="managerUI.submitSponsorOutOffer()">Send Offer ✍️</button>
      </div>`;
    const wageEl = document.getElementById('spout-wage');
    if (wageEl) wageEl.oninput = () => {
      const w = parseInt(wageEl.value) || 0;
      const chance = g.signingChance(w, s.prefWage, 0, 0, false);
      const el = document.getElementById('spout-chance');
      if (el) el.innerHTML = `Acceptance chance: <b style="color:${chance > 0.6 ? 'var(--primary)' : chance > 0.35 ? 'var(--accent-gold)' : '#ef4444'};">${Math.round(chance * 100)}%</b>`;
    };
    window.app.openModal('modal-spout-offer');
  }

  submitSponsorOutOffer() {
    const g = this.game;
    const s = g.sponsors.outSponsors[this.spoutTarget];
    if (!s) return;
    const wage = parseInt(document.getElementById('spout-wage')?.value) || s.prefWage;
    const years = parseInt(document.getElementById('spout-years')?.value) || 2;
    window.app.closeModal('modal-spout-offer');
    const chance = g.signingChance(wage, s.prefWage, 0, 0, false);
    if (Math.random() < chance) {
      g.sponsors.activeOut.push({ id: s.id, name: s.name, popularity: s.popularity, weeklyWage: wage, yearsLeft: years });
      this.saveManagerGame();
      window.app.showGameNotice('✅ Sponsorship Deal!', `<p style="color:#fff;">${s.name} will promote your club for <b>$${wage.toLocaleString()}/week</b> for ${years} season(s). Attendance boost unlocked!</p>`);
      this.renderMSponsors();
    } else {
      window.app.showGameNotice('❌ Proposal Rejected', `<p style="color:#ef4444;">${s.name} declined your proposal.</p>`);
    }
  }

  // ================= STADIUM =================
  renderMStadium() {
    const g = this.game;
    const box = document.getElementById('m-stadium-summary');
    const upg = document.getElementById('m-stadium-upgrades');
    if (!box || !upg) return;
    const le = window.leaguesEngine;
    const st = g.stadium;
    const nextHome = (le.seasonSchedule || []).find(f => !f.played && f.participantId === g.profile.clubId && f.userSide === 'home');
    box.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px;margin-bottom:18px;">
        <div class="glass-panel" style="text-align:center;padding:14px;"><div style="font-size:11px;color:var(--text-muted);">CAPACITY</div><div style="font-size:22px;font-weight:900;color:var(--primary);">${st.capacity.toLocaleString()}</div><div style="font-size:11px;color:var(--text-muted);">max ${g.maxCapacity().toLocaleString()}</div></div>
        <div class="glass-panel" style="text-align:center;padding:14px;"><div style="font-size:11px;color:var(--text-muted);">TICKET</div><div style="font-size:22px;font-weight:900;">$${st.ticketPrice}</div></div>
        <div class="glass-panel" style="text-align:center;padding:14px;"><div style="font-size:11px;color:var(--text-muted);">DRINK / FOOD</div><div style="font-size:22px;font-weight:900;">$${st.drinkPrice} / $${st.foodPrice}</div></div>
        <div class="glass-panel" style="text-align:center;padding:14px;"><div style="font-size:11px;color:var(--text-muted);">PARKING</div><div style="font-size:22px;font-weight:900;">$${st.parkingPrice}</div><div style="font-size:11px;color:var(--text-muted);">${st.parkingSlots.toLocaleString()} slots</div></div>
        <div class="glass-panel" style="text-align:center;padding:14px;"><div style="font-size:11px;color:var(--text-muted);">ATTENTION</div><div style="font-size:22px;font-weight:900;color:var(--accent-gold);">${st.attention}/10</div></div>
        <div class="glass-panel" style="text-align:center;padding:14px;"><div style="font-size:11px;color:var(--text-muted);">MAINTENANCE</div><div style="font-size:22px;font-weight:900;color:var(--accent-gold);">${st.maintenance}/10</div></div>
      </div>
      <div style="background:rgba(0,136,255,0.08);border:1px solid var(--accent-blue);border-radius:12px;padding:14px;margin-bottom:16px;font-size:13px;">
        <b>🏟️ Next Home Match:</b> ${nextHome ? `${nextHome.displayHomeName} vs ${nextHome.displayAwayName}` : 'No home matches left this season'}
      </div>
      ${this.lastStadiumHtml()}`;
    const costs = g.stadiumUpgradeCosts();
    upg.innerHTML = Object.entries(costs).map(([key, u]) => `
      <div class="glass-panel" style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px;padding:12px 14px;">
        <div>
          <b>${u.label}</b>
          ${u.maxed ? '<div style="font-size:12px;color:var(--primary);">MAXED ✅</div>' : `<div style="font-size:12px;color:var(--text-muted);">Cost: $${u.cost.toLocaleString()}</div>`}
        </div>
        <button class="btn btn-secondary btn-sm" ${u.maxed || g.bank < u.cost ? 'disabled' : ''} onclick="managerUI.doStadiumUpgrade('${key}')">Upgrade</button>
      </div>`).join('');
  }

  lastStadiumHtml() {
    const ls = this.game.lastStadium;
    if (!ls) return '';
    return `
      <div style="background:rgba(0,255,136,0.06);border:1px solid rgba(0,255,136,0.3);border-radius:12px;padding:14px;margin-bottom:14px;font-size:13px;">
        <b>📊 Last Home Match:</b> Attendance ${ls.attendance.toLocaleString()}<br>
        <span style="color:var(--primary);">Revenue: $${ls.revenue.toLocaleString()}</span> (tickets $${ls.ticketRev.toLocaleString()} • drinks $${ls.drinkRev.toLocaleString()} • food $${ls.foodRev.toLocaleString()} • parking $${ls.parkRev.toLocaleString()})<br>
        <span style="color:#ef4444;">Costs: $${Math.round(ls.goodsCost + ls.maintCost).toLocaleString()}</span> (goods $${Math.round(ls.goodsCost).toLocaleString()} • maintenance $${Math.round(ls.maintCost).toLocaleString()})<br>
        <b style="color:var(--accent-gold);">Net Profit: ${ls.net >= 0 ? '+' : ''}$${ls.net.toLocaleString()}</b>
      </div>`;
  }

  doStadiumUpgrade(key) {
    const g = this.game;
    if (g.upgradeStadium(key)) {
      this.saveManagerGame();
      this.renderMStadium();
    } else {
      window.app.showGameNotice('⚠️ Cannot Upgrade', '<p style="color:#ef4444;">You need more money for this upgrade.</p>');
    }
  }

  // ================= GAMES / STANDINGS (manager) =================
  renderMGames() {
    const g = this.game;
    const container = document.getElementById('games-schedule-list');
    if (!container) return;
    const allMatches = window.leaguesEngine.seasonSchedule || [];
    if (!allMatches.length) { container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px;">No matches scheduled.</p>'; return; }
    container.innerHTML = allMatches.map((m, idx) => {
      const homeName = m.displayHomeName || 'Home';
      const awayName = m.displayAwayName || 'Away';
      const subtitle = [m.competitionName, m.stageLabel, m.matchLabel].filter(Boolean).join(' • ');
      const isUserHome = m.userSide === 'home';
      let scoreColor = 'var(--primary)';
      if (m.played) {
        const u = isUserHome ? m.homeScore : m.awayScore;
        const o = isUserHome ? m.awayScore : m.homeScore;
        scoreColor = u > o ? '#00ff88' : (u < o ? '#ef4444' : '#ff9f00');
      }
      return `
        <div class="glass-panel" style="margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap;">
            <div style="flex:1;min-width:260px;">
              <div style="font-size:11px;color:var(--accent-gold);font-weight:900;text-transform:uppercase;">${subtitle}</div>
              <div style="font-size:17px;font-weight:900;">${isUserHome ? '<b style="color:var(--primary);">🏟️</b> ' : ''}${homeName} vs ${awayName}</div>
              <div style="font-size:12px;color:var(--text-muted);">Week ${m.week || idx + 1} • ${isUserHome ? 'Home' : 'Away'}</div>
            </div>
            <div style="text-align:right;font-weight:900;font-size:15px;color:${m.played ? scoreColor : 'var(--primary)'};">
              ${m.played ? `${m.homeScore} - ${m.awayScore}` : 'Scheduled'}
            </div>
          </div>
        </div>`;
    }).join('');
  }

  renderMStandings() {
    const g = this.game;
    const tbody = document.getElementById('table-standings-body');
    if (!tbody) return;
    const standings = [...window.leaguesEngine.standings].sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);
    tbody.innerHTML = standings.map((s, idx) => `
      <tr class="${s.clubId === g.profile.clubId ? 'user-team' : ''}">
        <td>#${idx + 1}</td>
        <td style="display:flex;align-items:center;gap:10px;">${window.leaguesEngine.getClubBadgeHtml(s.name, 26)} <b>${s.name}</b> ${'★'.repeat(s.stars || 2)}</td>
        <td>${s.played}</td><td>${s.won}</td><td>${s.drawn}</td><td>${s.lost}</td>
        <td>${s.gd > 0 ? '+' + s.gd : s.gd}</td>
        <td><strong>${s.points}</strong></td>
      </tr>`).join('');
  }

  // ================= MATCH SIMULATION (manager) =================
  simulateMatch() {
    if (this.sim && !this.sim.finished) return;
    const g = this.game;
    const ctx = window.leaguesEngine.getNextMatch(g.profile.clubId);
    if (!ctx) { window.app.showGameNotice('⚠️ No Match', '<p style="color:#ef4444;">No match available.</p>'); return; }
    g.nextMatchCtx = ctx;
    const data = g.buildMatchEvents();
    const homeName = ctx.displayHomeName || 'Home';
    const awayName = ctx.displayAwayName || 'Away';
    this.sim = {
      ctx, data, homeName, awayName,
      scoreHome: 0, scoreAway: 0,
      clock: 0, eventIdx: 0, paused: false, finished: false,
      speed: 1, timer: null
    };
    this.showSimOverlay();
    this.startSimClock();
  }

  showSimOverlay() {
    const s = this.sim;
    if (!s) return;
    const existing = document.getElementById('m-sim-overlay');
    if (existing) existing.remove();
    const overlay = document.createElement('div');
    overlay.id = 'm-sim-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
    overlay.innerHTML = `
      <div style="background:linear-gradient(135deg,#0a1628 0%,#1e293b 100%);border:2px solid var(--primary);border-radius:20px;padding:28px;max-width:560px;width:100%;">
        <div style="text-align:center;font-size:12px;color:var(--accent-gold);font-weight:900;text-transform:uppercase;margin-bottom:16px;">${s.ctx.matchLabel || 'Match'}</div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:16px;">
          <div style="flex:1;text-align:center;font-size:15px;font-weight:900;color:#fff;">${s.homeName}</div>
          <div style="font-size:32px;font-weight:900;color:var(--primary);min-width:70px;text-align:center;" id="m-sim-score">0 - 0</div>
          <div style="flex:1;text-align:center;font-size:15px;font-weight:900;color:#fff;">${s.awayName}</div>
        </div>
        <div style="text-align:center;margin-bottom:14px;"><span style="font-size:24px;font-weight:900;color:var(--accent-gold);" id="m-sim-clock">0'</span></div>
        <div id="m-sim-feed" style="max-height:160px;overflow-y:auto;display:flex;flex-direction:column;gap:5px;margin-bottom:14px;"></div>
        <div style="display:flex;gap:8px;align-items:center;justify-content:center;margin-bottom:10px;">
          <button class="btn btn-secondary" onclick="managerUI.changeSimSpeed(-1)" style="padding:3px 8px;">◀</button>
          <b id="m-sim-speed">1x</b>
          <button class="btn btn-secondary" onclick="managerUI.changeSimSpeed(1)" style="padding:3px 8px;">▶</button>
          <button class="btn btn-secondary" style="margin-left:10px;" onclick="managerUI.skipSim()">Skip ⏩</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
  }

  startSimClock() {
    const s = this.sim;
    if (!s) return;
    s.timer = setInterval(() => {
      if (!this.sim || s.finished) return;
      if (s.paused) return;
      s.clock += 0.15 * s.speed;
      while (s.eventIdx < s.data.events.length && s.data.events[s.eventIdx].minute <= Math.floor(s.clock)) {
        const ev = s.data.events[s.eventIdx];
        this.processSimEvent(ev);
        s.eventIdx++;
        if (ev.type === 'goal') { s.paused = true; setTimeout(() => { if (this.sim) this.sim.paused = false; }, 1800); break; }
      }
      if (s.clock >= 90) { s.clock = 90; this.finishSim(); return; }
      const el = document.getElementById('m-sim-clock');
      if (el) el.innerText = Math.floor(s.clock) + "'";
    }, 100);
  }

  processSimEvent(ev) {
    const s = this.sim;
    if (!s) return;
    if (ev.type === 'goal') {
      if (ev.team === 'home') s.scoreHome++; else s.scoreAway++;
      const tag = ev.assist ? ` (assist: ${ev.assist})` : (ev.isPenalty ? ' (pen)' : '');
      this.addSimFeed(`${ev.minute}' ⚽ ${ev.player}${tag}`, ev.team === 'home');
      const el = document.getElementById('m-sim-score');
      if (el) el.innerText = `${s.scoreHome} - ${s.scoreAway}`;
    } else if (ev.type === 'card') {
      this.addSimFeed(`${ev.minute}' ${ev.cardType === 'red' ? '🟥' : '🟨'} ${ev.player}`, ev.team === 'home');
    }
  }

  addSimFeed(label, isHome) {
    const feed = document.getElementById('m-sim-feed');
    if (!feed) return;
    const item = document.createElement('div');
    item.style.cssText = `padding:6px 10px;background:rgba(255,255,255,0.06);border-left:3px solid ${isHome ? '#0088ff' : '#ef4444'};border-radius:6px;font-size:13px;color:#fff;`;
    item.innerText = label;
    feed.appendChild(item);
    feed.scrollTop = feed.scrollHeight;
  }

  changeSimSpeed(dir) {
    const s = this.sim;
    if (!s) return;
    const speeds = [0.5, 1, 1.5, 2, 3];
    let i = speeds.indexOf(s.speed);
    s.speed = speeds[Math.max(0, Math.min(speeds.length - 1, i + dir))];
    const el = document.getElementById('m-sim-speed');
    if (el) el.innerText = s.speed + 'x';
  }

  skipSim() {
    const s = this.sim;
    if (!s || s.finished) return;
    while (s.eventIdx < s.data.events.length) {
      this.processSimEvent(s.data.events[s.eventIdx]);
      s.eventIdx++;
    }
    s.clock = 90;
    this.finishSim();
  }

  finishSim() {
    const s = this.sim;
    if (!s || s.finished) return;
    s.finished = true;
    if (s.timer) clearInterval(s.timer);
    const g = this.game;
    const myGoals = s.ctx.userSide === 'home' ? s.scoreHome : s.scoreAway;
    const oppGoals = s.ctx.userSide === 'home' ? s.scoreAway : s.scoreHome;
    g.applyMatchResult({
      events: s.data.events, myGoals, oppGoals,
      myShots: s.data.myShots, oppShots: s.data.oppShots,
      myDefActions: s.data.myDefActions, mySaves: s.data.mySaves
    });
    const won = myGoals > oppGoals;
    const overlay = document.getElementById('m-sim-overlay');
    if (overlay) {
      overlay.innerHTML = `
        <div style="background:linear-gradient(135deg,#0a1628 0%,#1e293b 100%);border:2px solid var(--primary);border-radius:20px;padding:28px;max-width:520px;width:100%;text-align:center;">
          <div style="font-size:13px;color:var(--text-muted);margin-bottom:4px;text-transform:uppercase;font-weight:700;">Full Time Result</div>
          <div style="font-size:26px;font-weight:900;color:#fff;margin-bottom:12px;">${s.ctx.displayHomeName} ${s.scoreHome} - ${s.scoreAway} ${s.ctx.displayAwayName}</div>
          <div style="font-size:15px;font-weight:800;color:${won ? 'var(--primary)' : myGoals === oppGoals ? 'var(--accent-gold)' : '#ef4444'};">${won ? '🏆 Victory!' : myGoals === oppGoals ? '🤝 Draw' : '❌ Defeat'}</div>
          <div style="margin-top:14px;font-size:13px;color:#cbd5e1;">Finances and stats have been updated.</div>
          <button class="btn btn-primary btn-lg" style="width:100%;margin-top:16px;" onclick="managerUI.closeSim()">Continue ✅</button>
        </div>`;
    }
    this.saveManagerGame();
    this.refreshManagerUI();
    this.sim = null;
    g.nextMatchCtx = null;
  }

  closeSim() {
    const overlay = document.getElementById('m-sim-overlay');
    if (overlay) overlay.remove();
    this.sim = null;
    this.refreshManagerUI();
  }

  // ================= SEASON ADVANCE =================
  advanceSeason() {
    const g = this.game;
    const summary = g.advanceSeason();
    this.saveManagerGame();
    const notes = summary ? `Finished ${summary.matches} matches • ${summary.wins}W ${summary.draws}D ${summary.losses}L • Goals ${summary.goalsFor}:${summary.goalsAgainst} • Profit ${summary.profit >= 0 ? '+' : ''}$${Math.round(summary.profit).toLocaleString()}` : '';
    window.app.showGameNotice(`🗓️ Season Advanced to ${g.season.year}!`, `<p style="color:#fff;line-height:1.7;">${notes}</p><p style="font-size:13px;color:var(--text-muted);">New season fixtures generated. Wage contracts and sponsor deals continue.</p>`);
    this.refreshManagerUI();
  }

  // ================= NAV BINDING =================
  bind() {
    document.querySelectorAll('.m-tab-btn').forEach(btn => {
      btn.addEventListener('click', e => this.switchMTab(e.currentTarget.dataset.mtab));
    });
    const viewSel = document.getElementById('m-team-view');
    if (viewSel) viewSel.onchange = () => this.renderMTeam();
    document.addEventListener('click', e => {
      const benchTile = e.target.closest('.m-tile-bench');
      if (benchTile && benchTile.dataset.pid) {
        this.swapPlayerIntoXI(benchTile.dataset.pid);
      }
    });
    // filter inputs
    ['m-sig-name', 'm-sig-mv-min', 'm-sig-mv-max', 'm-sig-age-min', 'm-sig-age-max', 'm-sig-pos', 'm-sig-ovr-min', 'm-sig-ovr-max'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => this.applySigFilter());
    });
  }
}

window.managerUI = new ManagerUI();
