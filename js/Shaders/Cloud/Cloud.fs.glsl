
varying vec3 lightdir;
varying vec3 eyenorm;
uniform sampler2D texture;		
uniform vec3 color; 	
varying vec2 vUv;
uniform vec3 lightpos;
varying vec4 eyepos;

varying vec3 vecNormal;
varying vec3 vWorldPosition;


		//Although looks random as fuck, its being parsed//recplaced with Shadow.glsl, 
		//refer to mains callback async nested bumb 
		AddShadow		
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

			vec3 lightDirection = normalize(directionalLights[0].direction - vWorldPosition);

			vec3 sumDirLights = clamp( dot( directionalLights[0].direction, 
			vecNormal ), 0.0, .75 ) * directionalLights[0].color  * 1.0;

			float shadowValue = getShadow(directionalShadowMap[ 0 ], directionalLights[0].shadowMapSize, 
			directionalLights[0].shadowBias, directionalLights[0].shadowRadius, vDirectionalShadowCoord[0] );


			vec4 tex = texture2D(texture, vUv);
			if (tex.r == 0.0) 
			discard;

			gl_FragColor =  (tex * 
			vec4(color.r/255.0, color.g/255.0, color.b/255.0, 1.0)) * 
			vec4(sumDirLights, 0.6) * shadowValue;
		}