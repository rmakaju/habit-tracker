# 🎯 Habit Tracker

A React Native habit tracking application built with Expo, featuring GitHub-style contribution grids, analytics, and cross-platform support.

## ✨ Features

- **GitHub-style Contribution Grid**: Visual habit completion tracking
- **Multiple View Modes**: Grid view, List view, Analytics dashboard, and Calendar view  
- **Habit Management**: Add, edit, and organize habits with categories and custom frequencies
- **Dark/Light Mode**: Complete theming system
- **Analytics Dashboard**: View streaks, completion rates, and progress statistics
- **Smart Notifications**: Customizable habit reminders (mobile only)
- **Data Persistence**: Local storage with performance optimizations
- **Cloud Sync (Supabase)**: Sync habits across devices
- **Android Widgets**: Habit grid widgets with tap-to-check-off

## 🏗️ Project Structure

```
├── components/           # React Native components
│   ├── AddHabitModal.tsx    # Habit creation modal
│   ├── AnalyticsDashboard.tsx # Statistics and charts
│   ├── CalendarView.tsx     # Calendar-based habit view
│   ├── EditHabitModal.tsx   # Habit editing interface
│   ├── HabitGrid.tsx        # GitHub-style contribution grid
│   ├── HabitList.tsx        # List view with reordering
│   ├── SettingsModal.tsx    # App settings and preferences
│   └── ThemeProvider.tsx    # Dark/light theme management
├── utils/               # Utility functions
│   ├── storage.ts          # Data persistence
│   ├── notifications.ts    # Notification scheduling
│   ├── animations.ts       # Animation utilities
│   └── performance.ts      # Performance monitoring
├── config/
│   └── iconThemes.ts       # Icon theme configurations
├── types.ts            # TypeScript type definitions
├── App.tsx            # Main application component
└── assets/            # App icons and images
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd habit-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - Scan the QR code with Expo Go app (iOS/Android)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser

## ☁️ Cloud Sync (Supabase)

This app uses Supabase Auth + a single `user_data` table for sync.

1. Create a Supabase project
2. In **Settings → API**, grab:
   - Project URL (looks like `https://<id>.supabase.co`)
   - anon public key
3. Update the values in [utils/supabaseClient.ts](utils/supabaseClient.ts)
4. In Supabase **SQL Editor**, run:

```sql
create table if not exists public.user_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.user_data enable row level security;

create policy "Users can read own data"
on public.user_data
for select
using (auth.uid() = user_id);

create policy "Users can insert own data"
on public.user_data
for insert
with check (auth.uid() = user_id);

create policy "Users can update own data"
on public.user_data
for update
using (auth.uid() = user_id);
```

Then sign up in the app under **Settings → Cloud Sync** and use the same account on all devices.

## 📲 Android Widgets

Android widgets are **native-only** (not available in Expo Go).

Steps:
1. Build and install an APK (EAS):
   ```bash
   eas build -p android --profile preview
   ```
2. Open the app once to seed widget data.
3. Add the widget from the launcher and choose a habit.

Widget behavior:
- Small/medium widgets
- One habit per widget
- Tap a square to toggle today's completion

## 🔄 OTA Updates (EAS Update)

After installing an OTA-enabled APK, you can push JS/asset changes without rebuilding:

```bash
eas update --channel preview --message "Your update note"
```

Notes:
- OTA updates do **not** include native changes (Android manifest, native modules, etc.).
- Build profiles map to channels in [eas.json](eas.json).

## 🖥️ Desktop (macOS via Browser Install)

## 📱 Platform Support

| Platform | Status | Notes |
|----------|--------|-------|
| **iOS** | 🚧 Under Development | Not tested on iOS devices |
| **Android** | ✅ Functional | Basic functionality working |
| **Web** | ✅ Functional | Responsive design, some mobile features limited |

## 🖥️ Desktop (macOS via Browser Install)

You can install the web app as a desktop shortcut (PWA) from Chrome or Edge on macOS:

1. Open the web app.
2. Click the install icon in the address bar, or open the browser menu and select **Install Habit Tracker**.
3. The app will appear in Applications and can be pinned to the Dock.

## 🎮 Usage Guide

### Adding New Habits
1. Tap the **+** button in the header
2. Enter habit name and select color
3. Choose category and frequency
4. Configure reminder time (optional)
5. Save the habit

### Tracking Progress
- **Grid View**: Tap on squares to mark habit completion
- **List View**: Use quick action buttons to toggle completion
- **Calendar View**: Navigate months and mark specific dates

### Viewing Analytics
- Switch to **Analytics** tab for detailed insights
- View streaks, completion rates, and trends
- Monitor individual habit performance

## 🛠️ Technical Stack

- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe JavaScript
- **AsyncStorage**: Data persistence
- **Expo Notifications**: Push notification system
- **React Native Animations**: Smooth UI interactions

## 🔮 Future Enhancements

- **iOS Testing & Optimization**: Complete iOS platform testing
- **Enhanced Mobile Features**: Improved mobile-specific functionality
- **Cloud Sync**: Cross-device synchronization
- **Social Features**: Share progress with friends
- **Advanced Analytics**: More detailed insights and charts
- **Habit Templates**: Pre-configured habit collections

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔧 Troubleshooting

**Expo/Metro bundler issues:**
```bash
expo start --clear
```

**iOS Simulator not opening:**
```bash
xcrun simctl shutdown all
xcrun simctl erase all
```

**Android emulator issues:**
```bash
emulator -avd <device_name> -cold-boot
```

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Expo Team** for the excellent React Native framework
- **React Native Community** for comprehensive platform support
- **GitHub** for inspiration on the contribution grid design

---

**Happy Habit Tracking! 🎯**

*Build better habits, one day at a time.*
