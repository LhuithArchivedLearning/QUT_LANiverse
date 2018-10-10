
		#define SHADOWMAP_TYPE_PCF_SOFT
		#define SHADOWMAP_TYPE_PCF

		vec3 packNormalToRGB( const in vec3 normal ) {
		return normalize( normal ) * 0.5 + 0.5;
		}

		vec3 unpackRGBToNormal( const in vec3 rgb ) {
		return 1.0 - 2.0 * rgb.xyz;
		}

		const float PackUpscale = 256. / 255.; // fraction -> 0..1 (including 1)
		const float UnpackDownscale = 255. / 256.; // 0..1 -> fraction (excluding 1)

		const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );
		const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );

		const float ShiftRight8 = 1. / 256.;

		vec4 packDepthToRGBA( const in float v ) {
		vec4 r = vec4( fract( v * PackFactors ), v );
		r.yzw -= r.xyz * ShiftRight8; // tidy overflow
		return r * PackUpscale;
		}

		float unpackRGBAToDepth( const in vec4 v ) {
		return dot( v, UnpackFactors );
		}

		// NOTE: viewZ/eyeZ is < 0 when in front of the camera per OpenGL conventions

		float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
		return ( viewZ + near ) / ( near - far );
		}
		float orthographicDepthToViewZ( const in float linearClipZ, const in float near, const in float far ) {
		return linearClipZ * ( near - far ) - near;
		}

		float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
		return (( near + viewZ ) * far ) / (( far - near ) * viewZ );
		}
		float perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {
		return ( near * far ) / ( ( far - near ) * invClipZ - far );
		}



		float texture2DCompare( sampler2D depths, vec2 uv, float compare ) 
		{

			return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );

		}

		float texture2DShadowLerp( sampler2D depths, vec2 size, vec2 uv, float compare ) {

			const vec2 offset = vec2( 0.0, 1.0 );

			vec2 texelSize = vec2( 1.0 ) / size;
			vec2 centroidUV = floor( uv * size + 0.5 ) / size;

			float lb = texture2DCompare( depths, centroidUV + texelSize * offset.xx, compare );
			float lt = texture2DCompare( depths, centroidUV + texelSize * offset.xy, compare );
			float rb = texture2DCompare( depths, centroidUV + texelSize * offset.yx, compare );
			float rt = texture2DCompare( depths, centroidUV + texelSize * offset.yy, compare );

			vec2 f = fract( uv * size + 0.5 );

			float a = mix( lb, lt, f.y );
			float b = mix( rb, rt, f.y );
			float c = mix( a, b, f.x );

			return c;

		}

		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {

			float shadow = 1.0;

			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;

			// if ( something && something ) breaks ATI OpenGL shader compiler
			// if ( all( something, something ) ) using this instead

			bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );
			bool inFrustum = all( inFrustumVec );

			bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );

			bool frustumTest = all( frustumTestVec );

			if ( frustumTest ) {

			#if defined( SHADOWMAP_TYPE_PCF )

				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;

				float dx0 = - texelSize.x * shadowRadius;
				float dy0 = - texelSize.y * shadowRadius;
				float dx1 = + texelSize.x * shadowRadius;
				float dy1 = + texelSize.y * shadowRadius;

				shadow = (
					texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
					texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
					texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
					texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
					texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
					texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
					texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
					texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
					texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
				) * ( 1.0 / 9.0 );

			#elif defined( SHADOWMAP_TYPE_PCF_SOFT )

				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;

				float dx0 = - texelSize.x * shadowRadius;
				float dy0 = - texelSize.y * shadowRadius;
				float dx1 = + texelSize.x * shadowRadius;
				float dy1 = + texelSize.y * shadowRadius;

				shadow = (
					texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
					texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
					texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
					texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
					texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy, shadowCoord.z ) +
					texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
					texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
					texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
					texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
				) * ( 1.0 / 9.0 );

			#else // no percentage-closer filtering:

				shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );

			#endif

			}

			return shadow;
		}