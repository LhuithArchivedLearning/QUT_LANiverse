function getImageData( image )
{
   
       var canvas = document.createElement( 'canvas' );
       canvas.width = image.width;
       canvas.height =  image.height;
   
       var context = canvas.getContext( '2d' );
       context.drawImage( image, 0, 0 );
   
       return context.getImageData( 0, 0, image.width, image.height );
   
   }

   function getPixel( imagedata, x, y ) 
   {
       
       var position = ( x + imagedata.width * y ) * 4, data = imagedata.data;
       return { r: data[ position ], g: data[ position + 1 ], b: data[ position + 2 ], a: data[ position + 3 ] };

   }

    function GenerateMapFromTexture(texture, regions, size, material, vertex_text, fragment_text)
    {

        var colorMap = new Array();
        var clampedMap = new Array();
        var colors;
        var noiseMapTexture = new Array();
        var texture;
        var imagedata;
         
        for(var x = 0; x < size; x++)
            {
                 clampedMap[x] = new Array();
   
               for(var y = 0; y < size; y++)
               {
                   clampedMap[x][y] = 0;
      
               }
           }

            for(var x = 0; x < size; x++)
                {
                    noiseMapTexture[x] = new Array();
       
                   for(var y = 0; y < size; y++)
                   {
                    noiseMapTexture[x][y] = 0;
          
                   }
               }

                imagedata = getImageData(texture.image);

                for(var u = 0; u < size; u++)
                {
                    for(var k = 0; k < size; k++)
                    {

                        noiseMapTexture[u][k] =  getPixel(imagedata, u, k).r/255;                   
                    }
                }

        for(var y = 0; y < size; y++)
        {          
            for(var x = 0; x < size; x++)
            {
                var currentHeight = noiseMapTexture[x][y];
          
                for(var i = 0; i < regions.Data.length; i++)
                {
                   
                    if(currentHeight >= regions.Data[i].height)
                    {
                        colorMap[y * size + x] = regions.ColorPallette[i].RGB;     
                    }
                    else
                    {   
                        break;
                    }
                }
            }
        }

        var finalmap = new Array(colorMap.length * 3);

        for(var i = 0; i < finalmap.length; i+=3)
            {

                finalmap[i] =      colorMap[i / 3].r;
                finalmap[i + 1] =  colorMap[i / 3].g;
                finalmap[i + 2] =  colorMap[i / 3].b;

            } 

            var datamap = createDataMap(finalmap, size);

            var uniform = createUniforms(datamap);
    
             PlanetMaterial = new THREE.ShaderMaterial 
             ({
                uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib['lights'], 
                uniform ]),
                vertexShader: vertex_text,
                fragmentShader: fragment_text,
                lights : true           
            });
    
            PlanetMaterial.uniforms.texture.value = datamap;

            var cube = new THREE.CubeGeometry( 200, 200, 200 );
            var ico = new THREE.IcosahedronGeometry(planetSize, 4);
    
            planet = new THREE.Mesh(cube, 
            PlanetMaterial );
            planet.castShadow = true; //default is false
            planet.receiveShadow = true; //default
            MainScene.add(planet);
    }

    
    function SetupTextureFunction(texture, custom)
    {
        GenerateMapFromTexture(texture, custom.region, custom.size, custom.mat, 
            custom.vert, custom.frag);
    }

    function CustomTextureLoader (texture_url, custom, onLoad, Custom, onProgress, onError)   
    {
        //custom is just a object with information
        //better to do it as a large clump of info then 6 parametres
        //maybe?
        var textLoader =  new THREE.TextureLoader();
        textLoader.load(texture_url, function (texture)
        {    
        onLoad(texture, custom);
        }, onProgress, onError);
    }

