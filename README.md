# HillviewTV Web

The official website for HillviewTV - a Next.js application for streaming and showcasing video productions.

## Prerequisites

- [Node.js](https://nodejs.org/) 20.x or higher
- [dev CLI](https://github.com/devcli/dev) (recommended)

## Setup

1. Clone the repository:

```bash
git clone https://github.com/aidenappl/hillview-tv-web.git
cd hillview-tv-web
```

2. Copy the environment file and configure it:

```bash
cp .env.example .env
```

3. Install dependencies:

```bash
dev install
# or
npm install
```

## Development

Start the development server:

```bash
dev dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Commands

Using the `dev` CLI (recommended):

| Command            | Description                              |
| ------------------ | ---------------------------------------- |
| `dev dev`          | Start development server                 |
| `dev build`        | Build for production                     |
| `dev start`        | Start production server                  |
| `dev lint`         | Run ESLint                               |
| `dev lint-fix`     | Fix ESLint issues automatically          |
| `dev format`       | Format code with Prettier                |
| `dev format-check` | Check code formatting                    |
| `dev typecheck`    | Run TypeScript type checking             |
| `dev check`        | Run all checks (lint, format, typecheck) |
| `dev clean`        | Remove build artifacts and node_modules  |
| `dev ci`           | Run full CI pipeline locally             |

## Project Structure

```
├── components/       # React components
├── hooks/            # Custom React hooks
├── pages/            # Next.js pages and API routes
├── public/           # Static assets
├── services/         # API services and utilities
├── styles/           # CSS and Tailwind styles
└── Devfile.yaml      # Dev CLI configuration
```

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Video.js](https://videojs.com/) - Video player
- [Font Awesome](https://fontawesome.com/) - Icons

## Deployment

The application is designed to be deployed on [Vercel](https://vercel.com).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## License

Private - All rights reserved.
