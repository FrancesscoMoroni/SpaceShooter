import * as THREE from 'https://cdn.skypack.dev/three@0.136';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { Vector3 } from 'three';

import { Projectile } from './Projectile';

/*
Postać gracza. 
Znajdują się tu wszystkie parametry i akcje, które wykonuje postać gracza oraz jest tu też ładowany jego model.
Jako aktywny kontroler, postać gracza sprawdza czy weszła w interakcje z obiektami, takimi jak:
- ściana, wtedy model gracza jest cofany w z kierunku, z którego podążał 
(doprowadza to w niekótrych przypadkach do małego błędu, gdzie gracz przechodzi przez ścianę),
- przeciwnik, wtedy przeciwnik zostaje zniszczony, a gracz traci jeden punk życia 
(utrata wszystkich powoduje zakończenie gry)
*/
export class Player {
    
    constructor(scene, controls, camera, projectileController, colisionController, enemyController, GUIController) {
        this.initialize(scene, controls, camera, projectileController, colisionController, enemyController, GUIController);
        this.loadModel();
    }

    initialize(scene, controls, camera, projectileController, colisionController, enemyController, GUIController) {
        this.speed = 20;
        this.health = 3;
        this.canShoot = true;
        this.scene = scene;
        this.controls = controls;
        this.loaded = false;
        this.FBXLoader = new FBXLoader();
        this.collider = new THREE.Box3();
        this.previousPosition;
        this.direction = null;
        this.camera = camera;
        this.colisionController = colisionController;
        this.projectileController = projectileController;
        this.enemyController = enemyController;
        this.GUIController = GUIController;
    }

    loadModel() {
        this.FBXLoader.load('/resources/models/SpaceShip.fbx',
        (object) => {
            object.scale.set(.002, .002, .002);
            object.position.set(0, 0, 0);
            this.model = object;
            this.loaded = true;
            this.collider.setFromObject(object);
            this.controls.target = this;
            this.enemyController.player = this;
            this.scene.add(object);
        })
    }

    checkCollision(object) {
        if (this.collider.intersectsBox(object.collider)) {
            if (object.type == 'wall') {
                this.moveBack();
            }

            if (object.type == 'enemy') {
                this.loseHealth();
                object.destroy(true);
            }
        }
    }

    moveBack() {
        switch (this.direction) {
            case 'up':
                this.model.position.add(new Vector3(0,0,1));
                this.camera.position.add(new Vector3(0,0,1));
                break;
            case 'down':
                this.model.position.add(new Vector3(0,0,-1));
                this.camera.position.add(new Vector3(0,0,-1));
                break;
            case 'right':
                this.model.position.add(new Vector3(-1,0,0));
                this.camera.position.add(new Vector3(-1,0,0));
                break;
            case 'left':
                this.model.position.add(new Vector3(1,0,0));
                this.camera.position.add(new Vector3(1,0,0));
                break;
        }

        this.moveColider();
    }

    moveColider() {
        this.collider.setFromObject(this.model);
    }

    moveRight(timeInSeconds) {
        this.model.position.add(new Vector3(this.speed * timeInSeconds,0,0));
        this.camera.position.add(new Vector3(this.speed * timeInSeconds,0,0));
        this.moveColider();   
    }

    moveLeft(timeInSeconds) {
        this.model.position.add(new Vector3(-this.speed * timeInSeconds,0,0));
        this.camera.position.add(new Vector3(-this.speed * timeInSeconds,0,0));
        this.moveColider(); 
    }
    
    moveDown(timeInSeconds) {
        this.model.position.add(new Vector3(0,0,this.speed * timeInSeconds));
        this.camera.position.add(new Vector3(0,0,this.speed * timeInSeconds));
        this.moveColider();
    }
    
    moveUp(timeInSeconds) {
        this.model.position.add(new Vector3(0,0,-this.speed * timeInSeconds));
        this.camera.position.add(new Vector3(0,0,-this.speed * timeInSeconds));
        this.moveColider(); 
    }

    shoot() {
        if (this.canShoot) {
            let bulletQuaterion = this.model.quaternion;
            let bulletPosition = this.model.position;
    
            let projectile = new Projectile(bulletQuaterion, bulletPosition, this.scene, this.colisionController, this.projectileController);
            
            this.scene.add(projectile.model);
            this.projectileController.addProjectile(projectile);
            this.colisionController.addActiveCollision(projectile);
            this.canShoot = false;
            setTimeout(() => {this.canShoot = true}, 500);    
        }
    }

    lookAt(object) {
        this.model.lookAt(object);
    }

    loseHealth() {
        if (this.health > 1) {
            this.health -= 1;
            this.GUIController.substractHeatlh();
        } else {
            this.GUIController.substractHeatlh();
            this.GUIController.gameOver();
        }
    }

    resetPlayer() {
        this.model.position.set(0,0,0);
        this.camera.position.set(0, 40, 0);
        this.health = 3;
        this.GUIController.resetHealth();
    }
    

}