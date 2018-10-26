
var container, stats, controls, lineUI, gui;
var camera, MainScene, BackgroundScene, renderer, clock, composer;
var lightpos, dirLight, angle;

var options, regions, gui_color_event_list = [];
var gui_range_event_list = [];

var ring_params_list = [];
var atmo_gen_gui, planet_colors_gui, planet_colors_gui, planet_gen_gui;

var moons_gen_gui;

var moon_region_info;
var moons_gen_gui_list = [];
var moon_params_list = [];
var moon_event_list = [];

var rings_gen_gui;

var ring_region_info;
var rings_gen_gui_list = [];
var ring_params_list = [];
var ring_event_list = [];

//var moon_params;
var persistance_event, lacunarity_event, octaves_event, noiseScale_event;
var numberOfMoons_event, planetRotationPeriod_event, numberOfRings_event;
var planetTilt_event, planetSize_event, hasRings_event, isGassy_event, seed_event, name_event;

var atmo_gen_gui, fresnel_event, transwidth_event;
var thickness_event, atmosize_event, colorsRGBLight_event;
var colorsRGBDark_event;

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
var moonListsize = 0;
var ringlistsize = 0;

var atmosphereshaderinfo;

var planetSize, planetData, inPlanet, planet,
    planetText, planetTextInfo, atmoMaterial, planetTilt, hasRings,
    PlanetMaterial, moonList, ringsList, outline, planetObject,
    atmo, planetRotationPeriod, planetSelected, planetName;

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
    customColorSwitch: { type: "i", value: 0 },
    customColor: { type: "v3", value: new THREE.Vector3(1, 1, 1) },
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
        - 50000, 10000);

    camera.position.y = -40;
    camera.naer = 0.001;
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
    renderer.shadowMap.shadowSide = false;
    //renderer.shadowMap.shadowSide = false;
    //renderer.Material.shadowMap = false;
    clock = new THREE.Clock();

    //Add Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', UpdateLook);
    //controls.minZoom = 0.3;
    //controls.maxZoom = 1.5;

    dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    var vector = new THREE.Vector3(750, 500, 1000);
    dirLight.position.set(vector);

    dirLight.shadow.camera.near = 0.001;
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

    gui = new dat.GUI();

    //console.log(regions);

    var namegrab = word(randomRange(3, 25));
    var palletei = Math.round(randomRange(1, ColorPalletes.length - 1));
    regions = CreateRegion(palletei);
    var moons = Math.round(randomRange(1, 6));
    var rings = Math.round(randomRange(1, 6));
    var planetsize = randomRange(1, 250);

    planet_params = {
        name: (randomRange(0, 10) > 5) ? namegrab + "-" + Math.round(randomRange(0, 1000)) : namegrab, //randomRange(0.65, 0.85)
        persistance: randomRange(0.1, 2.85), //randomRange(0.65, 0.85)
        lacunarity: randomRange(0.1, 1.5), //randomRange(1.90, 2.20)
        octaves: Math.round(randomRange(1, 6)), //randomRange(4, 6)
        noiseScale: randomRange(0.1, 3),
        numberOfMoons: moons,
        numberOfRings: rings,
        planetTilt: randomRange(-55, 55),
        planetSize: planetsize,
        planetRotationPeriod: Math.round(randomRange(0.1, 100)),
        seed: Math.round(randomRange(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)),
        ColorPalleteIndex: palletei,
        hasRings: (randomRange(0, 10) >= 5) ? true : false,
        isGassy: (randomRange(0, 10) >= 8.5) ? true : false,
        addMoon: function () {
            if (planet_params.numberOfMoons < 6) {
                planet_params.numberOfMoons++;
                moon_params_list.push(CreateMoonParamData());
                ReloadMoonFolder();
                ReloadRegionMap();
                Reload();
            }
        },
        removeMoon: function () {


            if (planet_params.numberOfMoons  != 0) {
                planet_params.numberOfMoons--;
                moon_params_list.pop();
                ReloadMoonFolder();
                ReloadRegionMap();
                Reload();
            }
        },
        addRing: function () {
            if(!planet_params.hasRings && planet_params.numberOfRings != 0)
                planet_params.hasRings = true;

                if (planet_params.numberOfRings < 6) {
                    planet_params.numberOfRings++;
                    ring_params_list.push(CreateRingParamData(i));

                    if(!planet_params.hasRings)
                        planet_params.hasRings = true;

                    ReloadRingFolder();
                    ReloadRegionMap();
                    Reload();
                }
            if(!planet_params.hasRings && planet_params.numberOfRings != 0)
                planet_params.hasRings = true;
        },
        removeRing: function () {
            if(planet_params.hasRings && planet_params.numberOfRings <= 0)
                planet_params.hasRings = false;

                if (planet_params.numberOfRings != 0) {
                    planet_params.numberOfRings--;
                    ring_params_list.pop();
                    ReloadRingFolder();
                    ReloadRegionMap();
                    Reload();
                }

                if(planet_params.hasRings && planet_params.numberOfRings <= 0)
                planet_params.hasRings = false;
        },
        randomize: function () {
            var namegrab = word(randomRange(3, 25));
            var palletei = Math.round(randomRange(1, ColorPalletes.length - 1));
            var moons = Math.round(randomRange(1, 6));
            var rings = Math.round(randomRange(1, 6));
            var planetsize = randomRange(1, 250);

            this.name = (randomRange(0, 10) > 5) ? namegrab + "-" + Math.round(randomRange(0, 1000)) : namegrab;
            this.persistance = randomRange(0.1, 2.85);
            this.lacunarity = randomRange(0.1, 1.5);
            this.octaves = Math.round(randomRange(1, 6));
            this.noiseScale = randomRange(0.1, 3);
            this.numberOfMoons = moons;
            this.numberOfRings = rings;
            this.planetTilt = randomRange(-55, 55);
            this.planetSize = planetsize;
            this.planetRotationPeriod = Math.round(randomRange(0.1, 100));
            this.seed = Math.round(randomRange(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER));
            this.hasRings = (randomRange(0, 10) >= 5) ? true : false;
            this.isGassy = (randomRange(0, 10) >= 8.5) ? true : false;
            this.ColorPalleteIndex = palletei;

            moon_params_list = [];
            for (var i = 0; i < moons; i++) {
                moon_params_list.push(CreateMoonParamData());
            }

            ring_params_list = [];
            for (var j = 0; j < rings; j++) {
                ring_params_list.push(CreateRingParamData(j));
            }

            ReloadMoonFolder();
            ReloadRingFolder();
            ReloadRegionMap();
            Reload();
            // planet_range_gui.open();
            atmo_params.randomize();
        },
        AddRegion: function (index) {

            try {
                region = { range: 1, color: "#ffae23" };
                regions.push(region)
                planet_colors_gui.addColor(region, 'color');
            }
            catch{

            }
        },
    };

    colgrab = ColorPalletes[randomRangeRound(0, ColorPalletes.length - 1)],

        atmo_params = {
            fresnel: randomRange(0.10, 1.99),
            transwidth: randomRange(0.01, 0.05),
            thickness: randomRange(0.01, 3.00),
            atmosize: randomRange(1.02, 1.2),
            colorsRGBLight: colgrab[randomRangeRound(0, colgrab.length - 1)].hex,
            colorsRGBDark: colgrab[randomRangeRound(0, colgrab.length - 1)].hex,

            randomize: function () {
                colgrab = ColorPalletes[randomRangeRound(0, ColorPalletes.length - 1)],

                this.fresnel = randomRange(0.10, 1.99);
                this.transwidth = randomRange(0.01, 0.05);
                this.thickness = randomRange(0.01, 3.00);
                this.atmosize = randomRange(1.02, 1.2);
                this.col = ColorPalletes[randomRangeRound(0, ColorPalletes.length - 1)];
                this.colorsRGBLight = colgrab[randomRangeRound(0, colgrab.length - 1)].hex;
                this.colorsRGBDark = colgrab[randomRangeRound(0, colgrab.length - 1)].hex;
            }
        }

    //Parametres for a single Moon, then add to moon folder, and read from moon folder (ouch)
    for (var i = 0; i < planet_params.numberOfMoons; i++) {
        moon_params_list.push(CreateMoonParamData());
    }

    for (var j = 0; j < planet_params.numberOfRings; j++) {
        ring_params_list.push(CreateRingParamData(j));
    }

    planet_gen_gui = gui.addFolder('Planet Parameters');
    name_event = planet_gen_gui.add(planet_params, 'name').name('name').listen();
    name_event.domElement.style.disabled = false;

    name_event.domElement.style.pointerEvents = "defualt"
    persistance_event = planet_gen_gui.add(planet_params, 'persistance', 0.1, 2.85).name('persistance').listen();;
    lacunarity_event = planet_gen_gui.add(planet_params, 'lacunarity', 0.1, 1.5).name('lacunarity').listen();;
    octaves_event = planet_gen_gui.add(planet_params, 'octaves', 1, 6).name('octaves').listen();
    noiseScale_event = planet_gen_gui.add(planet_params, 'noiseScale', 0.1, 3).name('noiseScale').listen();

    planetRotationPeriod_event = planet_gen_gui.add(planet_params, 'planetRotationPeriod', 0.1, 100).name('Rotation').listen();


    planetTilt_event = planet_gen_gui.add(planet_params, 'planetTilt', -55, 55).name('Tilt').listen();
    planetSize_event = planet_gen_gui.add(planet_params, 'planetSize', 1, 250).name('Size').listen();
    hasRings_event = planet_gen_gui.add(planet_params, 'hasRings').name('hasRings').listen();

    hasRings_event.domElement.style.pointerEvents = "none"
    hasRings_event.domElement.style.opacity = .5;

    isGassy_event = planet_gen_gui.add(planet_params, 'isGassy').name('isGassy').listen();
    seed_event = planet_gen_gui.add(planet_params, 'seed', Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER).name('Seed').listen();
    ColorPalleteIndex_event = planet_gen_gui.add(planet_params, 'ColorPalleteIndex', 1, ColorPalletes.length - 1).name('Pallette Index').listen().step(1);

    numberOfMoons_event = planet_gen_gui.add(planet_params, 'numberOfMoons', parseInt(1), parseInt(6)).name('#Moons').listen().step(1);

    numberOfMoons_event.domElement.style.pointerEvents = "none"
    numberOfMoons_event.domElement.style.opacity = .5;

    numberOfRings_event = planet_gen_gui.add(planet_params, 'numberOfRings', 1, 6).name('#Rings').listen().step(1);
    
    numberOfRings_event.domElement.style.pointerEvents = "none"
    numberOfRings_event.domElement.style.opacity = .5;

    planet_gen_gui.add(planet_params, 'randomize');
    planet_gen_gui.add(planet_params, 'addMoon');
    planet_gen_gui.add(planet_params, 'removeMoon');
    planet_gen_gui.add(planet_params, 'addRing');
    planet_gen_gui.add(planet_params, 'removeRing');

    atmo_gen_gui = gui.addFolder('Atmosphere Parameters');
    fresnel_event = atmo_gen_gui.add(atmo_params, 'fresnel', 0.10, 1.99).name('fresnel').listen();
    transwidth_event = atmo_gen_gui.add(atmo_params, 'transwidth', 0.01, 0.05).name('transwidth').listen();
    thickness_event = atmo_gen_gui.add(atmo_params, 'thickness', 0.01, 3.00).name('thickness').listen();
    atmosize_event = atmo_gen_gui.add(atmo_params, 'atmosize', 1.02, 1.2).name('atmosize').listen();
    colorsRGBLight_event = atmo_gen_gui.addColor(atmo_params, 'colorsRGBLight').name('Light').listen();
    colorsRGBDark_event = atmo_gen_gui.addColor(atmo_params, 'colorsRGBDark').name('Dark').listen();

    planet_colors_gui = planet_gen_gui.addFolder('ColorMap');

    gui_color_event_list = [];
    for (var i = 0; i < regions.ColorPallette.length; i++) {
        gui_color_event_list.push(planet_colors_gui.addColor(regions.ColorPallette[i], 'hex').name(i.toString()).listen());
    }

    planet_range_gui = planet_gen_gui.addFolder('Ranges');
    gui_range_event_list = [];

    for (var i = 0; i < regions.Data.length; i++) {
        gui_range_event_list.push(planet_range_gui.add(regions.Data[i], 'height').name(i.toString()).listen());
    }


    moons_gen_gui = gui.addFolder('Moons Parameters');

    for (var i = 0; i < moons; i++) {

        moons_gen_gui_list[i] = moons_gen_gui.addFolder(moon_params_list[i].name);

        moon_event_list.push(
            moons_gen_gui_list[i].add(moon_params_list[i], 'name'),
            moons_gen_gui_list[i].add(moon_params_list[i], 'i1', -60, 60).name('I1'),
            moons_gen_gui_list[i].add(moon_params_list[i], 'a1', 0.1, 0.25).name('Orbit Diameter'),
            moons_gen_gui_list[i].add(moon_params_list[i], 'moonSize', 1, 20).name('size'),
            moons_gen_gui_list[i].add(moon_params_list[i], 'orbitSpeedMult', -2, 2).name('orbit speed'),
            moons_gen_gui_list[i].addColor(moon_params_list[i], 'orbitcolor'),
            moons_gen_gui_list[i].addColor(moon_params_list[i], 'mooncolor'),
        );

    }

    rings_gen_gui = gui.addFolder('Ring Parameters');
    for (var i = 0; i < planet_params.numberOfRings; i++) {

        rings_gen_gui_list[i] = rings_gen_gui.addFolder('Rings ' + i.toString());
        rings_gen_gui_list[i].domElement.style.background = "#ffffff url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat";

        ring_event_list.push(
            
            rings_gen_gui_list[i].add(ring_params_list[i], 'a1', 0.15, 2.25).name('radius'), //distance from the planet
            rings_gen_gui_list[i].add(ring_params_list[i], 'a3', 0.1, 0.75).name('a3'), //distance from the a1
            rings_gen_gui_list[i].add(ring_params_list[i], 'isFlat').name('isFlat'),
            rings_gen_gui_list[i].add(ring_params_list[i], 'period', -50, 50).name('orbit speed'),
            rings_gen_gui_list[i].add(ring_params_list[i], 'numberofBodies', 0, 100),
            rings_gen_gui_list[i].add(ring_params_list[i], 'orbitSpeedMult', -25, 25),
            rings_gen_gui_list[i].add(ring_params_list[i], 'index', 1, ColorPalletes.length - 1).step(1),
        );
        //rings_gen_gui_list[i].open();
    }

    //planet_colors_gui.open();
    planet_gen_gui.open();
    //planet_range_gui.open();

    OnChangeEvents();
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

function CreateMoonParamData() {
    size = randomRange(1, Math.round(planetSize / 4));
    orbitspeed = randomRange(-2, 2);
    orbitspeed = (orbitspeed == 0) ? 1 : orbitspeed;
    var mooncolgrab = ColorPalletes[randomRangeRound(0, ColorPalletes.length - 1)];

    var param_data = {
        name: (randomRange(0, 10) > 5) ? word(randomRange(3, 25)) + "-" + Math.round(randomRange(0, 1000)) : word(randomRange(3, 25)),
        radius: 1.5424,
        i1: randomRange(-60, 60),
        a1: randomRange(0.1, 0.25),
        moonSize: randomRange(1, 20),
        selected: false,
        orbitSpeedMult: (randomRange(-2, 2) == 0) ? 1 : randomRange(-2, 2),
        orbitcolor: mooncolgrab[randomRangeRound(0, mooncolgrab.length - 1)].hex,
        mooncolor: mooncolgrab[randomRangeRound(0, mooncolgrab.length - 1)].hex,
        index: 1,

        randomize: function () {
            name = (randomRange(0, 10) > 5) ? word(randomRange(3, 25)) + "-" + Math.round(randomRange(0, 1000)) : word(randomRange(3, 25));
            i1 = randomRange(-60, 60);
            a1 = randomRange(0.1, 0.25),
                moonSize = randomRange(1, 20),
                orbitSpeedMult = (randomRange(-2, 2) == 0) ? 1 : randomRange(-2, 2);
            text = false,
                orbitcolor = mooncolgrab[randomRangeRound(0, mooncolgrab.length - 1)].hex;
            mooncolor = mooncolgrab[randomRangeRound(0, mooncolgrab.length - 1)].hex;
        },
    }

    return param_data;
}

function ReloadMoonFolder() {

    //planet_gen_gui.removeFolder('ColorMap');
    for (var i = 0; i < moons_gen_gui_list.length; i++) {
        moons_gen_gui.removeFolder(moons_gen_gui_list[i]);
    }

    gui.removeFolder(moons_gen_gui);

    moons_gen_gui = gui.addFolder('Moons Parameters');
    moons_gen_gui_list = [];

    for (var i = 0; i < planet_params.numberOfMoons; i++) {

        moons_gen_gui_list[i] = moons_gen_gui.addFolder('Moons ' + i.toString());

        moon_event_list.push(
            moons_gen_gui_list[i].add(moon_params_list[i], 'name'),
            moons_gen_gui_list[i].add(moon_params_list[i], 'i1', -60, 60).name('I1'),
            moons_gen_gui_list[i].add(moon_params_list[i], 'a1', 0.1, 0.25).name('a1'),
            moons_gen_gui_list[i].add(moon_params_list[i], 'moonSize', 1, 20).name('size'),
            moons_gen_gui_list[i].add(moon_params_list[i], 'orbitSpeedMult', -2, 2).name('orbit speed'),
            moons_gen_gui_list[i].addColor(moon_params_list[i], 'orbitcolor'),
            moons_gen_gui_list[i].addColor(moon_params_list[i], 'mooncolor'),
        );
        moons_gen_gui_list[i].open();
    }

    for (var i = 0; i < moon_event_list.length; i++) {
        moon_event_list[i].onChange(function (value) {
            Reload();
        });
    }
}

function CreateRingParamData(i) {
    var flat;
    var per;
    var roll = Math.round(randomRange(0, 10));

    if (roll >= 3)
        flat = false;
    else
        flat = true;

    var roll = Math.round(randomRange(0, 1));

    per = randomRange(-50, 50);
    var ringcolgrab = ColorPalletes[randomRangeRound(0, ColorPalletes.length - 1)];

    var param_data = {
        tilt: planet_params.planetTilt,
        a1: randomRange(0.15, 2.25),
        a3: randomRange(0.1, 0.75),
        isFlat: flat,
        period: per,
        numberofBodies: randomRange(36, 52),
        orbitSpeedMult: randomRange(-25, 25),
        index: randomRange(1, ColorPalletes.length - 1),
    }

    return param_data;
}

function ReloadRingFolder() {

    //planet_gen_gui.removeFolder('ColorMap');
    for (var i = 0; i < rings_gen_gui_list.length; i++) {
        rings_gen_gui.removeFolder(rings_gen_gui_list[i]);
    }

    gui.removeFolder(rings_gen_gui);

    rings_gen_gui = gui.addFolder('Ring Parameters');
    rings_gen_gui_list = [];

    for (var i = 0; i < planet_params.numberOfRings; i++) {

        rings_gen_gui_list[i] = rings_gen_gui.addFolder('Rings ' + i.toString());

        ring_event_list.push(
            rings_gen_gui_list[i].add(ring_params_list[i], 'a1', 0.15, 2.25).name('radius'),
            rings_gen_gui_list[i].add(ring_params_list[i], 'a3', 0.1, 0.75).name('a3'),
            rings_gen_gui_list[i].add(ring_params_list[i], 'isFlat').name('isFlat'),
            rings_gen_gui_list[i].add(ring_params_list[i], 'period', -50, 50).name('orbit speed'),
            rings_gen_gui_list[i].add(ring_params_list[i], 'numberofBodies', 0, 100).step(1),
            rings_gen_gui_list[i].add(ring_params_list[i], 'orbitSpeedMult', -25, 25),
            rings_gen_gui_list[i].add(ring_params_list[i], 'index', 1, ColorPalletes.length - 1).step(1),
        );


        rings_gen_gui_list[i].open();
    }

    for (var i = 0; i < ring_event_list.length; i++) {
        ring_event_list[i].onChange(function (value) {
            Reload();
        });
    }
}

function ReloadRegionMap() {

    regions = CreateRegion(planet_params.ColorPalleteIndex);

    //planet_gen_gui.removeFolder('ColorMap');
    for (var i = 0; i < gui_color_event_list.length; i++) {
        //gui_color_event_list.push(planet_colors_gui.addColor(regions.ColorPallette[i], 'hex').name(i.toString()).listen());
        //delete gui_color_event_list[i];

        planet_colors_gui.remove(gui_color_event_list[i]);
    }
    planet_gen_gui.removeFolder(planet_colors_gui);

    planet_colors_gui = planet_gen_gui.addFolder('ColorMap');

    gui_color_event_list = [];
    for (var i = 0; i < regions.ColorPallette.length; i++) {
        gui_color_event_list.push(planet_colors_gui.addColor(regions.ColorPallette[i], 'hex').name(i.toString()));
    }

    //planet_colors_gui.open();

    for (var j = 0; j < gui_range_event_list.length; j++) {
        //gui_color_event_list.push(planet_colors_gui.addColor(regions.ColorPallette[i], 'hex').name(i.toString()).listen());
        planet_range_gui.remove(gui_range_event_list[j]);
    }

    planet_gen_gui.removeFolder(planet_range_gui);

    planet_range_gui = planet_gen_gui.addFolder('Ranges');

    gui_range_event_list = [];
    for (var i = 0; i < regions.Data.length; i++) {
        gui_range_event_list.push(planet_range_gui.add(regions.Data[i], 'height').name(i.toString()));
    }

    for (var i = 0; i < gui_color_event_list.length; i++) {
        gui_color_event_list[i].onChange(function (value) {
            Reload();
        });
    }


    for (var i = 0; i < gui_range_event_list.length; i++) {
        gui_range_event_list[i].onChange(function (value) {
            Reload();
        });
    }
}

function OnChangeEvents() {

    persistance_event.onChange(function (value) {
        Reload();
    });
    lacunarity_event.onChange(function (value) {
        Reload();
    });

    for (var i = 0; i < gui_color_event_list.length; i++) {
        gui_color_event_list[i].onChange(function (value) {
            Reload();
        });
    }

    for (var i = 0; i < gui_range_event_list.length; i++) {
        gui_range_event_list[i].onChange(function (value) {
            Reload();
        });
    }

    for (var i = 0; i < moon_event_list.length; i++) {
        moon_event_list[i].onChange(function (value) {
            Reload();
        });
    }

    for (var i = 0; i < ring_event_list.length; i++) {
        ring_event_list[i].onChange(function (value) {
            Reload();
        });
    }

    isGassy_event.onChange(function (value) {
        Reload();
    });

    octaves_event.onChange(function (value) {
        Reload();
    });
    noiseScale_event.onChange(function (value) {
        Reload();
    });
    numberOfMoons_event.onChange(function (value) {
        Reload();
    });
    numberOfRings_event.onChange(function (value) {
        Reload();
    });
    planetTilt_event.onChange(function (value) {
        Reload();
    });
    planetRotationPeriod_event.onChange(function (value) {
        Reload();
    });
    planetSize_event.onChange(function (value) {
        Reload();
    });
    //hasRings_event.onChange(function (value) {
    //    Reload();
    //});

    fresnel_event.onChange(function (value) {
        Reload();
    });

    name_event.onChange(function (value) {
        Reload();
    });

    transwidth_event.onChange(function (value) {
        Reload();
    });
    thickness_event.onChange(function (value) {
        Reload();
    });
    atmosize_event.onChange(function (value) {
        Reload();
    });
    colorsRGBLight_event.onChange(function (value) {
        Reload();
    });
    colorsRGBDark_event.onChange(function (value) {
        Reload();
    });

    ColorPalleteIndex_event.onChange(function (value) {
        ReloadRegionMap();
        Reload();
    });

    seed_event.onChange(function (value) {
        Reload();
    });
}

function Reload() {
    if (ShaderLoadList.planet.vertex == undefined) {
        ShaderLoader('js/Shaders/Planet/Planet.vs.glsl',
            'js/Shaders/Planet/Planet.fs.glsl', setUpPlanet, false);
    }
    else {
        createPlanet(false, ShaderLoadList.planet.vertex, ShaderLoadList.planet.fragment);
    }
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
            skyboxuniforms.time.value = 60 * elapsedSeconds;
        PlanetRotation(planet, planetRotationPeriod, planetTilt, delta);
        //planetText.updatePosition(planetSize - 20, - planetText.element.clientWidth / 2, 75);
    }

    if (ringsList !== undefined) {
        for (var i = 0; i < ringsList.length; i++) {
            RingOrbit(ringsList[i], ringsList[i].Ring, new THREE.Vector3(0, 0, 0),
                clock.getElapsedTime(), 1000, 24, delta);
        }
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
                        //console.log("Ass");
                        //child.lookAt(camera.position);
                        child.quaternion.copy(camera.quaternion);
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

function CalculateParametres(vertex_text, fragment_text) {
    persistance = planet_params.persistance;//randomRange(0.65, 0.85);
    lacunarity = planet_params.lacunarity;//randomRange(1.9, 2.2);
    octaves = Math.round(planet_params.octaves);//Math.round(randomRange(4, 6));
    noiseScale = planet_params.noiseScale;//randomRange(10, 200);
    moonListsize = planet_params.numberOfMoons;//Math.round(randomRange(1, 4))
    ringlistsize = Math.round(planet_params.numberOfRings);//Math.round(randomRange(1, 4));
    moonList = new Array(moonListsize);
    planetTilt = planet_params.planetTilt;//randomRange(-55, 55);
    planetSize = planet_params.planetSize;//randomRange(40, 110);
    planetRotationPeriod = planet_params.planetRotationPeriod;///Math.round(randomRange(65, 100));
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

    //ringsList =[];
    ringsList = new Array(ringlistsize);

    var index = randomRangeRound(1, ColorPalletes.length - 1);
    AstoColorPalleteGrab = colors;

    InitializeRingsData(ringsList);
  
    if (ringsList !== undefined) {
        for (var i = 0; i < ringsList.length; i++) {
            var colors = ColorPalletes[Math.round(ring_params_list[i].index)];
            if (!ringsList[i].isFlat) {
                CreateRockyBelt(ringsList[i], new THREE.Vector3(0, 0, 0), clock.getElapsedTime(),
                    1000, ringsList[i].NumAstros, ringsList[i].Ring, vertex_text, fragment_text,
                    dirLight.position, ringsList[i].astoList, colors, ring_params_list[i].index, i, planet_params.planetSize);
                //export_rocky_ring(ringsList[i].Ring, i, {astomat:ringsList[i].Ring.children[0].children[0].material}, ringsList.length);
            }
            else {
                if (ShaderLoadList.ring.vertex == undefined) {
                    ShaderLoader('js/Shaders/Ring/Ring.vs.glsl',
                        'js/Shaders/Ring/Ring.fs.glsl', SetUpFlatBelt, { data: ringsList[i], Ringcolors: colors, index: i, palletteIndex: index });
                }
                else {

                    CreateFlatBelt({ data: ringsList[i], Ringcolors: colors, index: i, palletteIndex: index },
                        ShaderLoadList.ring.vertex, ShaderLoadList.ring.fragment);
                }
            }

            MainScene.add(ringsList[i].Ring);
        }

        UpdateLook();
    }
}

function CreateFlatBelt(ringData, vertex_text, fragment_text) {
    //var ringshaderinformation = "";
    var shaderinfosave = { name: "index: " + ringData.index.toString(), colorPalleteIndex: ringData.palletteIndex, limits: '', colors: [], transparancy: [] }

    //ringshaderinformation += "index: "+ ringData.index.toString() +", colorPalleteIndex: " + ringData.palletteIndex.toString();

    var ringGeo = new RingGeoCreate(ringData.data, ringData.data.Ring, 1000);
    var ringLimits = new Array(5);
    var transparency = new Array(5);

    ringLimits[0] = randomRange(0.01, 0.5);
    ringLimits[1] = randomRange(ringLimits[0], 0.6);
    ringLimits[2] = randomRange(ringLimits[1], 0.9);

    // ringshaderinformation += ", ringLimits_"+ (0).toString() +": " + ringLimits[0];
    // ringshaderinformation += ", ringLimits_"+ (1).toString() +": " + ringLimits[1];
    // ringshaderinformation += ", ringLimits_"+ (2).toString() +": " + ringLimits[2];

    shaderinfosave.limits = [ringLimits[0], ringLimits[1], ringLimits[2]];

    var colorsRGB = [];

    for (var j = 0; j < ringData.Ringcolors.length; j++) {
        var R = ringData.Ringcolors[j].RGB.r;
        var G = ringData.Ringcolors[j].RGB.g;
        var B = ringData.Ringcolors[j].RGB.b;

        var normalColors = new THREE.Vector3(R, G, B);
        //ringshaderinformation += ", color_"+ j.toString() +": " + "r:" + R.toString() + ", g:" + G.toString() + ", b:" + B.toString();
        shaderinfosave.colors.push({ r: R, g: G, b: B });
        colorsRGB.push(normalColors);
    }
    for (var i = 0; i < 5; i++) {
        transparency[i] = randomRange(0.1, 1.0);
        //ringshaderinformation += ", transparency_"+ i.toString() +": " + transparency[i];
        shaderinfosave.transparancy.push(transparency[i]);
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

    var material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
    });

    var newRing = new THREE.Mesh(ringGeo, ringMaterial);
    newRing.castShadow = true;
    newRing.receiveShadow = true;

    ringData.data.Ring.add(newRing);

    //console.log(shaderinfosave);

    //export_ring(newRing, ringData.index, ringMaterial, shaderinfosave, false);
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

            
        //if (i == 0) {
    //    orbitrangeInner = randomRange((planetSize / 1000) * 1.1, (planetSize / 1000) * 1.2);
    //    orbitrangeOutter = randomRange(orbitrangeInner * 1.05, orbitrangeInner * 1.15);
    //}
    //else if (i >= 1) {
    //    orbitrangeInner = randomRange((ringsList[i - 1].a1), (ringsList[i - 1].a1) * 1.15);
    //    orbitrangeOutter = randomRange(orbitrangeInner * 1.05, orbitrangeInner * 1.15);
    //}
    
        if (i == 0) {
            orbitrangeInner = planet_params.planetSize / 1000 * (ring_params_list[i].a1 + 1);
            orbitrangeOutter = (planet_params.planetSize / 1000 * ring_params_list[i].a3) + orbitrangeInner;
        }
        else if (i >= 1) {
            orbitrangeInner = planet_params.planetSize / 1000 * ((ring_params_list[i - 1].a1 + ring_params_list[i - 1].a3) + ring_params_list[i].a1 + 1);
            orbitrangeOutter = (planet_params.planetSize / 1000 * ring_params_list[i].a3) + orbitrangeInner;
        }
        
        var roll = Math.round(randomRange(0, 1));

        per = randomRange(1, 25);
        if (roll <= 0) {
            orbitspeed = randomRange(25, 50);
            per = (per == 0) ? 1 : orbitspeed;
        }
        else {
            orbitspeed = randomRange(-25, -50);
            per = (per == 0) ? 1 : orbitspeed;
        }

        ringsList[i] =
            {
                radius: 1.5424, tilt: planet_params.planetTilt, N1: 125.1228, N2: 0,
                i1: 0, i2: 0, w1: 360, w2: 0.27,
                a1: orbitrangeOutter, a2: 0, a3: orbitrangeInner, a4: 0, e1: 0, e2: 0, isFlat: ring_params_list[i].isFlat,
                M1: 115.3654, M2: 13.0649929509, period: ring_params_list[i].period, NumAstros: Math.round(ring_params_list[i].numberofBodies),
                Ring: new THREE.Object3D(), orbitSpeedMult: ring_params_list[i].orbitSpeedMult, astoList: [], color_index: ring_params_list[i].index
            }

    }

}
//--------------------------------------------MOON CREATE-------------------------------------------------------\\
function InitializeMoonData(moonList, vertex_text, fragment_text) {
    for (var i = 0; i < moonList.length; i++) {
        var roll = randomRange(0, 10);

        var mat;
        size = randomRange(1, Math.round(planetSize / 4));
        orbitspeed = randomRange(-2, 2);
        orbitspeed = (orbitspeed == 0) ? 1 : orbitspeed;

        //moon_colors = 
        //[
        //    new ColorData (moon_params_list[i].color, new THREE.Color( 0, 140, 255   )),
        //    new ColorData (moon_params_list[i].color, new THREE.Color( 102, 179, 255 )),
        //    new ColorData (moon_params_list[i].color, new THREE.Color( 255, 204, 102 )),
        //    new ColorData (moon_params_list[i].color, new THREE.Color( 177,223,142  )  ),
        //    new ColorData (moon_params_list[i].color, new THREE.Color( 201, 158, 29 )),
        //    new ColorData (moon_params_list[i].color, new THREE.Color( 242, 242, 242)),
        //];
        //
        //moon_region_info = new RegionInformation
        //(
        //    moon_colors , "" ,
        //    0, 0, true, "",  3, ''
        //);

        //moonData = createPlantiodData(octaves, persistance, lacunarity,
        //    seed, 128, offset, 24);

        moonMaterial = PlanetMaterial.clone();

        var moonCol = new THREE.Color(moon_params_list[i].mooncolor);
        moonMaterial.uniforms.customColorSwitch.value = 1;
        moonMaterial.uniforms.customColor.value = new THREE.Vector3(moonCol.r, moonCol.g, moonCol.b);;
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
                i1: moon_params_list[i].i1, i2: 0, w1: 318.0634, w2: 0.1643573223,
                a1: moon_params_list[i].a1 * planet_params.planetSize / 75, a2: 0, e1: 0, e2: 0,
                M1: 115.3654, M2: 13.0649929509, period: 1, moonSize: moon_params_list[i].moonSize * planet_params.planetSize / 100,
                moonObject: createMoon(moon_params_list[i].moonSize * planet_params.planetSize / 100, mat), material: mat, selected: false,
                moonOrbit: 0, orbitSpeedMult: moon_params_list[i].orbitSpeedMult, inMoon: false, text: false
            }
    }
}
//--------------------------------------------MOON CREATE-------------------------------------------------------\\


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


//--------------------------------------------STAR BACKGORUND CREATE-------------------------------------------------------\\
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
//--------------------------------------------STAR BACKGORUND CREATE-------------------------------------------------------\\

//--------------------------------------------ATMO CREATE-------------------------------------------------------\\
function createAtmos(colors, vertex_text, fragment_text) {
    if (atmo !== undefined) {
        MainScene.remove(atmo);
        doDispose(atmo);
    }
    var col = ColorPalletes[randomRangeRound(0, ColorPalletes.length - 1)];

    var lightcol = new THREE.Color(atmo_params.colorsRGBLight);
    var darkcol = new THREE.Color(atmo_params.colorsRGBDark);

    var colorsRGBLight = { r: lightcol.r * 255, g: lightcol.g * 255, b: lightcol.b * 255 };//col[randomRangeRound(0, col.length - 1)].RGB;
    var colorsRGBDark = { r: darkcol.r * 255, g: darkcol.g * 255, b: darkcol.b * 255 };

    var fresnel = atmo_params.fresnel;//randomRange(0.10, 1.99)
    atmouniforms.fresnelExp.value = fresnel;

    var transwidth = atmo_params.transwidth;//randomRange(0.01, 0.05)
    atmouniforms.transitionWidth.value = transwidth;

    atmouniforms.colorlight.value = colorsRGBLight;
    atmouniforms.colordark.value = colorsRGBDark;

    var thickness = atmo_params.thickness;//randomRange(0.01, 3.00);
    atmouniforms.atmoThickness.value = thickness;

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
    var atmosize = planetSize * atmo_params.atmosize;//randomRange(1.01, 1.05);

    atmo = new THREE.Mesh(new THREE.IcosahedronGeometry(atmosize, 4), atmoMaterial);
    atmo.position.set(0, 0, 0);//= planet.position;
    atmo.castShadow = false;
    atmo.receiveShadow = false;
    MainScene.add(atmo);
    atmosphereshaderinfo = { colorLight: colorsRGBLight, colorDark: colorsRGBDark, fresnel: fresnel, transitionWidth: transwidth, thickness: thickness, size: atmosize };
    //export_atm(atmo, atmoMaterial, atmosphereshaderinfo);
}
//--------------------------------------------ATMO CREATE-------------------------------------------------------\\

//--------------------------------------------GARBAGE DUMP-------------------------------------------------------\\
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
//--------------------------------------------GARBAGE DUMP-------------------------------------------------------\\

//--------------------------------------------PLANET CREATE-------------------------------------------------------\\
function createPlanet(start, vertex_text, fragment_text) {

    if (planet !== undefined) {
        RemoveOldShizz();
    }
    else {
        var vertex = vertex_text;
        var fragment = fragment_text;
        var ico = new THREE.IcosahedronGeometry(planetSize, 2);

        PlanetMaterial = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib['lights'],
                planetUniform]),
            vertexShader: (vertex),
            fragmentShader: (fragment),
            lights: true
        });
        //TargetUI();
        //refreshPlanetButton = generateButtonUi(new THREE.Vector3(0, 0, 0)
        //    , "110px", -1000, "img/Icons/Refresh.png", "Ui-Label", "Refresh");
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
    var ico = new THREE.IcosahedronGeometry(planetSize, 2);

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
    //planetData.colors
    for (var i = 0; i < moonList.length; i++) {
        moonList[i].moonOrbit = DrawOrbit(moonList[i], new THREE.Vector3(0, 0, 0),
            clock.getElapsedTime(), 1000, moon_params_list[i].orbitcolor, i, moonList.length);
        MainScene.add(moonList[i].moonObject);

        if (moonList[i].moonOrbit != 0)
            MainScene.add(moonList[i].moonOrbit);

        moonList[i].text = generateName(moonList[i].moonObject, "35px", -1000, false, "", "",
            moon_params_list[i].name);// generateName(planet, "35px", -1000);
    }

    //var roll = randomRange(0, 10);

    if (planet_params.hasRings) {//if (roll >= 5) {
        //hasRings = true;

        if (ShaderLoadList.asto.vertex == undefined) {
            ShaderLoader('js/Shaders/Asto/Asto.vs.glsl',
                'js/Shaders/Asto/Asto.fs.glsl', setUpRings, planetData.colors);
        }
        else {
            setUpRings(planetData.colors, ShaderLoadList.asto.vertex, ShaderLoadList.asto.fragment);
        }
    }
    else {
        //hasRings = false;
    }

    planetTextInfo = generateName(planet, 1, -1000, true, planetData.colors, planetData.regionsInfo);
    planetTextInfo.setWidthbyPercent(75);
    planetTextInfo.setHeight(planetSize);
    planet.name = planet_params.name;//planetName;


    //clear custom material (for now)
    var material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
    });

    //.material = material;
    // P//ostPLanetInformation(planetData.map, planet);
    //planet.material = PlanetMaterial;
}
//--------------------------------------------PLANET CREATE-------------------------------------------------------\\


//--------------------------------------------PLANET POST-------------------------------------------------------\\
function PostPLanetInformation(map, planetobject) {
    // create off-screen canvas element
    var canvastest = document.createElement('canvas'),
        ctx = canvastest.getContext('2d');
    document.getElementById("foot").appendChild(canvastest);

    canvastest.width = 256;
    canvastest.height = 256;

    // create imageData object
    var idata = ctx.createImageData(256, 256);

    // set our buffer as source
    //idata.data.set(map.image);
    //console.log(map);
    for (var x = 0; x < 256; x++) {
        for (var y = 0; y < 256; y++) {
            var idx = (x + y * 256) * 4;
            var idx2 = (x + y * 256) * 3;
            idata.data[idx + 0] = map.image.data[idx2 + 0];
            idata.data[idx + 1] = map.image.data[idx2 + 1];
            idata.data[idx + 2] = map.image.data[idx2 + 2];
            idata.data[idx + 3] = 255;
        }
    }
    // update canvas with new data
    ctx.putImageData(idata, 0, 0);
    var dataUri = canvastest.toDataURL('image/png'); // produces a PNG file



    export_object(planetobject, dataUri);


    //if (hasRings) {
    //    for (var i = 0; i < ringlistsize; i++) {
    //        if(ringsList[i] !== undefined)
    //            export_ring(ringsList[i].Ring, i);
    //    }
    //}

    $.ajax({
        type: 'POST',
        url: '/planet_information_post.php',
        data: {
            name: planetName, texture_url: "Test_Url", size: planetSize, Tilt: planetTilt,
            RotationPeriod: planetRotationPeriod, numMoons: moonListsize, numRings: (hasRings) ? ringlistsize : 0,
        },
        success: function (d) {
            console.log('done');
        }
    });
}
//--------------------------------------------PLANET POST-------------------------------------------------------\\

//--------------------------------------------PLANET OBJECT POST-------------------------------------------------------\\
function export_object(object, image) {

    var gltfExporter = new THREE.GLTFExporter();
    var options = {
        trs: false,
        onlyVisible: false,
        truncateDrawRange: false,
        binary: false,
        forceIndices: false,
        forcePowerOfTwoTextures: false
    };

    gltfExporter.parse(object, function (result) {
        // data = JSON.stringify(result, null, 2);
        ////console.log(output);
        ////saveString(output, 'scene.gltf');
        var output = JSON.stringify(result, null, 2);
        var blob = new Blob([output], { type: 'text/plain' });

        $.ajax({
            type: 'POST',
            url: '/object_post.php',
            data: { name: planetName, object: output },
            dataType: 'json',
            success: function (d) {
                console.log('object done');
            }
        });

    }, options);
}
//--------------------------------------------PLANET OBJECT POST-------------------------------------------------------\\


function export_ring(ringobj, ringindex, ringmat, shaderinfo, isrock) {

    if (!isrock) {
        var material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
        });
        ringobj.material = material;
    }

    console.log("Passing Flat Ring");

    var gltfExporter = new THREE.GLTFExporter();
    var options = {
        trs: false,
        onlyVisible: false,
        truncateDrawRange: false,
        binary: false,
        forceIndices: false,
        forcePowerOfTwoTextures: false
    };
    var ringinfo = JSON.stringify(shaderinfo, null, 2);

    //gltfExporter.parse(ringobj, function (result) {
    //    var output = JSON.stringify(result, null, 2);
    //}, options

    //);

    $.ajax({
        type: 'POST',
        url: '/ring_object_post.php',
        data: { name: planetName, index: ringindex, shaderinformation: ringinfo },
        dataType: 'json',
        success: function (d) {
            console.log('flat ring done');
        }
    });

    if (!isrock) {
        ringobj.material = ringmat;
    }
}

function export_rocky_ring(ringobj, ringindex, shaderinfo, numAstos) {

    console.log("Passing Rock Ring");

    var material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
    });

    for (var i = 0; i < numAstos; i++) {
        ringobj.children[i].children[0].material = material;
    }

    //var gltfExporter = new THREE.GLTFExporter();
    //var options = {
    //    trs: false,
    //    onlyVisible: false,
    //    truncateDrawRange: false,
    //    binary: false,
    //    forceIndices: false,
    //    forcePowerOfTwoTextures: false
    //};

    var ringinfo = JSON.stringify(shaderinfo, null, 2);

    //gltfExporter.parse(ringobj, function (result) {
    //
    //var output = JSON.stringify(result, null, 2);
    //}, options);

    $.ajax({
        type: 'POST',
        url: '/ring_object_post.php',
        data: { name: planetName, index: ringindex, shaderinformation: ringinfo },
        dataType: 'json',
        success: function (d) {
            console.log('ring done');

        }
    });


    for (var i = 0; i < numAstos; i++) {
        //ringobj.children[i].children[0].material = shaderinfo[i].astomat;
    }


}

function export_atm(atmoobj, atmomat, shaderinfo) {
    var material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
    });
    atmoobj.material = material;

    var gltfExporter = new THREE.GLTFExporter();
    var options = {
        trs: false,
        onlyVisible: false,
        truncateDrawRange: false,
        binary: false,
        forceIndices: false,
        forcePowerOfTwoTextures: false
    };

    gltfExporter.parse(atmoobj, function (result) {
        var output = JSON.stringify(result, null, 2);
        var atmoinformation = JSON.stringify(shaderinfo, null, 2);
        $.ajax({
            type: 'POST',
            url: '/atmo_object_post.php',
            data: { name: planetName, shaderinformation: atmoinformation, object: output },
            success: function (d) {
                console.log('atmo done');
            }
        });

    }, options);

    atmoobj.material = atmomat;
}

function saveString(text) {

    return (new Blob([text], { type: 'text/plain' }));

}


function save(blob, filename) {

    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    // URL.revokeObjectURL( url ); breaks Firefox...

}

function download(data, filename, type) {
    var file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
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

function createPlantiodData(octaves, persistance, lacunarity, seed, noiseScale, offset, size) {

    for (var x = 0; x < regions.ColorPallette.length; x++) {

        var colorgrab = new THREE.Color(gui_color_event_list[x].object.hex);
        regions.ColorPallette[x].RGB.r = colorgrab.r * 255;
        regions.ColorPallette[x].RGB.g = colorgrab.g * 255;
        regions.ColorPallette[x].RGB.b = colorgrab.b * 255;
        regions.ColorPallette[x].hex = colorgrab.getHex();
    }

    var planetInfo = new MapGenerator(octaves, persistance, lacunarity,
        planet_params.seed, noiseScale, offset, size, false, regions, planet_params.isGassy);

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

function generateName(parent, fontsize, left, isInfo, colorpallette, region10, name) {
    var color = (parent == planet) ? "#FF61DB" : "#fffff";
    var label = (isInfo) ? "Planet-Info" : 'text-label';
    var roll = randomRange(0, 10);
    var newText = createTextLabel(fontsize, left, label, color);
    var wordtxt = word(randomRange(3, 25));

    if (!isInfo) {
        newText.setHTML(name);
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

        name = planet_params.name;//word(randomRange(3, 25)) + "-" + Math.round(randomRange(0, 1000));
        //name = name.fontsize(12);
        //name = name.bold();
        planetName = planet_params.name;//name;
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

Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
