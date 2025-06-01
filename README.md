# 🎯 Advanced Habit Tracker

A comprehensive cross-platform habit tracking application built with React Native and Expo, featuring GitHub-style contribution grids, detailed analytics, dark mode, notifications, and advanced habit management. Available on iOS, Android, and Web.

## ✨ Features

### 📊 Core Functionality
- **GitHub-style Contribution Grid**: Visual representation of habit completion with animated squares and smooth transitions
- **Multiple View Modes**: Grid view, List view, Analytics dashboard, and Calendar view
- **Habit Categories**: Organize habits with predefined categories (Health, Productivity, Learning, etc.) or create custom ones
- **Flexible Frequency Options**: Daily, weekly, or custom frequency with specific days selection
- **Goal Setting & Tracking**: Set completion targets and track progress over time
- **Tagging System**: Add custom tags to organize and filter habits effectively
- **Habit Reordering**: Drag & drop functionality to reorganize habits according to priority

### 🎨 User Interface & Experience
- **Complete Dark/Light Mode**: Full theming system with seamless theme switching
- **Smooth Animations**: React Native animations for habit interactions, loading states, and transitions
- **Responsive Design**: Optimized layouts for phones, tablets, and web browsers
- **Intuitive Navigation**: Tab-based navigation with quick access to all features
- **Accessibility Support**: Screen reader compatibility and proper accessibility labels
- **Icon Themes**: Customizable icon sets for habit visualization

### 📈 Analytics & Insights
- **Comprehensive Statistics**: Current streaks, longest streaks, and completion rates (7-day, 30-day)
- **Performance Metrics**: Weekly averages, trend analysis, and progress tracking
- **Visual Charts**: SVG-based charts with customizable colors and interactive elements
- **Habit Comparison**: Side-by-side analytics for multiple habits
- **Export Functionality**: Export habit data and statistics for external analysis
- **Calendar Integration**: Month and week views with completion visualization

### 🔔 Notifications & Reminders
- **Smart Reminder System**: Schedule personalized habit reminders with custom messages
- **Cross-platform Notifications**: Native notifications on iOS, Android, and Web
- **Flexible Timing**: Set specific reminder times for each habit independently
- **Frequency-aware Reminders**: Different notification patterns based on habit frequency
- **Permission Management**: Proper notification permission handling with fallback options

### ⚡ Performance & Data Management
- **Persistent Storage**: AsyncStorage for mobile, localStorage for web with automatic synchronization
- **Performance Monitoring**: Built-in performance measurement and optimization tools
- **Intelligent Caching**: Optimized data loading and memory management
- **Error Handling**: Comprehensive error recovery and user feedback systems
- **Data Import/Export**: Backup and restore functionality for habit data migration
- **Offline Support**: Full functionality without internet connection

## 🏗️ Project Structure

This project contains two main applications:

### Main App (Root Directory)
**Cross-platform React Native + Expo application** supporting iOS, Android, and Web
```
/
├── App.tsx                 # Main application entry point
├── app.json               # Expo configuration
├── package.json           # Dependencies and scripts
├── types.ts              # TypeScript type definitions
├── components/           # React Native components
│   ├── HabitGrid.tsx     # GitHub-style contribution grid
│   ├── AnalyticsDashboard.tsx  # Statistics and charts
│   ├── CalendarView.tsx  # Calendar-based habit view
│   ├── AddHabitModal.tsx # Habit creation modal
│   ├── EditHabitModal.tsx # Habit editing interface
│   ├── HabitList.tsx     # List view with drag & drop
│   ├── HabitStats.tsx    # Individual habit statistics
│   ├── SettingsModal.tsx # App settings and preferences
│   └── ThemeProvider.tsx # Dark/light theme management
├── utils/               # Utility modules
│   ├── storage.ts       # Data persistence (AsyncStorage/localStorage)
│   ├── notifications.ts # Push notification management
│   ├── animations.ts    # Animation utilities
│   └── performance.ts   # Performance monitoring
├── config/
│   └── iconThemes.ts    # Icon theme configurations
└── assets/              # App icons and images
```

### Web App (habit-tracker-app/)
**Separate React web application** for web-specific features
```
habit-tracker-app/
├── src/
│   ├── App.tsx          # Web app entry point
│   ├── components/      # Web-specific components
│   ├── pages/          # Web application pages
│   ├── hooks/          # Custom React hooks
│   ├── types/          # Web app type definitions
│   └── utils/          # Web utility functions
└── package.json        # Web app dependencies
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **iOS Simulator** or **Android Emulator** (for mobile testing)

### Installation & Setup

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
   # Start Expo development server
   npm start
   
   # Or start specific platforms
   npm run ios     # iOS Simulator
   npm run android # Android Emulator
   npm run web     # Web browser
   ```

4. **For the separate web app (optional)**
   ```bash
   cd habit-tracker-app
   npm install
   npm start
   ```

## 📱 Platform Support

| Platform | Status | Features |
|----------|--------|----------|
| **iOS** | ✅ Full Support | Native notifications, haptic feedback, optimized UI |
| **Android** | ✅ Full Support | Material Design, notification channels, adaptive icons |
| **Web** | ✅ Full Support | PWA capabilities, localStorage, responsive design |

## 🎮 Usage Guide

### Adding Your First Habit
1. Tap the **+** button in the top navigation
2. Fill in habit details (name, category, frequency, goals)
3. Set optional reminders and tags
4. Choose an icon and color theme
5. Save to start tracking!

### Tracking Progress
- **Grid View**: Tap squares to mark daily completions (GitHub-style)
- **List View**: Use checkboxes or swipe actions for quick updates
- **Calendar View**: Navigate months and mark specific dates

### Viewing Analytics
- Access the **Analytics** tab for detailed insights
- View streaks, completion rates, and trend charts
- Compare multiple habits side-by-side
- Export data for external analysis

### Customization
- Toggle dark/light mode in Settings
- Reorder habits by dragging in List view
- Create custom categories and tags
- Adjust notification preferences

## 🛠️ Technical Implementation

### State Management
- React hooks (`useState`, `useEffect`) for local state
- Context API for theme management
- Persistent storage with automatic sync

### Data Storage
- **Mobile**: AsyncStorage for offline-first experience
- **Web**: localStorage with fallback to sessionStorage
- **Cross-platform**: Unified storage interface

### Performance Optimizations
- Lazy loading for large habit lists
- Memoized components to prevent unnecessary re-renders
- Optimized animations using `useNativeDriver`
- Intelligent caching for statistics calculations

### Notifications
- **iOS**: Native push notifications with UNUserNotificationCenter
- **Android**: Notification channels with proper targeting
- **Web**: Service Worker notifications (where supported)

## 🔧 Configuration

### Environment Setup
The app works out-of-the-box with default settings. For advanced configuration:

1. **Notification Settings**: Modify `utils/notifications.ts`
2. **Theme Customization**: Edit `components/ThemeProvider.tsx`
3. **Storage Configuration**: Adjust `utils/storage.ts`
4. **Performance Tuning**: Configure `utils/performance.ts`

### Expo Configuration
Key settings in `app.json`:
- **Name**: "Habit Tracker"
- **Platforms**: iOS, Android, Web
- **Orientation**: Portrait (mobile), Responsive (web)
- **Icon/Splash**: Customizable assets in `/assets`
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

## 📱 Usage Guide

### Adding New Habits
1. Tap the **+** button in the header
2. Enter habit name and select color
3. Choose category (optional)
4. Set frequency (daily, weekly, or custom)
5. Add tags and goals (optional)
6. Configure reminder time (optional)
7. Save the habit

### Tracking Progress
- **Grid View**: Tap on squares to mark habit completion
- **List View**: Use quick action buttons to toggle completion
- **Animation Feedback**: Visual feedback confirms your actions

### Viewing Analytics
- Switch to **Analytics** tab for detailed insights
- View overall statistics and individual habit performance
- Monitor streaks, completion rates, and trends

### Managing Habits
- **Reorder**: Drag and drop habits in list view
- **Edit**: Long press on habit for options
- **Delete**: Confirm deletion to remove permanently
- **Categories**: Organize habits for better management

### Settings & Customization
- **Dark Mode**: Toggle between light and dark themes
- **Notifications**: Enable/disable reminder notifications
- **Data Management**: Export/import habit data
- **View Preferences**: Set default view mode

## 🏗️ Architecture

### Project Structure
```
├── components/           # Reusable UI components
│   ├── AddHabitModal.tsx    # Habit creation modal
│   ├── AnalyticsDashboard.tsx # Analytics and insights
│   ├── HabitGrid.tsx        # GitHub-style contribution grid
│   ├── HabitList.tsx        # List view with reordering
│   ├── HabitStats.tsx       # Individual habit statistics
│   ├── SettingsModal.tsx    # App settings and preferences
│   └── ThemeProvider.tsx    # Theme context and management
├── utils/               # Utility functions and services
│   ├── storage.ts          # Data persistence and management
│   ├── notifications.ts    # Notification scheduling
│   ├── animations.ts       # Animation utilities
│   └── performance.ts      # Performance monitoring tools
├── types.ts            # TypeScript type definitions
└── App.tsx            # Main application component
```

### Key Technologies
- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Navigation library
- **Expo Notifications**: Push notification system
- **Animated API**: React Native animations

### Data Flow
1. **Storage Layer**: In-memory storage with caching and optimization
2. **Component Layer**: React components with state management
3. **Animation Layer**: Performance-optimized animations
4. **Notification Layer**: Background notification scheduling

## 🔧 Technical Details

### Performance Optimizations
- **Caching**: 5-minute cache for habit statistics
- **Performance Monitoring**: Built-in timing and measurement
- **Memory Management**: Efficient data structures
- **Animation Optimization**: Native driver usage

### Notification System
- **Permission Handling**: Graceful permission requests
- **Scheduling**: Time-based and recurring notifications
- **Platform Support**: iOS and Android compatibility
- **Background Processing**: Reliable notification delivery

### Error Handling
- **Graceful Degradation**: App continues working despite errors
- **User Feedback**: Clear error messages and recovery options
- **Logging**: Comprehensive error logging for debugging
- **Validation**: Input validation and sanitization

## 🎨 Design Principles

### User Experience
- **Intuitive Interface**: Clear navigation and actions
- **Visual Feedback**: Immediate response to user actions
- **Accessibility**: Screen reader and accessibility support
- **Performance**: Smooth animations and fast responses

### Visual Design
- **Material Design**: Following modern design principles
- **Color System**: Consistent color palette and theming
- **Typography**: Clear and readable text hierarchy
- **Spacing**: Consistent spacing and layout

## 🔮 Future Enhancements

### Planned Features
- **Social Features**: Share progress with friends
- **Advanced Analytics**: Detailed charts and insights
- **Habit Templates**: Pre-configured habit templates
- **Integration**: Health app and fitness tracker integration
- **Cloud Sync**: Cross-device synchronization
- **Widgets**: Home screen widgets for quick access

### Technical Improvements
- **Offline Support**: Full offline functionality
- **Database Migration**: SQLite or Realm integration
- **Performance**: Further optimization and monitoring
- **Testing**: Comprehensive test coverage

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team**: For the excellent development platform
- **React Native Community**: For the amazing ecosystem
- **GitHub**: For inspiration on the contribution grid design
- **Contributors**: Everyone who helped improve this project

## 📞 Support

If you have questions or need help:

1. **Check the Issues**: See if your question has been answered
2. **Create an Issue**: Describe your problem or feature request
3. **Join Discussions**: Participate in community discussions

## 🎨 Screenshots & Demo

> Add screenshots of your app in action here - showing the GitHub-style grid, analytics dashboard, dark mode, and mobile responsiveness

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Manual Testing
- Test on iOS Simulator, Android Emulator, and web browsers
- Verify offline functionality and data persistence
- Test notification permissions and scheduling
- Validate theme switching and responsive design

## 🚀 Deployment

### Mobile App Deployment

**iOS App Store:**
```bash
# Build for iOS
expo build:ios

# Or using EAS Build (recommended)
eas build --platform ios
eas submit --platform ios
```

**Google Play Store:**
```bash
# Build for Android
expo build:android

# Or using EAS Build (recommended)
eas build --platform android
eas submit --platform android
```

### Web Deployment

**Deploy to Netlify/Vercel:**
```bash
# Build web version
expo export:web

# Deploy build folder to your hosting provider
```

**Deploy as PWA:**
- The web version supports Progressive Web App features
- Users can install it directly from their browser
- Includes offline support and home screen installation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style Guidelines
- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure all components are properly typed
- Test on multiple platforms before submitting

### Reporting Bugs
When reporting bugs, please include:
- Operating system and version
- Device type (if mobile)
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots (if applicable)

## 🔧 Troubleshooting

### Common Issues

**Expo/Metro bundler issues:**
```bash
# Clear cache and restart
expo start --clear
```

**iOS Simulator not opening:**
```bash
# Reset iOS Simulator
xcrun simctl shutdown all
xcrun simctl erase all
```

**Android emulator issues:**
```bash
# Cold boot Android emulator
emulator -avd <device_name> -cold-boot
```

**Notification permissions not working:**
- Ensure you're testing on a physical device
- Check device notification settings
- Verify app permissions in device settings

### Performance Issues
- Clear app cache periodically
- Check for memory leaks in development tools
- Optimize large habit lists by implementing pagination
- Monitor bundle size and remove unused dependencies

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team** for the excellent React Native framework and development tools
- **React Native Community** for comprehensive platform support and libraries
- **GitHub** for inspiration on the contribution grid design
- **Ionicons** for the beautiful and comprehensive icon set
- **AsyncStorage Community** for reliable data persistence
- **React Native SVG** for powerful chart and visualization capabilities

## 📞 Support & Community

If you encounter any issues or have questions:

### Getting Help
- 📚 **Documentation**: Check this README and inline code comments
- 🐛 **Bug Reports**: Create an issue with detailed reproduction steps
- 💡 **Feature Requests**: Open a discussion for new feature ideas
- 📖 **Learning Resources**: 
  - [Expo Documentation](https://docs.expo.dev/)
  - [React Native Documentation](https://reactnative.dev/docs/getting-started)
  - [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Community Guidelines
- Be respectful and constructive in discussions
- Search existing issues before creating new ones
- Provide clear and detailed information when asking for help
- Help others when you can - community support benefits everyone

## 🗺️ Roadmap

### Planned Features
- [ ] **Social Features**: Share habits and compete with friends
- [ ] **Advanced Analytics**: Machine learning insights and predictions
- [ ] **Habit Templates**: Pre-built habit collections for common goals
- [ ] **Integration APIs**: Connect with health apps and fitness trackers
- [ ] **Voice Commands**: Add habits and mark completions via voice
- [ ] **Gamification**: Achievements, levels, and reward systems
- [ ] **Team Challenges**: Group habit tracking and accountability
- [ ] **Data Sync**: Cloud synchronization across devices

### Recent Updates
- ✅ **v1.0.0**: Initial release with core functionality
- ✅ GitHub-style contribution grids
- ✅ Cross-platform support (iOS, Android, Web)
- ✅ Dark mode and theming system
- ✅ Advanced analytics and statistics
- ✅ Smart notifications and reminders

---

**Happy Habit Tracking! 🎯**

*Build better habits, one day at a time.*

**Made with ❤️ and React Native**
