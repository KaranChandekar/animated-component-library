# Animated Component Library & Playground - Claude Code Prompt

You are building a comprehensive animated UI component library with an interactive live playground. This is a production-ready design system showcasing 20+ beautifully animated, reusable components.

## Objectives

1. **Component Library**: Create 20+ animated components with Framer Motion, GSAP, and Radix UI primitives
   - Magnetic Button, Spring Modal, Toast Notifications, Accordion, Tabs
   - Dropdown, Tooltip, Toggle Switch, Skeleton Loader, Card 3D Tilt
   - Drawer, Progress Bar, Badge/Chip, Avatar Group, Command Palette
   - Breadcrumb, Stepper, Rating Stars, Pagination, File Upload

2. **Interactive Playground**: Build a live prop editor where users can:
   - Toggle boolean props with switches
   - Select from dropdown enum values
   - Adjust numeric values with sliders
   - See real-time component preview changes
   - Copy component code with syntax highlighting

3. **Code Preview**: Display Shiki-highlighted component usage code with:
   - Copy-to-clipboard button with success feedback
   - Toggle between "Usage", "Component Code", and "TypeScript Types" views
   - Show import statements and prop interfaces

4. **Navigation**: Implement sidebar with:
   - Searchable component list (fuzzy search)
   - Category grouping (Basic, Input, Feedback, Layout, Navigation)
   - Active indicator and keyboard shortcuts

## Technical Requirements

### Stack
- **Next.js 15** with TypeScript
- **Framer Motion** for smooth animations (springs, stagger)
- **GSAP** for complex sequential animations
- **Radix UI** headless components for accessibility
- **Tailwind CSS** with CSS custom properties for theming
- **Shiki** for syntax highlighting
- **Lucide React** for icons

### Key Features per Component

**Magnetic Button**: Spring-based cursor proximity detection, hover scale, click bounce

**Spring Modal**: Scale from 0.95, backdrop blur, AnimatePresence exit, keyboard close (Esc)

**Toast Notifications**: Slide from right, stack with auto-dismiss (5s), swipe to dismiss, progress bar

**Accordion**: Height auto-animation, chevron rotate, keyboard support (Tab, Space/Enter)

**Tabs**: Sliding active indicator (layoutId), content crossfade, arrow key navigation

**Dropdown Menu**: Staggered item reveal (scale + opacity), keyboard navigation, portal rendering

**Tooltip**: Fade + Y translate, arrow positioning, configurable delay, responsive hiding

**Toggle Switch**: Spring-animated slide, color morph, full keyboard accessibility

**Skeleton Loader**: Infinite shimmer gradient animation, multiple variants (line, card, avatar)

**Card 3D Tilt**: Perspective transform, mouse-tracking rotation, shadow follow, GPU acceleration

**Drawer**: Slide from side (left/right/top/bottom), swipe to dismiss, scrollable content

**Progress Bar**: Animated fill, striped variant, indeterminate state, smooth transitions

**Badge/Chip**: Pop-in scale animation, removable variant with slide-out exit

**Avatar Group**: Overlap layout, hover expansion, tooltip on each avatar

**Command Palette**: Scale + blur backdrop, fuzzy search with highlight, Cmd+K keyboard shortcut

**Breadcrumb**: Slide-in trail animation, responsive collapse

**Stepper**: Draw animation of connecting line, pop-in steps, visual progress indicators

**Rating Stars**: Sequential fill on hover, scale bounce, interactive click handling

**Pagination**: Slide + fade number transition, arrow key navigation, ellipsis for skipped pages

**File Upload**: Drag zone pulse, drop scale animation, progress ring, success/error feedback

### Playground Implementation

**PropEditor Component**:
- Render form controls based on prop type (boolean, number, string, select, color)
- Update component props in real-time without full page refresh
- Show current prop value in editor
- Support min/max for number inputs, options array for selects

**ComponentPreview Component**:
- Display selected component with current props applied
- Show both default and controlled states
- Include multiple component instances for variant comparison
- Responsive preview modes (mobile, tablet, desktop)

**CodeSnippet Component**:
- Use Shiki to highlight TypeScript code
- Display: import statements, component usage, prop interface
- Copy button with success animation (checkmark)
- Toggle between different code views

**NavigationSidebar Component**:
- Component list with category grouping
- Fuzzy search filter (debounced input)
- Active indicator (left border highlight)
- Keyboard shortcut display (Cmd+J to search)

### Styling & Theming

- **Dark/Light Mode**: CSS custom properties, toggle in navbar
- **Focus States**: Visible outline (3px, primary color)
- **Transitions**: 150-300ms easing for interactions
- **Color Palette**:
  - Primary: #3b82f6 (blue)
  - Success: #10b981 (green)
  - Error: #ef4444 (red)
  - Warning: #f59e0b (amber)
  - Base: white (#ffffff) / dark (#0f172a)

### Accessibility Checklist

- ✓ Semantic HTML (button, nav, section, main)
- ✓ ARIA attributes (role, aria-label, aria-expanded, aria-live)
- ✓ Keyboard navigation (Tab, arrow keys, Enter, Esc, Cmd+K)
- ✓ Focus management and visible focus indicators
- ✓ Screen reader announcements (live regions for toasts)
- ✓ Color contrast: WCAG AA (4.5:1 for text)
- ✓ Respects prefers-reduced-motion media query
- ✓ All interactive elements keyboard accessible

### Performance Targets

- First Contentful Paint (FCP): < 2.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Code-split component pages (lazy load with next/dynamic)
- GPU-accelerated animations (transform, opacity only)
- Debounce search/filter input (300ms)

## File Structure

```
07-animated-component-library/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── components/
│   │       └── [componentId]/
│   │           └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── MagneticButton.tsx
│   │   │   ├── SpringModal.tsx
│   │   │   ├── ... (18 more)
│   │   ├── playground/
│   │   │   ├── ComponentPreview.tsx
│   │   │   ├── PropEditor.tsx
│   │   │   ├── CodeSnippet.tsx
│   │   │   └── NavigationSidebar.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── MainLayout.tsx
│   ├── lib/
│   │   ├── animations.ts (spring configs, stagger patterns)
│   │   ├── hooks.ts (useMousePosition, useFocusVisible, etc.)
│   │   └── utils.ts (clsx, cn, color maps)
│   ├── data/
│   │   └── componentConfig.ts (component metadata, props)
│   └── styles/
│       ├── globals.css
│       └── theme.css (CSS variables)
├── public/
│   └── fonts/ (JetBrains Mono, Inter)
├── tailwind.config.ts
├── next.config.ts
└── tsconfig.json
```

## Component Export Pattern

Each component should:
1. Accept standard React props + animation-specific props
2. Be `forwardRef` for ref forwarding
3. Have `displayName` property
4. Use TypeScript interfaces for props
5. Support all size/variant combinations
6. Include ARIA attributes and keyboard handlers

Example:
```typescript
interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outline' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  magnetRadius?: number;
  springConfig?: SpringConfig;
}

export const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ variant = 'filled', size = 'md', magnetRadius = 50, ...props }, ref) => {
    // Implementation
  }
);
```

## Development Priorities

### Phase 1: Core Setup
1. Next.js project setup with TypeScript, Tailwind CSS
2. Create layout components (header, sidebar, main)
3. Setup Framer Motion and GSAP

### Phase 2: Component Library
1. Implement 5-7 core components (Button, Modal, Toast, Tabs, Accordion)
2. Test animations and accessibility
3. Create ComponentPreview and PropEditor components

### Phase 3: Playground Features
1. Implement CodeSnippet with Shiki highlighting
2. Add NavigationSidebar with search
3. Add dark/light mode toggle

### Phase 4: Remaining Components
1. Complete remaining 13+ components
2. Add component metadata to componentConfig.ts
3. Test all keyboard interactions and screen readers

### Phase 5: Polish & Optimization
1. Performance audits (Lighthouse)
2. Mobile responsiveness
3. Deploy to Vercel

## Key Implementation Notes

- Use Framer Motion's `layoutId` for smooth indicator animations in Tabs/Dropdown
- Use `AnimatePresence` for exit animations (Modal, Toast, Drawer)
- Implement custom `useMousePosition()` hook for magnetic interactions
- Use Shiki's bundler-friendly import for syntax highlighting
- Create reusable spring config constants for consistency
- Use CSS custom properties for theme switching (no full re-render)
- Implement scroll restoration for component navigation

## Testing & Validation

- Test all components in light and dark modes
- Verify keyboard navigation (Tab, arrow keys, Esc, Cmd+K)
- Check accessibility with axe DevTools or WAVE
- Test animations at 60fps (DevTools Performance tab)
- Verify code copy functionality in all browsers
- Test responsive behavior on mobile/tablet

## Success Criteria

✓ All 20+ components animated and functional
✓ Real-time prop editing with live preview
✓ Syntax-highlighted code snippets with copy button
✓ Searchable, categorized component navigation
✓ Full keyboard accessibility (WCAG AA)
✓ Dark/light mode support
✓ Mobile responsive
✓ Lighthouse score: 90+ on all metrics
✓ Deployed and publicly accessible
