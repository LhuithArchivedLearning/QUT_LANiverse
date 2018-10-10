
    function GenerateNoise2DMap(mapWidth, mapHeight, seed, scale, octaves, persistance, lacunarity, offset)
    {
        var  noiseMap =  new Array();
        
        var prng = Math.random(seed);

        var octaveOffsets = new Array(octaves);
        
        var maxPossibleHeight = 0;
        var amplitude = 1;
        var frequency = 1;

        for(var i = 0; i < octaves; i ++)
        {
            var offsetX = randomRange(-100000, 100000) + offset.x;
            var offsetY = randomRange(-100000, 100000) - offset.y;
            octaveOffsets[i] = new Vector2 (offsetX, offsetY);
            
            maxPossibleHeight += amplitude;
            amplitude *= persistance;
        }
       

        scale = (scale <= 0) ? 0.0001 : scale; 

        var maxLocalNoiseHeight = Number.MIN_VALUE;
        var minLocalNoiseHeight = Number.MAX_VALUE;
        
        var halfWidth = mapWidth / 2;
        var halfHeight = mapHeight / 2;

        for(var x = 0; x < mapHeight; x++)
        {
            noiseMap[x] = new Array();
            
            for(var y = 0; y < mapWidth; y++)
            { 
                 noiseMap[x][y] = 0;
            }
        }
        

        for(var y = 0; y < mapHeight; y++)
        {
            for(var x = 0; x < mapWidth; x++)
            {        
                amplitude = 1;
                frequency = 1;
                var noiseHeight = 0;
                
                for(var i = 0; i < octaves; i ++)
                {
                    
                var sampleX = (x - halfWidth + octaveOffsets[i].x) / scale * frequency;
                var sampleY = (y - halfHeight + octaveOffsets[i].y) / scale * frequency;
        
                
                //Correct Noise Value Range
                var perlinValue = noise.perlin2(sampleX, sampleY);

                noiseHeight += perlinValue * amplitude;
                
                amplitude *= persistance;
                frequency *= lacunarity;            
                }
                
                if(noiseHeight > maxLocalNoiseHeight)
                {
                    maxLocalNoiseHeight = noiseHeight;                
                }

                 if(noiseHeight < minLocalNoiseHeight)
                {
                    minLocalNoiseHeight = noiseHeight;
                }    

                noiseMap[x][y] = noiseHeight;             
            }
        }       


        var finalMap = [];

        for(var y = 0; y < mapHeight; y++)
             {
                for(var x = 0; x < mapWidth; x++)
                {   
                    noiseMap[x][y] = Normalize(minLocalNoiseHeight, maxLocalNoiseHeight, noiseMap[x][y]);
                } 
             }

        return  noiseMap;
    }
