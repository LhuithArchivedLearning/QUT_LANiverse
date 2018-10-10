	//	    // The following built-in uniforms (except _LightColor0 and 
    //  // _LightMatrix0) are also defined in "UnityCG.glslinc", 
    //  // i.e. one could #include "UnityCG.glslinc" 
    //  uniform vec4 _Time, _SinTime, _CosTime; // time values from Unity
    //  uniform vec4 _ProjectionParams;
    //     // x = 1 or -1 (-1 if projection is flipped)
    //     // y = near plane; z = far plane; w = 1/far plane
    //  uniform vec4 _ScreenParams; 
    //     // x = width; y = height; z = 1 + 1/width; w = 1 + 1/height
    //  uniform vec4 unity_Scale; // w = 1/scale; see _World2Object
    //  uniform vec3 _WorldSpaceCameraPos;
    //  uniform mat4 _Object2World; // model matrix
    //  uniform mat4 _World2Object; // inverse model matrix 
    //     // (all but the bottom-right element have to be scaled 
    //     // with unity_Scale.w if scaling is important) 
    //  uniform vec4 _LightPositionRange; // xyz = pos, w = 1/range
    //  uniform vec4 _WorldSpaceLightPos0; 
    //     // position or direction of light source
    //  uniform vec4 _LightColor0; // color of light source 
    //  uniform mat4 _LightMatrix0; // matrix to light space
		
		
		varying vec4 color;
		varying vec4 posWorld;
		varying vec3 normalWorld;
		varying vec3 tangentWorld;
		varying vec3 binormalWorld;
		varying vec2 vUv;
		
		uniform vec4 _Color;
		uniform vec4 _SpecColor;
		uniform float _Shininess;
		uniform vec4 _RimColor;
		uniform float _RimPower;
		uniform float _BumpDepth;
		uniform float _EmitStrength;
		
		uniform sampler2D _EmitMap;
		uniform sampler2D _MainTex;		
		uniform sampler2D _NormTex;
		
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
			
			//vec3 normalDirection = normalWorld;
			vec3 viewDirection = normalize(cameraPosition.xyz -	posWorld.xyz);
			
			vec4 tex = texture2D(_MainTex, uv);
			vec4 texN = texture2D(_NormTex, uv);
			vec4 texE = texture2D(_EmitMap, uv);
			
			//unpack Normal
			vec3 localCoords = vec3(2.0 * texN.ag - vec2(1.0,1.0), 0.0);
			localCoords.z = (1.0 - 0.5 * dot(localCoords, localCoords));
			
			//normal transpose matrix
			mat3 local2WorldTranspose = mat3
			(
				tangentWorld,
				binormalWorld,
				normalWorld
			);
			
			//calculate normal direction
			vec3 normalDirection = normalize(localCoords * local2WorldTranspose);
			
			for(int i = 0; i < NUM_DIR_LIGHTS; i++)
			{
			
				vec3 lightDirection = normalize(directionalLights[i].direction);
				
				vec3 diffuseReflection = atten * (directionalLights[i].color * 
				clamp((dot(normalDirection, lightDirection)), 0.15, 1.0));
				
				vec3 specularReflection = atten * directionalLights[i].color * 
				clamp(dot(normalDirection, lightDirection), 0.0, 1.0) *
				pow(saturate(dot(reflect(-lightDirection, normalDirection),
				viewDirection)), _Shininess);			
				
				lightFinal += diffuseReflection + (specularReflection * tex.a);
			}
			
			for(int i = 0; i < NUM_POINT_LIGHTS; i++)
			{
				vec3 fragmentToLightSource = pointLights[i].position.xyz - posWorld.xyz;
				float dist = length(fragmentToLightSource);
				atten = 1.0/dist;
				vec3 lightDirection = normalize(fragmentToLightSource);
				
				vec3 diffuseReflection = atten * (pointLights[i].color * 
				clamp((dot(normalDirection, lightDirection)), 0.15, 1.0));
				
				vec3 specularReflection = atten * pointLights[i].color * 
				clamp(dot(normalDirection, lightDirection), 0.0, 1.0) *
				pow(clamp((dot(reflect(-lightDirection, normalDirection),
				viewDirection)), 0.0, 1.0), _Shininess);			
				
				lightFinal += diffuseReflection + (specularReflection * tex.a);
			}
			
			
			
			gl_FragColor = vec4 ((lightFinal + ambientLightColor + (texE.xyz * _EmitStrength)) * _Color.rgb, 1.0) * tex;
		}