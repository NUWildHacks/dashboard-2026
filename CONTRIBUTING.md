# Contributing to WildHacks Dashboard 2026

Thank you for your interest in contributing to the WildHacks Dashboard! This guide will help you understand our project structure, coding conventions, and development workflow.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Code Style and Conventions](#code-style-and-conventions)
4. [File Organization Patterns](#file-organization-patterns)
5. [Component Development](#component-development)
6. [Hooks Development](#hooks-development)
7. [Server Actions](#server-actions)
8. [Type Definitions](#type-definitions)
9. [Constants and Schemas](#constants-and-schemas)
10. [Styling Guidelines](#styling-guidelines)
11. [Git Workflow](#git-workflow)
12. [Testing and Quality](#testing-and-quality)
13. [Common Patterns and Examples](#common-patterns-and-examples)
14. [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites

- **Node.js**: Version 18 or higher
- **pnpm**: Version 10.12.1 (specified in `package.json`)
- **Git**: For version control

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd dashboard-2026
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables (if needed):
   - Copy `.env.example` to `.env.local` (if available)
   - Configure Firebase credentials and other required environment variables

### Firebase Setup

1. Install Firebase CLI (if not already installed):

   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:

   ```bash
   firebase login
   ```

3. Select the correct Firebase project:

   ```bash
   # For development
   firebase use development

   # Or for production (use with caution)
   firebase use production
   ```

4. Pull remote Firestore indexes to keep `firestore.indexes.json` in sync:

   ```bash
   firebase firestore:indexes --project=development > firestore.indexes.json
   ```

   **Important**: Run this command whenever indexes are updated remotely (via Firebase Console or CI/CD) to keep your local `firestore.indexes.json` file synchronized. Failing to do so will cause the `firebase deploy` command to fail.

### Development Server

Start the development server:

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

## Project Structure

### Root-Level Folders

```
dashboard-2026/
├── app/                    # Next.js App Router directory
├── components/             # Shared React components
│   ├── form/              # Form-specific components
│   ├── ui/                # ShadCN UI components (do not edit directly)
│   └── index.ts           # Barrel export for form components
├── config/                # Configuration files (Firebase, etc.)
├── constants/            # Application-wide constants
│   └── index.ts          # Barrel export for all constants
├── hooks/                # Shared React hooks
│   └── index.ts          # Barrel export for all hooks
├── lib/                  # Utility functions and libraries
│   └── index.ts          # Barrel export for all lib functions
├── types/                # Shared TypeScript type definitions
│   └── index.ts          # Barrel export for all types
└── data/                 # Static data files (JSON)
```

### App Directory Structure

The `app/` directory follows Next.js App Router conventions with feature-based organization:

```
app/
├── _components/          # Root-level components (Navbar, Footer, etc.)
├── dashboard/           # Dashboard route segment
│   ├── _components/     # Dashboard-specific components
│   ├── _constants/      # Dashboard-specific constants
│   ├── _hooks/          # Dashboard-specific hooks
│   ├── _lib/            # Dashboard-specific utilities
│   ├── announcements/   # Announcements feature
│   │   ├── _components/
│   │   ├── _constants/
│   │   ├── _hooks/
│   │   ├── _types/
│   │   └── page.tsx
│   ├── project/         # Project feature
│   │   ├── _components/
│   │   ├── _constants/
│   │   ├── _hooks/
│   │   ├── _lib/
│   │   ├── _schemas/
│   │   ├── _types/
│   │   └── page.tsx
│   └── ...
└── ...
```

### Feature Organization Pattern

Each feature (route segment) follows this structure:

- `_actions/` - Server actions for database operations (if applicable)
- `_components/` - React components specific to this feature
- `_hooks/` - Custom React hooks for this feature
- `_types/` - TypeScript type definitions for this feature
- `_constants/` - Constants specific to this feature
- `_lib/` - Utility functions for this feature
- `_schemas/` - Zod validation schemas (if applicable)
- `page.tsx` - Next.js page component
- `loading.tsx` - Loading UI (optional)
- `error.tsx` - Error UI (optional)

**Note**: Folders prefixed with `_` are private and not part of the URL routing.

## Code Style and Conventions

### TypeScript Standards

- **Strict Mode**: TypeScript strict mode is enabled
- **Type Safety**: Always provide explicit types; avoid `any` (warns in ESLint)
- **Unused Variables**: Prefix unused variables with `_` (e.g., `_unusedParam`)

### Import Organization

Imports are automatically sorted by ESLint's `perfectionist/sort-imports` rule:

1. **Built-in modules** (Node.js)
2. **External packages** (npm packages)
3. **Internal imports** (using `@/` alias)
4. **Parent imports** (`../`)
5. **Sibling imports** (`./`)
6. **Index imports** (barrel imports)

Within each group, imports are sorted alphabetically.

**Example:**

```typescript
import { Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";

import { useEditProjectForm } from "@/app/dashboard/project/_hooks";
import type { Project } from "@/app/dashboard/project/_types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
```

### Naming Conventions

#### Files

- **Components**: `kebab-case.tsx` (e.g., `edit-project-form.tsx`)
- **Hooks**: `use-kebab-case.ts` (e.g., `use-edit-project-form.ts`)
- **Types**: `kebab-case.types.ts` (e.g., `project.types.ts`)
- **Constants**: `kebab-case.constants.ts` (e.g., `project.constants.ts`)
- **Schemas**: `kebab-case.schemas.ts` (e.g., `create-project-form.schemas.ts`)
- **Utilities**: `kebab-case.lib.ts` (e.g., `project.lib.ts`)

#### Code

- **Components**: `PascalCase` (e.g., `EditProjectForm`)
- **Hooks**: `camelCase` with `use` prefix (e.g., `useEditProjectForm`)
- **Types**: `PascalCase` (e.g., `Project`, `UseEditProjectFormReturn`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `PROJECT_FIELDS`)
- **Functions**: `camelCase` (e.g., `getProjectDocSnapshot`)
- **Variables**: `camelCase` (e.g., `projectId`)

### Prettier Configuration

The project uses Prettier with the following settings:

- **Print Width**: 120 characters
- **Tab Width**: 2 spaces
- **Semicolons**: Required
- **Quotes**: Double quotes
- **Trailing Commas**: ES5 style

Always run `pnpm run format` before committing.

### ESLint Rules

Key ESLint rules enforced:

- **Import Sorting**: Alphabetical with grouping (enforced by `perfectionist`)
- **React Hooks**: Must follow rules of hooks
- **TypeScript**: Strict type checking
- **Accessibility**: JSX a11y rules enabled

## File Organization Patterns

### Barrel Imports

**All feature folders must use barrel imports** via `index.ts` files. This provides:

- Cleaner import statements
- Better code organization
- Easier refactoring

#### Barrel Import Structure

Each feature folder should have an `index.ts` that exports all public APIs:

**Example: `app/dashboard/project/_hooks/index.ts`**

```typescript
export { useCreateProjectDialog } from "./use-create-project-dialog";
export { useEditProjectForm } from "./use-edit-project-form";
export { useJoinProjectDialog } from "./use-join-project-dialog";
export { useLeaveProjectDialog } from "./use-leave-project-dialog";
export { useTeamMembersList } from "./use-team-members";
export type { UseCreateNewProjectDialogReturn } from "./use-create-project-form";
export type { UseEditProjectFormReturn } from "./use-edit-project-form";
// ... more type exports
```

#### When to Use Barrel Imports

✅ **Use barrel imports for:**

- Feature-level folders (`_components`, `_hooks`, `_types`, etc.)
- Root-level shared folders (`components`, `hooks`, `lib`, `types`, `constants`)

❌ **Do NOT use barrel imports for:**

- `components/ui/` - ShadCN UI components (import directly)
- Single-file folders

#### Import Examples

✅ **Good:**

```typescript
import { useEditProjectForm } from "@/app/dashboard/project/_hooks";
import type { Project } from "@/app/dashboard/project/_types";
import { PROJECT_FIELDS } from "@/app/dashboard/project/_constants";
```

❌ **Bad:**

```typescript
import { useEditProjectForm } from "@/app/dashboard/project/_hooks/use-edit-project-form";
import type { Project } from "@/app/dashboard/project/_types/project.types";
```

### Component Organization

Components within a feature are organized by purpose:

```
_components/
├── _empty-project/        # Grouped related components
│   ├── create-project-dialog.tsx
│   ├── empty-project.tsx
│   └── join-project-dialog.tsx
├── _team-members/        # Another group
│   ├── leave-project-dialog.tsx
│   ├── team-member-item.tsx
│   └── team-members-list.tsx
├── edit-project-form.tsx # Standalone component
└── index.ts              # Barrel export
```

## Component Development

### Server Components vs Client Components

**Server Components** (default in Next.js App Router):

- No `"use client"` directive
- Can directly access server resources (databases, APIs)
- Cannot use React hooks or browser APIs
- Better performance (rendered on server)

**Client Components**:

- Must include `"use client"` directive at the top
- Can use React hooks (`useState`, `useEffect`, etc.)
- Can access browser APIs
- Required for interactivity

### Component Structure

**Example Server Component:**

```typescript
import { redirect } from "next/navigation";

import { verifySession } from "@/lib";
import { DASHBOARD_PATH, LOGIN_PATH } from "@/constants";

const MyPage = async () => {
  const userId = await verifySession();
  if (!userId) redirect(LOGIN_PATH);

  return <div>Content</div>;
};

export default MyPage;
```

**Example Client Component:**

```typescript
"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

const MyComponent = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <Button onClick={() => setCount(count + 1)}>Increment</Button>
    </div>
  );
};

export default MyComponent;
```

### Props Typing

Always define explicit prop types:

```typescript
type EditProjectFormProps = {
  project: Project;
  userId: User["id"];
  onSuccess?: () => void;
};

const EditProjectForm = ({ project, userId, onSuccess }: EditProjectFormProps) => {
  // Component implementation
};
```

### ShadCN UI Components

The project uses [ShadCN UI](https://ui.shadcn.com) components. These are located in `components/ui/` and should be imported directly:

```typescript
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
```

**Important**: Do not modify files in `components/ui/` directly. If you need to customize a component, create a wrapper component.

## Hooks Development

### Hook Patterns

Custom hooks should:

1. Start with `use` prefix
2. Be exported as named exports
3. Export their return type
4. Include `"use client"` directive if they use React hooks

**Example:**

```typescript
"use client";

import { useState, useEffect } from "react";

export type UseMyHookReturn = {
  data: string | null;
  isLoading: boolean;
  error: Error | null;
};

export const useMyHook = (param: string): UseMyHookReturn => {
  const [data, setData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Hook implementation
  }, [param]);

  return { data, isLoading, error };
};
```

### Hook Barrel Exports

Always export hooks and their types from the `_hooks/index.ts` file:

```typescript
export { useMyHook } from "./use-my-hook";
export type { UseMyHookReturn } from "./use-my-hook";
```

## Server Actions

### Overview

Server actions are Next.js functions that run on the server and handle database operations securely using the Firebase Admin SDK. They provide a secure way to perform write operations that bypass Firestore security rules.

### When to Use Server Actions

✅ **Use server actions for:**

- All database write operations (create, update, delete)
- Operations that require Admin SDK privileges
- Form submissions that have server-side logic
- Operations that should bypass Firestore security rules

❌ **Do NOT use server actions for:**

- Read-only operations that need real-time updates (use `onSnapshot` with client SDK)
- Operations that don't require database access
- Client-side only operations

### Hybrid Approach: React Hook Form + Server Actions

The project uses a **hybrid approach** for forms:

1. **React Hook Form** handles client-side validation and form state
2. **Server Actions** handle database operations using Admin SDK
3. **Toast notifications** display server-side errors

This provides:

- Better UX with real-time client-side validation
- Security with server-side database operations
- Clear error handling with field-specific and general errors

### File Organization

Server actions are located in `_actions` folders within feature directories:

```
app/dashboard/project/
├── _actions/
│   ├── create-project.actions.ts
│   ├── edit-project.actions.ts
│   ├── join-project.actions.ts
│   └── leave-project.actions.ts
```

**Naming Convention**: `kebab-case.actions.ts` (e.g., `create-project.actions.ts`)

### Server Action Structure

**Basic Template:**

```typescript
"use server";

import { getFirestore } from "firebase-admin/firestore";
import { redirect } from "next/navigation";

import { USERS_COLLECTION, LOGIN_PATH, DASHBOARD_PATH } from "@/constants";
import { verifySession } from "@/lib";
import { getUserDocSnapshot } from "@/lib/user.lib";
import type { ActionResult } from "@/types";

import { type MyFormSchema } from "../_schemas/my-form.schemas";

export type MyActionResult = ActionResult<MyFormSchema>;

export const myAction = async (data: MyFormSchema): Promise<MyActionResult> => {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PATH)}`);

  const db = getFirestore();
  const now = Date.now();

  try {
    // Validate user exists
    const userDocSnapshot = await getUserDocSnapshot(userId);
    if (!userDocSnapshot.exists) {
      return {
        success: false,
        error: "User document not found",
      };
    }

    // Perform database operations
    // ...

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Action error:", errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
};
```

### Using ActionResult Type

The project uses a generic `ActionResult<T>` type for consistent error handling:

```typescript
import type { ActionResult } from "@/types";

// For forms with field validation
export type MyFormResult = ActionResult<MyFormSchema>;

// For non-form operations (no field property)
export type MyActionResult = ActionResult;
```

**Result Structure:**

- **Success**: `{ success: true }`
- **Error with field**: `{ success: false; error: string; field?: keyof FormSchema }`
- **Error without field**: `{ success: false; error: string }`

### Error Handling Patterns

**In Server Actions:**

```typescript
// Field-specific error (for form validation)
if (!isValid) {
  return {
    success: false,
    error: "Invalid input",
    field: "fieldName", // Only available when ActionResult<FormSchema>
  };
}

// General error
if (!exists) {
  return {
    success: false,
    error: "Resource not found",
  };
}
```

**In Hooks (Client-Side):**

```typescript
const onSubmit = async (data: FormSchema) => {
  try {
    const result = await myAction(data);
    const { success } = result;

    if (!success) {
      const { field, error } = result;

      if (field) {
        // Field-specific error - set on form field
        setError(field, {
          type: "server",
          message: error,
        });
      } else {
        // General error - show toast
        toast.error("Operation failed", { description: error });
      }
      return;
    }

    // Success - refresh or redirect
    router.refresh();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    toast.error("Operation failed", { description: errorMessage });
  }
};
```

### Authentication and Authorization

**Always verify session in server actions:**

```typescript
const userId = await verifySession();
if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(TARGET_PATH)}`);
```

**Check user permissions:**

```typescript
const userDocSnapshot = await getUserDocSnapshot(userId);
if (!userDocSnapshot.exists) {
  return { success: false, error: "User not found" };
}

// Check ownership or permissions
if (userId !== ownerId) {
  return { success: false, error: "Permission denied" };
}
```

### Integration with React Hook Form

**Hook Pattern:**

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { myAction } from "../_actions/my-action.actions";
import { myFormSchema, type MyFormSchema } from "../_schemas/my-form.schemas";

export const useMyForm = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm<MyFormSchema>({
    resolver: zodResolver(myFormSchema),
    defaultValues: {
      // ...
    },
  });

  const onSubmit: SubmitHandler<MyFormSchema> = async (data) => {
    try {
      const result = await myAction(data);
      const { success } = result;

      if (!success) {
        const { field, error } = result;

        if (field) {
          setError(field, {
            type: "server",
            message: error,
          });
        } else {
          toast.error("Operation failed", { description: error });
        }
        return;
      }

      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error("Operation failed", { description: errorMessage });
    }
  };

  return { control, handleSubmit, onSubmit, isSubmitting };
};
```

### Best Practices

1. **Always use Admin SDK** in server actions (never client SDK)
2. **Verify session** at the start of every server action
3. **Return structured errors** using `ActionResult` type
4. **Handle redirects** for unauthenticated users
5. **Use try-catch** for error handling
6. **Log errors** to console for debugging
7. **Validate permissions** before performing operations
8. **Use timestamps** (`Date.now()`) for `created_at` and `updated_at`
9. **Keep actions focused** - one action per operation
10. **Export result types** for type safety

## Type Definitions

### Type vs Interface

Prefer `type` over `interface` for consistency:

```typescript
// Good
export type Project = BaseModel & {
  name: string;
  description: string;
};

// Also acceptable, but prefer type
export interface Project extends BaseModel {
  name: string;
  description: string;
}
```

### Export Patterns

**Always use named exports** for types:

```typescript
// Good
export type { Project, TeamMember } from "./project.types";

// Bad
export type { default as Project } from "./project.types";
```

### Type Organization

Types should be organized in `_types` folders with descriptive file names:

```
_types/
├── project.types.ts
├── team-member.types.ts
└── index.ts
```

**Example type file:**

```typescript
import type { BaseModel, User } from "@/types";

export type Project = BaseModel & {
  name: string;
  description: string;
  owner_id: User["id"];
};

export type TeamMember = BaseModel & {
  user_id: User["id"];
  project_id: Project["id"];
  role: "owner" | "member";
};
```

## Constants and Schemas

### Constants Organization

Constants are organized by domain in `_constants` folders:

```typescript
import type { Project } from "@/app/dashboard/project/_types";

export const PROJECT_FIELDS = {
  name: "name",
  description: "description",
  // ...
} as const satisfies Record<keyof Omit<Project, "id">, string>;
```

**Naming**: Use `UPPER_SNAKE_CASE` for constants.

### Zod Schemas

Validation schemas use Zod and are located in `_schemas` folders:

```typescript
import { z } from "zod";

export const createProjectFormSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Project description is required"),
  github_url: z.url().optional().or(z.literal("")),
});

export type CreateProjectFormSchema = z.infer<typeof createProjectFormSchema>;
```

**Pattern**: Export both the schema and the inferred type.

## Git Workflow

### Branch Naming

Use descriptive branch names with your Github username:

- `feature/<github-username>/add-user-profile` - New features
- `fix/<github-username>/login-redirect-issue` - Bug fixes
- `refactor/<github-username>/improve-project-hooks` - Refactoring
- `docs/<github-username>/update-contributing-guide` - Documentation

### Commit Messages

Follow conventional commit format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**

```
feat(project): add project creation dialog

fix(auth): resolve session expiration issue

docs: update contributing guide with barrel import examples
```

### Pull Request Process

1. **Create a branch** from `main`
2. **Make your changes** following this guide
3. **Run quality checks**:
   ```bash
   pnpm run lint
   pnpm run format:check
   pnpm run build
   ```
4. **Commit your changes** with descriptive messages
5. **Push to your branch** and create a Pull Request
6. **Ensure CI passes** (linting and formatting checks)
7. **Address review feedback** if needed

### Code Review Expectations

- All code must pass linting and formatting checks
- Follow the project's code style and conventions
- Include appropriate type definitions
- Update barrel imports if adding new exports
- Add comments for complex logic
- Ensure components are accessible

## Testing and Quality

### Pre-Commit Checklist

Before committing, ensure:

- [ ] Code passes `pnpm run lint`
- [ ] Code is formatted (`pnpm run format:check`)
- [ ] Application builds successfully (`pnpm run build`)
- [ ] No TypeScript errors
- [ ] Barrel imports are updated if needed
- [ ] New components/hooks/types are exported from `index.ts`

### Linting

Run the linter:

```bash
pnpm run lint
```

Fix issues automatically:

```bash
pnpm run lint:fix
```

### Formatting

Check formatting:

```bash
pnpm run format:check
```

Format code:

```bash
pnpm run format
```

### Build Verification

Always verify the build before committing:

```bash
pnpm run build
```

## Common Patterns and Examples

### Creating a New Feature

1. **Create the route segment**:

   ```
   app/dashboard/my-feature/
   ```

2. **Set up folder structure**:

   ```
   app/dashboard/my-feature/
   ├── _actions/          # Server actions (if needed)
   │   └── my-action.actions.ts
   ├── _components/
   │   └── index.ts
   ├── _hooks/
   │   └── index.ts
   ├── _types/
   │   └── index.ts
   ├── _constants/
   │   └── index.ts
   ├── _schemas/
   │   └── index.ts
   ├── _lib/
   └── page.tsx
   ```

3. **Create barrel exports** in each `index.ts` file

4. **Implement your feature** following the patterns above

### Adding a New Component

1. **Create the component file**:

   ```typescript
   "use client"; // If needed

   import { Button } from "@/components/ui/button";

   type MyComponentProps = {
     // props
   };

   const MyComponent = ({ ...props }: MyComponentProps) => {
     // implementation
   };

   export default MyComponent;
   ```

2. **Export from barrel file**:

   ```typescript
   // _components/index.ts
   export { default as MyComponent } from "./my-component";
   ```

3. **Use the component**:
   ```typescript
   import { MyComponent } from "@/app/dashboard/my-feature/_components";
   ```

### Adding a New Hook

1. **Create the hook file**:

   ```typescript
   "use client";

   export type UseMyHookReturn = {
     // return type
   };

   export const useMyHook = (): UseMyHookReturn => {
     // implementation
   };
   ```

2. **Export from barrel file**:
   ```typescript
   // _hooks/index.ts
   export { useMyHook } from "./use-my-hook";
   export type { UseMyHookReturn } from "./use-my-hook";
   ```

### Updating Barrel Imports

When adding new exports:

1. **Add the export** to the appropriate `index.ts`:

   ```typescript
   export { newComponent } from "./new-component";
   export type { NewComponentProps } from "./new-component";
   ```

2. **Ensure alphabetical ordering** (ESLint will enforce this)

3. **Update imports** in files that use the new export to use the barrel import

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [ShadCN UI Documentation](https://ui.shadcn.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Zod Documentation](https://zod.dev)

---

Thank you for contributing to WildHacks Dashboard 2026! 🚀
