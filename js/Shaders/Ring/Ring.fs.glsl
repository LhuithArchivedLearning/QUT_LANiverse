
		varying vec3 lightdir;
		varying vec3 eyenorm;
		uniform vec3 color; 	
		varying vec2 vUv;
		varying vec4 eyepos;

		varying vec3 vecNormal;
		varying vec3 vWorldPosition;
		uniform float ringLimits[5];
		uniform float transparency[5];
		uniform vec3 colors[5];
		//Although looks random as fuck, its being parsed//recplaced with Shadow.glsl, 
		//refer to mains callback async nested bumb 
		AddShadow
		AddDither		
		//--------------------------------------------------------------------
		//-------------------------------------------------------------------
		
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

			vec4 col;

			if(vUv.x >= 0.0)
			col = vec4(colors[0].x /255.0,colors[0].y/255.0, colors[0].z/255.0, transparency[0]);

			if(vUv.x >= ringLimits[0])
			col = vec4(colors[1].x/255.0 ,colors[1].y/255.0, colors[1].z/255.0, transparency[1]);

			if(vUv.x >= ringLimits[1])
			col = vec4(colors[2].x /255.0,colors[2].y/255.0, colors[2].z/255.0, transparency[2]);


			vec4 ditherCol = vec4(dither(col.rgb), 1.0);

			vec3 lightDirection = normalize(directionalLights[0].direction - vWorldPosition);

			vec3 sumDirLights = clamp( dot( directionalLights[0].direction, 
			vecNormal ), 0.0, 1.0 ) * directionalLights[0].color  * 1.0;

			float shadowValue = getShadow(directionalShadowMap[ 0 ], directionalLights[0].shadowMapSize, 
			directionalLights[0].shadowBias, directionalLights[0].shadowRadius, vDirectionalShadowCoord[0] );

			vec4 ditherShadow =  vec4(dither(vec3(shadowValue, shadowValue, shadowValue)), 1.0);
			vec4 ditherLight =  vec4(dither(sumDirLights), 1.0);

			vec3 finalCol = col.rgb * ditherShadow.rgb;

			gl_FragColor =  vec4(ditherShadow.rgb, 1.0) * vec4(col);
		}