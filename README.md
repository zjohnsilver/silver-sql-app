# Silver SQL App - Frontend

Frontend Next.js application for Silver SQL Console - a SQL query execution interface.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI)
- **Styling**: styled-components
- **Code Editor**: Monaco Editor
- **HTTP Client**: Axios

## Features

- Client selector with search functionality
- SQL editor with syntax highlighting (Monaco)
- Query execution with configurable limits and timeouts
- Tabular results display with virtualization
- CSV export functionality
- Execution messages and error handling
- Connection status management

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Update API URL in .env.local if needed
```

### Development

```bash
# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
# Create production build
pnpm build

# Start production server
pnpm start
```

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:8000)

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
├── lib/             # Utilities and API client
├── types/           # TypeScript type definitions
└── styles/          # Global styles
```

## License

MIT

