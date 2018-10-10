		 

		uniform vec4 _Color;
		uniform vec4 _FogColor;


		varying float depth;
		
		void main()
		{		
			gl_FragColor = vec4(depth * _FogColor.rgb + _Color.xyz, 1.0);
		}