# Dark/Light Mode Feature

This project includes a clean, modular dark/light mode feature that can be easily used throughout the application.

## Architecture

The theme system consists of:

1. **ThemeProvider** - Context provider that manages theme state
2. **useTheme** - Hook to access theme context 
3. **useThemeToggle** - Convenience hook with additional utilities
4. **ThemeToggle** - Reusable component for toggling themes

## Usage

### Basic Theme Toggle

Add the theme toggle component anywhere in your app:

```tsx
import { ThemeToggle } from '../components/ui/ThemeToggle';

function MyComponent() {
  return (
    <div>
      <ThemeToggle size="md" showLabel={true} />
    </div>
  );
}
```

### Using Theme in Components

Access theme state and utilities in any component:

```tsx
import { useTheme } from '../contexts/ThemeContext';
// or
import { useThemeToggle } from '../hooks/useThemeToggle';

function MyComponent() {
  const { theme, toggleTheme, isDark } = useThemeToggle();
  
  return (
    <div className={isDark ? 'dark-specific-class' : 'light-specific-class'}>
      Current theme: {theme}
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

### Styling with Tailwind Dark Mode

Use Tailwind's dark mode classes for styling:

```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  This div has different colors in light and dark mode
</div>
```

## ThemeToggle Component Props

- `className?: string` - Additional CSS classes
- `size?: 'sm' | 'md' | 'lg'` - Size of the toggle button
- `showLabel?: boolean` - Whether to show "Light mode" / "Dark mode" text

## Features

- **Automatic system preference detection** - Detects user's system theme preference
- **Persistent storage** - Remembers user's choice in localStorage
- **Smooth transitions** - Includes CSS transitions for smooth theme changes
- **Accessible** - Proper ARIA labels and keyboard support
- **TypeScript support** - Fully typed for better developer experience

## Implementation Details

- Uses Tailwind's `class` strategy for dark mode
- Theme state is stored in localStorage as 'theme'
- Applies theme class to document root element
- Includes smooth transition animations (200ms duration)

## Customization

To customize colors or add new themes:

1. Update the `Theme` type in `ThemeContext.tsx`
2. Add corresponding Tailwind classes to your components
3. Extend the theme logic in the context provider

## Already Applied To

The theme system has been integrated into:

- App layout and loading screens
- AdminLayout component
- Sidebar navigation
- Button components
- Card components  
- Dashboard page
- All existing UI components

Just restart your development server and you'll see the theme toggle in the sidebar!
