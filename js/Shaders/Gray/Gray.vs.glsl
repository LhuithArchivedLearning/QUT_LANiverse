
		

		varying vec4 color;
		varying vec4 posWorld;
		varying vec3 normalDir;
		varying vec2 vUv;
		
		void main() 
		{	
			//modelViewMatrix
			//projectionMatrix
			//modelMatrix	
			vUv = uv;
			posWorld = (modelMatrix * (vec4(position, 1.0))); 			
			normalDir = normalize(normal * normalMatrix);		
			gl_Position = (projectionMatrix *  modelViewMatrix) * vec4(position, 1.0);

		}