/**
 * 10 Major Leagues Engine (2 Divisions per League, 10 Teams per Division = 200 Real Clubs Total)
 * Featuring Turkish Süper Lig & TFF 1. Lig, England, Spain, Italy, Germany, France, Netherlands, Portugal, USA, & Saudi Arabia.
 */

class LeaguesEngine {
  constructor() {
    this.nationalTeams = [
      // 5 STARS (Req: 85 OVR)
      { id: "fra", name: "France", flag: "🇫🇷", ovr: 85, stars: 5 },
      { id: "bra", name: "Brazil", flag: "🇧🇷", ovr: 85, stars: 5 },
      { id: "eng", name: "England", flag: "🇬🇧", ovr: 85, stars: 5 },
      { id: "esp", name: "Spain", flag: "🇪🇸", ovr: 85, stars: 5 },
      { id: "por", name: "Portugal", flag: "🇵🇹", ovr: 85, stars: 5 },
      { id: "ned", name: "Netherlands", flag: "🇳🇱", ovr: 85, stars: 5 },
      { id: "ger", name: "Germany", flag: "🇩🇪", ovr: 85, stars: 5 },
      { id: "arg", name: "Argentina", flag: "🇦🇷", ovr: 85, stars: 5 },
      { id: "bel", name: "Belgium", flag: "🇧🇪", ovr: 85, stars: 5 },

      // 4 STARS (Req: 82 OVR)
      { id: "ita", name: "Italy", flag: "🇮🇹", ovr: 82, stars: 4 },
      { id: "cro", name: "Croatia", flag: "🇭🇷", ovr: 82, stars: 4 },
      { id: "uru", name: "Uruguay", flag: "🇺🇾", ovr: 82, stars: 4 },
      { id: "mar", name: "Morocco", flag: "🇲🇦", ovr: 82, stars: 4 },
      { id: "col", name: "Colombia", flag: "🇨🇴", ovr: 82, stars: 4 },
      { id: "dnk", name: "Denmark", flag: "🇩🇰", ovr: 82, stars: 4 },
      { id: "sui", name: "Switzerland", flag: "🇨🇭", ovr: 82, stars: 4 },
      { id: "sen", name: "Senegal", flag: "🇸🇳", ovr: 82, stars: 4 },
      { id: "nga", name: "Nigeria", flag: "🇳🇬", ovr: 82, stars: 4 },
      { id: "jpn", name: "Japan", flag: "🇯🇵", ovr: 82, stars: 4 },

      // 3 STARS (Req: 79 OVR)
      { id: "usa", name: "USA", flag: "🇺🇸", ovr: 79, stars: 3 },
      { id: "tur", name: "Turkey", flag: "🇹🇷", ovr: 79, stars: 3 },
      { id: "nor", name: "Norway", flag: "🇳🇴", ovr: 79, stars: 3 },
      { id: "mex", name: "Mexico", flag: "🇲🇽", ovr: 79, stars: 3 },
      { id: "kor", name: "South Korea", flag: "🇰🇷", ovr: 79, stars: 3 },
      { id: "swe", name: "Sweden", flag: "🇸🇪", ovr: 79, stars: 3 },
      { id: "ukr", name: "Ukraine", flag: "🇺🇦", ovr: 79, stars: 3 },
      { id: "pol", name: "Poland", flag: "🇵🇱", ovr: 79, stars: 3 },
      { id: "sco", name: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", ovr: 79, stars: 3 },
      { id: "wal", name: "Wales", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", ovr: 79, stars: 3 },
      { id: "aut", name: "Austria", flag: "🇦🇹", ovr: 79, stars: 3 },
      { id: "irn", name: "Iran", flag: "🇮🇷", ovr: 79, stars: 3 },
      { id: "egy", name: "Egypt", flag: "🇪🇬", ovr: 79, stars: 3 },
      { id: "alg", name: "Algeria", flag: "🇩🇿", ovr: 79, stars: 3 },
      { id: "civ", name: "Ivory Coast", flag: "🇨🇮", ovr: 79, stars: 3 },
      { id: "cmr", name: "Cameroon", flag: "🇨🇲", ovr: 79, stars: 3 },
      { id: "ecu", name: "Ecuador", flag: "🇪🇨", ovr: 79, stars: 3 },

      // 2 STARS (Req: 75 OVR)
      { id: "can", name: "Canada", flag: "🇨🇦", ovr: 75, stars: 2 },
      { id: "gha", name: "Ghana", flag: "🇬🇭", ovr: 75, stars: 2 },
      { id: "gre", name: "Greece", flag: "🇬🇷", ovr: 75, stars: 2 },
      { id: "rou", name: "Romania", flag: "🇷🇴", ovr: 75, stars: 2 },
      { id: "cze", name: "Czech Republic", flag: "🇨🇿", ovr: 75, stars: 2 },
      { id: "hun", name: "Hungary", flag: "🇭🇺", ovr: 75, stars: 2 },
      { id: "irl", name: "Ireland", flag: "🇮🇪", ovr: 75, stars: 2 },
      { id: "aus", name: "Australia", flag: "🇦🇺", ovr: 75, stars: 2 },
      { id: "sau", name: "Saudi Arabia", flag: "🇸🇦", ovr: 75, stars: 2 },
      { id: "chi", name: "Chile", flag: "🇨🇱", ovr: 75, stars: 2 },
      { id: "per", name: "Peru", flag: "🇵🇪", ovr: 75, stars: 2 },
      { id: "par", name: "Paraguay", flag: "🇵🇾", ovr: 75, stars: 2 },
      { id: "jam", name: "Jamaica", flag: "🇯🇲", ovr: 75, stars: 2 },
      { id: "rsa", name: "South Africa", flag: "🇿🇦", ovr: 75, stars: 2 },
      { id: "tun", name: "Tunisia", flag: "🇹🇳", ovr: 75, stars: 2 },
      { id: "mli", name: "Mali", flag: "🇲🇱", ovr: 75, stars: 2 },

      // 1 STAR (Req: 72 OVR)
      { id: "hai", name: "Haiti", flag: "🇭🇹", ovr: 72, stars: 1 },
      { id: "ind", name: "India", flag: "🇮🇳", ovr: 72, stars: 1 },
      { id: "bgd", name: "Bangladesh", flag: "🇧🇩", ovr: 72, stars: 1 },
      { id: "pak", name: "Pakistan", flag: "🇵🇰", ovr: 72, stars: 1 },
      { id: "nzl", name: "New Zealand", flag: "🇳🇿", ovr: 72, stars: 1 },
      { id: "fin", name: "Finland", flag: "🇫🇮", ovr: 72, stars: 1 },
      { id: "isled", name: "Iceland", flag: "🇮🇸", ovr: 72, stars: 1 },
      { id: "bol", name: "Bolivia", flag: "🇧🇴", ovr: 72, stars: 1 },
      { id: "ven", name: "Venezuela", flag: "🇻🇪", ovr: 72, stars: 1 },
      { id: "hon", name: "Honduras", flag: "🇭🇳", ovr: 72, stars: 1 },
      { id: "crc", name: "Costa Rica", flag: "🇨🇷", ovr: 72, stars: 1 },
      { id: "pan", name: "Panama", flag: "🇵🇦", ovr: 72, stars: 1 },
      { id: "geo", name: "Georgia", flag: "🇬🇪", ovr: 72, stars: 1 },
      { id: "alb", name: "Albania", flag: "🇦🇱", ovr: 72, stars: 1 },
      { id: "irq", name: "Iraq", flag: "🇮🇶", ovr: 72, stars: 1 },
      { id: "uzb", name: "Uzbekistan", flag: "🇺🇿", ovr: 72, stars: 1 },
      
      // EXTRA TEAMS FOR FULL EURO, COPA, AFCON TOURNAMENTS
      { id: "svk", name: "Slovakia", flag: "🇸🇰", ovr: 75, stars: 2 },
      { id: "svn", name: "Slovenia", flag: "🇸🇮", ovr: 75, stars: 2 },
      { id: "bul", name: "Bulgaria", flag: "🇧🇬", ovr: 72, stars: 1 },
      { id: "srb", name: "Serbia", flag: "🇷🇸", ovr: 79, stars: 3 },
      { id: "nir", name: "Northern Ireland", flag: "🇬🇧", ovr: 72, stars: 1 },
      { id: "cod", name: "DR Congo", flag: "🇨🇩", ovr: 75, stars: 2 },
      { id: "ago", name: "Angola", flag: "🇦🇴", ovr: 72, stars: 1 },
      { id: "bfa", name: "Burkina Faso", flag: "🇧🇫", ovr: 75, stars: 2 },
      { id: "gui", name: "Guinea", flag: "🇬🇳", ovr: 75, stars: 2 },
      { id: "zam", name: "Zambia", flag: "🇿🇲", ovr: 72, stars: 1 },
      { id: "cpv", name: "Cape Verde", flag: "🇨🇻", ovr: 75, stars: 2 },
      { id: "slv", name: "El Salvador", flag: "🇸🇻", ovr: 72, stars: 1 },
      { id: "tto", name: "Trinidad & Tobago", flag: "🇹🇹", ovr: 72, stars: 1 },
      { id: "uae", name: "UAE", flag: "🇦🇪", ovr: 75, stars: 2 },
      { id: "qat", name: "Qatar", flag: "🇶🇦", ovr: 75, stars: 2 },
      { id: "jor", name: "Jordan", flag: "🇯🇴", ovr: 72, stars: 1 },
      { id: "omn", name: "Oman", flag: "🇴🇲", ovr: 72, stars: 1 },
      { id: "vnm", name: "Vietnam", flag: "🇻🇳", ovr: 72, stars: 1 },
      { id: "tha", name: "Thailand", flag: "🇹🇭", ovr: 72, stars: 1 }
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
      },

      // 11. INDIA 🇮🇳
      india_d1: {
        id: "india_d1", name: "Indian Super League", country: "India 🇮🇳", tier: 1,
        clubs: [
          { id: "mumbaicity", name: "Mumbai City FC", ovr: 64, stars: 2, logo: "🔵" },
          { id: "mohunbagan", name: "Mohun Bagan SG", ovr: 64, stars: 2, logo: "🟢🔴" },
          { id: "eastbengal", name: "East Bengal FC", ovr: 62, stars: 1, logo: "🔴🟡" },
          { id: "keralablasters", name: "Kerala Blasters", ovr: 63, stars: 1, logo: "🟡" },
          { id: "fcgoa", name: "FC Goa", ovr: 63, stars: 1, logo: "🔵" },
          { id: "bengalurufc", name: "Bengaluru FC", ovr: 62, stars: 1, logo: "🔵" },
          { id: "chennaiyin", name: "Chennaiyin FC", ovr: 61, stars: 1, logo: "🔵" },
          { id: "odishafc", name: "Odisha FC", ovr: 61, stars: 1, logo: "🟣" },
          { id: "jamshedpur", name: "Jamshedpur FC", ovr: 60, stars: 1, logo: "🔴" },
          { id: "hyderabadfc", name: "Hyderabad FC", ovr: 59, stars: 1, logo: "🟡⬛" }
        ]
      },

      // 12. BRAZIL 🇧🇷
      brazil_d1: {
        id: "brazil_d1", name: "Série A (Brazil)", country: "Brazil 🇧🇷", tier: 1,
        clubs: [
          { id: "flamengo", name: "CR Flamengo", ovr: 83, stars: 5, logo: "🔴⬛" },
          { id: "palmeiras", name: "SE Palmeiras", ovr: 82, stars: 4, logo: "🟢" },
          { id: "saopaulo", name: "São Paulo FC", ovr: 81, stars: 4, logo: "🔴⚪⬛" },
          { id: "santos", name: "Santos FC", ovr: 80, stars: 4, logo: "⚪⬛" },
          { id: "corinthians", name: "SC Corinthians", ovr: 79, stars: 4, logo: "⚪⬛" },
          { id: "gremio", name: "Grêmio FBPA", ovr: 79, stars: 4, logo: "🔵⚪⬛" },
          { id: "fluminense", name: "Fluminense FC", ovr: 79, stars: 4, logo: "🟢🔴⚪" },
          { id: "botafogo", name: "Botafogo FR", ovr: 78, stars: 3, logo: "⬛⬜" },
          { id: "atleticomg", name: "Atlético Mineiro", ovr: 78, stars: 3, logo: "⬛⬜" },
          { id: "athleticopr", name: "Athletico Paranaense", ovr: 77, stars: 3, logo: "🔴⬛" }
        ]
      },

      // 13. ARGENTINA 🇦🇷
      argentina_d1: {
        id: "argentina_d1", name: "Primera División (Arg)", country: "Argentina 🇦🇷", tier: 1,
        clubs: [
          { id: "riverplate", name: "River Plate", ovr: 80, stars: 4, logo: "🔴⬜" },
          { id: "bocajuniors", name: "Boca Juniors", ovr: 79, stars: 4, logo: "🔵🟡" },
          { id: "racingclub", name: "Racing Club", ovr: 77, stars: 3, logo: "🔵⚪" },
          { id: "independiente", name: "CA Independiente", ovr: 76, stars: 3, logo: "🔴" },
          { id: "sanlorenzo", name: "San Lorenzo", ovr: 75, stars: 3, logo: "🔵🔴" },
          { id: "estudiantes", name: "Estudiantes LP", ovr: 75, stars: 3, logo: "🔴⚪" },
          { id: "velezsarsfield", name: "Vélez Sarsfield", ovr: 74, stars: 3, logo: "🔵⚪" },
          { id: "talleres", name: "Talleres de Córdoba", ovr: 74, stars: 3, logo: "🔵⬜" },
          { id: "newells", name: "Newell's Old Boys", ovr: 73, stars: 3, logo: "🔴⬛" },
          { id: "rosariocentral", name: "Rosario Central", ovr: 73, stars: 3, logo: "🟡🔵" }
        ]
      },

      // 14. MEXICO 🇲🇽
      mexico_d1: {
        id: "mexico_d1", name: "Liga MX", country: "Mexico 🇲🇽", tier: 1,
        clubs: [
          { id: "clubamerica", name: "Club América", ovr: 78, stars: 3, logo: "🟡🔵" },
          { id: "tigresuanl", name: "Tigres UANL", ovr: 77, stars: 3, logo: "🟡🔵" },
          { id: "monterrey", name: "CF Monterrey", ovr: 76, stars: 3, logo: "🔵⬜" },
          { id: "chivas", name: "Chivas de Guadalajara", ovr: 76, stars: 3, logo: "🔴⚪🔵" },
          { id: "cruzazul", name: "Cruz Azul", ovr: 75, stars: 3, logo: "🔵" },
          { id: "pumas", name: "Pumas UNAM", ovr: 74, stars: 3, logo: "🟡" },
          { id: "pachuca", name: "CF Pachuca", ovr: 73, stars: 3, logo: "🔵⚪" },
          { id: "toluca", name: "Deportivo Toluca", ovr: 73, stars: 3, logo: "🔴" },
          { id: "santoslaguna", name: "Santos Laguna", ovr: 72, stars: 3, logo: "🟢⚪" },
          { id: "clubleon", name: "Club León", ovr: 71, stars: 3, logo: "🟢" }
        ]
      },

      // 15. JAPAN 🇯🇵
      japan_d1: {
        id: "japan_d1", name: "J1 League", country: "Japan 🇯🇵", tier: 1,
        clubs: [
          { id: "visselkobe", name: "Vissel Kobe", ovr: 74, stars: 3, logo: "🔴" },
          { id: "yokohama", name: "Yokohama F. Marinos", ovr: 73, stars: 3, logo: "🔵⚪🔴" },
          { id: "kawasaki", name: "Kawasaki Frontale", ovr: 72, stars: 3, logo: "🔵" },
          { id: "urawareds", name: "Urawa Red Diamonds", ovr: 71, stars: 3, logo: "🔴⚪⬛" },
          { id: "hiroshima", name: "Sanfrecce Hiroshima", ovr: 70, stars: 3, logo: "🟣" },
          { id: "kashima", name: "Kashima Antlers", ovr: 70, stars: 3, logo: "🔴" },
          { id: "nagoyagrampus", name: "Nagoya Grampus", ovr: 69, stars: 2, logo: "🔴" },
          { id: "cerezo", name: "Cerezo Osaka", ovr: 68, stars: 2, logo: "🌸" },
          { id: "gamba", name: "Gamba Osaka", ovr: 68, stars: 2, logo: "🔵⬛" },
          { id: "fctokyo", name: "FC Tokyo", ovr: 67, stars: 2, logo: "🔵🔴" }
        ]
      },

      // 16. SOUTH KOREA 🇰🇷
      korea_d1: {
        id: "korea_d1", name: "K League 1", country: "South Korea 🇰🇷", tier: 1,
        clubs: [
          { id: "ulsanhd", name: "Ulsan HD", ovr: 72, stars: 2, logo: "🔵" },
          { id: "jeonbuk", name: "Jeonbuk Hyundai Motors", ovr: 71, stars: 2, logo: "🟢" },
          { id: "pohang", name: "Pohang Steelers", ovr: 70, stars: 2, logo: "🔴⬛" },
          { id: "fcseoul", name: "FC Seoul", ovr: 69, stars: 2, logo: "🔴⬛" },
          { id: "gwangjufc", name: "Gwangju FC", ovr: 67, stars: 2, logo: "🟡" },
          { id: "daegufc", name: "Daegu FC", ovr: 66, stars: 2, logo: "🔵" },
          { id: "incheon", name: "Incheon United", ovr: 66, stars: 2, logo: "🔵⬛" },
          { id: "jeju", name: "Jeju United", ovr: 65, stars: 2, logo: "🟠" },
          { id: "gangwon", name: "Gangwon FC", ovr: 64, stars: 2, logo: "🟠" },
          { id: "daejeon", name: "Daejeon Hana Citizen", ovr: 63, stars: 2, logo: "🟢" }
        ]
      },

      // 17. SCOTLAND 🏴󠁧󠁢󠁳󠁣󠁴󠁿
      scotland_d1: {
        id: "scotland_d1", name: "Scottish Premiership", country: "Scotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿", tier: 1,
        clubs: [
          { id: "celtic", name: "Celtic FC", ovr: 78, stars: 4, logo: "🍀" },
          { id: "rangers", name: "Rangers FC", ovr: 77, stars: 4, logo: "🔵" },
          { id: "hearts", name: "Heart of Midlothian", ovr: 70, stars: 3, logo: "🟤" },
          { id: "hibernian", name: "Hibernian FC", ovr: 69, stars: 2, logo: "🟢" },
          { id: "aberdeen", name: "Aberdeen FC", ovr: 69, stars: 2, logo: "🔴" },
          { id: "kilmarnock", name: "Kilmarnock FC", ovr: 68, stars: 2, logo: "🔵⚪" },
          { id: "stmirren", name: "St Mirren FC", ovr: 67, stars: 2, logo: "⬛⬜" },
          { id: "motherwell", name: "Motherwell FC", ovr: 66, stars: 2, logo: "🟡🟠" },
          { id: "stjohnstone", name: "St Johnstone", ovr: 65, stars: 2, logo: "🔵🟡" },
          { id: "dundee", name: "Dundee FC", ovr: 64, stars: 2, logo: "🔵" }
        ]
      },

      // 18. BELGIUM 🇧🇪
      belgium_d1: {
        id: "belgium_d1", name: "Belgian Pro League", country: "Belgium 🇧🇪", tier: 1,
        clubs: [
          { id: "clubbrugge", name: "Club Brugge KV", ovr: 78, stars: 4, logo: "🔵⬛" },
          { id: "anderlecht", name: "RSC Anderlecht", ovr: 76, stars: 3, logo: "🟣" },
          { id: "antwerp", name: "Royal Antwerp FC", ovr: 74, stars: 3, logo: "🔴" },
          { id: "genk", name: "KRC Genk", ovr: 73, stars: 3, logo: "🔵" },
          { id: "gent", name: "KAA Gent", ovr: 73, stars: 3, logo: "🔵⚪" },
          { id: "unionsg", name: "Union Saint-Gilloise", ovr: 75, stars: 3, logo: "🟡🔵" },
          { id: "standardliege", name: "Standard Liège", ovr: 71, stars: 3, logo: "🔴" },
          { id: "charleroi", name: "Sporting Charleroi", ovr: 69, stars: 2, logo: "🦓" },
          { id: "mechelen", name: "KV Mechelen", ovr: 69, stars: 2, logo: "🔴🟡" },
          { id: "cerclebrugge", name: "Cercle Brugge KSV", ovr: 70, stars: 2, logo: "🟢" }
        ]
      },

      // 19. GREECE 🇬🇷
      greece_d1: {
        id: "greece_d1", name: "Super League Greece", country: "Greece 🇬🇷", tier: 1,
        clubs: [
          { id: "olympiacos", name: "Olympiacos FC", ovr: 77, stars: 4, logo: "🔴" },
          { id: "paok", name: "PAOK FC", ovr: 76, stars: 3, logo: "⬛⬜" },
          { id: "aekathens", name: "AEK Athens FC", ovr: 75, stars: 3, logo: "🦅" },
          { id: "panathinaikos", name: "Panathinaikos FC", ovr: 75, stars: 3, logo: "☘️" },
          { id: "aris", name: "Aris Thessaloniki", ovr: 70, stars: 2, logo: "🟡" },
          { id: "asteras", name: "Asteras Tripolis", ovr: 67, stars: 2, logo: "🔵🟡" },
          { id: "atromitos", name: "Atromitos FC", ovr: 67, stars: 2, logo: "🔵" },
          { id: "oficrete", name: "OFI Crete FC", ovr: 66, stars: 2, logo: "⬛⬜" },
          { id: "volos", name: "Volos NFC", ovr: 65, stars: 2, logo: "🔴🔵" },
          { id: "lamia", name: "Lamia FC", ovr: 64, stars: 2, logo: "🔵" }
        ]
      },

      // 20. NORWAY 🇳🇴
      norway_d1: {
        id: "norway_d1", name: "Eliteserien", country: "Norway 🇳🇴", tier: 1,
        clubs: [
          { id: "bodoglimt", name: "FK Bodø/Glimt", ovr: 74, stars: 3, logo: "🟡" },
          { id: "molde", name: "Molde FK", ovr: 73, stars: 3, logo: "🔵" },
          { id: "rosenborg", name: "Rosenborg BK", ovr: 71, stars: 3, logo: "⬛⬜" },
          { id: "brann", name: "SK Brann", ovr: 71, stars: 3, logo: "🔴" },
          { id: "viking", name: "Viking FK", ovr: 70, stars: 3, logo: "🔵" },
          { id: "lillestrom", name: "Lillestrøm SK", ovr: 68, stars: 2, logo: "🟡⬛" },
          { id: "tromso", name: "Tromsø IL", ovr: 67, stars: 2, logo: "🔴⬜" },
          { id: "sarpsborg", name: "Sarpsborg 08", ovr: 66, stars: 2, logo: "🔵" },
          { id: "valerenga", name: "Vålerenga Fotball", ovr: 66, stars: 2, logo: "🔵🔴" },
          { id: "stromsgodset", name: "Strømsgodset TF", ovr: 65, stars: 2, logo: "🔵" }
        ]
      }
    };

    this.currentLeagueId = "turkey_d2";
    this.standings = [];
    this.fixtures = [];
    this.seasonSchedule = [];
    this.activeMatchId = null;
    this.clubSquads = {};
    
    // Dynamically pad all 20 divisions with 8 realistic clubs to reach 18 teams (34 matches/season)
    this.padLeaguesWithExtraTeams();
    
    // Scale Division 2 clubs OVR to be strictly balanced between 68 and 76
    Object.values(this.leagues).forEach(lg => {
      if (lg.tier === 2) {
        lg.clubs.forEach((c, idx) => {
          const scaledOvr = Math.round(76 - (idx / (lg.clubs.length - 1)) * 8);
          c.ovr = Math.min(76, Math.max(68, scaledOvr));
        });
      }
    });
    
    this.initLeague();
  }

  getStarterThreshold(stars) {
    const s = parseInt(stars || 3);
    if (s === 5) return 82;
    if (s === 4 || s === 3) return 78;
    if (s === 2) return 72;
    return 65; // 1-star
  }

  padLeaguesWithExtraTeams() {
    const extraClubs = {
      turkey_d1: [
        { id: "altay_pad", name: "Altay SK 🇹🇷", ovr: 71, stars: 2, logo: "🦁" },
        { id: "konyaspor_pad", name: "Konyaspor 🇹🇷", ovr: 73, stars: 3, logo: "🟢" },
        { id: "hatayspor_pad", name: "Hatayspor 🇹🇷", ovr: 72, stars: 2, logo: "⚡" },
        { id: "gaziantep_pad", name: "Gaziantep FK 🇹🇷", ovr: 71, stars: 2, logo: "🔴" },
        { id: "samsunspor_pad", name: "Samsunspor 🇹🇷", ovr: 72, stars: 2, logo: "🔴" },
        { id: "kayserispor_pad", name: "Kayserispor 🇹🇷", ovr: 73, stars: 3, logo: "🟡" },
        { id: "rizespor_pad", name: "Çaykur Rizespor 🇹🇷", ovr: 72, stars: 2, logo: "🟢" },
        { id: "pendikspor_pad", name: "Pendikspor 🇹🇷", ovr: 70, stars: 2, logo: "⚪" }
      ],
      turkey_d2: [
        { id: "ankaragucu_pad", name: "MKE Ankaragücü 🇹🇷", ovr: 65, stars: 2, logo: "🟡" },
        { id: "keciorengucu_pad", name: "Ankara Keçiörengücü 🇹🇷", ovr: 64, stars: 2, logo: "🔴" },
        { id: "adanaspor_pad", name: "Adanaspor 🇹🇷", ovr: 63, stars: 2, logo: "🟠" },
        { id: "sanliurfaspor_pad", name: "Şanlıurfaspor 🇹🇷", ovr: 62, stars: 2, logo: "🟡" },
        { id: "giresunspor_pad", name: "Giresunspor 🇹🇷", ovr: 63, stars: 2, logo: "🟢" },
        { id: "tuzlaspor_pad", name: "Tuzlaspor 🇹🇷", ovr: 61, stars: 2, logo: "🔵" },
        { id: "altinordu_pad", name: "Altınordu FK 🇹🇷", ovr: 62, stars: 2, logo: "🔴" },
        { id: "denizlispor_pad", name: "Denizlispor 🇹🇷", ovr: 61, stars: 2, logo: "🟢" }
      ],
      england_d1: [
        { id: "brentford_pad", name: "Brentford FC 🇬🇧", ovr: 77, stars: 3, logo: "🐝" },
        { id: "everton_pad", name: "Everton FC 🇬🇧", ovr: 77, stars: 3, logo: "🔵" },
        { id: "nottingham_pad", name: "Nottingham Forest 🇬🇧", ovr: 76, stars: 3, logo: "🌳" },
        { id: "palace_pad", name: "Crystal Palace 🇬🇧", ovr: 77, stars: 3, logo: "🦅" },
        { id: "fulham_pad", name: "Fulham FC 🇬🇧", ovr: 76, stars: 3, logo: "⚪" },
        { id: "wolves_pad", name: "Wolverhampton 🇬🇧", ovr: 76, stars: 3, logo: "🐺" },
        { id: "bournemouth_pad", name: "Bournemouth FC 🇬🇧", ovr: 75, stars: 3, logo: "🍒" },
        { id: "luton_pad", name: "Luton Town 🇬🇧", ovr: 73, stars: 3, logo: "🟠" }
      ],
      england_d2: [
        { id: "burnley_pad", name: "Burnley FC 🇬🇧", ovr: 69, stars: 2, logo: "🍇" },
        { id: "sheffield_utd_pad", name: "Sheffield United 🇬🇧", ovr: 68, stars: 2, logo: "⚔️" },
        { id: "middlesbrough_pad", name: "Middlesbrough 🇬🇧", ovr: 67, stars: 2, logo: "🔴" },
        { id: "sunderland_pad", name: "Sunderland AFC 🇬🇧", ovr: 68, stars: 2, logo: "🔴" },
        { id: "westbrom_pad", name: "West Bromwich Albion 🇬🇧", ovr: 67, stars: 2, logo: "🔵" },
        { id: "coventry_pad", name: "Coventry City 🇬🇧", ovr: 66, stars: 2, logo: "🩵" },
        { id: "norwich_pad", name: "Norwich City 🇬🇧", ovr: 68, stars: 2, logo: "🦊" },
        { id: "watford_pad", name: "Watford FC 🇬🇧", ovr: 67, stars: 2, logo: "🐝" }
      ],
      spain_d1: [
        { id: "celta_pad", name: "Celta Vigo 🇪🇸", ovr: 77, stars: 3, logo: "🩵" },
        { id: "mallorca_pad", name: "RCD Mallorca 🇪🇸", ovr: 76, stars: 3, logo: "🔴" },
        { id: "vallecano_pad", name: "Rayo Vallecano 🇪🇸", ovr: 75, stars: 3, logo: "⚡" },
        { id: "getafe_pad", name: "Getafe CF 🇪🇸", ovr: 76, stars: 3, logo: "🔵" },
        { id: "alaves_pad", name: "Deportivo Alavés 🇪🇸", ovr: 74, stars: 3, logo: "🔵" },
        { id: "granada_pad", name: "Granada CF 🇪🇸", ovr: 73, stars: 3, logo: "🔴" },
        { id: "cadiz_pad", name: "Cádiz CF 🇪🇸", ovr: 72, stars: 3, logo: "🟡" },
        { id: "almeria_pad", name: "UD Almería 🇪🇸", ovr: 72, stars: 3, logo: "🔴" }
      ],
      spain_d2: [
        { id: "levante_pad", name: "Levante UD 🇪🇸", ovr: 68, stars: 2, logo: "🔵" },
        { id: "leganes_pad", name: "CD Leganés 🇪🇸", ovr: 69, stars: 2, logo: "🩵" },
        { id: "burgos_pad", name: "Burgos CF 🇪🇸", ovr: 67, stars: 2, logo: "⬛" },
        { id: "andorra_pad", name: "FC Andorra 🇪🇸", ovr: 66, stars: 2, logo: "🔵" },
        { id: "ferrol_pad", name: "Racing Ferrol 🇪🇸", ovr: 66, stars: 2, logo: "🟢" },
        { id: "eldense_pad", name: "CD Eldense 🇪🇸", ovr: 65, stars: 2, logo: "🔵" },
        { id: "huesca_pad", name: "SD Huesca 🇪🇸", ovr: 65, stars: 2, logo: "🔵" },
        { id: "mirandes_pad", name: "CD Mirandés 🇪🇸", ovr: 66, stars: 2, logo: "🔴" }
      ],
      italy_d1: [
        { id: "genoa_pad", name: "Genoa CFC 🇮🇹", ovr: 76, stars: 3, logo: "🔴" },
        { id: "monza_pad", name: "AC Monza 🇮🇹", ovr: 76, stars: 3, logo: "🔴" },
        { id: "lecce_pad", name: "Lecce 🇮🇹", ovr: 74, stars: 3, logo: "🟡" },
        { id: "frosinone_pad", name: "Frosinone Calcio 🇮🇹", ovr: 73, stars: 3, logo: "🟡" },
        { id: "empoli_pad", name: "Empoli FC 🇮🇹", ovr: 73, stars: 3, logo: "🔵" },
        { id: "sassuolo_pad", name: "Sassuolo Calcio 🇮🇹", ovr: 75, stars: 3, logo: "🟢" },
        { id: "cagliari_pad", name: "Cagliari Calcio 🇮🇹", ovr: 74, stars: 3, logo: "🔴" },
        { id: "salernitana_pad", name: "Salernitana 🇮🇹", ovr: 71, stars: 3, logo: "🟤" }
      ],
      italy_d2: [
        { id: "ascoli_pad", name: "Ascoli Calcio 🇮🇹", ovr: 68, stars: 2, logo: "⬛" },
        { id: "spezia_pad", name: "Spezia Calcio 🇮🇹", ovr: 67, stars: 2, logo: "⬛" },
        { id: "reggiana_pad", name: "AC Reggiana 🇮🇹", ovr: 65, stars: 2, logo: "🟤" },
        { id: "cremonese_pad", name: "US Cremonese 🇮🇹", ovr: 66, stars: 2, logo: "🔴" },
        { id: "cosenza_pad", name: "Cosenza Calcio 🇮🇹", ovr: 67, stars: 2, logo: "🔴" },
        { id: "sudtirol_pad", name: "FC Südtirol 🇮🇹", ovr: 66, stars: 2, logo: "🔴" },
        { id: "ternana_pad", name: "Ternana Calcio 🇮🇹", ovr: 65, stars: 2, logo: "🟢" },
        { id: "cittadella_pad", name: "AS Cittadella 🇮🇹", ovr: 65, stars: 2, logo: "🟤" }
      ],
      germany_d1: [
        { id: "bremen_pad", name: "Werder Bremen 🇩🇪", ovr: 77, stars: 3, logo: "🟢" },
        { id: "heidenheim_pad", name: "FC Heidenheim 🇩🇪", ovr: 75, stars: 3, logo: "🔴" },
        { id: "augsburg_pad", name: "FC Augsburg 🇩🇪", ovr: 75, stars: 3, logo: "🔴" },
        { id: "bochum_pad", name: "VfL Bochum 🇩🇪", ovr: 73, stars: 3, logo: "🔵" },
        { id: "darmstadt_pad", name: "SV Darmstadt 98 🇩🇪", ovr: 72, stars: 3, logo: "🔵" },
        { id: "mainz_pad", name: "FSV Mainz 05 🇩🇪", ovr: 76, stars: 3, logo: "🔴" },
        { id: "union_pad", name: "Union Berlin 🇩🇪", ovr: 76, stars: 3, logo: "🔴" },
        { id: "koln_pad", name: "1. FC Köln 🇩🇪", ovr: 74, stars: 3, logo: "🐐" }
      ],
      germany_d2: [
        { id: "kaiserslautern_pad", name: "FC Kaiserslautern 🇩🇪", ovr: 68, stars: 2, logo: "🔴" },
        { id: "fuerth_pad", name: "SpVgg Greuther Fürth 🇩🇪", ovr: 68, stars: 2, logo: "🟢" },
        { id: "nuernberg_pad", name: "1. FC Nürnberg 🇩🇪", ovr: 67, stars: 2, logo: "🔴" },
        { id: "kiel_pad", name: "Holstein Kiel 🇩🇪", ovr: 69, stars: 2, logo: "🔵" },
        { id: "magdeburg_pad", name: "1. FC Magdeburg 🇩🇪", ovr: 68, stars: 2, logo: "🟤" },
        { id: "braunschweig_pad", name: "Eintracht Braunschweig 🇩🇪", ovr: 66, stars: 2, logo: "🔵" },
        { id: "wiesbaden_pad", name: "SV Wehen Wiesbaden 🇩🇪", ovr: 67, stars: 2, logo: "🟢" },
        { id: "osnabrueck_pad", name: "VfL Osnabrück 🇩🇪", ovr: 65, stars: 2, logo: "🔵" }
      ],
      france_d1: [
        { id: "lorient_pad", name: "FC Lorient 🇫🇷", ovr: 75, stars: 3, logo: "🟠" },
        { id: "reims_pad", name: "Stade de Reims 🇫🇷", ovr: 76, stars: 3, logo: "🔴" },
        { id: "lehavre_pad", name: "Le Havre AC 🇫🇷", ovr: 73, stars: 3, logo: "🩵" },
        { id: "metz_pad", name: "FC Metz 🇫🇷", ovr: 72, stars: 3, logo: "🟤" },
        { id: "montpellier_pad", name: "Montpellier HSC 🇫🇷", ovr: 75, stars: 3, logo: "🔵" },
        { id: "nantes_pad", name: "FC Nantes 🇫🇷", ovr: 74, stars: 3, logo: "🟡" },
        { id: "brest_pad", name: "Stade Brestois 29 🇫🇷", ovr: 76, stars: 3, logo: "🔴" },
        { id: "clermont_pad", name: "Clermont Foot 63 🇫🇷", ovr: 71, stars: 3, logo: "🔴" }
      ],
      france_d2: [
        { id: "valenciennes_pad", name: "Valenciennes FC 🇫🇷", ovr: 65, stars: 2, logo: "🔴" },
        { id: "troyes_pad", name: "ESTAC Troyes 🇫🇷", ovr: 68, stars: 2, logo: "🔵" },
        { id: "concarneau_pad", name: "US Concarneau 🇫🇷", ovr: 64, stars: 2, logo: "🔵" },
        { id: "amiens_pad", name: "Amiens SC 🇫🇷", ovr: 67, stars: 2, logo: "⚪" },
        { id: "pau_pad", name: "Pau FC 🇫🇷", ovr: 66, stars: 2, logo: "🟡" },
        { id: "laval_pad", name: "Stade Lavallois 🇫🇷", ovr: 65, stars: 2, logo: "🟠" },
        { id: "annecy_pad", name: "Annecy FC 🇫🇷", ovr: 64, stars: 2, logo: "🔴" },
        { id: "ajaccio_pad", name: "AC Ajaccio 🇫🇷", ovr: 68, stars: 2, logo: "🔴" }
      ],
      dutch_d1: [
        { id: "fortunasittard_pad", name: "Fortuna Sittard 🇳🇱", ovr: 73, stars: 3, logo: "🟡" },
        { id: "heracles_pad", name: "Heracles Almelo 🇳🇱", ovr: 72, stars: 3, logo: "⬛" },
        { id: "zwolle_pad", name: "PEC Zwolle 🇳🇱", ovr: 72, stars: 3, logo: "🔵" },
        { id: "waalwijk_pad", name: "RKC Waalwijk 🇳🇱", ovr: 71, stars: 3, logo: "🟡" },
        { id: "excelsior_pad", name: "Excelsior Rotterdam 🇳🇱", ovr: 71, stars: 3, logo: "🔴" },
        { id: "almere_pad", name: "Almere City FC 🇳🇱", ovr: 70, stars: 3, logo: "🔴" },
        { id: "volendam_pad", name: "FC Volendam 🇳🇱", ovr: 69, stars: 3, logo: "🟠" },
        { id: "emmen_pad", name: "FC Emmen 🇳🇱", ovr: 68, stars: 3, logo: "🔴" }
      ],
      dutch_d2: [
        { id: "fceindhoven_pad", name: "FC Eindhoven 🇳🇱", ovr: 67, stars: 2, logo: "🔵" },
        { id: "vvvvenlo_pad", name: "VVV-Venlo 🇳🇱", ovr: 66, stars: 2, logo: "🟡" },
        { id: "helmond_pad", name: "Helmond Sport 🇳🇱", ovr: 65, stars: 2, logo: "🔴" },
        { id: "toposs_pad", name: "TOP Oss 🇳🇱", ovr: 64, stars: 2, logo: "🔴" },
        { id: "dordrecht_pad", name: "FC Dordrecht 🇳🇱", ovr: 65, stars: 2, logo: "🟢" },
        { id: "jongpsv_pad", name: "Jong PSV 🇳🇱", ovr: 66, stars: 2, logo: "🔴" },
        { id: "jongajax_pad", name: "Jong Ajax 🇳🇱", ovr: 67, stars: 2, logo: "❌" },
        { id: "jongaz_pad", name: "Jong AZ 🇳🇱", ovr: 65, stars: 2, logo: "🔴" }
      ],
      portugal_d1: [
        { id: "boavista_pad", name: "Boavista FC 🇵🇹", ovr: 74, stars: 3, logo: "⬛" },
        { id: "gilvicente_pad", name: "Gil Vicente FC 🇵🇹", ovr: 74, stars: 3, logo: "🔴" },
        { id: "portimonense_pad", name: "Portimonense SC 🇵🇹", ovr: 72, stars: 3, logo: "⬛" },
        { id: "chaves_pad", name: "GD Chaves 🇵🇹", ovr: 71, stars: 3, logo: "🔵" },
        { id: "vizela_pad", name: "FC Vizela 🇵🇹", ovr: 71, stars: 3, logo: "🔵" },
        { id: "farense_pad", name: "SC Farense 🇵🇹", ovr: 72, stars: 3, logo: "⚪" },
        { id: "estrela_pad", name: "Estrela da Amadora 🇵🇹", ovr: 71, stars: 3, logo: "🟢" },
        { id: "moreirense_pad", name: "Moreirense FC 🇵🇹", ovr: 73, stars: 3, logo: "🟢" }
      ],
      portugal_d2: [
        { id: "penafiel_pad", name: "FC Penafiel 🇵🇹", ovr: 64, stars: 2, logo: "🔴" },
        { id: "tondela_pad", name: "CD Tondela 🇵🇹", ovr: 65, stars: 2, logo: "🟢" },
        { id: "feirense_pad", name: "CD Feirense 🇵🇹", ovr: 64, stars: 2, logo: "🔵" },
        { id: "leixoes_pad", name: "Leixões SC 🇵🇹", ovr: 65, stars: 2, logo: "🔴" },
        { id: "mafra_pad", name: "CD Mafra 🇵🇹", ovr: 64, stars: 2, logo: "🟡" },
        { id: "porto_b_pad", name: "FC Porto B 🇵🇹", ovr: 66, stars: 2, logo: "🔵" },
        { id: "benfica_b_pad", name: "SL Benfica B 🇵🇹", ovr: 66, stars: 2, logo: "🔴" },
        { id: "academicaviseu_pad", name: "Académico de Viseu 🇵🇹", ovr: 65, stars: 2, logo: "⚫" }
      ],
      mls_d1: [
        { id: "austin_pad", name: "Austin FC 🇺🇸", ovr: 74, stars: 3, logo: "🟢" },
        { id: "portland_pad", name: "Portland Timbers 🇺🇸", ovr: 74, stars: 3, logo: "🌲" },
        { id: "sporting_kc_pad", name: "Sporting Kansas City 🇺🇸", ovr: 73, stars: 3, logo: "🩵" },
        { id: "salt_lake_pad", name: "Real Salt Lake 🇺🇸", ovr: 74, stars: 3, logo: "🔴" },
        { id: "dallas_pad", name: "FC Dallas 🇺🇸", ovr: 73, stars: 3, logo: "🔴" },
        { id: "rapids_pad", name: "Colorado Rapids 🇺🇸", ovr: 72, stars: 3, logo: "🍇" },
        { id: "quakes_pad", name: "San Jose Earthquakes 🇺🇸", ovr: 71, stars: 3, logo: "🔵" },
        { id: "whitecaps_pad", name: "Vancouver Whitecaps 🇺🇸", ovr: 73, stars: 3, logo: "🌊" }
      ],
      mls_d2: [
        { id: "rowdies_pad", name: "Tampa Bay Rowdies 🇺🇸", ovr: 65, stars: 2, logo: "🟢" },
        { id: "sacramento_pad", name: "Sacramento Republic FC 🇺🇸", ovr: 64, stars: 2, logo: "🔴" },
        { id: "louisville_pad", name: "Louisville City FC 🇺🇸", ovr: 65, stars: 2, logo: "🟣" },
        { id: "rising_pad", name: "Phoenix Rising FC 🇺🇸", ovr: 64, stars: 2, logo: "🔴" },
        { id: "battery_pad", name: "Charleston Battery 🇺🇸", ovr: 63, stars: 2, logo: "🟡" },
        { id: "eleven_pad", name: "Indy Eleven 🇺🇸", ovr: 62, stars: 2, logo: "🔵" },
        { id: "ocsc_pad", name: "Orange County SC 🇺🇸", ovr: 63, stars: 2, logo: "🟠" },
        { id: "roots_pad", name: "Oakland Roots SC 🇺🇸", ovr: 61, stars: 2, logo: "⬛" }
      ],
      saudi_d1: [
        { id: "riyadh_fc_pad", name: "Al-Riyadh SC 🇸🇦", ovr: 73, stars: 3, logo: "🔴" },
        { id: "khaleej_pad", name: "Al-Khaleej 🇸🇦", ovr: 73, stars: 3, logo: "🟢" },
        { id: "okhdood_pad", name: "Al-Okhdood 🇸🇦", ovr: 71, stars: 3, logo: "🔵" },
        { id: "taawoun_pad", name: "Al-Taawoun 🇸🇦", ovr: 74, stars: 3, logo: "🟡" },
        { id: "fateh_pad", name: "Al-Fateh SC 🇸🇦", ovr: 74, stars: 3, logo: "🔵" },
        { id: "fayha_pad", name: "Al-Fayha 🇸🇦", ovr: 73, stars: 3, logo: "🟠" },
        { id: "raed_pad", name: "Al-Raed 🇸🇦", ovr: 72, stars: 3, logo: "🔴" },
        { id: "wehda_pad", name: "Al-Wehda 🇸🇦", ovr: 72, stars: 3, logo: "🔴" }
      ],
      saudi_d2: [
        { id: "qadsiah_pad", name: "Al-Qadsiah FC 🇸🇦", ovr: 67, stars: 2, logo: "🔴" },
        { id: "faisaly_pad", name: "Al-Faisaly FC 🇸🇦", ovr: 65, stars: 2, logo: "🟤" },
        { id: "kholood_pad", name: "Al-Kholood Club 🇸🇦", ovr: 64, stars: 2, logo: "🟢" },
        { id: "orobah_pad", name: "Al-Orobah FC 🇸🇦", ovr: 64, stars: 2, logo: "🔵" },
        { id: "adalah_pad", name: "Al-Adalah FC 🇸🇦", ovr: 63, stars: 2, logo: "🔵" },
        { id: "batin_pad", name: "Al-Batin FC 🇸🇦", ovr: 64, stars: 2, logo: "🩵" },
        { id: "jabalain_pad", name: "Al-Jabalain FC 🇸🇦", ovr: 63, stars: 2, logo: "🟤" },
        { id: "najma_pad", name: "Al-Najma SC 🇸🇦", ovr: 62, stars: 2, logo: "🟢" }
      ]
    };

    for (const [leagueId, teams] of Object.entries(extraClubs)) {
      if (this.leagues[leagueId]) {
        teams.forEach(t => {
          if (!this.leagues[leagueId].clubs.some(existing => existing.id === t.id)) {
            this.leagues[leagueId].clubs.push(t);
          }
        });
      }
    }
  }

  initLeague(leagueId = "turkey_d2") {
    this.currentLeagueId = leagueId;
    const league = this.leagues[leagueId] || this.leagues["turkey_d2"];

    if (!this.clubSquads || Object.keys(this.clubSquads).length === 0) {
      this.initializeAllClubSquads();
    }

    this.standings = league.clubs.map(c => {
      const squad = this.clubSquads[c.id] || this.generateSquad(c.id, c.ovr);
      this.clubSquads[c.id] = squad;
      return {
        clubId: c.id,
        name: c.name,
        logo: c.logo,
        ovr: c.ovr,
        stars: c.stars,
        played: 0, won: 0, drawn: 0, lost: 0,
        gf: 0, ga: 0, gd: 0, points: 0,
        squad: squad
      };
    });

    this.generateFixtures();
    this.buildSeasonSchedule(window.userCareer && window.userCareer.profile ? window.userCareer.profile : null);
  }

  getCulturalCountry(countryName) {
    if (!countryName) return 'England';
    
    // Check direct key match in window.NATIONAL_NAMES first
    if (window.NATIONAL_NAMES) {
      if (window.NATIONAL_NAMES[countryName]) {
        return countryName;
      }
      const lower = countryName.toLowerCase();
      const foundKey = Object.keys(window.NATIONAL_NAMES).find(
        k => k.toLowerCase() === lower
      );
      if (foundKey) {
        return foundKey;
      }
    }

    const c = String(countryName || '').toLowerCase();
    
    // French Culture
    if (['france', 'belgium', 'dr congo', 'burkina faso', 'guinea', 'mali', 'haiti'].some(eu => c.includes(eu))) {
      return 'France';
    }
    // Portuguese Culture
    if (['portugal', 'angola', 'cape verde'].some(eu => c.includes(eu))) {
      return 'Portugal';
    }
    // 1. English / Anglo-Saxon Culture
    if (['england', 'usa', 'canada', 'australia', 'new zealand', 'scotland', 'wales', 'ireland', 'jamaica'].some(eu => c.includes(eu))) {
      return 'England';
    }
    // 2. Spanish / South American Culture
    if (['spain', 'argentina', 'uruguay', 'colombia', 'mexico', 'chile', 'peru', 'paraguay', 'bolivia', 'venezuela', 'honduras', 'costa rica', 'panama', 'ecuador'].some(eu => c.includes(eu))) {
      return 'Spain';
    }
    // 3. German / Central European Culture
    if (['germany', 'austria', 'switzerland', 'hungary', 'czech republic'].some(eu => c.includes(eu))) {
      return 'Germany';
    }
    // 4. Nordic Culture
    if (['norway', 'sweden', 'denmark', 'finland', 'iceland'].some(eu => c.includes(eu))) {
      return 'Norway';
    }
    // 5. Eastern European Culture
    if (['croatia', 'poland', 'ukraine', 'georgia', 'albania', 'romania', 'greece', 'slovakia', 'slovenia', 'bulgaria', 'serbia'].some(eu => c.includes(eu))) {
      return 'Croatia';
    }
    // 6. African Culture
    if (['senegal', 'ghana', 'nigeria', 'ivory coast', 'cameroon', 'south africa'].some(eu => c.includes(eu))) {
      return 'Senegal';
    }
    // 7. Middle Eastern / Arabic / South Asian Culture
    if (['egypt', 'saudi arabia', 'algeria', 'tunisia', 'iraq', 'uzbekistan', 'india', 'bangladesh', 'pakistan', 'turkey'].some(eu => c.includes(eu))) {
      return 'Egypt';
    }
    
    return 'England'; // Default Fallback
  }

  getSeasonsRemaining(year, compKey, region) {
    if (compKey === 'national_world_cup' || compKey === 'world_cup') {
      const diff = ((year - 2030) % 4 + 4) % 4;
      if (diff === 0) return 0;
      return 4 - diff;
    }
    
    let cycle = 4;
    let startYear = 2028;
    if (region === 'africa') {
      cycle = 2;
      startYear = 2027;
    }
    
    const diff = ((year - startYear) % cycle + cycle) % cycle;
    if (diff === 0) return 0;
    return cycle - diff;
  }

  findCountryForClub(clubId) {
    if (clubId && clubId.startsWith("nat_")) {
      const countryCode = clubId.replace("nat_", "");
      const nat = this.nationalTeams.find(n => n.id === countryCode);
      return nat ? nat.name : "Turkey";
    }
    const leagueId = this.findLeagueForClub(clubId) || "turkey_d2";
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
      saudi_d1: "Egypt", saudi_d2: "Egypt"
    };
    return leagueToCountry[leagueId] || "Turkey";
  }

  initializeAllClubSquads() {
    this.clubSquads = {};
    
    // 1. Generate Club Squads
    Object.values(this.leagues).forEach(lg => {
      lg.clubs.forEach(c => {
        this.clubSquads[c.id] = this.generateSquad(c.id, c.ovr);
      });
    });

    // Inject exactly 30 superstars (OVR 89-95) across elite clubs for the user's ballon d'or and stats competition!
    const bigClubIds = ["realmadrid", "mancity", "barcelona", "bayern", "psg", "arsenal", "liverpool", "juventus", "inter", "milan", "dortmund", "atletico"];
    for (let i = 0; i < 30; i++) {
      const clubId = bigClubIds[i % bigClubIds.length];
      const squad = this.clubSquads[clubId];
      if (squad && squad.length > 0) {
        // Boost one attacking player to be a global Superstar!
        const star = squad.find(pl => ['ST', 'LW', 'RW', 'CAM', 'CM'].includes(pl.position)) || squad[Math.floor(Math.random() * squad.length)];
        if (star) {
          star.ovr = 89 + Math.floor(Math.random() * 6); // 89 to 94 OVR!
          star.age = 20 + Math.floor(Math.random() * 9); // prime ages (20 to 28 y/o)
        }
      }
    }

    // 2. Generate National Team Squads persistently by compiling from club squads!
    this.nationalTeams.forEach(n => {
      this.clubSquads[`nat_${n.id}`] = this.compileNationalSquad(n.name, n.ovr, n.id);
    });
  }

  compileNationalSquad(natName, avgOvr, natId) {
    const positions = ['GK', 'CB', 'CB', 'LB', 'RB', 'CM', 'CM', 'CAM', 'RW', 'LW', 'ST'];
    
    // Gather all club players of this nationality from the global database
    const allClubPlayers = [];
    Object.keys(this.clubSquads).forEach(clubId => {
      if (!clubId.startsWith("nat_")) {
        const squad = this.clubSquads[clubId];
        squad.forEach(pl => {
          if (pl.nationality === natName) {
            allClubPlayers.push(pl);
          }
        });
      }
    });

    const selectedPlayers = [];
    const usedIds = new Set();

    positions.forEach((pos, idx) => {
      // Find eligible club players for this position, sorted by OVR desc
      const candidates = allClubPlayers
        .filter(pl => pl.position === pos && !usedIds.has(pl.id))
        .sort((a, b) => b.ovr - a.ovr);

      if (candidates.length > 0) {
        const chosen = candidates[0];
        selectedPlayers.push(chosen);
        usedIds.add(chosen.id);
      } else {
        // Fallback: If no club player of this position exists, generate a random player of this nationality!
        const culturalCountry = this.getCulturalCountry(natName);
        const firstList = (window.NATIONAL_NAMES && window.NATIONAL_NAMES[culturalCountry]?.first) || ["John"];
        const lastList = (window.NATIONAL_NAMES && window.NATIONAL_NAMES[culturalCountry]?.last) || ["Smith"];
        const fName = firstList[Math.floor(Math.random() * firstList.length)];
        const lName = lastList[Math.floor(Math.random() * lastList.length)];
        const fullName = `${fName} ${lName}`;

        selectedPlayers.push({
          id: `nat_${natId}_p${idx}_fallback`,
          name: fullName,
          position: pos,
          ovr: Math.min(95, Math.max(50, avgOvr + Math.floor(Math.random() * 5) - 2)),
          age: 18 + Math.floor(Math.random() * 16),
          nationality: natName,
          flag: this.nationalTeams.find(n => n.name === natName)?.flag || "🌍",
          stats: {
            season: { goals: 0, assists: 0, matches: 0 },
            league: { goals: 0, assists: 0, matches: 0 },
            cup: { goals: 0, assists: 0, matches: 0 },
            ucl: { goals: 0, assists: 0, matches: 0 }
          }
        });
      }
    });

    return selectedPlayers;
  }

  processRetirementsAndRegens() {
    if (!this.clubSquads) return;
    
    // 1. Age and potentially retire club players (ignore national teams)
    Object.keys(this.clubSquads).forEach(clubId => {
      if (clubId.startsWith("nat_")) return; // Do not age national squads directly!

      const squad = this.clubSquads[clubId];
      const clubMeta = this.findClubById(clubId);
      const avgOvr = clubMeta ? clubMeta.ovr : 75;
      
      squad.forEach((pl, idx) => {
        // Age by 1 year
        pl.age = (pl.age || 22) + 1;
        
        // If older than 39, retire them!
        if (pl.age > 39) {
          // Replace with a fresh young regen (17-19)
          const country = this.findCountryForClub(clubId);
          const culturalCountry = this.getCulturalCountry(country);
          const firstNames = (window.NATIONAL_NAMES && window.NATIONAL_NAMES[culturalCountry]?.first) || window.NATIONAL_NAMES["England"].first;
          const lastNames = (window.NATIONAL_NAMES && window.NATIONAL_NAMES[culturalCountry]?.last) || window.NATIONAL_NAMES["England"].last;
          
          const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
          const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
          
          pl.name = `${fName} ${lName}`;
          pl.age = 17 + Math.floor(Math.random() * 3); // 17 to 19 y/o
          pl.ovr = Math.min(92, Math.max(55, avgOvr - 5 + Math.floor(Math.random() * 11))); // standard dev around club rating
          
          // Reset stats on regen
          pl.stats = {
            season: { goals: 0, assists: 0, matches: 0 },
            league: { goals: 0, assists: 0, matches: 0 },
            cup: { goals: 0, assists: 0, matches: 0 },
            ucl: { goals: 0, assists: 0, matches: 0 }
          };
        }
      });
    });

    // 2. Re-compile all National Team squads persistently from the newly aged club rosters!
    this.nationalTeams.forEach(n => {
      this.clubSquads[`nat_${n.id}`] = this.compileNationalSquad(n.name, n.ovr, n.id);
    });
  }

  distributeMatchStatsToSquad(clubId, goalsScored) {
    const squad = this.clubSquads[clubId];
    if (!squad || squad.length === 0) return;

    // 1. Increment matches played for all players in this squad
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
      tm.stats.league.matches = (tm.stats.league.matches || 0) + 1;
    });

    // 2. Distribute simulated goals and assists
    const pickWeightedScorer = (sq) => {
      const weights = {
        'ST': 40, 'LW': 20, 'RW': 20, 'CAM': 12, 'CM': 6, 'RM': 10, 'LM': 10,
        'CB': 1, 'LB': 2, 'RB': 2, 'LWB': 2, 'RWB': 2
      };
      const candidates = sq.map(pl => ({ pl, w: weights[pl.position] || 5 }));
      const totalWeight = candidates.reduce((sum, cn) => sum + cn.w, 0);
      let rand = Math.random() * totalWeight;
      for (let i = 0; i < candidates.length; i++) {
        rand -= candidates[i].w;
        if (rand <= 0) return candidates[i].pl;
      }
      return sq[0];
    };

    for (let i = 0; i < goalsScored; i++) {
      const scorer = pickWeightedScorer(squad);
      if (scorer) {
        if (!scorer.stats) {
          scorer.stats = {
            season: { goals: 0, assists: 0, matches: 0 },
            league: { goals: 0, assists: 0, matches: 0 },
            cup: { goals: 0, assists: 0, matches: 0 },
            ucl: { goals: 0, assists: 0, matches: 0 }
          };
        }
        scorer.stats.season.goals = (scorer.stats.season.goals || 0) + 1;
        scorer.stats.league.goals = (scorer.stats.league.goals || 0) + 1;
      }

      // 50% chance of assist from teammate
      if (Math.random() < 0.50) {
        const assister = squad.find(pl => pl.name !== (scorer ? scorer.name : '')) || squad[0];
        if (assister) {
          if (!assister.stats) {
            assister.stats = {
              season: { goals: 0, assists: 0, matches: 0 },
              league: { goals: 0, assists: 0, matches: 0 },
              cup: { goals: 0, assists: 0, matches: 0 },
              ucl: { goals: 0, assists: 0, matches: 0 }
            };
          }
          assister.stats.season.assists = (assister.stats.season.assists || 0) + 1;
          assister.stats.league.assists = (assister.stats.league.assists || 0) + 1;
        }
      }
    }
  }

  simulateGlobalGameweek() {
    if (!this.clubSquads) return;
    
    Object.keys(this.clubSquads).forEach(clubId => {
      // Skip teams in active division standings because their stats are already simulated!
      const inStandings = this.standings.some(s => s.clubId === clubId);
      if (inStandings) return;

      const clubMeta = this.findClubById(clubId);
      if (!clubMeta) return;

      // Simulate random goals scored for this simulated matchday (1 to 3 goals)
      const ovrBonus = (clubMeta.ovr - 70) * 0.05;
      const r = Math.random() + ovrBonus;
      const goalsScored = r < 0.25 ? 0 : r < 0.60 ? 1 : r < 0.85 ? 2 : 3;

      this.distributeMatchStatsToSquad(clubId, goalsScored);
    });
  }

  generateSquad(clubId, avgOvr) {
    const positions = ['GK', 'CB', 'CB', 'LB', 'RB', 'CM', 'CM', 'CAM', 'RW', 'LW', 'ST'];
    
    let country = "Turkey";
    let isNationalTeam = false;
    
    if (clubId && clubId.startsWith("nat_")) {
      isNationalTeam = true;
      const countryCode = clubId.replace("nat_", "");
      const nat = this.nationalTeams.find(n => n.id === countryCode || n.name.toLowerCase() === countryCode.toLowerCase());
      if (nat) {
        country = nat.name;
      }
    } else {
      const leagueId = this.findLeagueForClub(clubId) || "turkey_d2";
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
        saudi_d1: "Egypt", saudi_d2: "Egypt"
      };
      country = leagueToCountry[leagueId] || "Turkey";
    }

    const countriesPool = this.nationalTeams.map(n => n.name);

    return positions.map((pos, idx) => {
      let playerCountry = country;
      if (!isNationalTeam) {
        const leagueId = this.findLeagueForClub(clubId) || "turkey_d2";
        const league = this.leagues[leagueId];
        const tier = league ? league.tier : 2;

        if (tier === 1) {
          // Division 1: 25% local, 75% other nationalities
          const isLocal = Math.random() < 0.25;
          if (!isLocal) {
            const otherPool = countriesPool.filter(c => c !== country);
            playerCountry = otherPool[Math.floor(Math.random() * otherPool.length)] || country;
          }
        } else {
          // Division 2: 75% local, 25% other nationalities
          const isLocal = Math.random() < 0.75;
          if (!isLocal) {
            const otherPool = countriesPool.filter(c => c !== country);
            playerCountry = otherPool[Math.floor(Math.random() * otherPool.length)] || country;
          }
        }
      }

      const culturalCountry = this.getCulturalCountry(playerCountry);
      const firstList = (window.NATIONAL_NAMES && window.NATIONAL_NAMES[culturalCountry]?.first) || ["John", "David", "James"];
      const lastList = (window.NATIONAL_NAMES && window.NATIONAL_NAMES[culturalCountry]?.last) || ["Smith", "Jones", "Taylor"];

      const randFirst = firstList[Math.floor(Math.random() * firstList.length)];
      const randLast = lastList[Math.floor(Math.random() * lastList.length)];
      const fullName = `${randFirst} ${randLast}`;
      
      const ovrOffset = Math.floor(Math.random() * 5) - 2;
      const natTeam = this.nationalTeams.find(n => n.name.toLowerCase() === playerCountry.toLowerCase());
      const flag = natTeam ? natTeam.flag : "🌍";

      return {
        id: `${clubId}_p${idx}`,
        name: fullName,
        position: pos,
        ovr: Math.min(95, Math.max(50, avgOvr + ovrOffset)),
        age: 18 + Math.floor(Math.random() * 16), // highly realistic squad ages (18 to 34 y/o)
        nationality: playerCountry,
        flag: flag,
        stats: {
          season: { goals: 0, assists: 0, matches: 0 },
          league: { goals: 0, assists: 0, matches: 0 },
          cup: { goals: 0, assists: 0, matches: 0 },
          ucl: { goals: 0, assists: 0, matches: 0 }
        }
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
    const name = String(nationality || '').toLowerCase();
    const europe = [
      'france', 'england', 'spain', 'portugal', 'netherlands', 'germany', 'belgium',
      'italy', 'croatia', 'denmark', 'switzerland', 'turkey', 'norway', 'sweden', 'ukraine',
      'poland', 'scotland', 'wales', 'austria', 'greece', 'romania', 'czech republic', 'hungary',
      'ireland', 'slovakia', 'slovenia', 'bulgaria', 'serbia', 'georgia', 'albania', 'finland', 'iceland',
      'northern ireland'
    ];
    const americas = [
      'brazil', 'argentina', 'uruguay', 'colombia', 'chile', 'peru', 'paraguay', 'ecuador', 'bolivia', 'venezuela',
      'usa', 'mexico', 'canada', 'jamaica', 'costa rica', 'panama', 'honduras', 'haiti', 'el salvador', 'trinidad & tobago'
    ];
    const africa = [
      'morocco', 'senegal', 'nigeria', 'ghana', 'egypt', 'algeria', 'ivory coast', 'cameroon', 'tunisia', 'mali',
      'south africa', 'dr congo', 'angola', 'burkina faso', 'guinea', 'zambia', 'cape verde'
    ];

    if (europe.includes(name)) return 'europe';
    if (americas.includes(name)) return 'south_america'; // Maps all of North and South America to CONMEBOL for Copa America
    if (africa.includes(name)) return 'africa';
    return 'world';
  }

  getLeagueMeta() {
    return this.leagues[this.currentLeagueId] || this.leagues.turkey_d2;
  }

  findLeagueForClub(clubId) {
    if (!clubId) return null;
    
    // 1. Direct search
    for (const [leagueId, lg] of Object.entries(this.leagues)) {
      if (lg.clubs.some(c => c.id === clubId)) {
        return leagueId;
      }
    }
    
    // 2. Fallback search (strip _pad to recover legacy saves smoothly)
    const cleanId = clubId.replace("_pad", "");
    for (const [leagueId, lg] of Object.entries(this.leagues)) {
      if (lg.clubs.some(c => c.id === cleanId)) {
        return leagueId;
      }
    }
    
    return null;
  }

  findClubById(clubId) {
    if (!clubId) return null;
    for (const lg of Object.values(this.leagues)) {
      const found = lg.clubs.find(c => c.id === clubId);
      if (found) return found;
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

  getUclClubsPool(excludeClubId = null) {
    return this.getTopClubsPool(excludeClubId).filter(c => {
      const lgId = this.findLeagueForClub(c.clubId || c.id);
      const lg = this.leagues[lgId];
      if (!lg) return false;
      const country = String(lg.country || '').toLowerCase();
      // Strictly European countries only! Exclude USA/MLS and Saudi
      return ['turkey', 'england', 'spain', 'italy', 'germany', 'france', 'netherlands', 'portugal', 'scotland', 'belgium', 'greece', 'norway'].some(eu => country.includes(eu));
    });
  }

  getNationalPool(excludeNationality = null, region = null) {
    let pool = this.nationalTeams.filter(n => n.name !== excludeNationality);
    if (region) {
      pool = pool.filter(n => this.getNationRegion(n.name) === region);
    }
    return pool.map(n => ({
      clubId: `nat_${n.id}`,
      name: n.name,
      ovr: n.ovr,
      stars: n.stars || 3,
      logo: n.flag,
      leagueName: 'International'
    })).sort((a, b) => b.ovr - a.ovr);
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
      awayScore: null,
      
      // Preserve custom dynamic tournament fields!
      fixtureId: base.fixtureId,
      isUclPending: base.isUclPending,
      isLeg1: base.isLeg1,
      isLeg2: base.isLeg2,
      roundKey: base.roundKey,
      isFinal: base.isFinal
    };
  }

  buildSeasonSchedule(profile = null) {
    const currentLeague = this.getLeagueMeta();
    const userClubId = profile?.currentClubId || this.standings[0]?.clubId || null;
    const userNationality = profile?.nationality || null;
    const userClub = this.standings.find(s => s.clubId === userClubId) || this.standings[0];
    const entries = [];
    let sortKey = 0;

    const leagueCountry = String(currentLeague.country || '').toLowerCase();
    const europeanLeague = ['turkey', 'england', 'spain', 'italy', 'germany', 'france', 'netherlands', 'portugal', 'scotland', 'belgium', 'greece', 'norway'].some(c => leagueCountry.includes(c));
    const isTier1 = currentLeague.tier === 1;

    // Clear UCL Qualifiers tracking at the start of season
    this.uclQualifiersPoints = 0;
    this.uclQualifiersPlayed = 0;
    this.uclGroupPoints = 0;
    this.uclGroupPlayed = 0;
    this.uclQualified = false;
    this.uclStage = 'qualifiers'; // qualifiers, group, r16, qf, sf, final, none
    this.pendingUclNotice = null;
    
    // Reset Cup tracking
    this.cupStage = 'r16'; // r16, qf, sf, final, none

    // Clear National Team tracking at start of season
    this.natQualPoints = 0;
    this.natQualPlayed = 0;
    this.natGroupPoints = 0;
    this.natGroupPlayed = 0;
    // Keep this.nationalQualified if already set previous season
    if (this.nationalQualified === undefined) {
      this.nationalQualified = false;
    }
    this.natStage = 'qualifiers';

    const leagueToCupName = {
      turkey_d1: "Turkish Cup", turkey_d2: "Turkish Cup",
      england_d1: "FA Cup", england_d2: "FA Cup",
      spain_d1: "Copa del Rey", spain_d2: "Copa del Rey",
      italy_d1: "Coppa Italia", italy_d2: "Coppa Italia",
      germany_d1: "DFB-Pokal", germany_d2: "DFB-Pokal",
      france_d1: "Coupe de France", france_d2: "Coupe de France",
      dutch_d1: "KNVB Beker", dutch_d2: "KNVB Beker",
      portugal_d1: "Taça de Portugal", portugal_d2: "Taça de Portugal",
      mls_d1: "US Open Cup", mls_d2: "US Open Cup",
      saudi_d1: "King Cup", saudi_d2: "King Cup",
      india_d1: "Indian Super Cup",
      brazil_d1: "Copa do Brasil",
      argentina_d1: "Copa Argentina",
      mexico_d1: "Copa MX",
      japan_d1: "Emperor's Cup",
      korea_d1: "Korean FA Cup",
      scotland_d1: "Scottish Cup",
      belgium_d1: "Belgian Cup",
      greece_d1: "Greek Football Cup",
      norway_d1: "Norwegian Cup"
    };
    const currentLeagueId = this.findLeagueForClub(userClubId) || "turkey_d2";
    const cupName = leagueToCupName[currentLeagueId] || "Domestic Cup";

    // Gather all league matches
    const userLeagueFixtures = userClubId
      ? this.fixtures.filter(f => f.home.clubId === userClubId || f.away.clubId === userClubId)
      : this.fixtures.slice(0, (this.standings.length - 1) * 2);

    const totalLeagueMatches = userLeagueFixtures.length || 0;

    // Build the Qualification Matches array if European
    const qualMatches = [];
    if (europeanLeague && userClub) {
      const isDiv1 = currentLeague.tier === 1;
      const numQualifiers = isDiv1 ? 2 : 4;
      
      // Strictly region-lock qualifier pools to European leagues only (No Saudi, no MLS/USA)
      const d1Pool = this.getTopClubsPool(userClubId).filter(c => {
        const lgId = this.findLeagueForClub(c.clubId || c.id);
        const lg = this.leagues[lgId];
        if (!lg) return false;
        const country = String(lg.country || '').toLowerCase();
        return ['turkey', 'england', 'spain', 'italy', 'germany', 'france', 'netherlands', 'portugal', 'scotland', 'belgium', 'greece', 'norway'].some(eu => country.includes(eu));
      });

      const d2Pool = [];
      Object.values(this.leagues).forEach(lg => {
        if (lg.tier === 2) {
          const country = String(lg.country || '').toLowerCase();
          const isEuropean = ['turkey', 'england', 'spain', 'italy', 'germany', 'france', 'netherlands', 'portugal', 'scotland', 'belgium', 'greece', 'norway'].some(eu => country.includes(eu));
          if (isEuropean) {
            lg.clubs.forEach(c => {
              if (c.id !== userClubId) d2Pool.push(c);
            });
          }
        }
      });

      const pickedD1 = this.pickUnique(d1Pool, 2);
      const pickedD2 = this.pickUnique(d2Pool, 2);

      const qualOpps = [];
      if (isDiv1) {
        qualOpps.push({ club: pickedD1[0] || d1Pool[0], tier: 1 });
        qualOpps.push({ club: pickedD2[0] || d2Pool[0], tier: 2 });
      } else {
        qualOpps.push({ club: pickedD2[0] || d2Pool[0], tier: 2 });
        qualOpps.push({ club: pickedD2[1] || d2Pool[1] || d2Pool[0], tier: 2 });
        qualOpps.push({ club: pickedD1[0] || d1Pool[0], tier: 1 });
        qualOpps.push({ club: pickedD1[1] || d1Pool[1] || d1Pool[0], tier: 1 });
      }

      qualOpps.forEach((q, idx) => {
        qualMatches.push(this.createScheduleEntry({
          id: `ucl_qual_${idx + 1}`,
          sortKey: 0,
          competitionKey: 'ucl_qual',
          competitionName: 'Champions League Qualifiers',
          stageLabel: 'Qualifying Round',
          matchLabel: `UCL Qualifier ${idx + 1}/${numQualifiers}`,
          matchContext: `UEFA Champions League Qualifiers - Match ${idx + 1}`,
          participantType: 'club',
          participantId: userClubId,
          userSide: idx % 2 === 0 ? 'home' : 'away',
          home: idx % 2 === 0 ? userClub : q.club,
          away: idx % 2 === 0 ? q.club : userClub,
          displayHomeName: idx % 2 === 0 ? userClub.name : q.club.name,
          displayAwayName: idx % 2 === 0 ? q.club.name : userClub.name,
          week: 0
        }));
      });
    }

    // Build first round of Domestic Cup (Group Stage!)
    // Spliced into the interspersed calendar as three spaced group games!
    const domesticPool = this.standings.filter(c => c.clubId !== userClubId);
    const cupGroupMatches = [];
    for (let i = 0; i < 3; i++) {
      const cupOpponent = domesticPool[Math.floor(Math.random() * domesticPool.length)] || this.standings[0];
      cupGroupMatches.push(this.createScheduleEntry({
        id: `cup_group_${i + 1}`,
        sortKey: 0,
        competitionKey: 'cup_qual',
        competitionName: cupName,
        stageLabel: 'Group Stage',
        matchLabel: `${cupName} Group Match ${i + 1}/3`,
        matchContext: `${cupName} - Group Stage Matchday ${i + 1}`,
        participantType: 'club',
        participantId: userClubId,
        userSide: i % 2 === 0 ? 'home' : 'away',
        home: i % 2 === 0 ? userClub : cupOpponent,
        away: i % 2 === 0 ? cupOpponent : userClub,
        displayHomeName: i % 2 === 0 ? userClub.name : cupOpponent.name,
        displayAwayName: i % 2 === 0 ? cupOpponent.name : userClub.name,
        week: 0
      }));
    }

    // Intersperse qualifiers, cup group matches, and league matches chronologically!
    let qualIdx = 0;
    let leagueIdx = 0;
    let cupGroupIdx = 0;
    const totalWeeks = totalLeagueMatches + qualMatches.length + 3; // league + qualifiers + 3 cup matches

    for (let w = 1; w <= totalWeeks; w++) {
      let isQualWeek = false;
      if (isTier1) {
        isQualWeek = (w === 1 || w === 3) && (qualIdx < qualMatches.length);
      } else {
        isQualWeek = (w === 1 || w === 3 || w === 5 || w === 7) && (qualIdx < qualMatches.length);
      }

      // Schedule Cup Group matches at weeks 9, 13, and 17 (spaced out nicely!)
      const isCupWeek = (w === 9 || w === 13 || w === 17) && (cupGroupIdx < 3);

      if (isQualWeek) {
        const qMatch = qualMatches[qualIdx++];
        qMatch.week = w;
        qMatch.sortKey = sortKey++;
        entries.push(qMatch);
      } else if (isCupWeek) {
        const cMatch = cupGroupMatches[cupGroupIdx++];
        cMatch.week = w;
        cMatch.sortKey = sortKey++;
        entries.push(cMatch);
      } else if (leagueIdx < userLeagueFixtures.length) {
        const fix = userLeagueFixtures[leagueIdx++];
        entries.push(this.createScheduleEntry({
          id: `league_${fix.id}`,
          sortKey: sortKey++,
          competitionKey: 'league',
          competitionName: currentLeague.name,
          stageLabel: 'League Match',
          matchLabel: `League Match ${leagueIdx}/${totalLeagueMatches}`,
          matchContext: `${currentLeague.name} Matchday ${fix.week}`,
          participantType: 'club',
          participantId: userClubId,
          userSide: fix.home.clubId === userClubId ? 'home' : 'away',
          home: fix.home,
          away: fix.away,
          displayHomeName: fix.home.name,
          displayAwayName: fix.away.name,
          week: w,
          fixtureId: fix.id
        }));
      }
    }

    // 4. National Team games (ONLY if player is called up!)
    if (profile?.isNationalTeamCalledUp && userNationality) {
      let year = 2026;
      if (window.userCareer && window.userCareer.stats && window.userCareer.stats.season) {
        year = window.userCareer.stats.season.year;
      } else if (profile?.stats?.season?.year) {
        year = profile.stats.season.year;
      }
      const region = this.getNationRegion(userNationality);

      // Is it a World Cup tournament year? (2030, 2034, 2038, 2042...)
      const isWcTournament = (year - 2030) % 4 === 0;
      // Is it a World Cup qualifier year? (2029, 2033, 2037, 2041...)
      const isWcQualifier = (year - 2029) % 4 === 0;

      // Continental tournament schedules:
      let isContTournament = false;
      let isContQualifier = false;
      let contName = "Continental Cup";

      if (region === 'europe') {
        contName = "Euro Cup";
        isContTournament = (year - 2028) % 4 === 0; // 2028, 2032, 2036...
        isContQualifier = (year - 2027) % 4 === 0;  // 2027, 2031, 2035...
      } else if (region === 'south_america' || region === 'world') { 
        contName = "Copa America";
        isContTournament = (year - 2028) % 4 === 0; // 2028, 2032, 2036...
        isContQualifier = (year - 2027) % 4 === 0;  // 2027, 2031, 2035...
      } else {
        // Africa / AFCON is every 2 years
        contName = "AFCON";
        isContTournament = (year - 2027) % 2 === 0; // 2027, 2029, 2031...
        isContQualifier = (year - 2026) % 2 === 0;  // 2026, 2028, 2030...
      }
      
      if (isWcTournament) {
        // World Cup year! If we qualified, schedule World Cup Group stage
        if (this.nationalQualified === undefined || this.nationalQualified === null) {
          this.nationalQualified = true; // Auto-qualify for starting season tournaments!
        }
        if (this.nationalQualified) {
          const natPool = this.getNationalPool(userNationality); // All regions
          const worldCupOpps = this.pickUnique(natPool, 3);
          
          // Initialize Group Standings persistently!
          this.natGroupStandings = [
            { name: userNationality, logo: '🌍', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0, isUser: true },
            ...worldCupOpps.map(opp => ({ name: opp.name, logo: opp.logo || '🌍', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0, isUser: false }))
          ];

          worldCupOpps.forEach((opponent, idx) => {
            entries.push(this.createScheduleEntry({
              id: `world_cup_group_${idx + 1}`,
              sortKey: sortKey++,
              competitionKey: 'national_world_cup',
              competitionName: 'World Cup',
              stageLabel: 'Group Stage',
              matchLabel: `World Cup Group Match ${idx + 1}/3`,
              matchContext: `FIFA World Cup - Group Stage Matchday ${idx + 1}`,
              participantType: 'national',
              participantId: userNationality,
              userSide: 'home',
              home: { clubId: `nat_${userNationality}`, name: userNationality, ovr: profile?.ovr || 72, stars: 5, logo: '🌍' },
              away: opponent,
              displayHomeName: userNationality,
              displayAwayName: opponent.name,
              week: 0
            }));
          });
        }
      } else if (isContTournament) {
        // Continental Tournament Year! (Euros, Copa America, or AFCON)
        if (this.nationalQualified === undefined || this.nationalQualified === null) {
          this.nationalQualified = true; // Auto-qualify for starting season tournaments!
        }
        if (this.nationalQualified) {
          const natPool = this.getNationalPool(userNationality, region); // strictly region locked opponents!
          const cupOpps = this.pickUnique(natPool, 3);
          
          // Initialize Group Standings persistently!
          this.natGroupStandings = [
            { name: userNationality, logo: '🌍', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0, isUser: true },
            ...cupOpps.map(opp => ({ name: opp.name, logo: opp.logo || '🌍', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0, isUser: false }))
          ];

          cupOpps.forEach((opponent, idx) => {
            entries.push(this.createScheduleEntry({
              id: `euro_group_${idx + 1}`,
              sortKey: sortKey++,
              competitionKey: 'national_euro',
              competitionName: contName,
              stageLabel: 'Group Stage',
              matchLabel: `${contName} Group Match ${idx + 1}/3`,
              matchContext: `${contName} - Group Stage Matchday ${idx + 1}`,
              participantType: 'national',
              participantId: userNationality,
              userSide: 'home',
              home: { clubId: `nat_${userNationality}`, name: userNationality, ovr: profile?.ovr || 72, stars: 5, logo: '🌍' },
              away: opponent,
              displayHomeName: userNationality,
              displayAwayName: opponent.name,
              week: 0
            }));
          });
        }
      } else if (isWcQualifier) {
        // World Cup Qualification year! 
        const natPool = this.getNationalPool(userNationality);
        const qualOpps = this.pickUnique(natPool, 3);
        this.natQualPoints = 0;
        this.natQualPlayed = 0;

        const qualMatches = [];
        qualOpps.forEach((opponent, idx) => {
          qualMatches.push(this.createScheduleEntry({
            id: `nat_qual_${idx + 1}`,
            sortKey: sortKey++,
            competitionKey: 'national_qual',
            competitionName: 'World Cup Qualifiers',
            stageLabel: 'Qualifying Round',
            matchLabel: `World Cup Qualifier ${idx + 1}/3`,
            matchContext: `FIFA World Cup Qualifiers - Matchday ${idx + 1}`,
            participantType: 'national',
            participantId: userNationality,
            userSide: 'home',
            home: { clubId: `nat_${userNationality}`, name: userNationality, ovr: profile?.ovr || 72, stars: 5, logo: '🌍' },
            away: opponent,
            displayHomeName: userNationality,
            displayAwayName: opponent.name,
            week: 0
          }));
        });

        this.seasonSchedule = entries;
        this.insertNationalQualifiers(qualMatches);
        return this.seasonSchedule;
      } else if (isContQualifier) {
        // Continental Qualification year! (Euros, Copa, AFCON Qualifiers)
        const natPool = this.getNationalPool(userNationality, region);
        const qualOpps = this.pickUnique(natPool, 3);
        const compLabel = `${contName} Qualifiers`;
        this.natQualPoints = 0;
        this.natQualPlayed = 0;

        const qualMatches = [];
        qualOpps.forEach((opponent, idx) => {
          qualMatches.push(this.createScheduleEntry({
            id: `nat_qual_${idx + 1}`,
            sortKey: sortKey++,
            competitionKey: 'national_qual',
            competitionName: compLabel,
            stageLabel: 'Qualifying Round',
            matchLabel: `${contName} Qualifier ${idx + 1}/3`,
            matchContext: `${compLabel} - Matchday ${idx + 1}`,
            participantType: 'national',
            participantId: userNationality,
            userSide: 'home',
            home: { clubId: `nat_${userNationality}`, name: userNationality, ovr: profile?.ovr || 72, stars: 5, logo: '🌍' },
            away: opponent,
            displayHomeName: userNationality,
            displayAwayName: opponent.name,
            week: 0
          }));
        });

        this.seasonSchedule = entries;
        this.insertNationalQualifiers(qualMatches);
        return this.seasonSchedule;
      }
    }

    this.seasonSchedule = entries;
    this.reorderSeasonSchedule();
    return entries;
  }

  insertNationalQualifiers(qualMatches) {
    if (!qualMatches || qualMatches.length === 0) return;
    
    const newSchedule = [];
    let leagueCount = 0;
    let qualIdx = 0;
    
    this.seasonSchedule.forEach(entry => {
      newSchedule.push(entry);
      if (entry.competitionKey === 'league' && !entry.played) {
        leagueCount++;
        if (leagueCount === 6 && qualIdx < qualMatches.length) {
          const m = qualMatches[qualIdx++];
          m.sortKey = entry.sortKey + 0.5;
          newSchedule.push(m);
        } else if (leagueCount === 16 && qualIdx < qualMatches.length) {
          const m = qualMatches[qualIdx++];
          m.sortKey = entry.sortKey + 0.5;
          newSchedule.push(m);
        } else if (leagueCount === 26 && qualIdx < qualMatches.length) {
          const m = qualMatches[qualIdx++];
          m.sortKey = entry.sortKey + 0.5;
          newSchedule.push(m);
        }
      }
    });

    while (qualIdx < qualMatches.length) {
      const m = qualMatches[qualIdx++];
      m.sortKey = 9999 + qualIdx;
      newSchedule.push(m);
    }

    this.seasonSchedule = newSchedule;
    this.reorderSeasonSchedule();
  }

  reorderSeasonSchedule() {
    this.seasonSchedule.sort((a, b) => a.sortKey - b.sortKey);
    this.seasonSchedule.forEach((entry, idx) => {
      entry.week = idx + 1;
      entry.sortKey = idx;
    });
  }

  insertUclGroupStage(userClubId, userClub) {
    const pool = this.getUclClubsPool(userClubId);
    const opponents = this.pickUnique(pool, 6);
    const newSchedule = [];
    let leagueCount = 0;
    let uclIdx = 0;

    this.seasonSchedule.forEach(entry => {
      newSchedule.push(entry);
      if (entry.competitionKey === 'league' && !entry.played) {
        leagueCount++;
        // Intersperse Group stage matches by putting 1 match after every 4 unplayed league matches!
        if (leagueCount % 4 === 0 && uclIdx < 6) {
          const opponent = opponents[uclIdx];
          newSchedule.push(this.createScheduleEntry({
            id: `ucl_group_${uclIdx + 1}`,
            sortKey: entry.sortKey + 0.5,
            competitionKey: 'ucl',
            competitionName: 'Champions League',
            stageLabel: 'Group Stage',
            matchLabel: `UCL Group Match ${uclIdx + 1}/6`,
            matchContext: `UEFA Champions League Group Stage - Matchday ${uclIdx + 1}`,
            participantType: 'club',
            participantId: userClubId,
            userSide: uclIdx % 2 === 0 ? 'home' : 'away',
            home: uclIdx % 2 === 0 ? userClub : opponent,
            away: uclIdx % 2 === 0 ? opponent : userClub,
            displayHomeName: uclIdx % 2 === 0 ? userClub.name : opponent.name,
            displayAwayName: uclIdx % 2 === 0 ? opponent.name : userClub.name,
            week: 0
          }));
          uclIdx++;
        }
      }
    });

    while (uclIdx < 6) {
      const opponent = opponents[uclIdx];
      newSchedule.push(this.createScheduleEntry({
        id: `ucl_group_${uclIdx + 1}`,
        sortKey: 999 + uclIdx,
        competitionKey: 'ucl',
        competitionName: 'Champions League',
        stageLabel: 'Group Stage',
        matchLabel: `UCL Group Match ${uclIdx + 1}/6`,
        matchContext: `UEFA Champions League Group Stage - Matchday ${uclIdx + 1}`,
        participantType: 'club',
        participantId: userClubId,
        userSide: uclIdx % 2 === 0 ? 'home' : 'away',
        home: uclIdx % 2 === 0 ? userClub : opponent,
        away: uclIdx % 2 === 0 ? opponent : userClub,
        displayHomeName: uclIdx % 2 === 0 ? userClub.name : opponent.name,
        displayAwayName: uclIdx % 2 === 0 ? opponent.name : userClub.name,
        week: 0
      }));
      uclIdx++;
    }

    this.seasonSchedule = newSchedule;
    this.reorderSeasonSchedule();
  }

  insertUclKnockoutRound(roundKey, roundLabel, oppIdx) {
    const userClubId = window.userCareer?.profile?.currentClubId;
    const userClub = this.standings.find(s => s.clubId === userClubId) || this.standings[0];
    
    // Pick a completely random opponent from the European UCL pool!
    const pool = this.getUclClubsPool(userClubId).filter(c => c.id !== userClubId && c.clubId !== userClubId);
    pool.sort(() => Math.random() - 0.5);
    const opponent = pool[Math.floor(Math.random() * pool.length)] || pool[0];

    const newSchedule = [];
    let leagueCount = 0;
    let legsInserted = 0;

    this.seasonSchedule.forEach(entry => {
      newSchedule.push(entry);
      if (entry.competitionKey === 'league' && !entry.played) {
        leagueCount++;
        // Insert 1st Leg after 2 unplayed league matches
        if (leagueCount === 2 && legsInserted === 0) {
          newSchedule.push(this.createScheduleEntry({
            id: `ucl_${roundKey}_leg1`,
            sortKey: entry.sortKey + 0.5,
            competitionKey: 'ucl',
            competitionName: 'Champions League',
            stageLabel: roundLabel,
            matchLabel: `UCL ${roundLabel} - 1st Leg`,
            matchContext: `UEFA Champions League ${roundLabel} - 1st Leg (Away)`,
            participantType: 'club',
            participantId: userClubId,
            userSide: 'away',
            home: opponent,
            away: userClub,
            displayHomeName: opponent.name,
            displayAwayName: userClub.name,
            week: 0,
            roundKey: roundKey,
            isLeg1: true
          }));
          legsInserted = 1;
        }
        // Insert 2nd Leg after 5 unplayed league matches
        if (leagueCount === 5 && legsInserted === 1) {
          newSchedule.push(this.createScheduleEntry({
            id: `ucl_${roundKey}_leg2`,
            sortKey: entry.sortKey + 0.5,
            competitionKey: 'ucl',
            competitionName: 'Champions League',
            stageLabel: roundLabel,
            matchLabel: `UCL ${roundLabel} - 2nd Leg`,
            matchContext: `UEFA Champions League ${roundLabel} - 2nd Leg (Home)`,
            participantType: 'club',
            participantId: userClubId,
            userSide: 'home',
            home: userClub,
            away: opponent,
            displayHomeName: userClub.name,
            displayAwayName: opponent.name,
            week: 0,
            roundKey: roundKey,
            isLeg2: true
          }));
          legsInserted = 2;
        }
      }
    });

    if (legsInserted < 1) {
      newSchedule.push(this.createScheduleEntry({
        id: `ucl_${roundKey}_leg1`,
        sortKey: 998,
        competitionKey: 'ucl',
        competitionName: 'Champions League',
        stageLabel: roundLabel,
        matchLabel: `UCL ${roundLabel} - 1st Leg`,
        matchContext: `UEFA Champions League ${roundLabel} - 1st Leg (Away)`,
        participantType: 'club',
        participantId: userClubId,
        userSide: 'away',
        home: opponent,
        away: userClub,
        displayHomeName: opponent.name,
        displayAwayName: userClub.name,
        week: 0,
        roundKey: roundKey,
        isLeg1: true
      }));
    }
    if (legsInserted < 2) {
      newSchedule.push(this.createScheduleEntry({
        id: `ucl_${roundKey}_leg2`,
        sortKey: 999,
        competitionKey: 'ucl',
        competitionName: 'Champions League',
        stageLabel: roundLabel,
        matchLabel: `UCL ${roundLabel} - 2nd Leg`,
        matchContext: `UEFA Champions League ${roundLabel} - 2nd Leg (Home)`,
        participantType: 'club',
        participantId: userClubId,
        userSide: 'home',
        home: userClub,
        away: opponent,
        displayHomeName: userClub.name,
        displayAwayName: opponent.name,
        week: 0,
        roundKey: roundKey,
        isLeg2: true
      }));
    }

    this.seasonSchedule = newSchedule;
    this.reorderSeasonSchedule();
  }

  insertUclFinal() {
    const userClubId = window.userCareer?.profile?.currentClubId;
    const userClub = this.standings.find(s => s.clubId === userClubId) || this.standings[0];
    const pool = this.getUclClubsPool(userClubId).filter(c => c.clubId !== userClubId && c.id !== userClubId);
    pool.sort(() => Math.random() - 0.5);
    const opponent = pool[Math.floor(Math.random() * pool.length)] || pool[0];

    const newSchedule = [...this.seasonSchedule];
    newSchedule.push(this.createScheduleEntry({
      id: `ucl_final`,
      sortKey: 9999,
      competitionKey: 'ucl',
      competitionName: 'Champions League',
      stageLabel: 'Final',
      matchLabel: 'UCL Final',
      matchContext: 'UEFA Champions League Final - Neutral Stadium',
      participantType: 'club',
      participantId: userClubId,
      userSide: 'home',
      home: userClub,
      away: opponent,
      displayHomeName: userClub.name,
      displayAwayName: opponent.name,
      week: 0,
      isFinal: true
    }));

    this.seasonSchedule = newSchedule;
    this.reorderSeasonSchedule();
  }

  insertNationalKnockoutRound(roundKey, roundLabel) {
    const userNationality = window.userCareer?.profile?.nationality;
    if (!userNationality) return;

    const region = this.getNationRegion(userNationality);
    const natPool = this.getNationalPool(userNationality, region);
    // Shuffle and pick a completely random opponent from the entire national pool!
    natPool.sort(() => Math.random() - 0.5);
    const opponent = natPool[Math.floor(Math.random() * natPool.length)] || natPool[0];

    let year = 2026;
    if (window.userCareer && window.userCareer.stats && window.userCareer.stats.season) {
      year = window.userCareer.stats.season.year;
    }
    const isWcYear = (year - 2030) % 4 === 0;

    let nationalCompetition = "World Cup";
    if (!isWcYear) {
      nationalCompetition = region === 'europe' ? 'Euro Cup' : (region === 'south_america' ? 'Copa America' : 'AFCON');
    }

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

  insertCupRound(roundKey, roundLabel) {
    const userClubId = window.userCareer?.profile?.currentClubId;
    const userClub = this.standings.find(s => s.clubId === userClubId) || this.standings[0];
    
    // Pick a completely random opponent from the domestic standings!
    const others = this.standings.filter(c => c.clubId !== userClubId);
    let cupOpponent = others[Math.floor(Math.random() * others.length)] || this.standings[0];

    const currentLeagueId = this.findLeagueForClub(userClubId) || "turkey_d2";
    const leagueToCupName = {
      turkey_d1: "Turkish Cup", turkey_d2: "Turkish Cup",
      england_d1: "FA Cup", england_d2: "FA Cup",
      spain_d1: "Copa del Rey", spain_d2: "Copa del Rey",
      italy_d1: "Coppa Italia", italy_d2: "Coppa Italia",
      germany_d1: "DFB-Pokal", germany_d2: "DFB-Pokal",
      france_d1: "Coupe de France", france_d2: "Coupe de France",
      dutch_d1: "KNVB Beker", dutch_d2: "KNVB Beker",
      portugal_d1: "Taça de Portugal", portugal_d2: "Taça de Portugal",
      mls_d1: "US Open Cup", mls_d2: "US Open Cup",
      saudi_d1: "King Cup", saudi_d2: "King Cup",
      india_d1: "Indian Super Cup",
      brazil_d1: "Copa do Brasil",
      argentina_d1: "Copa Argentina",
      mexico_d1: "Copa MX",
      japan_d1: "Emperor's Cup",
      korea_d1: "Korean FA Cup",
      scotland_d1: "Scottish Cup",
      belgium_d1: "Belgian Cup",
      greece_d1: "Greek Football Cup",
      norway_d1: "Norwegian Cup"
    };
    const cupName = leagueToCupName[currentLeagueId] || "Domestic Cup";

    const newSchedule = [];
    let leagueCount = 0;
    let cupInserted = false;

    this.seasonSchedule.forEach(entry => {
      newSchedule.push(entry);
      if (entry.competitionKey === 'league' && !entry.played) {
        leagueCount++;
        if (roundKey !== 'final' && leagueCount === 4 && !cupInserted) {
          newSchedule.push(this.createScheduleEntry({
            id: `cup_${roundKey}`,
            sortKey: entry.sortKey + 0.5,
            competitionKey: 'cup',
            competitionName: cupName,
            stageLabel: roundLabel,
            matchLabel: `${cupName} ${roundLabel}`,
            matchContext: `${cupName} - ${roundLabel} Knockout`,
            participantType: 'club',
            participantId: userClubId,
            userSide: 'home',
            home: userClub,
            away: cupOpponent,
            displayHomeName: userClub.name,
            displayAwayName: cupOpponent.name,
            week: 0
          }));
          cupInserted = true;
        }
      }
    });

    if (roundKey === 'final' || !cupInserted) {
      newSchedule.push(this.createScheduleEntry({
        id: `cup_${roundKey}`,
        sortKey: roundKey === 'final' ? 9998 : 998,
        competitionKey: 'cup',
        competitionName: cupName,
        stageLabel: roundLabel,
        matchLabel: `${cupName} ${roundLabel}`,
        matchContext: `${cupName} - ${roundLabel} Knockout`,
        participantType: 'club',
        participantId: userClubId,
        userSide: 'home',
        home: userClub,
        away: cupOpponent,
        displayHomeName: userClub.name,
        displayAwayName: cupOpponent.name,
        week: 0
      }));
    }

    this.seasonSchedule = newSchedule;
    this.reorderSeasonSchedule();
  }

  processUclQualificationResult(profile, points) {
    const currentLeague = this.getLeagueMeta();
    const isDiv1 = currentLeague.tier === 1;
    const userClubId = profile?.currentClubId || this.standings[0]?.clubId || null;
    const userClub = this.standings.find(s => s.clubId === userClubId) || this.standings[0];
    let qualified = false;

    if (isDiv1) {
      if (points >= 4) {
        qualified = true;
      } else if (points === 3) {
        qualified = Math.random() < 0.5;
      }
    } else {
      qualified = [12, 10, 7, 6].includes(points);
    }

    this.uclQualified = qualified;

    if (qualified) {
      this.uclStage = 'group';
      this.insertUclGroupStage(userClubId, userClub);
      return {
        success: true,
        title: "🎉 UCL Group Stage Qualified!",
        body: `Incredible performance! Your team finished the qualifiers with <strong>${points} points</strong> and has secured a spot in the UEFA Champions League Group Stage!`
      };
    } else {
      this.uclStage = 'none';
      return {
        success: false,
        title: "❌ UCL Qualification Failed",
        body: `With only <strong>${points} points</strong> in the qualifiers, your team has failed to reach the Champions League group stage this season. Focus on winning the league!`
      };
    }
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
    // Return the absolute first unplayed match chronologically in your season schedule
    const matches = (this.seasonSchedule || []).filter(g => {
      if (g.played) return false;
      const isUserClub = g.participantId === userClubId;
      const isUserNat = g.participantId === userNationality && userNationality !== null;
      return isUserClub || isUserNat;
    }).sort((a, b) => a.sortKey - b.sortKey);

    return matches[0] || null;
  }

  simulateGameweek(userClubId, userMatchScore = null, eventContext = null, userNationality = null) {
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

      let won = uGoals > oGoals;
      const drew = uGoals === oGoals;
      let wonOnPenalties = userMatchScore ? userMatchScore.wonOnPenalties : false;
      let lostOnPenalties = userMatchScore ? userMatchScore.lostOnPenalties : false;

      if (wonOnPenalties) won = true;

      // single-leg knockouts and finals cannot end in a draw! Simulate a Penalty Shootout (if simulated in background for non-user)
      const isKnockoutFinal = currentFix.isFinal || currentFix.stageLabel === 'Final' || currentFix.id.includes('final') || currentFix.competitionKey === 'cup' || currentFix.competitionKey === 'national_knockout';
      if (drew && isKnockoutFinal && !wonOnPenalties && !lostOnPenalties) {
        if (Math.random() < 0.5) {
          won = true;
          wonOnPenalties = true;
        } else {
          lostOnPenalties = true;
        }
      }

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
          let extraBody = "";
          const gbResult = window.userCareer?.checkGoldenBoot('ucl');
          if (gbResult && gbResult.won) {
            if (window.userCareer?.profile?.trophies) {
              window.userCareer.profile.trophies.golden_boot = (window.userCareer.profile.trophies.golden_boot || 0) + 1;
              if (!window.userCareer.profile.awardsCabinet.goldenBoots) {
                window.userCareer.profile.awardsCabinet.goldenBoots = { league: 0, cup: 0, ucl: 0, international: 0 };
              }
              window.userCareer.profile.awardsCabinet.goldenBoots.ucl = (window.userCareer.profile.awardsCabinet.goldenBoots.ucl || 0) + 1;
            }
            extraBody = `<br><br>⚽ <strong>CHAMPIONS LEAGUE GOLDEN BOOT WINNER!</strong> You are the top goalscorer of the Champions League this season with an amazing <strong>${gbResult.userGoals} goals</strong>!`;
          }

          if (won) {
            if (window.userCareer?.profile?.trophies) {
              window.userCareer.profile.trophies.continental = (window.userCareer.profile.trophies.continental || 0) + 1;
              if (!window.userCareer.profile.awardsCabinet.championsLeagues) {
                window.userCareer.profile.awardsCabinet.championsLeagues = [];
              }
              window.userCareer.profile.awardsCabinet.championsLeagues.push(`${window.userCareer.stats.season.year} UEFA Champions League`);
            }
            this.pendingUclNotice = {
              success: true,
              title: "🏆 CHAMPIONS OF EUROPE!!!",
              body: (wonOnPenalties
                ? `HISTORIC TRIUMPH! Your team has defeated ${oppName} on Penalties (<strong>${uGoals}-${oGoals} FT, 4-3 Pens</strong>) in the UEFA Champions League Final! You lift the most prestigious club trophy in the world!`
                : `HISTORIC TRIUMPH! Your team has defeated ${oppName} (<strong>${uGoals} - ${oGoals}</strong>) in the UEFA Champions League Final! You lift the most prestigious club trophy in the world!`) + extraBody
            };
          } else {
            this.pendingUclNotice = {
              success: false,
              title: "🥈 UCL Final Runner-Up",
              body: (lostOnPenalties
                ? `Heartbreak! Your team fought courageously but was defeated by ${oppName} on Penalties (<strong>${uGoals}-${oGoals} FT, 3-4 Pens</strong>) in the Champions League Final.`
                : `Heartbreak! Your team fought bravely but was defeated by ${oppName} (<strong>${oGoals} - ${uGoals}</strong>) in the Champions League Final.`) + extraBody
            };
          }
        }
      }

      // 3. Domestic Cup Group Stage Qualifiers (Self-healing stageLabel check for total compatibility!)
      if (currentFix.stageLabel === 'Group Stage' && (currentFix.competitionKey === 'cup_qual' || currentFix.competitionKey === 'cup')) {
        this.cupGroupPoints = (this.cupGroupPoints || 0) + pts;
        this.cupGroupPlayed = (this.cupGroupPlayed || 0) + 1;

        if (this.cupGroupPlayed === 3) {
          if (this.cupGroupPoints >= 5) {
            this.cupStage = 'r16';
            this.insertCupRound('r16', 'Round of 16');
            this.pendingUclNotice = {
              success: true,
              title: `🎉 ${currentFix.competitionName} Group Stage Passed!`,
              body: `Superb! Your team finished the Cup Group Stage with <strong>${this.cupGroupPoints} points</strong> and has successfully qualified for the Round of 16 Knockouts! Check your calendar for the new fixtures.`
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

      // 4. Domestic Cup Knockouts (Ensure we only process knockouts, not group stage matches!)
      if (currentFix.competitionKey === 'cup' && currentFix.stageLabel !== 'Group Stage') {
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
            let extraBody = "";
            const gbResult = window.userCareer?.checkGoldenBoot('cup');
            if (gbResult && gbResult.won) {
              if (window.userCareer?.profile?.trophies) {
                window.userCareer.profile.trophies.golden_boot = (window.userCareer.profile.golden_boot || 0) + 1;
                if (!window.userCareer.profile.awardsCabinet.goldenBoots) {
                  window.userCareer.profile.awardsCabinet.goldenBoots = { league: 0, cup: 0, ucl: 0, international: 0 };
                }
                window.userCareer.profile.awardsCabinet.goldenBoots.cup = (window.userCareer.profile.awardsCabinet.goldenBoots.cup || 0) + 1;
              }
              extraBody = `<br><br>⚽ <strong>${currentFix.competitionName.toUpperCase()} GOLDEN BOOT WINNER!</strong> You are the top goalscorer of the tournament this season with <strong>${gbResult.userGoals} goals</strong>!`;
            }

            if (window.userCareer?.profile?.trophies) {
              window.userCareer.profile.trophies.cup = (window.userCareer.profile.trophies.cup || 0) + 1;
              if (!window.userCareer.profile.awardsCabinet.domesticCups) {
                window.userCareer.profile.awardsCabinet.domesticCups = [];
              }
              window.userCareer.profile.awardsCabinet.domesticCups.push(`${window.userCareer.stats.season.year} ${currentFix.competitionName}`);
            }
            this.pendingUclNotice = {
              success: true,
              title: `🏆 ${currentFix.competitionName} CHAMPIONS!!!`,
              body: `HISTORIC TRIUMPH! Your team has defeated ${oppName} (<strong>${uGoals} - ${oGoals}</strong>) in the ${currentFix.competitionName} Final! You lift the domestic cup trophy and earn legendary status!` + extraBody
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

        // Update Group Standings persistently!
        const homeTeam = this.natGroupStandings?.find(t => t.name === currentFix.displayHomeName);
        const awayTeam = this.natGroupStandings?.find(t => t.name === currentFix.displayAwayName);
        if (homeTeam && awayTeam) {
          homeTeam.played += 1; awayTeam.played += 1;
          homeTeam.gf += currentFix.homeScore; homeTeam.ga += currentFix.awayScore; homeTeam.gd = homeTeam.gf - homeTeam.ga;
          awayTeam.gf += currentFix.awayScore; awayTeam.ga += currentFix.homeScore; awayTeam.gd = awayTeam.gf - awayTeam.ga;
          
          if (currentFix.homeScore > currentFix.awayScore) {
            homeTeam.won += 1; homeTeam.points += 3; awayTeam.lost += 1;
          } else if (currentFix.awayScore > currentFix.homeScore) {
            awayTeam.won += 1; awayTeam.points += 3; homeTeam.lost += 1;
          } else {
            homeTeam.drawn += 1; homeTeam.points += 1; awayTeam.drawn += 1; awayTeam.points += 1;
          }
          this.natGroupStandings.sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);
        }

        if (this.natGroupPlayed === 3) {
          const compName = currentFix.competitionName;
          const isWcOrEuro = compName === 'World Cup' || compName === 'Euro Cup';
          
          if (this.natGroupPoints >= 4) {
            this.natStage = 'knockout';
            if (isWcOrEuro) {
              this.insertNationalKnockoutRound('r16', 'Round of 16');
              this.pendingUclNotice = {
                success: true,
                title: `🎉 ${compName} Round of 16 Qualified!`,
                body: `Phenomenal! Your country finished the Group Stage with <strong>${this.natGroupPoints} points</strong> and has advanced to the prestigious Round of 16 knockouts!`
              };
            } else {
              this.insertNationalKnockoutRound('qf', 'Quarter-Finals');
              this.pendingUclNotice = {
                success: true,
                title: `🎉 ${compName} Quarter-Finals Qualified!`,
                body: `Incredible! Your country finished the Group Stage with <strong>${this.natGroupPoints} points</strong> and has advanced to the Quarter-Finals knockouts!`
              };
            }
          } else {
            this.natStage = 'none';
            this.pendingUclNotice = {
              success: false,
              title: `❌ ${compName} Group Stage Exit`,
              body: `Heartbreak! With only <strong>${this.natGroupPoints} points</strong>, your country was eliminated from the Group Stage. Keep working hard!`
            };
          }
        }
      }

      // 7. National Tournament Knockouts (Round of 16, QF, SF)
      if (currentFix.competitionKey === 'national_knockout') {
        const compName = currentFix.competitionName;
        if (won) {
          if (currentFix.stageLabel === 'Round of 16') {
            this.insertNationalKnockoutRound('qf', 'Quarter-Finals');
            this.pendingUclNotice = {
              success: true,
              title: `🎉 ${compName} Quarter-Finals Qualified!`,
              body: `Victory! Your country defeated ${oppName} (<strong>${uGoals} - ${oGoals}</strong>) to advance to the Quarter-Finals!`
            };
          } else if (currentFix.stageLabel === 'Quarter-Finals') {
            this.insertNationalKnockoutRound('sf', 'Semi-Finals');
            this.pendingUclNotice = {
              success: true,
              title: `🎉 ${compName} Semi-Finals Qualified!`,
              body: `Amazing! Your country defeated ${oppName} (<strong>${uGoals} - ${oGoals}</strong>) to reach the international Semi-Finals!`
            };
          } else if (currentFix.stageLabel === 'Semi-Finals') {
            this.insertNationalKnockoutRound('final', 'Final');
            this.pendingUclNotice = {
              success: true,
              title: `🎉 ${compName} GRAND FINAL REACHED!`,
              body: `Unbelievable! Your country defeated ${oppName} (<strong>${uGoals} - ${oGoals}</strong>) and advanced to the ultimate Grand Final!`
            };
          }
        } else {
          this.pendingUclNotice = {
            success: false,
            title: `❌ ${compName} Tournament Exit`,
            body: `Your country was defeated by ${oppName} (<strong>${oGoals} - ${uGoals}</strong>) and is knocked out of the tournament.`
          };
        }
      }

      // 8. National Tournament Final
      if (currentFix.competitionKey === 'national_final') {
        const compName = currentFix.competitionName;
        if (won) {
          if (window.userCareer?.profile?.trophies) {
            if (compName === 'World Cup') {
              window.userCareer.profile.trophies.world_cup = (window.userCareer.profile.trophies.world_cup || 0) + 1;
              if (!window.userCareer.profile.awardsCabinet.internationalCups) {
                window.userCareer.profile.awardsCabinet.internationalCups = [];
              }
              window.userCareer.profile.awardsCabinet.internationalCups.push(`${window.userCareer.stats.season.year} FIFA World Cup`);
            } else {
              window.userCareer.profile.trophies.euros_copas = (window.userCareer.profile.trophies.euros_copas || 0) + 1;
              if (!window.userCareer.profile.awardsCabinet.internationalCups) {
                window.userCareer.profile.awardsCabinet.internationalCups = [];
              }
              window.userCareer.profile.awardsCabinet.internationalCups.push(`${window.userCareer.stats.season.year} ${compName}`);
            }
          }
          this.pendingUclNotice = {
            success: true,
            title: `🏆 ${compName.toUpperCase()} CHAMPIONS!!!`,
            body: `HISTORIC TRIUMPH! Your country has defeated ${oppName} (<strong>${uGoals} - ${oGoals}</strong>) in the Grand Final! You lift the prestigious ${compName} trophy and achieve eternal glory!`
          };
        } else {
          this.pendingUclNotice = {
            success: false,
            title: `🥈 ${compName} Runner-Up`,
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
      f.away.clubId === currentFix.away?.clubId
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
            currentFix.homeScore = userMatchScore.userGoals;
            currentFix.awayScore = userMatchScore.oppGoals;
          } else {
            fix.homeScore = userMatchScore.oppGoals;
            fix.awayScore = userMatchScore.userGoals;
            currentFix.homeScore = userMatchScore.oppGoals;
            currentFix.awayScore = userMatchScore.userGoals;
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
        
        // Distribute simulated goals and assists persistently to players in standings squads!
        this.distributeMatchStatsToSquad(fix.home.clubId, homeGoals);
        this.distributeMatchStatsToSquad(fix.away.clubId, awayGoals);
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
    // Simulate other leagues' matchday goals/assists/matches for ALL 360 clubs globally!
    if (currentFix.competitionKey === 'league') {
      this.simulateGlobalGameweek();
    }
    this.clearActiveMatch(currentFix.id);
    return currentFix.week;
  }  updateStandingsEntry(fix) {
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
        const mult = window.userCareer ? window.userCareer.getSalaryMultiplier() : 1.0;
        const currentLeague = this.getLeagueMeta();
        let baseWage = 30000;
        let role = "First Team Regular";
        
        if (currentLeague && currentLeague.tier === 1) {
          const threshold = (currentClub.stars === 5) ? 82 : 78;
          if (userOvr < threshold) {
            baseWage = Math.floor(Math.random() * 10001) + 20000; // Div 1 Bench: 20k - 30k
            role = "Bench Player";
          } else {
            baseWage = Math.floor(Math.random() * 50001) + 50000; // Div 1 Starter: 50k - 100k
            role = "First Team Regular";
          }
        } else if (currentLeague && currentLeague.tier === 2) {
          if (userOvr < 72) {
            baseWage = Math.floor(Math.random() * 5001) + 2000; // Div 2 Bench: 2k - 7k
            role = "Bench Player";
          } else {
            baseWage = Math.floor(Math.random() * 9001) + 15000; // Div 2 Starter: 15k - 24k
            role = "First Team Regular";
          }
        }
        
        const wage = Math.round(baseWage * mult);
        const years = Math.floor(Math.random() * 4) + 1; // Beautiful spread of 1 to 4 year contracts!
        offers.push({
          clubId: currentClub.clubId || currentClub.id,
          clubName: currentClub.name + ' (Renewal)',
          leagueName: currentLeague.name,
          stars: currentClub.stars,
          logo: currentClub.logo,
          wage: wage,
          goalBonus: Math.round(currentClub.ovr * 15 * mult),
          assistBonus: Math.round(currentClub.ovr * 10 * mult),
          years: years,
          squadRole: role,
          isRenewal: true
        });
      }
    }

    // 2. External offers from other clubs
    const allCandidates = [];
    Object.values(this.leagues).forEach(lg => {
      lg.clubs.forEach(c => {
        if (c.id !== currentClubId) {
          // If the club is Tier 1 (Div 1), user OVR must be at least 75!
          if (lg.tier === 1 && userOvr < 75) {
            return; // Skip Div 1 clubs if OVR < 75
          }

          // Limit weaker clubs from flooding contract offers once player is a star (OVR >= 79)
          if (userOvr >= 79 && c.ovr < userOvr - 8) {
            return; // Skip weak clubs once player is a star!
          }

          const clubRating = c.ovr + c.stars * 2;
          const userRating = userOvr + perfScore * 10;
          const diff = clubRating - userRating;
          
          // Widen the range slightly for Div 1 clubs once OVR >= 79 to make sure they get offered!
          const maxDiff = lg.tier === 1 ? 16 : (12 - perfScore * 15);
          
          if (diff <= maxDiff && diff >= -25) {
            let likelihood = Math.max(0.05, 0.45 - (diff / 25));
            // Boost likelihood for Div 1 if player is 79+ to ensure some appear
            if (lg.tier === 1) likelihood += 0.25;
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
      let wageBase = 25000;
      let role = "First Team Regular";
      let goalMultiplier = 15;
      let assistMultiplier = 10;

      if (league.tier === 1) {
        const threshold = (club.stars === 5) ? 82 : 78;
        if (userOvr < threshold) {
          wageBase = Math.floor(Math.random() * 10001) + 20000; // Div 1 Bench: 20k - 30k
          role = "Bench Player";
          goalMultiplier = 9;
          assistMultiplier = 6;
        } else {
          wageBase = Math.floor(Math.random() * 50001) + 50000; // Div 1 Starter: 50k - 100k
          role = "First Team Regular";
          goalMultiplier = 15;
          assistMultiplier = 10;
        }
      } else if (league.tier === 2) {
        if (userOvr < 72) {
          wageBase = Math.floor(Math.random() * 5001) + 2000; // Div 2 Bench: 2k - 7k
          role = "Bench Player";
          goalMultiplier = 6;
          assistMultiplier = 4;
        } else {
          wageBase = Math.floor(Math.random() * 9001) + 15000; // Div 2 Starter: 15k - 24k
          role = "First Team Regular";
          goalMultiplier = 12;
          assistMultiplier = 8;
        }
      }

      const mult = window.userCareer ? window.userCareer.getSalaryMultiplier() : 1.0;
      const wage = Math.round(wageBase * mult);
      const years = Math.floor(Math.random() * 4) + 1; // Beautiful spread of 1 to 4 year contracts!
      
      offers.push({
        clubId: club.id,
        clubName: club.name,
        leagueName: league.name,
        stars: club.stars,
        logo: club.logo,
        wage: wage,
        goalBonus: Math.round(club.ovr * goalMultiplier * mult),
        assistBonus: Math.round(club.ovr * assistMultiplier * mult),
        years: years,
        squadRole: userOvr >= club.ovr ? 'Crucial Star' : 'First Team Regular',
        isRenewal: false
      });
    });

    // Elite offers injection if player is >85 OVR and has at least one award!
    const totalAwards = (p.trophies?.league_d1 || 0) + 
                        (p.trophies?.league_d2 || 0) + 
                        (p.trophies?.cup || 0) + 
                        (p.trophies?.continental || 0) + 
                        (p.trophies?.world_cup || 0) + 
                        (p.trophies?.ballon_dor || 0) + 
                        (p.trophies?.golden_boot || 0) + 
                        (p.trophies?.euros_copas || 0) + 
                        (p.trophies?.national_cap || 0);
    const hasAnyAward = totalAwards > 0;
    const forceBigOffers = hasAnyAward && userOvr > 85;

    if (forceBigOffers) {
      const eliteClubs = [
        { id: "realmadrid", name: "Real Madrid", logo: "👑", stars: 5, ovr: 88, leagueName: "La Liga (Div 1)" },
        { id: "mancity", name: "Manchester City", logo: "🔵", stars: 5, ovr: 87, leagueName: "Premier League (Div 1)" },
        { id: "barcelona", name: "FC Barcelona", logo: "🔵🔴", stars: 5, ovr: 86, leagueName: "La Liga (Div 1)" },
        { id: "bayern", name: "FC Bayern München", logo: "🔴", stars: 5, ovr: 86, leagueName: "Bundesliga (Div 1)" }
      ];

      eliteClubs.forEach(club => {
        if (club.id !== currentClubId && !offers.some(o => o.clubId === club.id)) {
          const mult = window.userCareer ? window.userCareer.getSalaryMultiplier() : 1.0;
          const wageBase = club.ovr * 350; // extra premium salary
          const wage = Math.round((wageBase + Math.random() * 2000) * mult);
          const years = Math.floor(Math.random() * 4) + 1;
          
          offers.push({
            clubId: club.id,
            clubName: club.name,
            leagueName: club.leagueName,
            stars: club.stars,
            logo: club.logo,
            wage: wage,
            goalBonus: Math.round(club.ovr * 20 * mult),
            assistBonus: Math.round(club.ovr * 15 * mult),
            years: years,
            squadRole: 'Crucial Star',
            isRenewal: false
          });
        }
      });
    }

    // Shuffle to mix renewal with external offers
    offers.sort(() => Math.random() - 0.5);
    return offers.slice(0, 5);
  }

  resetSeason() {
    this.processRetirementsAndRegens();
    
    // Reset all global persistent player statistics at the start of the new season!
    if (this.clubSquads) {
      Object.values(this.clubSquads).forEach(squad => {
        squad.forEach(tm => {
          tm.stats = {
            season: { goals: 0, assists: 0, matches: 0 },
            league: { goals: 0, assists: 0, matches: 0 },
            cup: { goals: 0, assists: 0, matches: 0 },
            ucl: { goals: 0, assists: 0, matches: 0 },
            national_world_cup: { goals: 0, assists: 0, matches: 0 },
            national_euro: { goals: 0, assists: 0, matches: 0 }
          };
        });
      });
    }

    this.standings.forEach(s => {
      s.played = 0;
      s.won = 0;
      s.drawn = 0;
      s.lost = 0;
      s.gf = 0;
      s.ga = 0;
      s.gd = 0;
      s.points = 0;
      // Fetch up-to-date aged/regen squad
      s.squad = this.clubSquads[s.clubId] || s.squad;
    });
    this.generateFixtures();
    this.buildSeasonSchedule(window.userCareer && window.userCareer.profile ? window.userCareer.profile : null);
  }

  getClubBadgeHtml(clubName, size = 28) {
    if (!clubName) return '⚽';

    const nat = this.nationalTeams.find(n => n.name === clubName);
    if (nat) {
      return `<span style="font-size: ${size}px; line-height: 1;">${nat.flag}</span>`;
    }

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
