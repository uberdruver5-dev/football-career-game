# patch_leagues_national_eval.py
with open("js/leagues.js", "r", encoding="utf-8") as f:
    content = f.read()

# Let's find insertCupRound inside js/leagues.js and append the new National insertion methods
target_find = "  insertCupRound(roundKey, roundLabel) {"
if target_find not in content:
    print("Could not find insertCupRound")
    exit(1)

# Let's define insertNationalKnockoutRound and insertNationalFinal, and append them above insertCupRound!
new_national_methods = """  insertNationalKnockoutRound(roundKey, roundLabel) {
    const userNationality = window.userCareer?.profile?.nationality;
    if (!userNationality) return;

    const region = this.getNationRegion(userNationality);
    const natPool = this.getNationalPool(userNationality, region);
    const opponent = natPool[Math.floor(Math.random() * 3)] || natPool[0];

    const nationalCompetition = region === 'europe' ? 'Euro Cup' : (region === 'south_america' ? 'Copa America' : 'World Cup');

    const newSchedule = [...this.seasonSchedule];
    newSchedule.push(this.createScheduleEntry({
      id: `nat_${roundKey}`,
      sortKey: 9990 + (roundKey === 'qf' ? 1 : (roundKey === 'sf' ? 2 : 3)),
      competitionKey: roundKey === 'final' ? 'national_final' : 'national_knockout',
      competitionName: nationalCompetition,
      stageLabel: roundLabel,
      matchLabel: `${nationalCompetition} ${roundLabel}`,
      matchContext: `${nationalCompetition} - ${roundLabel} Knockout`,
      participantType: 'national',
      participantId: userNationality,
      userSide: 'home',
      home: { clubId: `nat_${userNationality}`, name: userNationality, ovr: window.userCareer?.profile?.ovr || 72, stars: 5, logo: '🌍' },
      away: opponent,
      displayHomeName: userNationality,
      displayAwayName: opponent.name,
      week: 0
    }));

    this.seasonSchedule = newSchedule;
    this.reorderSeasonSchedule();
  }

"""

content = content.replace(target_find, new_national_methods + target_find)

# Let's patch simulateGameweek to:
# 1. Fix null-null scores
# 2. Add cup_qual tracking
# 3. Add national_qual, national_world_cup, and national_euro results tracking!

sim_start = content.find("  simulateGameweek(userClubId, userMatchScore = null, eventContext = null, userNationality = null) {")
if sim_start == -1:
    print("Could not find start of simulateGameweek")
    exit(1)

sim_end = content.find("  updateStandingsEntry(fix) {")
if sim_end == -1:
    print("Could not find start of updateStandingsEntry")
    exit(1)

new_sim_gameweek = """  simulateGameweek(userClubId, userMatchScore = null, eventContext = null, userNationality = null) {
    const currentFix = eventContext || this.getNextMatch(userClubId, userNationality);
    if (!currentFix) return null;

    if (currentFix.competitionKey !== 'league') {
      currentFix.played = true;
      const uGoals = userMatchScore ? userMatchScore.userGoals : 0;
      const oGoals = userMatchScore ? userMatchScore.oppGoals : 0;
      currentFix.homeScore = currentFix.userSide === 'home' ? uGoals : oGoals;
      currentFix.awayScore = currentFix.userSide === 'home' ? oGoals : uGoals;

      if (this.seasonSchedule) {
        const scheduleEntry = this.seasonSchedule.find(g => g.id === currentFix.id);
        if (scheduleEntry) {
          scheduleEntry.played = true;
          scheduleEntry.homeScore = currentFix.homeScore;
          scheduleEntry.awayScore = currentFix.awayScore;
        }
      }

      const won = uGoals > oGoals;
      const drew = uGoals === oGoals;
      const pts = won ? 3 : (drew ? 1 : 0);
      const opponent = currentFix.userSide === 'home' ? currentFix.away : currentFix.home;
      const oppName = opponent ? opponent.name : "Opponent";

      // 1. UCL Qualifiers
      if (currentFix.competitionKey === 'ucl_qual') {
        this.uclQualifiersPoints = (this.uclQualifiersPoints || 0) + pts;
        this.uclQualifiersPlayed = (this.uclQualifiersPlayed || 0) + 1;
        
        const currentLeague = this.getLeagueMeta();
        const isDiv1 = currentLeague.tier === 1;
        const targetQualifiers = isDiv1 ? 2 : 4;
        
        if (this.uclQualifiersPlayed === targetQualifiers) {
          const notice = this.processUclQualificationResult(window.userCareer.profile, this.uclQualifiersPoints);
          this.pendingUclNotice = notice;
        }
      }

      // 2. UCL Group/Knockout
      if (currentFix.competitionKey === 'ucl') {
        if (currentFix.stageLabel === 'Group Stage') {
          this.uclGroupPoints = (this.uclGroupPoints || 0) + pts;
          this.uclGroupPlayed = (this.uclGroupPlayed || 0) + 1;

          if (this.uclGroupPlayed === 6) {
            if (this.uclGroupPoints >= 9) {
              this.uclStage = 'r16';
              this.insertUclKnockoutRound('r16', 'Round of 16', 6);
              this.pendingUclNotice = {
                success: true,
                title: "🎉 UCL Round of 16 Qualified!",
                body: `Incredible! Your team finished the Group Stage with <strong>${this.uclGroupPoints} points</strong> and has successfully qualified for the UEFA Champions League Round of 16 knockouts!`
              };
            } else {
              this.uclStage = 'none';
              this.pendingUclNotice = {
                success: false,
                title: "❌ UCL Group Stage Elimination",
                body: `With only <strong>${this.uclGroupPoints} points</strong> in your group, your team has been eliminated from the Champions League. Focus on winning the league!`
              };
            }
          }
        } else if (currentFix.isLeg1) {
          const rKey = currentFix.roundKey || "r16";
          this[`ucl_${rKey}_leg1`] = { user: uGoals, opp: oGoals };
        } else if (currentFix.isLeg2) {
          const rKey = currentFix.roundKey || "r16";
          const leg1 = this[`ucl_${rKey}_leg1`] || { user: 0, opp: 0 };
          const userAgg = leg1.user + uGoals;
          const oppAgg = leg1.opp + oGoals;

          let userWins = userAgg > oppAgg;
          if (userAgg === oppAgg) {
            userWins = Math.random() < 0.5; // Tiebreaker
          }

          if (userWins) {
            if (rKey === 'r16') {
              this.uclStage = 'qf';
              this.insertUclKnockoutRound('qf', 'Quarter-Finals', 7);
              this.pendingUclNotice = {
                success: true,
                title: "🎉 UCL Quarter-Finals Qualified!",
                body: `Victory on Aggregate! Your team advanced past the Round of 16, defeating ${oppName} on aggregate! (Agg: <strong>${userAgg} - ${oppAgg}</strong>)`
              };
            } else if (rKey === 'qf') {
              this.uclStage = 'sf';
              this.insertUclKnockoutRound('sf', 'Semi-Finals', 8);
              this.pendingUclNotice = {
                success: true,
                title: "🎉 UCL Semi-Finals Qualified!",
                body: `Incredible! Your team has reached the UEFA Champions League Semi-Finals, defeating ${oppName} on aggregate! (Agg: <strong>${userAgg} - ${oppAgg}</strong>)`
              };
            } else if (rKey === 'sf') {
              this.uclStage = 'final';
              this.insertUclFinal();
              this.pendingUclNotice = {
                success: true,
                title: "🎉 UCL GRAND FINAL REACHED!",
                body: `Unbelievable! Your team has conquered ${oppName} on aggregate (Agg: <strong>${userAgg} - ${oppAgg}</strong>) and advanced to the UEFA Champions League Final!`
              };
            }
          } else {
            this.uclStage = 'none';
            this.pendingUclNotice = {
              success: false,
              title: `❌ UCL ${currentFix.stageLabel} Elimination`,
              body: `Your Champions League run ends. Your team was defeated by ${oppName} on aggregate. (Agg: <strong>${userAgg} - ${oppAgg}</strong>)`
            };
          }
        } else if (currentFix.isFinal) {
          if (won) {
            if (window.userCareer?.profile?.trophies) {
              window.userCareer.profile.trophies.continental = (window.userCareer.profile.trophies.continental || 0) + 1;
            }
            this.pendingUclNotice = {
              success: true,
              title: "🏆 CHAMPIONS OF EUROPE!!!",
              body: `HISTORIC TRIUMPH! Your team has defeated ${oppName} (<strong>${uGoals} - ${oGoals}</strong>) in the UEFA Champions League Final! You lift the most prestigious club trophy in the world!`
            };
          } else {
            this.pendingUclNotice = {
              success: false,
              title: "🥈 UCL Final Runner-Up",
              body: `Heartbreak! Your team fought bravely but was defeated by ${oppName} (<strong>${oGoals} - ${uGoals}</strong>) in the Champions League Final.`
            };
          }
        }
      }

      // 3. Domestic Cup Group Stage Qualifiers
      if (currentFix.competitionKey === 'cup_qual') {
        this.cupGroupPoints = (this.cupGroupPoints || 0) + pts;
        this.cupGroupPlayed = (this.cupGroupPlayed || 0) + 1;

        if (this.cupGroupPlayed === 3) {
          if (this.cupGroupPoints >= 5) {
            this.cupStage = 'r16';
            this.insertCupRound('r16', 'Round of 16');
            this.pendingUclNotice = {
              success: true,
              title: `🎉 ${currentFix.competitionName} Group stage passed!`,
              body: `Superb! Your team finished the Cup Group Stage with <strong>${this.cupGroupPoints} points</strong> and qualified for the Round of 16 Knockouts!`
            };
          } else {
            this.cupStage = 'none';
            this.pendingUclNotice = {
              success: false,
              title: `❌ ${currentFix.competitionName} Group Stage Exit`,
              body: `With only <strong>${this.cupGroupPoints} points</strong>, your team failed to pass the Cup Group Stage this season. Focus on the league!`
            };
          }
        }
      }

      // 4. Domestic Cup Knockouts
      if (currentFix.competitionKey === 'cup') {
        if (won) {
          if (currentFix.stageLabel === 'Round of 16') {
            this.cupStage = 'qf';
            this.insertCupRound('qf', 'Quarter-Finals');
            this.pendingUclNotice = {
              success: true,
              title: `🎉 ${currentFix.competitionName} Quarter-Finals!`,
              body: `Fantastic victory! Your team defeated ${oppName} (<strong>${uGoals} - ${oGoals}</strong>) and advanced to the Quarter-Finals of the ${currentFix.competitionName}!`
            };
          } else if (currentFix.stageLabel === 'Quarter-Finals') {
            this.cupStage = 'sf';
            this.insertCupRound('sf', 'Semi-Finals');
            this.pendingUclNotice = {
              success: true,
              title: `🎉 ${currentFix.competitionName} Semi-Finals!`,
              body: `Stellar performance! Your team has reached the Semi-Finals of the ${currentFix.competitionName}, defeating ${oppName} (<strong>${uGoals} - ${oGoals}</strong>)!`
            };
          } else if (currentFix.stageLabel === 'Semi-Finals') {
            this.cupStage = 'final';
            this.insertCupRound('final', 'Final');
            this.pendingUclNotice = {
              success: true,
              title: `🎉 ${currentFix.competitionName} GRAND FINAL!`,
              body: `Unbelievable! Your team defeated ${oppName} (<strong>${uGoals} - ${oGoals}</strong>) and advanced to the prestigious ${currentFix.competitionName} Final!`
            };
          } else if (currentFix.stageLabel === 'Final') {
            if (window.userCareer?.profile?.trophies) {
              window.userCareer.profile.trophies.cup = (window.userCareer.profile.trophies.cup || 0) + 1;
            }
            this.pendingUclNotice = {
              success: true,
              title: `🏆 ${currentFix.competitionName} CHAMPIONS!!!`,
              body: `HISTORIC TRIUMPH! Your team has defeated ${oppName} (<strong>${uGoals} - ${oGoals}</strong>) in the ${currentFix.competitionName} Final! You lift the domestic cup trophy and earn legendary status!`
            };
          }
        } else {
          this.cupStage = 'none';
          this.pendingUclNotice = {
            success: false,
            title: `❌ ${currentFix.competitionName} Elimination`,
            body: `Your cup run ends. Your team was defeated by ${oppName} (<strong>${oGoals} - ${uGoals}</strong>) and is knocked out of the ${currentFix.competitionName}.`
          };
        }
      }

      // 5. National Team Qualifiers (Nations League / Euro/World Cup Qualifiers)
      if (currentFix.competitionKey === 'national_qual') {
        this.natQualPoints = (this.natQualPoints || 0) + pts;
        this.natQualPlayed = (this.natQualPlayed || 0) + 1;

        if (this.natQualPlayed === 3) {
          if (this.natQualPoints >= 5) {
            this.nationalQualified = true;
            this.pendingUclNotice = {
              success: true,
              title: "🎉 National Team Qualified!",
              body: `Sensational country pride! Your country secured <strong>${this.natQualPoints} points</strong> in the Qualifiers and officially booked a spot in the upcoming Summer Championship Tournament!`
            };
          } else {
            this.nationalQualified = false;
            this.pendingUclNotice = {
              success: false,
              title: "❌ National Qualification Failed",
              body: `With only <strong>${this.natQualPoints} points</strong>, your country has failed to qualify for the final summer tournament. Work hard to prepare for the next cycle!`
            };
          }
        }
      }

      // 6. National Major Summer Tournaments (Euro Cup, Copa America, World Cup) Group Stage
      if (currentFix.competitionKey === 'national_world_cup' || currentFix.competitionKey === 'national_euro') {
        this.natGroupPoints = (this.natGroupPoints || 0) + pts;
        this.natGroupPlayed = (this.natGroupPlayed || 0) + 1;

        if (this.natGroupPlayed === 3) {
          if (this.natGroupPoints >= 5) {
            this.natStage = 'knockout';
            this.insertNationalKnockoutRound('qf', 'Quarter-Finals');
            this.pendingUclNotice = {
              success: true,
              title: "🎉 National Knockouts Qualified!",
              body: `Glory! Your country finished the Group Stage with <strong>${this.natGroupPoints} points</strong> and advanced to the Quarter-Finals knockout phase!`
            };
          } else {
            this.natStage = 'none';
            this.pendingUclNotice = {
              success: false,
              title: "❌ Group Stage Exit",
              body: `With only <strong>${this.natGroupPoints} points</strong>, your country has been eliminated from the Group Stage. There is always next time!`
            };
          }
        }
      }

      // 7. National Tournament Knockouts (QF, SF, Final)
      if (currentFix.competitionKey === 'national_knockout') {
        if (won) {
          if (currentFix.stageLabel === 'Quarter-Finals') {
            this.insertNationalKnockoutRound('sf', 'Semi-Finals');
            this.pendingUclNotice = {
              success: true,
              title: "🎉 National Semi-Finals Qualified!",
              body: `Unbelievable! Your country defeated ${oppName} (<strong>${uGoals} - ${oGoals}</strong>) to reach the international Semi-Finals!`
            };
          } else if (currentFix.stageLabel === 'Semi-Finals') {
            this.insertNationalKnockoutRound('final', 'Final');
            this.pendingUclNotice = {
              success: true,
              title: "🎉 INTERNATIONAL FINAL REACHED!",
              body: `Amazing! Your country defeated ${oppName} (<strong>${uGoals} - ${oGoals}</strong>) and advanced to the ultimate Grand Final!`
            };
          }
        } else {
          this.pendingUclNotice = {
            success: false,
            title: "❌ Tournament Exit",
            body: `Your country was defeated by ${oppName} (<strong>${oGoals} - ${uGoals}</strong>) and is knocked out of the tournament.`
          };
        }
      }

      // 8. National Tournament Final
      if (currentFix.competitionKey === 'national_final') {
        if (won) {
          if (window.userCareer?.profile?.trophies) {
            if (currentFix.competitionName === 'World Cup') {
              window.userCareer.profile.trophies.world_cup += 1;
            } else {
              window.userCareer.profile.trophies.national_cap += 1;
            }
          }
          this.pendingUclNotice = {
            success: true,
            title: "🏆 CHAMPIONS OF THE WORLD!!!",
            body: `HISTORIC TRIUMPH! Your country has defeated ${oppName} (<strong>${uGoals} - ${oGoals}</strong>) in the Grand Final! You lift the ultimate international trophy and achieve eternal glory!`
          };
        } else {
          this.pendingUclNotice = {
            success: false,
            title: "🥈 International Runner-Up",
            body: `So close! Your country fought courageously but was defeated by ${oppName} (<strong>${oGoals} - ${uGoals}</strong>) in the Final.`
          };
        }
      }

      if (window.userCareer && window.userCareer.profile) {
        window.userCareer.profile.hasTrainedThisMatchday = false;
      }
      this.clearActiveMatch(currentFix.id);
      return currentFix;
    }

    const leagueFixture = currentFix.fixtureId ? this.fixtures.find(f => f.id === currentFix.fixtureId) : this.fixtures.find(f => (
      f.home.clubId === currentFix.home?.clubId &&
      f.away.clubId === currentFix.away?.clubId &&
      f.week === currentFix.week
    ));
    if (!leagueFixture) return null;

    const currentLeagueWeek = leagueFixture.week;
    const weekFixtures = this.fixtures.filter(f => f.week === currentLeagueWeek && !f.played);

    weekFixtures.forEach(fix => {
      if (fix.id === leagueFixture.id) {
        if (userMatchScore) {
          fix.played = true;
          if (fix.home.clubId === userClubId) {
            fix.homeScore = userMatchScore.userGoals;
            fix.awayScore = userMatchScore.oppGoals;
          } else {
            fix.homeScore = userMatchScore.oppGoals;
            fix.awayScore = userMatchScore.userGoals;
          }
          this.updateStandingsEntry(fix);
        }
      } else {
        const ovrDiff = (fix.home.ovr - fix.away.ovr) / 10 + 0.2;
        const homeGoals = Math.max(0, Math.floor(Math.random() * 3 + Math.max(0, ovrDiff)));
        const awayGoals = Math.max(0, Math.floor(Math.random() * 3 - Math.min(0, ovrDiff)));

        fix.played = true;
        fix.homeScore = homeGoals;
        fix.awayScore = awayGoals;
        this.updateStandingsEntry(fix);
      }
    });

    this.standings.sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);
    if (this.seasonSchedule) {
      const scheduleEntry = this.seasonSchedule.find(g => g.id === currentFix.id);
      if (scheduleEntry) {
        scheduleEntry.played = true;
        // Fix the null-null scoreboard bug: Assign actual scores!
        if (currentFix.competitionKey === 'league' && leagueFixture) {
          scheduleEntry.homeScore = leagueFixture.homeScore;
          scheduleEntry.awayScore = leagueFixture.awayScore;
        } else {
          scheduleEntry.homeScore = currentFix.homeScore;
          scheduleEntry.awayScore = currentFix.awayScore;
        }
      }
    }
    if (window.userCareer && window.userCareer.profile) {
      window.userCareer.profile.hasTrainedThisMatchday = false;
    }
    this.clearActiveMatch(currentFix.id);
    return currentFix.week;
  }
"""

patched_content = content[:sim_start] + new_sim_gameweek + content[sim_end:]

with open("js/leagues.js", "w", encoding="utf-8") as f:
    f.write(patched_content)

print("simulateGameweek successfully patched with Domestic Cup group stages & international progressions!")
