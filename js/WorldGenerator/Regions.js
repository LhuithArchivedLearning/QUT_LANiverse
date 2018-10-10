function regionRoll (isclouds)
{
    if(!isclouds)
        {
            var diceroll = randomRange(0, 10);

            var NewRegion;

            if(diceroll <= 9)
            NewRegion = CreateRegion();
            else
            {
                var diceroll = randomRange(0, 10);
                
                if(diceroll <= 1)
                {
                    NewRegion = deadrock;
                }
                else if(diceroll <= 2)
                {
                    NewRegion = rock;
                }
                else if(diceroll <= 3)
                {
                    NewRegion = primordial;
                }
                else if(diceroll <= 4)
                {
                    NewRegion = frozen;
                }
                else if(diceroll <= 5)
                {
                    NewRegion = liqiud_mathane;
                }
                else
                {
                    NewRegion = lush;
                   
                }
            }
            //NewRegion = peepee;
        }
        else
        NewRegion = cloud; 
    
  
    NewRegion.isGassy = SortGassyBools(NewRegion);

    return NewRegion;
}


function CreateRegion()
{
    var colors = ColorPalletes[Math.round(randomRange(1, ColorPalletes.length -1))];
    //var colors =  ColorPalletes[ColorPalletes.length -1];
    var numRegions = randomRange(colors.length,colors.length); // Expand later
    var data = [];
    var prevoisLevel;
    var currentLevel = randomRange(0.04, 0.3);
    for(var i = 0; i < numRegions; i++)
    {
        if(i == 0)
        {
            prevoisLevel = 0;
            currentLevel = 0;
        }
        else
        {
            currentLevel = randomRange(prevoisLevel, prevoisLevel + randomRange(0.1, 0.5));
            prevoisLevel = currentLevel;
        }
        data.push
        (
            new TerrainType("base", currentLevel) //Water be here
        )
    }

    var roll = (randomRange(0, 10));

    if(roll > 9.5)
    {
        colors[0] = ColorPalletes[Math.round(randomRange(1, ColorPalletes.length -1))][Math.round(randomRange(0, 4))];
        colors[1] = ColorPalletes[Math.round(randomRange(1, ColorPalletes.length -1))][Math.round(randomRange(0, 4))];
        colors[2] = ColorPalletes[Math.round(randomRange(1, ColorPalletes.length -1))][Math.round(randomRange(0, 4))];
        colors[3] = ColorPalletes[Math.round(randomRange(1, ColorPalletes.length -1))][Math.round(randomRange(0, 4))];
        colors[4] = ColorPalletes[Math.round(randomRange(1, ColorPalletes.length -1))][Math.round(randomRange(0, 4))];
    }

    return new RegionInformation
    (
        colors , data ,
        0, 0, true, "",  3, ''
    );
}


function SortGassyBools(NewRegion)
{
    var bool;

    if(NewRegion.isGassy == 3)
        {
            var roll = randomRange(0, 10);

            if(roll >= 8.5)
            {
                bool = true;
            }
            else
            {
                bool = false;
            }
  
        }
        else if(NewRegion.isGassy == 0)
        {
            bool = false;
        }
        else if(NewRegion.isGassy == 1)
        {
            bool = true;
        }

        return bool;
}

function RegionInformation(ColorPallette, Data, atmoSize, atmoThickness, 
                            hasLiquad, name, isGassy, customUrl)
{
    this.ColorPallette = ColorPallette;
    this.Data = Data;
    this.atmoSize = atmoSize;
    this.atmoThickness = atmoThickness;
    this.hasLiquad = hasLiquad;
    this.name = name;
    this.isGassy = isGassy;
    this.customUrl = customUrl;
}


//Customs Boimes
var cloud = new RegionInformation(
    ColorPalletes[0],
[
 new TerrainType("water deep", 0),
 new TerrainType("water shallow", 0.5)
], 
0, 0, true, "cloud", 0, ''
)
;


var lush = new RegionInformation(
    ColorPalletes[1],
[
 new TerrainType("water deep", 0),
 new TerrainType("water shallow", 0.51),
 new TerrainType("sand", .56),
 new TerrainType("grass", .6),
 new TerrainType("rocky", .75),
 new TerrainType("snowy", .83),
], 0, 0, true, "lush", 0, ''
)
;

var rock = new RegionInformation(
    ColorPalletes[4],
[
 new TerrainType("water deep", 0),
 new TerrainType("water deep", 0.1),
 new TerrainType("water deep", 0.2),
 new TerrainType("water shallow", 0.3),
 new TerrainType("sand", .56),
 new TerrainType("grass", .6),
 new TerrainType("rocky", .75),
 new TerrainType("snowy", .83)
], 0, 0, true, "rock", 0, ''
)
;

var primordial = new RegionInformation(
    ColorPalletes[6],
[
 new TerrainType("sand deep", 0),
 new TerrainType("water shallow", 0.35),
 new TerrainType("sand", .45),
 new TerrainType("grass", .48),
 new TerrainType("rocky", .52),
 new TerrainType("sand", .56),
 new TerrainType("grass", .6),
 new TerrainType("rocky", .75),
 new TerrainType("snowy", .83),
], 0, 0, true,"primordial", 0, ''
)
;

var frozen = new RegionInformation(
    ColorPalletes[7],
[
 new TerrainType("water deep", 0),
 new TerrainType("water shallow", .12),
 new TerrainType("sand", .23),
 new TerrainType("grass", .34),
 new TerrainType("rocky", .56),
 new TerrainType("water deep", .64),
 new TerrainType("water shallow", .75),
 new TerrainType("sand", .9),
], 0, 0, true,"frozen", 3, ''
)
;

var liqiud_mathane = new RegionInformation(
    ColorPalletes[10],
[
new TerrainType("ring", 0),
new TerrainType("ring2", 0.025),
new TerrainType("ring2", 0.05),
new TerrainType("ring2", 0.075),
new TerrainType("ring", 0.2),
new TerrainType("ring", 0.4),
new TerrainType("ring2", 0.425),
new TerrainType("ring2", 0.45),
new TerrainType("ring2", 0.475),
new TerrainType("ring", 0.5),
new TerrainType("ring", 0.6),
new TerrainType("ring2", 0.625),
new TerrainType("ring2", 0.65),
new TerrainType("ring2", 0.675),
new TerrainType("ring", 0.9),
], 0, 0, true,"liqiud_mathane", 1, ''
)
;

var deadrock =  new RegionInformation(
    ColorPalletes[18],
[
 new TerrainType("water deep", 0),
 new TerrainType("water shallow", 0.1),
 new TerrainType("sand", .53),
 new TerrainType("water shallow"),
 new TerrainType("rocky", .75),
 new TerrainType("grass", .77),
 new TerrainType("rocky", .9),
], 0, 0, true,"deadrock", 0, ''
)
;

var lovePatch =  new RegionInformation(
    ColorPalletes[ColorPalletes.length - 7],
[
 new TerrainType("water deep", 0),
 new TerrainType("water shallow", 0.1),
 new TerrainType("sand", .53),
 new TerrainType("water shallow", 0.6),
 new TerrainType("rocky", 0.7),
], 0, 0, true,"deadrock", 0,  'img/Maps/12670-bump.jpg'
);

var peepee =  new RegionInformation(
    ColorPalletes[ColorPalletes.length - 30],
[
 new TerrainType("water deep", 0),
 new TerrainType("water shallow", 0.1),
 new TerrainType("sand", .53),
 new TerrainType("water shallow", 0.6),
 new TerrainType("rocky", 0.7),
], 0, 0, true,"deadrock", 0,  'img/Maps/poonus_map.png'
);
