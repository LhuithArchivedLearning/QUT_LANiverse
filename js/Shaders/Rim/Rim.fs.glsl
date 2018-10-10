		varying vec4 color;
		varying vec4 posWorld;
		varying vec3 normalDir;
		varying vec3 lightDirection;
		varying vec3 lightColor;
		varying vec3 ambLight;
		
		uniform vec4 _Color;
		uniform vec4 _SpecColor;
		uniform float _Shininess;
		uniform vec4 _RimColor;
		uniform float _RimPower;
		
		void main()
		{
			vec3 lightFinal;
			
			float atten = 1.0;
			vec3 normalDirection = normalDir;
			vec3 viewDirection = normalize(cameraPosition.xyz -	posWorld.xyz);
			
			vec3 diffuseReflection = atten * lightColor * 
			clamp(dot(normalDirection, lightDirection),0.0, 1.0);
			
			vec3 specularReflection = atten * _SpecColor.rgb * 
			clamp(dot(normalDirection, lightDirection), 0.0, 1.0) *
			pow(saturate(dot(reflect(-lightDirection, normalDirection), viewDirection)), _Shininess);

			float rim = 1.0 - clamp(dot(normalize(viewDirection), normalDirection), 0.0, 1.0);
			
			vec3 rimLighting = atten * lightColor.xyz * _RimColor.rgb *
			clamp(dot(normalDirection, lightDirection), 0.0, 1.0) * pow(rim, _RimPower);
			
						
			lightFinal = rimLighting + diffuseReflection + specularReflection + ambLight;
			
			
			gl_FragColor = vec4 (lightFinal * _Color.rgb, 1.0);
		}