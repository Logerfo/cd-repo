// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.cd', cd));
}

var lastActiveTerminal: vscode.Terminal;
async function cd(args) {
    //https://github.com/Microsoft/vscode-extension-samples/blob/master/terminal-sample/src/extension.ts
    //(<any>vscode.window).onDidChangeActiveTerminal(e => lastActiveTerminal = e);
    const configuration: string = vscode.workspace.getConfiguration("cd", args._fsPath).get('terminal', "LastActive");
    let terminal: vscode.Terminal;
    switch (configuration) {
        case "AlwaysCreate":
            terminal = vscode.window.createTerminal();
            break;

        case "First":
            terminal = vscode.window.terminals.length > 0 ? vscode.window.terminals[0] : vscode.window.createTerminal();
            break;

        case "Last":
            terminal = vscode.window.terminals.length > 0 ? vscode.window.terminals[vscode.window.terminals.length - 1] : vscode.window.createTerminal();
            break;

        case "LastActive":
            terminal = lastActiveTerminal ? lastActiveTerminal : vscode.window.createTerminal();
            break;
    }
    terminal.show();
    terminal.sendText("cd ");
}

// this method is called when your extension is deactivated
export function deactivate() {
}
