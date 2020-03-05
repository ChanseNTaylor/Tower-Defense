class Enemy extends Phaser.GameObjects.Image
{
    constructor(scene)
    {
        super(scene, 0, 0, "sprites");

        this.hp = 100;
        this.speed = 1/10000;
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
    }

    startOnPath()
    {
       this.hp = 100;
       this.follower.t = 0;

       path.getPoint(this.follower.t, this.follower.vec);

       this.setPosition(this.follower.vec.x, this.follower.vec.y);
    }

    receiveDamage(damage)
    {
        this.hp -= damage;

        if(this.hp <= 0)
        {
            this.setActive(false);
            this.setVisible(false);

            player.money += 25;
        }
    }

    update(time, delta)
    {
        this.follower.t += this.speed * delta;

        path.getPoint(this.follower.t, this.follower.vec);

        this.setPosition(this.follower.vec.x, this.follower.vec.y);

        if(this.follower.t >= 1)
        {
            this.setActive(false);
            this.setVisible(false);

            player.decreaseHPBy(1);
        }
    }
}
