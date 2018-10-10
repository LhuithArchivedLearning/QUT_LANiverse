
var container, stats, controls, lineUI, gui;
var camera, scene, Backgroundscene, renderer, clock;
var lightpos, dirLight, angle;

// Custom global variables
var mouse = { x: 0, y: 0 };

var timer = 0;
var timeLimit = .25;
var startTime = Date.now();

var Wonderer, SilverDuke, Hope, Train, LPHuman, Gene;
var WondererMaterials;
var postprocessing = { enabled: true, ao_only: false, radius: 2.4, lumChange: 2.1 };
var modelList = [];
var index = 0;



init();
animate();

function modelNext()
{
    index++;
}

function modelPrev()
{
    index--;
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
    camera.position.z = 15;
    camera.position.y = 5;
    clock = new THREE.Clock();

    //Add Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minZoom = 0.5;
    controls.maxZoom = 1.5;

    dirLight = new THREE.DirectionalLight(0xffffff, 1.3);
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
    //scene.add(shadowCam);
    scene.add(dirLight);

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

    initModels();

    //Create Plan
    planeGeo = new THREE.PlaneGeometry(100, 100, 100);
    planeMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    plane = new THREE.Mesh(planeGeo, planeMat);

    //Position and add objects to scene
    plane.rotation.x = -.5 * Math.PI;
    plane.receiveShadow = true;
    scene.add(plane);

    //initPostProcessing();
    //
    // // Init gui
    // var gui = new dat.GUI();
    // gui.add(postprocessing, "enabled");
    // gui.add(postprocessing, "ao_only", false).onChange(renderModeChange);
    // gui.add(postprocessing, "radius").min(0).max(64).onChange(radiusChange);
    // gui.add(postprocessing, "lumChange").min(0).max(64).onChange(lumChange);
    //
    // gui.add(controls, "xPos");
    // gui.add(controls, "yPos");
    
    // gui.add(controls, "zPos");
    setSize();
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

function initModels() {
    Wonderer = loadModel("./models/", "Wonderer.obj", "Wonderer.mtl");
    Wonderer.scale.set(2, 2, 2);
    modelList.push(Wonderer);

    SilverDuke = loadModel("./models/SilverDuke/", "SilverDuke.obj", "SilverDuke.mtl");
    modelList.push(SilverDuke);

    Hope = loadModel("./models/Hope/", "Hope.obj", "Hope.mtl");
    modelList.push(Hope);

    Train = loadModel("./models/Train/", "Train_Cart.obj", "Train_Cart.mtl");
    modelList.push(Train);

    LPHuman = loadModel("./models/LPHuman/", "LowPolyHuman.obj", "LowPolyHuman.mtl");
    LPHuman.scale.set(3.65, 3.65, 3.65);
    modelList.push(LPHuman);

    Gene = loadModel("./models/Gene/", "Gene.LowPoly.obj", "Gene.LowPoly.mtl");
    Gene.scale.set(1, 1, 1);
    modelList.push(Gene);

    Hamster = loadModel("./models/Hamster/", "Hamster.obj", "Hamster.mtl");
    Hamster.scale.set(1, 1, 1);
    modelList.push(Hamster);

    for(var i = 0; i < modelList.length; i++)
    {
        hideMesh(i);
    }
}

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 87) {
        index ++;
    } else if (keyCode == 83) {
        index --;
    } else if (keyCode == 65) {
        index ++;
    } else if (keyCode == 68) {
        index --;
    } else if (keyCode == 32) {

    }
};

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

    var pixelRatio = renderer.getPixelRatio();
    var newWidth = Math.floor(SCREEN_WIDTH / pixelRatio) || 1;
    var newHeight = Math.floor(SCREEN_HEIGHT / pixelRatio) || 1;
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

        // Resize renderTargets
        //ssaoPass.uniforms['size'].value.set(SCREEN_WIDTH, SCREEN_HEIGHT);

        var pixelRatio = renderer.getPixelRatio();
        var newWidth = Math.floor(SCREEN_WIDTH / pixelRatio) || 1;
        var newHeight = Math.floor(SCREEN_HEIGHT / pixelRatio) || 1;
       // depthRenderTarget.setSize(newWidth, newHeight);
        //composer.setSize(newWidth, newHeight);
    }, false);
}

function animate() {
    var delta = clock.getDelta();
    timer = timer + delta;

    angle += 0.005;
    dirLight.position.set(controls.xPos, controls.yPos, controls.zPos);

    modelList[Math.abs(index % 7)].rotation.y += 0.005;

    for(var i = 0; i < modelList.length; i++)
    {
        if(i != Math.abs(index % 7))
            hideMesh(i);
        else
            showMesh(i);
    }

    requestAnimationFrame(animate);

    HandleCursor();
    input();
    render();
}


function showMesh(index)
{
    modelList[index].traverse(function(child) {
            child.visible = true;
    });
}

function hideMesh(index)
{
    modelList[index].traverse(function(child) {
            child.visible = false;
    });
}

function HandleCursor() {
}

function input() {
}

function render() {
   renderer.render(scene, camera)
   // if (postprocessing.enabled) {
//
   //     //Render depth into depthRenderTarget
   //     scene.overrideMaterial = depthMaterial;
   //     renderer.render(scene, camera, depthRenderTarget, true);
//
   //     //Render renderPass and SSAO shaderPass
   //     scene.overrideMaterial = null;
   //     composer.render();
   // }
   // else
     
}

// Follows the mouse event
function onMouseMove(event) {
    // Update the mouse variable
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    mouse.x = Math.round((mouse.x + 1) * window.innerWidth / 2);
    mouse.y = Math.round((- mouse.y + 1) * window.innerHeight / 2);
}
