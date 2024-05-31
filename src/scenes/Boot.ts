import { Scene } from 'phaser';




export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('background', 'assets/bg.png');
        this.load.spritesheet({
            key: 'test',
            url: 'assets/tileset_71.png',
            frameConfig: { frameWidth: 24, frameHeight: 24 }
        });
        this.load.spritesheet({
            key: 'player-idle',
            url: 'assets/0700-Idle-Anim.png',
            frameConfig: { frameWidth: 32, frameHeight: 48 }
        });
        this.load.spritesheet({
            key: 'player-walk',
            url: 'assets/0700-Walk-Anim.png',
            frameConfig: { frameWidth: 32, frameHeight: 48 }
        });
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
