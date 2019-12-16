"use strict";
var camera;
var render;
var controls;

var material;
var scene;

//to keep you in bounds
var minX = -2540;
var maxX = 2380;
var minZ = -2530;
var maxZ = 2360;

//for fireball
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var fireballs = [];
var numberOfShots = 0;
var proton =[];
var emitter;
var fbLight = new THREE.PointLight(0xff0000, 1, 150 );
var fireball2 = new THREE.SphereGeometry(10);
var fb;
var fb1;
var proton1;
var spawnTargets= []; 
var fEmitter;


//torch fire
var tFire = 0;
var fireP;

//player wall collisions
var mazeMap;
var collisionDistance = 15;
var cubeT;
var collide = [];
//playercollision
var player;


//textures
var textureLoader = new THREE.TextureLoader();
var cobbleFloorM;
var wallLong;
var targetM;
var fireballM;

//game control stuff
var points = 0;
var pointTotal=0;
var startb;
var start = false;
var timer;
var now;
var amountOfTime = 300;
var win = false;

var clock = new THREE.Clock();

window.onload = function init()
{
    //set the scene and the camera up
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000000 );
    //new spwan x - 2500 z -2500    
    // camera.position.x = -2500;
    // camera.position.set(0,0,400);

    scene = new THREE.Scene();
    console.log(camera.rotation)


    //player rays for collision detection
    var pCube = new THREE.CubeGeometry(25, 25 ,25 );
    player = new THREE.Mesh(pCube,material);
    //player.rotation.xyz = camera.rotation.xyz
    //this.player.rotateY(Math.PI)
    this.player.position.set(-2500,0,-2500)
    scene.add(player);
    player.add(camera)

    controls = new FirstPersonControls( player );
    controls.movementSpeed = 550;
    controls.lookSpeed = 0.2;
     
    controls.lookAt( 0, 0, 0 );
    var canvas = document.createElement( 'canvas' );
    var context = canvas.getContext( 'webgl2', { alpha: false } );
    render = new THREE.WebGLRenderer( { canvas: canvas, context: context } );
    render.setPixelRatio( window.devicePixelRatio );
    render.setSize( window.innerWidth, window.innerHeight ); 
    document.body.appendChild( render.domElement );
    document.addEventListener( 'mousedown', onMouseDown, false );

    //control stuff
    startb = document.getElementById("start");
    startb.addEventListener("click", startG);
    timer = document.getElementById("timer");
    points = document.getElementById("points");


    //remove later to add in the ambient light from the torches
    // scene.add( new THREE.HemisphereLight( 0xffffbb, 0x080820, 1) );
    //possible extra controls
    window.onkeydown = function(event)
    {
    
    };
    addSky();
    loadTextures();
    floor();
    //addProton();
    createSprite()
    mazeTest();
    torch();
    endcube();
    fEmitter = createEmitter()
    targetLoader();
    fb = new THREE.Mesh(fireball2, fireballM);
    fb.add(fbLight);
    animate();
}


function startG(){
    start = true;
    now = new Date()
}

function collsionTestCube(){
    var cube = new THREE.CubeGeometry(100, 100 ,100 );
    cubeT = new THREE.Mesh(cube,targetM);
    cubeT.position.x = -2000;
    cubeT.position.z = -2000;
    cubeT.name ="wall";
    scene.add(cubeT)
    collide.push(cubeT);
}

function endcube(){
    var cube = new THREE.CubeGeometry(100, 100 ,100 );
    cubeT = new THREE.Mesh(cube, material);
    cubeT.position.x = 2380;
    cubeT.position.z = 2300;
    cubeT.name ="goal";
    scene.add(cubeT)
    collide.push(cubeT);
}

function mazeTest(){
 var maze = new Maze({
        cols: 25,         // amount of cell columns
        rows: 25,         // amount of cell rows
        scale: 200,        // scale of maze
        thickness: 2,     // thickness of maze walls
        depth: 200,        // height of maze walls
        open: true,       // include start and end doors?
        rnd: Math.random  // custom random sampler (between 0 and 1)
    });
    mazeMap = new THREE.Mesh(maze.geometry, wallLong)
    mazeMap.name = "wall";
    spawnTargets.push(mazeMap);
    collide.push(mazeMap)
    scene.add(mazeMap);   
}

function addSky(){
    skybox
    var skybox = new THREE.CubeGeometry(100000,100000,100000);
    var skyboxMs =[ 
        new THREE.MeshBasicMaterial({map: textureLoader.load("imports/skybox/vr_bk.png"), side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: textureLoader.load("imports/skybox/vr_up.png"), side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: textureLoader.load("imports/skybox/vr_dn.png"), side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: textureLoader.load("imports/skybox/vr_rt.png"), side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: textureLoader.load("imports/skybox/vr_lf.png"), side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: textureLoader.load("imports/skybox/vr_ft.png"), side: THREE.DoubleSide}),
    ]

    var skyboxM = new THREE.MeshFaceMaterial(skyboxMs);
    var cube = new THREE.Mesh(skybox, skyboxM);
    scene.add(cube);
}

function loadTextures(){
 //textures
    targetM = new THREE.MeshStandardMaterial( {
    metalness: 0.0,
    refractionRatio: .98,
    aoMap: textureLoader.load("imports/rough_wood_1k_jpg/rough_wood_ao_1k.jpg"),
    displacementMap: textureLoader.load("imports/rough_wood_1k_jpg/rough_wood_disp_1k.jpg"),
    map: textureLoader.load("imports/rough_wood_1k_jpg/rough_wood_Diff_1k.jpg"),
    bumpMap: textureLoader.load("imports/rough_wood_1k_jpg/rough_wood_bump_1k.jpg"),
    normalMap: textureLoader.load("imports/rough_wood_1k_jpg/rough_wood_nor_1k.jpg"),
    roughnessMap: textureLoader.load("imports/rough_wood_1k_jpg/rough_wood_rough_1k.jpg"),
    } );


   
    cobbleFloorM = new THREE.MeshStandardMaterial( {
        metalness: 0.0,
        refractionRatio: .98,
        aoMap: textureLoader.load("imports/pavement_01_1k_jpg/pavement_01_rough_ao_1k.jpg"),
        displacementMap: textureLoader.load("imports/pavement_01_1k_jpg/pavement_01_disp_1k.jpg"),
        map: textureLoader.load("imports/pavement_01_1k_jpg/pavement_01_diff_1k.jpg"),
        normalMap: textureLoader.load("imports/pavement_01_1k_jpg/pavement_01_nor_1k.jpg"),
        roughnessMap: textureLoader.load("imports/pavement_01_1k_jpg/cobblestone_floor_03_rough_2k.jpg"),
    } );

    var cfX = 20;
    var cfY = 20;
    cobbleFloorM.map.repeat.set(cfX,cfY);
    cobbleFloorM.normalMap.repeat.set(cfX,cfY);
    cobbleFloorM.roughnessMap.repeat.set(cfX,cfY);
    cobbleFloorM.displacementMap.repeat.set(cfX,cfY);
    cobbleFloorM.aoMap.repeat.set(cfX,cfY);

    cobbleFloorM.aoMap.wrapS = cobbleFloorM.aoMap.wrapT =
    cobbleFloorM.displacementMap.wrapS = cobbleFloorM.displacementMap.wrapT = 
    cobbleFloorM.roughnessMap.wrapS = cobbleFloorM.roughnessMap.wrapT = 
    cobbleFloorM.normalMap.wrapS = cobbleFloorM.normalMap.wrapT = 
    cobbleFloorM.map.wrapS = cobbleFloorM.map.wrapT = THREE.RepeatWrapping;
   
    wallLong = new THREE.MeshStandardMaterial( {
        metalness: 0.2,
        aoMap: textureLoader.load("imports/rough_block_wall_1k_jpg/rough_block_wall_ao_1k.jpg"),
        displacementMap: textureLoader.load("imports/rough_block_wall_1k_jpg/rough_block_wall_disp_1k.jpg"),
        map: textureLoader.load("imports/rough_block_wall_1k_jpg/rough_block_wall_diff_1k.jpg"),
        normalMap: textureLoader.load("imports/rough_block_wall_1k_jpg/rough_block_wall_nor_1k.jpg"),
        roughnessMap: textureLoader.load("imports/rough_block_wall_1k_jpg/rough_block_wall_rough_1k.jpg"),
    } );
    var wlX = 1;
    var wlY = 2;
    wallLong.map.repeat.set(wlX,wlY);
    wallLong.normalMap.repeat.set(wlX,wlY);
    wallLong.roughnessMap.repeat.set(wlX,wlY);
    wallLong.displacementMap.repeat.set(wlX,wlY);
    wallLong.aoMap.repeat.set(wlX,wlY);

    wallLong.aoMap.wrapS = wallLong.aoMap.wrapT =
    wallLong.displacementMap.wrapS = wallLong.displacementMap.wrapT = 
    wallLong.roughnessMap.wrapS = wallLong.roughnessMap.wrapT = 
    wallLong.normalMap.wrapS = wallLong.normalMap.wrapT = 
    wallLong.map.wrapS = wallLong.map.wrapT = THREE.RepeatWrapping;

    fireballM = new THREE.MeshBasicMaterial({
    map: textureLoader.load("imports/Fireball.jpg"),
   })
}

function createSprite() {
    var map = textureLoader.load("imports/dot.png");
    var material = new THREE.SpriteMaterial({
        map: map,
        color: 0xff0000,
        blending: THREE.AdditiveBlending,
        fog: true
    });
    return new THREE.Sprite(material);
}

function createEmitter() {
    emitter = new Proton.Emitter();
    emitter.rate = new Proton.Rate(new Proton.Span(10, 15), new Proton.Span(.05, .1));
    emitter.addInitialize(new Proton.Body(createSprite()));
    emitter.addInitialize(new Proton.Mass(0.6));
    emitter.addInitialize(new Proton.Life(1, 3));
    emitter.addInitialize(new Proton.Position(new Proton.SphereZone(20)));
    emitter.addInitialize(new Proton.V(new Proton.Span(100, 200), new Proton.Vector3D(30, 0, 0), 10));
    emitter.addBehaviour(new Proton.RandomDrift(10, 10, 10, .05));
    //emitter.addBehaviour(new Proton.Alpha(1, 0.1));
    emitter.addBehaviour(new Proton.Scale(new Proton.Span(2, 3.5), 0));
    emitter.addBehaviour(new Proton.G(1));
    emitter.addBehaviour(new Proton.Color('#FF0026', ['#ffff00', '#ffff11'], Infinity, Proton.easeOutSine));
    emitter.p.y = 0;
    emitter.p.x = 0;
    emitter.p.z = 0;
    emitter.rotation.y = Math.PI/2 ;
    emitter.emit();
    //fireballs[numberOfShots] = emitter;
    return emitter
}

function fireEmitter(){
    emitter = new Proton.Emitter();
    emitter.rate = new Proton.Rate(new Proton.Span(5, 10), new Proton.Span(.05, .1));
    emitter.addInitialize(new Proton.Body(createSprite()));
    emitter.addInitialize(new Proton.Mass(0.3));
    emitter.addInitialize(new Proton.Life(0.1, 0.5));
    emitter.addInitialize(new Proton.Position(new Proton.SphereZone(1)));
    emitter.addInitialize(new Proton.V(new Proton.Span(0.4,0.5), new Proton.Vector3D(0, 0, 0), 5));
    emitter.addBehaviour(new Proton.RandomDrift(.3, 10, .3, .02));
    emitter.addBehaviour(new Proton.Alpha(1, 0.1));
    emitter.addBehaviour(new Proton.Scale(new Proton.Span(1, 1.5), 0));
    emitter.addBehaviour(new Proton.G(-1));
    emitter.addBehaviour(new Proton.Color('#FF0026', ['#ffff00', '#ffff11'], Infinity, Proton.easeOutSine));
    emitter.p.y = 0;
    emitter.p.x = 0;
    emitter.p.z = 0;
    emitter.rotation.y = Math.PI/2 ;
    emitter.emit();
    //fireballs[numberOfShots] = emitter;
    return emitter
}

function onMouseDown( event ) {
    switch ( event.button ) {
         case 0: 
         
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        if(start == true){
            if (tFire <= 1) {
    	        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
                raycaster.setFromCamera(mouse, camera);
                var intersects = raycaster.intersectObjects(scene.children);
                if( intersects[0]!= null){
                  var firstIntersect = intersects[0]
                  fireball(firstIntersect);
                  tFire +=1;
                }
             }
        }
    }
}

function floor(){
    // Floor
    var floor = new THREE.CubeGeometry(5200, 1, 5200);
    var fl = new THREE.Mesh(floor, cobbleFloorM);
    fl.position.y = -100;
    fl.name = "wall";
    spawnTargets.push(fl);
    scene.add(fl);
}

function fireball(target){
    console.log("fireball")
    var fb2 = fb.clone();
    fb2.position.x = player.position.x;
    fb2.position.y = player.position.y;
    fb2.position.z = player.position.z;
    fb2.lookAt(target.point)   
    
    proton[numberOfShots] = new Proton();
    proton[numberOfShots].addEmitter(fEmitter);
    proton[numberOfShots].addRender(new Proton.SpriteRender(fb2));
    fireballs.push(fb2);
    scene.add(fb2);
    numberOfShots++;
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function targetLoader(){
     for (var i = 0; i < 40; i++) {
        var cube = new THREE.CubeGeometry(100, 100 ,100 );
        cubeT = new THREE.Mesh(cube,targetM);
        cubeT.name ="target";
        collide.push(cubeT);
        spawnTargets.push(cubeT)
        cubeT.name ="target";
        cubeT.position.x = randomIntFromInterval(-2300, 2300);
        cubeT.position.y = -10;
        cubeT.position.z = randomIntFromInterval(-2300, 2300);
        scene.add(cubeT)
   }
}

function target(){
    var cube = new THREE.CubeGeometry(100, 100 ,100 );
    cubeT = new THREE.Mesh(cube,targetM);
    // cubeT.position.x = -2000;
    // cubeT.position.z = -2000;
    cubeT.name ="target";
    collide.push(cubeT);
    spawnTargets.push(cubeT)
    return cube
}

// need to finish
function torch(){
   //var torchBase = new THREE.CylinderGeometry(.8,.8,8);//for just placing in scene
    var torchBase = new THREE.CylinderGeometry(.8,.8,18);
    var tBase = new THREE.Mesh(torchBase, targetM);
    tBase.position.x = -40;
    tBase.position.y = -15;
    tBase.position.z = -45;
    // tBase.rotation.x = -0.523599//60deg
    player.add(tBase);
    var torchPomel = new THREE.TorusBufferGeometry(1.1,1,3,40)
    var tPomel = new THREE.Mesh(torchPomel,targetM);
    tPomel.position.x = 0;
    tPomel.position.y = 8.6;
    tPomel.position.z = 0;
    tPomel.rotation.x = Math.PI / 2
    tBase.add(tPomel);
    //this need to change or someting
    var torchFire1 = new THREE.OctahedronGeometry(1);
    var tFire = new THREE.Mesh(torchFire1, fireballM);
    // tFire.position.x = 0;
     tFire.position.y = 12;
    // tFire.position.z = 0;
    tBase.add(tFire);
    var tLight = new THREE.PointLight(0xffb21a, 1, 550 );
    tLight.position.set(0,0,0);
    tFire.add(tLight);
    fireP = new Proton();
    fireP.addEmitter(fireEmitter());
    fireP.addRender(new Proton.SpriteRender(tFire));
}

function wallBounds() {

    if (player.position.x > maxX) {
        player.position.x = maxX;
    }
    if (player.position.x < minX) {
        player.position.x = minX;
    }

    if (player.position.z > maxZ) {
        player.position.z = maxZ;
    }
    if (player.position.z < minZ) {
        player.position.z = minZ;
    }

    player.position.y = 20;

}


//animate function to call the renderer
function animate() {

    requestAnimationFrame( animate );
    
  

    //for fireball v2 collision detection for targets
    for (var i = 0; i < fireballs.length; i++) {
        if(fireballs[i] != undefined){
            //just remove if it gets to high
            if(fireballs[i].position.y > 200 ||fireballs[i].position.y < -200 ){
                scene.remove(fireballs[i]);
                fireballs[i].geometry.dispose();
                fireballs[i].material.dispose();
                fireballs[i] = undefined; 
            }


        fireballs[i].translateZ(20)
        proton[i].update();

        var originPoint = fireballs[i].position.clone();
            for (var vertexIndex = 0; vertexIndex < fireballs[i].geometry.vertices.length; vertexIndex++){		
		        var localVertex = fireballs[i].geometry.vertices[vertexIndex].clone();
		        var globalVertex = localVertex.applyMatrix4( fireballs[i].matrix );
		        var directionVector = globalVertex.sub( fireballs[i].position );
		
    		    var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
	    	    var collisionResults = ray.intersectObjects(spawnTargets, true);
	            if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ){ 
                    if(collisionResults[0].object.name == "wall"){
                    scene.remove(fireballs[i]);
                    fireballs[i].geometry.dispose();
                    fireballs[i].material.dispose();
                    fireballs[i] = undefined; 
                    tFire-=1;
                    }

                
                if(collisionResults[0].object.name=="target"){
                    scene.remove(collisionResults[0].object);
                    pointTotal += 5;                  
                    scene.remove(fireballs[i]);
                    fireballs[i].geometry.dispose();
                    fireballs[i].material.dispose();
                    fireballs[i] = undefined; 
                    tFire-=1;
                    console.log("points")
                }
              
                }
            }
        }
    }

    //wall point collision 
    var originPoint = player.position.clone();
    for (var vertexIndex = 0; vertexIndex < player.geometry.vertices.length; vertexIndex++){		
        var localVertex = player.geometry.vertices[vertexIndex].clone();
        var globalVertex = localVertex.applyMatrix4( player.matrix );
        var directionVector = globalVertex.sub( player.position );

        var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
        var collisionResults = ray.intersectObjects(collide, true);
        if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ){ 
            console.log("hit")
            pointTotal -= 1;
            if(collisionResults[0].object.name == "goal"){
                win = true;
            }
        }
    }         

    points.innerText = pointTotal;

    if(start == true && win == false){
    var endTime = new Date();

    var elapsed = Math.round(endTime - now)/1000;
         if(amountOfTime > elapsed){
         controls.update( clock.getDelta() );
         timer.innerText = elapsed
        }
    }
   console.log(win)
   fireP.update();


   if(pointTotal < 0){
       pointTotal = 0
   }
  
    // // proton1.update();

   wallBounds();

   render.render( scene, camera );

}

