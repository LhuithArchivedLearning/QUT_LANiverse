    
    //Credit to https://doc.qt.io/qt-5/qtcanvas3d-threejs-planets-planets-js.html
    //For the Orbital Math 

    function returnOrbitionPosition(ringData, i, inner, centre, replaceW)
    {
            var a;
            var w2;

            w2 = (replaceW == true) ? ringData.NumAstros/1000 : ringData["w2"];

            if(inner)
            {
                a = (ringData["a3"] + ringData["a4"] * i);
            }
            else
                a = ringData["a1"] + ringData["a2"] * i;
            

             // Calculate the planet orbital elements from the current time in days
            var N =  (ringData["N1"] + ringData["N2"] * i) * Math.PI / 180;
            var iPlanet = (ringData["i1"] + ringData["i2"] * i) * Math.PI / 180;
            var w =  (ringData["w1"] + w2 * i) * Math.PI / 180;
            var e = ringData["e1"] + ringData["e2"] * i;
            var M = (ringData["M1"] + ringData["M2"] * i) * Math.PI / 180;
            var E = M + e * Math.sin(M) * (1.0 + e * Math.cos(M));

            var xv = a * (Math.cos(E) - e);
            var yv = a * (Math.sqrt(1.0 - e * e) * Math.sin(E));
            var v = Math.atan2(yv, xv);

            // Calculate the distance (radius)
            var r = Math.sqrt(xv * xv + yv * yv);

            // From http://www.davidcolarusso.com/astro/
            // Modified to compensate for the right handed coordinate system of OpenGL
            var xh = r * (Math.cos(N) * Math.cos(v + w) - Math.sin(N) * Math.sin(v + w) * Math.cos(iPlanet));
            var zh = -r * (Math.sin(N) * Math.cos(v + w) + Math.cos(N) * Math.sin(v + w) * Math.cos(iPlanet));
            var yh = r * (Math.sin(w + v) * Math.sin(iPlanet));
            
            var x = centre.x + xh * 1000;
            var y = centre.y + yh * 1000;
            var z = centre.z + zh * 1000;

            return new THREE.Vector3(x,y,z);
    }



function DrawOrbit(planet, centre, currTimeD, auScale, color, i, max)
{
    var segmentCount = 36;
    var radius = planetSize;
    var lines = new THREE.Geometry();

    for (var i = 0; i < segmentCount; i++) 
    {              
    // Calculate the planet orbital elements from the current time in days
    var N =  (planet["N1"] + planet["N2"] * i) * Math.PI / 180;
    var iPlanet = (planet["i1"] + planet["i2"] * i) * Math.PI / 180;
    var w =  (planet["w1"] + planet["w2"] * i) * Math.PI / 180;
    var a = planet["a1"] + planet["a2"] * i;
    var e = planet["e1"] + planet["e2"] * i;
    var M = (planet["M1"] + planet["M2"] * i) * Math.PI / 180;
    var E = M + e * Math.sin(M) * (1.0 + e * Math.cos(M));

    var xv = a * (Math.cos(E) - e);
    var yv = a * (Math.sqrt(1.0 - e * e) * Math.sin(E));
    var v = Math.atan2(yv, xv);

    // Calculate the distance (radius)
    var r = Math.sqrt(xv * xv + yv * yv);

    // From http://www.davidcolarusso.com/astro/
    // Modified to compensate for the right handed coordinate system of OpenGL
    var xh = r * (Math.cos(N) * Math.cos(v + w)
                  - Math.sin(N) * Math.sin(v + w) * Math.cos(iPlanet));
    var zh = -r * (Math.sin(N) * Math.cos(v + w)
                   + Math.cos(N) * Math.sin(v + w) * Math.cos(iPlanet));
    var yh = r * (Math.sin(w + v) * Math.sin(iPlanet));

    // Apply the position offset from the center of orbit to the bodies
    var centerOfOrbit = centre;//objects[planet["centerOfOrbit"]];

        lines.vertices.push(
        new THREE.Vector3(
        centerOfOrbit.x + xh * auScale,
        centerOfOrbit.y + yh * auScale,
        centerOfOrbit.z + zh * auScale));            
    }


    lines.computeLineDistances();

    var colors = ColorPalletes[randomRangeRound(0, ColorPalletes.length - 1)];

    moonorbit = new THREE.Line(lines, 
        new THREE.MeshBasicMaterial({color: colors[randomRangeRound(0, colors.length - 1)].hex, transparent: true, opacity: 1.0}));
  
  return moonorbit;
}

function CreateRockyBelt(ringData, centre, currTimeD, auScale, numAstos,  ringObject, vertex_text, fragment_text, lightpos, list, colors)
{
    var segmentCount = numAstos;
    var radius = planetSize;
   var geometry = new THREE.PlaneGeometry( 1 , 1);

    for (var i = 0; i < segmentCount; i++) 
    {  
    var texture = astroidSprites[Math.round(randomRange(0, astroidSprites.length - 1))];

    var uniform =
    {   
            //colors[(randomRangeRound(0, colors.length - 1))

            texture: { type: "t", value: null },
            color: { type: "vf3", value: colors[(randomRangeRound(0, colors.length - 1))].RGB },
            lightpos: {type: 'v3', value: lightpos},
    };

    astoMaterial = new THREE.ShaderMaterial
    ({
    uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib['lights'], uniform ]),
    vertexShader: vertex_text,
    fragmentShader: fragment_text,
    lights: true
    });

    astoMaterial.uniforms.texture.value = texture;

    var vector = returnOrbitionPosition(ringData, i, false, centre, true);

    var x = vector.x + randomRange(-10, 10);
    var y = vector.y + randomRange(-10, 10);
    var z = vector.z + randomRange(-10, 10);
     
    var asto = new THREE.Mesh( geometry, astoMaterial );
    asto.castShadow = true;
    size = randomRange(4, 12);
    asto.scale.set(size, size, 1);

    var gyro = new THREE.Gyroscope();
    gyro.add(asto);
    gyro.position.set(x,y,z);

    ringObject.add(gyro);
    list.push(asto);
    }
}

function orbit(planet, object, centre, currTimeD, auScale , deltaTimeD)
{
    var vector = returnOrbitionPosition(planet, currTimeD, false, centre);

    object.position.set(vector.x, vector.y, vector.z);

    // Calculate and apply the appropriate axis tilt to the bodies
    // and rotate them around the axis
    var radians = planet["tilt"] * Math.PI / 180; // tilt in radians
    object.rotation.order = 'ZXY';
    object.rotation.x = 0;
    object.rotation.y += (deltaTimeD / planet["period"]) * 2 * Math.PI;
    object.rotation.z = radians;
}

function RingOrbit(ringData, ringObject, centre, currTimeD, auScale, numAstos, deltaTimeD)
{
        // Calculate and apply the appropriate axis tilt to the bodies
    // and rotate them around the axis
    var radians = ringData["tilt"] * Math.PI / 180; // tilt in radians
    ringObject.rotation.order = 'ZXY';
    ringObject.rotation.x = radians;
    ringObject.rotation.y += (deltaTimeD / ringData["period"]) * 2 * Math.PI;
    ringObject.rotation.z = radians;
}

function getOrbit(ringData)
{
        // Calculate and apply the appropriate axis tilt to the bodies
    // and rotate them around the axis
    var radians = ringData["tilt"] * Math.PI / 180; // tilt in radians
    var euler = new THREE.Euler(radians,(36 / ringData["period"]) * 2 * Math.PI, radians, 'ZXY');
    return euler;
}

function PlanetRotation(Planet, period, tilt, deltaTimeD)
{
    // Calculate and apply the appropriate axis tilt to the bodies
    // and rotate them around the axis
    var radians = tilt * Math.PI / 180; // tilt in radians
    Planet.rotation.order = 'ZXY';
    Planet.rotation.x = radians;
    Planet.rotation.y += (deltaTimeD / period) * 2 * Math.PI;
    Planet.rotation.z = radians;
}

THREE.Object3D.prototype.worldToLocal = function ( vector ) {
    if ( !this.__inverseMatrixWorld ) this.__inverseMatrixWorld = new THREE.Matrix4();
    return  vector.applyMatrix4( this.__inverseMatrixWorld.getInverse( this.matrixWorld ));
};


THREE.Object3D.prototype.lookAtWorld = function( vector ) {
vector = vector.clone();
this.parent.worldToLocal( vector );
this.lookAt( vector );
};
