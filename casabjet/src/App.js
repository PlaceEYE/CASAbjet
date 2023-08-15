import { useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import SceneInit from './lib/SceneInit.js';

function App() {
  useEffect(() => {
    const test = new SceneInit('myThreeJsCanvas');
    test.initialize();
    test.animate();

    const gltfLoader = new GLTFLoader();
    let objeModel;

    gltfLoader.load(process.env.PUBLIC_URL + "/assets/camera.gltf", (gltfScene) => {
      objeModel = gltfScene.scene;
      objeModel.rotation.y = 0;
      objeModel.position.y = -4;
      objeModel.position.x = 0;
      objeModel.position.z = 1;
      objeModel.scale.set(8, 8, 8);
      objeModel.visible = true;
      test.scene.add(objeModel);
    });

    let bcaseModel, bcaseMixer;

    gltfLoader.load(process.env.PUBLIC_URL + "/assets/bcase.gltf", (gltfScene) => {
      bcaseModel = gltfScene.scene;
      bcaseModel.rotation.y = 0; // You can adjust the position, rotation, and scale as needed
      bcaseModel.position.y = 0;
      bcaseModel.scale.set(10, 10, 10);
      bcaseModel.visible = true;
      test.scene.add(bcaseModel);

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
