
		

		varying vec4 color;
		varying vec4 posWorld;
		varying vec3 normalDirection;
		varying vec3 viewDirection;
		
		void main() 
		{	
			//modelViewMatrix
			//projectionMatrix
			//modelMatrix		
			posWorld = (modelMatrix * (vec4(position, 1.0))); 			
			normalDirection = normalize((vec4(normal, 0.0) * modelMatrix).xyz);	
			viewDirection = normalize(cameraPosition.xyz -	posWorld.xyz);
	
			gl_Position = (projectionMatrix *  modelViewMatrix) * vec4(position, 1.0);

		}