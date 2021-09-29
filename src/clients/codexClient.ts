const OpenAI = require('openai-api');
const { encode, decode } = require('gpt-3-encoder')
import { QuickPickItem } from 'vscode';
import * as dotenv from "dotenv";

dotenv.config({ path: `${__dirname}/../.env` });

// Load your key from an environment variable or secret management service
// (do not include your key directly in your code)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI(OPENAI_API_KEY);

export class CodexClient {
    /*
        Gets the previous code of the file as context and the natural language query as input
        Returns the codex generated code snippet 
    */
        static async getCodeSnippets(context, query) {
            const converted_query = "\"\"\"" + query + "\"\"\""
            const prompt =
                "# Python 3 \n" + 
                context +
                "\n\n //" +
                converted_query + 
                "\n"
    
            const gptResponse = await openai.complete({
                engine: 'davinci-codex',
                prompt,
                max_tokens: 120,
                temperature: 0.1,
                topP: 1,
                n: 3,
                bestOf: 4,
                frequency_penalty: 0,
                presence_penalty: 0,
                stop: ["\n\n"]
            });

            const codeSnippetTexts = gptResponse.data.choices.map(choice => choice.text)
            const codeSnippetItems = codeSnippetTexts.map(text => new CodexItem(text))
    
            return codeSnippetItems
        }
}

export class CodexItem implements QuickPickItem {

    label: string;

    constructor(public title: string) {
        this.label = title
    }
}
