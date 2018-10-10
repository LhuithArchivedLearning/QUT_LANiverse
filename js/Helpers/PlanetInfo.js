var condition = 
[
    "Cold",
    "Dry",
    "Radioactive",
    "Hot",
    "Gluten Free",
    "Moist",
    "Smelly",
    "Habitable"
]

var quantity =
[
    "Too",
    "Kinda",
    "Slighty",
    "Very",
    "Dangerously",
    ""
]

var adjective = 
[
    "Amazing",
    "Lovely",
    "pretty Bad",
    "Kinda Sassy",
    "Annoying",
    "Boring",
    "Ironic" ,
    "Poo",
    "Smashing",
    "Brilliant",
    "Crabby",
    "Subjective",
    "Fun at Parties",
    "Dumb",
    "Goofy",
    "Down On its Luck",
    "Loud",
    "Stanky",
    "Tough",
    "Charasmatic",
    "delightful",
    "bad",
    "Old",
    "Important",
    "By The Books",
    "Dank",          
    "Pretty",
    "Primitive",
    "Scary",
    "Delightful",
    "Tasty",
    "Yummy",
    "Advanced",
    "Magnificent",
    "Old fashioned",
    "Beautiful",
    "Quaint" ,
    "Quintessential" ,
    "Prehistoric",
    "Witty",
    "Zealous",
    "Quirky",
    "Savage",
    "Clammy",
    "Pretentious",
    "In your face", 
    "Angry",
    "Mad",
    "Totally tubular",
    "Krunkalicois",
    "Krunk",
    "Behind the times",
    "Independent",
    "Sweet",
    "Crusty",
    "Bubbly",
    "Cute",
    "Special",
    "Crazy",
    "Corny",
    "Gourmet",
    "Frenchy",
    "Royal",
    "Loyal",
    "Fruity",
    "Organic",
    "Out of this world",
    "Spastic",
    "Psychotic",
    "Radical",
    "Cheesy",
    "Claustrophobic",
    "Arackniphobic",
    "Pungent",
    "Noxious",
    "To good to be true",
    "Erotic",
    "Sensual",
    "Spotty",
    "Funky",
    "Funky fresh",
    "Slippery",
    "Moist"
]

var discAdjective =
[
    "Smelling of",
    "Made of",
    "That is",
    "Might be"
]

var discription =
[
    ", Plot Twist, Actually Earth",
    "not in galaxy quest",
    "Actually flat",
    "Under construction",
    "Not the 3rd planet",
    "Part of the alliance" ,
    "Removed from the archives",
    "Slightly smaller on the right",
    "Actually Kurt Russell" ,
    "Sticky and Vile",
    "a Villains Lair",
    "High in Fibre", 
    "a Replicant's Colony", 
    "Under emperial Rule",
    "Not Appearing in this Film",
    "Just a flesh wound",
    "Blue. No! WAIT!",
    "Formely Known as Prince",
    "in the Castle aaauuugghhhh....",
    "a cloning facility",
    "Sick of it all",
    "Housing a Secret Rebel base",
    "In 3D!!!!!",
    "Inconceivable!",
    "Low in Salt",
    "Persvertive Free",
    "Sugar Free",
    "Low in Calories",
    "Actually a giant death Lazer",
    "More then meets the Eye",
    "Not the planet your looking for",
    "just more of the same",
    "in it for the long run",
    "Baked not fried",
    "Walkin here",
    "Entertained",
    "currently being mined",
    "a mining facility",
    "a mining colony",
    "a terraforming facility",
    "a terraforming colony",
    "Untouched",
    "Vegan Free",
    "Boasting the Only English Language Bookshop and Bar",
    "Home to the Toughest Bar in the World",
    
]

function BuildBio(size)
{
    var elementsList = [];

    return "A " + adjective[randomRangeRound(0, adjective.length - 1)] 
    + " " +  SizeText(size) + " sized Planet, " +
    BuildDescription() + BuildLifeForm();
}

function buildElements(colorpallate, regions, txt)
{
    var elementsList = [];

    for(var i = 0; i < colorpallate.length; i++)
    {
        var meanValue =
        (
            colorpallate[i].RGB.r + 
            colorpallate[i].RGB.g + 
            colorpallate[i].RGB.b
        )/ 3;

        if(i + 1 != colorpallate.length)
        var percent = Math.abs(regions.Data[i].height - regions.Data[i + 1].height);
        else
        var percent = Math.abs(regions.Data[i].height - 1.0);

        var element;

        element = getClosestValue(meanValue, colorpallate);

        elementsList.push( new elementPercent (element.name,  Math.round(percent * 100), element.color));           
    }

    for(var i = 0; i < elementsList.length; i++)
    {
        for(var j = 0; j < elementsList.length; j++)
            {
                if(i == j)
                    continue;

                if(elementsList[i].name == elementsList[j].name)
                {
                    elementsList[j].name = "removed";
                    elementsList[i].percent += elementsList[j].percent;
                    continue;
                }
                else if(elementsList[i].percent == 0)
                {
                    elementsList[i].name = "removed";
                }
            }
    }

    var col1 = Math.abs(shadeRGBColor(elementsList[0].color, 0.0015).getHex());
    var col2 = Math.abs(shadeRGBColor(elementsList[1].color, 0.0015).getHex());
    var col3 = Math.abs(shadeRGBColor(elementsList[2].color, 0.0015).getHex());
    var col4 = Math.abs(shadeRGBColor(elementsList[3].color, 0.0015).getHex());
    var col5 = Math.abs(shadeRGBColor(elementsList[4].color, 0.0015).getHex());
    var quickhex = "#2980b9";

    var ele1name = elementsList[0].name + " ";
    ele1name = ele1name.fontcolor(quickhex);
    var ele1 = (elementsList[0].name != "removed") ? ele1name : "";

    var ele2name = elementsList[1].name + " ";
    ele2name = ele2name.fontcolor(quickhex);
    var ele2 = (elementsList[1].name != "removed") ? ele2name : "";

    var ele3name = elementsList[2].name + " ";
    ele3name = ele3name.fontcolor(quickhex);
    var ele3 = (elementsList[2].name != "removed") ? ele3name : "";

    var ele4name = elementsList[3].name + " ";
    ele4name = ele4name.fontcolor(quickhex);
    var ele4 = (elementsList[3].name != "removed") ? ele4name : "";

    var ele5name = elementsList[4].name + " ";
    ele5name = ele5name.fontcolor(quickhex);
    var ele5 = (elementsList[4].name != "removed") ? ele5name : "";

    var information = ele1 + ele2 + ele3 + ele4 + ele5;

    return information;
}

function getClosestValue(colornum, pallete)
{
    var curr =
    (
        elementColors[0].color.r + 
        elementColors[0].color.g + 
        elementColors[0].color.b
    )/ 3;

    var index;

    for(var i = 0; i < elementColors.length; i++)
    {
            var eleMean =  
            (
                elementColors[i].color.r + 
                elementColors[i].color.g + 
                elementColors[i].color.b
            )/ 3;

            if(Math.abs(colornum - eleMean) <= Math.abs(colornum - curr))
            {
                curr  =  
                (
                    elementColors[i].color.r + 
                    elementColors[i].color.g + 
                    elementColors[i].color.b
                )/ 3;
            
                index = i;
                //console.log(index);
            }
           //console.log(elementColors[i].name)
    }

    var element =  new elementPercent(elementColors[index].name, 0, elementColors[index].color);
    return element;
}
function BuildDescription()
{
    var discRoll = randomRange(0, 10);

        return discAdjective[2] + " " + discription[randomRangeRound(0, discription.length - 1)]
}

function BuildHazard()
{
    return quantity[randomRangeRound(0, quantity.length - 1)] + " " + 
    condition[randomRangeRound(0, condition.length - 1)] ;
}

function BuildLifeForm(size)
{
    var roll = randomRange(0, 10);

    if(roll > 3)
    {      
        var porcRoll = randomRange(0, 10);
        var creature;
        var adjectiveFinal;
    
        var adjroll = randomRange(0, 10);
    
        if(adjroll > 5)
        {
            adjectiveFinal = creatureAdjectives[randomRangeRound(0, creatureAdjectives.length - 1)];
        }
        else
        {
            adjectiveFinal = 
            
            adjuectiveQuantity[randomRangeRound(0, adjuectiveQuantity.length - 1)]  
            + " " + 
            adjective[randomRangeRound(0, adjective.length - 1)];
        }
    
        if(porcRoll > 1)
        {
            var typeRoll = randomRange(0, 10);
    
            if(typeRoll > 6.5)
            {
            creature = lifeforms[ randomRangeRound(0, lifeforms.length - 1)]; 
            }
            else   
            {
                creature = householdStuff[ randomRangeRound(0, householdStuff.length - 1)]; 
            }  
        }
        else 
        {
            creature = word(randomRange(0, 27));
        }
    
        return ", " + intellgentlifeformTakeOverState[randomRangeRound(0, intellgentlifeformTakeOverState.length - 1)] 
        + " " +
         adjectiveFinal
         + " " + 
        creature + " " + BuildCreateAbilities();
    }
    else
    {
        return ", Devoid Of Life";
    }

}

var adjuectiveQuantity =
[
    "Kinda",
    "Slighty",
    "Very",
    ""
]

function SizeText(size)
{
   if(size >= 0 && size <= 6500)
    return "Dwarf";
   if(size >= 6500 && size <= 8500)
    return"Regular";
   if(size >= 8500 && size <= 10500)
    return "Large";
   if(size >= 10500 && size <= 12000)
    return "Massive";
   if(size >= 12000)
    return "gargantuan";   
}

var intellgentlifeformTakeOverState =
[
    "Ruled by",
    "Run by",
    "Populated by",
    "Conquered by",
    "inhabited by"
]

var creaturethats =
[
    "always Pay there Depts",
    "Know Nothing",
    "keep bottles of lint everywhere",
    "Protec, but Also Attac",
    "have the PPOOOOOWWWEEEERRRR",
    "look on the brightside of life",
    "fight evil",
    "lick random objects",
    "love all things",
    "could care less",
    "couldnt be bothered",
    "shall count to three, no more, no less",
    "say Ni",
    "taunt you a second time",
    "fart in you'r general direction",
    "love to party",
    "go on adventures when noone is looking",
    "Blew it up...Those Manaics!!!",
    "evolved to kill humans",
    "retort with One Liners",
    "sigh alot",
    "sing everything",
    "scream everything",
    "scream alot",
    "cant catch a break",
    "write short stories",
    "write romance novels",
    "write fan fiction",
    "go on small walks on the beach",
    "fart everytime a clown is nearby",
    "should have stayed in school",
    "never got back to you",
    "killed kenny, those bastards!",
    "write screen plays",
    "play outside",
    "never leave the toilet seat up",
    "always tip the waiter",
    "Sometimes go upside-down",
    "nibble your toes",
    "Caaannn dooooo, ohh wee!",
    "arnt even mad",
    "doesnt put baby in the corner",
    "Built a Super Computer, to answer the ultimate question"
]


var creatureAres =
[
    "fighting to save the universe",
    "always late",
    "really into romance novels",
    "ruled by a Mad King",
    "always angry, thats there secret",
    "EVIL!!!!",
    "Good",
    "fighting evil",
    "our last hope",
    "our only hope",
    "always cranky",
    "always hangry",
    "always on time",
    "always going on about the weather",
    "wazirds",
]

var creatureWills =
[
    "have what shes having",
    "have whatever his smokin",
    "burn them all",
    
]

var creatureSentanceAbilitiesStart =
[
    "that are ",
    "that ",
    "that will "
]

function BuildCreateAbilities()
{
    var roll = randomRange(0, 10); 

    if(roll > 0 && roll < 6)
    {
        //that ___________

        return creatureSentanceAbilitiesStart[1] + 
        creaturethats[randomRangeRound(0, creaturethats.length - 1)]
    }
    else if(roll > 6 && roll < 9)
    {
        //that are ___________

        return creatureSentanceAbilitiesStart[0] + 
        creatureAres[randomRangeRound(0, creatureAres.length - 1)]
    }
    else 
    {
        //that will ___________

        return creatureSentanceAbilitiesStart[2] + 
        creatureWills[randomRangeRound(0, creatureWills.length - 1)]
    }
}

var creatureAdjectives =
[
    "Living",
    "Undead",
    "Warroir-Like",
    "Peacful",
    "Rockin",
    "Giggling",
    "Snarky",
    "Lovable",
    "Human Hateing",
    "Hatefull",
    "Hatefilled",
    "Flying",
    "Thicc",
    "Intelligent",
    "Sentient",
    "Menicle",
    "Cyborg",
    "Robotic",
    "Buff",
    "Tough",
    "subterranean",
    "aquitic",
    "Book Smart",
    "Savvy",
    "Flamboyant",
    "Boyant",
    "Fire-Proof",
    "Water-Resistant",
    "Gross",

]

var householdStuff = 
[
    "Potatoes",
    "Carrots",
    "Cheese",
    "Cashews",
    "Waffles",
    "Peanuts",
    "Toilets",
    "Nuts",
    "Pine-Needles",
    "Toilet-Cleaners",
    "Sponge's",
    "Popcorn",
    "Spinach",
    "Brussel sprouts",
    "Croissants",
    "Toasts",
    "Mops",
    "Tooth-Paste",
    "Tooth-Brushes",
    "Damp Cloth",
    "Towels",
    "Mints",
    "Pasta",
    "Ravioli",
    "Pizza",
    "Couches",
    "Furniture",
    "Noodles",
    "Beef Stews",
    "Rancid Beef",
    "Turkies",
    "Ink-Bottles",
    ""
]

var lifeforms = 
[
    "Grannies",
    "Grandpas",
    "Gangsters",
    "Hippos",
    "Lions",
    "Girraffe",
    "Vin Diesel Clones",
    "Clones",
    "Owls",
    "Snakes",
    "Crustaceans",
    "Parasites" ,
    "Xenomorphs",
    "Rocks",
    "Ants",
    "Robots",
    "Sharks",
    "Ninjas",
    "Tree's",
    "Flip Flops",
    "Zombies",
    "People",
    "Film Critics",
    "Humans",
    "Creatures",
    "Trees",
    "Bushes",
    "Plants",
    "Cacti",
    "Ficusus",
    "Lilies",
    "Leaves",
    "Chickens",
    "Troll Like Creatures",
    "Turtles",
    "Shrubberies",
    "Ladies",
    "Men",
    "Bun Buns",
    "Germans",
    "French",
    "Care Bears",
    "Gaints",
    "Elfs",
    "Nerdowhels",
    "Aardvark",
    "Dwarves",
    "Cats",
    "Dogs",
    "Bats",
    "Birds",
    "Fish",
    "Dolphins", 
    "Flamingos", 
    "Sloths",
    "Rhinos",
    "Elephants",
    "Mammals",
    "Reptiles",
    "Iguanas",
    "Devil's",
    "Orcs",
    "Thieves", 
    "Mage's",
    "Wizard's",
    "Warriors", 
    "Chicken",
    "Hobbits",
    "Whales",
    "Pirates",
    "Accountants",
    "FootBall Players",
    "Tennis Players",
    "Mexican Wrestlers",
    "WWE Wrestlers",
    "Pandas",
    "Ballet Dancers",
    "Dancers",
    "Patrick Swayze Clones",
    "Lucy Liu Clones",
    "David Hasselhoff Clones",
    "Chuck Norris's Beard Hairs",
    "Alpac's",
    "Koalas",
    "Marsupials",
    "Walrus",
    "Dooly-Wols",
    "Battle-Toads",
    "Rats",
    "Mice",
    "Moose",
    "Ticks",
    "Beetles",
    "Water-Bears",
    "Roosters",
    "Big Lipped Alligators",
    "Frogs",
    "Salamanders",
    "Amphibians"
];

function elementPercent(name, percent, color)
{
    this.name = name;
    this.percent = percent;
    this.color = color;
}