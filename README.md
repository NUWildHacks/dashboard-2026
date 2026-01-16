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

### Admin Features

- **User Management**: Interface for administrators to manage user accounts, roles, and permissions
- **WildHacks Config Editing**: Admin panel to edit hackathon configuration settings
- **Creating Announcements**: Admin interface to create and publish announcements
- **Creating Events**: Admin interface to create and manage schedule events

### Security

- **Firestore Security Rules**: Implementation of comprehensive security rules to protect database access and ensure proper authorization

## Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) for details on:

- Project structure and organization
- Code style and conventions
- Development workflow
- Git workflow and commit message format
- Testing and quality standards
