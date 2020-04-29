import superagent from 'superagent'

// tags的组成
interface Tag {
    title: string,
    desc: string,
    totalQuesNum: number,
    todayQuesNum: number,
    weekQuesNum: number
}

class Crowller {
    private url = 'https://stackoverflow.com/tags'

    async getRawHtml() {
        const result = await superagent.get(this.url)
        console.log(result);
    }

    constructor() {
        this.getRawHtml()
    }
}

const crowller = new Crowller()