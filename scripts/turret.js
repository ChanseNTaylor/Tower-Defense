"use strict";
class Turret extends Phaser.GameObjects.Image
{
    constructor(scene, x, y, name)
    {
        super(scene, x, y, name);

        this.cost = 100;
        this.nextTic = 0;
        this.radius = 100;
        this.sellPrice = this.cost / 2;

        this.radiusGraphics = scene.add.graphics(
        {
            fillStyle: { color: 0xbbbbbb, alpha: 0.5 },
            lineStyle: { width: 1, color: 0xbbbbbb, alpha: 0.8 }
        });

        this.setOrigin(-.5);
        this.setInteractive();
        this.setDisplaySize(32, 32);

        // make a method to toggle the circle?
        this.on("pointerover", () =>
        {
            const x = this.x + 32;
            const y = this.y + 32;
            const circle = new Phaser.Geom.Circle(x, y, this.radius);

            this.radiusGraphics.fillCircleShape(circle);
            this.radiusGraphics.strokeCircleShape(circle);
        });

        this.on("pointerout", () => this.radiusGraphics.clear());
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
        const enemy = this.getEnemy(this.x + 32, this.y + 32, this.radius);

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

class CannonTurret extends Turret
{
    constructor(scene, x, y)
    {
        super(scene, x, y, "cannon");

        this.cost = 150;
        this.nextTic = 0;
        this.radius = 100;
        this.name = "cannon";
        this.sellPrice = this.cost / 2;

        this.setTexture(this.name);

        this.setOrigin(-.5);
        this.setInteractive();
        this.setDisplaySize(32, 32);

        console.log(this)

        this.setActive(true)
    }
}

class RocketTurret extends Turret
{
    constructor(scene, x, y)
    {
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
