
		
		#if NUM_DIR_LIGHTS > 0
		struct DirectionalLight 
		{
			vec3 direction;
			vec3 color;
			int shadow;
			float shadowBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};

		uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
		
		uniform vec3 ambientLightColor;
		
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHTS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];
		
		#endif
		
		varying vec4 color;
		varying vec4 posWorld;
		varying vec3 normalDir;
		varying vec3 lightDirection;
		varying vec3 lightColor;
		varying vec3 ambLight;
		varying vec3 viewDirection;
		
		uniform float u_time;
		uniform float _AnimSpeed;
		uniform float _AnimFreq;
		uniform float _AnimationPowerX;
		uniform float _AnimationPowerY;
		uniform float _AnimationPowerZ;
		uniform float _AnimOffSetX;
		uniform float _AnimOffSetY;
		uniform float _AnimOffSetZ;
			
			
		void main() 
		{	
			vec3 animOffset = vec3(_AnimOffSetX, _AnimOffSetY, _AnimOffSetZ) * position.xyz;
			vec3 animPower = vec3(_AnimationPowerX, _AnimationPowerY, _AnimationPowerZ);
			vec4 newPos = vec4 (position, 1.0);
			
			newPos.xyz = newPos.xyz + sin(u_time * _AnimSpeed + 
			(animOffset.x + animOffset.y + animOffset.z) * _AnimFreq) * animPower.xyz;
			
			
			normalDir = normalize((vec4(normal, 0.0) * modelMatrix).xyz);	
			
			gl_Position = (projectionMatrix *  modelViewMatrix) * newPos;
			
			ambLight = ambientLightColor;
			
			lightColor = directionalLights[0].color;	
			
			posWorld = (modelMatrix * (vec4(position, 1.0))); 		

			viewDirection = normalize(vec3(vec4(cameraPosition.xyz, 1.0) -	posWorld));
			
			lightDirection = normalize(directionalLights[0].direction);
		}