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


			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;
			
			var models = []; 
			
			
			var gui = new GUI();
			addGUIEventListeners();

			var decoCoordinates = [];
			loadDecoCoordinates();
			
			var techElements = {};
			loadTechElements();
			

			init();
			animate();


			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );
				
				renderer = new THREE.WebGLRenderer();
				renderer.setSize( WIDTH, HEIGHT );
				container.appendChild( renderer.domElement );
				
				stats = new Stats();
				stats.domElement.style.position = 'absolute';
				stats.domElement.style.top = '0px';
				container.appendChild( stats.domElement );


				// CAMERA
				camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
				camera.position.set( 0, 15, 20 );
				
				// CAMERA CONTROLS

				cameraControls = new THREE.OrbitCustomControls(camera, renderer.domElement);
				cameraControls.target.set( 0, 5, 0);
				cameraControls.maxDistance = 60;//60
				cameraControls.minDistance = 1;
				cameraControls.noKeys = false;
				cameraControls.autoRotate = false;
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
						for (var i=0; i<600; i++) {//child.geometry.faces.length --> to many !!
						  //var mat = new THREE.MeshBasicMaterial({color: Math.random()*0xffffff});
						  var mat = new THREE.MeshPhongMaterial( {ambient: 0x444444, color: 0xcccccc, specular: 0x000000,emissive:0xAAAAAA, shininess: 0})
						  mat.transparent = true;
						  mat.opacity = 0.2;
						  facesMaterials.push(mat);
						}
						var faceMaterial = new THREE.MeshFaceMaterial(facesMaterials);
						var geom = child.geometry.clone();
						
						geom.faces.forEach(function(face){
							face.materialIndex = Math.floor(Math.random()*facesMaterials.length);	
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
							
						console.log("mesh id : "+volMesh.id+" mesh name : "+volMesh.name);
						

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
					
					
					
					object.visible = false;
					volObject.visible = true;
					wfObject.visible = true;
					
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


			}

			function onWindowResize() {

				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			



			function animate() {

				requestAnimationFrame( animate );
				render();
				cameraControls.update();
				stats.update();

			}

			function render() {

				//groundMirror.render();
				renderer.render( scene, camera );
				TWEEN.update();
				//camera.rotation.z+=0.1;
				/*vector.set( mouse.x, mouse.y, 0.1 );
				projector.unprojectVector( vector, camera );
				
				raycaster.ray.set( camera.position, vector.sub( camera.position ).normalize() );
				//if(models.length >2){
				var intersections = raycaster.intersectObjects(models[1].children);
				//console.log(intersections.length);
				if ( intersections.length > 0) {
					intersections.forEach(function(intersect){
						intersect.object.material.materials[intersect.face.materialIndex].transparent = false;
						//intersect.object.material.materials[intersect.face.materialIndex].color = new THREE.Color("#FF0000");	
						//console.log(intersect.faceIndex+"  "+intersect.face.materialIndex);
					});
					if ( intersected != null && intersected != intersections[ 0 ] ) {// new intersection
						
						//reset the color
						 intersected.object.material.materials[intersected.face.materialIndex].color = lastColor;
						 // swap to new intersection
						 intersected = intersections[ 0 ];
						 // store the current color
						 lastColor = intersected.object.material.materials[intersected.face.materialIndex].color
						 //set the color to red
						 intersected.object.material.materials[intersected.face.materialIndex].color = new THREE.Color("#FF0000");

						 console.log("face index  :"+intersected.faceIndex);

					} else if( intersected == null){
						 intersected = intersections[ 0 ];
						 // store the current color
						 lastColor = intersected.object.material.materials[intersected.face.materialIndex].color
						 //set the color to red
						 intersected.object.material.materials[intersected.face.materialIndex].color = new THREE.Color("#FF0000");
					}


				} else {
					if(intersected != null){
						intersected.object.material.materials[intersected.face.materialIndex].color = lastColor;
						intersected = null;
					}

				}
				
				
				intersections.forEach(function(intersect){
					if(intersect.object.name == "box"){
						intersect.object.material.materials[intersect.face.materialIndex].color = new THREE.Color("#FF0000");
						
					}
				});
				if(intersections.length >=1){
					console.log(intersections);	
				}*/
			}
			
			
			function addGUIEventListeners(){
				
				document.addEventListener(gui.events.zoomIn,function(event){
						cameraControls.dollyOut();
				});	
				document.addEventListener(gui.events.zoomOut,function(event){
						cameraControls.dollyIn();
				});	
				document.addEventListener(gui.events.setRotateMode,function(event){
						cameraControls.mode = cameraControls.MODE.ROTATE;
				});	
				document.addEventListener(gui.events.setPanMode,function(event){
						cameraControls.mode = cameraControls.MODE.PAN;
				});	
				document.addEventListener(gui.events.viewOne,function(event){
					var tween = new TWEEN.Tween(camera.position).to({
						x: 10,
						y: 10,
						z: -20
					},2000).easing(TWEEN.Easing.Exponential.Out).onUpdate(function () {
					}).onComplete(function () {
					}).start();
				});	
				document.addEventListener(gui.events.viewTwo,function(event){
					/*var tween = new TWEEN.Tween(camera.position).to({
						x: -20,
						y: 10,
						z: 0
					},2000).easing(TWEEN.Easing.Exponential.Out).onUpdate(function () {
					}).onComplete(function () {
					}).start();
					*/
					unSelectAllElements();
					selectElement("eclisse");
				});	
				document.addEventListener(gui.events.viewThree,function(event){
					unSelectAllElements();
					selectElement("rabat");
				});	
				
				document.addEventListener(gui.events.viewDeco,function(event){
					var coordinates = idToDecoCoordinates(event.detail.id);
					var tween = new TWEEN.Tween(camera.position).to({
						x: coordinates.camera.x,
						y: coordinates.camera.y,
						z: coordinates.camera.z
					},1000).easing(TWEEN.Easing.Exponential.Out).onUpdate(function () {
						//cameraControls.target.set(coordinates.target.x, coordinates.target.y, coordinates.target.z);
					}).onComplete(function () {
						gui.showPanelSecondary();
					}).start();
					var tweenTarget = new TWEEN.Tween(cameraControls.target).to({
						x: coordinates.target.x,
						y: coordinates.target.y,
						z: coordinates.target.z
					},1000).easing(TWEEN.Easing.Exponential.Out).onUpdate(function () {
					}).onComplete(function () {
					}).start();
					
				});	
				
			}
			
			function loadDecoCoordinates(){
				
				$.getJSON( "contents/elre/coordinates.json", function( data ) {
					decoCoordinates = data.coordinates;
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
			
			function loadTechElements(){
				
				$.getJSON( "contents/technique/rabat.json", function( data ) {
					techElements.rabat = data.faces;
				});
				$.getJSON( "contents/technique/eclisse.json", function( data ) {
					techElements.eclisse = data.faces;
				});				
			}
			function selectElement(name){
				
				switch(name){
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
						
						
					default:
						console.log("unknown element");
						break;
				}
				
			}
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

