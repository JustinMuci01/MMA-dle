class Fighter{
    constructor(name, ranking, wins, losses, draws, weightClass, country, pic)
    {
        this.name = name;
        this.ranking = ranking;
        this.wins = wins;
        this.losses = losses;
        this.draws = draws;
        this.weightClass = weightClass;
        this.country = country;
        this.pic = pic;
        
    }

    DisplayInfo()
    {
        console.log(`${this.ranking === 0 ? 'C': '#' + this.ranking} ${this.name} from ${this.country}: ${this.wins}-${this.losses}-${this.draws}`)
    }

}

export default Fighter;