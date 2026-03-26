# AnimateUI - Animated Component Library & Playground

A comprehensive animated UI component library with an interactive live playground. Explore 20+ beautifully crafted, production-ready React components with smooth animations, full accessibility, and real-time prop editing.

## Features

- **20+ Animated Components** - Production-ready components with Framer Motion spring physics, staggered reveals, and GPU-accelerated animations
- **Interactive Playground** - Live prop editor with toggles, sliders, dropdowns, and real-time preview
- **Code Preview** - Shiki syntax-highlighted code snippets with copy-to-clipboard (Usage, Component, and TypeScript Types views)
- **Searchable Navigation** - Fuzzy search sidebar with category grouping and keyboard shortcuts (Cmd+J)
- **Dark & Light Mode** - CSS custom properties for seamless theme switching
- **Fully Accessible** - WCAG AA compliant with keyboard navigation, ARIA attributes, focus management, and prefers-reduced-motion support

## Components

| Category       | Components                                                    |
| -------------- | ------------------------------------------------------------- |
| **Basic**      | Magnetic Button, Badge/Chip, Avatar Group                     |
| **Input**      | Dropdown Menu, Toggle Switch, Rating Stars, File Upload       |
| **Feedback**   | Spring Modal, Toast Notifications, Tooltip, Skeleton, Progress Bar |
| **Layout**     | Accordion, Card 3D Tilt, Drawer                               |
| **Navigation** | Tabs, Command Palette, Breadcrumb, Stepper, Pagination        |

## Tech Stack

- **Next.js 15** with App Router & TypeScript
- **Framer Motion** for spring-based animations
- **Radix UI** for accessible headless primitives
- **Tailwind CSS** with CSS custom properties for theming
- **Shiki** for syntax highlighting
- **Lucide React** for icons

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to explore the playground.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home page with component grid
│   └── components/
│       └── [componentId]/  # Dynamic playground page
├── components/
│   ├── ui/                 # 20 animated UI components
│   ├── playground/         # PropEditor, ComponentPreview, CodeSnippet
│   └── layout/             # Header, NavigationSidebar, MainLayout
├── data/
│   └── componentConfig.ts  # Component metadata & prop definitions
├── lib/
│   ├── animations.ts       # Spring configs & animation presets
│   ├── hooks.ts            # Custom hooks (mouse position, clipboard, etc.)
│   └── utils.ts            # Utility functions (cn, clsx)
└── styles/
    └── globals.css          # Global styles & CSS variables
```

## License

MIT
