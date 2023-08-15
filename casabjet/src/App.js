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

    let plane;
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(process.env.PUBLIC_URL + "/assets/image.png", (texture) => {
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
  

    const gltfLoader = new GLTFLoader();
    let caseModel, objeModel;
    let status = 0;

    gltfLoader.load(process.env.PUBLIC_URL + "/assets/camera.gltf", (gltfScene) => {
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
      if (status%2 == 1) {
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
        status++;
      }
      else if(status > 1){
        plane.visible = false;
        status++;
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
        status++;
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
