
var container, stats, controls, lineUI, gui;
var camera, MainScene, BackgroundScene, renderer, clock, composer;
var lightpos, dirLight, angle;

// Custom global variables
var mouse = { x: 0, y: 0 };
var resolution = 3;

var skyboxuniforms;
var textureList = [];
var moonListsize = 0;
var ringlistsize = 0;

var planetSize, planetData, inPlanet, planet,
    planetText, planetTextInfo, atmoMaterial, planetTilt, hasRings,
    PlanetMaterial, moonList, ringsList, outline, planetObject,
    atmo, planetRotationPeriod, planetSelected, planetName, loadedOBJ;

var targetPoint = { object: new THREE.Object3D(), size: 0 };

var astroidSprites = [], AstoColorPalleteGrab;
var moonGeom, sphereGeom;
var timer = 0;
var timeLimit = .25;
var startTime = Date.now();
var targetBox = { topR: 0, topL: 0, bottomR: 0, bottomL: 0 };
var transitionWidthInfo;
var atmoGrad;
var showMoonOrbits;

var atmouniforms =
{
    fresnelExp: { type: "f", value: 0 },
    transitionWidth: { type: "f", value: 0.1 },
    atmoThickness: { type: "f", value: 0.1 },
    indexMatrix16x16: { type: "fv1", value: DitherPattern4x4 },
    palette: { type: "v3v", value: GrayScalePallete },
    paletteSize: { type: "i", value: 8 },
    colorlight: { type: "v3", value: 0 },
    colordark: { type: "v3", value: 0 },
    _Gradient: { type: "t", value: null }
}

var skyboxuniforms =
{
    resolution: { type: "v2", value: new THREE.Vector2() },
    randomColsMults: {
        type: "v3",
        value: new THREE.Vector3(
            randomRange(0, 10),
            randomRange(0, 10),
            randomRange(0, 10))
    },
    time: { type: "f", value: 1.0 }
}

var planetUniform =
{
    indexMatrix16x16: { type: "fv1", value: DitherPattern4x4 },
    palette: { type: "v3v", value: GrayScalePallete },
    paletteSize: { type: "i", value: 8 },
    texture: { type: "t", value: null },
    lightpos: { type: 'v3', value: new THREE.Vector3(0, 30, 20) },
    noTexture: { type: "i", value: 0 },
    customColorSwitch: { type: "i", value: 1 },
    customColor: { type: "i", value: new THREE.Vector4(.48, .89, .90, 1) }
};

var ringUniform =
{
    color: { type: "vf3", value: new THREE.Vector3(1, 1, 1) },
    side: THREE.DoubleSide,
    indexMatrix16x16: { type: "fv1", value: DitherPattern4x4 },
    palette: { type: "v3v", value: GrayScalePallete },
    paletteSize: { type: "i", value: 8 },
    colors: { type: "v3v", value: 0 },
    ringLimits: { type: "fv1", value: 0 },
    transparency: { type: "fv1", value: 0 }
};
var sundata =
{
    radius: 1.5424, tilt: 0, N1: 125.1228, N2: 0,
    i1: 10.6, i2: 0, w1: 318.0634, w2: 0.1643573223,
    a1: 0.5, a2: 0, e1: 0, e2: 0,
    M1: 115.3654, M2: 13.0649929509, period: 1, moonSize: "",
    moonObject: "", material: "", selected: false,
    moonOrbit: 0, orbitSpeedMult: 2, inMoon: false, text: false
}

var ShaderLoadList =
{
    planet: new Shader
        (
        ),

    atmo: new Shader
        (
        ),

    asto: new Shader
        (
        ),

    ring: new Shader
        (
        ),

    cloud: new Shader
        (
        ),
}

init();
animate();

function Shader(vertex, fragment) {
    this.vertex = vertex;
    this.fragment = fragment;
}

//Yummy Yum Yum
function textParse(glsl, shadow_text, dither_text) {
    var text = glsl.replace("AddShadow", shadow_text);
    text = text.replace("AddDither", dither_text);

    return text;
}

function init() {

    resolution = (window.devicePixelRatio == 1) ? 3 : 4;;

    MainScene = new THREE.Scene();
    BackgroundScene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(
        window.innerWidth / - 2, window.innerWidth / 2,
        window.innerHeight / 2, window.innerHeight / - 2,
        - 500, 4000);

    camera.position.y = -40;
    container = document.getElementById('webGL-container');
    document.body.appendChild(container);

    renderer = new THREE.WebGLRenderer({ antialias: false });

    renderer.setSize(Math.round(window.innerWidth / resolution), Math.round(window.innerHeight / resolution));

    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);
    renderer.autoClear = false;
    renderer.domElement.style.width = Math.round(renderer.domElement.width * resolution) + 'px';
    renderer.domElement.style.height = Math.round(renderer.domElement.height * resolution) + 'px';
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = false;
    renderer.shadowMapSize = 32;
    renderer.shadowMap.renderReverseSided = false;
    renderer.shadowMap.renderSingleSided = false;

    clock = new THREE.Clock();

    //Add Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', UpdateLook);
    //controls.minZoom = 0.3;
    //controls.maxZoom = 1.5;

    dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    var vector = new THREE.Vector3(750, 500, 1000);
    dirLight.position.set(vector);

    dirLight.shadow.camera.near = 0.01;
    dirLight.castShadow = true;

    var d = 550;

    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;

    dirLight.shadow.mapSize.width = 512;
    dirLight.shadow.mapSize.height = 512;

    dirLight.shadow.camera.far = 2500;
    dirLight.shadow.bias = -0.01;

    //var shadowCam = new THREE.CameraHelper(dirLight.shadow.camera);
    //MainScene.add(shadowCam);
    MainScene.add(dirLight);

    //Composer
    composer = new THREE.EffectComposer(renderer);
    //Passes

    var StarsRenderPass = new THREE.RenderPass(BackgroundScene, camera);
    composer.addPass(StarsRenderPass);

    var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
    composer.addPass(effectCopy);
    effectCopy.renderToScreen = true;

    var MainRenderPass = new THREE.RenderPass(MainScene, camera);
    MainRenderPass.clear = false;
    MainRenderPass.clearDepth = true;
    composer.addPass(MainRenderPass);

    MainRenderPass.renderToScreen = true;

    controls.addEventListener("change", render);
    //var gridHelper = new THREE.GridHelper(1000, 20);
    //MainScene.add( gridHelper );

    //var axisHelper = new THREE.AxisHelper(5);
    //MainScene.add( axisHelper )

    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('mousedown', MouseDown, true);
    document.addEventListener('mouseup', function (e) { onMouseUp(e); }, false);
    window.addEventListener("resize", onWindowResize, false);

    controls = new function () {
        this.xPos = vector.x;
        this.yPos = vector.y;
        this.zPos = vector.z;
    }

    LoadAssets();
    //Load Shaders and Setup Planet
    ShaderLoader('js/Shaders/Planet/Planet.vs.glsl',
        'js/Shaders/Planet/Planet.fs.glsl', setUpPlanet, true);

    //Load Shaders and Setup SkyBox
    ShaderLoader('js/Shaders/Sky/Sky.vs.glsl', 'js/Shaders/Sky/Sky.fs.glsl', setUpSky, true);
    if (devicePixelRatio == 1)
        composer.setSize(window.innerWidth / resolution, window.innerHeight / resolution);
    else
        composer.setSize(window.innerWidth, window.innerHeight);
}

function LoadAssets() {
    var texterLoader = new THREE.TextureLoader();

    var spriteMap01 = texterLoader.load("img/astoriod_01.png");
    var spriteMap02 = texterLoader.load("img/astoriod_02.png");
    var spriteMap03 = texterLoader.load("img/astoriod_03.png");
    var spriteMap04 = texterLoader.load("img/astoriod_04.png");
    var spriteMap05 = texterLoader.load("img/astoriod_05.png");
    atmoGrad = texterLoader.load("img/gradient-value-equalised2_grayScale.png");

    astroidSprites = [spriteMap01, spriteMap02, spriteMap03, spriteMap04, spriteMap05];

    spriteMap01.magFilter = THREE.NearestFilter;
    spriteMap01.minFilter = THREE.NearestFilter;
    spriteMap02.magFilter = THREE.NearestFilter;
    spriteMap02.minFilter = THREE.NearestFilter;
    spriteMap03.magFilter = THREE.NearestFilter;
    spriteMap03.minFilter = THREE.NearestFilter;
    spriteMap04.magFilter = THREE.NearestFilter;
    spriteMap04.minFilter = THREE.NearestFilter;
    spriteMap05.magFilter = THREE.NearestFilter;
    spriteMap05.minFilter = THREE.NearestFilter;
    //AstPalleteColorGrab = AstoColorPalleteGrab[randomRangeRound(0, AstoColorPalleteGrab.length - 1)].RGB;
}

function onWindowResize() {
    // notify the renderer of the size change
    // update the camera
    resolution = (window.devicePixelRatio == 1) ? 3 : 4;;
    var onMobile = false;

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        onMobile = true;
    }
    else {
        onMobile = false;
    }

    if (onMobile) {
        console.log("OnMobile");
        renderer.setPixelRatio(window.devicePixelRatio);
        composer.setSize(window.innerWidth, window.innerHeight);
        renderer.setSize(Math.round(window.innerWidth / resolution), Math.round(window.innerHeight / resolution));
        renderer.domElement.style.width = Math.round((renderer.domElement.width / 2) * resolution) + 'px';
        renderer.domElement.style.height = Math.round((renderer.domElement.height / 2) * resolution) + 'px';
    }
    else {
        console.log("OnPc");
        renderer.setPixelRatio(window.devicePixelRatio);
        composer.setSize(window.innerWidth / resolution, window.innerHeight / resolution);
        renderer.setSize(Math.round(window.innerWidth / resolution), Math.round(window.innerHeight / resolution));
        renderer.domElement.style.width = Math.round(renderer.domElement.width * resolution) + 'px';
        renderer.domElement.style.height = Math.round(renderer.domElement.height * resolution) + 'px';
    }


    camera.left = window.innerWidth / - 2;
    camera.right = window.innerWidth / 2;
    camera.top = window.innerHeight / 2;
    camera.bottom = window.innerHeight / - 2;
    camera.updateProjectionMatrix();
}

function animate() {
    var delta = clock.getDelta();
    timer = timer + delta;
    
    if (timer >= timeLimit) {
        //  if (ShaderLoadList.planet.vertex == undefined) {
        //      ShaderLoader('js/Shaders/Planet/Planet.vs.glsl',
        //          'js/Shaders/Planet/Planet.fs.glsl', setUpPlanet, false);
        //  }
        //  else {
        //      createPlanet(false, ShaderLoadList.planet.vertex, ShaderLoadList.planet.fragment);
        //  }
    
        timer = 0;
    }
    
    angle += 0.1;
    
    dirLight.position.set(controls.xPos, controls.yPos, controls.zPos);
   
    //if (planet !== undefined) {
    //    dirLight.lookAt(planet.position);
    //    var elapsedMilliseconds = Date.now() - startTime;
    //    var elapsedSeconds = elapsedMilliseconds / 1000.;
    //
    //    if (skyboxuniforms !== undefined)
    //        skyboxuniforms.time.value = 60. * elapsedSeconds;
    //    PlanetRotation(planet, planetRotationPeriod, planetTilt, delta);
    //    //planetText.updatePosition(planetSize - 20, - planetText.element.clientWidth / 2, 75);
    //}
//
    //if (ringsList !== undefined) {
    //    for (var i = 0; i < ringsList.length; i++) {
    //        RingOrbit(ringsList[i], ringsList[i].Ring, new THREE.Vector3(0, 0, 0),
    //            clock.getElapsedTime(), 1000, 24, delta);
    //    }
    //}

    //MoonsUpdate(clock.getDelta());
    requestAnimationFrame(animate);
    //HandleCursor();
    //input();
    render();
    //ShowHideInfo();
    //updateTargetBox();
}

function manageMoonOrbits(orbit) {

    if (showMoonOrbits) {
        orbit.traverse(function (child) {
            if (child instanceof THREE.Line) {
                child.visible = true;
            }
        });
    }
    else {
        orbit.traverse(function (child) {
            if (child instanceof THREE.Line) {
                child.visible = false;
            }
        });
    }
}
function updateTargetBox() {
    vector = new THREE.Vector3();
}

function HandleCursor() {
}

function MoonsUpdate(delta) {
    //Gana need to Optomize this because thats alot of shit to iterate

    if (moonList !== undefined) {
        orbit(sundata, dirLight,
            new THREE.Vector3(0, 0, 0), clock.getElapsedTime() * 0.2,
            1000, delta / 12);

        for (var i = 0; i < moonList.length; i++) {
            var proj = toScreenPosition(moonList[i].moonObject, camera);

            moonList[i].text.updatePosition(225, proj.x, proj.y);

            orbit(moonList[i], moonList[i].moonObject,
                new THREE.Vector3(0, 0, 0), clock.getElapsedTime() * moonList[i].orbitSpeedMult,
                1000, delta / 12);

            moonList[i].material.uniforms.lightpos.value.copy(dirLight.position);
            manageMoonOrbits(moonList[i].moonOrbit);
        }
    }
}

//Rings Are Sprites, or Flat, so need to make sure on orbit control change
//to 
function UpdateLook() {
    //console.log("Poo");
    if (ringsList !== undefined) {
        for (var i = 0; i < ringsList.length; i++) {
            if (!ringsList[i].isFlat) {
                ringsList[i].Ring.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        child.lookAt(camera.position);
                    }
                });
            }
        }
    }
}


function ShowHideInfo() {
}

function toggleOrbts() {

    showMoonOrbits = !showMoonOrbits;

    if (showMoonOrbits) {
        document.getElementById("Show").innerHTML = "Hide Orbits";
    }
    else {
        document.getElementById("Show").innerHTML = "Show Orbits";
    }
}

function input() {
    if (planet !== undefined)
        MouseInPlanet(planet, planetSize);


    if (moonList !== undefined) {
        for (var i = 0; i < moonList.length; i++) {
            MouseInMoon(moonList[i].moonObject, moonList[i].moonSize + 5, moonList[i]);
        }
    }
}

function render() {
    composer.render();
}

function MouseInPlanet(object, rad) {
    if (planet == targetPoint.object) {
        planetSelected = true;
    }
    else {
        planetSelected = false;
    }

    var vector = new THREE.Vector2();

    vector.x = object.position.x;
    vector.y = object.position.y;

    vector.x = Math.round(vector.x + window.innerWidth / 2);
    vector.y = Math.round(vector.y + window.innerHeight / 2);

    if (circlePointCollision(mouse.x, mouse.y, new THREE.Vector2(vector.x, vector.y), rad)) {
        if (mouseDown) {
            targetPoint.size = planetSize * 0.75;;
            targetPoint.object = object;
        }
    }
}

function MouseInMoon(moon, rad, data) {
    moon.inMoon = true;
    data.selected = true;

    if (circlePointCollision(mouse.x, mouse.y, new THREE.Vector2(vector.x, vector.y), rad)) {
        if (mouseDown) {
            if (inPlanet) {
                if (vector.z > targetPoint.object.position.z) {
                    targetPoint.size = data.moonSize * 0.015;
                    targetPoint.object = moon;
                    moon.selected = true;
                }
            }
            else {
                targetPoint.size = data.moonSize * 0.015;
                targetPoint.object = moon;
            }
        }
    }
}

function toScreenPosition(obj, camera) {
    var vector = new THREE.Vector3();

    var widthHalf = 0.5 * window.innerWidth;
    var heightHalf = 0.5 * window.innerHeight;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    vector.x = (vector.x * widthHalf) + widthHalf;
    vector.y = - (vector.y * heightHalf) + heightHalf;
    vector.z = obj.position.z;
    return {
        x: vector.x,
        y: vector.y,
        z: vector.z
    };
}

// Follows the mouse event
function onMouseMove(event) {
    // Update the mouse variable
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    mouse.x = Math.round((mouse.x + 1) * window.innerWidth / 2);
    mouse.y = Math.round((- mouse.y + 1) * window.innerHeight / 2);
}

function onMouseUp(evt) {
    evt.preventDefault();
    mouseDown = false;
}

function MouseDown(event) {
    event.preventDefault();
    switch (event.button) {
        case 0: // left
            mouseDown = true;
            break;
        case 1: // middle
            break;
        case 2: // right
            break;
    }

};

function Fetch_Parametres(vertex_text, fragment_text) {
    //moonListsize = Math.round(randomRange(1, 4))
    //ringlistsize = Math.round(randomRange(1, 4));
    //moonList = new Array(moonListsize);
    //planetTilt = randomRange(-55, 55);
    planetSize = randomRange(40, 110);
    //planetRotationPeriod = Math.round(randomRange(65, 100));
    // InitializeMoonData(moonList, vertex_text, fragment_text);
}

function fetchRings(colors, vertex_text, fragment_text) {

     if (ringsList !== undefined) {

     }
}

function CreateFlatBelt(ringData, vertex_text, fragment_text) {
    var ringGeo = new RingGeoCreate(ringData.data, ringData.data.Ring, 1000);
    var ringLimits = new Array(5);
    var transparency = new Array(5);

    ringLimits[0] = randomRange(0.01, 0.5);
    ringLimits[1] = randomRange(ringLimits[0], 0.6);
    ringLimits[2] = randomRange(ringLimits[1], 0.9);

    var colorsRGB = [];

    for (var j = 0; j < ringData.Ringcolors.length; j++) {
        var R = ringData.Ringcolors[j].RGB.r;
        var G = ringData.Ringcolors[j].RGB.g;
        var B = ringData.Ringcolors[j].RGB.b;

        var normalColors = new THREE.Vector3(R, G, B);
        colorsRGB.push(normalColors);
    }

    for (var i = 0; i < 5; i++) {
        transparency[i] = randomRange(0.1, 1.0);
    }

    ringUniform.colors.value = colorsRGB;
    ringUniform.ringLimits.value = ringLimits;
    ringUniform.transparency.value = transparency;

    ringMaterial = new THREE.ShaderMaterial
        ({
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib['lights'],
                ringUniform]),
            vertexShader: (vertex_text),
            fragmentShader: (fragment_text),
            lights: true,
            transparent: true
        });
    ringMaterial.side = THREE.DoubleSide;

    var newRing = new THREE.Mesh(ringGeo, ringMaterial);
    newRing.castShadow = true;
    newRing.receiveShadow = true;

    ringData.data.Ring.add(newRing);
}

function InitializeRingsData(ringsList) {
    for (var i = 0; i < ringsList.length; i++) {
        var orbitrangeOutter;
        var orbitrangeInner;
        var orbitspeed;
        var flat;
        var per;
        var roll = Math.round(randomRange(0, 10));

        if (roll >= 4)
            flat = false;
        else
            flat = true;

        if (i == 0) {
            orbitrangeInner = randomRange((planetSize / 1000) * 1.1, (planetSize / 1000) * 1.2);
            orbitrangeOutter = randomRange(orbitrangeInner * 1.05, orbitrangeInner * 1.15);
        }
        else if (i >= 1) {
            orbitrangeInner = randomRange((ringsList[i - 1].a1), (ringsList[i - 1].a1) * 1.15);
            orbitrangeOutter = randomRange(orbitrangeInner * 1.05, orbitrangeInner * 1.15);
        }
        var roll = Math.round(randomRange(0, 1));
        NumAstros = randomRange(36, 52);

        per = randomRange(1, 25);
        if (roll <= 0) {
            orbitspeed = randomRange(25, 50);
            per = (per == 0) ? 1 : orbitspeed;
        }
        else {
            orbitspeed = randomRange(-25, -50);
            per = (per == 0) ? 1 : orbitspeed;
        }
        var mat;

        ringsList[i] =
            {
                radius: 1.5424, tilt: planetTilt, N1: 125.1228, N2: 0,
                i1: 0, i2: 0, w1: 360, w2: 0.27,
                a1: orbitrangeOutter, a2: 0, a3: orbitrangeInner, a4: 0, e1: 0, e2: 0, isFlat: flat,
                M1: 115.3654, M2: 13.0649929509, period: per, NumAstros: NumAstros,
                Ring: new THREE.Object3D(), orbitSpeedMult: orbitspeed, astoList: []
            }
    }

}

function InitializeMoonData(moonList, vertex_text, fragment_text) {
    for (var i = 0; i < moonList.length; i++) {
    }
}

function TargetUI() {
    targetBox.bottomR = generateImageUi(new THREE.Vector3(0, 0, 0)
        , "110px", -1000, "img/Icons/Corner_Bottom_Right.png", "UI-Target", "Target-Ui-Label");
    targetBox.bottomR.updatePosition(1, 500, 500);

    targetBox.bottomL = generateImageUi(new THREE.Vector3(0, 0, 0)
        , "110px", -1000, "img/Icons/Corner_Bottom_Left.png", "UI-Target", "Target");
    targetBox.bottomL.updatePosition(1, 500, 500);

    targetBox.topR = generateImageUi(new THREE.Vector3(0, 0, 0)
        , "110px", -1000, "img/Icons/Corner_Top_Right.png", "UI-Target", "Target");
    targetBox.topR.updatePosition(1, 500, 500);

    targetBox.topL = generateImageUi(new THREE.Vector3(0, 0, 0)
        , "110px", -1000, "img/Icons/Corner_Top_Left.png", "UI-Target", "Target");
    targetBox.topL.updatePosition(1, 500, 500);
}

function setUpSky(start, vertex_text, fragment_text) {
    var skyMaterial = new THREE.ShaderMaterial(
        {
            vertexShader: vertex_text,
            fragmentShader: fragment_text,
            uniforms: skyboxuniforms,
            side: THREE.BackSide,
            fog: false
        });

    var skyBox = new THREE.Mesh(new THREE.SphereGeometry(1000,
        60, 40), skyMaterial);

    BackgroundScene.add(skyBox);
    skyBox.castShadow = false;
    skyBox.receiveShadow = false;

    skyboxuniforms.resolution.value.x = window.innerWidth;
    skyboxuniforms.resolution.value.y = window.innerHeight;
}

function fetchAtmo(colors, vertex_text, fragment_text) {
    var vertex = vertex_text;
    var fragment = fragment_text;
}

function RemoveOldShizz() {
    if (planet !== undefined) {
        doDispose(planet);
        MainScene.remove(planet);
    }

    if (outline !== undefined) {
        MainScene.remove(outline);
    }

    if (atmo !== undefined) {
        MainScene.remove(atmo);
        doDispose(atmo);
    }
    //planetText.element.remove();
    planetTextInfo.element.remove();

    if (moonList !== undefined) {
        for (var i = 0; i < moonList.length; i++) {
            moonList[i].text.element.remove();
            MainScene.remove(moonList[i].moonObject);
            MainScene.remove(moonList[i].moonOrbit);
            doDispose(moonList[i].moonObject);
            doDispose(moonList[i].moonOrbit);
        }
    }
    if (ringsList !== undefined) {
        if (hasRings) {

            for (var i = 0; i < ringsList.length; i++) {
                MainScene.remove(ringsList[i].orbitObject);
                MainScene.remove(ringsList[i].Ring);
                doDispose(ringsList[i].Ring);
            }
        }
    }

    if (textureList.length !== 0) {
        for (var i = 0; i < textureList.length; i++) {
            if (textureList[i] !== undefined) {
                textureList[i].dispose();
                textureList[i] = undefined;
            }
        }
        textureList = [];
    }
}

function fetchPlanet(start, vertex_text, fragment_text) {

    Fetch_Parametres(vertex_text, fragment_text);

    var vertex = vertex_text;
    var fragment = fragment_text;

    PlanetMaterial = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib['lights'],
            planetUniform]),
        vertexShader: (vertex),
        fragmentShader: (fragment),
        lights: true
    });

    var planetmap = new THREE.TextureLoader().load( 'planetimgs/Crastw-117.png' );
    planetmap.wrapS = planetmap.wrapT = THREE.RepeatWrapping;
    planetmap.magFilter = THREE.NearestFilter;
    planetmap.minFilter = THREE.NearestFilter;

    PlanetMaterial.uniforms.texture.value = planetmap;

    var loader = new THREE.GLTFLoader();
    var loadedObject;
    loader.load('objects/Crastw-117/Crastw-117.gltf', function ( gltf ) {
        var object = gltf.scene;
        loadedObject = object;
        //console.log(object.children[0]);
        object.children[0].material = PlanetMaterial;

        object.castShadow = true; //default is false
        object.receiveShadow = true; //default
        MainScene.add(object);
    } );
}


function doDispose(obj) {
    if (obj !== null) {
        for (var i = 0; i < obj.children.length; i++) {
            doDispose(obj.children[i]);
        }
        if (obj.geometry) {
            obj.geometry.dispose();
            obj.geometry = undefined;
        }
        if (obj.material) {
            if (obj.material.map) {
                obj.material.map.dispose();
                obj.material.map = undefined;
            }
            obj.material.dispose();
            obj.material = undefined;
        }
    }
    obj = undefined;
};

function fetchmoon(moonSize, mat) {
    //var moon = new THREE.Mesh(new THREE.IcosahedronGeometry(moonSize, 2), mat);
    //moon.castShadow = true; //default is false
    //moon.receiveShadow = true; //default+
    //return moon;
}

function fetchPlanatiodData() {
    
}


function generateButtonUi(parent, fontsize, left, url, classname, id) {

    var roll = randomRange(0, 10);
    var newUI = createButtonLabel(fontsize, left, id, classname);

    if (url != "")
        newUI.setHTML('<img src=' + url + '>');
    else {
        newUI.setHTML('Show Orbits');
    }

    newUI.setParent(parent);

    var ul;

    if (id == "Refresh")
        ul = document.getElementById("UI-Tools-List");
    else
        ul = document.getElementById("UI-Tools-List");

    ul.appendChild(newUI.element);

    if (document.getElementById("Refresh") != null) {
        document.getElementById("Refresh").onclick = function () {
            if (ShaderLoadList.planet.vertex == undefined) {
                ShaderLoader('js/Shaders/Planet/Planet.vs.glsl',
                    'js/Shaders/Planet/Planet.fs.glsl', setUpPlanet, false);
            }
            else {
                fetchPlanet(false, ShaderLoadList.planet.vertex, ShaderLoadList.planet.fragment);
            }
        };
    }

    if (document.getElementById("Show") != null) {
        document.getElementById("Show").onclick = function () {

            toggleOrbts();
        }
    }

    return newUI;
}

function generateImageUi(parent, fontsize, left, url, classname, id) {
}

function generateName(parent, fontsize, left, isInfo, colorpallette, regions) {

}
// Credit to THeK3nger - https://gist.github.com/THeK3nger/300b6a62b923c913223fbd29c8b5ac73
//Sorry to any soul that bare's witness to this Abomination....May the gods have mercy on me
function ShaderLoader(vertex_url, fragment_url, onLoad, Custom, onProgress, onError) {
    var vertex_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
    vertex_loader.setResponseType('text');
    vertex_loader.load(vertex_url, function (vertex_text) {
        var fragment_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
        fragment_loader.setResponseType('text');
        fragment_loader.load(fragment_url, function (fragment_text) {
            var shadow_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
            shadow_loader.setResponseType('text');
            shadow_loader.load("js/Shaders/Shadow.glsl", function (shadow_text) {
                var dither_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
                dither_loader.setResponseType('text');
                dither_loader.load("js/Shaders/Dither.glsl", function (dither_text) {
                    onLoad(Custom, textParse(vertex_text, shadow_text, dither_text), textParse(fragment_text, shadow_text, dither_text));
                }

                )
            });
        })
    }, onProgress, onError);
}
//Methods to Setup and Save the Loaded Texts
//Aswell as pass in extra paramaratres if needed

function setUpPlanet(init, vertex_text, fragment_text) {
    ShaderLoadList.planet.vertex = vertex_text;
    ShaderLoadList.planet.fragment = fragment_text;
    fetchPlanet(init, vertex_text, fragment_text);
}

function setUpAtmosphere(atmoInfo, vertex_text, fragment_text) {

    ShaderLoadList.atmo.vertex = vertex_text;
    ShaderLoadList.atmo.fragment = fragment_text;

    createAtmos(atmoInfo, vertex_text, fragment_text);
}
function SetUpFlatBelt(ringData, vertex_text, fragment_text) {
    ShaderLoadList.ring.vertex = vertex_text;
    ShaderLoadList.ring.fragment = fragment_text;

    CreateFlatBelt(ringData, vertex_text, fragment_text);
}
