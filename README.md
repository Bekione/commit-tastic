# <img src="images/icon.png" width="32" height="32" alt="CommitTastic Icon"> CommitTastic

CommitTastic is a VS Code extension that automates the git commit process by generating meaningful commit messages for each changed file using Cursor AI.

## Features

- 🔄 Automatically stages and commits changes
- 📝 Generates AI-powered commit messages for each file
- 🚀 Optional auto-push after commits
- 🎯 Choose between batch commits or individual file commits

## Requirements

- VS Code 1.93.0 or higher
- [Cursor Editor](https://cursor.sh/) must be installed and running
- Git repository initialized in your workspace

## Installation

1. Download the `.vsix` file from the releases
2. Open VS Code
3. Press `Ctrl/Cmd + Shift + P`
4. Type "Install from VSIX" and select the downloaded file

## Usage

1. Make changes to your files
2. Either:
   - Press `Alt + G` (keyboard shortcut)
   - Or press `Ctrl/Cmd + Shift + P` and type "Auto Commit Changes"
3. The extension will:
   - Loop through each changed file
   - Stage the file
   - Generate a commit message using Cursor AI
   - Create a commit
   - Push changes (if auto-push is enabled)

## Extension Settings

This extension contributes the following settings:

* `cursorAutoCommit.autoPush`: Enable/disable automatic push after commits
* `cursorAutoCommit.batchCommit`: Commit all files together instead of individually
* `cursorAutoCommit.useConventionalCommits`: Use conventional commit format

## Known Issues

- Requires Cursor Editor to be running for commit message generation
- May need to wait a few seconds for commit message generation

## Release Notes

### 0.0.1

Initial release of CommitTastic:
- Individual file commits with AI-generated messages
- Batch commit option
- Auto-push functionality

## Author

Bereket Kinfe

## License

ISC

## Roadmap (v2.0.0)

### Planned Features
- ⚡ Performance Improvements
  - Faster commit message generation
  - Parallel processing for multiple files
  - Reduced waiting time between commits

- 🎨 Enhanced UI/UX
  - Progress bar for commit operations
  - Status bar integration
  - Custom notification system
  - Preview commit messages before applying

- 🛠 Advanced Configuration
  - Custom commit message templates
  - Branch-specific settings
  - Ignore patterns for files/folders
  - Custom AI prompt templates
  - Multiple repository support

- 🔍 Smart Features
  - Commit message validation
  - Conflict detection and resolution
  - Smart file grouping for related changes
  - Git hook integration
  - Commit history analysis

- 🔐 Security Features
  - Sensitive file detection
  - Credential leak prevention
  - Large file warnings

- 📊 Statistics & Analytics
  - Commit history visualization
  - Activity reports
  - Time saved metrics

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Issues

If you encounter any problems or have feature suggestions, please:
1. Check if the issue already exists in our [Issues](https://github.com/bekione/commit-tastic/issues) page
2. If not, create a new issue with:
   - Clear description of the problem/suggestion
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Your environment details (VS Code version, OS, etc.)

## License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.