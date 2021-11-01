import axios from 'axios';
import * as dotenv from "dotenv";

dotenv.config({ path: `${__dirname}/../.env` });

export class BingSearchClient {
    static bingWebSearch(query): Promise<any> {

        const hostUrl: string = "https://api.bing.microsoft.com/v7.0/search?q=";
        const subscriptionKey: string = process.env.BING_SUBSCRIPTION_KEY;
        const python_extra_term: string = "Python ";
        const stackoverflow_extra_term: string = " site:stackoverflow.com";

        let response = axios.get(hostUrl + encodeURIComponent(python_extra_term + query + stackoverflow_extra_term), {
            headers: {
                'Ocp-Apim-Subscription-Key': subscriptionKey
            },
        })

        return response

    }

    static async getQuestionIDsAndTitles(buf: string) {
        try {
            let results = await this.bingWebSearch(buf);
            let links = results.data.webPages.value.map(value => value["url"])
            let qIds = []

            links.forEach(link => {
                if (link.includes("stackoverflow.com/questions/")) {
                    qIds.push(link.split("/")[4])
                }
            });

            const urlTitles = results.data.webPages.value.map(value => value["name"])
            const postTitles = []
            urlTitles.forEach(title => {
                if (title.includes(" - Stack Overflow")) {
                    postTitles.push(title.split(" - Stack Overflow")[0])
                } else {
                    postTitles.push(title)
                }
            });

            return {
                qIds,
                postTitles
            }

        } catch (e) {
            console.log("Error: ", e)
            throw e
        }
    }
}