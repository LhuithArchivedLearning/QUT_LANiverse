
var container, stats, controls, lineUI, gui;
var camera, scene, Backgroundscene, renderer, clock;
var lightpos, dirLight, angle;
var mainTex, normTex, emitTex, transTex, cubeMap, blurTex, colorTex;
var sphere;

var depthMaterial, composer, depthRenderTarget;
var ssaoPass;

// Custom global variables
var mouse = { x: 0, y: 0 };

var timer = 0;
var timeLimit = .25;
var startTime = Date.now();

var WondererMaterials;
var postprocessing = { enabled: true, ao_only: false, radius: 2.4, lumChange: 2.1 };
var modelList = [];
var index = 0;

var materialList = [];

var uniform =
    {
        _Color: { type: "v4v", value: new THREE.Vector4(0.925, 0.941, 0.945, 1.0) },
        _SpecColor: { type: "v4v", value: new THREE.Vector4(0.980, 0.439, 0.439, 1.0) },
        _Shininess: { type: "fv1", value: 30.1 }
    };

var dither_uniform =
{
    _Color: { type: "v4v", value: new THREE.Vector4(0.925, 0.941, 0.945, 1.0) },
    _SpecColor: { type: "v4v", value: new THREE.Vector4(0.980, 0.439, 0.439, 1.0) },
    _Shininess: { type: "fv1", value: 30.1 },
    indexMatrix16x16: { type: "fv1", value: DitherPattern4x4 },
    palette: { type: "v3v", value: GrayScalePallete },
    paletteSize: { type: "i", value: 8 },
};

var anim_uniform =
{
    _Color: { type: "v4v", value: new THREE.Vector4(0.925, 0.941, 0.945, 1.0) },
    _SpecColor: { type: "v4v", value: new THREE.Vector4(0.980, 0.439, 0.439, 1.0) },
    u_time: { type: "fv1", value: 30.1 },
    _Shininess: { type: "fv1", value: 30.1 },
    _AnimSpeed: { type: "fv1", value: 10.0 },
    _AnimFreq: { type: "fv1", value: 5.0 },
    _AnimationPowerX: { type: "fv1", value: 0.2 },
    _AnimationPowerY: { type: "fv1", value: 0.2 },
    _AnimationPowerZ: { type: "fv1", value: 0.2 },
    _AnimOffSetX: { type: "fv1", value: 10.0 },
    _AnimOffSetY: { type: "fv1", value: 0.0 },
    _AnimOffSetZ: { type: "fv1", value: 0.0 },
    
}
var toon_uniform =
    {
        _Color: { type: "v4v", value: new THREE.Vector4(0.925, 0.941, 0.945, 1.0) },
        _SpecColor: { type: "v4v", value: new THREE.Vector4(1, 1, 1, 1.0) },
        _Shininess: { type: "fv1", value: 0.95 },
        _UnlitColor: { type: "v4v", value: new THREE.Vector4(0.372, 0.513, 0.549, 1.0) },
        _DiffuseThreshold: { type: "fv1", value: 0.0 },
        _Diffusion: { type: "fv1", value: 0.25 },
        _SpecDiffusion: { type: "fv1", value: 0.0 },
    }

var outline_uniform =
    {
        _Color: { type: "v4v", value: new THREE.Vector4(0.925, 0.941, 0.945, 1.0) },
        _SpecColor: { type: "v4v", value: new THREE.Vector4(1, 1, 1, 1.0) },
        _Shininess: { type: "fv1", value: 0.95 },
        _UnlitColor: { type: "v4v", value: new THREE.Vector4(0.372, 0.513, 0.549, 1.0) },
        _DiffuseThreshold: { type: "fv1", value: 0.0 },
        _Diffusion: { type: "fv1", value: 0.5 },
        _SpecDiffusion: { type: "fv1", value: 0.0 },
        _OutlineColor: { type: "v4v", value: new THREE.Vector4(0.0, 0.0, 0.0, 1.0) },
        _OutlineThickness: { type: "fv1", value: 0.25 },
        _OutlineDiffusion: { type: "fv1", value: 0.0 },
    }

var anis_uniform =
    {
        _Color: { type: "v4v", value: new THREE.Vector4(0.701, 0.521, 0.976, 1.0) },
        _SpecColor: { type: "v4v", value: new THREE.Vector4(0.980, 0.439, 0.439, 1.0) },
        _Shininess: { type: "fv1", value: 1.1 },
        _AniX: { type: "fv1", value: 0.25 },
        _AniY: { type: "fv1", value: 1.0 },
    };


var cut_uniform =
    {
        _Color: { type: "v4v", value: new THREE.Vector4(0.976, 0.945, 0.521, 1.0) },
        _Height: { type: "fv1", value: 2.1 }
    };

var fog_uniform =
    {
        _Color: { type: "v4v", value: new THREE.Vector4(0.721, 0.541, 1, 1.0) },
        _FogColor: { type: "v4v", value: new THREE.Vector4(0.341, 0.341, 0.341, 1.0) },
        _RangeStart: { type: "fv1", value: 5 },
        _RangeEnd: { type: "fv1", value: 10 }
    };


var blur_uniform =
    {
        _Color: { type: "v4v", value: new THREE.Vector4(1, 1, 1, 1.0) },
        _FogColor: { type: "v4v", value: new THREE.Vector4(1, 1, 1, 1.0) },
        _RangeStart: { type: "fv1", value: 15 },
        _RangeEnd: { type: "fv1", value: 20 },
        _MainTex: { type: "t", value: '' },
        _BlurTex: { type: "t", value: '' },
        _BlurSize: { type: "fv1", value: 1.5 },
    };


var tex_uniform =
    {
        _Color: { type: "v4v", value: new THREE.Vector4(0.925, 0.941, 0.945, 1.0) },
        _SpecColor: { type: "v4v", value: new THREE.Vector4(0.980, 0.439, 0.439, 1.0) },
        _Shininess: { type: "fv1", value: 30.1 },
        _BumpDepth: { type: "fv1", value: 24 },
        _MainTex: { type: "t", value: '' },
        _NormTex: { type: "t", value: '' },
    };


var color_uniform =
    {
        _MainTex: { type: "t", value: '' },
        u_time : { type: "fv1", value: 30.1 },
    };

var trans_uniform =
    {
        _Color: { type: "v4v", value: new THREE.Vector4(0.976, 0.521, 0.835, 1.0) },
        _MainTex: { type: "t", value: '' },
    };

var cube_uniform =
    {
        _Color: { type: "v4v", value: new THREE.Vector4(0.976, 0.521, 0.835, 1.0) },
        _Cube: { type: "t", value: '' },
    };

var emit_uniform =
    {
        _Color: { type: "v4v", value: new THREE.Vector4(0.925, 0.941, 0.945, 1.0) },
        _SpecColor: { type: "v4v", value: new THREE.Vector4(0.980, 0.439, 0.439, 1.0) },
        _Shininess: { type: "fv1", value: 30.1 },
        _BumpDepth: { type: "fv1", value: 24 },
        _EmitStrength: { type: "fv1", value: .75 },
        _MainTex: { type: "t", value: '' },
        _NormTex: { type: "t", value: '' },
        _EmitMap: { type: "t", value: '' },
    };

var rim_uniform =
    {
        _Color: { type: "v4v", value: new THREE.Vector4(0.925, 0.941, 0.945, 1.0) },
        _SpecColor: { type: "v4v", value: new THREE.Vector4(0.439, 0.458, 0.980, 1.0) },
        _Shininess: { type: "fv1", value: 30.1 },
        _RimColor: { type: "v4v", value: new THREE.Vector4(0.980, 0.439, 0.788, 1.0) },
        _RimPower: { type: "fv1", value: 9.0 },
    };

init();
animate();

function modelNext() {
    index++;
}

function modelPrev() {
    index--;
}


//Yummy Yum Yum
function textParse(glsl, shadow_text) {
    var text = glsl.replace("AddShadow", shadow_text);
    return text;
}

function init() {

    resolution = 1;// (window.devicePixelRatio == 1) ? 3 : 4;

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();

    container = document.getElementById('webGL-container');

    var containerStyle = getComputedStyle(container, null);
    var SCREEN_HEIGHT = parseInt(containerStyle.getPropertyValue('height')),
        SCREEN_WIDTH = parseInt(containerStyle.getPropertyValue('width'));

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.setClearColor(0x00BFFF);
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = false;
    renderer.shadowMapSize = 32;
    renderer.shadowMap.renderReverseSided = false;
    renderer.shadowMap.renderSingleSided = false;
    container.appendChild(renderer.domElement);

    // Create camera.
    camera = new THREE.PerspectiveCamera(70, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 1000);
    camera.position.z = 25;
    camera.position.y = 2;
    clock = new THREE.Clock();

    //Add Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minZoom = 0.5;
    controls.maxZoom = 1.5;

    dirLight = new THREE.DirectionalLight(0x70f0fa, 0.8);
    var vector = new THREE.Vector3(29, 59, 79);
    dirLight.position.set(vector);

    dirLight.shadow.camera.near = 0.01;
    dirLight.castShadow = true;

    var d = 50;

    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;

    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    dirLight.shadow.camera.far = 1000;
    dirLight.shadow.camera.near = -0.1;
    dirLight.shadow.bias = -0.0009;


    var shadowCam = new THREE.CameraHelper(dirLight.shadow.camera);
    dirLight.shadow.camera.position.set(vector);
    // scene.add(shadowCam);
    scene.add(dirLight);


    dirLight2 = new THREE.DirectionalLight(0xC5F178, 0.8);
    //var vector2 = new THREE.Vector3(0, 0, 0);
    dirLight2.position.y = 135;
    dirLight2.position.z = -135;

    dirLight2.shadow.camera.near = 0.01;
    dirLight2.castShadow = true;

    var d2 = 50;

    dirLight2.shadow.camera.left = -d2;
    dirLight2.shadow.camera.right = d2;
    dirLight2.shadow.camera.top = d2;
    dirLight2.shadow.camera.bottom = -d2;

    dirLight2.shadow.mapSize.width = 2048;
    dirLight2.shadow.mapSize.height = 2048;

    dirLight2.shadow.camera.far = 1000;
    dirLight2.shadow.camera.near = -0.1;
    dirLight2.shadow.bias = -0.0009;

    var shadowCam2 = new THREE.CameraHelper(dirLight2.shadow.camera);
    //dirLight2.shadow.camera.position.set(vector2);
    //scene.add(shadowCam2);
    scene.add(dirLight2);

    pointLight = new THREE.PointLight(0xFF39EE, 6.2);
    pointLight.position.set(0, 2, 0);
    scene.add(pointLight);

    pointLight2 = new THREE.PointLight(0x6BFF39, 6.2);
    pointLight2.position.set(0, -20, 0);
    scene.add(pointLight2);

    ambLight = new THREE.AmbientLight(0x3498DB, .2);
    scene.add(ambLight);


    //controls.addEventListener("change", render);
    var gridHelper = new THREE.GridHelper(1000, 20);
    //scene.add(gridHelper);

    var axisHelper = new THREE.AxisHelper(5);
    //scene.add(axisHelper)

    document.addEventListener('mousemove', onMouseMove, false);

    window.addEventListener("resize", onWindowResize, false);

    controls = new function () {
        this.xPos = vector.x;
        this.yPos = vector.y;
        this.zPos = vector.z;
    }


    ////Create Plan
    planeGeo = new THREE.PlaneGeometry(100, 100, 100);
    planeMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    plane = new THREE.Mesh(planeGeo, planeMat);

    //Position and add objects to scene
    plane.rotation.x = -.5 * Math.PI;

    plane.receiveShadow = true;
    scene.add(plane);
    plane.position.y = -20;

    //Position and add objects to scene

    //
    //initPostProcessing();
    //
    // // Init gui
    // var gui = new dat.GUI();
    // gui.add(postprocessing, "enabled");
    // gui.add(postprocessing, "ao_only", false).onChange(renderModeChange);
    // gui.add(postprocessing, "radius").min(0).max(64).onChange(radiusChange);
    // gui.add(postprocessing, "lumChange").min(0).max(64).onChange(lumChange);
    //
    //gui.add(controls, "xPos");
    //gui.add(controls, "yPos");
    //gui.add(controls, "zPos");

    mainTex = new THREE.TextureLoader().load("./img/Oak/BarkTexture_COLOR.png");
    mainTex.wrapS = mainTex.wrapT = THREE.ClampToEdgeWrapping;

    normTex = new THREE.TextureLoader().load("./img/Oak/BarkTexture_NRM.png");
    normTex.wrapS = normTex.wrapT = THREE.ClampToEdgeWrapping;

    emitTex = new THREE.TextureLoader().load("./img/Oak/emit_pattern.jpg");
    emitTex.wrapS = emitTex.wrapT = THREE.ClampToEdgeWrapping;

    transTex = new THREE.TextureLoader().load("./img/Oak/trans_pattern.png");
    transTex.wrapS = transTex.wrapT = THREE.ClampToEdgeWrapping;

    blurTex = new THREE.TextureLoader().load("./img/Oak/BarkTexture_BLUR.png");
    blurTex.wrapS = blurTex.wrapT = THREE.ClampToEdgeWrapping;

    colorTex = new THREE.TextureLoader().load("./img/Oak/color.jpg");
    colorTex.wrapS = colorTex.wrapT = THREE.ClampToEdgeWrapping;

    var path = './img/Cube/';
    var format = '.jpg';
    var urls =
        [
            path + '_x_p' + format, path + '_x_n' + format,
            path + '_y_p' + format, path + '_y_n' + format,
            path + '_z_p' + format, path + '_z_n' + format
        ];

    cubeMap = THREE.ImageUtils.loadTextureCube(urls);

    tex_uniform._MainTex = mainTex;
    tex_uniform._NormTex = normTex;
    emit_uniform._EmitMap = emitTex;
    trans_uniform._MainTex = transTex;
    cube_uniform._Cube = cubeMap;

    initMaterials();

    //Create Plan
    sphereGeo = new THREE.SphereBufferGeometry(5, 32, 32);
    sphere = new THREE.Mesh(sphereGeo, materialList[materialList.length - 1]);
    THREE.BufferGeometryUtils.computeTangents(sphereGeo);
    //sphere.receiveShadow = true;
    scene.add(sphere);

    camera.updateProjectionMatrix();

    setSize();
}

function initMaterials() {

    ShaderLoader('js/Shaders/Flat/Flat.vs.glsl',
        'js/Shaders/Flat/Flat.fs.glsl', SetUpMaterial, uniform);

    ShaderLoader('js/Shaders/Lambart/Lambart.vs.glsl',
        'js/Shaders/Lambart/Lambart.fs.glsl', SetUpMaterial, uniform);

    ShaderLoader('js/Shaders/Ambient/Ambient.vs.glsl',
        'js/Shaders/Ambient/Ambient.fs.glsl', SetUpMaterial, uniform);

    ShaderLoader('js/Shaders/Specular/Specular.vs.glsl',
        'js/Shaders/Specular/Specular.fs.glsl', SetUpMaterial, uniform);

    ShaderLoader('js/Shaders/Specular_Frag/Specular_Frag.vs.glsl',
        'js/Shaders/Specular_Frag/Specular_Frag.fs.glsl', SetUpMaterial, uniform);

    ShaderLoader('js/Shaders/Rim/Rim.vs.glsl',
        'js/Shaders/Rim/Rim.fs.glsl', SetUpMaterial, rim_uniform);

    ShaderLoader('js/Shaders/Multiple/Multiple.vs.glsl',
        'js/Shaders/Multiple/Multiple.fs.glsl', SetUpMaterial, uniform);

    ShaderLoader('js/Shaders/Point/Point.vs.glsl',
        'js/Shaders/Point/Point.fs.glsl', SetUpMaterial, uniform);

    ShaderLoader('js/Shaders/Texture/Texture.vs.glsl',
        'js/Shaders/Texture/Texture.fs.glsl', SetUpMaterial, tex_uniform);

    ShaderLoader('js/Shaders/Normal/Normal.vs.glsl',
        'js/Shaders/Normal/Normal.fs.glsl', SetUpMaterial, tex_uniform);

    ShaderLoader('js/Shaders/Emit/Emit.vs.glsl',
        'js/Shaders/Emit/Emit.fs.glsl', SetUpMaterial, emit_uniform);

    ShaderLoader('js/Shaders/Cutaway/Cutaway.vs.glsl',
        'js/Shaders/Cutaway/Cutaway.fs.glsl', SetUpMaterial, cut_uniform);

    ShaderLoader('js/Shaders/Transparent/Transparent.vs.glsl',
        'js/Shaders/Transparent/Transparent.fs.glsl', SetUpMaterial, trans_uniform);

    ShaderLoader('js/Shaders/Cube/Cube.vs.glsl',
        'js/Shaders/Cube/Cube.fs.glsl', SetUpMaterial, cube_uniform);

    ShaderLoader('js/Shaders/Refract/Refract.vs.glsl',
        'js/Shaders/Refract/Refract.fs.glsl', SetUpMaterial, cube_uniform);

    ShaderLoader('js/Shaders/Anisotropic/Anisotropic.vs.glsl',
        'js/Shaders/Anisotropic/Anisotropic.fs.glsl', SetUpMaterial, anis_uniform);

    ShaderLoader('js/Shaders/Fog/Fog.vs.glsl',
        'js/Shaders/Fog/Fog.fs.glsl', SetUpMaterial, fog_uniform);

    ShaderLoader('js/Shaders/Blur/Blur.vs.glsl',
        'js/Shaders/Blur/Blur.fs.glsl', SetUpMaterial, blur_uniform);

    ShaderLoader('js/Shaders/Toon/Toon.vs.glsl',
        'js/Shaders/Toon/Toon.fs.glsl', SetUpMaterial, toon_uniform);

    ShaderLoader('js/Shaders/Outline/Outline.vs.glsl',
        'js/Shaders/Outline/Outline.fs.glsl', SetUpMaterial, outline_uniform);

    ShaderLoader('js/Shaders/Gray/Gray.vs.glsl',
        'js/Shaders/Gray/Gray.fs.glsl', SetUpMaterial, color_uniform);

    ShaderLoader('js/Shaders/Animated/Animated.vs.glsl',
        'js/Shaders/Animated/Animated.fs.glsl', SetUpMaterial, anim_uniform);

    ShaderLoader('js/Shaders/Dither/Dither.vs.glsl',
        'js/Shaders/Dither/Dither.fs.glsl', SetUpMaterial, dither_uniform);

}

function SetUpMaterial(passeduniform, vertex_text, fragment_text) {
    createMaterial(passeduniform, vertex_text, fragment_text);
}

function createMaterial(passeduniform, vertex_text, fragment_text) {
    var vertex = vertex_text;
    var fragment = fragment_text;

    material = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib['lights'],
            passeduniform]),
        vertexShader: (vertex),
        fragmentShader: (fragment),
        lights: true,
    });


    if (passeduniform === tex_uniform) {
        material.uniforms._MainTex.value = mainTex;
        material.uniforms._NormTex.value = normTex;
    }
    else if (passeduniform === emit_uniform) {
        material.uniforms._MainTex.value = mainTex;
        material.uniforms._NormTex.value = normTex;
        material.uniforms._EmitMap.value = emitTex;
    }
    else if (passeduniform === trans_uniform) {
        material.transparent = true;
        material.uniforms._MainTex.value = transTex;
    }
    else if (passeduniform === cube_uniform) {
        material.uniforms._Cube.needsUpdate = true;
        material.uniforms._Cube.value = cubeMap;
    }
    else if (passeduniform === blur_uniform) {
        material.uniforms._MainTex.value = mainTex;
        material.uniforms._BlurTex.value = blurTex;
    }
    else if(passeduniform === color_uniform)
    {
        material.uniforms._MainTex.value = colorTex;
    }

    materialList.push(material);
}

function radiusChange(value) {

    ssaoPass.uniforms["radius"].value = value;

}

function lumChange(value) {

    ssaoPass.uniforms["lumInfluence"].value = value;

}

function renderModeChange(value) {

    ssaoPass.uniforms['onlyAO'].value = value;

}

function initPostProcessing() {
    var containerStyle = getComputedStyle(container, null);
    var SCREEN_HEIGHT = parseInt(containerStyle.getPropertyValue('height')),
        SCREEN_WIDTH = parseInt(containerStyle.getPropertyValue('width'));

    //Setup Render Pass
    var renderPass = new THREE.RenderPass(scene, camera);

    // Setup depth Pass
    depthMaterial = new THREE.MeshDepthMaterial();
    depthMaterial.depthPacking = THREE.RGBADepthPacking;
    depthMaterial.blending = THREE.NoBlending;

    var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter };
    depthRenderTarget = new THREE.WebGLRenderTarget(SCREEN_WIDTH, SCREEN_HEIGHT, pars)
    depthRenderTarget.texture.name = "SSAOShader.rt";

    // Setup SSAO pass
    ssaoPass = new THREE.ShaderPass(THREE.SSAOShader);
    ssaoPass.renderToScreen = true;
    //ssaoPass.uniform["tDiffuse"].value will be set by ShaderPass
    ssaoPass.uniforms["tDepth"].value = depthRenderTarget.texture;
    ssaoPass.uniforms['size'].value.set(SCREEN_WIDTH, SCREEN_HEIGHT);
    ssaoPass.uniforms['cameraNear'].value = camera.near;
    ssaoPass.uniforms['cameraFar'].value = camera.far;

    //Add pass to effect composer
    composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(ssaoPass);
}

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 87) {
        console.log("Poo");
        index++;
    } else if (keyCode == 83) {
        console.log("Poo");
        index--;
    } else if (keyCode == 65) {
        console.log("Poo");
        index++;
    } else if (keyCode == 68) {
        console.log("Poo");
        index--;
    } else if (keyCode == 32) {

    }
};

function increment(){
    index++;
}

function decriment(){
    index--;
}

function loadModel(path, objectUrlName, objectmatUrlName) {

    var container = new THREE.Object3D();

    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            //console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };

    var onError = function (xhr) { };

    THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath(path);
    mtlLoader.load(objectmatUrlName, function (materials) {

        materials.preload();
        WondererMaterials = materials;

        var objLoader = new THREE.OBJLoader();


        objLoader.setMaterials(materials);


        objLoader.setPath(path);
        objLoader.load(objectUrlName, function (object) {


            container.add(object);

            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.geometry.computeFaceNormals();
                    child.geometry.computeVertexNormals();
                }
            });

            container.castShadow = true;
            container.receiveShadow = true;
            //console.log(container);
            scene.add(container);

        }, onProgress, onError);

    });

    return container;
}

function onWindowResize() {
    var containerStyle = getComputedStyle(container, null);
    var SCREEN_HEIGHT = parseInt(containerStyle.getPropertyValue('height')),
        SCREEN_WIDTH = parseInt(containerStyle.getPropertyValue('width'));

    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    camera.updateProjectionMatrix();

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Resize renderTargets
    //ssaoPass.uniforms['size'].value.set(SCREEN_WIDTH, SCREEN_HEIGHT);

    //var pixelRatio = renderer.getPixelRatio();
    //var newWidth = Math.floor(SCREEN_WIDTH / pixelRatio) || 1;
    //var newHeight = Math.floor(SCREEN_HEIGHT / pixelRatio) || 1;
    //depthRenderTarget.setSize(newWidth, newHeight);
    //composer.setSize(newWidth, newHeight);
}

function setSize() {
    document.addEventListener('click', function (e) {
        var containerStyle = getComputedStyle(container, null);
        var SCREEN_HEIGHT = parseInt(containerStyle.getPropertyValue('height')),
            SCREEN_WIDTH = parseInt(containerStyle.getPropertyValue('width'));

        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();

        renderer.setSize(SCREEN_WIDTH / resolution, SCREEN_HEIGHT / resolution);
        renderer.setPixelRatio(window.devicePixelRatio);

        // // Resize renderTargets
        // ssaoPass.uniforms['size'].value.set(SCREEN_WIDTH, SCREEN_HEIGHT);
        //
        // var pixelRatio = renderer.getPixelRatio();
        // var newWidth = Math.floor(SCREEN_WIDTH / pixelRatio) || 1;
        // var newHeight = Math.floor(SCREEN_HEIGHT / pixelRatio) || 1;
        // depthRenderTarget.setSize(newWidth, newHeight);
        // composer.setSize(newWidth, newHeight);
    }, false);
}

function animate() {
    var delta = clock.getDelta();
    timer = timer + delta;

    angle += 0.005;
    dirLight.position.set(controls.xPos, controls.yPos, controls.zPos);

    if (materialList[Math.abs(index % materialList.length)] !== undefined) {
        sphere.material = materialList[Math.abs(index % materialList.length)];

        if(sphere.material.uniforms.u_time !== undefined)
            sphere.material.uniforms.u_time.value = timer;

        if (sphere.material.uniforms._Height !== undefined)
            sphere.material.uniforms._Height.value = 2 + (Math.sin((timer) * 4));

        if (sphere.material.uniforms._RangeEnd !== undefined)
            sphere.position.z = Math.sin(timer) * 14;
        else
            sphere.position.z = 0;
    }



    requestAnimationFrame(animate);

    HandleCursor();
    input();
    render();
}


function showMesh(index) {
    modelList[index].traverse(function (child) {
        child.visible = true;
    });
}

function hideMesh(index) {
    modelList[index].traverse(function (child) {
        child.visible = false;
    });
}

function HandleCursor() {
}

function input() {
}

function render() {

    renderer.render(scene, camera);

    if (postprocessing.enabled) {

        // //Render depth into depthRenderTarget
        // scene.overrideMaterial = depthMaterial;
        // renderer.render(scene, camera, depthRenderTarget, true);

        // //Render renderPass and SSAO shaderPass
        // scene.overrideMaterial = null;
        // composer.render();
    }
    else {

    }

}

// Follows the mouse event
function onMouseMove(event) {
    // Update the mouse variable
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    mouse.x = Math.round((mouse.x + 1) * window.innerWidth / 2);
    mouse.y = Math.round((- mouse.y + 1) * window.innerHeight / 2);
}

function ShaderLoader(vertex_url, fragment_url, onLoad, Custom, onProgress, onError) {
    var vertex_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
    vertex_loader.setResponseType('text');
    vertex_loader.load(vertex_url, function (vertex_text) {
        var fragment_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
        fragment_loader.setResponseType('text');
        fragment_loader.load(fragment_url, function (fragment_text) {
            var shadow_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
            shadow_loader.setResponseType('text');
            shadow_loader.load("./js/Shaders/Shadow.glsl", function (shadow_text) {
                onLoad(Custom, textParse(vertex_text, shadow_text), textParse(fragment_text, shadow_text));
            }

            )
        });
    }, onProgress, onError);
}


//   var dither_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
//   dither_loader.setResponseType('text');
//   dither_loader.load("js/Shaders/Dither.glsl", function (dither_text) 