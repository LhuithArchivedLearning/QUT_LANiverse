		varying vec4 color;
		varying vec4 posWorld;
		varying vec3 normalDir;
		
		uniform vec4 _Color;
		uniform vec4 _SpecColor;
		uniform float _Shininess;
		uniform vec4 _RimColor;
		uniform float _RimPower;
		
		#if NUM_DIR_LIGHTS > 0
			struct DirectionalLight 
			{
				vec3 direction;
				vec3 color;
			};

			uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
			
			uniform vec3 ambientLightColor;
			
			uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHTS ];
			varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];
			
		#endif
		
		
		void main()
		{
			vec3 lightFinal  = vec3(0,0,0);
			vec3 specularReflection = vec3(0,0,0);
			vec3 diffuseReflection = vec3(0,0,0);
			
			float atten = 1.0;
			vec3 normalDirection = normalDir;
			vec3 viewDirection = normalize(cameraPosition.xyz -	posWorld.xyz);
			
			for(int i = 0; i < NUM_DIR_LIGHTS; i++)
			{
			
				vec3 lightDirection = (directionalLights[i].direction);
				
				diffuseReflection = atten * (directionalLights[i].color * 
				clamp((dot(normalDirection, lightDirection)), 0.15, 1.0));
				
				specularReflection = atten * directionalLights[i].color * 
				clamp(dot(normalDirection, lightDirection), 0.0, 1.0) *
				pow(saturate(dot(reflect(-lightDirection, normalDirection),
				viewDirection)), _Shininess);			
				
				lightFinal += diffuseReflection + specularReflection;
			}
			
			
			gl_FragColor = vec4 ((lightFinal + ambientLightColor) * _Color.rgb, 1.0);
		}