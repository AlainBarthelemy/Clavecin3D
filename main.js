var container, stats;

var camera, scene, renderer;

// scene size
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;


// camera
var VIEW_ANGLE = 45;
var ASPECT = WIDTH / HEIGHT;
var NEAR = 1;
var FAR = 500;
var cameraControls;

var SNAP_TIME = 16*60*1000 + 30*1000; //16m30s
var RELOAD_TIME = 30*60*1000; // 30min


var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var defaultPos =    {
						"camera": {
						  "x": 7.639273274111902,
						  "y": 13.842984243067429,
						  "z": 28.04631800122854
						},
						"target": {
						  "x": -1.7996103643528047,
						  "y": 4.9312685332480495,
						  "z": 0.5363615876957285
						}
}

var renders = {
		textured : "textured",
		vol : "vol",
		wireframe : "wireframe",
		volAndWire : "volAndWire"
}

var models = []; 


var gui = new GUI();
addGUIEventListeners();

var decoCoordinates = [];
loadDecoCoordinates();

var histoCoordinates = [];
loadHistoCoordinates();

var techElements = {};
loadTechElements();



init();
animate();
haveaNapIfnoSnap();


function init() {

	container = document.createElement( 'div' );
	container.setAttribute("id", "canvas-container");
	document.body.appendChild( container );
	
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( WIDTH, HEIGHT );
	container.appendChild( renderer.domElement );
	
	
	/*stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );*/


	// CAMERA
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	camera.position.set( defaultPos.camera.x, defaultPos.camera.y, defaultPos.camera.z );
	
	// CAMERA CONTROLS

	cameraControls = new THREE.OrbitCustomControls(camera, renderer.domElement);
	cameraControls.target.set( defaultPos.target.x, defaultPos.target.y, defaultPos.target.z);
	cameraControls.maxDistance = 60;//60
	cameraControls.minDistance = 1;
	cameraControls.noKeys = false;
	cameraControls.autoRotate = false;
	cameraControls.autoRotateSpeed = 0.5;
	cameraControls.zoomSpeed = 0.15;
	cameraControls.update();
	
	// SCENE

	scene = new THREE.Scene();
	
	// FOG
	//scene.fog = new THREE.FogExp2( 0xAAAAAA, 0.01 );


	
	// GROUND
	var textureSquares = THREE.ImageUtils.loadTexture( "textures/patterns/bright_squares256.png" );
	textureSquares.repeat.set( 5000, 5000 );
	textureSquares.wrapS = textureSquares.wrapT = THREE.RepeatWrapping;
	textureSquares.magFilter = THREE.NearestFilter;
	textureSquares.format = THREE.RGBFormat;

	var groundMaterial = new THREE.MeshPhongMaterial( { shininess: 0, ambient: 0x000000, color: 0x666666, specular: 0x000000, map: textureSquares } );
	var planeGeometry = new THREE.PlaneGeometry( 100, 100 );
	var ground = new THREE.Mesh( planeGeometry, groundMaterial );
	ground.position.set( 0, 0, 0);
	ground.rotation.x = - Math.PI / 2;
	ground.scale.set( 1000, 1000, 1000 );
	//ground.receiveShadow = true;
	scene.add( ground );
	
	
	// MIRROR
	groundMirror = new THREE.Mirror( renderer, camera, { clipBias: 0.003, textureWidth: WIDTH, textureHeight: HEIGHT, color:0x999999 } );
	var groundMirrorMesh = new THREE.Mesh( new THREE.PlaneGeometry( 30, 30 ), groundMirror.material );
	groundMirrorMesh.add( groundMirror );
	groundMirrorMesh.position.set(0,0.1,0);
	groundMirrorMesh.rotateX( - Math.PI / 2 );
	//scene.add( groundMirrorMesh );
	//groundMirrorMesh.visible = false;
	

	// MODEL

	THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

	var loader = new THREE.OBJMTLLoader();
	loader.load( 'obj/clavecin/untitled.obj', 'obj/clavecin/untitled.mtl', function ( object ) {
		

		//textured / main model
		object.position.set(0,5,0);
		scene.add( object );
		
		//volumetric model
		//var volMaterial = new THREE.MeshPhongMaterial( { ambient: 0x444444, color: 0xcccccc, specular: 0x000000,emissive:0x333333, shininess: 0});
		var volObject = new THREE.Object3D();
		volObject.position.set(0,5,0);
		scene.add(volObject);
		
		//wireframe model
		var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x42ABED,wireframe:true } );
		var wfObject = new THREE.Object3D();
		wfObject.position.set(0,5,0);
		scene.add(wfObject);
		

		
		object.children[0].children.forEach(function(child){

			// create vol model from child geometry 
			var facesMaterials = [];
			for (var i=0; i<1000; i++) {//child.geometry.faces.length --> to many !!
			  var mat = new THREE.MeshBasicMaterial({color: 0xffffff});
			  //var mat = new THREE.MeshPhongMaterial( {ambient: 0x444444, color: 0xcccccc, specular: 0x000000,emissive:0xAAAAAA, shininess: 0})
			  mat.transparent = true;
			  mat.opacity = 0.2;
			  facesMaterials.push(mat);
			}
			var faceMaterial = new THREE.MeshFaceMaterial(facesMaterials);
			var geom = child.geometry.clone();
			
			geom.faces.forEach(function(face,index){
				//face.materialIndex = Math.floor(Math.random()*facesMaterials.length);	
				face.materialIndex = index%facesMaterials.length;
			});
			
			geom.materials = facesMaterials;
			
			var volMesh = new THREE.Mesh( geom, faceMaterial )						
		
				
			switch(volMesh.id){
				case 30:
					volMesh.name="unknown";
					//volMesh.material.transparent = false;
					break;
				case 32:
					volMesh.name="unkonwn(plancher)";
					//volMesh.material.transparent = false;
					break;
				case 34:
					volMesh.name="F";
					//volMesh.material.transparent = false;
					break;	
				case 36:
					volMesh.name="L+A";
					//volMesh.material.transparent = false;
					break;	
				case 38:
					volMesh.name="C";
					//volMesh.material.transparent = false;
					break;
				case 40:
					volMesh.name="F";
					//volMesh.material.transparent = false;
					break;
				case 42:
					volMesh.name="RABAT INTERIEUR";
					//volMesh.material.transparent = false;
					break;
				case 44:
					volMesh.name="unkonwn";
					//volMesh.material.transparent = false;
					break;
				case 46:
					volMesh.name="unkonwn (touches face avnt)";
					//volMesh.material.transparent = false;
					break;
				case 48:
					volMesh.name="RABAT EXTERIEUR";
					//volMesh.material.transparent = false;
					break;
				case 50:
					volMesh.name="divers (clavier)";
					//volMesh.material.transparent = false;
				case 52:
					volMesh.name="divers (clavier + B)"
					//volMesh.material.transparent = false;
				case 54:
					volMesh.name="divers (clavier + B+ E)";
					//volMesh.material.transparent = false;
					break;
				case 56:
					volMesh.name="divers contour";
					break;
				default:break;
			}
			
			volObject.add( volMesh );
				
			//console.log("mesh id : "+volMesh.id+" mesh name : "+volMesh.name);
			

			// create wf model from child geometry 
			var wfMesh = new THREE.Mesh( child.geometry, wireframeMaterial );
			wfObject.add( wfMesh );
			
			
			// little adjustments for texture material
			child.material.shininess = 100;
			child.material.emissive = new THREE.Color(0xABABAB);
			child.material.specular = new THREE.Color(0x272727);//222
			child.material.shading = THREE.SmoothShading;
			if(child.material.map != null){
				//child.material.map.anisotropy = 16;
			}
			
		});
		
		
		
		object.visible = true;
		volObject.visible = false;
		wfObject.visible = false;
		
		models.push(object);
		models.push(volObject);
		models.push(wfObject);
		

	} );
	

	
	// LIGHTS
	var ambient = new THREE.AmbientLight( 0x444444);
	scene.add( ambient );
	
	var sphere = new THREE.SphereGeometry( 0.5, 16, 8 );

	var light1 = new THREE.PointLight( 0xFFFFFF,0.6,90);
	light1.position.set( 0, 15, -15 );
	//light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ) );
	scene.add( light1 );
	var light2 = new THREE.PointLight( 0xFFFFFF,0.6,90);
	light2.position.set( -15, 15, 15 );
	//light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ) );
	scene.add( light2 );
	var light3 = new THREE.PointLight( 0xFFFFFF,0.6,90 );
	light3.position.set( 15, 15, 15 );
	//light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ) );
	scene.add( light3 );
	
	

	window.addEventListener( 'resize', onWindowResize, false );
	window.addEventListener( 'keydown', onKeyDown, false );

}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onKeyDown(event){
	if(event.keyCode==68)
		console.log(
			{
				"camera":{
					"x":camera.position.x,
					"y":camera.position.y,
					"z":camera.position.z
				},
				"target":{
					"x":cameraControls.target.x,
					"y":cameraControls.target.y,
					"z":cameraControls.target.z
				}
		});
}





function animate() {

	requestAnimationFrame( animate );
	render();
	cameraControls.update();
	//stats.update();

}

function render() {

	//groundMirror.render();
	renderer.render( scene, camera );
	TWEEN.update();

}


function addGUIEventListeners(){
	
	// control buttons
	document.addEventListener(gui.events.zoomIn,function(event){
			cameraControls.dollyOut(Math.pow( 0.95, 2));
	});	
	document.addEventListener(gui.events.zoomOut,function(event){
			cameraControls.dollyIn(Math.pow( 0.95, 2));
	});	
	document.addEventListener(gui.events.setRotateMode,function(event){
			cameraControls.mode = cameraControls.MODE.ROTATE;
	});	
	document.addEventListener(gui.events.setPanMode,function(event){
			cameraControls.mode = cameraControls.MODE.PAN;
	});	
	/*document.addEventListener(gui.events.viewOne,function(event){
		unSelectAllElements();
		selectElement("pointe");
	});	
	document.addEventListener(gui.events.viewTwo,function(event){
		unSelectAllElements();
		selectElement("eclisse");
	});	
	document.addEventListener(gui.events.viewThree,function(event){
		unSelectAllElements();
		selectElement("rabat");
	});*/	
	
	document.addEventListener(gui.events.viewDeco,function(event){
		var coordinates = idToDecoCoordinates(event.detail.id);
		autoMove(coordinates.camera,coordinates.target,true);
	});
	document.addEventListener(gui.events.viewTech,function(event){
		var coordinates = techElements[event.detail.id].camera;
		unSelectAllElements();
		selectElement(event.detail.id);
		autoMove(coordinates.camera,coordinates.target,true);
	});
	document.addEventListener(gui.events.viewHisto,function(event){
		var coordinates = idToHistoCoordinates(event.detail.id);
		autoMove(coordinates.camera,coordinates.target,true);
	});
	document.addEventListener(gui.events.changeMode,function(event){
		
		switch (gui.currentMode){
			case gui.modes.tech :
				unSelectAllElements();
			break;
			case gui.modes.elre :
			break;
			case gui.modes.histo :
			break;
			case gui.modes.resto :
			break;
			case gui.modes.ipad :
			break;
			case gui.modes.info :
			break;
			case gui.modes.none : 
			break;
			default:break;
		}
		switch (event.detail.newMode){
			case gui.modes.tech :
				resetPosition();
				switchToRenderMode(renders.volAndWire);
			break;
			case gui.modes.elre :
				resetPosition();
				switchToRenderMode(renders.textured);
			break;
			case gui.modes.histo :
				resetPosition();
				switchToRenderMode(renders.textured);
			break;
			case gui.modes.resto :
				resetPosition();
				switchToRenderMode(renders.textured);
			break;
			case gui.modes.ipad :
				resetPosition();
				switchToRenderMode(renders.textured);
			break;
			case gui.modes.info :
				resetPosition();
				switchToRenderMode(renders.textured);
			break;
			case gui.modes.none : 
				switchToRenderMode(renders.textured);
			break;
			default:break;
		}
		//unSelectAllElements();
		//selectElement("rabat");
	});
	
}

function autoMove(cameraDest,targetDest,showPanelSecondary){
	
		showPanelSecondary = typeof showPanelSecondary !== 'undefined' ? showPanelSecondary : false;
	
		var tween = new TWEEN.Tween(camera.position).to({
			x: cameraDest.x,
			y: cameraDest.y,
			z: cameraDest.z
		},1000).easing(TWEEN.Easing.Exponential.Out).onUpdate(function () {
			//cameraControls.target.set(targetDest.x, targetDest.y, targetDest.z);
			//cameraControls.update();
			//console.log({camera:camera.position,target:cameraControls.target});
		}).onComplete(function () {
			if(showPanelSecondary){
				gui.showPanelSecondary();
				//if(gui.currentMode == gui.modes.elre)
					//gui.showPanelTertiary();	
			}
		}).start();
		var tweenTarget = new TWEEN.Tween(cameraControls.target).to({
			x: targetDest.x,
			y: targetDest.y,
			z: targetDest.z
		},1000).easing(TWEEN.Easing.Exponential.Out).onUpdate(function () {
		}).onComplete(function () {
		}).start();	
}

function switchToRenderMode(mode){
	
	switch(mode){
		case renders.textured :
			models[0].visible = true;
			models[1].visible = false;
			models[2].visible = false;
			break;
		case renders.vol : 
			models[0].visible = false;
			models[1].visible = true;
			models[2].visible = false;
			break;
		case renders.wireframe :
			models[0].visible = false;
			models[1].visible = false;
			models[2].visible = true;
			break;
		case renders.volAndWire :
			models[0].visible = false;
			models[1].visible = true;
			models[2].visible = true;
			break;
	}
	
}

function resetPosition(){
	autoMove(defaultPos.camera,defaultPos.target);	
}

function loadDecoCoordinates(){
	
	$.getJSON( "contents/elre/coordinates.json", function( data ) {
		decoCoordinates = data.coordinates;
	});	
}
function loadHistoCoordinates(){
	
	$.getJSON( "contents/histo/coordinates.json", function( data ) {
		histoCoordinates = data.coordinates;
	});	
}

function idToDecoCoordinates(id){
	var result = $.grep(decoCoordinates, function(e){ return e.id == id; });
	if (result.length == 0) {
	  // not found
	  return -1;
	} else if (result.length == 1) {
	  // access the foo property using result[0].foo
	  return result[0];
	} else {
	  // multiple items found
	  return result;
	}
}
function idToHistoCoordinates(id){
	var result = $.grep(histoCoordinates, function(e){ return e.id == id; });
	if (result.length == 0) {
	  // not found
	  return -1;
	} else if (result.length == 1) {
	  // access the foo property using result[0].foo
	  return result[0];
	} else {
	  // multiple items found
	  return result;
	}
}

function loadTechElements(){
	
	$.getJSON( "contents/technique/couvercle.json", function( data ) {
		techElements.couvercle = data;
	});
	$.getJSON( "contents/technique/eclisse.json", function( data ) {
		techElements.eclisse = data;
	});	
	$.getJSON( "contents/technique/pointe.json", function( data ) {
		techElements.pointe = data;
	});
	$.getJSON( "contents/technique/barre.json", function( data ) {
		techElements.barre = data;
	});
	$.getJSON( "contents/technique/echine.json", function( data ) {
		techElements.echine = data;
	});	
	$.getJSON( "contents/technique/joue.json", function( data ) {
		techElements.joue = data;
	});
	$.getJSON( "contents/technique/table.json", function( data ) {
		techElements.table = data;
	});
	$.getJSON( "contents/technique/fond.json", function( data ) {
		techElements.fond = data;
	});
	$.getJSON( "contents/technique/couvercle.json", function( data ) {
		techElements.couvercle = data;
	});
	$.getJSON( "contents/technique/clavier.json", function( data ) {
		techElements.clavier = data;
	});
	
}
// select Tech Element
function selectElement(name){
		techElements[name].faces.forEach(function(data){
			models[1].children[data.meshindex].material.materials[models[1].children[data.meshindex].geometry.faces[data.faceindex].materialIndex].transparent = false;
		});		
/*				switch(name){
		case "rabat":
				techElements.rabat.forEach(function(set){
					models[1].children[getMeshIndex(set.meshid)].material.materials[models[1].children[getMeshIndex(set.meshid)].geometry.faces[set.faceindex].materialIndex].transparent = false;
				});
			break;					
		case "eclisse":
				techElements.eclisse.forEach(function(set){
					models[1].children[getMeshIndex(set.meshid)].material.materials[models[1].children[getMeshIndex(set.meshid)].geometry.faces[set.faceindex].materialIndex].transparent = false;
				});						
			break;
		case "pointe":
				techElements.pointe.faces.forEach(function(data){
					models[1].children[data.meshindex].material.materials[models[1].children[data.meshindex].geometry.faces[data.faceindex].materialIndex].transparent = false;
				});						
			break;
			
			
		default:
			console.log("unknown element");
			break;
	}*/
	
}
// unselect all tech element
function unSelectAllElements(){
	models[1].children.forEach(function(mesh){
		mesh.geometry.faces.forEach(function(face,index){
			if(!mesh.material.materials[face.materialIndex].transparent)
				mesh.material.materials[face.materialIndex].transparent = true;
		});
	});
}
// a remplacer par l'index directement dans le json
function getMeshIndex(meshid){
	for(var k=0;k<models[1].children.length;k++){
		if(models[1].children[k].id == meshid)
			return k;
	}
	return -1;
	
}

// we externalize idleTime so we can set it from other objects (dirty patch)
var idleTime = 0;

function haveaNapIfnoSnap(){
	
	//var idleTime = 0;
	var dosing = false;
	var intervalHandle = window.setInterval(function(){
		idleTime +=1000;
		if(idleTime >= SNAP_TIME && !dosing)
			makeaNap();
		
		if(idleTime >= RELOAD_TIME)
			location.reload();
		//else if(idleTime < SNAP_TIME && dosing)
			//wakeUp();
		//console.log(idleTime);
	},1000);
	
	window.onmousemove = function (e) {
		idleTime = 0;
		if(dosing)
			wakeUp();
	};
	window.onkeypress = function (e) {
		idleTime = 0;
		if(dosing)
			wakeUp();
	};
	window.ontouchmove = function (e) {
		idleTime = 0;
		if(dosing)
			wakeUp();
	};
	window.ontouchstart = function (e) {
		idleTime = 0;
		if(dosing)
			wakeUp();
	};
	
	function makeaNap(){
		dosing = true;
		console.log("nap");	
		
		//$('#main-nav').addClass('mini-navbar');
		//$('.navbar-brand').addClass('mini-brand');
		gui.closeMenu();
		cameraControls.autoRotate = true;
		
		
		gui.closePanel($('#panel-primary'));
		gui.closePanel($('#panel-secondary'));
		gui.closePanel($('#panel-tertiary'));
		gui.changeMode(gui.modes.none);
		resetPosition();
		
		$(document).focus();
	}
	function wakeUp(){
		dosing = false;
		console.log("wake");
		
		//$('#main-nav').removeClass('mini-navbar');
		//$('.navbar-brand').removeClass('mini-brand');
		gui.openMenu();
		cameraControls.autoRotate = false;
	}
	
	
	
}
