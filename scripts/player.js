class Player
{
    constructor()
    {
        this.hp = 30;
        this.kills = 0;
        this.money = 500;
    }

    increaseHPBy(num)
    {
        this.hp += num;
    }

    decreaseHPBy(num)
    {
        this.hp -= num;
    }
}
