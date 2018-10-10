
		varying vec2 vUv;
		
		uniform vec4 _Color;
		uniform sampler2D _MainTex;		
		
		void main()
		{
			vec2 uv = vUv;

			vec4 tex = texture2D(_MainTex, uv);
			float alpha = tex.a * _Color.a;
			
			gl_FragColor = vec4 (_Color.rgb, alpha);

		}