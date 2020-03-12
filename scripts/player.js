class Player
{
    constructor()
    {
        this.hp = 30;
        this.kills = 0;
        this.money = 500;
        this.selectedTower = undefined;
    }

    increaseHPBy(num)
    {
        this.hp += num;
    }

    decreaseHPBy(num)
    {
        this.hp -= num;
    }

    incrementKills()
    {
        this.kills++;
    }

    increaseMoneyBy(num)
    {
        this.money += num;
    }

    decreaseMoneyBy(num)
    {
        this.money -= num;
    }

    setSelectedTower(name = undefined)
    {
        this.selectedTower = name;
    }

    getSelectedTower()
    {
        return this.selectedTower;
    }
}
