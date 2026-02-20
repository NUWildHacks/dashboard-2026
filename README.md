# WildHacks Dashboard 2026

The WildHacks Dashboard is the comprehensive management system for WildHacks 2026. It provides participants, administrators, and organizers with a platform to make the most of their hackathon experience, including project collaboration, event scheduling, user management, and more.

**Live Site**: https://dashboard.wildhacks.net

## 🚀 Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router and Server Actions
- **React 19** - UI library
- **TypeScript 5** - Type-safe JavaScript with strict mode
- **TailwindCSS 4** - Utility-first CSS framework
- **ShadCN UI** - Component library built on Radix UI primitives

### Backend & Database

- **Firebase Authentication** - User authentication and session management
- **Cloud Firestore** - NoSQL database for real-time data
- **Firebase Admin SDK** - Server-side database operations with elevated privileges
- **Vercel** - Deployment and hosting platform

### Validation & Forms

- **Zod 4** - Schema validation and type inference
- **React Hook Form** - Performant form state management
- **@hookform/resolvers** - Zod integration for React Hook Form

### UI & Utilities

- **Radix UI** - Accessible component primitives
- **lucide-react** - Icon library
- **recharts** - Chart and data visualization library
- **next-themes** - Theme management (light/dark mode)
- **date-fns** - Date manipulation and formatting
- **sonner** - Toast notification system
- **cmdk** - Command menu component

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: Version 18 or higher
- **pnpm**: Version 10.12.1 (specified in `package.json`)
- **Firebase CLI**: For Firebase project management (optional, for development)

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

3. Set up environment variables:

   Create a `.env.local` file in the root directory with the following variables:

   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Firebase Admin SDK (Server-side)
   FIREBASE_ADMIN_PROJECT_ID=your_project_id
   FIREBASE_ADMIN_CLIENT_EMAIL=your_client_email
   FIREBASE_ADMIN_PRIVATE_KEY=your_private_key

   # Application Environment
   APP_ENV=development
   ```

   **Note**: Contact the project maintainers for access to Firebase credentials.

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

## 📋 Project Structure

```
dashboard-2026/
├── app/                    # Next.js App Router directory
│   ├── _components/        # Root-level shared components
│   ├── dashboard/          # Dashboard routes and features
│   ├── login/             # Login page
│   ├── registration/      # Registration page
│   └── page.tsx           # Root landing page
├── components/            # Shared React components
│   ├── form/              # Form-specific components
│   └── ui/                # ShadCN UI components
├── config/                # Configuration files (Firebase)
├── constants/             # Application-wide constants
├── hooks/                 # Shared React hooks
├── lib/                   # Utility functions and libraries
├── types/                 # Shared TypeScript type definitions
└── data/                  # Static data files (JSON)
```

For detailed information about the project structure and development guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

## 🔮 Future Developments

The following features are planned for future implementation:

### Support Page Enhancements

- **FAQ Section**: Answers to commonly asked questions (WiFi connections, logistics, etc.)
- **Issue Reporting**: Interface for users to report issues or bugs
- **Contact Information**: Direct contact information for support requests

### Project Features

- **Team Matching**: Allow users to search through and matching with teams of interest
- **Project Submission**: Allow users to submit their final project versions
- **Project Gallery**: Display all submitted projects after the event concludes

### Judge & Mentors

- **Assignments**: Allow judges and mentors to see their assigned projects and locations

## 🤝 Contributing

We welcome contributions to the WildHacks Dashboard! Please read our [Contributing Guide](CONTRIBUTING.md) for detailed information on:

- Project structure and organization
- Code style and conventions
- Development workflow and best practices
- Git workflow and commit message format
- Server actions and database operations
- Component and hook development patterns
- Validation utilities and security best practices

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-username/feature-name`
3. Make your changes following our coding standards
4. Run quality checks: `pnpm run lint && pnpm run format:check && pnpm run build`
5. Commit your changes with conventional commit messages
6. Push to your branch and create a Pull Request

## 📝 License

This project is proprietary and maintained by NU WildHacks. All rights reserved.

## 🙏 Acknowledgments

Built with ❤️ for the WildHacks 2026 hackathon community.
