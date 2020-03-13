"use strict";
class Turret extends Phaser.GameObjects.Image
{
    constructor(scene, x, y)
    {
        super(scene, x, y, "cannon");

        this.name = "e";
        this.cost = 100;
        this.nextTic = 0;
        this.sellPrice = this.cost / 2;

        this.setOrigin(-.5);
        this.setInteractive();
        this.setDisplaySize(32, 32);

        this.on("pointerover", () => { console.log(this.name) })
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
