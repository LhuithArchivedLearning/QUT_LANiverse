		varying vec4 color;
		varying vec4 posWorld;
		varying vec3 normalDir;
		varying vec2 vUv;
		
		uniform vec4 _Color;
		uniform vec4 _SpecColor;
		uniform float _Shininess;
		uniform vec4 _RimColor;
		uniform float _RimPower;
		
		uniform sampler2D _MainTex;		
		uniform sampler2D _NormTex;
		
		#if NUM_DIR_LIGHTS > 0
			struct DirectionalLight 
			{
				vec3 direction;
				vec3 color;
			};

			uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
		
			
			uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHTS ];
			varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];
			
		#endif
		
		#if NUM_POINT_LIGHTS > 0
		
		struct PointLight 
			{
				vec3 color;
				vec3 position;
			};
			
			uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
		#endif
		
		uniform vec3 ambientLightColor;
					
		void main()
		{
			vec3 lightFinal  = vec3(0,0,0);
			
			float atten = 1.0;
			vec2 uv = vUv;
			
			vec3 normalDirection = normalDir;
			vec3 viewDirection = normalize(cameraPosition.xyz -	posWorld.xyz);
	
			for(int i = 0; i < NUM_DIR_LIGHTS; i++)
			{
			
				vec3 lightDirection = normalize(directionalLights[i].direction);
				
				vec3 diffuseReflection = atten * (directionalLights[i].color * 
				clamp((dot(normalDirection, lightDirection)), 0.15, 1.0));
				
				vec3 specularReflection = atten * directionalLights[i].color * 
				clamp(dot(normalDirection, lightDirection), 0.0, 1.0) *
				pow(saturate(dot(reflect(-lightDirection, normalDirection),
				viewDirection)), _Shininess);			
				
				lightFinal += diffuseReflection + specularReflection;
			}
			
			for(int i = 0; i < NUM_POINT_LIGHTS; i++)
			{
				vec3 fragmentToLightSource = pointLights[i].position.xyz - posWorld.xyz;
				float dist = length(fragmentToLightSource);
				atten = 1.0/dist;
				vec3 lightDirection = normalize(fragmentToLightSource);
				
				vec3 diffuseReflection = atten * (pointLights[i].color * 
				clamp((dot(normalDirection, lightDirection)), 0.15, 1.0));
				
				vec3 specularReflection = atten * pointLights[i].color * 
				clamp(dot(normalDirection, lightDirection), 0.0, 1.0) *
				pow(clamp((dot(reflect(-lightDirection, normalDirection),
				viewDirection)), 0.0, 1.0), _Shininess);			
				
				lightFinal += diffuseReflection + specularReflection;
			}
			

		    vec4 tex = texture2D(_MainTex, uv);
			gl_FragColor = vec4 ((lightFinal + ambientLightColor) * _Color.rgb, 1.0) * tex;
		}