
		
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
		
		uniform vec3 ambientLightColor;
		
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHTS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];
		
		#endif
		
		varying vec4 color;
		varying vec4 posWorld;
		varying vec3 normalDir;
		varying vec3 lightDirection;
		varying vec3 lightColor;
		varying vec3 ambLight;
		
		void main() 
		{	
			//modelViewMatrix
			//projectionMatrix
			//modelMatrix
			ambLight = ambientLightColor;
			lightColor = directionalLights[0].color;			
			posWorld = (modelMatrix * (vec4(position, 1.0))); 			
			normalDir = normalize((vec4(normal, 0.0) * modelMatrix).xyz);		
	
			lightDirection = normalize(directionalLights[0].direction);

			gl_Position = (projectionMatrix *  modelViewMatrix) * vec4(position, 1.0);

		}