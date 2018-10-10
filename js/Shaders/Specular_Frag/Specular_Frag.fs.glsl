		varying vec4 color;
		varying vec4 posWorld;
		varying vec3 normalDir;
		varying vec3 lightDirection;
		varying vec3 lightColor;
		varying vec3 ambLight;
		
		uniform vec4 _Color;
		uniform vec4 _SpecColor;
		uniform float _Shininess;
		
		void main()
		{
			vec3 lightFinal;
			
			float atten = 1.0;
			vec3 normalDirection = normalDir;
			vec3 viewDirection = normalize(vec3(vec4(cameraPosition.xyz, 1.0) -	posWorld));
			
			vec3 diffuseReflection = atten * lightColor * _Color.rgb * 
			max(0.0, dot(normalDirection, lightDirection));
			
			vec3 specularReflection = atten * _SpecColor.rgb * max(0.0, dot(normalDirection, lightDirection)) *
			pow(max(0.0, dot(reflect(-lightDirection, normalDirection), viewDirection)), _Shininess);
			
			lightFinal = diffuseReflection + specularReflection + ambLight;
					
			gl_FragColor = vec4 (lightFinal * _Color.rgb, 1.0);
		}