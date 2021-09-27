import axios from 'axios';
import { QuickPickItem } from 'vscode';
import https from "https";

export class TranXClient {
    static async sendData(query) {
        const ec2Ip = "http://35.158.210.62:8081" // hosted external knowledge codegen on an ec2 machine
        const hostUrl = ec2Ip + "/parse/conala"
        const params = {
            q: query
        };

        let response = await axios.get(hostUrl, { params: params })

        return response
    }

    static async getCandidates(query: string) {
        try {
            const results = await this.sendData(query);

            let tranXResults = results.data.hypotheses

            let tranXResultsTop5 = tranXResults.slice(0, 5);

            console.log("tranXResultsTop5 ", tranXResultsTop5);

            let tranXItems = []

            tranXResultsTop5.forEach(item => {
                tranXItems.push(
                    new TranXItem(item.value)
                )
            });

            return tranXItems

        } catch (e) {
            console.log("Error: ", e)
            throw e
        }
    }
}

export class TranXItem implements QuickPickItem {

    label: string;

    constructor(public title: string) {
        this.label = title
    }
}
