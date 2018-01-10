import * as vscode from 'vscode';
import { getConfiguration } from './configuration';
import { outputChannel } from './extension';

import * as os from 'os';

let installsDeclinedTools: string[] = [];

let tools = {
    'terraform': {
        'latest': '0.10.8',
        '0.10.8': {
            'win32-x64': 'https://releases.hashicorp.com/terraform/0.10.8/terraform_0.10.8_windows_amd64.zip',
            'win32-x32': 'https://releases.hashicorp.com/terraform/0.10.8/terraform_0.10.8_windows_386.zip',
            'darwin-x64': 'https://releases.hashicorp.com/terraform/0.10.8/terraform_0.10.8_darwin_amd64.zip',
            'linux-x64': 'https://releases.hashicorp.com/terraform/0.10.8/terraform_0.10.8_linux_amd64.zip',
            'linux-x32': 'https://releases.hashicorp.com/terraform/0.10.8/terraform_0.10.8_linux_386.zip'
        },
        '0.10.7': {
            'win32-x64': 'https://releases.hashicorp.com/terraform/0.10.7/terraform_0.10.7_windows_amd64.zip',
            'win32-x32': 'https://releases.hashicorp.com/terraform/0.10.7/terraform_0.10.7_windows_386.zip',
            'darwin-x64': 'https://releases.hashicorp.com/terraform/0.10.7/terraform_0.10.7_darwin_amd64.zip',
            'linux-x64': 'https://releases.hashicorp.com/terraform/0.10.7/terraform_0.10.7_linux_amd64.zip',
            'linux-x32': 'https://releases.hashicorp.com/terraform/0.10.7/terraform_0.10.7_linux_386.zip'
        }
    },
    'terraform-index': {
        'latest': '0.0.2',
        '0.0.2': {
            'linux-x64': 'https://github.com/mauve/terraform-index/releases/download/0.0.2/terraform-index-0.0.2-linux-amd64.zip',
            'darwin-x64': 'https://github.com/mauve/terraform-index/releases/download/0.0.2/terraform-index-0.0.2-macos-amd64.zip',
            'win32-x64': 'https://github.com/mauve/terraform-index/releases/download/0.0.2/terraform-index-0.0.2-windows-amd64.zip'
        }
    },
    'tflint': {
        'latest': '0.5.1',
        '0.5.1': {
            'linux-x64': 'https://github.com/wata727/tflint/releases/download/v0.5.1/tflint_linux_amd64.zip',
            'darwin-x64': 'https://github.com/wata727/tflint/releases/download/v0.5.1/tflint_darwin_amd64.zip',
            'win32-x64': 'https://github.com/wata727/tflint/releases/download/v0.5.1/tflint_windows_amd64.zip'
        }
    }
};

export function pickToolDownloadUrl(tool: string, platform: string, arch: string, version: string): string | null {
    let toolDescription = tools[tool];
    if (toolDescription === undefined) {
        return null;
    }

    let pickedVersion = version === "latest" ? toolDescription.latest : version;
    return toolDescription[pickedVersion][`${platform}-${arch}`];
}

export function installTool(tool: string, version: string): Thenable<boolean> {
    outputChannel.show();
    outputChannel.appendLine(`tool: Installing tool ${tool} version ${version}.`);

    if (getConfiguration().installRoot === null) {
        outputChannel.appendLine("tool: terraform.installRoot not specified, aborting.");
        return vscode.window.showInformationMessage(`You need to specify an install root, please specify terraform.installRoot.`,
                "Open User settings",
                "Open Workspace settings").then(selected => {
            if (selected === "Open User settings") {
                vscode.commands.executeCommand('workbench.action.openGlobalSettings');
            } else if (selected === "Open Workspace settings") {
                vscode.commands.executeCommand('workbench.action.openWorkspaceSettings');
            }
        }).then(() => false);
    }

    let url = pickToolDownloadUrl(tool, os.platform(), os.arch(), version);
    if (url === null) {
        outputChannel.appendLine(`tool: No download url for ${tool} ${version} ${os.platform()} ${os.arch()}.`);
        return Promise.resolve(false);
    }
}

export function promptForMissingTool(tool: string) {
    // user has declined, do not prompt
    if (installsDeclinedTools.indexOf(tool) > -1) {
        return;
    }

    vscode.window.showInformationMessage(`The "${tool} command is not available. Install?`, "Install").then(selected => {
        if (selected === "Install") {
            installTool(tool);
        } else {
            installsDeclinedTools.push(tool);
        }
    });
}