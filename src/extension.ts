import * as vscode from 'vscode';

interface CommitConfig {
    autoPush: boolean;
    useConventionalCommits: boolean;
    defaultType?: string;
    batchCommit: boolean; // Whether to commit all files together or separately
}

interface FileCommit {
    uri: vscode.Uri;
    message?: string;
}

async function getGitRepository() {
    const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
    if (!gitExtension) {
        throw new Error('Git extension not found');
    }
    const api = gitExtension.getAPI(1);
    const repositories = api.repositories;
    
    if (repositories.length === 0) {
        throw new Error('No git repository found');
    }
    
    return repositories[0]; // Since we're only handling single repo
}

async function stageAllChanges(repository: any) {
    try {
        await repository.add([]); // Empty array means all changes
        return true;
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to stage changes: ${error}`);
        return false;
    }
}

async function generateCommitMessage(repository: any): Promise<string> {
    try {
        // Stage changes first to ensure Cursor can analyze them
        await stageAllChanges(repository);
        
        // Use Cursor's command
        await vscode.commands.executeCommand('cursor.generateGitCommitMessage');
        
        // Wait longer for Cursor to generate the message
        await new Promise(resolve => setTimeout(resolve, 1500)); // Increased from 500ms
        
        // Get the SCM input box
        const scm = vscode.scm.inputBox;
        if (scm && scm.value) {
            return scm.value;
        }
        
        // If no message was generated, show an error
        vscode.window.showErrorMessage('Failed to generate commit message with Cursor AI. Make sure Cursor is running and try again.');
        return "feat: automatic commit";
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to generate commit message: ${error}`);
        return "feat: automatic commit";
    }
}

async function getGeneratedMessage(): Promise<string> {
    // Get the SCM input box from the first repository
    const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
    const repository = gitExtension.getAPI(1).repositories[0];
    
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
        const message = repository.inputBox.value;
        if (message) {
            return message;
        }
        await new Promise(resolve => setTimeout(resolve, 300));
        attempts++;
    }
    
    return "feat: automatic commit";
}

async function commitChanges(repository: any, message: string) {
    try {
        await repository.commit(message);
        return true;
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to commit: ${error}`);
        return false;
    }
}

async function pushChanges(repository: any) {
    try {
        await repository.push();
        return true;
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to push: ${error}`);
        return false;
    }
}

async function generateCommitMessageForFile(repository: any, fileUri: vscode.Uri): Promise<string> {
    try {
        // Stage the single file first (Cursor needs the file to be staged)
        await stageFile(repository, fileUri);
        
        // Use Cursor's command
        await vscode.commands.executeCommand('cursor.generateGitCommitMessage');
        
        return await getGeneratedMessage();
    } catch (error) {
        return `feat: update ${fileUri.fsPath.split('/').pop()}`;
    }
}

async function stageFile(repository: any, fileUri: vscode.Uri) {
    try {
        await repository.add([fileUri.fsPath]);
        return true;
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to stage ${fileUri.fsPath}: ${error}`);
        return false;
    }
}

async function getChangedFiles(repository: any): Promise<vscode.Uri[]> {
    const changes = await repository.diffWithHEAD();
    return changes.map((change: { uri: vscode.Uri }) => change.uri);
}

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('autoCommit.execute', async () => {
        try {
            const repository = await getGitRepository();
            const success = await stageAllChanges(repository);
            
            if (success) {
                const message = await generateCommitMessage(repository);
                await repository.commit(message);
                vscode.window.showInformationMessage('Changes committed successfully!');
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error}`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {} 