
		attribute vec4 tangent;

		varying vec4 color;
		varying vec4 posWorld;
		varying vec2 vUv;
		
		varying vec3 normalWorld;
		varying vec3 tangentWorld;
		varying vec3 binormalWorld;
		
		void main() 
		{	
			//modelViewMatrix
			//projectionMatrix
			//modelMatrix	- objectoWorld
			//inversemodelMatrox - normalMatrix
			vUv = uv;
			
			posWorld = (modelMatrix * (vec4(position, 1.0))); 			
			normalWorld = normalize(vec4(normal,0.0) * modelMatrix).xyz;		
			tangentWorld = normalize(tangent * modelMatrix).xyz;
			binormalWorld = normalize(cross(normalWorld, tangentWorld) * tangent.w);
			
			gl_Position = (projectionMatrix *  modelViewMatrix) * vec4(position, 1.0);

		}