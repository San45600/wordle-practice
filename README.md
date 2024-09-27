# Wordle-Practice

## Overview

This project is a multi-mode Wordle game built using TypeScript and Next.js, supporting both single-player and multiplayer modes. The game includes several variations of the classic Wordle experience, including:

	•	Normal Wordle: A single-player game where the user guesses a randomly selected word.
	•	Host Cheating Wordle: A variant where the host dynamically adjusts the possible answers based on player guesses.
	•	Time Attack Multiplayer Wordle: A real-time multiplayer mode where players compete to guess the word within a set time limit.

The project is designed to be flexible and customizable, allowing players to import custom word lists and adjust game settings.

## Features

	•	Configurable word list and round limits.
	•	Multiple game modes (Normal, Host Cheating, Time Attack Multiplayer).
	•	Real-time synchronization for multiplayer modes.
	•	JSON-based word list import and export.

## Setup

	1.	Clone the repository:

```bash
git clone https://github.com/San45600/wordle-practice.git
```

	2.	Navigate to the project directory:

```bash
cd wordle-practice
```

	3.	Install dependencies:

 ```bash
bun i
```

	4.	Run the development server:

 ```bash
bun dev
```
 
Open [http://localhost:3000](http://localhost:3000) to play single-player wordle.
Open [http://localhost:3000/multiplayer](http://localhost:3000/multiplayer) to play multi-player wordle.

## Future Updates

	•	Export word list as JSON: Allow players to export their custom word lists as JSON files for storage or sharing.
	•	JSON file validation: Ensure that imported word lists are correctly structured and valid before being used in the game.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

[Notion Documentation](https://www.notion.so/Programming-assignment-Wordle-10e9c822b8678044a8fafb2ceaf5cea2?showMoveTo=true&saveParent=true)
