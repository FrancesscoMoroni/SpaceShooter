import * as THREE from 'https://cdn.skypack.dev/three@0.136';

/*
Pocisk wystrzeliwany przez postać gracza.
Jako aktywny kolider sprawdzam, czy wszedł z interakcje z innymi obiektami, takimi jak:
- przeciwnik, wtedy pocisk zostaje zniszczony wraz z przeciwnikiem, a gracz otrzymuje 10 punktów,
- ścianą, wtedy tylko pocisk zostaje zniszony. 
Znisczenie pocisku polega na usunięcie go ze sceny oraz z tablicy pocisków i kolizji w kontrolerach ( kontroler pocisków oraz kontroler kolizji). 
*/
export class Projectile {

    constructor(quaternion, position, scene, colisionController, projectileController) {
        this.initialize(quaternion, position, scene, colisionController, projectileController);
    }

    initialize(quaternion, position, scene, colisionController, projectileController) {
        this.speed = 40;
        this.scene = scene;
        this.colisionController = colisionController;
        this.projectileController = projectileController;
        this.model = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 4), new THREE.MeshBasicMaterial({
            color: "aqua"
        }));
        this.model.quaternion.copy(quaternion);
        this.model.position.copy(position);
        this.collider = new THREE.Box3().setFromObject(this.model);
    }

    update(timeElapsedS) {
        this.model.translateZ(this.speed*timeElapsedS);
        this.collider.setFromObject(this.model);
    }

    destroy() {
        this.colisionController.removeActiveCollision(this);
        this.projectileController.removeProjectile(this);
        this.scene.remove(this.model);
    }

    checkCollision(object) {
        if(this.collider.intersectsBox(object.collider)) {
            if (object.type == 'wall') {
                this.destroy();  
            }
            if (object.type == 'enemy') {
                this.destroy();
                object.destroy();  
            }
        }
    }
    
}