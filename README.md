# CommiTastic 🚀

CommiTastic is a Cursor extension that automates the Git commit process by leveraging Cursor's AI-powered commit message generation. It streamlines your workflow by automatically staging, generating messages, and committing changes.

## Features ✨

- **Automated Commit Process**: Stage, generate messages, and commit with a single command
- **AI-Powered Messages**: Utilizes Cursor's AI to generate meaningful commit messages
- **Flexible Commit Modes**: 
  - Batch mode: Commit all changes together
  - Individual mode: Commit files separately with unique messages
- **Auto-Push Support**: Optionally push changes automatically after committing
- **Progress Tracking**: Visual feedback for each step of the process

## Installation 📦

1. Clone this repository
2. Run `npm install`
3. Build the extension using `npm run compile`
4. Press F5 in VS Code to launch the Extension Development Host

## Usage 🔨

1. Open the command palette (`Cmd/Ctrl + Shift + P`)
2. Type "Auto Commit Changes" and select the command
3. Watch as CommiTastic processes your changes!

## Configuration ⚙️

Configure CommiTastic through VS Code settings:
json
{
"cursorAutoCommit.autoPush": false,
"cursorAutoCommit.batchCommit": false,
"cursorAutoCommit.useConventionalCommits": true
}


- `autoPush`: Automatically push after committing
- `batchCommit`: Commit all files together instead of individually
- `useConventionalCommits`: Use conventional commit format

## Requirements 📋

- VS Code 1.60.0 or higher
- Cursor Editor
- Git installed and configured

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is licensed under the ISC License - see the LICENSE file for details.

## Acknowledgments 🙏

- Built for the Cursor Editor community
- Powered by Cursor's AI commit message generation

---

Made with ❤️ for Cursor users