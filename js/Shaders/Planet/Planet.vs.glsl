		varying vec2 vUv;
		varying vec3 lightdir;
 		varying vec3 eyenorm;
 		uniform vec3 lightpos;
		
		varying vec3 vecNormal;
		varying vec3 vWorldPosition;
		varying vec3 vViewPosition;

		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHTS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];

		void main() 
		{	
			vUv = uv;
			
			vec3 transformed = vec3( position );
			vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

			vecNormal = (modelViewMatrix * vec4(normal, 0.0)).xyz;

			vec4 eyepos = modelViewMatrix * vec4 (position, 1.0);
			vec4 lighteye = viewMatrix * vec4 (lightpos, 1.0);

			
			vec4 tmp = modelViewMatrix * vec4 (lightpos, 1.0);
			lightdir = lighteye.xyz - eyepos.xyz;
			eyenorm = normalMatrix * normal;

			vec4 worldPosition = modelMatrix * vec4( transformed, 1.0 );

			 // store the world position as varying for lighting
    		vWorldPosition = worldPosition.xyz;
			vViewPosition = - mvPosition.xyz;
			
			gl_Position = projectionMatrix * mvPosition;

			for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

				vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * worldPosition;
			}
		}