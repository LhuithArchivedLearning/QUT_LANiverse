		
		varying vec3 viewDirection;
		varying vec3 normalDirection;
		varying vec4 posWorld;
		
		void main() 
		{	
			normalDirection = normalize((vec4(normal, 0.0) * modelMatrix).xyz);
			posWorld = modelMatrix * vec4( position, 1.0 );
			
			gl_Position = (projectionMatrix *  modelViewMatrix) * vec4(position, 1.0);

		}