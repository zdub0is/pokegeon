import { Scene, GameObjects } from 'phaser';
import { GenerateDungeon, Dungeon, FloorProperties, CreateMapString, Tile, HiddenStairsType, DungeonObjectiveType, FloorLayout, DungeonGenerationInfo, FloorGenerationStatus, GenerationStepLevel, GenerationType } from 'dungeon-mystery'
import { renderGrid, renderGridBitwise } from '../utils/backgroundRender';
const TILE_SIZE = 30;


export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    dungeonMap: Tile[][];
    dungeonData: Dungeon;
    dungenInfo: DungeonGenerationInfo;
    currX: number;
    currY: number;
    targetPosition: Phaser.Math.Vector2;
    moving: boolean;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    player: GameObjects.Sprite;
    facingDirection: string;

    constructor() {
        super('MainMenu');
        let floor_props = new FloorProperties();
        floor_props.layout = FloorLayout.LAYOUT_LARGE;
        floor_props.room_density = 7;
        floor_props.floor_connectivity = 16;
        floor_props.enemy_density = 4;
        floor_props.kecleon_shop_chance = 0;
        floor_props.monster_house_chance = 0;
        floor_props.maze_room_chance = 0;
        floor_props.allow_dead_ends = true;
        floor_props.room_flags.f_secondary_terrain_generation = true;
        floor_props.room_flags.f_room_imperfections = false;
        floor_props.item_density = 1;
        floor_props.trap_density = 3;
        floor_props.num_extra_hallways = 7;
        floor_props.buried_item_density = 0;
        floor_props.secondary_terrain_density = 3;
        floor_props.itemless_monster_house_chance = 0;
        floor_props.hidden_stairs_type = HiddenStairsType.HIDDEN_STAIRS_NONE;
        floor_props.hidden_stairs_spawn_chance = 0;

        let dungeon = new Dungeon();
        dungeon.id = 23;
        dungeon.floor = 4;
        dungeon.nonstory_flag = false;
        dungeon.dungeon_objective = DungeonObjectiveType.OBJECTIVE_STORY;
        this.dungeonMap = GenerateDungeon(floor_props, dungeon, undefined, undefined, (generation_step_level: GenerationStepLevel,
            generation_type: GenerationType,
            dungeon_data: Dungeon,
            dungeon_generation_info: DungeonGenerationInfo,
            floor_generation_status: FloorGenerationStatus,
            grid_cell_start_x: number[],
            grid_cell_start_y: number[]) => {

            this.dungeonData = dungeon_data;
            this.dungenInfo = dungeon_generation_info;
        }, GenerationStepLevel.GEN_STEP_COMPLETE
        )
        this.currX = 0;
        this.currY = 0;
        this.targetPosition = new Phaser.Math.Vector2(0, 0);
        this.moving = false;
        this.facingDirection = 's';
    }


    create() {
        this.events = new Phaser.Events.EventEmitter();
        let gridResult = renderGridBitwise(this.dungeonMap);

        for (let i = 0; i < gridResult.length; i++) {
            for (let j = 0; j < gridResult[i].length; j++) {
                // console.log(this.dungeonMap[i][j].terrain_flags.terrain_type, i, j, gridResult[i][j]);
                let offsetConst = this.dungeonMap[i][j].terrain_flags.terrain_type;
                let offsetFactor = offsetConst > 0 ? offsetConst == 2 ? 6 : 12 : 0;
                let sprite = this.add.image(i * 30 + 120, j * 30 + 70, 'test', gridResult[i][j] + offsetFactor);
                sprite.setScale(1.25)
            }
        }

        const sprites = this.add.group();

        this.input.keyboard.on('keydown', (event) => {
            if (event.key === 'Enter') {
                
        this.dungeonMap.forEach((tile, index) => {
            tile.forEach((t, i) => {
                let x = index
                let y = i
                let color = '#454545';
                if (t.spawn_or_visibility_flags.f_stairs) {
                    color = '#240115';
                } else if (t.spawn_or_visibility_flags.f_item) {
                    color = '#FFD700';
                } else if (t.spawn_or_visibility_flags.f_monster) {
                    color = '#A60067';
                } else if (t.spawn_or_visibility_flags.f_trap) {
                    color = '#800080';
                } else if (t.terrain_flags.f_in_kecleon_shop) {
                    color = '#00FF00';
                } else if (t.terrain_flags.terrain_type === 2) {
                    color = '#5C7AFF'
                } else if (t.terrain_flags.terrain_type === 1) {
                    color = '#9C8581';
                }

                if (this.dungenInfo.player_spawn_x === x && this.dungenInfo.player_spawn_y === y) {
                    color = '#8D0801';
                }
                this.add.rectangle(x * 30 + 120, y * 30 + 70, 30, 30, parseInt(color.replace('#', '0x')), 0.5).setStrokeStyle(1, 0x000000);
                // this.add.circle(x * 30 + 120, y * 30 + 70, 15, parseInt(color.replace('#', '0x')), 0.5).setStrokeStyle(1, 0x000000);
                this.add.text(x * 30 + 120, y * 30 + 70, `${y}, ${x}`, { fontFamily: 'Arial', fontSize: '8px', color: '#000000', fontStyle: 'bold' }).setOrigin(0.5);
            });
        });
    }
});

        //spritesheet goes vertical in S, SE, E, NE, N, NW, W, SW
        this.currX = this.dungenInfo.player_spawn_x;
        this.currY = this.dungenInfo.player_spawn_y;
        this.targetPosition = new Phaser.Math.Vector2(this.dungenInfo.player_spawn_x * 30 + 120, this.dungenInfo.player_spawn_y * 30 + 70);

        this.player = this.add.sprite(this.dungenInfo.player_spawn_x * 30 + 120, this.dungenInfo.player_spawn_y * 30 + 70, 'player-idle', 0);
        this.player.setOrigin(0.5);
        this.player.setScale(1.25);
        this.player.anims.create({
            key: 'idle-s',
            frames: this.anims.generateFrameNumbers('player-idle', { start: 0, end: 7 }),
            frameRate: 3,
            repeat: -1
        });
        this.player.anims.create({
            key: 'idle-se',
            frames: this.anims.generateFrameNumbers('player-idle', { start: 8, end: 15 }),
            repeat: -1
        });
        this.player.anims.create({
            key: 'idle-e',
            frames: this.anims.generateFrameNumbers('player-idle', { start: 16, end: 23 }),
            frameRate: 3,
            repeat: -1
        });
        this.player.anims.create({
            key: 'idle-ne',
            frames: this.anims.generateFrameNumbers('player-idle', { start: 24, end: 31 }),
            frameRate: 3,
            repeat: -1
        });
        this.player.anims.create({
            key: 'idle-n',
            frames: this.anims.generateFrameNumbers('player-idle', { start: 32, end: 39 }),
            frameRate: 3,
            repeat: -1
        });
        this.player.anims.create({
            key: 'idle-nw',
            frames: this.anims.generateFrameNumbers('player-idle', { start: 40, end: 47 }),
            frameRate: 3,
            repeat: -1
        });
        this.player.anims.create({
            key: 'idle-w',
            frames: this.anims.generateFrameNumbers('player-idle', { start: 48, end: 55 }),
            frameRate: 3,
            repeat: -1
        });
        this.player.anims.create({
            key: 'idle-sw',
            frames: this.anims.generateFrameNumbers('player-idle', { start: 56, end: 63 }),
            frameRate: 3,
            repeat: -1
        });
        this.player.anims.create({
            key: 'walk-s',
            frames: this.anims.generateFrameNumbers('player-walk', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });
        this.player.anims.create({
            key: 'walk-se',
            frames: this.anims.generateFrameNumbers('player-walk', { start: 4, end: 7 }),
            frameRate: 6,
            repeat: -1
        });
        this.player.anims.create({
            key: 'walk-e',
            frames: this.anims.generateFrameNumbers('player-walk', { start: 8, end: 11 }),
            frameRate: 6,
            repeat: -1
        });
        this.player.anims.create({
            key: 'walk-ne',
            frames: this.anims.generateFrameNumbers('player-walk', { start: 12, end: 15 }),
            frameRate: 6,
            repeat: -1
        });
        this.player.anims.create({
            key: 'walk-n',
            frames: this.anims.generateFrameNumbers('player-walk', { start: 16, end: 19 }),
            frameRate: 6,
            repeat: -1
        });
        this.player.anims.create({
            key: 'walk-nw',
            frames: this.anims.generateFrameNumbers('player-walk', { start: 20, end: 23 }),
            frameRate: 6,
            repeat: -1
        });
        this.player.anims.create({
            key: 'walk-w',
            frames: this.anims.generateFrameNumbers('player-walk', { start: 24, end: 27 }),
            frameRate: 6,
            repeat: -1
        });
        this.player.anims.create({
            key: 'walk-sw',
            frames: this.anims.generateFrameNumbers('player-walk', { start: 28, end: 31 }),
            frameRate: 6,
            repeat: -1
        });



        this.player.anims.play('idle-s');
        this.cursors = this.input.keyboard.createCursorKeys();






    }

    updateFacingDirection() {
        if (this.cursors.left.isDown && this.cursors.up.isDown) {
            this.facingDirection = 'nw';
        } else if (this.cursors.left.isDown && this.cursors.down.isDown) {
            this.facingDirection = 'sw';
        } else if (this.cursors.right.isDown && this.cursors.up.isDown) {
            this.facingDirection = 'ne';
        } else if (this.cursors.right.isDown && this.cursors.down.isDown) {
            this.facingDirection = 'se';
        } else if (this.cursors.left.isDown) {
            this.facingDirection = 'w';
        } else if (this.cursors.right.isDown) {
            this.facingDirection = 'e';
        } else if (this.cursors.up.isDown) {
            this.facingDirection = 'n';
        } else if (this.cursors.down.isDown) {
            this.facingDirection = 's';
        }
    }

    getNextPosition() {
        const nextPosition = new Phaser.Math.Vector2(this.player.x, this.player.y);
        switch (this.facingDirection) {
            case 'n':
                nextPosition.y -= TILE_SIZE;
                break;
            case 'ne':
                nextPosition.x += TILE_SIZE;
                nextPosition.y -= TILE_SIZE;
                break;
            case 'e':
                nextPosition.x += TILE_SIZE;
                break;
            case 'se':
                nextPosition.x += TILE_SIZE;
                nextPosition.y += TILE_SIZE;
                break;
            case 's':
                nextPosition.y += TILE_SIZE;
                break;
            case 'sw':
                nextPosition.x -= TILE_SIZE;
                nextPosition.y += TILE_SIZE;
                break;
            case 'w':
                nextPosition.x -= TILE_SIZE;
                break;
            case 'nw':
                nextPosition.x -= TILE_SIZE;
                nextPosition.y -= TILE_SIZE;
                break;
        }
    
        return nextPosition;
    }

    canMoveTo(position) {
        const tileX = Math.floor((position.x - 120) / TILE_SIZE)
        const tileY = Math.floor((position.y - 70) / TILE_SIZE)
        if (tileX < 0 || tileY >= this.dungeonMap[0].length || tileY < 0 || tileX >= this.dungeonMap.length) {
            return false;
        }
        return this.dungeonMap[tileX][tileY].terrain_flags?.terrain_type === 1 || false;
    }

    update(time, delta) {
        if (!this.moving && (this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown)) {
            this.updateFacingDirection();
            const nextDir = this.getNextPosition();
            
            if(this.canMoveTo(nextDir)) {
                this.targetPosition = nextDir;
                
                this.moving = true;
                this.player.play('walk-' + this.facingDirection, true);
            }
            else {
                this.player.play('idle-' + this.facingDirection, true);
            }
        }
        // Determine direction
        
        // normalize string to be in the cardinal directions
        
    
        // Smooth movement towards targetPosition
        if (this.moving) {
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.targetPosition.x, this.targetPosition.y);
            const speed = TILE_SIZE / (175 / delta); // Adjust speed here
    
            if (distance < speed) {
                this.player.x = this.targetPosition.x;
                this.player.y = this.targetPosition.y;
                this.moving = false;
                if (this.cursors.left.isUp && this.cursors.right.isUp && this.cursors.up.isUp && this.cursors.down.isUp) {
                    this.player.anims.play('idle-' + this.facingDirection, true);
                }
            
            } else {
                

                const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.targetPosition.x, this.targetPosition.y);
                this.player.x += Math.cos(angle) * speed;
                this.player.y += Math.sin(angle) * speed;
            }
        }
    }
}
