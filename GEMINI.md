# Habit Tracker

This is a habit tracking application built with React Native and Expo. It allows users to track their habits with a GitHub-style contribution grid.

## Project Overview

The application is designed to be cross-platform, supporting iOS, Android, and the web. It's built with modern technologies like React Native, Expo, and TypeScript.

### Key Features:

*   **Habit Tracking**: Users can add, edit, and delete habits.
*   **Visualization**: A GitHub-style grid provides a visual representation of habit consistency.
*   **Multiple Views**: Includes a grid view, a list view, a calendar view, and an analytics dashboard.
*   **Theming**: Supports both dark and light themes.
*   **Analytics**: Provides insights into habit streaks and completion rates.
*   **Notifications**: Sends reminders to help users stay on track.
*   **Data Storage**: Uses AsyncStorage for local data persistence.

## Codebase Structure

The codebase is organized into the following main directories:

*   `components/`: Contains all the React components used in the application.
*   `utils/`: Includes utility functions for features like local storage (`storage.ts`) and notifications (`notifications.ts`).
*   `config/`: Holds configuration files, such as `iconThemes.ts`.
*   `App.tsx`: The main entry point of the application.
*   `types.ts`: Contains all the TypeScript type definitions.
