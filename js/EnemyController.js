import { Vector3 } from 'three';
import { Enemy } from './Enemy';

/*
Kontroler przeciwników, którego zadaniem jest aktualizowanie pozycji wszystkich istniejących przeciwników na planszy
oraz tworzenie kolejnych przeciwników w losowych miejscach obszaru gry.
Przeciwnicy są tworzeni co 5 sekund, jednakże czas ten jest zmiejszany o 1 sekundę (min 1 s) po zebraniu 100 punktów przez gracza.
*/
export class EnemyController {
    constructor(scene, collisionController, GUIController) {
      this.initialize(scene, collisionController, GUIController);    
    }
  
    initialize(scene, collisionController, GUIController) {
        this.player = null;
        this.canCreateEnemy = true;
        this.enemies = [];
        this.scene = scene;
        this.collisionController = collisionController;
        this.enemyModel = null;
        this.GUIController = GUIController;
        this.spawnRate = 5000;
        this.minSpawnWidth = -50;
        this.minSpawnHeight = -50;
        this.maxSpawnWidth = 50;
        this.maxSpawnHeight = 50;
        this.spawnPositon = new Vector3();
    }

    update(timeElapsedS) {
        this.createEnemy();
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            this.enemies[i].moveTowardPlayer(timeElapsedS);
        }
    }

    randomSpawnPoint() {
        let spawnX = Math.random() * (this.maxSpawnHeight - this.minSpawnHeight) + this.minSpawnHeight;
        let spawnZ = Math.random() * (this.maxSpawnWidth - this.minSpawnWidth) + this.minSpawnWidth;

        this.spawnPositon.copy(new Vector3(spawnX, 0.0, spawnZ));
    }

    createEnemy() {
        if (this.canCreateEnemy) {
            this.randomSpawnPoint();
            let newEnemy = new Enemy(this.scene, this.collisionController, this.player, this.enemyModel, this.GUIController, this, this.spawnPositon);
            this.enemies.push(newEnemy);
            this.canCreateEnemy = false;
            
            let actualSpawRate = this.spawnRate;
            if (this.GUIController.score < 410) {
                actualSpawRate -= Math.round(this.GUIController.score / 100) * 1000;
                console.log(actualSpawRate);
            }

            setTimeout(() => {this.canCreateEnemy = true}, actualSpawRate);
        }
    }

    removeEnemy(enemy) {
        let enemyIndex = this.enemies.indexOf(enemy);
        this.enemies.splice(enemyIndex,1);
    }

    removeAllEnemy() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            this.enemies[i].destroy(true);
        }
    }
        
  };