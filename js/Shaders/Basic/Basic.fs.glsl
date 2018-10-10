		 

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
			vec4 color;
			vec4 tex;

			vec3 sumDirLights = ((dot(normalize(directionalLights[0].direction), 
			vecNormal), 1.0) * directionalLights[0].color) * 0.4;

			float shadowValue = getShadow(directionalShadowMap[ 0 ], directionalLights[0].shadowMapSize, 
			directionalLights[0].shadowBias, directionalLights[0].shadowRadius, vDirectionalShadowCoord[0] );

			vec3 shadowVal = vec3(shadowValue,shadowValue,shadowValue);
			vec4 shadow = vec4((shadowVal), 1.0);
			vec4 light = vec4((sumDirLights), 1.0);


			if(customColorSwitch == 1)
			{
				color = customColor;
			}
			else
			{
				color = vec4(1.0, 1.0, 1.0, 1.0);
			}

			if(noTexture == 1)
			 tex = vec4(1.0, 1.0, 1.0, 1.0);
			else
			 tex = texture2D(texture, vUv);

			gl_FragColor = color * (tex) * (shadow) * vec4(sumDirLights.rgb,1.0);
		}