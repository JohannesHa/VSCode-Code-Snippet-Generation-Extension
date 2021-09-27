import axios from 'axios';
import { QuickPickItem } from 'vscode';
import { BingSearchClient } from './bingClient';
import { repair_program_io } from '../data_processing/code_processing';
const cheerio = require('cheerio');

export class StackoverflowClient {
    static async sendData(query) {
        const hostUrl = "https://api.stackexchange.com/2.2/questions/"
        const params = {
            order: "desc",
            sort: "votes",
            pagesize: "10",
            filter: "withbody",
            site: "stackoverflow"
        };

        const { qIds, postTitles } = await BingSearchClient.getQuestionIDsAndTitles(query)
        const joinedQids = qIds.join(";")

        let response = await axios.get(hostUrl + joinedQids + "/answers", { params: params })

        return {
            response,
            postTitles
        }
    }

    static async getCandidates(query: string) {
        try {
            const results = await this.sendData(query);
            console.log("results of getCandidates: ", results)
            const answers = results.response.data.items.map(item => item.body)
            console.log("answers: ", answers)
            const answersTop5 = answers.slice(0, 5);
            const answers_DOM = answersTop5.map(answer => {
                return cheerio.load(answer);
            })
            console.log("answers_DOM: ", answers_DOM)
            const codeSnippetStrings = answers_DOM.map(answer => answer("code", "pre").text())

            console.log("unprocessed code snippets: ", codeSnippetStrings)

            // clean code snippets
            const processedCodeSnippetStrings = codeSnippetStrings.map(snippet => repair_program_io(snippet))

            console.log("processed code snippets: ", processedCodeSnippetStrings)

            let stackoverflowItems = []

            for (var i = 0; i < processedCodeSnippetStrings.length; i++) {
                stackoverflowItems.push(
                    new StackoverflowItem(results.postTitles[i], processedCodeSnippetStrings[i])
                )
            }

            return stackoverflowItems

        } catch (e) {
            console.log("Error: ", e)
            throw e
        }
    }
}


export class StackoverflowItem implements QuickPickItem {

    label: string;
    description = '';
    detail: string;

    constructor(public title: string, public codesnippet: string) {
        this.label = title
        this.detail = codesnippet
    }
}
