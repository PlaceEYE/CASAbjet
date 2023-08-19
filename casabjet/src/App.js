import { useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import SceneInit from './lib/SceneInit.js';

/**
 * React component responsible for rendering and controlling a Three.js scene.
 * It initializes the 3D environment, loads assets (textures, models, and sounds),
 * defines animation logic, and handles user interactions through click events.
 * The scene includes objects such as planes, spheres, and GLTF models, with animations and interactions.
 */
function App() {
  useEffect(() => {
    const casa = new SceneInit('myThreeJsCanvas');
    const glassSound = new Audio(process.env.PUBLIC_URL + "/assets/glass.mp3");
    let status = 0;
    
    casa.initialize();
    casa.animate();

  /**
   * Creates a plane using the given image path and attaches it to the scene.
   * @param {string} imagePath - The relative path to the image to be used as texture.
   * @param {function} callback - Callback function to be executed with the plane as argument.
   */
    const createPlane = (imagePath, callback) => {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(process.env.PUBLIC_URL + imagePath, (texture) => {
        const planeGeometry = new THREE.PlaneGeometry(18, 30);
        const planeMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = plane.rotation.y = plane.rotation.z = Math.PI;
        plane.position.y = 5;
        plane.position.z = 15;
        plane.visible = false;
        casa.scene.add(plane);
        callback(plane);
      });
    };

  /**
   * Updates the position of a given plane based on the camera position.
   * The plane is made to look at the camera and positioned at a defined distance from the origin.
   * @param {THREE.Mesh} plane - The plane to update. If the plane is not defined or not visible, the function returns early.
   */
    const updatePlanePosition = (plane) => {
      if (!plane || !plane.visible) return;
      const distanceFromZero = 10;
      const directionToZero = new THREE.Vector3(0, 0, 0).sub(casa.camera.position).normalize();
      const newPosition = directionToZero.multiplyScalar(-distanceFromZero);
      plane.position.set(newPosition.x, newPosition.y, newPosition.z);
      plane.lookAt(casa.camera.position);
    }

    let sphere, plane, plane2;
    const sphereTextureLoader = new THREE.TextureLoader();
    sphereTextureLoader.load(process.env.PUBLIC_URL + "/assets/background.jpg", (texture) => {
      const sphereGeometry = new THREE.SphereGeometry(50, 50, 50);
      sphereGeometry.scale(-1, 1, 1)
      texture.wrapS = THREE.RepeatWrapping;
      texture.repeat.x = -1;
      const sphereMaterial = new THREE.MeshBasicMaterial({ map: texture });
      sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.y = 3;
      casa.scene.add(sphere);
    });

    createPlane("/assets/image1.png", (p) => plane = p);
    createPlane("/assets/image2.png", (p) => plane2 = p);

    const gltfLoader = new GLTFLoader();
    let caseModel, objeModel;
    let bcaseModel, bcaseMixer, bcaseClip;
    let bcaseAnimationStarted = false;

    gltfLoader.load(process.env.PUBLIC_URL + "/assets/fin_re.glb", (gltfScene) => {
      objeModel = gltfScene.scene;
      objeModel.rotation.y = 0;
      objeModel.position.y = -4;
      objeModel.position.x = 0;
      objeModel.position.z = -1;
      objeModel.scale.set(8, 8, 8);
      objeModel.visible = true;
      casa.scene.add(objeModel);
    });
    gltfLoader.load(process.env.PUBLIC_URL + "/assets/bcase.gltf", (gltfScene) => {
      caseModel = gltfScene.scene;
      caseModel.rotation.y = 0;
      caseModel.position.y = 0;
      caseModel.scale.set(10, 10, 10);
      caseModel.visible = true;
      casa.scene.add(caseModel);
    });
    gltfLoader.load(process.env.PUBLIC_URL + "/assets/bcase.gltf", (gltfScene) => {
      bcaseModel = gltfScene.scene;
      bcaseModel.rotation.y = 0; 
      bcaseModel.position.y = 0;
      bcaseModel.scale.set(10, 10, 10);
      bcaseModel.visible = false;
      casa.scene.add(bcaseModel);
      bcaseClip = gltfScene.animations[0];
      bcaseMixer = new THREE.AnimationMixer(bcaseModel);
      gltfScene.animations.forEach((clip) => {
        bcaseMixer.clipAction(clip).play();
      });
    });

  /**
   * Main animation loop function. Responsible for updating the animation for various objects
   * and requesting the next animation frame. Updates the position of planes, rotates objects,
   * and manages animations using Three.js animation mixer.
   */
    const animate = () => {
      const delta = casa.clock.getDelta(); // Get the time delta
      if (bcaseMixer) {
        bcaseMixer.update(delta); 
        if (bcaseAnimationStarted && bcaseMixer.time >= bcaseClip.duration) {
          bcaseModel.visible = false; 
        }
      }
      if (objeModel) {
        objeModel.rotation.x += 0;
        objeModel.rotation.y += 0;
        objeModel.rotation.z += 0;
      }
      updatePlanePosition(plane);
      updatePlanePosition(plane2);
      requestAnimationFrame(animate);
    };
    animate();

  /**
   * Event handler for mouse click events. Manages the interaction logic for different stages of the scene,
   * including triggering animations, making planes visible or invisible, playing sounds, and opening URLs.
   * @param {Event} event - The click event.
   */
    const onClick = (event) => {
      if (status == 1) {
        if (Math.random() < 0.5)
        {
          const distanceFromZero = 10;
          const directionToZero = new THREE.Vector3(0, 0, 0).sub(casa.camera.position).normalize();
          const newPosition = directionToZero.multiplyScalar(-distanceFromZero);
          plane.position.set(newPosition.x, newPosition.y, newPosition.z);
          plane.lookAt(casa.camera.position);
          plane.visible = true;
        }
        else {
           const distanceFromZero = 10; 
           const directionToZero = new THREE.Vector3(0, 0, 0).sub(casa.camera.position).normalize();
           const newPosition = directionToZero.multiplyScalar(-distanceFromZero);
           plane2.position.set(newPosition.x, newPosition.y, newPosition.z);
           plane2.lookAt(casa.camera.position);
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
        action.setLoop(THREE.LoopOnce); 
        action.reset();
        action.play();
        bcaseAnimationStarted = true;
        status = 1;
      }
    };
    document.addEventListener('click', onClick);
    return () => {
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
