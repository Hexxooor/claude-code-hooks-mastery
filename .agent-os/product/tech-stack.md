# Technical Stack

> Last Updated: 2025-09-16
> Version: 1.0.0

## Application Framework

- **Framework:** Vue.js 3 with PWA capabilities
- **Version:** Vue.js 3.4.37
- **Rationale:** Progressive Web App providing native-like mobile experience through browser, optimized for Android devices accessing via VPN

## Database

- **Primary Database:** Microsoft SQL Server (existing, **READ-ONLY**)
- **Application Database:** PostgreSQL for app-specific data storage
- **Local Storage:** SQLite with SQL.js for offline functionality
- **Sync Strategy:** One-way sync from MSSQL (read) + bidirectional sync with PostgreSQL
- **ORM:** Prisma with SQL Server connector (read-only) + PostgreSQL connector (read/write)

## JavaScript

- **Framework:** Vue.js 3 with Composition API
- **Version:** 3.4.37
- **Build Tool:** Vite 5.4.2
- **Import Strategy:** ES modules with importmaps for optimal mobile performance
- **PWA Support:** Vite PWA plugin for offline capabilities

## CSS Framework

- **Framework:** Tailwind CSS
- **Version:** 3.4.10
- **Mobile-First:** Responsive design with touch-optimized components
- **Performance:** PurgeCSS integration for minimal bundle size

## UI Component Library

- **Library:** Quasar Framework
- **Version:** 2.16.9
- **Features:** Material Design 3, mobile-optimized components, built-in responsive grid
- **Mobile Components:** Touch gestures, pull-to-refresh, virtual scrolling

## Fonts Provider

- **Provider:** Google Fonts with local fallbacks
- **Primary Font:** Inter (system font fallback)
- **Performance:** Preloaded font files for offline availability

## Icon Library

- **Library:** Material Design Icons (MDI)
- **Version:** 7.4.47
- **Format:** SVG icons for scalability and performance
- **Fallback:** System icons for offline scenarios

## Application Hosting

- **Platform:** Internal server deployment (Docker containers)
- **Web Server:** Nginx with SSL termination
- **Access:** VPN-only access, no public internet exposure
- **Protocol:** HTTPS with internal certificates

## Database Hosting

- **MSSQL Server:** Existing customer infrastructure (READ-ONLY access)
- **PostgreSQL:** Managed PostgreSQL (Supabase/Neon) for application data
- **Connection:** Secure VPN/SSL connections for MSSQL read access
- **Backup:** Automated PostgreSQL backups + MSSQL snapshot references

## Asset Hosting

- **CDN:** Cloudflare R2 with global edge caching
- **Images:** WebP format with AVIF fallback for mobile optimization
- **Caching:** Aggressive caching strategy for offline availability

## Deployment Solution

- **CI/CD:** GitHub Actions with Docker build pipeline
- **Containerization:** Docker Compose for local deployment
- **Web:** Internal server deployment with automated updates
- **Testing:** Browser-based testing on Android devices within VPN

## Code Repository

- **Platform:** GitHub
- **URL:** `https://github.com/[organization]/mobile-report-app`
- **Branching:** GitFlow with mobile-specific feature branches

## Additional Technologies

### Data Synchronization Architecture
- **MSSQL Sync:** Scheduled read-only synchronization (customers, materials, employees)
- **App Data Sync:** Real-time bidirectional sync for orders, reports, time tracking
- **Background Sync:** Service Worker API for offline queue management
- **Conflict Resolution:** Custom merge strategies for application data only

### Mobile Browser Optimization
- **PWA Features:** Service Worker for offline capabilities and push notifications
- **Caching:** Workbox for sophisticated offline caching strategies
- **Performance:** Lighthouse CI for mobile browser performance monitoring
- **Install Prompt:** Add to Home Screen functionality for native-like experience
- **Media Capture:** Camera API for photo/video documentation
- **GPS Tracking:** Geolocation API for automatic site detection
- **File Handling:** Progressive upload with compression for images

### Security
- **Authentication:** Simple user/password management via admin interface
- **User Management:** Admin-created accounts for employees
- **VPN Access:** Mandatory VPN connection for all access
- **API Security:** JWT tokens with refresh token rotation
- **Data Encryption:** AES-256 for sensitive local data storage
- **Digital Signatures:** Canvas-based signature capture with timestamp

### Development Tools
- **TypeScript:** Full type safety across frontend and backend
- **Linting:** ESLint with mobile browser-specific rules
- **Testing:** Vitest for unit tests, Playwright for E2E browser testing
- **Monitoring:** Internal logging system + Sentry for error tracking
- **Local Development:** Docker Compose for consistent development environment