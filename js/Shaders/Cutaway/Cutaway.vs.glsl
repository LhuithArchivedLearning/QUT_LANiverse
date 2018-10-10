		varying vec4 vertPos;
		
		void main() 
		{	
				vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
				gl_Position = projectionMatrix * mvPosition;
				vertPos = vec4 (position, 1.0);
		}