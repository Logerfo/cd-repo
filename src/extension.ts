import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('cd-repo.cd', cd));
    context.subscriptions.push(vscode.commands.registerCommand('cd-repo.pull', pull));
    context.subscriptions.push(vscode.commands.registerCommand('cd-repo.push', push));
}

function getTerminal(config) {
    const terminalType: string = config.get('terminal', "AlwaysCreate");
    switch (terminalType) {
        case "AlwaysCreate": return vscode.window.createTerminal();

        case "First": return vscode.window.terminals.length > 0 ? vscode.window.terminals[0] : vscode.window.createTerminal();

        case "Last": return vscode.window.terminals.length > 0 ? vscode.window.terminals[vscode.window.terminals.length - 1] : vscode.window.createTerminal();

        case "Active": return vscode.window.activeTerminal ? vscode.window.activeTerminal : vscode.window.createTerminal();

        default: vscode.window.showErrorMessage(`${terminalType} is not a valid terminal option.`);
    }
}

function send(terminal: vscode.Terminal, text: string) {
    terminal.show();
    terminal.sendText(text);
}

async function cd(args) {
    const config = vscode.workspace.getConfiguration("cd-repo", args._fsPath);
    const command = config.get('command', 'cd');
    let terminal: vscode.Terminal = getTerminal(config);
    if (terminal) {
        send(terminal, `${command} "${(<any>args).rootUri.fsPath}"`);
    }
}

async function pull(args) {
    await cd(args);
    const config = vscode.workspace.getConfiguration("cd-repo", args._fsPath);
    let terminal: vscode.Terminal = getTerminal(config);
    const pullArgs = config.get('pullArgs', '');
    if (terminal) {
        send(terminal, `git pull ${pullArgs}`);
    }
}

async function push(args) {
    await cd(args);
    const config = vscode.workspace.getConfiguration("cd-repo", args._fsPath);
    let terminal: vscode.Terminal = getTerminal(config);
    const pushArgs = config.get('pushArgs', '');
    if (terminal) {
        send(terminal, `git push ${pushArgs}`);
    }
}

export function deactivate() {
}
