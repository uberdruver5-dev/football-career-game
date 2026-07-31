/**
 * Player Career Manager (Financial Contracts, Attributes, Aging, Stats, Save/Load)
 */

class PlayerCareer {
  constructor() {
    this.profile = {
      name: "Alex Hunter",
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
        physical: 70
      },
      
      ovr: 72,
      skillPoints: 5,
      xp: 0,
      xpToNextLevel: 100,
      level: 1,
      form: 8.0,
      
      currentClubId: "plymouth",
      currentClubName: "Plymouth Argyle 🇬🇧",
      weeklyWage: 2500,
      goalBonus: 500,
      assistBonus: 250,
      bankBalance: 10000,
      totalCareerEarnings: 10000,
      marketValue: 1500000
    };

    this.stats = {
      season: {
        year: 2026,
        matches: 0,
        goals: 0,
        assists: 0,
        avgRating: 0.0,
        ratingsHistory: [],
        earningsThisSeason: 0
      },
      career: {
        totalMatches: 0,
        totalGoals: 0,
        totalAssists: 0,
        clubHistory: [
          { club: "Plymouth Argyle 🇬🇧", yearStart: 2026, yearEnd: 2026, matches: 0, goals: 0 }
        ]
      }
    };

    this.calculateOvr();
  }

  calculateOvr() {
    const a = this.profile.attributes;
    let ovr = 70;

    switch(this.profile.position) {
      case 'ST':
        ovr = (a.shooting * 0.4) + (a.pace * 0.25) + (a.dribbling * 0.15) + (a.physical * 0.15) + (a.passing * 0.05);
        break;
      case 'CAM':
        ovr = (a.passing * 0.35) + (a.dribbling * 0.3) + (a.shooting * 0.2) + (a.pace * 0.15);
        break;
      case 'CM':
        ovr = (a.passing * 0.3) + (a.defending * 0.2) + (a.dribbling * 0.2) + (a.physical * 0.15) + (a.shooting * 0.15);
        break;
      case 'RW':
      case 'LW':
        ovr = (a.pace * 0.35) + (a.dribbling * 0.3) + (a.shooting * 0.2) + (a.passing * 0.15);
        break;
      case 'CB':
        ovr = (a.defending * 0.4) + (a.physical * 0.35) + (a.pace * 0.15) + (a.passing * 0.1);
        break;
      case 'LB':
      case 'RB':
        ovr = (a.pace * 0.3) + (a.defending * 0.3) + (a.passing * 0.2) + (a.physical * 0.1) + (a.dribbling * 0.1);
        break;
      case 'GK':
        ovr = (a.defending * 0.45) + (a.physical * 0.35) + (a.pace * 0.1) + (a.passing * 0.1);
        break;
      default:
        ovr = (a.pace + a.shooting + a.passing + a.dribbling + a.defending + a.physical) / 6;
    }

    this.profile.ovr = Math.min(99, Math.max(40, Math.round(ovr)));
    this.updateMarketValue();
    return this.profile.ovr;
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

  recordMatchPerformance(goals, assists, passAccuracy, rating) {
    const s = this.stats.season;
    const c = this.stats.career;
    const p = this.profile;

    s.matches += 1;
    s.goals += goals;
    s.assists += assists;
    s.ratingsHistory.push(rating);

    const sumRatings = s.ratingsHistory.reduce((a, b) => a + b, 0);
    s.avgRating = (sumRatings / s.ratingsHistory.length).toFixed(1);

    c.totalMatches += 1;
    c.totalGoals += goals;
    c.totalAssists += assists;

    const matchMoney = p.weeklyWage + (goals * p.goalBonus) + (assists * p.assistBonus);
    p.bankBalance += matchMoney;
    p.totalCareerEarnings += matchMoney;
    s.earningsThisSeason += matchMoney;

    p.form = ((p.form * 0.7) + (rating * 0.3)).toFixed(1);

    let xpEarned = Math.round(rating * 18) + (goals * 30) + (assists * 20);
    this.addXp(xpEarned);
    return { xpEarned, matchMoney };
  }

  addXp(amount) {
    this.profile.xp += amount;
    while (this.profile.xp >= this.profile.xpToNextLevel) {
      this.profile.xp -= this.profile.xpToNextLevel;
      this.profile.level += 1;
      this.profile.skillPoints += 1;
      this.profile.xpToNextLevel = Math.round(this.profile.xpToNextLevel * 1.2);
    }
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

    // 4. Age Decay / Youth Growth
    if (this.profile.age >= 34) {
      const paceLoss = Math.floor(Math.random() * 3) + 2;
      const physicalLoss = Math.floor(Math.random() * 2) + 1;
      this.profile.attributes.pace = Math.max(40, this.profile.attributes.pace - paceLoss);
      this.profile.attributes.physical = Math.max(40, this.profile.attributes.physical - physicalLoss);
      notification.push(`⚠️ Age Decay (${this.profile.age} y/o)! Physical attributes declined: Pace -${paceLoss}, Physical -${physicalLoss}.`);
    } else if (this.profile.age < 28) {
      this.profile.skillPoints += 1;
      notification.push(`🌟 Youth Growth Bonus: You earned +3 bonus Skill Points for the new season!`);
    }

    this.calculateOvr();

    // 5. Reset Season Counters
    s.matches = 0;
    s.goals = 0;
    s.assists = 0;
    s.ratingsHistory = [];
    s.avgRating = 0.0;
    s.earningsThisSeason = 0;

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
    return {
      profile: this.profile,
      stats: this.stats,
      standings: window.leaguesEngine.standings,
      fixtures: window.leaguesEngine.fixtures,
      seasonSchedule: window.leaguesEngine.seasonSchedule,
      currentLeagueId: window.leaguesEngine.currentLeagueId
    };
  }

  importSaveData(data) {
    if (!data) return false;
    if (data.profile) this.profile = data.profile;
    if (data.stats) this.stats = data.stats;
    if (data.standings && window.leaguesEngine) window.leaguesEngine.standings = data.standings;
    if (data.fixtures && window.leaguesEngine) window.leaguesEngine.fixtures = data.fixtures;
    if (data.seasonSchedule && window.leaguesEngine) window.leaguesEngine.seasonSchedule = data.seasonSchedule;
    if (data.currentLeagueId && window.leaguesEngine) window.leaguesEngine.currentLeagueId = data.currentLeagueId;
    if (window.leaguesEngine && (!window.leaguesEngine.seasonSchedule || window.leaguesEngine.seasonSchedule.length === 0)) {
      window.leaguesEngine.buildSeasonSchedule(this.profile);
    }
    this.calculateOvr();
    return true;
  }
}

window.userCareer = new PlayerCareer();
