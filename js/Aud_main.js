
$(function () {
    var audioCtx;
    var audioSrc;
    var xhr;

    var musicStarted = false, loaded = false;

    var frequancyData, source, gainNode;
    var SEPERATION = 6, AMOUNTX = 186, AMOUNTY = 32;

    var particles, particle, count = 0;
    var cubes, cubes2, cube, cube2;
    var freqSamples;
    var mouseX = 0, mouseY = 0;

    var material, cubeMat, cubeGeo, cubeGeo2;
    var material, planeMat, planeGeo;
    var scene, camera, renderer;
    var controls, guiControls, datGUI;
    var axis, grid, color;
    var spotLight;
    var container, stats;
    var SCREEN_WIDTH, SCREEN_HEIGHT;
    var resolution;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    init();
    animate();

    function init() {


        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        source = audioCtx.createBufferSource();
        gainNode = audioCtx.createGain();
        xhr = new XMLHttpRequest();
        xhr.open('GET', './audio/Glass Lux - Im A Machine.mp3');
        xhr.responseType = 'arraybuffer';
        xhr.addEventListener("progress", updateProgress);
        
        xhr.addEventListener('load', function (r) {
            audioCtx.decodeAudioData(
                xhr.response,
                function (buffer) {
                    source.buffer = buffer;
                    source.connect(gainNode);
                    gainNode.connect(audioCtx.destination);
                    source.loop = false;
                    hide();
                });
            //Auto Play
            //playsound();
        });
        xhr.send();

        loaded = true;
        function updateProgress(oEvent) {
            if (oEvent.lengthComputable) {
                var percentComplete = oEvent.loaded / oEvent.total;
            } else {
                // Unable to compute progress information since the total size is unknown
            }
        }

        analyser = audioCtx.createAnalyser();
        gainNode = audioCtx.createGain();
        analyser.fftSize = 2048;

        source.connect(analyser);
        gainNode.gain.value = 0.2;

        frequancyData = new Uint8Array(analyser.frequencyBinCount);

        var startSound = function () {
            source.start(0);
            musicStarted = true;
        };

        var manageSound = function () {

            if(!musicStarted)
                source.start(0);

            
            if (audioCtx.state === 'running') {
                audioCtx.suspend().then(function () {
                    document.querySelector('#manage').textContent = 'Resume context';
                    document.querySelector('#manage').value = "|>";

                });
            } else if (audioCtx.state === 'suspended') {
                audioCtx.resume().then(function () {
                    document.querySelector('#manage').textContent = 'Suspend context';
                    document.querySelector('#manage').value = "||";
                });
            }
        };

        document.querySelector('#init').addEventListener('click', function () {
            document.querySelector('#manage').value = "||";
            startSound();
        });

        document.querySelector('#manage').addEventListener('click', function () {
            manageSound();
        });

        container = document.getElementById('webGL-container');
        document.body.appendChild(container);
        resolution = (window.devicePixelRatio == 1) ? 3 : 4;

        //Creates empty scene object and renderers
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1800);

        camera.position.y = 170;
        camera.position.z = -1050;

        camera.lookAt(scene.position);


        cubes = new Array();
        cubes2 = new Array();
        freqSamples = new Array(AMOUNTX);


        var PI2 = Math.PI * 2;

        cubeMat = new THREE.MeshLambertMaterial({ color: 0xffffff })
        cubeGeo = new THREE.CubeGeometry(2, 2, 2);
        cubeGeo.applyMatrix(new THREE.Matrix4().makeTranslation(0, 1, 0));


        var ambLight = new THREE.AmbientLight(0xffffff);
        scene.add(ambLight);

        var i = 0;
        for (var ix = 0; ix < AMOUNTX; ix++) {

            var ia = (ix * 1.0) / AMOUNTX;
            var angle = ia * Math.PI;

            var mat = new THREE.MeshLambertMaterial({ color: 0xffffff });
            cube = cubes[i++] = new THREE.Mesh(cubeGeo, mat);
            cube.position.y = 2.5;
            cube.position.x = Math.sin(angle) * AMOUNTX;
            cube.position.z = Math.cos(angle) * AMOUNTX;
            scene.add(cube);
        }

        var u = 0;
        for (var ix = 0; ix < AMOUNTX; ix++) {

            var ia = (ix * 1.0) / AMOUNTX;
            var angle = ia * -Math.PI;

            var mat = new THREE.MeshLambertMaterial({ color: 0xffffff });
            cube2 = cubes2[u++] = new THREE.Mesh(cubeGeo, mat);
            cube2.position.y = 2.5;
            cube2.position.x = Math.sin(angle) * AMOUNTX;
            cube2.position.z = Math.cos(angle) * AMOUNTX;
            scene.add(cube2);

        }


        renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setSize(Math.round(window.innerWidth / resolution), Math.round(window.innerHeight / resolution));

        renderer.setClearColor(0x000000, 1);
        renderer.domElement.id = "Poo Poo";
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

        // //stats
        // stats = new Stats();
        // stats.domElement.style.position = "absolute";
        // stats.domElement.style.left = "0px";
        // stats.domElement.style.bottom = "0px";
        // container.appendChild(stats.domElement);

        window.addEventListener("resize", OnWindowResize, false);

        //Add Controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);

        controls.addEventListener("change", render);

        //datGUIcontrols Object
        guiControls = new function () {
            this.freqBoost = .1;
            this.volume = 0.2;
            this.puxel = resolution;
        };

        //var test = new THREE.CameraHelper(spotLight);
        // test.camera.visible = true;

        //adds controls to scene
        datGUI = new dat.GUI({ width: 300, autoPlace: false });
        var slider1 = datGUI.add(guiControls, "volume", 0, 1);
        var customContainer = $('.moveGUI').append($(datGUI.domElement));

        slider1.onChange(function (value) {
            var volume = value;
            var fraction = parseInt(value);
            gainNode.gain.value = fraction * fraction;

            gainNode.gain.value = value;
        });
    }


    function OnWindowResize() {
        resolution = (window.devicePixelRatio == 1) ? 3 : 4;;
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        var onMobile = false;

        if (window.devicePixelRatio == 1) {
            onMobile = false;
        }
        else {
            onMobile = true;
        }

        if (onMobile) {

            renderer.setSize(Math.round(window.innerWidth / resolution), Math.round(window.innerHeight / resolution));
            renderer.domElement.style.width = renderer.domElement.width / 2 * resolution + 'px';
            renderer.domElement.style.height = renderer.domElement.height / 2 * resolution + 'px';

        }
        else {

            renderer.setSize(Math.round(window.innerWidth / resolution), Math.round(window.innerHeight / resolution));
            renderer.domElement.style.width = Math.round(renderer.domElement.width * resolution) + 'px';
            renderer.domElement.style.height = Math.round(renderer.domElement.height * resolution) + 'px';
        }

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

    }

    function checkColor(value) {

        value = Math.round(value);
        var color = new THREE.Color();
        if (value >= 0) {
            color = 0xffffff;
        }
        if (value > 1) {
            color = 0xbfff00;
        }
        if (value > 2) {
            color = 0x80ff00;
        }
        if (value > 3) {
            color = 0x40ff00;
        }
        if (value > 4) {
            color = 0x00ff00;
        }
        if (value > 5) {
            color = 0x00ff40;
        }
        if (value > 6) {
            color = 0x00ff80;
        }
        if (value > 7) {
            color = 0x00ffbf;
        }
        if (value > 8) {
            color = 0x00ffff;
        }
        if (value > 9) {
            color = 0x00bfff;
        }
        if (value > 10) {
            color = 0x0080ff;
        }
        if (value > 11) {
            color = 0x0040ff;
        }
        if (value > 12) {
            color = 0x0000ff;
        }
        if (value > 13) {
            color = 0x4000ff;
        }
        if (value > 14) {
            color = 0x8000ff;
        }
        if (value > 15) {
            color = 0xbf00ff;
        }
        if (value > 16) {
            color = 0xff00ff;
        }
        if (value > 17) {
            color = 0xff00bf;
        }
        if (value > 18) {
            color = 0xff0080;
        }
        if (value > 19) {
            color = 0xff0040;
        }
        if (value > 20) {
            color = 0xff0000;
        }

        return color;
    }
    function animate() {
        requestAnimationFrame(animate);
        render();
        //stats.update();
    }

    var angle = 0,
        speed = frequancyData[25] / 100,
        centerY = 0,
        waveHeight = 60;

    function render() {

        for (var iz = 0; iz < freqSamples.length; iz++) {
            if (iz != freqSamples.length - 1 || iz != 0) {
                freqSamples[iz] = (frequancyData[iz] * frequancyData[iz]) * 0.0002;
            }
            else {
                freqSamples[iz] = ((frequancyData[iz]) * (frequancyData[iz]));
            }
        }


        cubeMat.needsUpdate = true;
        //planeMat.needsUpdate = true;
        for (var ix = 0; ix < cubes.length; ix++) {

            cube = cubes[ix];
            cube2 = cubes2[ix];


            cube.scale.y = (freqSamples[ix] > 0) ? freqSamples[ix] : .5;
            cube.material.color.setHex(checkColor(cube.scale.y));

            cube2.scale.y = (freqSamples[ix] > 0) ? freqSamples[ix] : .5;
            cube2.material.color.setHex(checkColor(cube.scale.y));

        }
        //console.log(audioCtx.currentTime);

        resolution = guiControls.puxel;
        angle += speed;

        var i = 0;
        renderer.render(scene, camera);

        count += 0.1;
        analyser.getByteFrequencyData(frequancyData);

    }

});


