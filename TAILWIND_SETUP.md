# Tailwind CSS Setup - Foundify 1.0

## ✅ Setup Complete!

Your app is now fully configured with **Tailwind CSS v4** and includes both light and dark theme support.

## 🎨 Available Colors

### Brand Colors

#### Deep Blue (Primary Brand Color)
```tsx
// Backgrounds
className="bg-deep-blue"           // #1e40af
className="bg-deep-blue-dark"      // #1d4ed8
className="bg-deep-blue-light"     // #3b82f6
className="bg-deep-blue-50"        // #eff6ff (very light)
className="bg-deep-blue-100"       // #dbeafe (light)

// Text
className="text-deep-blue"
className="text-deep-blue-dark"
className="text-deep-blue-900"     // #1e3a8a (dark text)

// Borders
className="border-deep-blue"

// Hover states
className="hover:bg-deep-blue-dark"

// Focus states
className="focus:ring-deep-blue"
```

#### Premium Purple (Premium/Pro Features)
```tsx
// Backgrounds
className="bg-premium-purple"       // #7c3aed
className="bg-premium-purple-dark"  // #6d28d9
className="bg-premium-purple-light" // #8b5cf6
className="bg-premium-purple-50"    // #faf5ff (very light)
className="bg-premium-purple-100"   // #f3e8ff (light)

// Text
className="text-premium-purple"
className="text-premium-purple-900" // #581c87 (dark text)

// Borders
className="border-premium-purple"

// Hover states
className="hover:bg-premium-purple-dark"
```

### Theme Colors (Auto-adjust for Dark Mode)

```tsx
// Backgrounds
className="bg-background"           // White (light) / Dark (dark mode)
className="bg-card"                 // Card background
className="bg-muted"                // Muted background
className="bg-accent"               // Accent background

// Text
className="text-foreground"         // Main text color
className="text-muted-foreground"   // Muted text
className="text-primary"            // Primary text
className="text-secondary"          // Secondary text

// Borders
className="border-border"           // Standard border color

// Buttons and interactive elements
className="bg-primary text-primary-foreground"
className="bg-secondary text-secondary-foreground"
className="bg-destructive text-destructive-foreground"
```

## 🌓 Dark Mode Support

Your app is configured with dark mode support. To toggle dark mode, add/remove the `dark` class on the root element:

### Implementation Example

```tsx
import { useEffect, useState } from 'react';

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="px-4 py-2 rounded-lg bg-primary text-primary-foreground"
    >
      Toggle {isDark ? 'Light' : 'Dark'} Mode
    </button>
  );
}
```

### Using next-themes (Recommended)

Since you already have `next-themes` installed, you can use it for better theme management:

```tsx
import { ThemeProvider, useTheme } from 'next-themes';

// Wrap your app in App.tsx or main.tsx
function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      {/* Your app content */}
    </ThemeProvider>
  );
}

// Use in any component
function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  );
}
```

## 🎯 Common Tailwind Patterns

### Buttons
```tsx
// Primary button
<button className="px-6 py-3 bg-deep-blue text-white rounded-lg hover:bg-deep-blue-dark transition-colors">
  Click Me
</button>

// Premium button
<button className="px-6 py-3 bg-premium-purple text-white rounded-lg hover:bg-premium-purple-dark transition-colors">
  Go Premium
</button>

// Outline button
<button className="px-6 py-3 border-2 border-deep-blue text-deep-blue rounded-lg hover:bg-deep-blue hover:text-white transition-colors">
  Learn More
</button>
```

### Cards
```tsx
<div className="p-6 bg-card border border-border rounded-xl shadow-lg">
  <h3 className="text-xl font-semibold text-foreground mb-2">Card Title</h3>
  <p className="text-muted-foreground">Card description text</p>
</div>
```

### Gradients
```tsx
// Blue gradient
<div className="bg-gradient-to-r from-deep-blue to-deep-blue-light">
  Content
</div>

// Purple gradient
<div className="bg-gradient-to-br from-premium-purple to-premium-purple-dark">
  Content
</div>
```

### Responsive Design
```tsx
<div className="text-sm sm:text-base md:text-lg lg:text-xl">
  Responsive text
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Grid items */}
</div>
```

## 📦 What's Configured

- ✅ Tailwind CSS v4 with Vite plugin
- ✅ Custom color palette (Deep Blue & Premium Purple)
- ✅ Light & Dark theme support
- ✅ PostCSS configuration
- ✅ Theme CSS variables
- ✅ Typography defaults
- ✅ All Tailwind utilities available

## 🚀 Development

Start your dev server:
```bash
npm run dev
```

Tailwind will automatically compile your styles and apply them to your components.

## 💡 Tips

1. **Use theme colors** (`bg-background`, `text-foreground`) for automatic dark mode support
2. **Use brand colors** (`bg-deep-blue`, `bg-premium-purple`) for consistent branding
3. **Combine utilities** for complex designs: `className="flex items-center justify-between p-4 bg-card rounded-lg"`
4. **Use hover/focus states** for better UX: `hover:bg-blue-700 focus:ring-2 focus:ring-blue-500`

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS v4 Beta](https://tailwindcss.com/blog/tailwindcss-v4-beta)
- [Tailwind Color Reference](https://tailwindcss.com/docs/customizing-colors)

