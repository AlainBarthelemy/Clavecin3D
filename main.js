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
				camera.position.set( 0, 60, 60 );

				cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
				cameraControls.target.set( 0, 0, 0);
				cameraControls.maxDistance = 60;
				cameraControls.minDistance = 1;
				cameraControls.update();
				
				// SCENE

				scene = new THREE.Scene();
				
				// FOG
				//scene.fog = new THREE.FogExp2( 0xAAAAAA, 0.01 );


				
				// GROUND
				var textureSquares = THREE.ImageUtils.loadTexture( "textures/patterns/bright_squares256.png" );
				textureSquares.repeat.set( 2000, 2000 );
				textureSquares.wrapS = textureSquares.wrapT = THREE.RepeatWrapping;
				textureSquares.magFilter = THREE.NearestFilter;
				textureSquares.format = THREE.RGBFormat;

				var groundMaterial = new THREE.MeshPhongMaterial( { shininess: 20, ambient: 0x000000, color: 0xffffff, specular: 0x000000, map: textureSquares } );
				var planeGeometry = new THREE.PlaneGeometry( 100, 100 );
				var ground = new THREE.Mesh( planeGeometry, groundMaterial );
				ground.position.set( 0, 0, 0);
				ground.rotation.x = - Math.PI / 2;
				ground.scale.set( 1000, 1000, 1000 );
				ground.receiveShadow = true;
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
				var clavecin;
				loader.load( 'obj/clavecin/untitled.obj', 'obj/clavecin/untitled.mtl', function ( object ) {
					

					//textured model
					object.position.set(0,5,0);
					//object.castShaddow = true;
					scene.add( object );
					
					//wireframe material
					var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0xAAAAAA,wireframe:true } );
					
					

					object.children[0].children.forEach(function(child){
						//var mesh = new THREE.Mesh( child.geometry, wireframeMaterial );
						//object.add( mesh );
						//child.material = shinyMaterial;
						child.material.shininess = 20;
					});
					clavecin = object;


				} );
				
				// LIGHTS
				var ambient = new THREE.AmbientLight( 0x444444);
				scene.add( ambient );
				
				var sphere = new THREE.SphereGeometry( 0.5, 16, 8 );

				var light1 = new THREE.PointLight( 0xFFFFFF,0.9,30);
				light1.position.set( 0, 0, 0 );
				light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ) );
				scene.add( light1 );
				var light2 = new THREE.PointLight( 0xFFFFFF,0.8,80);
				light2.position.set( -20, 20, 0 );
				light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ) );
				scene.add( light2 );
				var light3 = new THREE.PointLight( 0xFFFFFF,0.8,80 );
				light3.position.set( 20, 20, 0 );
				light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ) );
				light3.castShaddow = true;
				scene.add( light3 );
				
				var directionalLight = new THREE.DirectionalLight( 0xffffEE, 0.04 );
				directionalLight.position.set( 50, 10, 0 );
				scene.add( directionalLight );
			

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

