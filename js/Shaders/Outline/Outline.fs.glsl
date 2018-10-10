		varying vec4 color;
		varying vec4 posWorld;
		varying vec3 normalDirection;
		varying vec3 viewDirection;
			
		uniform vec4 _Color;
		uniform vec4 _SpecColor;
		uniform float _Shininess;
		
		uniform vec4 _UnlitColor;
		uniform float _DiffuseThreshold;
		uniform float _Diffusion;
		uniform float _SpecDiffusion;
		
	    uniform vec4 _OutlineColor;
		uniform float _OutlineThickness;
		uniform float _OutlineDiffusion;
	
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
			

			vec3 lightDirection = normalize(directionalLights[0].direction);
			
			float nDotL = clamp((dot(normalDirection, lightDirection)), 0.0, 1.0);
			
			float diffuseCutoff = clamp(((max(_DiffuseThreshold, nDotL) - _DiffuseThreshold)
			* pow((2.0 - _Diffusion), 10.0)), 0.0, 1.0);
			
			float specularCutoff = clamp(((max(_Shininess, dot(reflect(-lightDirection, normalDirection),
			 viewDirection))- _Shininess)* pow((2.0 - _SpecDiffusion), 10.0)), 0.0, 1.0);
			
			float outlineStrengh = clamp(((dot(normalDirection, viewDirection) - _OutlineThickness)
			* pow((2.0 - _OutlineDiffusion), 10.0) + _OutlineThickness),0.0, 1.0);
			
			vec3 outlineOverlay = (_OutlineColor.rgb *(1.0 - outlineStrengh)) + outlineStrengh;
			
			
			vec3 ambientLight = (1.0 - diffuseCutoff) * _UnlitColor.xyz;
			vec3 diffuseReflection = (1.0 - specularCutoff) * _Color.xyz * diffuseCutoff;
			vec3 specularReflection = _SpecColor.xyz * specularCutoff;
			
			lightFinal = (ambientLight + diffuseReflection) * outlineOverlay + specularReflection;

		
			
			gl_FragColor = vec4 ((lightFinal), 1.0);
		}