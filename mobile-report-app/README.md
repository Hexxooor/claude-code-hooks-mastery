# Mobile Report App MVP

A Progressive Web App (PWA) for handwerk businesses that digitizes field operations, enabling workers to track time, view orders, and create digital reports with photos and signatures - all while working offline.

## 🚀 Features

- **Offline-First Architecture**: Full functionality without internet connection
- **Order Management**: View and manage work orders with filtering and search
- **Time Tracking**: Built-in timer and manual time entry with order association
- **Digital Reports**: Create comprehensive reports with photos and customer signatures
- **User Management**: Role-based access control (Admin, Manager, Worker)
- **PWA Capabilities**: Install as native app, works offline, syncs when connected
- **Mobile Optimized**: Responsive design optimized for tablets and smartphones

## 🛠️ Technology Stack

- **Frontend Framework**: Vue 3.4+ with Composition API
- **Build Tool**: Vite 5.0+
- **Type Safety**: TypeScript 5.0+
- **Styling**: Tailwind CSS 3.4+
- **State Management**: Pinia 2.1+
- **Routing**: Vue Router 4.2+
- **Form Validation**: Vuelidate 2.0+
- **Local Database**: Dexie.js (IndexedDB wrapper)
- **Testing**: Vitest + Vue Test Utils
- **Code Quality**: ESLint + Prettier

## 📋 Prerequisites

- Node.js 18+ and npm 9+
- Modern browser with IndexedDB support
- Git for version control

## 🔧 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mobile-report-app
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Configure environment variables in `.env.local`:
```env
VITE_APP_TITLE=Mobile Report MVP
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_VERSION=1.0.0
VITE_ENABLE_MSW=true
```

## 🚀 Development

### Start Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
```
Production files will be in the `dist` directory

### Preview Production Build
```bash
npm run preview
```

## 🧪 Testing

### Run Unit Tests
```bash
npm run test
```

### Run Tests with UI
```bash
npm run test:ui
```

### Generate Coverage Report
```bash
npm run test:coverage
```

## 🎨 Code Quality

### Run ESLint
```bash
npm run lint
```

### Format Code with Prettier
```bash
npm run format
```

### Type Check
```bash
npm run type-check
```

## 📱 PWA Installation

### Android Devices
1. Open the app in Chrome browser
2. Tap the menu button (three dots)
3. Select "Add to Home Screen"
4. Follow the installation prompts

### Desktop Chrome
1. Look for the install icon in the address bar
2. Click "Install Mobile Report"
3. The app will open in its own window

## 🏗️ Project Structure

```
src/
├── components/        # Reusable Vue components
│   ├── ui/           # Base UI components
│   ├── forms/        # Form components
│   └── layout/       # Layout components
├── composables/      # Vue composition functions
├── stores/           # Pinia state stores
├── views/            # Page components
├── router/           # Vue Router configuration
├── services/         # Business logic services
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
└── assets/           # Static assets
```

## 🔒 Security

- JWT-based authentication
- Input validation on all forms
- XSS protection through Vue.js sanitization
- Content Security Policy headers
- Secure password requirements

## 📊 Performance Targets

- First Contentful Paint: <1.5 seconds
- Time to Interactive: <3 seconds
- Bundle Size: <500KB initial
- Smooth 60fps animations

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Chrome Android 90+
- Samsung Internet 15+

## 📖 Documentation

- [Technical Specification](../.agent-os/specs/2025-01-16-mvp-core/sub-specs/technical-spec.md)
- [Task List](../.agent-os/specs/2025-01-16-mvp-core/tasks.md)
- [API Documentation](./docs/api.md) (coming soon)
- [User Guide](./docs/user-guide.md) (coming soon)

## 🤝 Contributing

Please read our contributing guidelines before submitting PRs.

## 📄 License

Proprietary - All rights reserved

## 🆘 Support

For issues and questions, please contact the development team.
