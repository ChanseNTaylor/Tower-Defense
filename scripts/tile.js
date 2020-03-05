class Tile extends Phaser.GameObjects.Image
{
    constructor(scene, x, y, type)
    {
        if(type == "player")
        {
            super(scene, x, y, "playertile");
        }
        else
        {
            super(scene, x, y, "enemytile");
        }

        this.setScale(2);
        this.setOrigin(0);
        this.setDepth(-1);
    }
}

class PlayerTile extends Tile
{
    constructor(scene, x, y)
    {
        super(scene, x, y, "player");

        this.occupied = false;

        this.setInteractive();

        this.on("pointerout", () => this.clearTint());
        this.on("pointerover", () =>
        {
            if(this.occupied == false)
            {
                const turret = new Turret(scene);

                // hovering tiles shows red when you don't have enough money
                if(player.money - turret.cost >= 0)
                {
                    this.setTint(0xff00ff);
                }
                else
                {
                    this.setTint(0xff0000);
                }
            }
        });

        this.on("pointerdown", () =>
        {
            if(this.occupied == false)
            {
                let turret = new Turret(scene);

                if(player.money - turret.cost >= 0)
                {
                    turret = turrets.get();

                    player.money -= turret.cost;

                    if(turret)
                    {
                        turret.setActive(true);
                        turret.setVisible(true);
                        turret.setPosition(this.x, this.y);
                    }

                    if(this.isTinted)
                    {
                        this.clearTint();
                    }

                    this.occupied = true;
                }
                else
                {
                    console.log("Not Enough Money!");
                }
            }
        });
    }
}

class EnemyTile extends Tile
{
    constructor(scene, x, y)
    {
        super(scene, x, y, "enemy");
    }
}
