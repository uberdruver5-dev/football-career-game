/**
 * 10 Major Leagues Engine (2 Divisions per League, 10 Teams per Division = 200 Real Clubs Total)
 * Featuring Turkish Süper Lig & TFF 1. Lig, England, Spain, Italy, Germany, France, Netherlands, Portugal, USA, & Saudi Arabia.
 */

class LeaguesEngine {
  constructor() {
    this.nationalTeams = [
      { id: "eng", name: "England", flag: "🇬🇧", ovr: 86 },
      { id: "esp", name: "Spain", flag: "🇪🇸", ovr: 86 },
      { id: "fra", name: "France", flag: "🇫🇷", ovr: 87 },
      { id: "bra", name: "Brazil", flag: "🇧🇷", ovr: 86 },
      { id: "arg", name: "Argentina", flag: "🇦🇷", ovr: 87 },
      { id: "ger", name: "Germany", flag: "🇩🇪", ovr: 84 },
      { id: "por", name: "Portugal", flag: "🇵🇹", ovr: 85 },
      { id: "ned", name: "Netherlands", flag: "🇳🇱", ovr: 84 },
      { id: "ita", name: "Italy", flag: "🇮🇹", ovr: 84 },
      { id: "usa", name: "USA", flag: "🇺🇸", ovr: 78 },
      { id: "tur", name: "Turkey", flag: "🇹🇷", ovr: 80 },
      { id: "jpn", name: "Japan", flag: "🇯🇵", ovr: 79 },
      { id: "kor", name: "South Korea", flag: "🇰🇷", ovr: 78 },
      { id: "mar", name: "Morocco", flag: "🇲🇦", ovr: 81 },
      { id: "sen", name: "Senegal", flag: "🇸🇳", ovr: 79 },
      { id: "bel", name: "Belgium", flag: "🇧🇪", ovr: 83 },
      { id: "cro", name: "Croatia", flag: "🇭🇷", ovr: 82 },
      { id: "uru", name: "Uruguay", flag: "🇺🇾", ovr: 81 },
      { id: "col", name: "Colombia", flag: "🇨🇴", ovr: 79 },
      { id: "mex", name: "Mexico", flag: "🇲🇽", ovr: 78 },
      { id: "nga", name: "Nigeria", flag: "🇳🇬", ovr: 78 },
      { id: "gha", name: "Ghana", flag: "🇬🇭", ovr: 76 },
      { id: "egy", name: "Egypt", flag: "🇪🇬", ovr: 76 },
      { id: "nor", name: "Norway", flag: "🇳🇴", ovr: 80 },
      { id: "swe", name: "Sweden", flag: "🇸🇪", ovr: 77 },
      { id: "dnk", name: "Denmark", flag: "🇩🇰", ovr: 79 },
      { id: "pol", name: "Poland", flag: "🇵🇱", ovr: 77 },
      { id: "civ", name: "Ivory Coast", flag: "🇨🇮", ovr: 79 },
      { id: "alg", name: "Algeria", flag: "🇩🇿", ovr: 77 },
      { id: "can", name: "Canada", flag: "🇨🇦", ovr: 76 }
    ];

    // 10 MAJOR COUNTRIES (2 DIVISIONS EACH, 10 TEAMS EACH = 200 CLUBS)
    this.leagues = {

      // 1. TURKEY 🇹🇷
      turkey_d1: {
        id: "turkey_d1", name: "Süper Lig (Div 1)", country: "Turkey 🇹🇷", tier: 1,
        clubs: [
          { id: "galatasaray", name: "Galatasaray SK", ovr: 81, stars: 4, logo: "🦁" },
          { id: "fenerbahce", name: "Fenerbahçe SK", ovr: 81, stars: 4, logo: "⚡" },
          { id: "besiktas", name: "Beşiktaş JK", ovr: 79, stars: 4, logo: "🦅" },
          { id: "trabzonspor", name: "Trabzonspor", ovr: 77, stars: 3, logo: "🌊" },
          { id: "basaksehir", name: "RAMS Başakşehir", ovr: 75, stars: 3, logo: "🦉" },
          { id: "adanademir", name: "Adana Demirspor", ovr: 74, stars: 3, logo: "⚡" },
          { id: "sivasspor", name: "EMS Yapı Sivasspor", ovr: 73, stars: 3, logo: "🔴" },
          { id: "antalyaspor", name: "Bitexen Antalyaspor", ovr: 73, stars: 3, logo: "🦂" },
          { id: "kasimpasa", name: "Kasımpaşaspor", ovr: 72, stars: 3, logo: "⚓" },
          { id: "alanyaspor", name: "Corendon Alanyaspor", ovr: 72, stars: 3, logo: "🏰" }
        ]
      },
      turkey_d2: {
        id: "turkey_d2", name: "TFF 1. Lig (Div 2)", country: "Turkey 🇹🇷", tier: 2,
        clubs: [
          { id: "goztepe", name: "Göztepe SK 🇹🇷", ovr: 69, stars: 2, logo: "🟡🔴" },
          { id: "eyupspor", name: "Eyüpspor 🇹🇷", ovr: 68, stars: 2, logo: "🟣" },
          { id: "sakaryaspor", name: "Sakaryaspor 🇹🇷", ovr: 67, stars: 2, logo: "🟢⬛" },
          { id: "bodrum", name: "Bodrum FK 🇹🇷", ovr: 67, stars: 2, logo: "🟢" },
          { id: "kocaelispor", name: "Kocaelispor 🇹🇷", ovr: 67, stars: 2, logo: "🟢⬛" },
          { id: "bandirma", name: "Teksüt Bandırmaspor 🇹🇷", ovr: 66, stars: 2, logo: "⚪" },
          { id: "genclerbirligi", name: "Gençlerbirliği 🇹🇷", ovr: 66, stars: 2, logo: "🔴⬛" },
          { id: "boluspor", name: "Boluspor 🇹🇷", ovr: 65, stars: 2, logo: "🔴" },
          { id: "manisafk", name: "Manisa FK 🇹🇷", ovr: 65, stars: 2, logo: "⬛" },
          { id: "erzurumspor", name: "Erzurumspor FK 🇹🇷", ovr: 64, stars: 2, logo: "🔵" }
        ]
      },

      // 2. ENGLAND 🇬🇧
      england_d1: {
        id: "england_d1", name: "Premier League (Div 1)", country: "England 🇬🇧", tier: 1,
        clubs: [
          { id: "mancity", name: "Manchester City", ovr: 88, stars: 5, logo: "👑" },
          { id: "liverpool", name: "Liverpool FC", ovr: 87, stars: 5, logo: "🦅" },
          { id: "arsenal", name: "Arsenal FC", ovr: 86, stars: 5, logo: "🔴" },
          { id: "manutd", name: "Manchester United", ovr: 83, stars: 4, logo: "😈" },
          { id: "chelsea", name: "Chelsea FC", ovr: 82, stars: 4, logo: "🦁" },
          { id: "tottenham", name: "Tottenham Hotspur", ovr: 82, stars: 4, logo: "🐓" },
          { id: "newcastle", name: "Newcastle United", ovr: 81, stars: 4, logo: "⬛⬜" },
          { id: "astonvilla", name: "Aston Villa", ovr: 80, stars: 4, logo: "🦁" },
          { id: "westham", name: "West Ham United", ovr: 78, stars: 3, logo: "⚒️" },
          { id: "brighton", name: "Brighton & Hove", ovr: 78, stars: 3, logo: "🕊️" }
        ]
      },
      england_d2: {
        id: "england_d2", name: "EFL Championship (Div 2)", country: "England 🇬🇧", tier: 2,
        clubs: [
          { id: "leicester", name: "Leicester City 🇬🇧", ovr: 74, stars: 3, logo: "🦊" },
          { id: "leeds", name: "Leeds United 🇬🇧", ovr: 74, stars: 3, logo: "⚪" },
          { id: "southampton", name: "Southampton 🇬🇧", ovr: 73, stars: 3, logo: "🔴" },
          { id: "ipswich", name: "Ipswich Town 🇬🇧", ovr: 71, stars: 2, logo: "🚜" },
          { id: "wrexham", name: "Wrexham AFC 🇬🇧", ovr: 69, stars: 2, logo: "🐉" },
          { id: "plymouth", name: "Plymouth Argyle 🇬🇧", ovr: 68, stars: 2, logo: "⛵" },
          { id: "portsmouth", name: "Portsmouth FC 🇬🇧", ovr: 67, stars: 2, logo: "⚓" },
          { id: "bristol", name: "Bristol City 🇬🇧", ovr: 67, stars: 2, logo: "🐦" },
          { id: "oxford", name: "Oxford United 🇬🇧", ovr: 66, stars: 2, logo: "🐂" },
          { id: "blackburn", name: "Blackburn Rovers 🇬🇧", ovr: 68, stars: 2, logo: "🌹" }
        ]
      },

      // 3. SPAIN 🇪🇸
      spain_d1: {
        id: "spain_d1", name: "La Liga (Div 1)", country: "Spain 🇪🇸", tier: 1,
        clubs: [
          { id: "realmadrid", name: "Real Madrid", ovr: 88, stars: 5, logo: "👑" },
          { id: "barcelona", name: "FC Barcelona", ovr: 86, stars: 5, logo: "🔵🔴" },
          { id: "atletico", name: "Atlético Madrid", ovr: 84, stars: 5, logo: "🛡️" },
          { id: "bilbao", name: "Athletic Club", ovr: 81, stars: 4, logo: "🔴⚪" },
          { id: "sociedad", name: "Real Sociedad", ovr: 80, stars: 4, logo: "🔵⚪" },
          { id: "betis", name: "Real Betis", ovr: 79, stars: 4, logo: "🟢⚪" },
          { id: "villarreal", name: "Villarreal CF", ovr: 79, stars: 4, logo: "🟡" },
          { id: "sevilla", name: "Sevilla FC", ovr: 78, stars: 3, logo: "⚪" },
          { id: "valencia", name: "Valencia CF", ovr: 77, stars: 3, logo: "🦇" },
          { id: "girona", name: "Girona FC", ovr: 78, stars: 3, logo: "🔴" }
        ]
      },
      spain_d2: {
        id: "spain_d2", name: "Segunda División (Div 2)", country: "Spain 🇪🇸", tier: 2,
        clubs: [
          { id: "espanyol", name: "RCD Espanyol 🇪🇸", ovr: 72, stars: 3, logo: "🔵⚪" },
          { id: "valladolid", name: "Real Valladolid 🇪🇸", ovr: 71, stars: 3, logo: "🟣" },
          { id: "eibar", name: "SD Eibar 🇪🇸", ovr: 70, stars: 3, logo: "🔴🔵" },
          { id: "albacete", name: "Albacete Balompié 🇪🇸", ovr: 68, stars: 2, logo: "🦇" },
          { id: "gijon", name: "Sporting Gijón 🇪🇸", ovr: 68, stars: 2, logo: "🔴⚪" },
          { id: "zaragoza", name: "Real Zaragoza 🇪🇸", ovr: 67, stars: 2, logo: "🦁" },
          { id: "tenerife", name: "CD Tenerife 🇪🇸", ovr: 67, stars: 2, logo: "🏝️" },
          { id: "racing", name: "Racing Santander 🇪🇸", ovr: 66, stars: 2, logo: "🟢" },
          { id: "oviedo", name: "Real Oviedo 🇪🇸", ovr: 67, stars: 2, logo: "🔵" },
          { id: "elche", name: "Elche CF 🇪🇸", ovr: 69, stars: 2, logo: "🟢" }
        ]
      },

      // 4. ITALY 🇮🇹
      italy_d1: {
        id: "italy_d1", name: "Serie A (Div 1)", country: "Italy 🇮🇹", tier: 1,
        clubs: [
          { id: "inter", name: "Inter Milan", ovr: 86, stars: 5, logo: "🔵⬛" },
          { id: "juventus", name: "Juventus FC", ovr: 84, stars: 5, logo: "🦓" },
          { id: "acmilan", name: "AC Milan", ovr: 83, stars: 4, logo: "🔴⬛" },
          { id: "napoli", name: "SSC Napoli", ovr: 83, stars: 4, logo: "🩵" },
          { id: "asroma", name: "AS Roma", ovr: 81, stars: 4, logo: "🐺" },
          { id: "lazio", name: "SS Lazio", ovr: 80, stars: 4, logo: "🦅" },
          { id: "atalanta", name: "Atalanta BC", ovr: 81, stars: 4, logo: "🖤💙" },
          { id: "fiorentina", name: "ACF Fiorentina", ovr: 78, stars: 3, logo: "💜" },
          { id: "torino", name: "Torino FC", ovr: 76, stars: 3, logo: "🐂" },
          { id: "bologna", name: "Bologna FC", ovr: 78, stars: 3, logo: "🔴🔵" }
        ]
      },
      italy_d2: {
        id: "italy_d2", name: "Serie B (Div 2)", country: "Italy 🇮🇹", tier: 2,
        clubs: [
          { id: "parma", name: "Parma Calcio 🇮🇹", ovr: 72, stars: 3, logo: "🟡🔵" },
          { id: "como", name: "Como 1907 🇮🇹", ovr: 71, stars: 3, logo: "🌊" },
          { id: "venezia", name: "Venezia FC 🇮🇹", ovr: 70, stars: 3, logo: "🦁" },
          { id: "sampdoria", name: "UC Sampdoria 🇮🇹", ovr: 70, stars: 3, logo: "🔵" },
          { id: "palermo", name: "Palermo FC 🇮🇹", ovr: 69, stars: 2, logo: "🩷" },
          { id: "bari", name: "SSC Bari 🇮🇹", ovr: 68, stars: 2, logo: "🐓" },
          { id: "pisa", name: "Pisa Sporting 🇮🇹", ovr: 67, stars: 2, logo: "🏛️" },
          { id: "brescia", name: "Brescia Calcio 🇮🇹", ovr: 67, stars: 2, logo: "🦁" },
          { id: "modena", name: "Modena FC 🇮🇹", ovr: 66, stars: 2, logo: "🟡" },
          { id: "catanzaro", name: "US Catanzaro 🇮🇹", ovr: 66, stars: 2, logo: "🦅" }
        ]
      },

      // 5. GERMANY 🇩🇪
      germany_d1: {
        id: "germany_d1", name: "Bundesliga (Div 1)", country: "Germany 🇩🇪", tier: 1,
        clubs: [
          { id: "bayern", name: "Bayern Munich", ovr: 87, stars: 5, logo: "🔴" },
          { id: "leverkusen", name: "Bayer 04 Leverkusen", ovr: 86, stars: 5, logo: "🦁" },
          { id: "dortmund", name: "Borussia Dortmund", ovr: 83, stars: 4, logo: "🐝" },
          { id: "rbleipzig", name: "RB Leipzig", ovr: 82, stars: 4, logo: "🐂" },
          { id: "frankfurt", name: "Eintracht Frankfurt", ovr: 79, stars: 4, logo: "🦅" },
          { id: "stuttgart", name: "VfB Stuttgart", ovr: 80, stars: 4, logo: "🔴" },
          { id: "wolfsburg", name: "VfL Wolfsburg", ovr: 77, stars: 3, logo: "🐺" },
          { id: "gladbach", name: "Borussia M'gladbach", ovr: 76, stars: 3, logo: "🟢" },
          { id: "freiburg", name: "SC Freiburg", ovr: 77, stars: 3, logo: "🔴" },
          { id: "hoffenheim", name: "TSG Hoffenheim", ovr: 76, stars: 3, logo: "🔵" }
        ]
      },
      germany_d2: {
        id: "germany_d2", name: "2. Bundesliga (Div 2)", country: "Germany 🇩🇪", tier: 2,
        clubs: [
          { id: "schalke", name: "FC Schalke 04 🇩🇪", ovr: 71, stars: 3, logo: "🔵" },
          { id: "hsv", name: "Hamburger SV 🇩🇪", ovr: 72, stars: 3, logo: "⚓" },
          { id: "hertha", name: "Hertha BSC 🇩🇪", ovr: 71, stars: 3, logo: "🔵" },
          { id: "dusseldorf", name: "Fortuna Düsseldorf 🇩🇪", ovr: 70, stars: 3, logo: "🔴" },
          { id: "stpauli", name: "FC St. Pauli 🇩🇪", ovr: 70, stars: 3, logo: "☠️" },
          { id: "hannover", name: "Hannover 96 🇩🇪", ovr: 69, stars: 2, logo: "🟢" },
          { id: "nurnberg", name: "1. FC Nürnberg 🇩🇪", ovr: 68, stars: 2, logo: "🔴" },
          { id: "karlsruher", name: "Karlsruher SC 🇩🇪", ovr: 67, stars: 2, logo: "🔵" },
          { id: "kiel", name: "Holstein Kiel 🇩🇪", ovr: 68, stars: 2, logo: "🔵" },
          { id: "paderborn", name: "SC Paderborn 07 🇩🇪", ovr: 67, stars: 2, logo: "🔵" }
        ]
      },

      // 6. FRANCE 🇫🇷
      france_d1: {
        id: "france_d1", name: "Ligue 1 (Div 1)", country: "France 🇫🇷", tier: 1,
        clubs: [
          { id: "psg", name: "Paris Saint-Germain", ovr: 87, stars: 5, logo: "🗼" },
          { id: "monaco", name: "AS Monaco", ovr: 81, stars: 4, logo: "🇲🇨" },
          { id: "lille", name: "LOSC Lille", ovr: 80, stars: 4, logo: "🔴" },
          { id: "marseille", name: "Olympique Marseille", ovr: 80, stars: 4, logo: "⚪" },
          { id: "lyon", name: "Olympique Lyonnais", ovr: 79, stars: 4, logo: "🦁" },
          { id: "lens", name: "RC Lens", ovr: 78, stars: 3, logo: "🔴🟡" },
          { id: "nice", name: "OGC Nice", ovr: 78, stars: 3, logo: "🦅" },
          { id: "rennes", name: "Stade Rennais", ovr: 77, stars: 3, logo: "🔴" },
          { id: "toulouse", name: "Toulouse FC", ovr: 75, stars: 3, logo: "🟣" },
          { id: "reims", name: "Stade de Reims", ovr: 75, stars: 3, logo: "🔴" }
        ]
      },
      france_d2: {
        id: "france_d2", name: "Ligue 2 (Div 2)", country: "France 🇫🇷", tier: 2,
        clubs: [
          { id: "stetienne", name: "AS Saint-Étienne 🇫🇷", ovr: 72, stars: 3, logo: "🟢" },
          { id: "auxerre", name: "AJ Auxerre 🇫🇷", ovr: 71, stars: 3, logo: "⚪" },
          { id: "angers", name: "Angers SCO 🇫🇷", ovr: 70, stars: 3, logo: "⬛⬜" },
          { id: "bordeaux", name: "Girondins Bordeaux 🇫🇷", ovr: 69, stars: 2, logo: "🔵" },
          { id: "parisfc", name: "Paris FC 🇫🇷", ovr: 68, stars: 2, logo: "🗼" },
          { id: "caen", name: "SM Caen 🇫🇷", ovr: 67, stars: 2, logo: "🔴🔵" },
          { id: "guingamp", name: "EA Guingamp 🇫🇷", ovr: 67, stars: 2, logo: "🔴" },
          { id: "bastia", name: "SC Bastia 🇫🇷", ovr: 66, stars: 2, logo: "🔵" },
          { id: "rodez", name: "Rodez AF 🇫🇷", ovr: 65, stars: 2, logo: "🟡" },
          { id: "grenoble", name: "Grenoble Foot 🇫🇷", ovr: 66, stars: 2, logo: "🔵" }
        ]
      },

      // 7. NETHERLANDS 🇳🇱
      dutch_d1: {
        id: "dutch_d1", name: "Eredivisie (Div 1)", country: "Netherlands 🇳🇱", tier: 1,
        clubs: [
          { id: "psv", name: "PSV Eindhoven", ovr: 81, stars: 4, logo: "🔴⚪" },
          { id: "feyenoord", name: "Feyenoord", ovr: 80, stars: 4, logo: "🔴⚪" },
          { id: "ajax", name: "AFC Ajax", ovr: 79, stars: 4, logo: "❌❌❌" },
          { id: "az", name: "AZ Alkmaar", ovr: 77, stars: 3, logo: "🔴" },
          { id: "twente", name: "FC Twente", ovr: 77, stars: 3, logo: "🐴" },
          { id: "utrecht", name: "FC Utrecht", ovr: 74, stars: 3, logo: "🔴" },
          { id: "heerenveen", name: "SC Heerenveen", ovr: 73, stars: 3, logo: "💙" },
          { id: "sparta", name: "Sparta Rotterdam", ovr: 73, stars: 3, logo: "🔴⚪" },
          { id: "nec", name: "NEC Nijmegen", ovr: 73, stars: 3, logo: "🟢" },
          { id: "vitesse", name: "Vitesse Arnhem", ovr: 72, stars: 3, logo: "🟡" }
        ]
      },
      dutch_d2: {
        id: "dutch_d2", name: "Eerste Divisie (Div 2)", country: "Netherlands 🇳🇱", tier: 2,
        clubs: [
          { id: "willemii", name: "Willem II 🇳🇱", ovr: 70, stars: 3, logo: "👑" },
          { id: "groningen", name: "FC Groningen 🇳🇱", ovr: 70, stars: 3, logo: "🟢" },
          { id: "nacbreda", name: "NAC Breda 🇳🇱", ovr: 69, stars: 2, logo: "🟡" },
          { id: "cambuur", name: "SC Cambuur 🇳🇱", ovr: 68, stars: 2, logo: "🟡" },
          { id: "rodajc", name: "Roda JC Kerkrade 🇳🇱", ovr: 68, stars: 2, logo: "🟡" },
          { id: "goahead", name: "Go Ahead Eagles 🇳🇱", ovr: 68, stars: 2, logo: "🦅" },
          { id: "adodenhaag", name: "ADO Den Haag 🇳🇱", ovr: 67, stars: 2, logo: "🔰" },
          { id: "degraafschap", name: "De Graafschap 🇳🇱", ovr: 66, stars: 2, logo: "🔵" },
          { id: "mvv", name: "MVV Maastricht 🇳🇱", ovr: 64, stars: 2, logo: "🔴" },
          { id: "eindhoven", name: "FC Eindhoven 🇳🇱", ovr: 64, stars: 2, logo: "🔵" }
        ]
      },

      // 8. PORTUGAL 🇵🇹
      portugal_d1: {
        id: "portugal_d1", name: "Liga Portugal (Div 1)", country: "Portugal 🇵🇹", tier: 1,
        clubs: [
          { id: "benfica", name: "SL Benfica", ovr: 82, stars: 4, logo: "🦅" },
          { id: "sporting", name: "Sporting CP", ovr: 82, stars: 4, logo: "🦁" },
          { id: "porto", name: "FC Porto", ovr: 82, stars: 4, logo: "🐉" },
          { id: "braga", name: "SC Braga", ovr: 78, stars: 3, logo: "🔴" },
          { id: "guimaraes", name: "Vitória de Guimarães", ovr: 75, stars: 3, logo: "⚪" },
          { id: "arouca", name: "FC Arouca", ovr: 73, stars: 3, logo: "🟡" },
          { id: "moreirense", name: "Moreirense FC", ovr: 72, stars: 3, logo: "🟢" },
          { id: "famalicao", name: "FC Famalicão", ovr: 72, stars: 3, logo: "🔵" },
          { id: "rioave", name: "Rio Ave FC", ovr: 72, stars: 3, logo: "🟢" },
          { id: "estoril", name: "Estoril Praia", ovr: 71, stars: 3, logo: "🟡" }
        ]
      },
      portugal_d2: {
        id: "portugal_d2", name: "Liga Portugal 2 (Div 2)", country: "Portugal 🇵🇹", tier: 2,
        clubs: [
          { id: "santaclara", name: "CD Santa Clara 🇵🇹", ovr: 70, stars: 3, logo: "🔴" },
          { id: "nacional", name: "CD Nacional 🇵🇹", ovr: 69, stars: 2, logo: "⬛" },
          { id: "maritimo", name: "CS Marítimo 🇵🇹", ovr: 69, stars: 2, logo: "🔴🟢" },
          { id: "avs", name: "AVS Futebol SAD 🇵🇹", ovr: 68, stars: 2, logo: "🔴" },
          { id: "pacos", name: "Paços de Ferreira 🇵🇹", ovr: 67, stars: 2, logo: "🟡" },
          { id: "leixoes", name: "Leixões SC 🇵🇹", ovr: 66, stars: 2, logo: "🔴" },
          { id: "penafiel", name: "FC Penafiel 🇵🇹", ovr: 65, stars: 2, logo: "🔴" },
          { id: "viseu", name: "Académico Viseu 🇵🇹", ovr: 65, stars: 2, logo: "⬛" },
          { id: "feirense", name: "CD Feirense 🇵🇹", ovr: 64, stars: 2, logo: "🔵" },
          { id: "belenenses", name: "Belenenses 🇵🇹", ovr: 64, stars: 2, logo: "🔵" }
        ]
      },

      // 9. USA (MLS) 🇺🇸
      mls_d1: {
        id: "mls_d1", name: "MLS Premier (Div 1)", country: "USA 🇺🇸", tier: 1,
        clubs: [
          { id: "miami", name: "Inter Miami CF", ovr: 78, stars: 3, logo: "🦩" },
          { id: "columbus", name: "Columbus Crew", ovr: 77, stars: 3, logo: "🟡" },
          { id: "lafc", name: "LAFC", ovr: 77, stars: 3, logo: "👑" },
          { id: "cincinnati", name: "FC Cincinnati", ovr: 76, stars: 3, logo: "🟠" },
          { id: "sounders", name: "Seattle Sounders", ovr: 75, stars: 3, logo: "🟢" },
          { id: "union", name: "Philadelphia Union", ovr: 75, stars: 3, logo: "🐍" },
          { id: "atlanta", name: "Atlanta United", ovr: 75, stars: 3, logo: "🔴" },
          { id: "lagalaxy", name: "LA Galaxy", ovr: 76, stars: 3, logo: "🌌" },
          { id: "nyredbulls", name: "New York Red Bulls", ovr: 74, stars: 3, logo: "🐂" },
          { id: "nashville", name: "Nashville SC", ovr: 74, stars: 3, logo: "🟡" }
        ]
      },
      mls_d2: {
        id: "mls_d2", name: "MLS Championship (Div 2)", country: "USA 🇺🇸", tier: 2,
        clubs: [
          { id: "colorado", name: "Colorado Rapids 🇺🇸", ovr: 68, stars: 2, logo: "🏔️" },
          { id: "dcunited", name: "D.C. United 🇺🇸", ovr: 68, stars: 2, logo: "🦅" },
          { id: "sanjose", name: "San Jose Earthquakes 🇺🇸", ovr: 67, stars: 2, logo: "⚡" },
          { id: "torontofc", name: "Toronto FC 🇺🇸", ovr: 68, stars: 2, logo: "🍁" },
          { id: "chicagofire", name: "Chicago Fire 🇺🇸", ovr: 67, stars: 2, logo: "🔥" },
          { id: "sportingkc", name: "Sporting Kansas City 🇺🇸", ovr: 67, stars: 2, logo: "🩵" },
          { id: "houston", name: "Houston Dynamo 🇺🇸", ovr: 68, stars: 2, logo: "🟠" },
          { id: "minnesota", name: "Minnesota United 🇺🇸", ovr: 68, stars: 2, logo: "🪶" },
          { id: "fcdallas", name: "FC Dallas 🇺🇸", ovr: 68, stars: 2, logo: "🐂" },
          { id: "realsaltlake", name: "Real Salt Lake 🇺🇸", ovr: 68, stars: 2, logo: "👑" }
        ]
      },

      // 10. SAUDI ARABIA 🇸🇦
      saudi_d1: {
        id: "saudi_d1", name: "Saudi Pro League (Div 1)", country: "Saudi Arabia 🇸🇦", tier: 1,
        clubs: [
          { id: "alhilal", name: "Al-Hilal SFC", ovr: 84, stars: 5, logo: "🌙" },
          { id: "alnassr", name: "Al-Nassr FC", ovr: 83, stars: 4, logo: "👑" },
          { id: "alittihad", name: "Al-Ittihad Club", ovr: 81, stars: 4, logo: "🐅" },
          { id: "alahli", name: "Al-Ahli Saudi FC", ovr: 81, stars: 4, logo: "🟢" },
          { id: "alettifaq", name: "Al-Ettifaq FC", ovr: 76, stars: 3, logo: "🟢" },
          { id: "alshabab", name: "Al-Shabab FC", ovr: 75, stars: 3, logo: "⚪" },
          { id: "altaawoun", name: "Al-Taawoun FC", ovr: 74, stars: 3, logo: "🟡" },
          { id: "alfateh", name: "Al-Fateh SC", ovr: 73, stars: 3, logo: "🔵" },
          { id: "alkhaleej", name: "Al-Khaleej Club", ovr: 71, stars: 3, logo: "🟡" },
          { id: "aldamac", name: "Damac FC", ovr: 71, stars: 3, logo: "🔴" }
        ]
      },
      saudi_d2: {
        id: "saudi_d2", name: "Saudi Division 1 (Div 2)", country: "Saudi Arabia 🇸🇦", tier: 2,
        clubs: [
          { id: "alqadsiah", name: "Al-Qadsiah FC 🇸🇦", ovr: 70, stars: 3, logo: "🔴" },
          { id: "alorobah", name: "Al-Orobah FC 🇸🇦", ovr: 67, stars: 2, logo: "🟡" },
          { id: "alkholood", name: "Al-Kholood Club 🇸🇦", ovr: 66, stars: 2, logo: "🔴" },
          { id: "alfaisaly", name: "Al-Faisaly FC 🇸🇦", ovr: 66, stars: 2, logo: "🔴" },
          { id: "albatin", name: "Al-Batin FC 🇸🇦", ovr: 65, stars: 2, logo: "🩵" },
          { id: "aljabalain", name: "Al-Jabalain FC 🇸🇦", ovr: 64, stars: 2, logo: "🔴" },
          { id: "alhazem", name: "Al-Hazem SC 🇸🇦", ovr: 65, stars: 2, logo: "🟡" },
          { id: "aladalah", name: "Al-Adalah FC 🇸🇦", ovr: 64, stars: 2, logo: "🔵" },
          { id: "alnajma", name: "Al-Najma SC 🇸🇦", ovr: 63, stars: 2, logo: "🟢" },
          { id: "ohod", name: "Ohod Club 🇸🇦", ovr: 63, stars: 2, logo: "🟡" }
        ]
      }
    };

    this.currentLeagueId = "turkey_d2";
    this.standings = [];
    this.fixtures = [];
    this.seasonSchedule = [];
    this.activeMatchId = null;
    this.initLeague();
  }

  initLeague(leagueId = "turkey_d2") {
    this.currentLeagueId = leagueId;
    const league = this.leagues[leagueId] || this.leagues["turkey_d2"];

    this.standings = league.clubs.map(c => ({
      clubId: c.id,
      name: c.name,
      logo: c.logo,
      ovr: c.ovr,
      stars: c.stars,
      played: 0, won: 0, drawn: 0, lost: 0,
      gf: 0, ga: 0, gd: 0, points: 0,
      squad: this.generateSquad(c.id, c.ovr)
    }));

    this.generateFixtures();
    this.buildSeasonSchedule(window.userCareer && window.userCareer.profile ? window.userCareer.profile : null);
  }

  generateSquad(clubId, avgOvr) {
    const positions = ['GK', 'CB', 'CB', 'LB', 'RB', 'CM', 'CM', 'CAM', 'RW', 'LW', 'ST'];
    const names = ["Marcus", "Lucas", "Mateo", "David", "Sandro", "Ethan", "Julian", "Hugo", "Leo", "Nico", "Arthur"];
    const surnames = ["Silva", "Smith", "Rodriguez", "Müller", "Jones", "Dubois", "Vardy", "Kane", "Nakamura", "Gomez", "Yılmaz"];

    return positions.map((pos, idx) => {
      const fn = names[idx % names.length];
      const ln = surnames[(idx * 3) % surnames.length];
      const ovrOffset = Math.floor(Math.random() * 5) - 2;
      return {
        id: `${clubId}_p${idx}`,
        name: `${fn} ${ln}`,
        position: pos,
        ovr: Math.min(95, Math.max(50, avgOvr + ovrOffset)),
        age: 20 + (idx * 2) % 12
      };
    });
  }

  generateFixtures() {
    this.fixtures = [];
    const clubs = [...this.standings];

    for (let round = 0; round < (clubs.length - 1) * 2; round++) {
      for (let i = 0; i < clubs.length / 2; i++) {
        const homeIndex = (round + i) % (clubs.length - 1);
        let awayIndex = (clubs.length - 1 - i + round) % (clubs.length - 1);
        if (i === 0) awayIndex = clubs.length - 1;

        const home = clubs[homeIndex];
        const away = clubs[awayIndex];

        if (home && away && home !== away) {
          this.fixtures.push({
            id: `fix_${round}_${i}`,
            week: round + 1,
            home: home,
            away: away,
            played: false,
            homeScore: null,
            awayScore: null
          });
        }
      }
    }
  }

  getNationRegion(nationality) {
    const europe = ['england', 'spain', 'france', 'germany', 'italy', 'netherlands', 'portugal', 'turkey', 'belgium', 'croatia', 'norway', 'sweden', 'denmark', 'poland', 'algeria', 'morocco'];
    const southAmerica = ['brazil', 'argentina', 'uruguay', 'colombia'];
    const name = String(nationality || '').toLowerCase();
    if (europe.includes(name)) return 'europe';
    if (southAmerica.includes(name)) return 'south_america';
    return 'world';
  }

  getLeagueMeta() {
    return this.leagues[this.currentLeagueId] || this.leagues.turkey_d2;
  }

  findLeagueForClub(clubId) {
    if (!clubId) return null;
    for (const [leagueId, lg] of Object.entries(this.leagues)) {
      if (lg.clubs.some(c => c.id === clubId)) {
        return leagueId;
      }
    }
    return null;
  }

  getTopClubsPool(excludeClubId = null) {
    const clubs = [];
    Object.values(this.leagues).forEach(lg => {
      if (lg.tier !== 1) return;
      lg.clubs.forEach(c => {
        if (c.id !== excludeClubId) {
          clubs.push({
            clubId: c.id,
            name: c.name,
            ovr: c.ovr,
            stars: c.stars,
            logo: c.logo,
            leagueName: lg.name
          });
        }
      });
    });
    return clubs.sort((a, b) => b.ovr - a.ovr);
  }

  getNationalPool(excludeNationality = null) {
    return this.nationalTeams
      .filter(n => n.name !== excludeNationality)
      .map(n => ({
        clubId: `nat_${n.id}`,
        name: n.name,
        ovr: n.ovr,
        stars: 5,
        logo: n.flag,
        leagueName: 'International'
      }))
      .sort((a, b) => b.ovr - a.ovr);
  }

  pickUnique(items, count) {
    const pool = [...items];
    const picked = [];
    while (pool.length && picked.length < count) {
      const idx = Math.floor(Math.random() * pool.length);
      picked.push(pool.splice(idx, 1)[0]);
    }
    return picked;
  }

  createScheduleEntry(base) {
    return {
      id: base.id,
      sortKey: base.sortKey || 0,
      competitionKey: base.competitionKey,
      competitionName: base.competitionName,
      stageLabel: base.stageLabel,
      matchLabel: base.matchLabel,
      matchContext: base.matchContext,
      participantType: base.participantType,
      participantId: base.participantId,
      userSide: base.userSide || 'home',
      home: base.home,
      away: base.away,
      displayHomeName: base.displayHomeName || base.home?.name,
      displayAwayName: base.displayAwayName || base.away?.name,
      week: base.week || 0,
      played: false,
      homeScore: null,
      awayScore: null
    };
  }

  buildSeasonSchedule(profile = null) {
    const currentLeague = this.getLeagueMeta();
    const userClubId = profile?.currentClubId || this.standings[0]?.clubId || null;
    const userNationality = profile?.nationality || null;
    const userClub = this.standings.find(s => s.clubId === userClubId) || this.standings[0];
    const entries = [];
    const userLeagueFixtures = userClubId
      ? this.fixtures.filter(f => f.home.clubId === userClubId || f.away.clubId === userClubId)
      : this.fixtures.slice(0, 18);
    const totalLeagueMatches = userLeagueFixtures.length || 0;
    let sortKey = 0;

    userLeagueFixtures.forEach((fix, idx) => {
      entries.push(this.createScheduleEntry({
        id: `league_${fix.id}`,
        sortKey: sortKey++,
        competitionKey: 'league',
        competitionName: currentLeague.name,
        stageLabel: 'League Match',
        matchLabel: `League Match ${idx + 1}/${totalLeagueMatches}`,
        matchContext: `${currentLeague.name} Matchday ${fix.week}`,
        participantType: 'club',
        participantId: userClubId,
        userSide: fix.home.clubId === userClubId ? 'home' : 'away',
        home: fix.home,
        away: fix.away,
        displayHomeName: fix.home.name,
        displayAwayName: fix.away.name,
        week: fix.week,
        fixtureId: fix.id
      }));
    });

    const isTier1 = currentLeague.tier === 1;
    const leagueCountry = String(currentLeague.country || '').toLowerCase();
    const europeanLeague = ['turkey', 'england', 'spain', 'italy', 'germany', 'france', 'netherlands', 'portugal'].some(c => leagueCountry.includes(c));

    if (isTier1 && europeanLeague && userClub) {
      const pool = this.getTopClubsPool(userClubId);
      const opponents = this.pickUnique(pool, 10);
      const groupOpps = opponents.slice(0, 6);
      const knockOpps = opponents.slice(6, 10);
      const stages = ['Group Stage', 'Group Stage', 'Group Stage', 'Group Stage', 'Group Stage', 'Group Stage', 'Round of 16', 'Quarter-Finals', 'Semi-Finals', 'Final'];

      groupOpps.forEach((opponent, idx) => {
        entries.push(this.createScheduleEntry({
          id: `ucl_group_${idx + 1}`,
          sortKey: sortKey++,
          competitionKey: 'ucl',
          competitionName: 'Champions League',
          stageLabel: 'Group Stage',
          matchLabel: `Champions League Group Match ${idx + 1}/6`,
          matchContext: `Champions League Group Stage - Matchday ${idx + 1}`,
          participantType: 'club',
          participantId: userClubId,
          userSide: 'home',
          home: userClub,
          away: opponent,
          displayHomeName: userClub.name,
          displayAwayName: opponent.name,
          week: totalLeagueMatches + idx + 1
        }));
      });

      const knockoutLabels = ['Round of 16', 'Quarter-Finals', 'Semi-Finals', 'Final'];
      knockoutLabels.forEach((label, idx) => {
        const opponent = knockOpps[idx] || pool[idx] || { clubId: `ucl_placeholder_${idx}`, name: 'European Elite', ovr: 80, stars: 4, logo: '⭐', leagueName: 'Champions League' };
        entries.push(this.createScheduleEntry({
          id: `ucl_${idx + 1}`,
          sortKey: sortKey++,
          competitionKey: 'ucl',
          competitionName: 'Champions League',
          stageLabel: label,
          matchLabel: `Champions League ${label}`,
          matchContext: `Champions League ${label}`,
          participantType: 'club',
          participantId: userClubId,
          userSide: 'home',
          home: userClub,
          away: opponent,
          displayHomeName: userClub.name,
          displayAwayName: opponent.name,
          week: totalLeagueMatches + 6 + idx + 1
        }));
      });
    }

    const region = this.getNationRegion(userNationality);
    const nationalCompetition = region === 'europe' ? 'Euro Cup' : (region === 'south_america' ? 'Copa America' : 'World Cup');
    if (userNationality) {
      const nationalPool = this.getNationalPool(userNationality);
      const nationalOpponents = this.pickUnique(nationalPool, 7);
      nationalOpponents.slice(0, 3).forEach((opponent, idx) => {
        entries.push(this.createScheduleEntry({
          id: `nat_group_${idx + 1}`,
          sortKey: sortKey++,
          competitionKey: nationalCompetition.toLowerCase().replace(/[^a-z]+/g, '_'),
          competitionName: nationalCompetition,
          stageLabel: 'Group Stage',
          matchLabel: `${nationalCompetition} Group Match ${idx + 1}/3`,
          matchContext: `${nationalCompetition} Group Stage`,
          participantType: 'national',
          participantId: userNationality,
          userSide: 'home',
          home: { clubId: `nat_${userNationality}`, name: userNationality, ovr: profile?.ovr || 72, stars: 5, logo: '🌍' },
          away: opponent,
          displayHomeName: userNationality,
          displayAwayName: opponent.name,
          week: totalLeagueMatches + 20 + idx + 1
        }));
      });

      ['Quarter-Finals', 'Semi-Finals', 'Final'].forEach((label, idx) => {
        const opponent = nationalOpponents[idx + 3] || nationalPool[idx] || { clubId: `nat_placeholder_${idx}`, name: 'International Qualifier', ovr: 78, stars: 4, logo: '🏆', leagueName: 'International' };
        entries.push(this.createScheduleEntry({
          id: `nat_${idx + 1}`,
          sortKey: sortKey++,
          competitionKey: nationalCompetition.toLowerCase().replace(/[^a-z]+/g, '_'),
          competitionName: nationalCompetition,
          stageLabel: label,
          matchLabel: `${nationalCompetition} ${label}`,
          matchContext: `${nationalCompetition} ${label}`,
          participantType: 'national',
          participantId: userNationality,
          userSide: 'home',
          home: { clubId: `nat_${userNationality}`, name: userNationality, ovr: profile?.ovr || 72, stars: 5, logo: '🌍' },
          away: opponent,
          displayHomeName: userNationality,
          displayAwayName: opponent.name,
          week: totalLeagueMatches + 23 + idx + 1
        }));
      });
    }

    if (isTier1 && userClub && userClub.ovr >= 82) {
      const pool = this.getTopClubsPool(userClubId);
      const opponents = this.pickUnique(pool, 3);
      ['Quarter-Final', 'Semi-Final', 'Final'].forEach((label, idx) => {
        const opponent = opponents[idx] || pool[idx] || { clubId: `cwc_placeholder_${idx}`, name: 'Club World Cup Contender', ovr: 81, stars: 4, logo: '🌎', leagueName: 'Club World Cup' };
        entries.push(this.createScheduleEntry({
          id: `cwc_${idx + 1}`,
          sortKey: sortKey++,
          competitionKey: 'club_world_cup',
          competitionName: 'Club World Cup',
          stageLabel: label,
          matchLabel: `Club World Cup ${label}`,
          matchContext: `Club World Cup ${label}`,
          participantType: 'club',
          participantId: userClubId,
          userSide: 'home',
          home: userClub,
          away: opponent,
          displayHomeName: userClub.name,
          displayAwayName: opponent.name,
          week: totalLeagueMatches + 30 + idx + 1
        }));
      });
    }

    this.seasonSchedule = entries;
    this.activeMatchId = null;
    return entries;
  }

  getCompetitionCatalog(profile = null) {
    const p = profile || (window.userCareer && window.userCareer.profile) || null;
    const userClub = this.standings.find(s => s.clubId === p?.currentClubId) || this.standings[0] || null;
    const currentMatches = p?.stats?.season?.matches || 0;
    const catalog = [{
      key: 'league',
      label: 'League',
      subtitle: this.getLeagueMeta().name,
      locked: false,
      reason: ''
    }];

    if (currentMatches >= 5 && userClub && this.isTier1Club(userClub)) {
      catalog.push({
        key: 'ucl',
        label: 'Champions League',
        subtitle: 'Club Competition',
        locked: false,
        reason: ''
      });
    } else {
      catalog.push({
        key: 'ucl',
        label: 'Champions League',
        subtitle: 'Club Competition',
        locked: true,
        reason: currentMatches < 5 ? 'Unlocks after 5 league games.' : 'Only available to 1st division clubs.'
      });
    }

    const nationality = String(p?.nationality || '');
    const region = this.getNationRegion(nationality);
    const nationalName = region === 'europe' ? 'Euro Cup' : (region === 'south_america' ? 'Copa America' : 'World Cup');
    const nationalUnlocked = currentMatches >= 5 && (p?.ovr || 0) >= 83;
    catalog.push({
      key: `national_${nationalName.toLowerCase().replace(/[^a-z]+/g, '_')}`,
      label: nationalName,
      subtitle: 'National Team',
      locked: !nationalUnlocked,
      reason: currentMatches < 5 ? 'Unlocks after 5 league games.' : ((p?.ovr || 0) < 83 ? 'Requires OVR 83+.' : '')
    });

    const cwcUnlocked = currentMatches >= 5 && userClub && this.isTier1Club(userClub) && (p?.ovr || 0) >= 82;
    catalog.push({
      key: 'club_world_cup',
      label: 'Club World Cup',
      subtitle: 'Club Competition',
      locked: !cwcUnlocked,
      reason: currentMatches < 5 ? 'Unlocks after 5 league games.' : ((p?.ovr || 0) < 82 ? 'Requires OVR 82+.' : '')
    });

    return catalog;
  }

  isTier1Club(club) {
    if (!club) return false;
    const league = this.getLeagueMeta();
    return league && league.tier === 1;
  }

  isCompetitionUnlocked(profile, competitionKey) {
    const p = profile || (window.userCareer && window.userCareer.profile) || null;
    const currentMatches = p?.stats?.season?.matches || 0;
    const userClub = this.standings.find(s => s.clubId === p?.currentClubId) || null;

    if (competitionKey === 'league') return true;
    if (currentMatches < 5) return false;
    if (competitionKey === 'ucl') return !!userClub && this.isTier1Club(userClub);
    if (competitionKey === 'club_world_cup') return !!userClub && this.isTier1Club(userClub) && (p?.ovr || 0) >= 82;
    if (competitionKey.startsWith('national_')) return (p?.ovr || 0) >= 83;
    return false;
  }

  getCompetitionMatches(profile = null, competitionKey = 'league') {
    const p = profile || (window.userCareer && window.userCareer.profile) || null;
    if (!this.isCompetitionUnlocked(p, competitionKey)) return [];
    const pClubId = p?.currentClubId || null;
    const pNationality = p?.nationality || null;

    return (this.seasonSchedule || []).filter(g => {
      if (g.played) return false;
      if (competitionKey === 'league') {
        return g.competitionKey === 'league' && g.participantId === pClubId;
      }
      if (competitionKey.startsWith('national_')) {
        return g.competitionKey === competitionKey && g.participantId === pNationality;
      }
      return g.competitionKey === competitionKey && g.participantId === pClubId;
    }).sort((a, b) => a.sortKey - b.sortKey);
  }

  setActiveMatch(matchId) {
    this.activeMatchId = matchId || null;
  }

  clearActiveMatch(matchId = null) {
    if (!matchId || this.activeMatchId === matchId) {
      this.activeMatchId = null;
    }
  }

  getUpcomingGames(userClubId, userNationality = null) {
    const profile = window.userCareer && window.userCareer.profile ? window.userCareer.profile : { currentClubId: userClubId, nationality: userNationality };
    const catalog = this.getCompetitionCatalog(profile);
    const selected = this.activeMatchId
      ? (this.seasonSchedule || []).find(g => g.id === this.activeMatchId && !g.played)
      : null;

    const combined = [];
    if (selected) combined.push(selected);

    catalog
      .filter(c => !c.locked)
      .forEach(c => {
        this.getCompetitionMatches(profile, c.key).forEach(g => combined.push(g));
      });

    return combined.filter((g, idx, arr) => arr.findIndex(x => x.id === g.id) === idx);
  }

  getNextMatch(userClubId, userNationality = null) {
    const profile = window.userCareer && window.userCareer.profile ? window.userCareer.profile : { currentClubId: userClubId, nationality: userNationality };
    const selected = this.activeMatchId ? (this.seasonSchedule || []).find(g => g.id === this.activeMatchId && !g.played) : null;
    if (selected && this.isCompetitionUnlocked(profile, selected.competitionKey)) return selected;
    return this.getCompetitionMatches(profile, 'league')[0] || null;
  }

  simulateGameweek(userClubId, userMatchScore = null, eventContext = null, userNationality = null) {
    const currentFix = eventContext || this.getNextMatch(userClubId, userNationality);
    if (!currentFix) return null;

    if (currentFix.competitionKey !== 'league') {
      currentFix.played = true;
      currentFix.homeScore = userMatchScore ? userMatchScore.userGoals : 0;
      currentFix.awayScore = userMatchScore ? userMatchScore.oppGoals : 0;
      this.clearActiveMatch(currentFix.id);
      return currentFix;
    }

    const currentWeek = currentFix.week;
    const leagueFixture = currentFix.fixtureId ? this.fixtures.find(f => f.id === currentFix.fixtureId) : this.fixtures.find(f => (
      f.home.clubId === currentFix.home?.clubId &&
      f.away.clubId === currentFix.away?.clubId &&
      f.week === currentFix.week
    ));
    if (!leagueFixture) return null;

    const weekFixtures = this.fixtures.filter(f => f.week === currentWeek && !f.played);

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
        scheduleEntry.homeScore = currentFix.homeScore;
        scheduleEntry.awayScore = currentFix.awayScore;
      }
    }
    this.clearActiveMatch(currentFix.id);
    return currentWeek;
  }

  updateStandingsEntry(fix) {
    const home = this.standings.find(s => s.clubId === fix.home.clubId);
    const away = this.standings.find(s => s.clubId === fix.away.clubId);
    if (!home || !away) return;

    home.played += 1; away.played += 1;
    home.gf += fix.homeScore; home.ga += fix.awayScore; home.gd = home.gf - home.ga;
    away.gf += fix.awayScore; away.ga += fix.homeScore; away.gd = away.gf - away.ga;

    if (fix.homeScore > fix.awayScore) {
      home.won += 1; home.points += 3; away.lost += 1;
    } else if (fix.awayScore > fix.homeScore) {
      away.won += 1; away.points += 3; home.lost += 1;
    } else {
      home.drawn += 1; home.points += 1; away.drawn += 1; away.points += 1;
    }
  }

  evaluateContractOffers(userOvr, currentClubId) {
    const p = window.userCareer?.profile;
    const s = window.userCareer?.stats?.season;
    if (!p || !s) return [];
    if (s.matches < 3) return [];

    const matches = s.matches || 0;
    const goalsPerGame = matches > 0 ? (s.goals || 0) / matches : 0;
    const assistsPerGame = matches > 0 ? (s.assists || 0) / matches : 0;
    const avgRating = parseFloat(s.avgRating || 6.0);

    // Performance score (0-100) used for club desirability
    const perfScore = Math.min(1, Math.max(0, (
      (userOvr - 40) * 0.008 +
      goalsPerGame * 0.15 +
      assistsPerGame * 0.10 +
      (avgRating - 5) * 0.08
    )));

    const offers = [];

    // 1. Own club renewal (67% chance)
    if (Math.random() < 0.67) {
      const currentClub = this.standings.find(s => s.clubId === currentClubId);
      if (currentClub) {
        const wage = Math.round(currentClub.ovr * 250 + Math.random() * 1000);
        const years = Math.random() < 0.33 ? Math.floor(Math.random() * 3) + 2 : 1;
        offers.push({
          clubId: currentClub.id,
          clubName: currentClub.name + ' (Renewal)',
          leagueName: this.getLeagueMeta().name,
          stars: currentClub.stars,
          logo: currentClub.logo,
          wage: wage,
          goalBonus: Math.round(currentClub.ovr * 15),
          assistBonus: Math.round(currentClub.ovr * 10),
          years: years,
          squadRole: 'Current Club',
          isRenewal: true
        });
      }
    }

    // 2. External offers from other clubs
    const allCandidates = [];
    Object.values(this.leagues).forEach(lg => {
      lg.clubs.forEach(c => {
        if (c.id !== currentClubId) {
          const clubRating = c.ovr + c.stars * 2;
          const userRating = userOvr + perfScore * 10;
          const diff = clubRating - userRating;
          // Club must be within realistic range of the player's desirability
          const maxDiff = 12 - perfScore * 15;
          if (diff <= maxDiff && diff >= -20) {
            const likelihood = Math.max(0.05, 0.45 - (diff / 25));
            allCandidates.push({ club: c, league: lg, likelihood });
          }
        }
      });
    });

    // Sort by likelihood descending and pick
    allCandidates.sort((a, b) => b.likelihood - a.likelihood);
    const numOffers = 3 + Math.floor(Math.random() * 3);
    const selected = allCandidates.slice(0, numOffers);

    selected.forEach(({ club, league }) => {
      const wage = Math.round(club.ovr * 250 + Math.random() * 1500);
      const years = Math.random() < 0.33 ? Math.floor(Math.random() * 3) + 2 : 1;
      offers.push({
        clubId: club.id,
        clubName: club.name,
        leagueName: league.name,
        stars: club.stars,
        logo: club.logo,
        wage: wage,
        goalBonus: Math.round(club.ovr * 15),
        assistBonus: Math.round(club.ovr * 10),
        years: years,
        squadRole: userOvr >= club.ovr ? 'Crucial Star' : 'First Team Regular',
        isRenewal: false
      });
    });

    // Shuffle to mix renewal with external offers
    offers.sort(() => Math.random() - 0.5);
    return offers.slice(0, 5);
  }

  resetSeason() {
    this.standings.forEach(s => {
      s.played = 0;
      s.won = 0;
      s.drawn = 0;
      s.lost = 0;
      s.gf = 0;
      s.ga = 0;
      s.gd = 0;
      s.points = 0;
    });
    this.generateFixtures();
    this.buildSeasonSchedule(window.userCareer && window.userCareer.profile ? window.userCareer.profile : null);
  }

  getClubBadgeHtml(clubName, size = 28) {
    if (!clubName) return '⚽';

    const colorMap = {
      // Turkish Süper Lig & TFF
      'Galatasaray SK': { p: '#a80000', s: '#fdb913', t: 'GS' },
      'Fenerbahçe SK': { p: '#002d62', s: '#fdb913', t: 'FB' },
      'Beşiktaş JK': { p: '#111111', s: '#ffffff', t: 'BJK' },
      'Trabzonspor': { p: '#6a0928', s: '#4aa7df', t: 'TS' },
      'RAMS Başakşehir': { p: '#003366', s: '#ff6600', t: 'BAŞ' },
      'Adana Demirspor': { p: '#002f6c', s: '#00d2ff', t: 'ADS' },
      'Göztepe SK': { p: '#fdb913', s: '#a80000', t: 'GÖZ' },
      'Sakaryaspor': { p: '#008000', s: '#111111', t: 'SAK' },
      'Kocaelispor': { p: '#008000', s: '#111111', t: 'KOC' },

      // England
      'Manchester City': { p: '#6cabdd', s: '#ffffff', t: 'MCI' },
      'Arsenal FC': { p: '#ef0107', s: '#ffffff', t: 'ARS' },
      'Liverpool FC': { p: '#c8102e', s: '#ffd700', t: 'LIV' },
      'Manchester United': { p: '#da020e', s: '#ffe500', t: 'MUN' },
      'Chelsea FC': { p: '#034694', s: '#ffffff', t: 'CHE' },
      'Tottenham Hotspur': { p: '#ffffff', s: '#132257', t: 'TOT' },
      'Leicester City': { p: '#0053a0', s: '#fdb913', t: 'LEI' },
      'Leeds United': { p: '#ffffff', s: '#1d4ed8', t: 'LEE' },

      // Spain
      'Real Madrid': { p: '#ffffff', s: '#cca152', t: 'RMA' },
      'FC Barcelona': { p: '#004d98', s: '#a50044', t: 'BAR' },
      'Atlético Madrid': { p: '#cb3524', s: '#272e61', t: 'ATM' },

      // Germany
      'FC Bayern München': { p: '#dc052d', s: '#0066b2', t: 'BAY' },
      'Borussia Dortmund': { p: '#fde100', s: '#000000', t: 'BVB' },

      // France
      'Paris Saint-Germain': { p: '#002f6c', s: '#da291c', t: 'PSG' },

      // Italy
      'Inter Milan': { p: '#0055a5', s: '#000000', t: 'INT' },
      'Juventus FC': { p: '#000000', s: '#ffffff', t: 'JUV' },
      'AC Milan': { p: '#fb090b', s: '#000000', t: 'ACM' },

      // USA & Saudi
      'Inter Miami CF': { p: '#f7b5cd', s: '#000000', t: 'MIA' },
      'Al Nassr FC': { p: '#fff000', s: '#003399', t: 'NAS' },
      'Al Hilal SFC': { p: '#0055a5', s: '#ffffff', t: 'HIL' }
    };

    const nameStr = typeof clubName === 'string' ? clubName : (clubName.name || '');
    const meta = colorMap[nameStr] || {
      p: '#1e293b',
      s: '#00ff88',
      t: nameStr.substring(0, 3).toUpperCase()
    };

    return `<svg width="${size}" height="${size}" viewBox="0 0 100 120" style="vertical-align: middle; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));">
      <path d="M50 5 L95 20 V65 C95 95 50 115 50 115 C50 115 5 95 5 65 V20 Z" fill="${meta.p}" stroke="${meta.s}" stroke-width="6"/>
      <path d="M50 10 L88 23 V63 C88 88 50 105 50 105 Z" fill="${meta.s}" opacity="0.25"/>
      <text x="50" y="68" font-size="34" font-weight="900" fill="${meta.s}" text-anchor="middle" font-family="sans-serif">${meta.t}</text>
    </svg>`;
  }

  getCountryFlagHtml(countryNameOrCode, width = 24) {
    if (!countryNameOrCode) return '⚽';
    const codeMap = {
      'England': 'gb', 'england': 'gb', 'gb': 'gb', '🇬🇧': 'gb',
      'Turkey': 'tr', 'turkey': 'tr', 'tr': 'tr', '🇹🇷': 'tr',
      'France': 'fr', 'france': 'fr', 'fr': 'fr', '🇫🇷': 'fr',
      'Spain': 'es', 'spain': 'es', 'es': 'es', '🇪🇸': 'es',
      'Germany': 'de', 'germany': 'de', 'de': 'de', '🇩🇪': 'de',
      'Italy': 'it', 'italy': 'it', 'it': 'it', '🇮🇹': 'it',
      'Brazil': 'br', 'brazil': 'br', 'br': 'br', '🇧🇷': 'br',
      'Argentina': 'ar', 'argentina': 'ar', 'ar': 'ar', '🇦🇷': 'ar',
      'Netherlands': 'nl', 'netherlands': 'nl', 'nl': 'nl', '🇳🇱': 'nl',
      'Portugal': 'pt', 'portugal': 'pt', 'pt': 'pt', '🇵🇹': 'pt',
      'USA': 'us', 'usa': 'us', 'us': 'us', '🇺🇸': 'us',
      'Japan': 'jp', 'japan': 'jp', 'jp': 'jp', '🇯🇵': 'jp',
      'South Korea': 'kr', 'korea': 'kr', 'kr': 'kr', '🇰🇷': 'kr',
      'Morocco': 'ma', 'morocco': 'ma', 'ma': 'ma', '🇲🇦': 'ma',
      'Belgium': 'be', 'belgium': 'be', 'be': 'be', '🇧🇪': 'be',
      'Croatia': 'hr', 'croatia': 'hr', 'hr': 'hr', '🇭🇷': 'hr',
      'Uruguay': 'uy', 'uruguay': 'uy', 'uy': 'uy', '🇺🇾': 'uy',
      'Colombia': 'co', 'colombia': 'co', 'co': 'co', '🇨🇴': 'co',
      'Mexico': 'mx', 'mexico': 'mx', 'mx': 'mx', '🇲🇽': 'mx',
      'Nigeria': 'ng', 'nigeria': 'ng', 'ng': 'ng', '🇳🇬': 'ng',
      'Egypt': 'eg', 'egypt': 'eg', 'eg': 'eg', '🇪🇬': 'eg',
      'Norway': 'no', 'norway': 'no', 'no': 'no', '🇳🇴': 'no',
      'Denmark': 'dk', 'denmark': 'dk', 'dk': 'dk', '🇩🇰': 'dk',
      'Poland': 'pl', 'poland': 'pl', 'pl': 'pl', '🇵🇱': 'pl',
      'Canada': 'ca', 'canada': 'ca', 'ca': 'ca', '🇨🇦': 'ca'
    };

    const iso = codeMap[countryNameOrCode] || 'gb';
    return `<img src="https://flagcdn.com/w40/${iso}.png" srcset="https://flagcdn.com/w80/${iso}.png 2x" width="${width}" style="vertical-align: middle; border-radius: 3px; box-shadow: 0 1px 4px rgba(0,0,0,0.5); object-fit: cover;" alt="${countryNameOrCode}">`;
  }
}

window.leaguesEngine = new LeaguesEngine();
