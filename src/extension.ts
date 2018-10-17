import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    //proposed API
    //(<any>vscode.window).onDidChangeActiveTerminal(e => lastActiveTerminal = e);
    context.subscriptions.push(vscode.commands.registerCommand('extension.cd', cd));
}

//var lastActiveTerminal: vscode.Terminal;
async function cd(args) {
    const config = vscode.workspace.getConfiguration("cd-repo", args._fsPath);
    const terminalType: string = config.get('terminal', "AlwaysCreate");
    const command = config.get('command', 'cd');
    let terminal: vscode.Terminal;
    switch (terminalType) {
        case "AlwaysCreate":
            terminal = vscode.window.createTerminal();
            break;

        case "First":
            terminal = vscode.window.terminals.length > 0 ? vscode.window.terminals[0] : vscode.window.createTerminal();
            break;

        case "Last":
            terminal = vscode.window.terminals.length > 0 ? vscode.window.terminals[vscode.window.terminals.length - 1] : vscode.window.createTerminal();
            break;

        //case "LastActive":
        //    terminal = lastActiveTerminal ? lastActiveTerminal : vscode.window.createTerminal();
        //    break;

        default: vscode.window.showErrorMessage(`${terminalType} is not a valid terminal option.`);
    }
    terminal.show();
    terminal.sendText(`${command} "${(<any>args).rootUri.fsPath}"`);
}

export function deactivate() {
}
