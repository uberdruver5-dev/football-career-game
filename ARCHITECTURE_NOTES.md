# Football Career Game — Architecture Reference

Repo: `github.com/uberdruver5-dev/football-career-game` (branch `main`, version v1.9.20)
Pure client-side web game: HTML + CSS + vanilla JS, no build step, no backend. Data persisted to `localStorage`. Deployable as static site (GitHub Pages).

## Files

| File | Size | Role |
|---|---|---|
| `index.html` | 912 lines | All UI markup: main menu, 15 tabs, creation modals (player/attributes/appearance), cheat keybinds modal, game notice modal |
| `js/app.js` | 4,855 lines | `FootballApp` class: UI router, rendering, match simulation overlay, training mini-game, sponsors, social, cheat mode |
| `js/career.js` | 897 lines | `PlayerCareer` class: profile/stats model, OVR calc, XP/levels, wages, aging, trophies, save/load |
| `js/leagues.js` | 3,251 lines | `LeaguesEngine` class: 87 national teams, 30 leagues (460 clubs after padding), squad generation, fixtures, season schedule, UCL/Cup/International tournament state machines, contract offers, badges |
| `js/names.js` | 44,200 lines | `window.NATIONAL_NAMES` — first/last name pools per culture (data only) |
| `css/style.css`, `css/mobile.css` | 1,010 + 124 | Dark glassmorphism theme (CSS vars: `--primary #00ff88`, `--accent-gold`, `--accent-blue`), mobile overrides |
| `assets/flags/*.svg` | 87 | Country flags rendered via emoji→ISO conversion in `getCountryFlagHtml` |
| `*.py` | — | Dev-only name-generation/patching tools (not part of runtime) |

Script load order: `names.js` → `career.js` → `leagues.js` → `app.js`. Globals: `window.userCareer`, `window.leaguesEngine`, `window.app`.

## Key objects

### PlayerCareer (`window.userCareer`)
- `profile`: name, nationality/flag, age, height, position (ST/CAM/CM/RW/LW/CB/LB/RB/GK), appearance (hairStyle/hairColor/skinColor/facialHairStyle — SVG-rendered avatar), 9 attributes (pace, shooting, passing, dribbling, defending, physical, positioning, def_positioning, diving; 1–130), `ovr`, `skillPoints`, `xp`, `level`, `form`, club (id/name), `weeklyWage`/`goalBonus`/`assistBonus`, `bankBalance`, `totalCareerEarnings`, `growthArchetype` (inhuman/goat/pro/good/avg/under_avg), `squadRole` ("First Team Regular" | "Bench Player"), `trophies` (league_d1, league_d2, cup, continental, world_cup, ballon_dor, golden_boot, euros_copas, national_cap), `awardsCabinet`, `isNationalTeamCalledUp`, cheat flags (`cheatModeEnabled`, `cheatShowButtons`, `cheatNoGoals`), `hasTrainedThisMatchday`, `social`, `sponsorship`, `pendingTransfer`
- `stats.season`: year, matches/goals/assists/hattricks, avgRating, ratingsHistory, earningsThisSeason, `compStats` (goals/assists/matches per competition key), defensiveActions/goalkeeperSaves/shotsOnGoal
- `stats.career`: totalMatches/totalGoals/totalAssists/totalHattricks, clubHistory, seasonHistory (for Past Seasons tab)
- Methods: `calculateOvr()` (position-weighted formula + archetype ceiling; also auto-promotes bench→starter when OVR crosses club threshold), `getSalaryMultiplier()` (cumulative milestones/trophies), `recordMatchPerformance()` (money = weeklyWage + goal/assist bonuses + $5k/role action; XP = win 100/draw 50 + goals×100 + assists×50 + defender clean-sheet 100 + rating×10; skill points every 10 career goals, every 75 role actions), `addXp()` (level up = +2 SP, xpToNextLevel = (level+1)×1000), `advanceSeason()` (season history, pending transfer executes, age+1, youth growth or age decay from archetype-specific age, national call-up recheck, resets season counters), `exportSaveData()`/`importSaveData()` (JSON in localStorage; squad references stripped to stay under quota; comp keys for all tournaments preserved)

### LeaguesEngine (`window.leaguesEngine`)
- `nationalTeams`: 87 teams with stars 1–5 (5★ req OVR 83-85, 4★ 82, 3★ 79, 2★ 75, 1★ 72)
- `leagues`: 30 leagues keyed like `turkey_d1`/`turkey_d2` (Turkey, England, Spain, Italy, Germany, France, Netherlands, Portugal, USA, Saudi with 2 divisions each = 20, plus India, Brazil, Argentina, Mexico, Japan, Korea, Scotland, Belgium, Greece, Norway with 1 division each). Each club: id, name, ovr, stars, logo emoji. Div-2 OVRs rescaled 68–76; all divisions padded to 18 clubs.
- `clubSquads`: persistent generated squads (11 players: GK, CB×2, LB, RB, CM×2, CAM, RW, LW, ST), each with id/name/position/ovr/age/nationality/flag/stats. 30 superstars (89–94 OVR) injected into 12 elite clubs. National squads compiled from club players by nationality (`compileNationalSquad`).
- `standings`: active league table (18 rows, played/W/D/L/gf/ga/gd/points)
- `fixtures`: round-robin double round (34 rounds), `seasonSchedule`: user's chronological calendar of league + UCL qualifiers + cup group + (if called up) national qualifiers/tournament matches
- Tournament state: `uclQualifiersPoints/Played`, `uclGroupPoints/Played`, `uclStage` (qualifiers→group→r16→qf→sf→final→none), `cupStage`, `cupGroupPoints`, `natQualPoints`, `natGroupPoints`, `natStage`, `natGroupStandings`, `nationalQualified`
- Key methods: `initLeague()`, `buildSeasonSchedule(profile)` (interleaves: UCL quals weeks 1/3/5/7 by tier, cup group weeks 9/13/17, then national qualifiers after league 6/16/26, finals last), `insertUclGroupStage()` (after every 4 league games), `insertUclKnockoutRound()` (2-leg), `insertCupRound()`, `insertNationalKnockoutRound()`, `insertUclFinal()`, `simulateGameweek()` (simulates whole league week; AI fixtures by OVR diff), `updateStandingsEntry()`, `distributeMatchStatsToSquad()`, `simulateGlobalGameweek()` (stats for all other clubs), `processRetirementsAndRegens()` (age+1, retire >39 → regen 17–19), `evaluateContractOffers()` (after ≥3 matches; own renewal 67%; external offers with wage tiers + salary multiplier; elite-club injection at OVR>85 with an award; returns max 5), `getCountryFlagHtml()`, `getClubBadgeHtml()`, `getCulturalCountry()`, `getNationRegion()`, `getStarterThreshold()`, `getSeasonsRemaining()`

### FootballApp (`window.app`)
- Menus/screens: main menu → play modes → career (new game / load save / multi-save slots)
- Player creation flow: randomize → modals (attributes sliders 1–130, appearance studio with 35 hairstyles/10 facial hairs/12 hair colors/7 skin tones, SVG avatar) → `submitPlayerCreation()` sets wage by role (Div1 bench $20-30k/wk, Div1 starter $50-100k, Div2 bench $2-7k, Div2 starter $15-24k; star-scaled), national call-up by OVR threshold, starting tournament qualification (stars-based)
- Match simulation (`simulateMatch` → `_showSimOverlay` → `_startSimClock`): pre-generated events sorted by minute (goals weighted by position scorer weights; assist chance per position; cards; role actions; sub-in if benched at 55–85' with 50% chance), tick 0.15 min per 100ms × speed (0.25–3x), pauses on incidents, halftime, extra time + penalties for single-leg deciders, MOTM tracking, live XP/rating
- Cheat mode: keybinds (M/P/O/L/K/I/W default, rebindable, AZERTY-friendly), inject goals/assists/role actions/sub-in, force win, "no goals" mode; mobile cheat buttons
- Training mini-game (canvas): 15s, 3/5 goals required → +1 skill point; once per matchday; draw-trajectory shooting with keeper AI
- Other systems: sponsors (10 parody brands, offers after first match, negotiation with rejection chance, per-match payment, early-exit penalty $wage×40), social media (followers based on performance/trophies, 2 posts/matchday), Ballon d'Or power rankings (live % chances; eligibility Div1 + OVR≥89; winner at season end), wage multipliers tab, trophies cabinet, stats leaderboards (deterministic pseudo-random AI stats seeded per season), past seasons, `showGameNotice` with notice queue, `saveCareer()` multi-slot saves with automatic migration

## Key balance numbers (frequently-tweaked)

- Attribute→OVR weights: position-dependent (e.g., ST: SHO 0.2 + PAC 0.2 + POS 0.2 + DRI 0.2 + PAS 0.1 + PHY 0.1)
- Archetype ceilings: inhuman 116 (uncapped formula), goat 99, pro 94, good 89, avg 84, under_avg 79; youth bonus SP/season: 6/5/3/2/1/0; decay age: 38/36/34/33/32/31
- Salary multiplier milestones: OVR 80/85/90 ×1.15 each; UCL win ×1.25 ea; WC win ×1.3 ea; Ballon d'Or ×1.3 ea; Golden Boot ×1.15 ea; Euro/Copa ×1.25 ea; call-up ×1.2; cup ×1.25 ea; league title ×1.15 ea
- Match: user goals via `randGoals(ovrBonus)` (30% 0, 35% 1, 23% 2, 12% 3); scoring rate by position (ST 0.35 … GK 0.001); benched player subs in 75-85' 80% of the time (20% 55-74'), 50% never plays
- XP: win 100 / draw 50 / goals 100 ea / assists 50 ea / clean sheet 100 / rating×10; role actions 10 XP each (in-match)
- Skill points: +2 per level, +1 training, trophies (first-time) +1..4, milestones (10 career goals, 75 role actions/saves)
- Contract wage caps: Div2 ≤$85k, Div1 star tiers up to $750k
- International cycles: World Cup every 4y (2030 base), Euro/Copa every 4y (2028 base), AFCON every 2y (2027 base); qualifier years offset

## Where to make common modifications

- New leagues/clubs: `leagues.js` `this.leagues` + `padLeaguesWithExtraTeams()`; cup names map in `buildSeasonSchedule`/`insertCupRound`; `leagueToCountry` maps in app.js/career.js comparisons; cultural name mapping in `getCulturalCountry()`
- Attributes/OVR/progression: `career.js` `calculateOvr()`, `recordMatchPerformance()`, `addXp()`, `advanceSeason()`; sliders/position baselines in app.js `onPositionChange()`, `updatePreviewOvr()`
- Match engine: `app.js` `simulateMatch()` (event generation) + `_processSimEvent()`/`_finishSim()` (live processing)
- UI/tabs: `index.html` + `renderX()` methods in app.js + `renderAll()` registry
- Balancing wages/offers: `leagues.js` `evaluateContractOffers()`, `career.js` `getSalaryMultiplier()`
- Save format: `career.js` `exportSaveData()`/`importSaveData()` (add new fields there for save compatibility)
