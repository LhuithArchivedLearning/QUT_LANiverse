
var container, stats, controls, lineUI, gui;
var camera, MainScene, BackgroundScene, renderer, clock, composer;
var lightpos, dirLight, angle;

// Custom global variables
var mouse = { x: 0, y: 0 };
var resolution = 3;
var octaves;
var persistance;
var lacunarity;
var seed = 1;
var noiseScale;
var offset = { x: 0, y: 0 };
var textureSize = 256;
var mouseDown = false;
var boxsize = 25;
var skyboxuniforms;
var textureList = [];

var planetSize, planetData, inPlanet, planet,
    planetText, planetTextInfo, atmoMaterial, planetTilt, hasRings,
    PlanetMaterial, moonList, ringsList, outline,
    atmo, planetRotationPeriod, planetSelected;

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
    //controls = new THREE.OrbitControls(camera, renderer.domElement);
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

    var shadowCam = new THREE.CameraHelper(dirLight.shadow.camera);
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

    //controls.addEventListener("change", render);
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

    if (planet !== undefined) {
        dirLight.lookAt(planet.position);
        var elapsedMilliseconds = Date.now() - startTime;
        var elapsedSeconds = elapsedMilliseconds / 1000.;

        if (skyboxuniforms !== undefined)
            skyboxuniforms.time.value = 60. * elapsedSeconds;
        PlanetRotation(planet, planetRotationPeriod, planetTilt, delta);
        //planetText.updatePosition(planetSize - 20, - planetText.element.clientWidth / 2, 75);
    }
    MoonsUpdate(clock.getDelta());
    requestAnimationFrame(animate);
    HandleCursor();
    input();
    render();
    ShowHideInfo();
    updateTargetBox();
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
    if (hasRings) {
        if (ringsList !== undefined) {
            for (var i = 0; i < ringsList.length; i++) {
                RingOrbit(ringsList[i], ringsList[i].Ring, new THREE.Vector3(0, 0, 0),
                    clock.getElapsedTime(), 1000, 24, delta * 42);
            }
        }
    }

    if (moonList !== undefined) {
        orbit(sundata, dirLight,
            new THREE.Vector3(0, 0, 0), clock.getElapsedTime() * 0.2,
            1000, delta / 12);

        for (var i = 0; i < moonList.length; i++) {
            moonList[i].text.updatePosition(moonList[i].moonSize,
                -   moonList[i].text.element.clientWidth / 2, 55);
            orbit(moonList[i], moonList[i].moonObject,
                new THREE.Vector3(0, 0, 0), clock.getElapsedTime() * moonList[i].orbitSpeedMult,
                1000, delta / 12);
            moonList[i].material.uniforms.lightpos.value.copy(dirLight.position);
            manageMoonOrbits(moonList[i].moonOrbit);
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

    var widthHalf = window.innerWidth / 2;
    var heightHalf = window.innerHeight / 2;

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

function CalculateParametres(vertex_text, fragment_text) {
    persistance = randomRange(0.65, 0.85);
    lacunarity = randomRange(1.9, 2.2);
    octaves = Math.round(randomRange(4, 6));
    noiseScale = randomRange(10, 200);
    moonList = new Array(Math.round(randomRange(1, 4)));
    planetTilt = randomRange(-55, 55);
    planetSize = randomRange(40, 110);
    planetRotationPeriod = Math.round(randomRange(65, 100));
    InitializeMoonData(moonList, vertex_text, fragment_text);
}

function setUpRings(colors, vertex_text, fragment_text) {

    if (ringsList !== undefined) {

        for (var i = 0; i < ringsList.length; i++) {
            MainScene.remove(ringsList[i].orbitObject);
            MainScene.remove(ringsList[i].Ring);
            doDispose(ringsList[i].Ring);
        }
    }

    ShaderLoadList.asto.vertex = vertex_text;
    ShaderLoadList.asto.fragment = fragment_text;

    ringsList = new Array(Math.round(randomRange(1, 4)));

    var index = randomRangeRound(1, ColorPalletes.length - 1);
    AstoColorPalleteGrab = colors;//ColorPalletes[index];

    InitializeRingsData(ringsList);

    if (ringsList !== undefined) {
        for (var i = 0; i < ringsList.length; i++) {

            if (!ringsList[i].isFlat) {
                CreateRockyBelt(ringsList[i], new THREE.Vector3(0, 0, 0), clock.getElapsedTime(),
                    1000, ringsList[i].NumAstros, ringsList[i].Ring,
                    vertex_text, fragment_text, dirLight.position,
                    ringsList[i].astoList, AstoColorPalleteGrab);
            }
            else {
                if (ShaderLoadList.ring.vertex == undefined) {
                    ShaderLoader('js/Shaders/Ring/Ring.vs.glsl',
                        'js/Shaders/Ring/Ring.fs.glsl', SetUpFlatBelt, { data: ringsList[i], Ringcolors: AstoColorPalleteGrab });
                }
                else {
                    CreateFlatBelt({ data: ringsList[i], Ringcolors: AstoColorPalleteGrab },
                        ShaderLoadList.ring.vertex, ShaderLoadList.ring.fragment);
                }
            }

            MainScene.add(ringsList[i].Ring);
        }
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
            orbitspeed = randomRange(5, 20);
            per = (per == 0) ? 1 : orbitspeed;
        }
        else {
            orbitspeed = randomRange(-5, -20);
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
        var roll = randomRange(0, 10);

        var mat;
        size = randomRange(1, Math.round(planetSize / 4));
        orbitspeed = randomRange(-2, 2);
        orbitspeed = (orbitspeed == 0) ? 1 : orbitspeed;

        moonData = createPlantiodData(octaves, persistance, lacunarity,
            seed, 128, offset, 24);

        moonMaterial = PlanetMaterial.clone();


        moonMaterial.uniforms.texture.value = moonData.map;
        mat = moonMaterial;

        moonList[i] =
            {

                //Again Much Credit To The Folks At Qt:
                //https://doc.qt.io/qt-5/qt3d-planets-qml-planets-js.html 
                //Smexcity !!!

                // radius - planet radius in millions of meters
                // tilt - planet axis angle
                // N1 N2 - longitude of the ascending node
                // i1 i2 - inclination to the ecliptic (plane of the Earth's orbit)
                // w1 w2 - argument of perihelion
                // a1 a2 - semi-major axis, or mean distance from Sun
                // e1 e2 - eccentricity (0=circle, 0-1=ellipse, 1=parabola)
                // M1 M2 - mean anomaly (0 at perihelion; increases uniformly with time)
                // period - sidereal rotation period
                // centerOfOrbit - the planet in the center of the orbit
                // (orbital elements based on http://www.stjarnhimlen.se/comp/ppcomp.html)
                //i1: 115.1454

                radius: 1.5424, tilt: 0, N1: 125.1228, N2: 0,
                i1: randomRange(-60, 60), i2: 0, w1: 318.0634, w2: 0.1643573223,
                a1: randomRange(planetSize / 1000 + .02, 0.32), a2: 0, e1: 0, e2: 0,
                M1: 115.3654, M2: 13.0649929509, period: 1, moonSize: size,
                moonObject: createMoon(size, mat), material: mat, selected: false,
                moonOrbit: 0, orbitSpeedMult: orbitspeed, inMoon: false, text: false
            }
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

function createAtmos(colors, vertex_text, fragment_text) {
    if (atmo !== undefined) {
        MainScene.remove(atmo);
        doDispose(atmo);
    }
    var col = ColorPalletes[randomRangeRound(0, ColorPalletes.length - 1)];
    var colorsRGBLight = col[randomRangeRound(0, col.length - 1)].RGB;
    var colorsRGBDark = col[randomRangeRound(0, col.length - 1)].RGB;

    atmouniforms.fresnelExp.value = randomRange(0.10, 1.99);
    atmouniforms.transitionWidth.value = randomRange(0.01, 0.05);
    atmouniforms.colorlight.value = colorsRGBLight;
    atmouniforms.colordark.value = colorsRGBDark;

    atmouniforms.atmoThickness.value = randomRange(0.00, 3.00);

    atmoMaterial = new THREE.ShaderMaterial
        ({
            uniforms: THREE.UniformsUtils.merge
                ([
                    THREE.UniformsLib['lights'],
                    atmouniforms
                ]),
            vertexShader: vertex_text,
            fragmentShader: fragment_text,
            transparent: true,
            lights: true
        }
        );
    atmoMaterial.uniforms._Gradient.value = atmoGrad;

    atmo = new THREE.Mesh(new THREE.IcosahedronGeometry(
        planetSize * randomRange(1.01, 1.05), 4), atmoMaterial);
    atmo.position.set(0, 0, 0);//= planet.position;
    atmo.castShadow = false;
    atmo.receiveShadow = false;
    MainScene.add(atmo);
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

function createPlanet(start, vertex_text, fragment_text) {

    if (planet !== undefined) {
        RemoveOldShizz();
    }
    else {
        var vertex = vertex_text;
        var fragment = fragment_text;
        var ico = new THREE.IcosahedronGeometry(planetSize, 4);

        PlanetMaterial = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib['lights'],
                planetUniform]),
            vertexShader: (vertex),
            fragmentShader: (fragment),
            lights: true
        });
        //TargetUI();
        refreshPlanetButton = generateButtonUi(new THREE.Vector3(0, 0, 0)
            , "110px", -1000, "img/Icons/Refresh.png", "Ui-Label", "Refresh");
        showPlanetButton = generateButtonUi(new THREE.Vector3(0, 0, 0)
            , "110px", -1000, "", "Ui-Label", "Show");

    }

    CalculateParametres(vertex_text, fragment_text);

    planetData = createPlantiodData(octaves, persistance, lacunarity,
        seed, noiseScale, offset, textureSize);


    //Custom image mapping addtion
    //maybe find a smarter way to do this :s
    //regions, url, size, planet, vertex_text, fragment_text
    var cube = new THREE.CubeGeometry(200, 200, 200);
    var ico = new THREE.IcosahedronGeometry(planetSize, 4);

    planet = new THREE.Mesh(cube,
        PlanetMaterial);
    planet.castShadow = true; //default is false
    planet.receiveShadow = true; //default


    if (planetData.url == '') {
        planet = new THREE.Mesh(ico,
            PlanetMaterial);
        planet.castShadow = true; //default is false
        planet.receiveShadow = true; //default
        MainScene.add(planet);

        PlanetMaterial.uniforms.texture.value = planetData.map;
    }
    else {
        var customData = {
            region: planetData.regionsInfo, size: textureSize, mat: PlanetMaterial,
            vert: vertex_text, frag: fragment_text
        };
        CustomTextureLoader(planetData.url, customData, SetupTextureFunction);
    }
    dirLight.target = planet;
    //planetData.regionsInfo, planetData.url, 
    //textureSize, planet, vertex_text, fragment_text

    //planetText = generateName(planet, 55, -1000, false);

    if (ShaderLoadList.atmo.vertex == undefined) {
        ShaderLoader('js/Shaders/Atmo/AtmoShader.vs.glsl',
            'js/Shaders/Atmo/AtmoShader.fs.glsl', setUpAtmosphere, planetData.colors);
    }
    else {
        createAtmos(planetData.colors, ShaderLoadList.atmo.vertex, ShaderLoadList.atmo.fragment);
    }

    for (var i = 0; i < moonList.length; i++) {
        moonList[i].moonOrbit = DrawOrbit(moonList[i], new THREE.Vector3(0, 0, 0),
            clock.getElapsedTime(), 1000, planetData.colors, i, moonList.length);
        MainScene.add(moonList[i].moonObject);

        if (moonList[i].moonOrbit != 0)
            MainScene.add(moonList[i].moonOrbit);

        moonList[i].text = generateName(moonList[i].moonObject, "35px", -1000, false);// generateName(planet, "35px", -1000);
    }

    var roll = randomRange(0, 10);

    if (roll >= 5) {
        hasRings = true;

        if (ShaderLoadList.asto.vertex == undefined) {
            ShaderLoader('js/Shaders/Asto/Asto.vs.glsl',
                'js/Shaders/Asto/Asto.fs.glsl', setUpRings, planetData.colors);
        }
        else {
            setUpRings(planetData.colors, ShaderLoadList.asto.vertex, ShaderLoadList.asto.fragment);
        }
    }
    else {
        hasRings = false;
    }

    planetTextInfo = generateName(planet, 1, -1000, true, planetData.colors, planetData.regionsInfo);
    planetTextInfo.setWidthbyPercent(75);
    planetTextInfo.setHeight(planetSize);
    // targetPoint.object = moonList[0].moonObject;
    //targetPoint.size = 0.75;
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

function createMoon(moonSize, mat) {
    var moon = new THREE.Mesh(new THREE.IcosahedronGeometry(moonSize, 2), mat);
    moon.castShadow = true; //default is false
    moon.receiveShadow = true; //default+
    return moon;
}

function createDataMap(map, size) {
    var dataTexture;

    dataTexture = new THREE.DataTexture
        (
        Uint8Array.from(map),
        size,
        size,
        THREE.RGBFormat,
        THREE.UnsignedByteType,
    );

    dataTexture.needsUpdate = true;

    return dataTexture;
}

function createPlantiodData(octaves, persistance, lacunarity, seed, noiseScale, offset, size) {
    var planetInfo = new MapGenerator(octaves, persistance, lacunarity,
        seed, noiseScale, offset, size, false);

    var dataTexture;

    dataTexture = new THREE.DataTexture
        (
        Uint8Array.from(planetInfo.map),
        size,
        size,
        THREE.RGBFormat,
        THREE.UnsignedByteType,
    );

    dataTexture.needsUpdate = true;
    textureList.push(dataTexture);

    return new PlanetInformation(dataTexture, planetInfo.hasAtmo,
        planetInfo.hasLiquad, planetInfo.colors, planetInfo.url,
        planetInfo.regionsInfo);
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
                createPlanet(false, ShaderLoadList.planet.vertex, ShaderLoadList.planet.fragment);
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
    var roll = randomRange(0, 10);
    var newUI = createImgLabel(fontsize, left, id, classname);
    newUI.setHTML('<img src=' + url + '>');
    newUI.setParent(parent);
    container.appendChild(newUI.element);

    return newUI;
}

function generateName(parent, fontsize, left, isInfo, colorpallette, regions) {
    var color = (parent == planet) ? "#FF61DB" : "#ffffff";
    var label = (isInfo) ? "Planet-Info" : 'text-label';
    var roll = randomRange(0, 10);
    var newText = createTextLabel(fontsize, left, label, color);
    var wordtxt = word(randomRange(3, 25));

    if (roll > 5 && !isInfo) {
        newText.setHTML(wordtxt + "-" + Math.round(randomRange(0, 1000)));
    }
    else if (!isInfo) {
        newText.setHTML(wordtxt);
    }
    else {
        var moon = "Moons: " + moonList.length;
        moon = moon.fontcolor("#f1c40f");

        var size = "Size: " + Math.round(planetSize) * 100 + " km"
        size = size.fontcolor("#e67e22");

        var atmo = "Atmo: " + Math.round(((planetSize * 1.07) - planetSize) * 100)
            + " km"
        atmo = atmo.fontcolor("#e74c3c");

        var condition = "Condition: " + BuildHazard();
        condition = condition.fontcolor("#9b59b6");

        var bio = BuildBio(planetSize * 100);
        bio = bio.fontcolor("#f39c12");

        var CE = "Common Elements";
        CE = CE.fontcolor("#2980b9");

        name = word(randomRange(3, 25)) + "-" + Math.round(randomRange(0, 1000));
        //name = name.fontsize(12);
        //name = name.bold();
        name = name.anchor("Planet-Name");

        newText.setHTML
            (
            name
            + "<br>" +
            "<br>" +
            moon
            + "<br>" +
            size
            + "<br>" +
            atmo
            + "<br>" +
            condition
            + "<br>"

            + "<br>" +
            CE + "<br>" + buildElements(colorpallette, regions)
            + "<br>" +
            ""
            + "<br>" +
            bio

            );
    }

    newText.setParent(parent);
    container.appendChild(newText.element);

    return newText;
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
    createPlanet(init, vertex_text, fragment_text);
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
