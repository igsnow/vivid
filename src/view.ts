import superagent from 'superagent'
import cheerio from 'cheerio'

// Tags的组成
interface Tag {
    title: string,
    desc: string,
    totalNum: string,
    todayNum: string,
    weekNum: string
}

class View {
    private url = 'https://stackoverflow.com/tags'

    constructor() {
        this.getTargetHtml()
    }

    async getTargetHtml() {
        const result = await superagent.get(this.url)
        this.getTagsInfo(result.text)
    }

    getTagsInfo(html: string) {
        const $ = cheerio.load(html)
        const tagItems = $('.s-card')
        const tagInfos: Tag[] = []
        tagItems.map((idx, ele) => {
            const title = $(ele).find('.post-tag').text()
            const desc = $(ele).find('.v-truncate4').text().trim()
            const totalNum = $(ele).find('.fc-black-300').children('div:first-child').text()
            const todayNum = $(ele).find('.fc-black-300').children('div:last-child').find('a:first-child').text()
            const weekNum = $(ele).find('.fc-black-300').children('div:last-child').find('a:last-child').text()
            tagInfos.push({title, desc, totalNum, todayNum, weekNum})
        })
        console.log(tagInfos);
    }


}

new View()