
varying float angleIncidence; 
varying vec4 col;

varying vec2 vUv;
varying vec3 lightDirection;
uniform float transitionWidth; //? Da fleq?
uniform float atmoThickness;

varying vec3 eyenorm;
uniform vec3 lightpos;
uniform vec3 colorlight;
uniform vec3 colordark; 
uniform sampler2D _Gradient;

//Refer the Text Parse in Main.js, replaced this Sexy Text with Dither Methods,
//I just didnt want it cluttering shizz up
AddDither

void main() 
{
    
	vec4 mainAtmoColor = 
	vec4(
	(colorlight.r/255.0), 
	(colorlight.g/255.0), 
	(colorlight.b/255.0), 1.0);

	vec4 NoonStartColor = vec4(colordark.r/255.0, colordark.g/255.0, colordark.b/255.0,  1.0);

	vec2 gradientLevel = vec2((angleIncidence), 0.0);

	vec4 color = mix(mainAtmoColor, NoonStartColor, gradientLevel.x);

	vec4 final = (col) * texture2D(_Gradient, gradientLevel) * atmoThickness;
    gl_FragColor = (vec4((final.rgb), angleIncidence)) * color; 
}
