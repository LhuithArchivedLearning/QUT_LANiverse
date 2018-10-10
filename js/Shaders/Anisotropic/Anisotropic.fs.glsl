		varying vec4 color;
		varying vec4 posWorld;
		varying vec3 normalWorld;
		varying vec3 tangentWorld;
		varying vec3 binormalWorld;
		varying vec2 vUv;
		varying vec3 viewDirection;
		
		uniform vec4 _Color;
		uniform vec4 _SpecColor;
		uniform float _AniX;
		uniform float _AniY;
		uniform float _Shininess;
		

		#if NUM_DIR_LIGHTS > 0
			struct DirectionalLight 
			{
				vec3 direction;
				vec3 color;
			};

			uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
		
			uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHTS ];
			varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];			
		#endif
		
		#if NUM_POINT_LIGHTS > 0
		
		struct PointLight 
			{
				vec3 color;
				vec3 position;
			};
			
			uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
		#endif
		
		uniform vec3 ambientLightColor;
					
		void main()
		{
			vec3 lightFinal  = vec3(0,0,0);
			
			float atten = 1.0;
			vec2 uv = vUv;

			//calculate normal direction
			vec3 normalDirection = normalWorld;//normalize(localCoords * local2WorldTranspose);
			
			for(int i = 0; i < NUM_DIR_LIGHTS; i++)
			{
			
				vec3 lightDirection = normalize(directionalLights[i].direction);
				
				vec3 h = normalize(lightDirection + viewDirection);
				vec3 binormalDirection = cross(normalDirection, tangentWorld);
				
				//dotProduct
				float nDotL = dot(normalDirection, lightDirection);
				float nDotH = dot(normalDirection, h);
				float nDotV = dot(normalDirection, viewDirection);
				float tDotHX = dot(tangentWorld, h) / _AniX;
				float bDotHY = dot(binormalDirection, h) / _AniY;
					
				vec3 diffuseReflection = atten * (directionalLights[i].color * 
				clamp(nDotL, 0.15, 1.0));
				
				vec3 specularReflection = diffuseReflection * exp(-(tDotHX * tDotHX + bDotHY * bDotHY)) * _Shininess;
				 
				lightFinal += diffuseReflection + specularReflection;
			}
			
			for(int i = 0; i < NUM_POINT_LIGHTS; i++)
			{
				vec3 fragmentToLightSource = pointLights[i].position.xyz - posWorld.xyz;
				float dist = length(fragmentToLightSource);
				atten = 1.0/dist;
				vec3 lightDirection = normalize(fragmentToLightSource);
				
				vec3 h = normalize(lightDirection + viewDirection);
				vec3 binormalDirection = cross(normalDirection, tangentWorld);
				
				//dotProduct
				float nDotL = dot(normalDirection, lightDirection);
				float nDotH = dot(normalDirection, h);
				float nDotV = dot(normalDirection, viewDirection);
				float tDotHX = dot(tangentWorld, h) / _AniX;
				float bDotHY = dot(binormalDirection, h) / _AniY;
					
				vec3 diffuseReflection = atten * (pointLights[i].color * 
				clamp(nDotL, 0.15, 1.0));
				
				vec3 specularReflection = diffuseReflection * exp(-(tDotHX * tDotHX + bDotHY * bDotHY)) * _Shininess;
				 
			}
			


			gl_FragColor = vec4 ((lightFinal + ambientLightColor) * _Color.rgb, 1.0);
		}