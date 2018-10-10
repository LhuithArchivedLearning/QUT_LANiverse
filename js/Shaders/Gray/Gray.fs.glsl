
		varying vec4 posWorld;
		varying vec3 normalDir;
		varying vec2 vUv;
		
		uniform sampler2D _MainTex;		
		uniform float u_time;
		
		void main()
		{
			float atten = 1.0;
			vec2 uv = vUv;
	
			vec4 orgCol = texture2D(_MainTex, uv);
			
		    float avg = (orgCol.r + orgCol.g + orgCol.b)/3.0;
			vec4 col = vec4(avg, avg, avg, 1.0);
			
			
			vec4 finalCol = mix(col, orgCol, sin(u_time));
			
			gl_FragColor = finalCol;
		}