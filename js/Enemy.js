import * as THREE from 'https://cdn.skypack.dev/three@0.136';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

/*
Podstawowy typ przeciwnika, którym zadaniem jest kierowanie się w stronę gracza.
Zniszczenie go polega na usuniecie go ze sceny oraz z tablicy przeciwników oraz kolizji (kontroler przeciwników oraz kolizji).
*/
export class Enemy {

    constructor(scene, collisionController, player, enemyModel, GUIController, enemyController, spawnPoint) {
        this.initialize(scene, collisionController, player, GUIController, enemyController, spawnPoint);
        this.setModel(enemyModel);
    }

    initialize(scene, collisionController, player, GUIController, enemyController, spawnPoint) {
        this.speed = 15;
        this.scene = scene;
        this.FBXLoader = new FBXLoader();
        this.collider = new THREE.Box3();
        this.collisionController = collisionController;
        this.player = player;
        this.type = 'enemy';
        this.GUIController = GUIController;
        this.enemyController = enemyController;
        this.spawnPoint = spawnPoint;
    }

    setModel(enemyModel) {
        this.model = enemyModel.clone();
        this.model.position.copy(this.spawnPoint);
        this.collider.setFromObject(this.model);
        this.scene.add(this.model);
        this.collisionController.addPassiveCollision(this);
    }

    destroy(hitPlayer) {
        this.collisionController.removePassiveCollision(this);
        this.enemyController.removeEnemy(this);
        this.scene.remove(this.model);
        if (!hitPlayer) {
            this.GUIController.addPoints();
        }
    }

    moveTowardPlayer(timeElapsedS) {
        this.model.lookAt(this.player.model.position);
        this.model.translateZ(this.speed*timeElapsedS);
        this.collider.setFromObject(this.model);
    }

    
}