# Bun Expense Tracker

A server-side rendered React expense tracker built with Bun, Tailwind CSS, and shadcn/ui.

## Features

- ⚡ **Bun Runtime** - Fast all-in-one JavaScript runtime
- ⚛️ **React SSR** - Server-side rendering with React
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🧩 **shadcn/ui** - Beautiful, accessible component library

## Getting Started

### Install Dependencies

```bash
bun install
```

### Run Development Server

```bash
bun run dev
```

The server will start on `http://localhost:3000`

### Run Production Server

```bash
bun run start
```

## Adding shadcn/ui Components

To add more shadcn/ui components, you can:

1. **Manual Installation**: Copy component code from [shadcn/ui](https://ui.shadcn.com) into `src/components/ui/`

2. **Using CLI** (if available): The project is configured with `components.json` for shadcn/ui CLI compatibility

Example components are already set up:

- `Button` - Located in `src/components/ui/button.tsx`

## Technologies

- [Bun](https://bun.com) - JavaScript runtime
- [React](https://react.dev) - UI library
- [Tailwind CSS](https://tailwindcss.com) - CSS framework
- [shadcn/ui](https://ui.shadcn.com) - Component library
- [TypeScript](https://www.typescriptlang.org) - Type safety
