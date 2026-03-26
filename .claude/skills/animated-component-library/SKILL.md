---
name: animated-component-library
description: Build an animated UI component library with a live interactive playground, featuring 20+ beautifully animated components (magnetic buttons, spring modals, stagger toasts, sliding tabs, accordion, dropdown) with real-time prop editing and code snippets. Use this skill when building component libraries, design systems, UI kit showcases, or animated component playgrounds. Trigger when the user mentions component library, animated components, UI playground, design system, component showcase, reusable animated UI, or interactive component demos.
---

# Animated Component Library & Playground

## Overview
Build a comprehensive, production-ready animated component library with an interactive live playground. This skill creates a showcase of 20+ beautifully crafted, reusable animated components with real-time prop editing, code preview, and accessibility standards.

## Technology Stack
- **Framework**: Next.js 15 with TypeScript
- **Animation**: Framer Motion (primary), GSAP (advanced sequences)
- **UI Primitives**: Radix UI (headless, unstyled, accessible)
- **Styling**: Tailwind CSS with CSS custom properties
- **Code Highlighting**: Shiki (syntax highlighting)
- **Icons**: Lucide React
- **Fonts**: JetBrains Mono (code), Inter (UI)
- **Build Tools**: Turbopack, SWC

## Project Structure
```
07-animated-component-library/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── MagneticButton.tsx
│   │   │   ├── SpringModal.tsx
│   │   │   ├── ToastNotification.tsx
│   │   │   ├── Accordion.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── ToggleSwitch.tsx
│   │   │   ├── SkeletonLoader.tsx
│   │   │   ├── CardHover.tsx
│   │   │   ├── Drawer.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── AvatarGroup.tsx
│   │   │   ├── CommandPalette.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   ├── Stepper.tsx
│   │   │   ├── RatingStars.tsx
│   │   │   ├── Pagination.tsx
│   │   │   └── FileUpload.tsx
│   │   ├── playground/
│   │   │   ├── ComponentPreview.tsx
│   │   │   ├── PropEditor.tsx
│   │   │   ├── CodeSnippet.tsx
│   │   │   └── NavigationSidebar.tsx
│   │   └── layout/
│   │       └── MainLayout.tsx
│   ├── lib/
│   │   ├── animations.ts
│   │   ├── hooks.ts
│   │   └── utils.ts
│   ├── data/
│   │   └── componentConfig.ts
│   └── pages/
│       ├── index.tsx
│       └── component/[id].tsx
├── public/
│   └── fonts/
├── tailwind.config.ts
└── next.config.ts
```

## Component Specifications

### 1. Magnetic Button
- **Behavior**: Elements pull toward cursor when within proximity (50px threshold)
- **Animation**: Spring physics using Framer Motion (`type: "spring"`)
- **Variants**: Filled button, outline button, icon-only button
- **Props**:
  - `variant`: 'filled' | 'outline' | 'icon'
  - `size`: 'sm' | 'md' | 'lg'
  - `magnetRadius`: number (default: 50)
  - `springConfig`: { stiffness, damping, mass }
- **Code**: Use `useMousePosition()` hook to track cursor, `useSpring()` for smooth motion
- **Hover state**: Scale increases, shadow expands
- **Click state**: Brief bounce animation

### 2. Spring Modal
- **Entry**: Scale from 0.95 with backdrop blur (12px)
- **Exit**: Reverse animation with `AnimatePresence`
- **Backdrop**: Blur + dim overlay, clickable to close
- **Props**:
  - `isOpen`: boolean
  - `onClose`: () => void
  - `title`: string
  - `size`: 'sm' | 'md' | 'lg'
  - `closeOnBackdropClick`: boolean
  - `springConfig`: spring config object
- **Content**: Scrollable if overflow
- **Close button**: X icon with subtle rotate on hover
- **Z-index**: Portal rendering with proper stacking

### 3. Toast Notifications
- **Enter**: Slide in from right (x: 400px → 0)
- **Stack**: Multiple toasts align bottom-right with spacing
- **Auto-dismiss**: 5 second duration (configurable)
- **Swipe**: Drag to dismiss with velocity-based exit
- **Props**:
  - `variant`: 'success' | 'error' | 'warning' | 'info'
  - `title`: string
  - `description`: string (optional)
  - `duration`: number (ms)
  - `icon`: React.ReactNode
  - `onDismiss`: () => void
- **Colors**: Green (success), red (error), amber (warning), blue (info)
- **Auto-dismiss**: Progress bar animation filling from full to empty
- **Position**: Fixed bottom-right with safe spacing

### 4. Accordion
- **Height Animation**: Smooth `maxHeight` animation with easing
- **Chevron**: Rotate 180° on expand/collapse
- **Multiple**: Allow single or multiple open items
- **Props**:
  - `items`: Array<{ id, title, content }>
  - `defaultOpen`: string[] (ids)
  - `allowMultiple`: boolean
  - `variant`: 'default' | 'bordered' | 'flushed'
- **Keyboard**: Tab navigation, Enter/Space to toggle
- **Focus**: Visible focus indicator on headers
- **Content**: Fade in/out with height animation

### 5. Tabs
- **Active Indicator**: Sliding underline using `layoutId` (Framer Motion)
- **Content**: Crossfade between tabs (opacity + exit)
- **Props**:
  - `tabs`: Array<{ id, label, content }>
  - `defaultActive`: string
  - `variant`: 'underline' | 'pills' | 'bordered'
  - `animated`: boolean
- **Keyboard**: Arrow keys to navigate, Home/End for first/last
- **Indicator**: Smooth slide animation following active tab
- **Content wrapper**: Fade animation on tab change

### 6. Dropdown Menu
- **Items**: Staggered reveal with scale + opacity (container: `initial`, `animate`, `exit`)
- **Stagger**: `staggerChildren: 0.05`
- **Animation timing**: 150-200ms per item
- **Props**:
  - `items`: Array<{ label, icon?, onClick }>
  - `trigger`: React.ReactNode
  - `align`: 'left' | 'right'
  - `onItemClick`: (item) => void
- **Keyboard**: Arrow keys up/down, Enter to select, Esc to close
- **Portal**: Renders in portal for proper stacking
- **Backdrop**: Click outside to close

### 7. Tooltip
- **Animation**: Fade + subtle Y translate (10px)
- **Arrow**: Points to reference element, animates with popup
- **Props**:
  - `content`: string | React.ReactNode
  - `side`: 'top' | 'right' | 'bottom' | 'left'
  - `delay`: number
  - `variant`: 'default' | 'dark' | 'light'
- **Positioning**: Radix UI Tooltip for automatic positioning
- **Delay**: Configurable entry/exit delay
- **Responsive**: Hide on mobile

### 8. Toggle Switch
- **Slide**: Spring-animated track indicator
- **Color**: Morph from gray to accent on toggle
- **Props**:
  - `checked`: boolean
  - `onChange`: (checked: boolean) => void
  - `size`: 'sm' | 'md' | 'lg'
  - `disabled`: boolean
  - `label`: string (optional)
- **Accessibility**: ARIA attributes, keyboard control
- **Indicator**: Smooth slide with spring easing

### 9. Skeleton Loader
- **Shimmer**: Gradient animation moving left-to-right
- **Variants**: Line, card, avatar, text block
- **Props**:
  - `variant`: 'line' | 'card' | 'avatar' | 'block'
  - `count`: number
  - `width`: string (optional)
  - `height`: string (optional)
- **Gradient**: Linear gradient at 30° angle, animated via background-position
- **Loop**: Infinite animation, 2-3 second cycle
- **Rounded**: Tailwind rounded utilities

### 10. Card Hover 3D Tilt
- **Perspective**: 3D transform with perspective depth
- **Tilt**: Rotate on X/Y based on mouse position within card
- **Shadow**: Shadow follows tilt angle
- **Props**:
  - `children`: React.ReactNode
  - `intensity`: number (default: 0.5)
  - `scale`: boolean
  - `blur`: boolean
- **Mouse tracking**: Calculate angle based on position within container
- **Reset**: Spring back to neutral on mouse leave
- **Performance**: Use `transform: translateZ()` for GPU acceleration

### 11. Drawer
- **Slide**: From left/right/top/bottom with backdrop
- **Dismiss**: Click backdrop, swipe gesture, or close button
- **Props**:
  - `isOpen`: boolean
  - `onClose`: () => void
  - `side`: 'left' | 'right' | 'top' | 'bottom'
  - `size`: 'sm' | 'md' | 'lg'
  - `title`: string (optional)
- **Content**: Scrollable with proper spacing
- **Gesture**: Swipe detection using Framer Motion drag
- **Z-index**: Proper layering with backdrop

### 12. Progress Bar
- **Fill**: Animated width change with gradient shimmer
- **Shimmer**: Subtle moving gradient within filled area
- **Props**:
  - `value`: number (0-100)
  - `animated`: boolean
  - `striped`: boolean
  - `color`: 'blue' | 'green' | 'red' | 'orange'
  - `size`: 'sm' | 'md' | 'lg'
- **Indeterminate**: Infinite sliding animation for loading state
- **Transition**: Smooth value transition (300-500ms)

### 13. Badge/Chip
- **Pop-in**: Scale from 0.8 → 1.0 with spring bounce
- **Entry**: Staggered if multiple badges
- **Props**:
  - `label`: string
  - `variant`: 'default' | 'success' | 'error' | 'warning'
  - `removable`: boolean
  - `onRemove`: () => void
  - `size`: 'sm' | 'md' | 'lg'
- **Remove**: Slide out and fade on dismiss
- **Colors**: Predefined palette per variant

### 14. Avatar Group
- **Overlap**: Negative margin for clustered layout
- **Hover**: Group expands to show all avatars
- **Props**:
  - `avatars`: Array<{ name, src, color }>
  - `maxVisible`: number
  - `size`: 'sm' | 'md' | 'lg'
  - `onClick`: (avatar) => void
- **Expansion**: Staggered slide animation on hover
- **Tooltip**: Shows name on hover of each avatar

### 15. Command Palette
- **Entry**: Scale up (0.9 → 1.0) with blur backdrop
- **Search**: Fuzzy search with highlight matching
- **Props**:
  - `isOpen`: boolean
  - `onClose`: () => void
  - `commands`: Array<{ id, label, icon?, description?, action }>
  - `onCommandSelect`: (command) => void
- **Keyboard**: Cmd+K to open, arrow keys to navigate, Enter to select
- **Results**: Highlight matching text in yellow
- **Categories**: Group commands by category
- **Description**: Show keyboard shortcut hints

### 16. Breadcrumb
- **Trail**: Slide-in animation for each item
- **Stagger**: Sequential reveal with 50-100ms delay
- **Props**:
  - `items`: Array<{ label, href? }>
  - `currentIndex`: number
- **Separator**: Animated chevron or slash between items
- **Mobile**: Collapse to show only current + last item

### 17. Stepper
- **Line**: Draw animation of connecting line between steps
- **Steps**: Pop-in scale animation on load
- **Props**:
  - `steps`: Array<{ label, description? }>
  - `currentStep`: number
  - `variant`: 'vertical' | 'horizontal'
- **Completed**: Checkmark icon with scale bounce animation
- **Active**: Highlight with scale increase
- **Colors**: Gray (pending), blue (active), green (completed)

### 18. Rating Stars
- **Sequential Fill**: Each star fills on hover with staggered timing
- **Scale Bounce**: Scale up (1.3x) on fill with spring easing
- **Props**:
  - `value`: number (0-5)
  - `onChange`: (rating: number) => void
  - `size`: 'sm' | 'md' | 'lg'
  - `interactive`: boolean
- **Colors**: Yellow/gold when filled, gray when empty
- **Hover**: Show rating text below stars

### 19. Pagination
- **Number Transition**: Slide + fade between page changes
- **Active**: Highlight with underline animation
- **Props**:
  - `currentPage`: number
  - `totalPages`: number
  - `onPageChange`: (page: number) => void
  - `maxVisible`: number
- **Ellipsis**: Show ... for skipped pages
- **Keyboard**: Left/Right arrow keys to navigate

### 20. File Upload
- **Drag Zone**: Pulse animation when dragging over
- **Drop**: Scale up briefly on drop
- **Progress**: Ring animation filling as file uploads
- **Props**:
  - `onFilesSelected`: (files: File[]) => void
  - `accept`: string
  - `multiple`: boolean
  - `maxSize`: number (bytes)
- **Feedback**: Success checkmark animation
- **Error**: Shake animation with red flash

## Playground Features

### Component Preview Panel
- Large viewport showing selected component
- Default state + interactive prop controls
- Multiple component instances side-by-side for comparison
- Responsive preview mode (mobile, tablet, desktop)
- Dark/light mode toggle affecting preview

### Prop Editor
- **Boolean toggles**: Switch true/false
- **Select dropdowns**: Choose from enum values
- **Number sliders**: Adjust numeric values with live preview
- **Text inputs**: Enter string values
- **Color picker**: Visual color selection for color props
- **Component refresh**: Hot-reload on prop change (no full page refresh)

### Code Snippet Display
- Shiki syntax highlighting with TypeScript language
- Copy button with success feedback (green checkmark)
- Show both component usage and prop interface
- Option to view: "Usage" | "Component Code" | "TypeScript Types"
- Tailwind class preview for styled components

### Navigation Sidebar
- Scrollable list of all 20+ components
- Search/filter input at top (fuzzy search)
- Active indicator (border-left highlight)
- Category grouping: Basic, Input, Feedback, Layout, Navigation
- Collapsible sections for organization
- Keyboard shortcut hints (Cmd+J to open search)

## Animation Patterns

### Spring Configuration
```typescript
const springConfig = {
  type: "spring",
  stiffness: 300,    // 200-400 range
  damping: 25,       // 20-50 range
  mass: 1,           // 0.5-2 range
};
```

### Stagger Container Pattern
```typescript
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};
```

### Layout Animation (Tabs/Dropdown indicator)
```typescript
// Use layoutId for shared layout animations
<motion.div layoutId="underline" />
```

## Styling Approach

### CSS Variables for Theming
```css
:root {
  --color-primary: #3b82f6;
  --color-success: #10b981;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f9fafb;
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] {
  --color-bg-primary: #0f172a;
  --color-bg-secondary: #1e293b;
  --color-text-primary: #f1f5f9;
  --color-text-secondary: #cbd5e1;
}
```

### Tailwind Extensions
```typescript
// tailwind.config.ts
export default {
  extend: {
    animation: {
      shimmer: "shimmer 2s infinite",
      pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      slide: "slide 0.3s ease-out",
    },
    keyframes: {
      shimmer: {
        "0%": { backgroundPosition: "-1000px 0" },
        "100%": { backgroundPosition: "1000px 0" },
      },
    },
  },
};
```

## Accessibility Standards

- **ARIA**: Proper roles, states, and properties on all components
- **Keyboard**: Tab navigation, arrow keys, Enter/Space for activation
- **Focus**: Visible focus indicators (3px outline in primary color)
- **Color contrast**: WCAG AA minimum 4.5:1 for text
- **Screen reader**: Semantic HTML, descriptive labels
- **Reduced motion**: Respect `prefers-reduced-motion` media query

### Focus Management
```typescript
import { useRef, useEffect } from "react";

export function useFocusVisible(deps = []) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, deps);

  return ref;
}
```

### Keyboard Navigation Hook
```typescript
export function useKeyPress(targetKey: string, onPress: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        event.preventDefault();
        onPress();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [targetKey, onPress]);
}
```

## Performance Optimization

- **Code Splitting**: Each component page lazy-loaded with `next/dynamic`
- **Playground Preview**: Use `React.memo()` to prevent unnecessary re-renders
- **Animation Optimization**: GPU-accelerated transforms (transform, opacity only)
- **Font Loading**: System font stack fallback, Web Font Loader for custom fonts
- **Image Optimization**: Use `next/image` for playground screenshots
- **Build**: Turbopack for fast HMR during development

## Development Workflow

### Component Creation Template
```typescript
// src/components/ui/NewComponent.tsx
import { forwardRef } from "react";
import { motion } from "framer-motion";

interface NewComponentProps {
  // Props interface
}

export const NewComponent = forwardRef<HTMLDivElement, NewComponentProps>(
  ({ ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        {...props}
      >
        {/* Component content */}
      </motion.div>
    );
  }
);

NewComponent.displayName = "NewComponent";
```

### Component Configuration Entry
```typescript
// src/data/componentConfig.ts
export const componentConfig = [
  {
    id: "magnetic-button",
    name: "Magnetic Button",
    category: "Basic",
    description: "Button that pulls toward cursor with spring physics",
    props: [
      {
        name: "variant",
        type: "select",
        options: ["filled", "outline", "icon"],
        default: "filled",
      },
      {
        name: "magnetRadius",
        type: "number",
        min: 10,
        max: 200,
        default: 50,
      },
    ],
  },
  // ... more components
];
```

## Free Resources & Dependencies

- **Radix UI**: Headless UI primitives (unstyled, fully accessible)
- **Lucide React**: 400+ icon set
- **Google Fonts**: Inter, JetBrains Mono, Syne
- **Shiki**: Syntax highlighting (MIT license)
- **Framer Motion**: Animation library (MIT)
- **GSAP**: Advanced animation engine (license-friendly for web)

## Deployment

- **Vercel**: One-click deploy with Next.js optimizations
- **Environment**: Node 18+
- **Build time**: < 2 minutes
- **Bundle size**: Optimized with tree-shaking, ~150KB initial JS (gzipped)

## Future Enhancements

- Component variants (dark mode versions)
- Copy component code to clipboard
- Code sandbox integration (CodeSandbox, StackBlitz)
- Performance profiler for animations
- Mobile gesture support for all components
- Internationalization (i18n) for labels
- Component stories with Storybook integration
- Export component library as npm package
