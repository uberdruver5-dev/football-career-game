# double_names_db.py
import json
import os

with open('js/names.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract only the JSON block between the first { and last }
start = content.find('{')
end = content.rfind('}') + 1
json_str = content[start:end]

db = json.loads(json_str)

additional_names = {
    "English": {
        "first": [
            "Austin", "Arthur", "Barnaby", "Beckett", "Benedict", "Barnard", "Clement", "Conrad", "Christian", "Dominic",
            "Damian", "Duncan", "Dexter", "Elliot", "Edwin", "Eugene", "Francis", "Franklin", "Gideon", "Gregory",
            "Gavin", "Graham", "Harlan", "Heath", "Harvey", "Ian", "Julian", "Jasper", "Jared", "Jonas",
            "Kieran", "Laurence", "Lionel", "Marcus", "Miles", "Malcolm", "Nathaniel", "Nigel", "Neil", "Oscar",
            "Otis", "Philip", "Pierce", "Quentin", "Raymond", "Rupert", "Reginald", "Simon", "Silas", "Stefan",
            "Tristan", "Tobias", "Victor", "Vincent", "Vance", "Warren", "Wyatt", "Zachary", "Abner", "Amos",
            "Barnabas", "Claudio", "Dorian", "Emilio", "Fabian", "Giles", "Ignatius", "Jerome", "Lucius", "Milo",
            "Nico", "Orson", "Roderick", "Soren", "Thaddeus", "Valentin", "Alastair", "Caspar", "Denzil", "Hamish",
            "Lachlan", "Magnus", "Piers", "Rory", "Stian", "Torquil", "Abel", "Asher", "Enoch", "Gomer",
            "Hezekiah", "Japheth", "Malachi", "Obadiah", "Rufus", "Silvanus", "Uriah", "Zebedee", "Seth", "Saul"
        ],
        "last": [
            "Aitken", "Bancroft", "Blackwood", "Calloway", "Chamberlain", "Cunningham", "Davenport", "Ellington", "Fitzgerald", "Garrison",
            "Harrington", "Kensington", "Livingstone", "Montgomery", "Pembroke", "Redmond", "Sinclair", "Talbot", "Vanderbilt", "Wellington",
            "Armstrong", "Barrington", "Cavendish", "Donovan", "Endicott", "Farthing", "Gainsborough", "Haverbrook", "Ibbotson", "Jernigan",
            "Kingsley", "Lockwood", "Millington", "Nightingale", "Oakhaven", "Pendleton", "Quincy", "Rutherford", "Standish", "Tillinghast",
            "Underwood", "Valois", "Wentworth", "Yardley", "Zimmerman", "Abbott", "Abernathy", "Baris", "Barrett", "Beaufort",
            "Bellamy", "Benson", "Blackburn", "Blackwood", "Blakeslee", "Braddock", "Brewster", "Bridgerton", "Brighton", "Broadhurst",
            "Brockhouse", "Browning", "Buckingham", "Cadogan", "Caldecott", "Carlisle", "Cartwright", "Channing", "Chattanooga", "Cheltenham",
            "Clermont", "Colborne", "Coldstream", "Collingwood", "Coombs", "Copeland", "Cranston", "Cromwell", "Culpepper", "Danvers",
            "Darling", "Darnell", "Davenport", "Decker", "Devereux", "Donnelly", "Drummond", "Duchess", "Dudley", "Dunbar",
            "Eastaughffe", "Edgecomb", "Ellery", "Ellison", "Fairchild", "Fairfax", "Falconer", "Farnsworth", "Featherstone", "Fitzroy"
        ]
    },
    "Spanish": {
        "first": [
            "Agustin", "Alfonso", "Amadeo", "Andres", "Anibal", "Arsenio", "Arturo", "Aurelio", "Bartolome", "Benito",
            "Bernardo", "Blas", "Camilo", "Celestino", "Cesar", "Claudio", "Clemente", "Conrado", "Constantino", "Cristobal",
            "Damian", "Demetrio", "Domingo", "Donato", "Eduardo", "Eliseo", "Emilio", "Enrique", "Ernesto", "Esteban",
            "Eugenio", "Eusebio", "Ezequiel", "Federico", "Felipe", "Felix", "Fermin", "Fernando", "Francisco", "Gabriel",
            "Gerardo", "German", "Gervasio", "Gilberto", "Gonzalo", "Gregorio", "Guillermo", "Gustavo", "Haroldo", "Hector",
            "Heriberto", "Hipolito", "Ignacio", "Ildefonso", "Ismael", "Jacinto", "Jaime", "Javier", "Jeronimo", "Jesus",
            "Joaquin", "Jorge", "Josue", "Juan", "Julian", "Julio", "Lazaro", "Leandro", "Leonardo", "Leopoldo",
            "Lorenzo", "Lucas", "Luis", "Manuel", "Marcelo", "Marcos", "Mariano", "Mario", "Mateo", "Mauricio",
            "Maximiliano", "Miguel", "Moises", "Nicolas", "Octavio", "Orlando", "Oscar", "Pablo", "Pascual", "Patricio",
            "Pedro", "Rafael", "Ramon", "Raul", "Ricardo", "Roberto", "Rodrigo", "Rogelio", "Ruben", "Santiago"
        ],
        "last": [
            "Acosta", "Aguilar", "Alarcon", "Alcala", "Alcazar", "Aldana", "Alfaro", "Almonte", "Alvarado", "Amador",
            "Anaya", "Andrade", "Anguiano", "Aponte", "Aragon", "Aranda", "Araujo", "Arce", "Arellano", "Arevalo",
            "Arias", "Armenta", "Arredondo", "Arreola", "Arriaga", "Arroyo", "Arteaga", "Asencio", "Atencio", "Avila",
            "Aviles", "Ayala", "Balderas", "Ballesteros", "Banda", "Barajas", "Barrera", "Barrientos", "Barrios", "Bastida",
            "Batista", "Bautista", "Becerra", "Bedolla", "Bejarano", "Bello", "Beltran", "Benavides", "Benitez", "Bermudez",
            "Bernal", "Berrera", "Berrios", "Blanco", "Bolanos", "Bonilla", "Borrego", "Botello", "Bravo", "Briceno",
            "Briones", "Brito", "Buelna", "Bueno", "Burgos", "Bustamante", "Bustos", "Caballero", "Cabral", "Cabrera",
            "Caceres", "Cadena", "Caldera", "Calderon", "Calvillo", "Calvo", "Camacho", "Camarillo", "Camino", "Campillo",
            "Campos", "Canales", "Candelaria", "Cano", "Cantú", "Caraballo", "Carbajal", "Cardenas", "Cardona", "Cardozo"
        ]
    },
    "French": {
        "first": [
            "Adrien", "Alphonse", "Amand", "Anatole", "Armand", "Arnaud", "Aubin", "Augustin", "Aurelien", "Balthazar",
            "Barthélémy", "Baudouin", "Benoit", "Blaise", "Boniface", "Célestin", "César", "Charles", "Clément", "Clovis",
            "Constantin", "Cyprien", "Cyrille", "Damien", "Denis", "Désiré", "Donatien", "Edgard", "Edouard", "Eloi",
            "Emiland", "Emmanuel", "Ernest", "Etienne", "Eugène", "Eustache", "Fabien", "Florent", "Florian", "Gaspard",
            "Gaston", "Gautier", "Gédéon", "Geoffroy", "Germain", "Gervais", "Gilbert", "Gilles", "Grégoire", "Guillaume",
            "Gustave", "Guy", "Hector", "Henri", "Honoré", "Hubert", "Hugues", "Isidore", "Jean", "Jérôme",
            "Joachim", "Jules", "Julien", "Laurent", "Lazare", "Léger", "Léonard", "Léopold", "Louis", "Lucien",
            "Marc", "Marcel", "Marius", "Mathieu", "Mathis", "Maurice", "Maxime", "Michel", "Modeste", "Nicolas",
            "Noël", "Olivier", "Philibert", "Philippe", "Pierre", "Quentin", "Raoul", "Raymond", "Régis", "Rémi",
            "Renaud", "René", "Rodolphe", "Roger", "Roland", "Romain", "Sébastien", "Serge", "Séverin", "Simon"
        ],
        "last": [
            "Adam", "Allard", "Andre", "Antoine", "Arnaud", "Aubert", "Aubry", "Bailly", "Barbier", "Baron",
            "Barre", "Barthélémy", "Baudry", "Bazin", "Belanger", "Bellanger", "Benoit", "Berger", "Bernard", "Bernier",
            "Berthelot", "Berthier", "Bertin", "Bertrand", "Besson", "Blanc", "Blanchard", "Blanchet", "Blondel", "Bodard",
            "Bodin", "Boivin", "Bonhomme", "Bonnet", "Bontemps", "Borel", "Bouchard", "Boucher", "Bouchet", "Boulanger",
            "Boulay", "Boulet", "Bourdon", "Bourgeois", "Bousquet", "Boutet", "Bouthillier", "Boutin", "Bouvet", "Bouvier",
            "Boyer", "Bremond", "Breton", "Briand", "Brocard", "Brossard", "Bruneau", "Brunet", "Buisson", "Bureau",
            "Cadet", "Cadieux", "Caillet", "Calvet", "Camus", "Capelle", "Carlier", "Caron", "Carpentier", "Carre",
            "Cartier", "Castel", "Cato", "Caux", "Cazenave", "Cellier", "Chabert", "Chabot", "Chalvet", "Chamberland",
            "Champagne", "Champion", "Chapelle", "Chapuis", "Charbonnier", "Chardin", "Chardon", "Charenton", "Charpentier", "Charrier"
        ]
    },
    "German": {
        "first": [
            "Adolf", "Albert", "Alois", "Alwin", "Anton", "Armin", "Arno", "August", "Baldur", "Benedikt",
            "Bernhard", "Berthold", "Bruno", "Christian", "Christoph", "Clemens", "Conrad", "Dagobert", "Daniel", "Dieter",
            "Dietmar", "Eberhard", "Eckart", "Eduard", "Eginhard", "Egon", "Ekkehard", "Emil", "Emmerich", "Engelbert",
            "Erhard", "Erich", "Erik", "Ernst", "Erwin", "Eugen", "Ferdinand", "Florian", "Franz", "Friedrich",
            "Fritz", "Gebhard", "Georg", "Gerhard", "Gernot", "Gero", "Gert", "Gotthard", "Gottfried", "Gotthold",
            "Gregor", "Guido", "Gunter", "Gunther", "Gusta", "Gustav", "Hanko", "Hannes", "Hannibal", "Harald",
            "Hartmann", "Hartmut", "Hartwig", "Hasso", "Heiko", "Heimo", "Heiner", "Heino", "Heinrich", "Heinz",
            "Helge", "Helgo", "Helmar", "Helmut", "Helmuth", "Herbert", "Heribert", "Hermann", "Herwig", "Hubert",
            "Hugo", "Ignaz", "Immanuel", "Ingo", "Ingolf", "Ireneus", "Jakob", "Jan", "Joachim", "Johannes",
            "Jonas", "Jonathan", "Josef", "Joseph", "Julius", "Jürgen", "Karl", "Karsten", "Kaspar", "Klemens"
        ],
        "last": [
            "Abel", "Albrecht", "Arnold", "Bach", "Barth", "Beck", "Berger", "Binder", "Brandt", "Breuer",
            "Busch", "Dietrich", "Eberhardt", "Eckert", "Engel", "Ernst", "Fiedler", "Fink", "Franke", "Friedrich",
            "Fröhlich", "Fuchs", "Graf", "Groß", "Hahn", "Hartmann", "Hein", "Heinrich", "Heinz", "Hermann",
            "Herrmann", "Huber", "Jung", "Kaiser", "Kaufmann", "Keller", "Kern", "Kiefer", "Klaus", "Klein",
            "Kling", "Koch", "Kohl", "Kraus", "Krause", "Krieger", "Krohn", "Krug", "Kruse", "Kuhn",
            "Kunz", "Kuster", "Kuster-Zimmermann", "Köhler", "König", "Kuster-Weber", "Lange", "Lehmann", "Lorenz", "Ludwig",
            "Lust", "Mader", "Maier", "Martin", "Marx", "Maurer", "Mayer", "Meier", "Mein", "Meissner",
            "Menzel", "Metzger", "Meyer", "Michel", "Möller", "Müller", "Neumann", "Noll", "Oswald", "Otto"
        ]
    },
    "Italian": {
        "first": [
            "Adolfo", "Adriano", "Agostino", "Aldo", "Alessandro", "Alessio", "Alfonso", "Alfredo", "Amadeo", "Ambrogio",
            "Amedeo", "Anastasio", "Andrea", "Angelo", "Anselmo", "Antonino", "Antonio", "Arcangelo", "Armando", "Arnaldo",
            "Arturo", "Attilio", "Augusto", "Aurelio", "Bartolomeo", "Basilio", "Battista", "Benedetto", "Benito", "Benvenuto",
            "Bernardo", "Berto", "Biagio", "Bruno", "Calogero", "Camillo", "Carlo", "Carmine", "Cesare", "Cipriano",
            "Claudio", "Clemente", "Corrado", "Cosimo", "Costantino", "Costanzo", "Cristiano", "Cristoforo", "Damiano", "Daniele",
            "Danilo", "Dario", "Davide", "Demetrio", "Dino", "Domenico", "Donato", "Edoardo", "Egidio", "Elio",
            "Emanuele", "Emilio", "Emiliano", "Enrico", "Enzo", "Ercole", "Ermanno", "Ernesto", "Ettore", "Eugenio",
            "Eusebio", "Eustachio", "Ezio", "Fabiano", "Fabio", "Fabrizio", "Fausto", "Federico", "Felice", "Ferdinando",
            "Filippo", "Fiorenzo", "Flavio", "Francesco", "Franco", "Fulvio", "Gabriele", "Gaetano", "Gaspare", "Gastone",
            "Gennaro", "Gerardo", "Geronimo", "Giacinto", "Giacomo", "Giampaolo", "Giancarlo", "Gianfranco", "Gianluca", "Gianluigi"
        ],
        "last": [
            "Abate", "Adami", "Albertini", "Amato", "Angelini", "Anselmi", "Antonelli", "Aprile", "Arcuri", "Badoglio",
            "Baglioni", "Baldini", "Barone", "Basile", "Bellini", "Benedetti", "Benetton", "Bernardi", "Bertoni", "Biondi",
            "Boccherini", "Bologna", "Bonucci", "Borghese", "Borromeo", "Botticelli", "Brambilla", "Breda", "Bresciani", "Brocca",
            "Bruni", "Cabrini", "Cadorna", "Calabrese", "Calvino", "Campanella", "Canepa", "Caputo", "Cardone", "Carli",
            "Casadei", "Casini", "Castellano", "Cattaneo", "Cavalieri", "Cavallaro", "Cavour", "Cerutti", "Cherubini", "Chigi",
            "Ciano", "Cipriani", "Cocco", "Colonna", "Conte", "Contini", "Corradi", "Corsi", "Corti", "Crispi",
            "Croce", "D'Amico", "D'Angelo", "D'Onofrio", "Dalla", "DeAngelis", "DeLuca", "DeRosa", "DeSanctis", "DeSica",
            "Degli", "DelPiero", "Della", "Donati", "Donizetti", "Draghi", "Fabbri", "Falcone", "Fancelli", "Fantoni",
            "Farina", "Fasolo", "Fellini", "Ferrara", "Ferrari", "Ferrero", "Ferretti", "Ferri", "Filippi", "Fini"
        ]
    },
    "Nordic": {
        "first": [
            "Aksel", "Albin", "Anders", "Andreas", "Anker", "Arvid", "Asger", "Aslak", "Asmund", "Atle",
            "Axel", "Balder", "Bendt", "Bengt", "Birger", "Bjarke", "Bjarne", "Björn", "Bo", "Bodil",
            "Børge", "Christen", "Christian", "Claes", "Dag", "Dan", "Daniel", "Ditlev", "Egil", "Einar",
            "Eivind", "Ejnar", "Ejner", "Eldar", "Elias", "Elmer", "Emil", "Erik", "Erland", "Erling",
            "Esben", "Espen", "Eskild", "Even", "Filip", "Flemming", "Folke", "Frands", "Frans", "Frede",
            "Frederik", "Fredrik", "Frikk", "Fritjof", "Frode", "Gisli", "Gorm", "Gunnar", "Gustav", "Gøran",
            "Hakon", "Halfdan", "Halstein", "Halvar", "Halvard", "Halvdan", "Hannes", "Hans", "Harald", "Hartvig",
            "Hasse", "Heino", "Helge", "Hemming", "Henrik", "Herluf", "Herman", "Hjalmar", "Holger", "Hugo",
            "Håkon", "Håvard", "Ib", "Ingar", "Inge", "Ingemar", "Ingmar", "Ingolf", "Ingvar", "Isak"
        ],
        "last": [
            "Aaberg", "Aaby", "Aagaard", "Aagesen", "Aakre", "Aaland", "Aamodt", "Aamot", "Aardal", "Aarsand",
            "Aasen", "Aasland", "Abrahamsen", "Adolfsen", "Albeck", "Albrektsen", "Alm", "Almberg", "Alme", "Almgren",
            "Almli", "Almquist", "Almstrom", "Amundsen", "Andersen", "Andersson", "Andreasen", "Andreassen", "Andresen", "Angstrom",
            "Anker", "Antonsen", "Arnesen", "Arnesson", "Arnstad", "Aschenbrenner", "Asgrimsson", "Asmundsson", "Asplund", "Asvaldsson",
            "Aure", "Backe", "Backman", "Bager", "Bagge", "Bakke", "Bakken", "Bang", "Barentsen", "Barker",
            "Beck", "Beckman", "Bendixen", "Bengtsson", "Bentzen", "Berentsen", "Berg", "Bergan", "Bergdahl", "Berge",
            "Bergen", "Bergesen", "Berggren", "Bergh", "Berglund", "Bergman", "Bergquist", "Bergqvist", "Bergstrom", "Birkeland",
            "Bjerke", "Bjerre", "Bjerregaard", "Bjoerk", "Bjork", "Bjorklund", "Bjorkman", "Bjornstad", "Blaaberg", "Blix"
        ]
    },
    "Slavic": {
        "first": [
            "Andrej", "Andrija", "Ante", "Anton", "Antun", "Alen", "Aleksandar", "Anatoliy", "Artem", "Andriy",
            "Bojan", "Boris", "Borna", "Branimir", "Branko", "Bruno", "Bogdan", "Boleslaw", "Bronislaw", "Bartosz",
            "Darko", "Davor", "Dejan", "Denis", "Dino", "Domagoj", "Dominik", "Dragan", "Dragutin", "Drazen",
            "Duje", "Dmitry", "Dmytro", "Dariusz", "Damian", "Emil", "Filip", "Frane", "Franjo", "Fyodor",
            "Grzegorz", "Goran", "Gordan", "Gvozden", "Hrvoje", "Igor", "Ilija", "Ilko", "Ivan", "Ivica",
            "Ivo", "Ilya", "Iaroslav", "Jakov", "Jasmin", "Jerko", "Josip", "Joško", "Jovan", "Jure",
            "Jurica", "Karlo", "Kresimir", "Kristijan", "Kamil", "Karol", "Krzysztof", "Lovre", "Lovro", "Luka",
            "Leonid", "Lukasz", "Marjan", "Marijan", "Marin", "Marinko", "Mario", "Marko", "Mate", "Matej",
            "Mateo", "Matija", "Matko", "Mijo", "Milan", "Mile", "Milivoj", "Miljenko", "Miloš", "Miroslav",
            "Mislav", "Mladen", "Maciej", "Marcin", "Marek", "Mateusz", "Michal", "Mykola", "Nikita"
        ],
        "last": [
            "Abramovic", "Babic", "Bacic", "Badelj", "Bakaric", "Balic", "Banic", "Barisic", "Basic", "Begic",
            "Belic", "Belosevic", "Benic", "Benko", "Beslic", "Bicanic", "Bilic", "Blazevic", "Boban", "Bogdanovic",
            "Boras", "Bosnjak", "Bozic", "Brajkovic", "Bralic", "Brkic", "Brozovic", "Bubic", "Budimir", "Bulic",
            "Cacic", "Caleta", "Car", "Celic", "Cervar", "Cisic", "Colic", "Coric", "Corluka", "Cosic",
            "Covic", "Crnkovic", "Cuk", "Cvitanovic", "Dadic", "Damic", "Damjanovic", "Dedic", "Delic", "Derk",
            "Devic", "Djakovic", "Dmitrovic", "Dobras", "Dodig", "Dokic", "Dombaj", "Domitrovic", "Dovjak", "Dragic",
            "Dragojevic", "Drakulic", "Draslar", "Drazic", "Dretar", "Drvenkar", "Duda", "Dujmovic", "Dukic", "Duran",
            "Duric", "Duvnjak", "Erceg", "Faber", "Filipovic", "Foretic", "Francic", "Frankovic", "Frigan", "Friscic"
        ]
    },
    "Turkish": {
        "first": [
            "Abbas", "Abdi", "Abdullah", "Abdurrahman", "Adem", "Adnan", "Ahmet", "Ali", "Alp", "Alparslan",
            "Alper", "Alperen", "Anil", "Aras", "Arda", "Arif", "Aslan", "Asim", "Ata", "Atilla",
            "Avni", "Ayhan", "Aykut", "Aytekin", "Bahadir", "Baha", "Baki", "Baris", "Barlas", "Bartu",
            "Baskın", "Bati", "Batuhan", "Batur", "Bedri", "Behlül", "Behram", "Behzat", "Bekir", "Berat",
            "Berk", "Berkan", "Berkay", "Besim", "Bilal", "Birol", "Bora", "Buğra", "Bulut", "Burak",
            "Burhan", "Bülent", "Bünyamin", "Cahit", "Can", "Caner", "Celal", "Cem", "Cemal", "Cemil",
            "Cengiz", "Cenk", "Cevat", "Cevdet", "Ceyhun", "Cihan", "Cihangir", "Coşkun", "Cüneyt", "Demir",
            "Deniz", "Devrim", "Dilaver", "Doğan", "Doğukan", "Doruk", "Dorukhan", "Dursun", "Ebubekir", "Efe",
            "Ege", "Egemen", "Ekrem", "Emin", "Emir", "Emirhan", "Emre", "Ender", "Enes", "Engin",
            "Ensar", "Enver", "Ercan", "Ercüment", "Erdal", "Erdem", "Erdoğan", "Eren", "Ergin", "Erhan"
        ],
        "last": [
            "Aba", "Abay", "Acar", "Acarer", "Acun", "Adan", "Adanır", "Adıvar", "Adıvar", "Ağan",
            "Ağca", "Ağcay", "Aka", "Akad", "Akalın", "Akaslan", "Akbaş", "Akbulut", "Akca", "Akcay",
            "Akdağ", "Akdemir", "Akdoğan", "Akgul", "Akgün", "Akın", "Akıncı", "Akiş", "Akkaya", "Akkoyun",
            "Akmansoy", "Akpınar", "Aksan", "Aksoy", "Aktan", "Aktaş", "Aktepe", "Akyol", "Akyürek", "Akyüz",
            "Alasya", "Albayrak", "Algan", "Alkan", "Alparslan", "Altan", "Altay", "Altın", "Altınay", "Altıok",
            "Altun", "Altundağ", "Anıl", "Aras", "Arat", "Araz", "Arbaş", "Arı", "Arıcan", "Arıkan",
            "Arısoy", "Arkın", "Arman", "Arslan", "Arslanoğlu", "Artan", "Artuk", "Artuner", "Aslan", "Aslanoğlu",
            "Aşık", "Aşut", "Ata", "Atac", "Atalay", "Ataman", "Atasever", "Atasoy", "Atatürk", "Ateş",
            "Atıf", "Atılgan", "Atilla", "Avcı", "Avcıoğlu", "Ay", "Ayanoğlu", "Ayas", "Ayaz", "Aydan"
        ]
    }
}

for country, lists in db.items():
    culture = "English"
    c_lower = country.lower()
    if c_lower in ["spain", "argentina", "uruguay", "colombia", "mexico"]:
        culture = "Spanish"
    elif c_lower in ["france", "belgium", "ivory coast", "senegal", "algeria"]:
        culture = "French"
    elif c_lower in ["germany", "netherlands"]:
        culture = "German"
    elif c_lower in ["italy"]:
        culture = "Italian"
    elif c_lower in ["norway", "sweden", "denmark"]:
        culture = "Nordic"
    elif c_lower in ["croatia", "poland"]:
        culture = "Slavic"
    elif c_lower in ["turkey", "egypt"]:
        culture = "Turkish"
    
    # Append another 100 first and last names!
    extra_first = additional_names[culture]["first"]
    extra_last = additional_names[culture]["last"]
    
    # Merge, keeping names unique
    for name in extra_first:
        if name not in lists["first"]:
            lists["first"].append(name)
            
    for name in extra_last:
        if name not in lists["last"]:
            lists["last"].append(name)

# Format and write back to js/names.js
output = "window.NATIONAL_NAMES = " + json.dumps(db, indent=2, ensure_ascii=False) + ";"
with open('js/names.js', 'w', encoding='utf-8') as f:
    f.write(output)

print("SUCCESS: Name Database Doubled!")
