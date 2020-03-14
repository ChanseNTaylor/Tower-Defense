"use strict";
class Sidebar extends Phaser.GameObjects.Container
{
    constructor(scene, x, y)
    {
        super(scene, x, y);

        this.width = 128;
        this.padding = 8;
        this.height = game.config.height;

        this.shopContainer = new ShopContainer(scene, 0, 0 + this.padding);
        this.statsContainer = new StatsContainer(scene, 0, this.height - 64);

        this.add(this.shopContainer);
        this.add(this.statsContainer);
    }

    update()
    {
        this.statsContainer.update();
    }
}

class StatsContainer extends Phaser.GameObjects.Container
{
    constructor(scene, x, y)
    {
        super(scene, x, y);

        this.hpText = scene.add.text(0, 0);
        this.moneyText = scene.add.text(0, 16);

        this.add(this.hpText);
        this.add(this.moneyText);
    }

    update()
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

        this.setDataEnabled();

        this.add(new ShopButton(scene, this, 0, 32, "cannon"));
        this.add(new ShopButton(scene, this, 0, 80, "rocket"));
        this.add(new ShopButton(scene, this, 0, 128, "spreader"));
        this.add(new ShopButton(scene, this, 0, 176, "machine"));
        this.add(new ShopButton(scene, this, 0, 224, "golder"));
    }

    deselectAll()
    {
        this.iterate(button => button.setSelected(false));
    }

    clearTintAll()
    {
        this.iterate(button => button.clearTint());
    }
}

class ShopButton extends Phaser.GameObjects.Image
{
    constructor(scene, parent, x, y, item)
    {
        super(scene, x, y, `shop${item}`);

        this.name = item;
        this.parent = parent;
        this.selected = false;

        this.setOrigin(0);
        this.setInteractive();
        this.setDisplaySize(96, 32);

        this.on("pointerout", () =>
        {
            if(this.selected === false)
            {
                this.clearTint();
            }
        });
        this.on("pointerover", () =>
        {
            if(!this.selected)
            {
                this.setTint(0xaaaaaa);
            }
        });
        this.on("pointerdown", () =>
        {
            if(!this.selected)
            {
                parent.deselectAll();
                parent.clearTintAll();

                this.selected = true;
                this.setTint(0xffff00);
                player.setSelectedTower(this.name);
            }
            else
            {
                this.selected = false;
                player.setSelectedTower();
                this.setTint(0xaaaaaa);
            }
        });
    }

    setSelected(bool)
    {
        this.selected = bool;
    }
}
