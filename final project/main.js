"use strict";


var camera;
var render;
var controls;

var material;
var scene;

//for the floors
var base = 1000;
var base2 = 400;
var base3 =300

//to keep you in bounds
var minX = -(base) + base2 +10;
var maxX = base2 -10;
var minZ = -(base) + base3 +10;
var maxZ = base3 -10;

//for fireball
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var fireballs = [];
var numberOfShots = 0;
//to keep track of targets
var spawnTargets = [];

//textures
var textureLoader = new THREE.TextureLoader();
var cobbleFloorM
var wallLong

var moveD =false;

var clock = new THREE.Clock();


/*
TODO
//ADD FIREBALL
//ADD MOVEMENT TO FIRE BALL
//ADD COLLISION DECTION TO FIREBALL
ADD FIRE BALL TEXTURE

//ADD TARGET
ADD RANDOM SPAWN
ADD WOODTEXTURE
ADD EXPLOSION ANIMATION

ADD POINTS
ADD START GAME SCENE
ADD TIMER
ADD END GAME SCENE
ADD RESART BUTTON

ADD SKYBOX

//ADD WALLS
//ADD TEXTURES
ADD ROOMs
//ADD COLLISION FOR THEM



*/
window.onload = function init()
{
 
    //set the scene and the camera up
   camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000000 );

   scene = new THREE.Scene();

   controls = new FirstPersonControls( camera );
   controls.movementSpeed = 150;
   controls.lookSpeed = 0.2;

   controls.lookAt( 500, 500, 500 );

   render = new THREE.WebGLRenderer();
   render.setPixelRatio( window.devicePixelRatio );
   render.setSize( window.innerWidth, window.innerHeight );
    
   //skybox
    var skybox = new THREE.CubeGeometry(10000,10000,10000);
    var skyboxMs =[ 
        new THREE.MeshBasicMaterial({map: textureLoader.load("imports/skybox/vr_bk.png"), side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: textureLoader.load("imports/skybox/vr_up.png"), side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: textureLoader.load("imports/skybox/vr_dn.png"), side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: textureLoader.load("imports/skybox/vr_rt.png"), side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: textureLoader.load("imports/skybox/vr_lf.png"), side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: textureLoader.load("imports/skybox/vr_ft.png"), side: THREE.DoubleSide}),
    ]
    var skyboxM = new THREE.MeshFaceMaterial(skyboxMs);
    var cube = new THREE.Mesh(skybox, skyboxMs);
    this.scene.add(cube)
   //textures
    cobbleFloorM = new THREE.MeshStandardMaterial( {
        // metalness: 0.4,
        // metalnessMap: textureLoader.load("imports/cobblestone_floor_03_2k_png/cobblestone_floor_03_spec_2k.png"),
        aoMap: textureLoader.load("imports/cobblestone_floor_03_2k_png/cobblestone_floor_03_AO_2k.png"),
        displacementMap: textureLoader.load("imports/cobblestone_floor_03_2k_png/cobblestone_floor_03_disp_2k.png"),
        bumpMap: textureLoader.load("imports/cobblestone_floor_03_2k_png/cobblestone_floor_03_bump_2k.png"),
        map: textureLoader.load("imports/cobblestone_floor_03_2k_png/cobblestone_floor_03_diff_2k.png"),
        normalMap: textureLoader.load("imports/cobblestone_floor_03_2k_png/cobblestone_floor_03_nor_2k.png"),
        roughnessMap: textureLoader.load("imports/cobblestone_floor_03_2k_png/cobblestone_floor_03_rough_2k.png"),
   } );
    var cfX = 20;
    var cfY = 20;
    cobbleFloorM.map.repeat.set(cfX,cfY);
    cobbleFloorM.normalMap.repeat.set(cfX,cfY);
    cobbleFloorM.roughnessMap.repeat.set(cfX,cfY);
    cobbleFloorM.displacementMap.repeat.set(cfX,cfY);
    // cobbleFloorM.metalnessMap.repeat.set(cfX,cfY);
    cobbleFloorM.aoMap.repeat.set(cfX,cfY);
    cobbleFloorM.bumpMap.repeat.set(cfX,cfY);

    // cobbleFloorM.metalnessMap.wrapS = cobbleFloorM.metalnessMap.wrapT =
    cobbleFloorM.aoMap.wrapS = cobbleFloorM.aoMap.wrapT =
    cobbleFloorM.bumpMap.wrapS = cobbleFloorM.bumpMap.wrapT =
    cobbleFloorM.displacementMap.wrapS = cobbleFloorM.displacementMap.wrapT = 
    cobbleFloorM.roughnessMap.wrapS = cobbleFloorM.roughnessMap.wrapT = 
    cobbleFloorM.normalMap.wrapS = cobbleFloorM.normalMap.wrapT = 
    cobbleFloorM.map.wrapS = cobbleFloorM.map.wrapT = THREE.RepeatWrapping;
   
    wallLong = new THREE.MeshStandardMaterial( {
        metalness: 0.2,
        lightMap: textureLoader.load("imports/rough_block_wall_2k_png/rough_block_wall_rough_ao_2k.png"),
        aoMap: textureLoader.load("imports/rough_block_wall_2k_png/rough_block_wall_ao_2k.png"),
        displacementMap: textureLoader.load("imports/rough_block_wall_2k_png/rough_block_wall_disp_2k.png"),
        map: textureLoader.load("imports/rough_block_wall_2k_png/rough_block_wall_diff_2k.png"),
        normalMap: textureLoader.load("imports/rough_block_wall_2k_png/rough_block_wall_nor_2k.png"),
        roughnessMap: textureLoader.load("imports/rough_block_wall_2k_png/rough_block_wall_rough_2k.png"),
   } );
   var wlX = 3;
   var wlY = 2;
   wallLong.map.repeat.set(wlX,wlY);
   wallLong.normalMap.repeat.set(wlX,wlY);
   wallLong.roughnessMap.repeat.set(wlX,wlY);
   wallLong.displacementMap.repeat.set(wlX,wlY);
   wallLong.lightMap.repeat.set(wlX,wlY);
   wallLong.aoMap.repeat.set(wlX,wlY);

   wallLong.lightMap.wrapS = wallLong.lightMap.wrapT =
   wallLong.aoMap.wrapS = wallLong.aoMap.wrapT =
   wallLong.displacementMap.wrapS = wallLong.displacementMap.wrapT = 
   wallLong.roughnessMap.wrapS = wallLong.roughnessMap.wrapT = 
   wallLong.normalMap.wrapS = wallLong.normalMap.wrapT = 
   wallLong.map.wrapS = wallLong.map.wrapT = THREE.RepeatWrapping;

    scene.add( new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 ) );
   
    document.body.appendChild( render.domElement );
    document.addEventListener( 'mousedown', onMouseDown, false );
  
  //possible controls
    window.onkeydown = function(event)
    {
    
    };

   //for(var i = 0; i < 4; i++){
    // target(i*100);
    target(0);
    this.target(400);

    //this.target(100)

    // }
    room()

    animate();
}

function onMouseDown( event ) {
    switch ( event.button ) {
         case 0: 
         
        // calculate mouse position in normalized device coordinates
	    // (-1 to +1) for both components
    	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        //console.log(mouse)
        //cast the ray
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(scene.children);
        if( intersects[0]!= null){
            var firstIntersect = intersects[0]
            fireball(firstIntersect);
        }
        // console.log(intersects);
        
    }
};

function room(){
    // Floor
    var floor = new THREE.CubeGeometry(base, 1, base);
    var fl = new THREE.Mesh(floor, cobbleFloorM);
    fl.position.x = -(base)/2 + base2;
    fl.position.y = -80;
    fl.position.z = -(base)/2 + base3;
    scene.add(fl);

    // Front
    var front = new THREE.CubeGeometry(1, 300, base);
    var fr = new THREE.Mesh(front, wallLong);
    fr.position.x = -(base) + base2;
    fr.position.y = -20;
    fr.position.z = -(base)/2 + base3;
    scene.add(fr);


    // Back
    var back = new THREE.CubeGeometry(1, 300, base);
    var bk = new THREE.Mesh(back, wallLong);
    bk.position.x = base2;
    bk.position.y = -20;
    bk.position.z = -(base)/2 + base3;
    scene.add(bk);

    // Left
    var left = new THREE.CubeGeometry(base, 300, 1);
    var lw = new THREE.Mesh(left, wallLong);
    lw.position.x = -(base)/2 + base2;
    lw.position.y = -20;
    lw.position.z = base3;
    scene.add(lw);

    // Right
    var right = new THREE.CubeGeometry(base, 300, 1);
    var rw = new THREE.Mesh(right, wallLong);
    rw.position.x = -(base)/2 + base2;
    rw.position.y = -20;
    rw.position.z = -(base) + base3;
    scene.add(rw);
}

function fireball(target){
    console.log("fireball")
    var fireball = new THREE.SphereGeometry(10);
    var fb = new THREE.Mesh(fireball, material);
    fb.position.x = camera.position.x;
    fb.position.y = camera.position.y;
    fb.position.z = camera.position.z;
    scene.add(fb);
    fb.lookAt(target.point)
    fireballs[numberOfShots] = fb;
    numberOfShots++;
}
// //v1
// function fireball(target){
//     console.log("fireball")
//     var fireball = new THREE.SphereGeometry(10);
//     var fb = new THREE.Mesh(fireball, material);
//     fb.position.x = camera.position.x;
//     fb.position.y = camera.position.y;
//     fb.position.z = camera.position.z;
//     scene.add(fb);
//     fb.lookAt(target.point)
//     targets[numberOfShots] = target;
//     fireballs[numberOfShots] = fb;
//     console.log("FIREBALL POISIOTN: ", fb.position);
//     numberOfShots++;
// }


function target(x){
    var target = new THREE.CylinderGeometry(50,50,3);
    var tt = new THREE.Mesh(target, material);
    tt.name = "target"
    tt.position.x = -x;
    tt.position.y = 0;
    tt.position.z = -200;
    tt.rotation.x = Math.PI / 2 //set this up to chagne later
    scene.add(tt);
    spawnTargets.push(tt)
}
function target2(x){
    var target = new THREE.CylinderGeometry(50,50,3);
    var tt = new THREE.Mesh(target, material);
    tt.name = "target"
    tt.position.x = -x;
    tt.position.y = 0;
    tt.position.z = -200;
    tt.rotation.x = Math.PI / 2 //set this up to chagne later
    scene.add(tt);
    spawnTargets.push(tt)
}



function torch(){

}



function wallBounds() {

    if (camera.position.x > maxX) {
        camera.position.x = maxX;
    }
    if (camera.position.x < minX) {
        camera.position.x = minX;
    }

    if (camera.position.z > maxZ) {
        camera.position.z = maxZ;
    }
    if (camera.position.z < minZ) {
        camera.position.z = minZ;
    }

    camera.position.y = -50;

}


//animate function to call the renderer
function animate() {

    requestAnimationFrame( animate );
    
    controls.update( clock.getDelta() );  
    
    //   //for fireball still target
    //   for (var i = 0; i < fireballs.length; i++) {
    //     //fireballs[i].lookAt(targets[i].point);
    //     fireballs[i].translateZ(6)
    //     var dz = Math.abs(fireballs[i].position.z - targets[i].point.z)
    //     var dx = Math.abs(fireballs[i].position.x - targets[i].point.x)
    //     var dy = Math.abs(fireballs[i].position.y - targets[i].point.y)
        
    //     if((dz < 3 && dx < 3) || (dy < 3 && dz < 3) ){
    //         scene.remove(fireballs[i])
    //         if(targets[i].object.name == "target"){
    //         scene.remove(targets[i].object)
    //         }
    //     }
        
    // }

    //for fireball v2 has collision detection
    for (var i = 0; i < fireballs.length; i++) {
        //fireballs[i].lookAt(targets[i].point);
        fireballs[i].translateZ(6)
        var originPoint = fireballs[i].position.clone();
        for (var vertexIndex = 0; vertexIndex < fireballs[i].geometry.vertices.length; vertexIndex++){		
		    var localVertex = fireballs[i].geometry.vertices[vertexIndex].clone();
		    var globalVertex = localVertex.applyMatrix4( fireballs[i].matrix );
		    var directionVector = globalVertex.sub( fireballs[i].position );
		
		    var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
		    var collisionResults = ray.intersectObjects(spawnTargets, true);
		         if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ){ 
                scene.remove(fireballs[i]);
                scene.remove(collisionResults[0].object);
                //console.log("resutls:", collisionResults[0]);
            }
        }
                
            
    }
        if(spawnTargets[0].position.x == 200){
            moveD = false;
        }else if(spawnTargets[0].position.x == -200){
            moveD =true;
        }
    
    if(moveD == true){
        spawnTargets[0].position.x += 2;
    }else{
        spawnTargets[0].position.x -= 2;
    }

    wallBounds();
 
    render.render( scene, camera );

}

