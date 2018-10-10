//Credit to https://www.shadertoy.com/view/4lSSRw : Star Noise
//Credit to https://www.shadertoy.com/view/ldBczz : Random Colors
uniform vec2 resolution;
uniform vec3 randomColsMults;
uniform float time;

vec2 nc (in vec2 uv) {
	return (uv / resolution) * 2. - 1.;
}

float random (in vec2 uv, in vec3 seed) {
	return fract(sin(dot(uv.xy, vec2(seed.x,seed.y))) * seed.z);
}

void main() 
{
    vec2 uv = nc(gl_FragCoord.xy) * 2.0;

	vec2 ipos = floor(uv);

    vec2 x = gl_FragCoord.xy;

	vec3 a = vec3(max((fract(dot(sin(x ),x))-.998)*1390.,.0));
	vec3 a2 = vec3(max((fract(dot(sin(x ),x))-.8)*1390.,.0));

	float colorLerp = normalize(sin(1.0));

    vec4 backgroundcol = vec4(1.0, 1.0, 0.835, 1.0);
	vec4 dayColor = vec4(0.027, 0.509, 0.929, 1.0);

	vec3 color = vec3(random(ipos,a/3.0), random(ipos,a/1.5), random(ipos,a/2.0));
	
	vec3 color2 = vec3(random(ipos,a2), random(ipos,a2), random(ipos,a2));


	gl_FragColor =  vec4(color * color2, 1.);

}


