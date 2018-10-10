
		

		varying vec4 color;
		varying vec4 posWorld;
		varying vec3 normalDir;

		void main() 
		{	
			//modelViewMatrix
			//projectionMatrix
			//modelMatrix		
			posWorld = (modelMatrix * (vec4(position, 1.0))); 			
			normalDir =normalize(vec4(normal,0.0) * modelMatrix).xyz;			
			gl_Position = (projectionMatrix *  modelViewMatrix) * vec4(position, 1.0);

		}