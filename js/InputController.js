import * as THREE from 'https://cdn.skypack.dev/three@0.136';

/*
Kontroler zajmujący się zczytywaniem przycisków wciskanych przez użytkownika, a nastepnie wykonaniem odpowiednich akcji.
Przypisane przyciski, to:
- lewy przycisk myszy, oddanie strzału,
- klawisz W, poruszenie postacie gracza w górę,
- klawisz S, poruszenie postacie gracza w dół,
- klawisz A, poruszenie postacie gracza w lewo,
- klawisz D, poruszenie postacie gracza w prawo,
- klaiwsz R, zresetowanie gry (tylko gdy gra zostanie zakończona),
- klawisz ESC, zatrzymanie rozgrywki.
Kontroler sprawdza też pozycje myszki i wykonuje akcje obrotu modelu gracza w jej stronę.
*/
export class InputController {
    constructor(scene, camera, GUIController, enemyControll, projectileControll) {
      this.initialize(scene, camera, GUIController, enemyControll, projectileControll);    
    }
  
    initialize(scene, camera, GUIController, enemyControll, projectileControll) {
      this.target = document;
      this.scene = scene;
      this.camera = camera;
      this.GUIController = GUIController;
      this.enemyControll = enemyControll;
      this.projectileControll = projectileControll;
      this.current = {
        leftButton: false,
        rightButton: false,
        mouseXDelta: 0,
        mouseYDelta: 0,
        mouseX: 0,
        mouseY: 0,
      };
      this.windowHalfX = window.innerWidth / 2;
      this.windowHalfY = window.innerHeight / 2;
      this.lookAt = new THREE.Vector3();
      this.previous = null;
      this.keys = {};
      this.previousKeys = {};
      this.target.addEventListener('mousemove', (e) => this.onMouseMove(e), false);
      this.target.addEventListener('mousedown', (e) => this.onMouseDown(e), false);
      this.target.addEventListener('mouseup', (e) => this.onMouseUp(e), false);
      this.target.addEventListener('keydown', (e) => this.onKeyDown(e), false);
      this.target.addEventListener('keyup', (e) => this.onKeyUp(e), false);
    }
  
    onMouseMove(e) {
      this.current.mouseX = e.clientX - this.windowHalfX;
      this.current.mouseY = e.clientY - this.windowHalfY;
    }

    onMouseDown(e) {
      switch (e.button) {
        case 0: {
          this.current.leftButton = true;
          break;
        }
        case 2: {
          this.current.rightButton = true;
          break;
        }
      }
    }
  
    onMouseUp(e) {
      switch (e.button) {
        case 0: {
          this.current.leftButton = false;
          break;
        }
        case 2: {
          this.current.rightButton = false;
          break;
        }
      }
    }
  
    onKeyDown(e) {
      this.keys[e.keyCode] = true;
    }
  
    onKeyUp(e) {
      this.keys[e.keyCode] = false;
    }
  
    key(keyCode) {
      return !!this.keys[keyCode];
    }
  
    isReady() {
      return this.previous !== null;
    }

    updateLookAt() {
      this.lookAt.x += ( this.current.mouseX - this.lookAt.x ) * .05;
      this.lookAt.z += ( this.current.mouseY - this.lookAt.z ) * .05;

      this.target.lookAt(this.lookAt)
    }

    resetGame() {
      this.enemyControll.removeAllEnemy();
      this.projectileControll.removeAllProjectile();
      this.target.resetPlayer();

      this.GUIController.resetGame();
    }
  
    update(timeInSeconds) {

      // Escape
      if (this.keys[27]) {
        this.GUIController.pauseGame();

        this.keys[27] = false;
      }

      if (this.GUIController.gameIsOver) {
        // Klawisz R
        if (this.keys[82]) {
          this.resetGame();
          this.keys[82] = false;
        }
      }
        
        if (this.target.loaded && !this.GUIController.paused) {
            this.updateLookAt();

            // Klawisz W
          if (this.keys[87]) {
            this.target.moveUp(timeInSeconds);
            this.target.direction = 'up';
          }
          // Klawisz S
          if (this.keys[83]) {
            this.target.moveDown(timeInSeconds);
            this.target.direction = 'down';
          }
          // Klawisz D
          if (this.keys[68]) {
            this.target.moveRight(timeInSeconds);
            this.target.direction = 'right';
          }
          // Klawisz A
          if (this.keys[65]) {
            this.target.moveLeft(timeInSeconds);
            this.target.direction = 'left';
          }
          // Lewy przycisk myszy
          if (this.current.leftButton) {
            this.target.shoot();
          }
      }
    }
        
  };