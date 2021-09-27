const OpenAI = require('openai-api');
const { encode, decode } = require('gpt-3-encoder')
import { QuickPickItem } from 'vscode';
import * as dotenv from "dotenv";

dotenv.config({ path: `${__dirname}/../.env` });

// Load your key from an environment variable or secret management service
// (do not include your key directly in your code)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI(OPENAI_API_KEY);

export class GPT3Client {
    /*
        Gets the previous code of the file as context and the natural language query as input
        Returns the gpt-3 generated code snippet 
    */
        static async getCodeSnippets(context, query) {

            const promptContext = `CoPilot is chatbot that helps software developers write code. It takes a natural language intent NLI and answers in the Python programming language.\n\nProgram:\nfile_to_download=\"sales_of_january.csv\"\nNLI:\nRead the data of the csv file\nCoPilot:\nimport pandas as pd\ndata = pd.read_csv(file_to_download)\n\nProgram:\nfruits = [\"apple\", \"banana\", \"cherry\"]\nnew_fruit = \"mango\"\nNLI:\nAppend new fruit to list of fruits\nCoPilot:\nfruits.append(new_fruit)\n\nProgram:\nconst hostUrl = \"http://localhost:8081/parse/conala\"\nconst parameters = {\n\tq: query\n};\nNLI:\nMake a get request with parameters\nCoPilot:\nrequests.get(hostUrl, params=parameters)\n\nProgram:\nconst params = {\n\tq: query\n};\nconst randomUrl = \"https://example.com\"\nNLI:\nMake a get request with parameters\nCoPilot:\nimport requests\nrequests.get(randomUrl, params=parameters)\n\nProgram:\ncsvFile = \"./data.csv\"\nNLI:\nRead the data of the csv file\nCoPilot:\nimport pandas as pd\ndata = pd.read_csv(csvFile)\n\nProgram:\nd1 = {'a': 1, 'b': 2}\nd2 = {'b': 10, 'c': 11}\nNLI: \nMerge two dictionaries\nCoPilot:\nz = d1 | d2\n\nProgram:\nprompt_for_email = \"Please enter your email\"\nNLI: \nRequest user input from command line\nCoPilot:\ntext = input(prompt_for_email)\n\nProgram:\nfile_to_open = \"earnings_Q2_20.xlsm\"\nNLI:\nCheck if file exists\nCoPilot:\nimport os.path\nos.path.isfile(file_to_open)\n\nProgram:\ncolors = ['red', 'blue', 'green']\nfavoriteColor = 'red'\nNLI:\nGet last item of list\nCoPilot:\ncolors[-1]\n\nProgram:\nnew_list = list()\nNLI:\nCheck if list is empty\nCoPilot:\nif len(new_list) == 0:\n    print('the list is empty')\n\nProgram:\nold_list = [1,2,3,4,5,6]\nNLI:\nClone list\nCoPilot:\nnew_list = old_list[:]\n\nProgram:\nlist1 = [23,65,23,75,23]\nlist2 = [245,95,122,1,98]\nNLI:\nSum elements in two lists\nCoPilot:\nsum_of_lists = [x+y for x,y in zip(list1, list2)]\n\nProgram:\ncars = [\"Ford\", \"Volvo\", \"BMW\"]\nNLI:\nSort list\nCoPilot:\ncars.sort()\n\nProgram:\nmy_list = [1,1,3,5,5]\nNLI:\nFind duplicate in list\nCoPilot:\nduplicates = [x for x in my_list if x in my_list]\n\nProgram:\nname = \"Mamma\"\nNLI:\nCheck if palindrome\nCoPilot:\npalindrome = name == name[::-1]\n\nProgram:\npath_to_zip_file = \"./User/name/test.zip\"\nNLI:\nUnzip file\nCoPilot:\nimport zipfile\nzip_file = zipfile.ZipFile(path_to_zip_file)\n\n`;
            const prompt =
                promptContext +
                "Program:\n" +
                context +
                "NLI:\n" +
                query +
                "CoPilot:\n";
    
            const gptResponse = await openai.complete({
                engine: 'curie',
                prompt,
                max_tokens: 64,
                temperature: 0.1,
                topP: 1,
                n: 3,
                bestOf: 4,
                frequency_penalty: 0,
                presence_penalty: 0,
                stop: ["\n\n"]
            });

            const codeSnippetTexts = gptResponse.data.choices.map(choice => choice.text)
            const codeSnippetItems = codeSnippetTexts.map(text => new GPT3Item(text))

            console.log("codeSnippets ", codeSnippetItems)
    
            return codeSnippetItems
        }

    /*
        Just uses the GPT-3 model to contextualise the retrieved code snippets
        Gets the previous code of the file as context and the result code snippet
        Returns the contextualised code snippet 
    */
    static async getContextualisedCodeSnippets(context, codeSnippet) {

        const promptContext = `Replace variables in Python Code Snippet (Unprocessed) with the context of the Program:\n\nProgram:\nfile_to_download=\"sales_of_january.csv\"\nUnprocessed:\nimport pandas as pd\ndata = pd.read_csv('https://example.com/passkey=wedsmdjsjmdd')\nProcessed:\nimport pandas as pd\ndata = pd.read_csv(file_to_download)\n\nProgram:\nfruits = [\"apple\", \"banana\", \"cherry\"]\nnew_fruit = \"mango\"\nUnprocessed:\nlist.append(2)\nProcessed:\nfruits.append(new_fruit)\n\nProgram:\nhostUrl = \"http://localhost:8081/parse/conala\"\nparameters = {\n	q: query\n};\nUnprocessed:\nrequests.get(url, params=params)\nProcessed:\nrequests.get(hostUrl, params=parameters)\n\nProgram:\nparams = {\n	q: query\n};\nrandomUrl = \"https://example.com\"\nUnprocessed:\nrequests.get(url, params=parameters)\nProcessed:\nrequests.get(randomUrl, params=parameters)\n\nProgram:\nd1 = {'a': 1, 'b': 2}\nd2 = {'b': 10, 'c': 11}\nUnprocessed:\nz = x | y\nProcessed:\nz = d1 | d2\n\nProgram:\nprompt_for_email = \"Please enter your email\"\nUnprocessed:\ntext = input(\"prompt\")\nProcessed:\ntext = input(prompt_for_email)\n\nProgram:\nfile_to_open = \"earnings_Q2_20.xlsm\" \nUnprocessed:\nimport os.path\nos.path.isfile(fname)\nProcessed:\nimport os.path\nos.path.isfile(file_to_open)\n\nProgram:\ncolors = ['red', 'blue', 'green']\nfavoriteColor = 'red'\nUnprocessed:\nlist[-1]\nProcessed:\ncolors[-1]\n\nProgram:\nnew_list = list()\nUnprocessed:\nif len(li) == 0:\n    print('the list is empty')\nProcessed:\nif len(new_list) == 0:\n    print('the list is empty')\n\nProgram:\nold_list = [1,2,3,4,5,6]\nUnprocessed:\nlst2=lst1[:]\nProcessed:\nnew_list = old_list[:]\n\nProgram:\nlist1 = [23,65,23,75,23]\nlist2 = [245,95,122,1,98]\nUnprocessed:\nc = [x+y for x,y in zip(a, b)]\nProcessed:\nsum_of_lists = [x+y for x,y in zip(list1, list2)]\n\nProgram:\ncars = [\"Ford\", \"Volvo\", \"BMW\"]\nUnprocessed:\nmylist.sort()\nProcessed:\ncars.sort()\n\n`;
        const prompt =
            promptContext +
            "Program:\n" +
            context +
            "Unprocessed:\n" +
            codeSnippet +
            "Processed:\n";

        // Set max number of generated tokens to the token amount of the code snippet + some extra buffer
        // GPT - 3 uses Byte - Pair - Encoding to encode the input
        const encodedCodeSnippet = encode(codeSnippet)
        const buffer = 20 // buffer of 20 tokens if the context replaces parts with longer text
        const maxTokens = encodedCodeSnippet.length + buffer

        const gptResponse = await openai.complete({
            engine: 'curie',
            prompt,
            max_tokens: maxTokens,
            temperature: 0.1,
            topP: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: ["\n\n"]
        });

        const contextualisedCodeSnippet = gptResponse.data.choices[0].text

        return contextualisedCodeSnippet
    }
}

export class GPT3Item implements QuickPickItem {

    label: string;

    constructor(public title: string) {
        this.label = title
    }
}
