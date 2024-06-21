import * as THREE from 'https://cdn.skypack.dev/three@0.136';

/*
Podłoże sceny.
*/
export class Plane {

    constructor(x, y, z, width, height, material) {
        this.mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(width, height, 10, 10),
            new THREE.MeshStandardMaterial({map: material}));
        this.mesh.position.set(x,y,z);
        this.mesh.castShadow = false;
        this.mesh.receiveShadow = true;
        this.mesh.rotation.x = -Math.PI / 2;
    }
}