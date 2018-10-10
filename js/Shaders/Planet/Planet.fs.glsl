		 

varying vec3 lightdir;
varying vec3 eyenorm;
uniform sampler2D texture;		 	
varying vec2 vUv;

varying vec3 vecNormal;
varying vec3 vWorldPosition;
uniform int noTexture;
uniform vec4 customColor;
uniform int customColorSwitch;

		//Refer the Text Parse in Main.js, replaced this Sexy Text with Dither Methods,
		//I just didnt want it cluttering shizz up
		//Basicaling just pointers to the shadow and dither methods
		AddShadow
		//AddDither
	
		#if NUM_DIR_LIGHTS > 0
		struct DirectionalLight 
		{
			vec3 direction;
			vec3 color;
			int shadow;
			float shadowBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};

		uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHTS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];

		#endif
		void main()
		{
			vec3 sumDirLights = (clamp(dot(normalize(directionalLights[0].direction), 
			vecNormal), 0.0, 0.65) * directionalLights[0].color) * 1.1;

			float shadowValue = getShadow(directionalShadowMap[ 0 ], directionalLights[0].shadowMapSize, 
			directionalLights[0].shadowBias, directionalLights[0].shadowRadius, vDirectionalShadowCoord[0] );

			vec3 shadowVal = vec3(shadowValue,shadowValue,shadowValue);
			vec4 shadowDither = vec4(dither(shadowVal), 1.0);
			vec4 light = vec4(dither(sumDirLights), 1.0);
			vec4 color;

			if(customColorSwitch == 1)
			{
				color = customColor;
			}
			else
			{
				color = vec4(1.0, 1.0, 1.0, 1.0);
			}

			vec4 tex = texture2D(texture, vUv);
			
			gl_FragColor = color * (tex) * (shadowDither) * vec4(light.rgb,1.0);
		}