# 🎨 TerraPrice Loader System Documentation

A comprehensive, modular loading animation system designed for clean, reusable, and beautiful loading states throughout the TerraPrice application.

## 🚀 Features

- **8 Animation Variants**: Spinner, Dots, Pulse, Bars, Ring, Ripple, Wave, Glow
- **5 Size Options**: XS, SM, MD, LG, XL  
- **4 Color Themes**: Primary (Teal), Secondary (Gray), White, Gray
- **Modular Architecture**: Clean, reusable components
- **Dark Mode Support**: Automatic theme adaptation
- **TypeScript Support**: Full type safety
- **Advanced Animations**: Custom CSS keyframes for smooth effects

## 📦 Components

### Core Component: `<Loader />`

```tsx
<Loader 
  variant="spinner" 
  size="md" 
  color="primary" 
  text="Loading..." 
  centerScreen={false}
  className="custom-class"
/>
```

### Preset Components

```tsx
// Quick access components for common use cases
<LoadingSpinner text="Loading..." />
<LoadingDots size="lg" />
<LoadingBars text="Processing..." />
<LoadingRipple size="xl" />
<LoadingWave text="Analyzing..." />
```

### Special Loaders

```tsx
// Full screen overlay
<FullScreenLoader variant="ring" text="Please wait..." />

// Section overlay
<LoadingOverlay isVisible={loading} variant="dots">
  <YourContent />
</LoadingOverlay>
```

## 🎯 Animation Variants

| Variant | Description | Best Use Case |
|---------|-------------|---------------|
| `spinner` | Classic rotating circle | General loading states |
| `dots` | Three pulsing dots | Text/content loading |
| `pulse` | Single pulsing circle | Quick operations |
| `bars` | Bouncing vertical bars | Data processing |
| `ring` | Ring with spinning border | App initialization |
| `ripple` | Expanding ripple effect | Network operations |
| `wave` | Wave-like bars | File uploads |
| `glow` | Glowing pulse effect | Sync operations |

## 📏 Size Guide

| Size | Dimensions | Use Case |
|------|------------|----------|
| `xs` | 12px × 12px | Inline buttons, small indicators |
| `sm` | 16px × 16px | Form elements, small cards |
| `md` | 24px × 24px | Default size, general use |
| `lg` | 32px × 32px | Page sections, overlays |
| `xl` | 48px × 48px | Full screen, splash screens |

## 🎨 Color Themes

```tsx
// Primary - Teal theme (default)
<Loader color="primary" />

// Secondary - Professional gray
<Loader color="secondary" />

// White - For dark backgrounds
<Loader color="white" />

// Gray - Subtle loading states
<Loader color="gray" />
```

## 💡 Usage Examples

### Dashboard Loading
```tsx
const Dashboard = () => {
  const { data, isLoading } = useData();
  
  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading dashboard..." />;
  }
  
  return <DashboardContent data={data} />;
};
```

### Card Loading State
```tsx
const DataCard = () => {
  const [loading, setLoading] = useState(true);
  
  return (
    <LoadingOverlay isVisible={loading} variant="dots">
      <Card>
        <CardContent />
      </Card>
    </LoadingOverlay>
  );
};
```

### Button Loading State
```tsx
const SubmitButton = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  return (
    <Button disabled={isSubmitting}>
      {isSubmitting ? (
        <>
          <Loader variant="spinner" size="sm" color="white" />
          Submitting...
        </>
      ) : (
        'Submit'
      )}
    </Button>
  );
};
```

### App Initialization
```tsx
const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  
  if (!isInitialized) {
    return (
      <FullScreenLoader 
        variant="ring" 
        text="Initializing TerraPrice..." 
      />
    );
  }
  
  return <AppContent />;
};
```

## 🔧 Advanced Customization

### Custom Animations

The system includes advanced CSS animations defined in `index.css`:

```css
@keyframes ripple {
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(2.4); opacity: 0; }
}

@keyframes wave {
  0%, 40%, 100% { transform: translateY(0); }
  20% { transform: translateY(-10px); }
}

@keyframes glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### Creating Custom Loaders

```tsx
// Custom loader with specific styling
<Loader 
  variant="ripple"
  size="lg"
  color="primary"
  className="my-custom-loader"
  text="Custom loading message"
/>
```

## 🌙 Dark Mode Support

All loaders automatically adapt to dark mode:

```tsx
// Automatically switches colors based on theme
<Loader variant="spinner" color="primary" />

// Dark mode: teal-400, Light mode: teal-600
```

## 📱 Responsive Design

Loaders are designed to work across all screen sizes:

```tsx
// Responsive sizing
<div className="hidden sm:block">
  <Loader size="lg" />
</div>
<div className="sm:hidden">
  <Loader size="md" />
</div>
```

## 🎪 Live Demo

Visit `/admin/showcase` in your application to see all loaders in action with:

- All animation variants
- Size comparisons  
- Color themes
- Text combinations
- Special loaders (full screen, overlay)
- Code examples

## 🚀 Performance

- **Lightweight**: Minimal CSS and JavaScript
- **GPU Accelerated**: Uses transform and opacity for smooth animations
- **Tree Shakeable**: Import only what you need
- **Zero Dependencies**: Built with pure CSS animations

## 🔄 Migration from Old Loaders

```tsx
// Old approach ❌
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700">
  <span className="sr-only">Loading...</span>
</div>

// New approach ✅
<LoadingSpinner text="Loading..." />
```

## 🎯 Best Practices

1. **Match variant to use case**: Use appropriate animations for different contexts
2. **Consistent sizing**: Stick to predefined sizes for visual harmony
3. **Meaningful text**: Provide descriptive loading messages
4. **Progressive enhancement**: Start with simple loaders, add complexity as needed
5. **Performance**: Use `centerScreen` sparingly for heavy operations only

## 🛠️ Technical Implementation

The loader system is built with:

- **React**: Functional components with TypeScript
- **Tailwind CSS**: Utility-first styling with dark mode
- **Custom CSS**: Advanced keyframe animations
- **Modular Architecture**: Easy to extend and maintain

## 📚 Component Props Reference

### Loader Props
```typescript
interface LoaderProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'ring' | 'ripple' | 'wave' | 'glow';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
  text?: string;
  centerScreen?: boolean;
}
```

### LoadingOverlay Props
```typescript
interface LoadingOverlayProps {
  isVisible: boolean;
  variant?: LoaderProps['variant'];
  text?: string;
  children: React.ReactNode;
}
```

---

🎉 **Ready to create beautiful loading experiences!** 

The TerraPrice loader system provides everything you need for professional, accessible, and delightful loading states throughout your application.
