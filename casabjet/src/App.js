import { useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import SceneInit from './lib/SceneInit.js';

function App() {
  useEffect(() => {
    const test = new SceneInit('myThreeJsCanvas');
    const glassSound = new Audio(process.env.PUBLIC_URL + "/assets/glass.mp3");
    

    test.initialize();
    test.animate();

    let sphere;
    const sphereTextureLoader = new THREE.TextureLoader();
    sphereTextureLoader.load(process.env.PUBLIC_URL + "/assets/background.jpg", (texture) => {
      const sphereGeometry = new THREE.SphereGeometry(50, 50, 50);
      sphereGeometry.scale(-1, 1, 1)
      texture.wrapS = THREE.RepeatWrapping;
      texture.repeat.x = -1;
      const sphereMaterial = new THREE.MeshBasicMaterial({ map: texture });
      sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.y = 3; // Adjust the position as needed
      
      test.scene.add(sphere);
    });


    let plane;
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(process.env.PUBLIC_URL + "/assets/image1.png", (texture) => {
      const planeGeometry = new THREE.PlaneGeometry(18, 30);
      const planeMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true  });
      plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = Math.PI ;
      plane.rotation.y = Math.PI ;
      plane.rotation.z = Math.PI;
      plane.position.y = 5;
      plane.position.z = 15;
      plane.visible = false;
      test.scene.add(plane);
    });
    
    let plane2;
    const textureLoader2 = new THREE.TextureLoader();
    textureLoader2.load(process.env.PUBLIC_URL + "/assets/image2.png", (texture) => {
      const planeGeometry2 = new THREE.PlaneGeometry(18, 30);
      const planeMaterial2 = new THREE.MeshBasicMaterial({ map: texture, transparent: true  });
      plane2 = new THREE.Mesh(planeGeometry2, planeMaterial2);
      plane2.rotation.x = Math.PI ;
      plane2.rotation.y = Math.PI ;
      plane2.rotation.z = Math.PI;
      plane2.position.y = 5;
      plane2.position.z = 15;
      plane2.visible = false;
      test.scene.add(plane2);
    });

    const gltfLoader = new GLTFLoader();
    let caseModel, objeModel;
    let status = 0;

    gltfLoader.load(process.env.PUBLIC_URL + "/assets/fin_re.glb", (gltfScene) => {
      objeModel = gltfScene.scene;
      objeModel.rotation.y = 0;
      objeModel.position.y = -4;
      objeModel.position.x = 0;
      objeModel.position.z = -1;
      objeModel.scale.set(8, 8, 8);
      objeModel.visible = true;
      test.scene.add(objeModel);
    });

    let bcaseModel, bcaseMixer, bcaseClip;
    let bcaseAnimationStarted = false;

    gltfLoader.load(process.env.PUBLIC_URL + "/assets/bcase.gltf", (gltfScene) => {
      caseModel = gltfScene.scene;
      caseModel.rotation.y = 0; // You can adjust the position, rotation, and scale as needed
      caseModel.position.y = 0;
      caseModel.scale.set(10, 10, 10);
      caseModel.visible = true;
      test.scene.add(caseModel);


    });

    gltfLoader.load(process.env.PUBLIC_URL + "/assets/bcase.gltf", (gltfScene) => {
      bcaseModel = gltfScene.scene;
      bcaseModel.rotation.y = 0; // You can adjust the position, rotation, and scale as needed
      bcaseModel.position.y = 0;
      bcaseModel.scale.set(10, 10, 10);
      bcaseModel.visible = false;
      test.scene.add(bcaseModel);

      bcaseClip = gltfScene.animations[0];
      // Add the animations
      bcaseMixer = new THREE.AnimationMixer(bcaseModel);
      gltfScene.animations.forEach((clip) => {
        bcaseMixer.clipAction(clip).play();
      });
    });

    const animate = () => {
      const delta = test.clock.getDelta(); // Get the time delta
      if (bcaseMixer) {
        bcaseMixer.update(delta); // Update the animation mixer with the time delta
        if (bcaseAnimationStarted && bcaseMixer.time >= bcaseClip.duration) {
          bcaseModel.visible = false; // Make bcase invisible after the animation plays
        }
      }
      if (objeModel) {
        objeModel.rotation.x += 0;
        objeModel.rotation.y += 0;
        objeModel.rotation.z += 0;
      }
      
      requestAnimationFrame(animate);
    };
    animate();


    // Adding click event listener
    const onClick = (event) => {
      if (status == 1) {
        if (Math.random() < 0.5)
        {
          // Define the distance from the camera to the plane
          const distanceFromZero = 10; // Change this value as needed

          // Compute the direction from the camera to the zero point
          const directionToZero = new THREE.Vector3(0, 0, 0).sub(test.camera.position).normalize();
      
          // Compute the position for the plane by extending this direction
          const newPosition = directionToZero.multiplyScalar(-distanceFromZero);
      
          // Update the plane's position
          plane.position.set(newPosition.x, newPosition.y, newPosition.z);
      
          // Make the plane look at the camera
          plane.lookAt(test.camera.position);
      
          // Make the plane visible
          plane.visible = true;
        }
        else {
           // Define the distance from the camera to the plane
           const distanceFromZero = 10; // Change this value as needed

           // Compute the direction from the camera to the zero point
           const directionToZero = new THREE.Vector3(0, 0, 0).sub(test.camera.position).normalize();
       
           // Compute the position for the plane by extending this direction
           const newPosition = directionToZero.multiplyScalar(-distanceFromZero);
       
           // Update the plane's position
           plane2.position.set(newPosition.x, newPosition.y, newPosition.z);
       
           // Make the plane look at the camera
           plane2.lookAt(test.camera.position);
       
           // Make the plane visible
           plane2.visible = true;

        }
        
        status = 2;
      }
      else if(status == 2){
        if (plane2.visible == true) {
          window.open('https://www.instagram.com/ar/699800535309791', '_blank');
        } else if (plane.visible == true) {
          window.open('https://www.instagram.com/ar/3558694611051303', '_blank');
        }
        plane.visible = false;
        plane2.visible = false;
        status = 1;
      }
      if (status == 0 && bcaseMixer && bcaseClip && !bcaseAnimationStarted) {
        caseModel.visible = false
        bcaseModel.visible = true
        glassSound.play();
        const action = bcaseMixer.clipAction(bcaseClip);
        action.setLoop(THREE.LoopOnce); // Play the animation once
        action.reset(); // Reset the action to the start
        action.play(); // Play the action
        bcaseAnimationStarted = true;
        status = 1;
      }
      
    };

    document.addEventListener('click', onClick);
  
    return () => {
      // Clean up the event listener when the component is unmounted
      document.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}

export default App;
