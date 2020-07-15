var os = require('os');
var vscode = require('vscode');
var copypaste = require('copy-paste');
var path = require('path');

var sb = null;

function onStatusBarUpdate() {
    const rootPath = vscode.workspace.rootPath;
    if (!rootPath) {
        sb.text = '';
        sb.hide();
        return;
    }
    const homedir = typeof os.homedir === 'function' && os.homedir();
    const display = homedir ? rootPath.replace(homedir, '~') : rootPath;

    sb.tooltip = 'Copy workspace root path to clipboard';
    sb.text = display;
    sb.show();
}

function createStatusBar() {
    const sb = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, -1);
    sb.text = '';
    sb.command = 'extension.workspacePathStatusBarClicked';
    return sb;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    var config = vscode.workspace.getConfiguration('workspace-path-status-bar');
    if (config.enable) {
        sb = createStatusBar();
        vscode.workspace.onDidChangeConfiguration( onStatusBarUpdate );
        onStatusBarUpdate();

        context.subscriptions.push(sb);
    }

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var disposable = vscode.commands.registerCommand('extension.workspacePathStatusBarClicked', function () {
        copypaste.copy(sb.text)
    });
    context.subscriptions.push(disposable);

}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
