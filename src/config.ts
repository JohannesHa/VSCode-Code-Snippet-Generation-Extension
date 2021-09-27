import * as vscode from 'vscode';

type IConfig = {
    settings: {
        codeGenerationModelChoice: string
    }
}

export function getConfig() {
    const config = vscode.workspace.getConfiguration("stackoverflowcodegenerator");

    return {
        settings: {
            codeGenerationModelChoice: config.settings.codeGenerationModelChoice
        }
    } as IConfig;
}