import * as vscode from 'vscode';

// Define a type for the git repository to avoid 'any'
type GitRepository = {
  add: (files: string[]) => Promise<void>;
  commit: (message: string) => Promise<void>;
  push: () => Promise<void>;
  state: {
    workingTreeChanges: Array<{ uri: vscode.Uri }>;
    indexChanges: Array<{ uri: vscode.Uri }>;
    untrackedChanges: Array<{ uri: vscode.Uri }>;
  };
  inputBox: { value: string };
};

async function getGitRepository(): Promise<GitRepository> {
  const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
  if (!gitExtension) {
    throw new Error('Git extension not found');
  }
  const api = gitExtension.getAPI(1);
  const repositories = api.repositories;

  if (repositories.length === 0) {
    throw new Error('No git repository found');
  }

  return repositories[0];
}

async function stageAllChanges(repository: GitRepository): Promise<boolean> {
  try {
    await repository.add([]); // Empty array means all changes
    return true;
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to stage changes: ${error}`);
    return false;
  }
}

async function generateCommitMessage(repository: GitRepository): Promise<string> {
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
    return 'feat: automatic commit';
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to generate commit message: ${error}`);
    return 'feat: automatic commit';
  }
}

async function commitChanges(repository: GitRepository, message: string) {
  try {
    await repository.commit(message);
    return true;
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to commit: ${error}`);
    return false;
  }
}

async function pushChanges(repository: GitRepository) {
  try {
    await repository.push();
    return true;
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to push: ${error}`);
    return false;
  }
}

async function generateCommitMessageForFile(repository: GitRepository, fileUri: vscode.Uri): Promise<string> {
  try {
    // Stage the single file
    await stageFile(repository, fileUri);

    // Clear any existing message
    repository.inputBox.value = '';

    // Use Cursor's command
    await vscode.commands.executeCommand('cursor.generateGitCommitMessage');

    // Wait for message generation
    let message = '';
    let attempts = 0;
    while (attempts < 10) {
      message = repository.inputBox.value;
      if (message && message !== 'feat: automatic commit') {
        return message;
      }
      await new Promise(resolve => setTimeout(resolve, 500));
      attempts++;
    }

    // Fallback with more descriptive message
    const fileName = fileUri.fsPath.split('/').pop();
    return `update: changes in ${fileName}`;
  } catch (error) {
    const fileName = fileUri.fsPath.split('/').pop();
    return `update: changes in ${fileName}`;
  }
}

async function stageFile(repository: GitRepository, fileUri: vscode.Uri) {
  try {
    await repository.add([fileUri.fsPath]);
    return true;
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to stage ${fileUri.fsPath}: ${error}`);
    return false;
  }
}

async function getChangedFiles(repository: GitRepository): Promise<vscode.Uri[]> {
  const state = repository.state;
  const changes = [
    ...state.workingTreeChanges,
    ...state.indexChanges,
    ...state.untrackedChanges
  ];
  return changes.map(change => change.uri);
}

export function activate(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand('autoCommit.execute', async () => {
    try {
      const repository = await getGitRepository();
      const config = vscode.workspace.getConfiguration('cursorAutoCommit');
      const autoPush = config.get<boolean>('autoPush', false);
      const batchCommit = config.get<boolean>('batchCommit', false);

      if (batchCommit) {
        // Original batch commit logic
        const success = await stageAllChanges(repository);
        if (success) {
          const message = await generateCommitMessage(repository);
          await commitChanges(repository, message);
        }
      } else {
        // New individual file commit logic
        const changedFiles = await getChangedFiles(repository);

        for (const fileUri of changedFiles) {
          // Stage individual file
          const stageSuccess = await stageFile(repository, fileUri);

          if (stageSuccess) {
            // Generate commit message for this specific file
            const message = await generateCommitMessageForFile(repository, fileUri);

            // Commit the file
            await commitChanges(repository, message);

            vscode.window.showInformationMessage(`Committed ${fileUri.fsPath}`);
          }
        }
      }

      // Push all commits if autoPush is enabled
      if (autoPush) {
        await pushChanges(repository);
        vscode.window.showInformationMessage('Changes pushed successfully!');
      }

    } catch (error) {
      vscode.window.showErrorMessage(`Error: ${error}`);
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate(): void {
  // Add a comment explaining why this function is empty
  // This function is required by VS Code extension API but not used in this extension
}
