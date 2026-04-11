# Witness

Witness is a React Native + Expo app for creating social accountability in study groups. Users can customize their profiles, join focus rooms, run timed sessions, and compare progress with other room members.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/farazht/cpsc444.git
cd cpsc444
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the dev server

```bash
npm run start
```

### 4. Open the app

In the Expo CLI:

- Press `w` to open in web
- Press `i` to open iOS simulator (requires Xcode)
- Press `a` to open Android emulator (requires Android Studio)

You can also use Expo Go by scanning the QR code shown in the terminal.

## Study

Witness was built as part of a project for CPSC 444, a course on human-computer interaction. The app uses a wizard-of-oz approach with mock data to simulate real-time interactions and notifications. This app was used in our user study to gather feedback and compare two different room conditions: a text-oriented interface and a visual/chart-oriented interface.

1. App opens and redirects to `/login`.
2. User enters name + avatar and continues to `/menu`.
3. User joins a room.
4. Selected condition determines route:
   - `text` -> `/room-text`
   - `visual` -> `/room-visual`
5. Timer state and member activity are shared via `SessionProvider`.
