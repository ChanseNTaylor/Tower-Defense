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

        this.setInteractive();

        // make method to toggle the circle
        this.on("pointerover", () =>
        {
            const x = this.x;
            const y = this.y;
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
            if(enemyUnits[i].active)
            {
                const thing = Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y);

                if(thing <= this.radius)
                {
                    return enemyUnits[i];
                }
            }
        }
        return false;
    }

    fire()
    {
        const enemy = this.getEnemy(this.x, this.y, this.radius);

        if(enemy)
        {
            let angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);

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
        this.radius = 125;
        this.name = "cannon";
        this.sellPrice = this.cost / 2;

        this.setTexture(this.name);

        this.setInteractive();

        this.setActive(true);
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
