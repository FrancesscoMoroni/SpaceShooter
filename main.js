import * as THREE from 'https://cdn.skypack.dev/three@0.136';

import { InputController } from './js/InputController';
import { CollisionController } from './js/CollisionController';
import { Player } from './js/Player';
import { Wall } from './js/Wall';
import { Plane } from './js/Plane';
import { ProjectileController } from './js/ProjectileController';
import { EnemyController } from './js/EnemyController';
import { GUIController } from './js/GUIController';

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

class SpaceShooterGame {
  constructor() {
    this.initialize();
  }

  initialize() {
    
    this.initializeRenderer();
    this.initializeControls();
    this.initializeLights();
    this.initializeLoader();
    this.loadModels();
    this.initializeScene();

    this.previousRAF = null;
    this.raf();
    this.onWindowResize();
  }

  // Przygotowywanie kontrolerów
  initializeControls() {
    let middleText = document.getElementById("middleText");
    let scoreBoard = document.getElementById("scoreBoard");
    let health = document.getElementById("health");

    this.GUIController = new GUIController(middleText, scoreBoard, health);

    this.collisionController = new CollisionController();

    this.projectileController = new ProjectileController(this.scene);

    this.enemyController = new EnemyController(this.scene, this.collisionController, this.GUIController);

    this.inputController = new InputController(this.scene, this.camera, this.GUIController, this.enemyController, this.projectileController);

  }

  //Przygotowanie threejs, sceny oraz kamery
  initializeRenderer() {
    this.threejs = new THREE.WebGLRenderer({
      antialias: false,
    });
    this.threejs.shadowMap.enabled = true;
    this.threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this.threejs.setPixelRatio(window.devicePixelRatio);
    this.threejs.setSize(window.innerWidth, window.innerHeight);
    this.threejs.physicallyCorrectLights = true;
    this.threejs.outputEncoding = THREE.sRGBEncoding;

    document.body.appendChild(this.threejs.domElement);

    window.addEventListener('resize', () => {
      this.onWindowResize();
    }, false);

    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 1000.0;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(0, 40, 0);
    this.camera.rotation.set(- Math.PI / 2, 0, 0);
    this.scene = new THREE.Scene();
  }

  // Przygodowania FBXLoader do późniejszego załadowania modelu
  initializeLoader() {
    this.FBXLoader = new FBXLoader();
  }

  // Załadowanie modelu drona przy pomocy FBXLoader
  loadModels() {
    this.FBXLoader.load('./resources/models/drone.fbx',
        (object) => {
            object.scale.set(.003, .003, .003);
            object.position.set(-100, -100, -100);
            this.enemyController.enemyModel = object;
            this.enemyModelLoaded = true;
    })
  }

  // Przygotowanie sceny: ściany, podłoże, tło oraz postać gracza.
  initializeScene() {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      './resources/space/space-posx.jpg',
      './resources/space/space-negx.jpg',
      './resources/space/space-posy.jpg',
      './resources/space/space-negy.jpg',
      './resources/space/space-posz.jpg',
      './resources/space/space-negz.jpg',
  ]);

    texture.encoding = THREE.sRGBEncoding;
    this.scene.background = texture;

    const mapLoader = new THREE.TextureLoader();
    const checkerboard = mapLoader.load('resources/freepbr/vintage-tile1_albedo.png');
    checkerboard.encoding = THREE.sRGBEncoding;


    const plane = new Plane(0, 0, 0, 100, 100, checkerboard);
    this.scene.add(plane.mesh);

    const wallMaterial = this.loadMaterial();

    const wall1 = new Wall(0, -40, -50, 100, 100, 4, wallMaterial);
    this.scene.add(wall1.mesh);
    this.collisionController.addPassiveCollision(wall1);

    const wall2 = new Wall(0, -40, 50, 100, 100, 4, wallMaterial);
    this.scene.add(wall2.mesh);
    this.collisionController.addPassiveCollision(wall2);

    const wall3 = new Wall(50, -40, 0, 4, 100, 100, wallMaterial);
    this.scene.add(wall3.mesh);
    this.collisionController.addPassiveCollision(wall3);

    const wall4 = new Wall(-50, -40, 0, 4, 100, 100, wallMaterial);
    this.scene.add(wall4.mesh);
    this.collisionController.addPassiveCollision(wall4);

    this.mainCharacter = new Player(this.scene, this.inputController, this.camera, this.projectileController, this.collisionController, this.enemyController, this.GUIController);
    this.collisionController.addActiveCollision(this.mainCharacter);
  }

  // Przygotowanie światła
  initializeLights() {
    let light = new THREE.DirectionalLight( 0xffffff, 1 );

    this.scene.add(light);
  }

  // Przygotowanie materiału dla ścian
  loadMaterial() {
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.5,
    });

    return material;
  }

  // Zmiana wymiarów w przypadku zmiany wielkości okna
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.threejs.setSize(window.innerWidth, window.innerHeight);
  }

  // Odświerzanie programu
  raf() {
    requestAnimationFrame((t) => {
      if (this.previousRAF === null) {
        this.previousRAF = t;
      }

      this.step(t - this.previousRAF);
      this.threejs.autoClear = true;
      this.threejs.render(this.scene, this.camera);
      this.threejs.autoClear = false;
      this.previousRAF = t;
      this.raf();
    });
  }

  //Pojedyńczy "krok" aplikacji -> aktualizowanie wszystkich kontrolerów
  step(timeElapsed) {
    const timeElapsedS = timeElapsed * 0.001;
    this.inputController.update(timeElapsedS);
    if (this.mainCharacter.loaded && this.enemyModelLoaded && !this.GUIController.paused) {
      this.collisionController.update();
      this.projectileController.update(timeElapsedS);
      this.enemyController.update(timeElapsedS);
    }
  }
}

let APP = null;

window.addEventListener('DOMContentLoaded', () => {
  APP = new SpaceShooterGame();
});

