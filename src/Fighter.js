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

// let f = new Fighter('Ilia Topuria', 1, 1, 1, 1, 'Lw', 'Spain', 'picurl')
// f.DisplayInfo()

    const options = {
        method: 'GET',
        headers:{
            fighter: 'Ilia Topuria'
        },
    }
    const url = 'http://127.0.0.1:8000/names'

    const fetchPromise = fetch(url)

    fetchPromise.then((response) => {

    let jsonPromise = response.json()
    
    jsonPromise.then( (data) =>{
        console.log(data)
    });

    });
export default Fighter;