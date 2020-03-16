"use strict";
let path;
let tiles;
let enemies;
let turrets;
let bullets;
let sidebar;

const player = new Player();

const BULLET_DAMAGE = 25;
const SIDEBAR_WIDTH = 128;

const game = new Phaser.Game(
{
    width: 640,
    height: 512,
    pixelArt: true,
    type: Phaser.AUTO,
    physics: { default: "arcade" },
    scene: { preload, create, update }
});

function preload()
{
    this.load.image("enemy", "images/enemy.png");
    this.load.image("cannon", "images/cannon.png");
    this.load.image("rocket", "images/rocket.png");
    this.load.image("enemyTile", "images/enemytile.png");
    this.load.image("playerTile", "images/playertile.png");
    this.load.image("shopcannon", "images/shopcannon.png");
    this.load.image("shoprocket", "images/shoprocket.png");
}

function create()
{
    let pathPoints;
    const gameHeight = game.config.height;
    const playableWidth = game.config.width - SIDEBAR_WIDTH;
    const graphics = this.add.graphics().lineStyle(3, 0xffffff, 1);

    sidebar = this.add.existing(new Sidebar(this, playableWidth + 16, 0));

    path = this.add.path(96, -32);
    path.lineTo(96, 164);
    path.lineTo(416, 164);
    path.lineTo(416, 544);
    path.draw(graphics);

    pathPoints = path.getSpacedPoints();

    for(let aa = 0; aa < playableWidth / 64; aa++)
    {
        for(let bb = 0; bb < gameHeight; bb++)
        {
            let enemyTilePlaced = false;
            const tileX = aa * 64;
            const tileY = bb * 64;

            for(let cc = 0; cc < pathPoints.length; cc++)
            {
                const pointX = pathPoints[cc].x;
                const pointY = pathPoints[cc].y;

                if((pointX >= tileX && pointX <= tileX + 64) && (pointY >= tileY && pointY <= tileY + 64))
                {
                    this.add.existing(new EnemyTile(this, tileX, tileY));
                    enemyTilePlaced = true;
                    break;
                }
            }

            if(enemyTilePlaced == false)
            {
                this.add.existing(new PlayerTile(this, tileX, tileY));
            }
        }
    }

    this.nextEnemy = 0;

    turrets = this.add.group({ classType: CannonTurret, runChildUpdate: true });

    enemies = this.physics.add.group(
    {
        classType: Enemy,
        runChildUpdate: true
    });

    bullets = this.physics.add.group(
    {
        classType: Bullet,
        runChildUpdate: true
    });

    this.physics.add.overlap(enemies, bullets, damageEnemy);
}

function update(time, delta)
{
    sidebar.update();

    if(time > this.nextEnemy)
    {
        const enemy = enemies.get();

        if(enemy)
        {
            enemy.setActive(true);
            enemy.setVisible(true);

            enemy.startOnPath();

            this.nextEnemy = time + 2000;
        }
    }
}

function damageEnemy(enemy, bullet)
{
    if (enemy.active == true && bullet.active == true)
    {
        bullet.setActive(false);
        bullet.setVisible(false);

        enemy.receiveDamage(BULLET_DAMAGE);
    }
}
