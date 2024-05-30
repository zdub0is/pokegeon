import { Scene, GameObjects } from 'phaser';
import { GenerateDungeon, Dungeon, FloorProperties, CreateMapString, Tile, HiddenStairsType, DungeonObjectiveType, FloorLayout, DungeonGenerationInfo, FloorGenerationStatus, GenerationStepLevel, GenerationType } from 'dungeon-mystery'
import { renderGrid } from '../utils/backgroundRender';
export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    dungeonMap: Tile[][];
    dungeonData: Dungeon;
    dungenInfo: DungeonGenerationInfo;
    constructor ()
    {
        super('MainMenu');
        let floor_props = new FloorProperties();
floor_props.layout = FloorLayout.LAYOUT_LARGE;
floor_props.room_density = 5;
floor_props.floor_connectivity = 15;
floor_props.enemy_density = 4;
floor_props.kecleon_shop_chance = 0;
floor_props.monster_house_chance = 0;
floor_props.maze_room_chance = 0;
floor_props.allow_dead_ends = false;
floor_props.room_flags.f_secondary_terrain_generation = true;
floor_props.room_flags.f_room_imperfections = false;
floor_props.item_density = 1;
floor_props.trap_density = 3;
floor_props.num_extra_hallways = 5;
floor_props.buried_item_density = 0;
floor_props.secondary_terrain_density = 0;
floor_props.itemless_monster_house_chance = 0;
floor_props.hidden_stairs_type = HiddenStairsType.HIDDEN_STAIRS_NONE;
floor_props.hidden_stairs_spawn_chance = 0;

let dungeon = new Dungeon();
dungeon.id = 1;
dungeon.floor = 1;
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
    }

    create ()
    {


        // Loop through list tiles and create boxes.
        // #454545 = wall
        // #FAEBD7 = floor
        // #FF0000 = player
        // #0000FF = stairs
        // #FFD700 = item
        // #FF4500 = monster
        // #800080 = trap
        // #00FF00 = kecleon
        // #FF69B4 = hidden stairs
        // #00FFFF = secondary terrain
        console.log(CreateMapString(this.dungeonMap))
        let gridResult = renderGrid(this.dungeonMap);
        console.log(gridResult.map((row) => 
            row.map((cell) => cell.toString().padStart(3, '0')).join(' ')
        ).join('\n'));
        // for(let i = 1; i <= 144; i++) {
        //     // render spritesheet, 18 per line
        //     this.add.image(i % 18 * 24 + 120, (24 * Math.ceil(i/18)), 'test', i-1);

        // }
        for (let i = 0; i < gridResult.length; i++) {
            for (let j = 0; j < gridResult[i].length; j++) {
                // console.log(this.dungeonMap[i][j].terrain_flags.terrain_type, i, j, gridResult[i][j]);
                let offsetConst = this.dungeonMap[i][j].terrain_flags.terrain_type;
                let offsetFactor = offsetConst > 0 ? offsetConst == 2 ? 6 : 12 : 0;
                this.add.image(i* 24 + 120, j * 24 + 70, 'test', gridResult[i][j] + offsetFactor );
            }
        }


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
                this.add.rectangle(x * 24 + 120, y * 24 + 70, 24, 24, parseInt(color.replace('#', '0x')), 0.5)
                // this.add.text(x * 24 + 120, y * 24 + 70, `${y}, ${x}`, { fontFamily: 'Arial', fontSize: '8px', color: '#000000', fontStyle: 'bold' }).setOrigin(0.5);
            });
        });
        

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }
}
