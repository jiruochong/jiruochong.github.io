/**
 TODO: Add licence details here
 **/

/**

 NewsCube(elementID, _onFaceChange, _cubeFaces)

 Parameters:
 elementID: String, the ID of the element that will become the cube container
 _onFaceChance: callback function called when the cube spins to a new face (experimental)
 _cubeFaces: an array containing 6 strings which represt the faces of the cube. The array must contain 6 elements ordered as follows: [Front, Right, Back, Left, Bottom, Top]

 Returns: a new cube object.

 **/

var NewsCube = function (elementID, _onFaceChange, _cubeFaces) {

    if (typeof elementID != 'string') return console.warn('elementID MUST be a string.');
    else if (typeof _onFaceChange != 'function') return console.warn('_onFaceChange MUST be a function.');
    else if (typeof _cubeFaces != 'object') return console.warn('_cubeFaces MUST be an array.');
    else if (_cubeFaces.length < 6) return console.warn('_cubeFaces MUST contain 6 elements.');

    var eid = elementID;
    var onFaceChange = _onFaceChange;
    var cubeFaces = _cubeFaces;
    var cubeName = "";
    var otherParams = "";

    var container, stats;
    var camera, scene, projector, renderer;
    var particleMaterial;

    var objects = [];
    var cubeMesh;

    var WIDTH = 1000,
        HEIGHT = 700;

    var xRotation = 0.0;
    var yRotation = 0.0;

    var isPlaymode = false;

    var mouseAdd = {
        x: 0,
        y: 0
    };

    var rSpeed = Math.PI / 100;

    var faceChecked = false,
        currentFace = 0,
        rotate = false,
        rotateA = {
            x: 0,
            y: 0
        },
        rotateB = {
            x: 0,
            y: 0
        },
        r = "",
        xSpeed, ySpeed;

    var cameraOrtho, sceneOrtho;
    var shapeWidth = 20,
        shapeHeight = 20;

    var cubeControllers = [];
    var controls;

    var kontainer;

    var faceCoords = [{
        p: Math.PI / 2,
        t: 0
    }, //1
        {
            p: Math.PI / 2,
            t: Math.PI / 2
        }, //2
        {
            p: Math.PI / 2,
            t: Math.PI
        }, //3
        {
            p: Math.PI / 2,
            t: -Math.PI / 2
        }, //4
        {
            p: 0,
            t: 0
        }, //5
        {
            p: Math.PI,
            t: 0
        }, //6
        {
            p: Math.PI / 3,
            t: Math.PI / 4
        }
    ];
    var cFace = 1;

    var rSpeed = Math.PI / 40;

    var CREATING = false;
    var ZOOMEDOUT = false;

    var scaled = {
        w: false,
        h: false
    };

    var isAnimated = false;

    function setCreateSizes() {
        WIDTH = 700;
        HEIGHT = 600;
        CREATING = true;
    }

    // init();
    // animate();

    function init() {

        WIDTH = window.innerWidth;

        if (!isPlaymode)
            HEIGHT = window.innerHeight - (140 + 40); // Header + Footer
        else
            HEIGHT = window.innerHeight - 120; // Header + Footer

        container = document.createElement('div');
        container.id = "cubeContainerInside";
        container.style.margin = "0 auto";
        container.style.width = WIDTH + "px";
        container.style.position = 'absolute';
        container.style.left = "0";

        kontainer = document.createElement('div');
        kontainer.id = "cubeContainerMouseHandler";
        kontainer.style.height = HEIGHT + "px";
        kontainer.style.width = WIDTH + "px";
        kontainer.style.position = 'absolute';
        kontainer.style.left = "-" + WIDTH + "px";

        cnt = document.getElementById(eid);
        cnt.innerHTML = "";
        cnt.appendChild(container);
        cnt.appendChild(kontainer);

        camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 10000);
        camera.position.set(0, 0, 500);

        scene = new THREE.Scene();

        renderer = new THREE.CSS3DRenderer();
        controls = new THREE.OrbitControls(camera, kontainer); //renderer.domElement);

        controls.noZoom = true;

        if (CREATING && ZOOMEDOUT) {
            controls.zoomInTo(1.1);
        }

        var urls = [
            [cubeFaces[0], 0, 0, 150, 0, 0, 0], // Front
            [cubeFaces[1], 150, 0, 0, 0, Math.PI / 2, 0], // Right
            [cubeFaces[2], 0, 0, -150, 0, Math.PI, 0], // Back
            [cubeFaces[3], -150, 0, 0, 0, Math.PI / 2 + Math.PI, 0], // Left
            [cubeFaces[4], 0, 150, 0, Math.PI / 2 + Math.PI, 0, 0], // Bottom
            [cubeFaces[5], 0, -150, 0, Math.PI / 2, 0, 0] // Top
        ];

        for (var i = 0; i < urls.length; i++) {

            var element = document.createElement('iframe');
            element.src = urls[i][0];
            element.style.width = '800px';
            element.style.height = '800px';
            element.style.border = '0px';

            var object = new THREE.CSS3DObject(element);
            object.position.x = urls[i][1];
            object.position.y = urls[i][2];
            object.position.z = urls[i][3];

            object.rotation.x = urls[i][4];
            object.rotation.y = urls[i][5];
            object.rotation.z = urls[i][6];

            object.scale.x = 0.375;
            object.scale.y = 0.375;
            scene.add(object);

        }

        // add subtle blue ambient lighting
        var ambientLight = new THREE.AmbientLight(0x000000);
        scene.add(ambientLight);

        // directional lighting
        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 0, 0).normalize();
        scene.add(directionalLight);

        projector = new THREE.Projector();
        renderer.setSize(WIDTH, HEIGHT);
        renderer.autoClear = false;

        container.appendChild(renderer.domElement);

        controls.rotateLeft(yRotation);
        controls.rotateUp(xRotation);

        container.addEventListener('mouseenter', onContainerMouseEnter, false);
        container.addEventListener('mouseout', onContainerMouseOut, false);

        document.addEventListener('mousedown', onDocumentMouseDown, false);
        document.addEventListener('mouseup', onDocumentMouseUp, false);
        document.addEventListener('touchstart', onDocumentTouchStart, false);
        document.addEventListener('touchend', onDocumentTouchEnd, false);
        document.addEventListener('touchmove', onDocumentTouchMove, false);

        document.addEventListener('keyup', function (e) {

            rotateToPosition(e.keyCode);
            return false;

        }, false);

        window.addEventListener('resize', onWindowResize, false);

    }

    function rotateToPosition(position) {
        if (!rotate) {

            //console.log(cubeMesh);

            if (position == 38) { //Up

                if (cFace == 6) {
                    cFace = 1;
                } else if (cFace == 1) {
                    cFace = 5;
                }

                controls.animateTo(faceCoords[cFace - 1].p, faceCoords[cFace - 1].t, rSpeed);

            } else if (position == 40) { //Down

                if (cFace == 5) {
                    cFace = 1;
                } else if (cFace == 1) {
                    cFace = 6;
                }

                controls.animateTo(faceCoords[cFace - 1].p, faceCoords[cFace - 1].t, rSpeed);

            } else if (position == 39) { //Right

                var incMov = 0;

                if (cFace == 6 || cFace == 5) {
                    cFace = 2;
                } else if (cFace == 3) {
                    incMov = 2 * Math.PI;
                    cFace = 4;
                } else if (cFace < 4) {
                    cFace++;
                } else {
                    cFace = 1;
                }

                controls.animateTo(faceCoords[cFace - 1].p, faceCoords[cFace - 1].t + incMov, rSpeed);

            } else if (position == 37) { //Left

                var incMov = 0;

                if (cFace == 6 || cFace == 5) {
                    cFace = 4;
                } else if (cFace == 4) {
                    incMov = 2 * Math.PI;
                    cFace = 3;
                } else if (cFace == 1) {
                    cFace = 4;
                } else {
                    cFace--;
                }

                controls.animateTo(faceCoords[cFace - 1].p, faceCoords[cFace - 1].t - incMov, rSpeed);

            } else if (position == 51) {

                controls.animateTo(faceCoords[6].p, faceCoords[6].t, rSpeed);

            }
            if (onFaceChange)
                onFaceChange(cFace);

        }
    }


    function onWindowResize() {

        // if (window.innerWidth < WIDTH)
        if (!scaled.w) {
            WIDTH = window.innerWidth;
            container.style.width = WIDTH + "px";
            kontainer.style.width = WIDTH + "px";
        }

        // if ((window.innerHeight - (140 + 40)) < 700)
        if (!scaled.h) {
            if (!isPlaymode)
                HEIGHT = window.innerHeight - (140 + 40);
            else
                HEIGHT = window.innerHeight - 120;
        }

        renderer.setSize(WIDTH, HEIGHT);

    }

    function generateCubeController() {

        cameraOrtho = new THREE.OrthographicCamera(-WIDTH / 2, WIDTH / 2, HEIGHT / 2, -HEIGHT / 2, 1, 10);
        cameraOrtho.position.z = 10;
        sceneOrtho = new THREE.Scene();

        // controller sizes
        var width = shapeWidth;
        var height = shapeHeight;

        var frameWidth = WIDTH / 2;
        var frameHeight = HEIGHT / 2;

        for (var i = 0; i < 6; i++) {

            var material = new THREE.SpriteMaterial({
                color: 0xAAAAAA,
                overdraw: 0.5
            });

            cubeControllers[i] = new THREE.Sprite(material);
            cubeControllers[i].scale.set(width, height, 1);
            cubeControllers[i].name = "f" + (i + 1);
            cubeControllers[i].position.set(frameWidth - (width / 2) - ((width + 3) * i) - 10, frameHeight - (height * 2), 1);

            sceneOrtho.add(cubeControllers[i]);
        }

        cubeControllers[4].position.x = frameWidth - (width / 2) - ((width + 3) * 2) - 10;
        cubeControllers[5].position.x = frameWidth - (width / 2) - ((width + 3) * 3) - 10;

        var p = cubeControllers[0].position.x;
        cubeControllers[0].position.x = cubeControllers[1].position.x;
        cubeControllers[1].position.x = p;

        cubeControllers[2].position.set(cubeControllers[4].position.x, frameHeight - height + 3, 1);
        cubeControllers[3].position.set(cubeControllers[4].position.x, frameHeight - (3 * height) - 3, 1);

    }

    var clickedSomewhere = false;

    function onDocumentTouchStart(event) {

        // event.preventDefault();

        if (!clickedSomewhere) {

            // console.log(event);

            var t = event.touches[0];

            // console.log(t);

            clickedSomewhere = true;

            kontainer.style.left = "0px";
            // kontainer.style.background = "#ff0000";
            // kontainer.style.opacity = ".5";

            var mousedownEvent = new MouseEvent('mousedown');
            mousedownEvent.clientX = t.clientX;
            mousedownEvent.clientY = t.clientY;
            mousedownEvent.screenX = t.screenX;
            mousedownEvent.screenY = t.screenY;

            kontainer.dispatchEvent(mousedownEvent);

        }

    }


    function onDocumentTouchMove(event) {

        // alert("touched!");

        event.preventDefault();

        if (clickedSomewhere) {

            var t = event.touches[0];

            // console.log(t);

            clickedSomewhere = true;

            var mousemoveEvent = new MouseEvent('mousemove');
            mousemoveEvent.clientX = t.clientX;
            mousemoveEvent.clientY = t.clientY;
            mousemoveEvent.screenX = t.screenX;
            mousemoveEvent.screenY = t.screenY;

            kontainer.dispatchEvent(mousemoveEvent);

        }

    }

    function onDocumentTouchEnd(event) {

        var mouseupEvent = new MouseEvent('mouseup');
        kontainer.dispatchEvent(mouseupEvent);

        clickedSomewhere = false;
        kontainer.style.left = "-" + WIDTH + "px";

    }

    function onContainerMouseEnter(event) {
        if (!isAnimated) return;
        controls.setAutorotate(false);
    }

    function onContainerMouseOut(event) {
        if (!isAnimated) return;
        if (event.toElement && event.toElement.nodeName == "IFRAME" || event.fromElement.nodeName == "IFRAME") return;
        if (event.toElement && event.toElement.id == "cubeContainerMouseHandler") return;
        controls.setAutorotate(true);
    }

    function onDocumentMouseUp(event) {

        event.preventDefault();

        clickedSomewhere = false;
        kontainer.style.left = "-" + WIDTH + "px";

    }

    function onDocumentMouseDown(event) {

        // event.preventDefault();

        if (!clickedSomewhere) {

            clickedSomewhere = true;

            kontainer.style.left = "0px";

            var mousedownEvent = new MouseEvent('mousedown');
            mousedownEvent.clientX = event.clientX;
            mousedownEvent.clientY = event.clientY;
            mousedownEvent.screenX = event.screenX;
            mousedownEvent.screenY = event.screenY;
            mousedownEvent.ctrlKey = event.ctrlKey;
            mousedownEvent.altKey = event.altKey;
            mousedownEvent.shiftKey = event.shiftKey;
            mousedownEvent.metaKey = event.metaKey;

            kontainer.dispatchEvent(mousedownEvent);

        }

        var container = document.getElementById(eid) ? document.getElementById(eid).getBoundingClientRect() : {
            x: 0,
            y: 0
        };

        mouseAdd = {
            x: container.left,
            y: container.top
        };

        var vector = new THREE.Vector3(((event.clientX - mouseAdd.x) / WIDTH) * 2 - 1, -((event.clientY - mouseAdd.y) / HEIGHT) * 2 + 1, 0.5);

        projector.unprojectVector(vector, camera);

        var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

        var intersects = raycaster.intersectObjects(objects);

        if (intersects.length > 0) {

            var cFace = intersects[0].faceIndex;

            switch (cFace) {
                case 0:
                case 1:
                    cFace = 1;
                    break;
                case 2:
                case 3:
                    cFace = 6;
                    break;
                case 4:
                case 5:
                    cFace = 3;
                    break;
                case 6:
                case 7:
                    cFace = 4;
                    break;
                case 8:
                case 9:
                    cFace = 5;
                    break;
                case 10:
                case 11:
                    cFace = 2;
                    break;
            }

            // console.log(cFace, intersects[0].object.material);

            intersects[0].object.material.materials[cFace - 1].color.setHex(Math.random() * 0xffffff);

            // intersects[0].object.material.color.setHex(Math.random() * 0xffffff);

            // var particle = new THREE.Sprite(particleMaterial);
            // particle.position.copy(intersects[0].point);
            // particle.scale.x = particle.scale.y = 16;
            // scene.add(particle);

        }
    }

    var rotation = 0;

    function animate() {

        requestAnimationFrame(animate);
        controls.update();


        render();
        // stats.update();

    }

    var radius = 600;
    var theta = 0;
    var noOrtho = false;

    function render() {
        theta += 0.1;

        // renderer.clear();
        renderer.render(scene, camera);
        // if (!noOrtho) {
        //     renderer.clearDepth();
        //     renderer.render(sceneOrtho, cameraOrtho);
        // }

    }

    function rotateToFace(face) {

        // console.log("Rotating to... ", face, " from ", cFace);

        switch (cFace) {

            case 1:
                switch (face) {

                    case 1:
                        break;
                    case 2:
                        rotateToPosition(39);
                        break;
                    case 3:
                        rotateToPosition(39);
                        rotateToPosition(39);
                        break;
                    case 4:
                        rotateToPosition(37);
                        break;
                    case 5:
                        rotateToPosition(38);
                        break;
                    case 6:
                        rotateToPosition(40);
                        break;

                }
                break;
            case 2:
                switch (face) {

                    case 1:
                        rotateToPosition(37);
                        break;
                    case 2:
                        break;
                    case 3:
                        rotateToPosition(39);
                        break;
                    case 4:
                        rotateToPosition(37);
                        rotateToPosition(37);
                        break;
                    case 5:
                        rotateToPosition(37);
                        rotateToPosition(38);
                        break;
                    case 6:
                        rotateToPosition(37);
                        rotateToPosition(40);
                        break;

                }
                break;
            case 3:
                switch (face) {

                    case 1:
                        rotateToPosition(37);
                        rotateToPosition(37);
                        break;
                    case 2:
                        rotateToPosition(37);
                        break;
                    case 3:
                        break;
                    case 4:
                        rotateToPosition(39);
                        break;
                    case 5:
                        rotateToPosition(37);
                        rotateToPosition(37);
                        rotateToPosition(38);
                        break;
                    case 6:
                        rotateToPosition(37);
                        rotateToPosition(37);
                        rotateToPosition(40);
                        break;

                }
                break;
            case 4:
                switch (face) {

                    case 1:
                        rotateToPosition(39);
                        break;
                    case 2:
                        rotateToPosition(39);
                        rotateToPosition(39);
                        break;
                    case 3:
                        rotateToPosition(37);
                        break;
                    case 4:
                        break;
                    case 5:
                        rotateToPosition(39);
                        rotateToPosition(38);
                        break;
                    case 6:
                        rotateToPosition(39);
                        rotateToPosition(40);
                        break;

                }
                break;
            case 5:
                switch (face) {

                    case 1:
                        rotateToPosition(40);
                        break;
                    case 2:
                        rotateToPosition(39);
                        break;
                    case 3:
                        rotateToPosition(39);
                        rotateToPosition(39);
                        break;
                    case 4:
                        rotateToPosition(37);
                        break;
                    case 5:
                        break;
                    case 6:
                        rotateToPosition(40);
                        rotateToPosition(40);
                        break;

                }
                break;
            case 6:
                switch (face) {

                    case 1:
                        rotateToPosition(38);
                        break;
                    case 2:
                        rotateToPosition(39);
                        break;
                    case 3:
                        rotateToPosition(39);
                        rotateToPosition(39);
                        break;
                    case 4:
                        rotateToPosition(37);
                        break;
                    case 5:
                        rotateToPosition(38);
                        rotateToPosition(38);
                        break;
                    case 6:
                        break;

                }
                break;

        }

        //currentFace = face-1;

    }

    // var _onFaceChange = undefined;

    return {

        start: function (cube, params) {

            // console.log(params);

            if (params) {
                otherParams = "?" + params;
            } else {
                otherParams = "";
            }

            var k = document.getElementById(eid);
            k.style.display = "block";
            k.style.opacity = "0";

            cubeID = cube && cube.id ? cube.id : '';
            cubeName = cube && cube.name ? cube.name : '';
            cubeFace = cube && cube.face ? cube.face : '';

            init();
            animate();

            if (cubeFace) {

                rotateToFace(Number(cube.face));

                var k = document.getElementById(eid);
                k.style.opacity = "100";

            } else {
                k.style.opacity = "100";
            }

            scaled.w = scaled.h = false;

            isAnimated = false;

        },
        setOnFaceChange: function (ofc) {
            onFaceChange = ofc;
        },
        setToCreate: function () {
            setCreateSizes();
        },
        rotateTo: function (face) {
            // console.log("Rotating to... ", face);
            rotateToFace(face);
        },
        zoomToEdit: function () {
            isPlaymode = false;
            controls.zoomInTo(1.1);
        },
        exitZoomToEdit: function () {
            controls.zoomOutTo(1);
        },
        delete: function () {

            var k = document.getElementById(eid);
            if (k) k.innerHTML = "&nbsp;";
            if (k) k.style.display = "block";

            isAnimated = false;

        },
        suspend: function () {
            var k = document.getElementById(eid);
            if (k) k.style.display = "none";
        },
        restore: function () {
            var k = document.getElementById(eid);
            if (k) k.style.display = "block";
        },
        startPlay: function () {
            isPlaymode = true;
            init();
            controls.zoomInTo(1.1);
        },
        scale: function (w, h) {
            WIDTH = w ? w : WIDTH;
            HEIGHT = h ? h : HEIGHT;

            if (w) scaled.w = true;
            if (h) scaled.h = true;

            container.style.width = WIDTH + "px";
            kontainer.style.width = WIDTH + "px";

            renderer.setSize(WIDTH, HEIGHT);
        },
        animate: function (r) {
            // rotateToPosition(51);
            // console.log(r);
            isAnimated = r;
            controls.setAutorotate(r);
        },
        moveaway: function (done) {
            done();
            //controls.animateZoomTo(-1, done);
            //ZOOMEDOUT = true;
        },
        moveback: function (done) {
            done();
            //controls.animateZoomTo(1, done);
            //ZOOMEDOUT = false;
        },
        moveThreeView: function () {
            controls.animateTo(faceCoords[6].p, faceCoords[6].t, rSpeed);
            // console.log(rSpeed);
        },
        setExhibition: function () {
            HEIGHT = HEIGHT - 185;
            this.scale(WIDTH, HEIGHT);
            // console.log(rSpeed);
        }

    }

};