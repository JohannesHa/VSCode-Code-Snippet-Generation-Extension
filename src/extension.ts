// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { GPT3Client, GPT3Item } from './clients/gpt3Client';
import { CodexClient, CodexItem } from './clients/codexClient';
import { StackoverflowClient, StackoverflowItem } from './clients/stackoverflowClient';
import { TranXClient, TranXItem } from './clients/tranXClient';
import Utils from './helpers/utils';
import { getConfig } from "./config";

const options = {
	includeScore: true,
	keys: ['title']
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "stackoverflowcodegenerator" is now active!');

	interface CustomInlineCompletionItem extends vscode.InlineCompletionItem {
		trackingId: string;
	}

	const provider: vscode.InlineCompletionItemProvider<CustomInlineCompletionItem> = {
		provideInlineCompletionItems: async (document, position, context, token) => {
			const textBeforeCursor = document.getText(
				new vscode.Range(position.with(undefined, 0), position)
			);

			let searchPhrase = Utils.matchPhrase(textBeforeCursor);

			if (searchPhrase) {
				let rs;

				try {
					rs = await getCodeSnippetResults(searchPhrase.replace("//", ""))
				} catch (err) {
					vscode.window.showErrorMessage(err.toString());
					return { items: [] };
				}

				if (rs == null) {
					return { items: [] };
				}

				const items = new Array<CustomInlineCompletionItem>();

				rs.forEach((item, i) => {
					let output;
					const newLine = "\n"
					if (item instanceof TranXItem || item instanceof GPT3Item|| item instanceof CodexItem) {
						output = newLine + item.label
					}
					else {
						output = " " + item.label + newLine + item.detail
					}

					items.push({
						text: output,
						range: new vscode.Range(position.translate(0, output.length), position),
						trackingId: `snippet-${i}`,
					});
				});
				return { items };
			}
			return { items: [] };
		},
	};

	vscode.languages.registerInlineCompletionItemProvider({ pattern: "**" }, provider);


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('stackoverflowcodegenerator.helloWorld', async () => {

		const query = await startEditorToSearchForQuestion();
		const editor = vscode.window.activeTextEditor;

		if (!query || !editor) {
			return;
		}
		
		const results = await getCodeSnippetResults(query)

		if (results.length > 0) {

			const selectedAnswer = await vscode.window.showQuickPick<vscode.QuickPickItem>(results);

			if (selectedAnswer) {
				if (selectedAnswer instanceof TranXItem || selectedAnswer instanceof GPT3Item|| selectedAnswer instanceof CodexItem) {
					editor.insertSnippet(new vscode.SnippetString(selectedAnswer.label));
				}
				else if (selectedAnswer instanceof StackoverflowItem){
					editor.insertSnippet(new vscode.SnippetString(selectedAnswer.detail));
				}
			}
		}
		else {
			vscode.window.showErrorMessage('No results found for this search 🤷‍♂️');
		}

	});

	context.subscriptions.push(disposable);
}


async function getCodeSnippetResults(query) {
	// check which code generation plugin mode is activated
	let results;
	const config = getConfig();
	const currentPluginMode = config.settings.codeGenerationModelChoice
	switch (currentPluginMode) {
		case "Standard Code Generation/Retrieval Model":
			results = await getDefaultCodeRetrievalAndGenerationResults(query)
			break
		case "Contextualisation using GPT-3":
			const default_results = await getDefaultCodeRetrievalAndGenerationResults(query)
			const contextualised_results = await getGPT3ContextualisedResults(default_results)
			results = contextualised_results
			break
		case "GPT-3 for Code Generation":
			results = await getGPT3CodeGenerationResults(query)
			break
		case "Codex for Code Generation":
			results = await getCodexCodeGenerationResults(query)
			break
		default:
			results = await getDefaultCodeRetrievalAndGenerationResults(query)
			break
	}
	return results
}

async function getDefaultCodeRetrievalAndGenerationResults(query: string) {

	const tranx_results = await TranXClient.getCandidates(query)
	const stackoverflowsearch_results = await StackoverflowClient.getCandidates(query)
	const all_results = tranx_results.concat(stackoverflowsearch_results)

	return all_results
}

function getContext() {
	// current editor
	const editor = vscode.window.activeTextEditor;

	let doc = editor.document;
	let docContent = doc.getText();

	// check if there is no selection
	if (editor.selection.isEmpty) {
		// make code snippets contextualised with the help of GPT-3
		const position = editor.selection.active;
		const linePosition = position.line

		const contextOfLast5LinesOfCode = Utils.getLastNLinesOfFromCurrentPosition(docContent, linePosition, 5)

		return contextOfLast5LinesOfCode
	}
	return ""
}

async function getGPT3ContextualisedResults(results) {
	const contextOfLast5LinesOfCode = getContext()

	const contextualisedResults = async () => {
		return Promise.all(results.map(async (item) => {
			if (item instanceof TranXItem || item instanceof GPT3Item) {
				item.label = await GPT3Client.getContextualisedCodeSnippets(contextOfLast5LinesOfCode, item.title);
			}
			else {
				item.detail = await GPT3Client.getContextualisedCodeSnippets(contextOfLast5LinesOfCode, item.detail);
			}
			return item
		}))
	}

	const contextualised_results = await contextualisedResults()
	return contextualised_results

}

async function getGPT3CodeGenerationResults(query) {
	const contextOfLast5LinesOfCode = getContext()
	const results = await GPT3Client.getCodeSnippets(contextOfLast5LinesOfCode, query);
	return results
}

async function getCodexCodeGenerationResults(query) {
	const contextOfLast5LinesOfCode = getContext()
	const results = await CodexClient.getCodeSnippets(contextOfLast5LinesOfCode, query);
	return results
}


async function startEditorToSearchForQuestion() {
	if (!vscode.window.activeTextEditor) {
		vscode.window.showErrorMessage('You have to be in an active editor window to use this command.');
		return;
	}

	return await vscode.window.showInputBox({
		placeHolder: 'Type your "How-to"-Question',
	});
}
// this method is called when your extension is deactivated
export function deactivate() { }
