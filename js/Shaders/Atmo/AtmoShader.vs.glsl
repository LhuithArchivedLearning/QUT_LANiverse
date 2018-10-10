
//Credit to davidr : https://lightshaderdevlog.wordpress.com/source-code/-->

varying float angleIncidence; 
varying vec4 col;
uniform float fresnelExp;
uniform float transitionWidth; //? Da fleq?

const float PI = 3.14159265359;

varying vec2 vUv;

varying vec3 lightdir;
varying vec3 eyenorm;
uniform vec3 lightpos;
uniform vec4 skycolor;
varying vec3 lightDirection;

  struct DirectionalLight 
  {
    vec3 direction;
    vec3 color;
  };

  uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];


void main() 
{

    vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
    vec4 vWorldPosition = worldPosition;
    vec3 normalDirection = normalize((modelMatrix * vec4(normal, 0.0))).xyz;
    lightDirection = normalize(directionalLights[0].direction);
    vec3 viewDirection = normalize(cameraPosition - worldPosition.xyz);

    vUv = uv;

   angleIncidence = acos(dot(lightDirection, normalDirection.xyz)) / PI;

   float shadeFactor = 0.1 * (1.0 - angleIncidence) + 0.9 * 
    (1.0 - (clamp(angleIncidence, 0.5, 0.5 + transitionWidth) - 0.5) 
    / transitionWidth);

   float angleToViewer = clamp(sin(acos(dot(normalDirection.xyz, viewDirection))), 0.0, 1.0);

   float perspectiveFactor = 0.3 + 0.2 * pow((angleToViewer), fresnelExp)
     + 0.5 * pow((angleToViewer), fresnelExp * 20.0);

    col = vec4(directionalLights[0].color, 1.0) * perspectiveFactor * shadeFactor;
 
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    
}