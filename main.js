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
			
			var ClavecinText,ClavecinVol,ClavecinWF;

			var gui = new GUI();
			addGUIEventListeners();

			

			//init();
			//animate();


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
					
					//wireframe model
					var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x42ABED,wireframe:true } );
					var wfObject = new THREE.Object3D();
					wfObject.position.set(0,5,0);
					scene.add(wfObject);
					
					//volumetric model
					var volMaterial = new THREE.MeshPhongMaterial( { ambient: 0x444444, color: 0xcccccc, specular: 0x000000,emissive:0x333333, shininess: 0});
					var volObject = new THREE.Object3D();
					volObject.position.set(0,5,0);
					scene.add(volObject);
					

					object.children[0].children.forEach(function(child){

						// create vol model from child geometry 
						var volMesh = new THREE.Mesh(child.geometry, volMaterial);
						volObject.add( volMesh );	
							
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
					
					
					// to access objects outside of this callback
					ClavecinText = object;
					ClavecinVol = volObject;
					ClavecinWF = wfObject;
					
					ClavecinText.visible = true;
					ClavecinVol.visible = false;
					ClavecinWF.visible = false;


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
				//light3.castShaddow = true;
				scene.add( light3 );
				
				/*areaLight1 = new THREE.AreaLight( 0xffffff, 1 );
				areaLight1.position.set( 0.0001, 10.0001, -18.5001 );
				areaLight1.rotation.set( -0.74719, 0.0001, 0.0001 );
				areaLight1.width = 10;
				areaLight1.height = 1;*/
				
				/*var directionalLight = new THREE.DirectionalLight( 0xffffEE, 0.04 );
				directionalLight.position.set( 50, 10, 0 );
				scene.add( directionalLight );*/
			

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
				//camera.rotation.x++;
				//console.log(camera.position.x+"   "+camera.position.y+"   "+camera.position.z);

			}
			
			window.onkeydown = function(event){
				switch (event.keyCode) {
					case 37 : 
					break;
					case 38 : 
					break;
					case 39 : 
					break;
					case 40 : 
					break;
					default:
					break;
				}
		
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
					var tween = new TWEEN.Tween(camera.position).to({
						x: -20,
						y: 10,
						z: 0
					},2000).easing(TWEEN.Easing.Exponential.Out).onUpdate(function () {
					}).onComplete(function () {
					}).start();
				});	
				document.addEventListener(gui.events.viewThree,function(event){
					var tween = new TWEEN.Tween(camera.position).to({
						x: 0,
						y: 20,
						z: 0
					},2000).easing(TWEEN.Easing.Exponential.Out).onUpdate(function () {
					}).onComplete(function () {
					});
					/*var tween2 = new TWEEN.Tween(camera.rotation).to({
						x: 10,
						y: 90*Math.PI/180,
						z: 0
					},2000).easing(TWEEN.Easing.Exponential.Out).onUpdate(function () {
					}).onComplete(function () {
					});*/
					tween.start();
					//tween2.start();
				});	
				
			}

