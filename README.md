# Bug Reporter - Take-Home Assignment

## Setup & Run

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

Then from the root:

```bash
npm run dev
```

- **Client:** http://localhost:5173
- **Server:** http://localhost:4000

## Test Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | admin123 | Admin |
| user@example.com | password123 | User |

## Project Structure

```
bug-reporter-starter/
├── client/          # React + TypeScript (Vite)
│   └── src/
│       ├── api/         # API client
│       ├── components/  # Shared components
│       ├── context/     # Auth context
│       ├── hooks/       # Custom hooks (usePagination)
│       ├── pages/       # Page components
│       └── types/       # TypeScript types
└── server/          # Express + TypeScript
    ├── src/         # Server code
    └── uploads/     # Uploaded attachments
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | Authenticate with email + password |
| GET | `/api/reports` | Get all reports |
| POST | `/api/reports` | Create a new report (multipart/form-data) |
| POST | `/api/reports/:id/approve` | Approve a report (admin only) |
| POST | `/api/reports/:id/resolve` | Resolve a report (admin only) |
| GET | `/api/health` | Health check |

## Data Model

```typescript
interface Report {
  id: string;
  issueType: string;
  description: string;
  contactName: string;
  contactEmail: string;
  status: 'NEW' | 'APPROVED' | 'RESOLVED';
  createdAt: number;
  approvedAt?: number;
  attachmentUrl: string;
}
```

## Performance Issue: Validation Bottleneck

### What the issue was

`ReportPage.tsx` contained a `validateField` function that was called on every keystroke in the description and name fields. On each call it:

1. Created a 10,000-item array
2. Ran a loop 100 times, each iteration sorting the entire array (O(n log n)), filtering it, and mapping it

This meant typing a single character triggered ~1,000,000 string operations synchronously on the main thread, causing the UI to freeze and making the form effectively unusable.

```typescript
// The problematic code
function validateField(value: string): string[] {
  const largeArray = Array.from({ length: 10000 }, (_, i) => `item-${i}-${value}`);
  for (let i = 0; i < 100; i++) {
    largeArray.sort(() => Math.random() - 0.5);
    largeArray.filter(item => item.includes(value.slice(0, 3)));
    largeArray.map(item => item.toUpperCase().toLowerCase());
  }
  if (value.length < 3) issues.push('Must be at least 3 characters');
  return issues;
}
```

### How it was detected

Code review — the function's actual validation logic (a simple `length < 3` check) was completely unrelated to the expensive array operations above it, making it immediately identifiable as an intentional bottleneck.

### What was changed

Replaced `validateField` and all manual state management with **React Hook Form** + **Zod** schema validation:

- Zod schema defines all validation rules declaratively in one place
- React Hook Form uses uncontrolled inputs — no re-render on every keystroke
- Validation runs only on blur and on submit, not on every change event
- The 10,000-item array and 100-iteration loop were removed entirely

### Before vs. after

| | Before | After |
|---|---|---|
| Operations per keystroke | ~1,000,000 array ops | 0 (uncontrolled input) |
| Validation trigger | Every keystroke | On blur / submit |
| UI during typing | Freezes | Instant response |
| Bundle overhead | None | `react-hook-form` + `zod` (~13kb gzipped) |

## Environment Variables

Client `.env` (already configured):
```
VITE_API_BASE_URL=http://localhost:4000
```
