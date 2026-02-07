# Dashboard 2026

The WildHacks Dashboard is the management system for WildHacks 2026. It provides participants with a platform to make the most of their hackathon experience, including project collaboration, event scheduling, announcements, and more.

**Live Site**: https://dashboard.wildhacks.net

## Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS** - Utility-first CSS framework
- **ShadCN UI** - Component library built on Radix UI

### Backend

- **Firebase Authentication** - User authentication
- **Cloud Firestore** - NoSQL database
- **Vercel** - Static hosting

### Validation & Forms

- **Zod** - Schema validation
- **React Hook Form** - Form state management
- **@hookform/resolvers** - Zod integration for React Hook Form

### Utilities

- **date-fns** - Date manipulation
- **lucide-react** - Icon library
- **recharts** - Chart library
- **next-themes** - Theme management

## Features

### Dashboard Home

- Real-time statistics and hackathon metrics
- Personal QR code for check-in
- Countdown timer showing time remaining
- Interactive venue map
- Live announcements feed
- Upcoming events calendar

### Announcements

- View all hackathon announcements
- Real-time updates for important information

### Schedule

- Interactive calendar view of all events
- Event details and timing information
- Filter and navigate through the schedule

### Project Management

- Create and manage hackathon projects
- Join existing projects with team codes
- Leave projects
- Manage team members and roles
- Edit project details (name, description, GitHub links)

### Settings

- Edit user profile information
- Theme selection (light/dark mode)
- Event withdrawal functionality

### Support

- Access to support resources and help

### Authentication

- Secure login with Firebase Authentication
- User registration with profile setup

## Security

### CSRF Protection

This application uses **Next.js App Router Server Actions**, which provide built-in CSRF (Cross-Site Request Forgery) protection by default. The protection mechanism includes:

- **Origin Header Validation**: Server actions automatically verify that requests originate from the same origin
- **SameSite Cookie Attributes**: Session cookies use secure, SameSite attributes to prevent cross-site attacks
- **Automatic Token Validation**: Next.js validates the request origin and headers for all server actions

**Note**: All server actions in this application benefit from this automatic protection. No additional CSRF tokens are required when using Next.js Server Actions.

### Content Security Policy (CSP)

The application implements a strict Content Security Policy to mitigate XSS attacks and other injection vulnerabilities. The CSP is configured in `next.config.ts` and restricts:

- Script execution to trusted sources only
- External resource loading (images, fonts, styles)
- Network connections to approved domains (Firebase, GitHub OAuth)

### Input Validation

- All user inputs are validated using **Zod schemas** on both client and server
- URL inputs are restricted to `http://` and `https://` protocols only
- Text inputs are validated to prevent HTML injection
- Input length limits are enforced to prevent DoS attacks

### Authentication & Authorization

- **Firebase Authentication** handles secure user authentication
- Session cookies are verified server-side using Firebase Admin SDK
- User roles and permissions are enforced in both Firestore security rules and server actions

## Getting Started

### Prerequisites

- **Node.js**: Version 18 or higher
- **pnpm**: Version 10.12.1 (specified in `package.json`)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/NUWildHacks/dashboard-2026.git
   cd dashboard-2026
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables (if needed):
   - Configure Firebase credentials and other required environment variables

4. Start the development server:

   ```bash
   pnpm run dev
   ```

   The application will be available at `http://localhost:3000`.

### Available Scripts

- `pnpm run dev` - Start the development server
- `pnpm run build` - Build the application for production
- `pnpm run start` - Start the production server
- `pnpm run lint` - Run ESLint to check for code issues
- `pnpm run lint:fix` - Automatically fix ESLint issues
- `pnpm run format` - Format code with Prettier
- `pnpm run format:check` - Check if code is formatted correctly
- `pnpm run clean` - Remove build artifacts and cache

For detailed setup instructions, code style guidelines, and contribution workflow, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Future Developments

The following features are planned for future implementation:

### Support Page

- **FAQ**: Answers to commonly asked questions (eg. Wifi connections, logistics)
- **Issue Reports**: Interface for users to report issues or bugs
- **Contacts** Contact information for users to request support

### Projects Page

- **Project Submission**: Allow users to submit the current version of their project
- **View All Projects**: After the event concludes, display all submitted projects

### Admin Features

- **User Management**: Interface for administrators to manage user accounts, roles, and permissions
- **WildHacks Config Editing**: Admin panel to edit hackathon configuration settings
- **Creating Announcements**: Admin interface to create and publish announcements
- **Creating Events**: Admin interface to create and manage schedule events

## Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) for details on:

- Project structure and organization
- Code style and conventions
- Development workflow
- Git workflow and commit message format
- Testing and quality standards
