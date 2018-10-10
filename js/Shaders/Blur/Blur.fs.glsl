		 

		uniform vec4 _Color;
		uniform vec4 _FogColor;

		varying float depth;
		varying vec2 vuv;
		
		uniform sampler2D _MainTex;
		uniform sampler2D _BlurTex;
		
		uniform float _BlurSize;
		
		void main()
		{		
			vec4 tex = texture2D(_MainTex, vuv);
			vec4 texB = texture2D(_BlurTex, vuv);
			
			vec4 colorBlur = mix(tex, texB, depth * _BlurSize);
			//* _Color.xyz * depth * _FogColor.rgb
			gl_FragColor = vec4(colorBlur.xyz, 1.0);
		}