/*
Kontroler pocisków, którego zadaniem jest aktualizowanie istniejących pozycji pocisków na planszy.
*/
export class ProjectileController {
    constructor() {
      this.initialize();    
    }
  
    initialize() {
        this.projectiles = [];
    }

    update(timeElapsedS) {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            this.projectiles[i].update(timeElapsedS);
        }
    }

    addProjectile(projectile) {
        this.projectiles.push(projectile);
    }

    removeProjectile(projectile) {
        let projectileIndex = this.projectiles.indexOf(projectile);
        this.projectiles.splice(projectileIndex,1);
    }

    removeAllProjectile() {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            this.projectiles[i].destroy();
        }
    }
        
  };