# React Native Appointment Booking System

A modern, feature-rich appointment booking system built with React Native and Expo. This application allows users to browse services, book appointments, and manage their bookings with an intuitive and beautiful user interface.

![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue)
![Expo](https://img.shields.io/badge/Expo-~54.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-~5.9.2-blue)


## Image and demo of the app here
![Home Screen]([https://drive.google.com/uc?export=view&id=FILE_ID](https://drive.google.com/file/d/1JgtMoLXSPK27VBM00VZfBo0UNp4ujOMY/view?usp=drive_link))
![Home Screen]([https://drive.google.com/uc?export=view&id=FILE_ID](https://drive.google.com/file/d/1yLOtOHu1KctbG5fe-3J7mVg19Ep43gZE/view?usp=drive_link))
![Home Screen](https://drive.google.com/file/d/1uaReHnXxgDsA-0_AArTP1oq4MFtmhU7T/view?usp=drive_link)
![Home Screen](https://drive.google.com/file/d/1zQjvfQSQXJ6cDQRTUFRwozsgEyK6PTCe/view?usp=drive_link)
![Home Screen](https://drive.google.com/file/d/1uLrsvaksgoVW_TnLI8htXpXikB3JkFb9/view?usp=drive_link)
## ✨ Features

### Functional Requirements ✅

1. **View Services List** - Browse available healthcare services with search functionality
2. **Service Details** - View detailed information about each service including duration, price, and category
3. **Date & Time Selection** - Select appointment date using calendar picker and choose from available time slots
4. **Book Appointments** - Book appointments with instant confirmation
5. **My Appointments** - View all booked appointments in one place
6. **Cancel Appointments** - Cancel appointments with confirmation dialog

### Technical Implementation

- ✅ **React Native with Expo** - Built using Expo SDK 54
- ✅ **Functional Components & Hooks** - Modern React patterns throughout
- ✅ **Context API State Management** - Clean and efficient state management
- ✅ **Mock Data** - Local JSON data structure for services and appointments
- ✅ **Clean Folder Structure** - Organized codebase with separation of concerns

## 📸 Screenshots

(Screenshots will be added here after running the application)

## 🏗️ Project Structure

```
BookingSystem/
├── app/                          # Application screens
│   ├── (tabs)/                   # Tab-based navigation
│   │   ├── index.tsx            # Services list screen
│   │   ├── explore.tsx          # My appointments screen
│   │   └── _layout.tsx          # Tab layout configuration
│   ├── service-details.tsx      # Service details & booking screen
│   └── _layout.tsx              # Root layout with providers
├── components/                   # Reusable components
│   ├── booking/                 # Booking-specific components
│   │   ├── ServiceCard.tsx      # Service display card
│   │   ├── AppointmentCard.tsx  # Appointment display card
│   │   ├── TimeSlotPicker.tsx   # Time slot selection component
│   │   └── Button.tsx           # Custom button component
│   └── ui/                      # UI components
├── context/                      # State management
│   └── AppointmentContext.tsx   # Appointment state provider
├── data/                         # Mock data
│   └── mockData.ts              # Services and time slots data
├── constants/                    # App constants
│   └── theme.ts                 # Theme colors, spacing, shadows
└── assets/                       # Images and static files

```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (optional, but recommended)
- iOS Simulator (for Mac) or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd BookingSystem
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your preferred platform**
   
   - **iOS Simulator** (Mac only)
     ```bash
     npm run ios
     ```
     Or press `i` in the terminal after running `npx expo start`

   - **Android Emulator**
     ```bash
     npm run android
     ```
     Or press `a` in the terminal after running `npx expo start`

   - **Physical Device**
     - Install the "Expo Go" app from App Store or Play Store
     - Scan the QR code shown in the terminal

## 📱 Usage Guide

### Browsing Services

1. Open the app to see the Services tab
2. Use the search bar to filter services by name, category, or description
3. Tap any service card to view details

### Booking an Appointment

1. Select a service from the list
2. Choose your preferred date using the calendar picker
3. Select an available time slot (unavailable slots are marked as "Booked")
4. Tap "Book Appointment" button
5. Receive confirmation and choose to view appointments or book another

### Managing Appointments

1. Navigate to the "Appointments" tab
2. View all your confirmed appointments
3. Cancel any appointment by tapping the "Cancel Appointment" button
4. Confirm cancellation in the dialog

## 🎨 Design Features

- **Modern UI/UX** - Clean, intuitive interface with smooth animations
- **Dark Mode Support** - Automatic theme switching based on system preferences
- **Responsive Design** - Works seamlessly on different screen sizes
- **Visual Feedback** - Hover effects, loading states, and confirmation dialogs
- **Accessibility** - Proper labels and touch targets for better usability

## 🛠️ Technologies Used

- **React Native** (0.81.5) - Cross-platform mobile framework
- **Expo** (~54.0) - Development platform and tooling
- **TypeScript** (~5.9.2) - Type-safe JavaScript
- **Expo Router** (~6.0) - File-based routing system
- **React Navigation** - Navigation library
- **@react-native-community/datetimepicker** - Native date/time picker
- **Context API** - State management solution

## 📦 Dependencies

```json
{
  "@expo/vector-icons": "^15.0.3",
  "@react-navigation/bottom-tabs": "^7.4.0",
  "@react-navigation/native": "^7.1.8",
  "@react-native-community/datetimepicker": "latest",
  "expo": "~54.0.33",
  "expo-router": "~6.0.23",
  "react": "19.1.0",
  "react-native": "0.81.5"
}
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] View services list
- [ ] Search for services
- [ ] View service details
- [ ] Select date
- [ ] Select time slot
- [ ] Book appointment
- [ ] View booked appointments
- [ ] Cancel appointment
- [ ] Test dark mode
- [ ] Test on iOS
- [ ] Test on Android

## 🔧 Error Handling

The application includes comprehensive error handling for:

- **Network Errors** - Graceful handling of API failures (when integrated with real backend)
- **Validation** - Ensures all required fields are filled before booking
- **Empty States** - Friendly messages when no data is available
- **User Feedback** - Alert dialogs for important actions
- **Type Safety** - TypeScript prevents runtime type errors

## 🎯 Code Quality

- **Clean Code** - Well-organized and readable code structure
- **TypeScript** - Full type safety throughout the application
- **Component Reusability** - DRY principles applied
- **Separation of Concerns** - Clear separation between UI, logic, and data
- **Best Practices** - Following React Native and Expo best practices

## 📄 Building for Production

### Generate APK (Android)

```bash
# Build for Android
eas build --platform android --profile preview

# Or using Expo classic build
expo build:android
```

### Generate IPA (iOS)

```bash
# Build for iOS (requires Apple Developer Account)
eas build --platform ios --profile preview
```

## 🚧 Future Enhancements

- [ ] Backend API integration
- [ ] User authentication
- [ ] Push notifications for appointment reminders
- [ ] Payment gateway integration
- [ ] User profile management
- [ ] Appointment rescheduling
- [ ] Rating and review system
- [ ] Multi-language support
- [ ] Offline mode support

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show your support

Give a ⭐️ if this project helped you!

---

**Note**: This is a test task implementation demonstrating React Native development skills, including state management, navigation, UI/UX design, and best practices.
