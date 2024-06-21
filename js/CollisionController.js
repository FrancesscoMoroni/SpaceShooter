/*
Kontroler kolizji: Jego zadaniem jest sprawdzanie kolizji obiektów z każdym krokiem aplikacji.
Kolizje są podzielone na dwa typy: aktyne oraz passywne.
- Aktywne kolizje, to takie kolizje, które wchodzą w interakcje z innymi obiekatmi, ale nie ze sobą 
(wszystkie elementy związane z postacią gracza).
- Pasywne kolizje, to takie, które nie mają za zadanie wchodzić w interakcje z innymi obiektami
(ściany, przeciwnicy).
*/
export class CollisionController {

    constructor() {
        this.initialize();
    }

    initialize() {
        this.activeCollisions = [];
        this.passiveCollisions = [];
    }

    addActiveCollision(collision) {
        this.activeCollisions.push(collision);
    }

    addPassiveCollision(collision) {
        this.passiveCollisions.push(collision);
    }

    removeActiveCollision(collision) {
        let collisionIndex = this.activeCollisions.indexOf(collision);
        this.activeCollisions.splice(collisionIndex,1);
    }

    removePassiveCollision(collision) {
        let collisionIndex = this.passiveCollisions.indexOf(collision);
        this.passiveCollisions.splice(collisionIndex,1);
    }

    checkCollisions() {
        for (let i = this.activeCollisions.length - 1; i >= 0; i--) {
            for (let j = this.passiveCollisions.length - 1; j >= 0; j--) {
                if (!this.activeCollisions[i]) {
                    continue;
                }
                this.activeCollisions[i].checkCollision(this.passiveCollisions[j]);
            }
        }
    }

    update() {
        this.checkCollisions();
    }

}