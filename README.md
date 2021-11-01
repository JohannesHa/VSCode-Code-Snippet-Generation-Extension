# VSCode Extension Code Snippet Generator

This VSCode Extension provides a similar user experience to [Github CoPilot](https://copilot.github.com/) with the addition that you can select your preferred Code Generation Model.
Plug in any Code Generation model of your choice to receive Code Snippet Suggestions or use one of the provided models.

![Code Generation Get Request Demo](https://github.com/JohannesHa/VSCode-Code-Snippet-Generation-Extension/blob/master/media/code-generation-get-request-demo.gif?raw=true)

[Paper coming soon!]

### Currently supported Code Generation Models:
✅ A [Standard Code Generation Model](https://github.com/neulab/external-knowledge-codegen) + Code Retrieval Model based on Xing and StackOverflow Results

✅ As above + contextualizes the output according to the context of your code using GPT-3

✅ GPT-3 for Code Generation

✅ [Codex](https://openai.com/blog/openai-codex/)

⬜️ [GPT-J](https://github.com/kingoflolz/mesh-transformer-jax) for Code Generation

⬜️ Custom Code Generation Model Configuration

All of those models only support Python at the moment, but some of them are quite easy to expand to other programming languages. Feel free to send a PR! 🙌

🚨 Since this repository uses a proposed API (inline-completion), the extension can't be packaged and installed on VSCode yet and can only be used for Extension Development inside of VSCode Insiders.

## Installation
- If you don't have it yet, download [VSCode Insiders](https://code.visualstudio.com/insiders/)
- Git clone the repo: `git clone https://github.com/JohannesHa/VSCode-Code-Snippet-Generation-Extension`
- Run `yarn` inside the repository
- Open the repo in VSCode Insiders (e.g. via `code-insiders .`) 
- Copy the `.env.example` file and create a `.env` file. Replace the variables in this file with your access keys.
- Click on `Run Extension` on the top left. This will open a new VSCode window where the extension is installed.

## How to use

There are two options to request code suggestions from the extension:

**1. Quick Pick Search**

- Start VSCode Quick Pick via `CMD+SHIFT+P`
- Type in: `Ask "How-to"-Question` and click Enter
- Type in your Natural Language Intent and click Enter
- Choose one of the results of the Code Generation Model and it will be pasted in your code.

![Extension Option 1 Demo](https://github.com/JohannesHa/VSCode-Code-Snippet-Generation-Extension/blob/master/media/extension-option-1.gif?raw=true)

**2. Inline Code Suggestions**

- To trigger the inline code completion, you have to type `//{your natural language intent}.` (start with `//` and end with `.`)
- Example:

```
//read a csv file.
```

![Extension Option 2 Demo](https://github.com/JohannesHa/VSCode-Code-Snippet-Generation-Extension/blob/master/media/extension-option-2.gif?raw=true)

## Additional Configurations

### Keyboard Shortcuts
To enable the keyboard shortcuts for the inline suggestions, go to `Code - Insiders > Preferences > Keyboard Shortcuts` and type in `inlinesuggest`. Change the settings there to the following:
![code-suggestion-keyboard-shortcut-settings](https://github.com/JohannesHa/VSCode-Code-Snippet-Generation-Extension/blob/master/media/code-suggestion-keyboard-shortcut-settings.png?raw=true)



