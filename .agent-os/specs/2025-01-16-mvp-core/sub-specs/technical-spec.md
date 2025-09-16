# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/specs/2025-01-16-mvp-core/spec.md

> Created: 2025-01-16
> Version: 1.0.0

## Technical Requirements

### Architecture Overview
The MVP will follow a Progressive Web App (PWA) architecture with offline-first design principles. The application will be built as a Single Page Application (SPA) using Vue.js 3 with full offline capability through IndexedDB and Service Workers.

### Technology Stack

#### Frontend Framework
- **Vue.js 3.4+** with Composition API
- **Vue Router 4** for client-side routing
- **Pinia** for state management
- **Vuelidate** for form validation

#### Styling & UI
- **Tailwind CSS 3.4+** for utility-first styling
- **Headless UI** for accessible components
- **Heroicons** for consistent iconography
- **Vue Toastification** for notifications

#### Data Layer
- **Dexie.js 3.2+** as IndexedDB wrapper
- **Mock Service Worker (MSW)** for API mocking during development
- **JSON Schema** for data validation

#### PWA & Performance
- **Vite 5.0+** as build tool and dev server
- **Workbox** for Service Worker generation
- **Web App Manifest** for installability
- **Intersection Observer API** for lazy loading

#### Testing & Quality
- **Vitest** for unit and integration testing
- **Playwright** for end-to-end testing
- **ESLint + Prettier** for code quality
- **TypeScript 5.0+** for type safety

### Database Schema (IndexedDB)

#### Core Entities

```typescript
interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'worker';
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerAddress: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string[]; // User IDs
  estimatedHours: number;
  createdAt: Date;
  dueDate: Date;
  completedAt?: Date;
}

interface TimeEntry {
  id: string;
  userId: string;
  orderId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  description: string;
  isManual: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Report {
  id: string;
  orderId: string;
  userId: string;
  title: string;
  description: string;
  status: 'draft' | 'submitted' | 'approved';
  photos: Photo[];
  materials: Material[];
  timeEntries: string[]; // TimeEntry IDs
  customerSignature?: string; // Base64 encoded
  customerName?: string;
  signedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface Photo {
  id: string;
  reportId: string;
  filename: string;
  category: 'before' | 'during' | 'after' | 'material' | 'other';
  caption?: string;
  base64Data: string;
  mimeType: string;
  fileSize: number;
  createdAt: Date;
}

interface Material {
  id: string;
  name: string;
  code: string;
  unit: string;
  quantityUsed: number;
  unitPrice: number;
  totalCost: number;
  notes?: string;
}
```

### Authentication & Security

#### Authentication Flow
1. Username/password login with JWT token generation
2. Token stored in localStorage with expiration
3. Automatic token refresh before expiration
4. Secure logout with token invalidation

#### Security Measures
- Input validation on all forms using Vuelidate
- XSS protection through Vue.js built-in sanitization
- CSRF protection for sensitive operations
- Content Security Policy (CSP) headers
- Secure password requirements (8+ chars, mixed case, numbers)

### Offline Functionality

#### Service Worker Strategy
- **Cache First**: Static assets (JS, CSS, images)
- **Network First**: API calls with offline fallback
- **Stale While Revalidate**: Dynamic content with background updates

#### Data Synchronization
1. **Offline Queue**: Store API operations when offline
2. **Conflict Resolution**: Last-write-wins with timestamp comparison
3. **Background Sync**: Automatic sync when connection restored
4. **Sync Indicators**: Clear UI feedback for sync status

#### Storage Management
- Maximum 50MB IndexedDB storage allocation
- Automatic cleanup of old data (>30 days)
- Image compression for photos (max 1MB per image)
- Efficient JSON serialization for complex objects

### Performance Requirements

#### Loading Performance
- **First Contentful Paint**: <1.5 seconds
- **Time to Interactive**: <3 seconds
- **Bundle Size**: <500KB initial, <2MB total
- **Image Optimization**: WebP format with fallbacks

#### Runtime Performance
- **UI Response**: <100ms for interactions
- **Search/Filter**: <200ms for local operations
- **Report Generation**: <5 seconds for PDF creation
- **Smooth Animations**: 60fps for transitions

### Mobile Optimization

#### Responsive Design
- **Mobile First**: 360px minimum width
- **Tablet Optimized**: 768px+ primary target
- **Touch Targets**: Minimum 44x44px tap areas
- **Viewport**: Proper meta viewport configuration

#### PWA Features
- **Add to Home Screen**: Full app-like experience
- **Offline Support**: Complete functionality without network
- **App Shell**: Instant loading architecture
- **Splash Screen**: Branded loading experience

### Development Environment

#### Local Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test
npm run test:e2e

# Build for production
npm run build
```

#### Environment Variables
```env
VITE_APP_TITLE=Mobile Report MVP
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_VERSION=1.0.0
VITE_ENABLE_MSW=true
```

## Approach

### Development Methodology
The MVP will be developed using an iterative approach with weekly sprint cycles:

#### Sprint 1 (Week 1): Foundation
- Project setup with Vite + Vue 3 + TypeScript
- Basic routing and layout structure
- User authentication system
- IndexedDB setup with Dexie.js

#### Sprint 2 (Week 2): Core Data
- Order list view with mock data
- User management admin interface
- Basic responsive design
- Initial PWA configuration

#### Sprint 3 (Week 3): Time Tracking
- Timer functionality with start/stop
- Manual time entry forms
- Time association with orders
- Local storage persistence

#### Sprint 4-5 (Week 4-5): Digital Reports
- Report creation forms
- Photo capture and storage
- Material tracking interface
- Basic signature capture

#### Sprint 6 (Week 6): Signatures & Export
- Enhanced signature functionality
- PDF report generation
- Export capabilities
- Data validation

#### Sprint 7 (Week 7): Dashboard & Polish
- Reporting dashboard
- Performance optimization
- UI/UX refinements
- Accessibility improvements

#### Sprint 8 (Week 8): Testing & Deployment
- Comprehensive testing
- Bug fixes and polish
- Documentation completion
- Deployment preparation

### Code Organization
```
src/
├── components/          # Reusable Vue components
│   ├── ui/             # Base UI components
│   ├── forms/          # Form components
│   └── layout/         # Layout components
├── composables/        # Vue composition functions
├── stores/             # Pinia state stores
├── views/              # Page components
├── router/             # Vue Router configuration
├── services/           # Business logic services
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── assets/             # Static assets
```

### Testing Strategy
- **Unit Tests**: 80%+ coverage for business logic
- **Integration Tests**: Database operations and API integration
- **E2E Tests**: Critical user workflows
- **Accessibility Tests**: Automated a11y validation
- **Performance Tests**: Core Web Vitals monitoring

## External Dependencies

### NPM Packages (Production)
```json
{
  "vue": "^3.4.0",
  "vue-router": "^4.2.0",
  "pinia": "^2.1.0",
  "@vuelidate/core": "^2.0.0",
  "dexie": "^3.2.0",
  "@tailwindcss/forms": "^0.5.0",
  "@headlessui/vue": "^1.7.0",
  "@heroicons/vue": "^2.0.0",
  "vue-toastification": "^2.0.0",
  "jspdf": "^2.5.0",
  "signature_pad": "^4.1.0"
}
```

### Development Dependencies
```json
{
  "vite": "^5.0.0",
  "typescript": "^5.0.0",
  "vitest": "^1.0.0",
  "@playwright/test": "^1.40.0",
  "eslint": "^8.55.0",
  "prettier": "^3.1.0",
  "tailwindcss": "^3.4.0",
  "workbox-cli": "^7.0.0",
  "msw": "^2.0.0"
}
```

### Browser Requirements
- **Chrome/Edge**: Version 90+
- **Firefox**: Version 88+
- **Safari**: Version 14+
- **Chrome Android**: Version 90+
- **Samsung Internet**: Version 15+

### Device Compatibility
- **Android Tablets**: 7-12 inch screens, Android 8+
- **Android Phones**: 5+ inch screens as secondary support
- **iOS Support**: Future consideration for Phase 2
- **Desktop**: Basic responsive support for admin functions

### API Mocking (Development)
Mock Service Worker (MSW) will simulate backend APIs:
- User authentication endpoints
- Order management CRUD operations
- Time tracking data persistence
- Report generation and export
- File upload simulation for photos