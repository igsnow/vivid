import fs from 'fs'
import path from 'path'
import superagent from 'superagent'
import cheerio from 'cheerio'

// Tags的组成
interface Tag {
    title: string;
    desc: string;
    totalNum: string;
    todayNum: string;
    weekNum: string;
}

interface TagResult {
    time: number;
    data: Tag[];
}

interface Content {
    [propName: number]: Tag[]
}

class View {
    private url = 'https://stackoverflow.com/tags'

    constructor() {
        this.init()
    }

    async init() {
        const filePath = path.resolve(__dirname, '../data/tag.json')
        const html = await this.getTargetHtml()
        const tagInfo = this.getTagsInfo(html)
        const fileContent = this.generateJsonContent(tagInfo)
        fs.writeFileSync(filePath, JSON.stringify(fileContent))
    }

    async getTargetHtml() {
        const result = await superagent.get(this.url)
        return result.text
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
        return {
            time: Date.now(),
            data: tagInfos
        }
    }

    generateJsonContent(tagInfo: TagResult) {
        const filePath = path.resolve(__dirname, '../data/tag.json')
        let fileContent: Content = {}
        if (fs.existsSync(filePath)) {
            fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        }
        fileContent[tagInfo.time] = tagInfo.data
        return fileContent
    }

}

new View()