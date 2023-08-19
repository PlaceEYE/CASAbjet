import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class SceneInit {
  /**
   * Constructs a new SceneInit object, initializing the Three.js scene, camera,
   * renderer, lights, and other related properties.
   * @param {string} canvasId - The ID of the canvas element to render the scene.
   */
  constructor(canvasId) {
    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;

    this.fov = 45;
    this.nearPlane = 1;
    this.farPlane = 1000;
    this.canvasId = canvasId;

    this.clock = undefined;
    this.controls = undefined;

    this.ambientLight = undefined;
    this.directionalLight = undefined;
    this.pointLight = undefined;
  }
  
  /**
   * Initializes the Three.js scene, including the camera, renderer, controls,
   * lights, and other related elements. Sets up the rendering environment with
   * proper sizing and attaches it to the DOM.
   */
  initialize() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      window.innerWidth / window.innerHeight,
      this.nearPlane,
      this.farPlane
    );
    this.camera.position.z = 70;

    const canvas = document.getElementById(this.canvasId);
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.setupLights();
    window.addEventListener('resize', () => this.onWindowResize(), false);
  }

  /**
   * Sets up the lighting for the scene, including ambient, directional, and point lights.
   */
  setupLights() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    this.ambientLight.castShadow = true;
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    this.directionalLight.position.set(0, 32, 64);
    this.scene.add(this.directionalLight);

    this.pointLight = new THREE.PointLight(0xffffff, 1);
    this.pointLight.position.set(0, 0, 0);
    this.scene.add(this.pointLight);
  }

  /**
   * Begins the animation loop, calling the render method on each animation frame
   * and updating the controls. Intended to be called once to start the animation.
   */
  animate() {
    window.requestAnimationFrame(this.animate.bind(this));
    this.render();
    this.controls.update();
  }

  /**
   * Renders the current state of the scene, drawing it to the canvas as specified
   * in the initialization. Updates any dynamic properties as needed for each frame.
   */
  render() {
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Handles the window resize event, updating the camera aspect ratio and renderer
   * size to match the new window dimensions, ensuring the scene scales properly.
   */
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
