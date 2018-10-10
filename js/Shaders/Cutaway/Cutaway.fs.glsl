		 

		uniform vec4 _Color;
		uniform float _Height;
		
		varying vec4 vertPos;
		
		void main()
		{
		
			if(vertPos.y > _Height)
			{
				discard;
			}
			
			gl_FragColor = _Color;
		}