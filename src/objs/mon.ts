/**
 * This file contains the class that defines everyone Pokemon on the field, whether it be a player's or an opponent's.
 * 
 */

export default abstract class Pokemon extends Phaser.GameObjects.Container {
    constructor(scene, x, y, sprite) {
        super(scene, x, y);
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.init();
    }

    init() {
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        
    }
}