		uniform vec4 _Color;
		
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
		
		void main() 
		{	
			//modelViewMatrix
			//projectionMatrix
			//modelMatrix

			vec3 normalDirection = normalize((vec4(normal, 0.0) * modelMatrix).xyz);
			vec3 lightDirection;
			vec3 lightFinal;
			
			float atten = 1.0;

			lightDirection = normalize(directionalLights[0].direction);
		
			vec3 diffuseReflection = atten * directionalLights[0].color * _Color.rgb * 
			max(0.0, dot(normalDirection, lightDirection));
			
			lightFinal = diffuseReflection + ambientLightColor;
			
			
			color = vec4(lightFinal, 1.0);
			gl_Position = (projectionMatrix *  modelViewMatrix) * vec4(position, 1.0);

		}