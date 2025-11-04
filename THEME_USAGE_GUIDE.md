# Theme Usage Guide - Quick Start

## 🚀 How to Enable Dark Mode in Your App

### Option 1: Using the Custom Theme Provider (Recommended)

1. **Wrap your app with ThemeProvider** in `src/main.tsx`:

```tsx
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { AppProvider } from "./context/AppContext";
import { AuthContextProvider } from "./context/AuthContext";
import { ThemeProvider } from "./components/ThemeProvider"; // Add this
import "./styles/globals.css";
import { RecoilRoot } from "recoil";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <RecoilRoot>
      <AuthContextProvider>
        <AppProvider>
          <ThemeProvider defaultTheme="light"> {/* Add this */}
            <App />
          </ThemeProvider> {/* Add this */}
        </AppProvider>
      </AuthContextProvider>
    </RecoilRoot>
  </BrowserRouter>
);
```

2. **Add the theme toggle** in your navbar or settings:

```tsx
import { ThemeToggle, ThemeToggleIcon } from "@/components/ThemeToggle";

// In your component:
<ThemeToggle /> // Button with label
// or
<ThemeToggleIcon /> // Icon only
```

### Option 2: Using next-themes (Alternative)

You already have `next-themes` installed. To use it:

```tsx
import { ThemeProvider } from 'next-themes';

// In main.tsx or App.tsx
<ThemeProvider attribute="class" defaultTheme="light">
  <App />
</ThemeProvider>

// In any component
import { useTheme } from 'next-themes';

function ThemeButton() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  );
}
```

## 🎨 Using Your Brand Colors

### Deep Blue (Primary Brand Color)

Perfect for primary actions, headers, and important UI elements:

```tsx
// Primary button
<button className="px-6 py-3 bg-deep-blue text-white rounded-lg hover:bg-deep-blue-dark transition-colors">
  Get Started
</button>

// Hero section background
<section className="bg-gradient-to-r from-deep-blue to-deep-blue-light text-white py-20">
  <h1 className="text-5xl font-bold">Welcome to Foundify</h1>
</section>

// Accent text
<h2 className="text-2xl font-semibold text-deep-blue">Section Title</h2>
```

### Premium Purple (Premium Features)

Use for premium features, upgrade prompts, and special offerings:

```tsx
// Premium badge
<span className="px-3 py-1 bg-premium-purple-50 text-premium-purple rounded-full text-sm font-medium">
  Premium
</span>

// Premium button
<button className="px-6 py-3 bg-premium-purple text-white rounded-lg hover:bg-premium-purple-dark transition-colors shadow-lg">
  Upgrade to Pro
</button>

// Premium card
<div className="p-6 bg-premium-purple-50 border-2 border-premium-purple rounded-xl">
  <h3 className="text-xl font-semibold text-premium-purple-900 mb-2">Pro Features</h3>
  <p className="text-premium-purple-900/80">Unlock advanced capabilities</p>
</div>
```

## 🌓 Theme-Aware Components

Components that automatically adjust to light/dark mode:

```tsx
// Card that works in both themes
<div className="p-6 bg-card border border-border rounded-xl">
  <h3 className="text-foreground font-semibold">Auto-adjusting Card</h3>
  <p className="text-muted-foreground">This text adjusts automatically</p>
</div>

// Input field
<input 
  type="text"
  className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-foreground focus:border-deep-blue focus:ring-2 focus:ring-deep-blue/20 outline-none transition-colors"
  placeholder="Enter text..."
/>

// Container with proper spacing and theme colors
<div className="min-h-screen bg-background">
  <div className="max-w-7xl mx-auto px-4 py-8">
    {/* Your content */}
  </div>
</div>
```

## 📱 Responsive Examples

### Navigation Bar
```tsx
<nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-deep-blue">Foundify</span>
      </div>
      
      {/* Navigation */}
      <div className="hidden md:flex items-center gap-6">
        <a href="#" className="text-foreground hover:text-deep-blue transition-colors">
          Features
        </a>
        <a href="#" className="text-foreground hover:text-deep-blue transition-colors">
          Pricing
        </a>
        <ThemeToggleIcon />
        <button className="px-4 py-2 bg-deep-blue text-white rounded-lg hover:bg-deep-blue-dark transition-colors">
          Sign In
        </button>
      </div>
    </div>
  </div>
</nav>
```

### Feature Card Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div className="p-6 bg-card border border-border rounded-xl hover:shadow-lg transition-shadow">
    <div className="w-12 h-12 bg-deep-blue-50 text-deep-blue rounded-lg flex items-center justify-center mb-4">
      {/* Icon */}
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">Feature Name</h3>
    <p className="text-muted-foreground">Feature description that adapts to theme</p>
  </div>
  
  {/* More cards... */}
</div>
```

### Premium Pricing Card
```tsx
<div className="relative p-8 bg-gradient-to-br from-premium-purple to-premium-purple-dark text-white rounded-2xl shadow-2xl">
  <div className="absolute top-4 right-4">
    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
      Popular
    </span>
  </div>
  
  <h3 className="text-2xl font-bold mb-2">Pro Plan</h3>
  <div className="flex items-baseline gap-2 mb-6">
    <span className="text-4xl font-bold">$29</span>
    <span className="text-white/80">/month</span>
  </div>
  
  <ul className="space-y-3 mb-8">
    <li className="flex items-center gap-2">
      <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">✓</span>
      <span>All features included</span>
    </li>
    {/* More features... */}
  </ul>
  
  <button className="w-full py-3 bg-white text-premium-purple rounded-lg font-semibold hover:bg-white/90 transition-colors">
    Get Started
  </button>
</div>
```

## 🎯 Common Patterns

### Hover Effects
```tsx
<div className="group cursor-pointer">
  <div className="transition-transform group-hover:scale-105">
    {/* Content that scales on hover */}
  </div>
</div>
```

### Focus States
```tsx
<button className="focus:outline-none focus:ring-2 focus:ring-deep-blue focus:ring-offset-2">
  Accessible Button
</button>
```

### Loading States
```tsx
<button 
  disabled={isLoading}
  className="px-6 py-3 bg-deep-blue text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isLoading ? 'Loading...' : 'Submit'}
</button>
```

## 💡 Pro Tips

1. **Consistent Spacing**: Use Tailwind's spacing scale (`p-4`, `m-6`, `gap-8`)
2. **Color Opacity**: Use `/50` syntax for transparency (`bg-deep-blue/50`)
3. **Dark Mode**: Use theme colors (`bg-background`, `text-foreground`) for auto-adjustment
4. **Transitions**: Add `transition-colors` or `transition-all` for smooth effects
5. **Responsive**: Use breakpoint prefixes (`sm:`, `md:`, `lg:`, `xl:`)

## 🎨 Quick Color Reference

| Use Case | Light Mode | Dark Mode |
|----------|-----------|-----------|
| Primary Action | `bg-deep-blue text-white` | Same |
| Premium Feature | `bg-premium-purple text-white` | Same |
| Background | `bg-background` | Auto-adjusts |
| Card | `bg-card border-border` | Auto-adjusts |
| Text | `text-foreground` | Auto-adjusts |
| Muted Text | `text-muted-foreground` | Auto-adjusts |
| Hover Overlay | `hover:bg-accent` | Auto-adjusts |

Start building with these patterns and your app will look professional in both light and dark modes! 🚀

