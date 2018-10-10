
		varying vec3 normalDirection;
		varying vec4 posWorld;
		uniform vec4 _Color;
		uniform samplerCube _Cube;
		
		void main()
		{
			vec3 viewDirection = normalize(cameraPosition.xyz -	posWorld.xyz);
			vec3 reflectDir = reflect(viewDirection, normalDirection);
			
			vec4 texC = textureCube(_Cube, reflectDir);
		
			gl_FragColor = texC  * _Color;
		}