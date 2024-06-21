import * as THREE from 'https://cdn.skypack.dev/three@0.136';

/*
Przeszkoda w kształcie prostokąta.
*/
export class Wall {

    constructor(x, y, z, width, height, depth, material) {
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            material);
        this.mesh.position.set(x, y, z);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.collider = new THREE.Box3();
        this.collider.setFromObject(this.mesh);
        this.type = 'wall';
    }

}