class Tile extends Phaser.GameObjects.Image
{
    constructor(scene, x, y, type)
    {
        if(type == "player")
        {
            super(scene, x, y, "playerTile");
        }
        else
        {
            super(scene, x, y, "enemyTile");
        }

        this.setOrigin(0);
        this.setDisplaySize(64, 64);
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

                if(player.money - turret.cost >= 0)
                {
                    // doesn't look good. may need sprite for mouseover...
                    this.setTint(0xaaaaaa);
                }
                else
                {
                    this.setTint(0xff0000);
                }
            }
        });

        this.on("pointerdown", () =>
        {
            if(player.getSelectedTower() != undefined)
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
