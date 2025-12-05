# Frontend Component Design & Standardization Guide

This document outlines the strict design principles, coding standards, and best practices for developing frontend components in this project. All new components must adhere to these guidelines to ensure high reusability, maintainability, and quality.

## 1. Design Principles

### 1.1 Core Philosophy
- **High Reusability**: Components should be agnostic to specific business logic where possible.
- **Low Coupling**: Dependencies should be minimized. Components should not rely on global state unless absolutely necessary (and then, via context/props).
- **Open/Closed Principle**: Open for extension, closed for modification. Use slots, props, and composition to extend functionality without altering source code.
- **Pure & Functional**: Prefer pure functional components. Side effects should be isolated in hooks or parent components.

### 1.2 State Management
- **Stateless/Light-State**: Components should primarily be presentational (UI) or logical (Headless).
- **Controlled vs Uncontrolled**: Support both modes where applicable.
- **External State**: Complex state should be lifted up or managed via composition.

## 2. File Structure

We follow a directory-based structure for non-trivial components to keep related files together.

```
src/components/
├── examples/
│   └── demo-card/           # Component Name (kebab-case)
│       ├── index.tsx        # Main component entry
│       ├── types.ts         # Type definitions (Props, Events)
│       ├── hooks.ts         # Component-specific hooks (optional)
│       ├── utils.ts         # Component-specific utils (optional)
│       ├── styles.module.css # CSS Modules (if not using Tailwind exclusively)
│       ├── demo-card.test.tsx # Unit tests
│       └── README.md        # Documentation
```

For simple, atomic UI components (like buttons, inputs), the existing `components/ui/filename.tsx` pattern is acceptable, but complex business components must use the directory structure.

## 3. Code Standards

### 3.1 Naming Conventions
- **Files**: `kebab-case` (e.g., `demo-card.tsx`, `user-profile.tsx`)
- **Components**: `PascalCase` (e.g., `DemoCard`, `UserProfile`)
- **Props**: `camelCase` (e.g., `isLoading`, `onSubmit`)
- **Types/Interfaces**: `PascalCase` with descriptive names (e.g., `DemoCardProps`, `CardVariant`)

### 3.2 Props & Types
- **Strict Typing**: No `any`. Use specific types.
- **Optional Props**: All props should be optional where reasonable, with sensible defaults.
- **Extensibility**: Always extend standard HTML attributes (e.g., `React.HTMLAttributes<HTMLDivElement>`) to allow passing `className`, `id`, etc.

```typescript
import { VariantProps } from 'class-variance-authority';

export interface MyComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof myComponentVariants> {
  customProp?: string;
}
```

### 3.3 Styling
- **Tailwind CSS**: Primary styling engine.
- **CVA (Class Variance Authority)**: Use `cva` for managing component variants.
- **Tailwind Merge**: Use `cn()` utility (combining `clsx` and `tailwind-merge`) to safely merge classes.

### 3.4 Comments & Documentation
- **JSDoc**: Required for all exported components and complex functions.
- **README**: Every directory-based component MUST have a README.md explaining usage, props, and examples.

## 4. Extension & Future-Proofing

### 4.1 Slots & Composition
Use `children` or specific slot props (e.g., `header`, `footer` of type `React.ReactNode`) to allow content injection.

### 4.2 Headless UI Pattern
For complex logic, separate logic into a custom hook (e.g., `useDemoCard`) and keep the UI component dumb.

### 4.3 Theming
Use CSS variables and Tailwind tokens. Avoid hardcoded hex values in components.

## 5. Performance
- **Tree-Shaking**: Ensure components are exported in a way that allows unused code to be dropped.
- **Lazy Loading**: Support `React.lazy` for heavy sub-components.
- **Memoization**: Use `React.memo`, `useMemo`, and `useCallback` judiciously to prevent unnecessary re-renders.

## 6. Testing
- **Unit Tests**: Required for all logic and interaction flows.
- **Snapshot Tests**: Useful for UI components to catch regression.

---
*This standard is a living document. Updates should be proposed via Pull Request.*
