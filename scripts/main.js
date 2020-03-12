"use strict";
let path;
let tiles;
let enemies;
let turrets;
let bullets;

let hpText;
let moneyText;

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
}

class StatsContainer extends Phaser.GameObjects.Container
{
    constructor(scene, x, y)
    {
        super(scene, x, y);

        this.hpText = scene.add.text(0, 0);
        this.moneyText = scene.add.text(0, 16);
    }

    preUpdate(time, delta)
    {
        this.hpText.setText(`Health: ${player.hp}`);
        this.moneyText.setText(`Money: ${player.money}`);
    }
}

class ShopContainer extends Phaser.GameObjects.Container
{
    constructor(scene, x, y)
    {
        super(scene, x, y);

        this.add(scene.add.text(0, 0, "Shop"));
        this.add(new ShopButton(scene, this, 32, 32, "basic"));
        this.add(new ShopButton(scene, this, 32, 80, "super"));
        this.add(new ShopButton(scene, this, 32, 128, "mega"));
        this.add(new ShopButton(scene, this, 32, 176, "ultra"));
        this.add(new ShopButton(scene, this, 32, 224, "golder"));
    }
}

class ShopButton extends Phaser.GameObjects.Image
{
    constructor(scene, parent, x, y, item)
    {
        super(scene, x, y, item);

        this.name = item;
        this.parent = parent;
        this.selected = false;

        this.setOrigin(0);
        this.setInteractive();

        this.on("pointerout", () => { this.clearTint(); });
        this.on("pointerover", () =>
        {
            if(!this.selected)
            {
                this.setTint(0xff0000);
            }
        });
        this.on("pointerdown", () =>
        {
            if(!this.selected)
            {
                this.selected = true;
            }
            else
            {
                this.selected = false;
                player.setSelectedTower();
            }
        });
    }
}

class Turret extends Phaser.GameObjects.Image
{
    constructor(scene, x, y)
    {
        super(scene, x, y, "sprites");

        this.cost = 100;
        this.nextTic = 0;

        this.setOrigin(-.5);
    }

    addBullet(x, y, angle)
    {
        const bullet = bullets.get();

        if(bullet)
        {
            bullet.fire(x, y, angle);
        }
    }

    getEnemy(x, y, distance)
    {
        const enemyUnits = enemies.getChildren();

        for(let i = 0; i < enemyUnits.length; i++)
        {
            if(enemyUnits[i].active && Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) <= distance)
            {
                return enemyUnits[i];
            }
        }
        return false;
    }

    fire()
    {
        const enemy = this.getEnemy(this.x, this.y, 100);

        if(enemy)
        {
            const angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);

            this.addBullet(this.x, this.y, angle);
        }
    }

    update(time, delta)
    {
        if(time > this.nextTic)
        {
            this.fire();
            this.nextTic = time + 1000;
        }
    }
}

class Bullet extends Phaser.GameObjects.Image
{
    constructor(scene, x, y)
    {
        super(scene, x, y, "bullet");

        this.dx = 0;
        this.dy = 0;
        this.lifespan = 0;
        this.speed = Phaser.Math.GetSpeed(600, 1);

        this.setOrigin(-0.5);
    }

    fire(x, y, angle)
    {
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);

        this.dx = Math.cos(angle);
        this.dy = Math.sin(angle);

        this.lifespan = 300;
    }

    update(time, delta)
    {
        this.lifespan -= delta;

        this.x += this.dx * (this.speed * delta);
        this.y += this.dy * (this.speed * delta);

        if(this.lifespan <= 0)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}

function create()
{
    let pathPoints;
    const gameHeight = game.config.height;
    const playableWidth = game.config.width - SIDEBAR_WIDTH;
    const sidebar = this.add.container(playableWidth + 16, 0);
    const statsContainer = new StatsContainer(this, 0, gameHeight - 64);
    const shopContainer = new ShopContainer(this, 0, gameHeight * 0.25);
    const graphics = this.add.graphics().lineStyle(3, 0xffffff, 1);

    sidebar.add(statsContainer);
    sidebar.add(shopContainer);

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

    // add the tiles group too!
    turrets = this.add.group({ classType: Turret, runChildUpdate: true });

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


    if (time > this.nextEnemy)
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
