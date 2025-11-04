# Component Migration Examples

This guide shows you how to convert your existing components to use Tailwind CSS classes.

## Example 1: Hero Section

### ❌ Before (Custom CSS/Inline Styles)
```tsx
<div 
  style={{
    background: 'linear-gradient(to right, #1e40af, #3b82f6)',
    padding: '80px 16px',
    textAlign: 'center',
    color: 'white'
  }}
>
  <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '24px' }}>
    Welcome to Foundify
  </h1>
  <p style={{ fontSize: '20px', marginBottom: '32px', opacity: 0.9 }}>
    Find what you're looking for
  </p>
  <button 
    style={{
      backgroundColor: 'white',
      color: '#1e40af',
      padding: '12px 32px',
      borderRadius: '8px',
      fontSize: '18px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer'
    }}
  >
    Get Started
  </button>
</div>
```

### ✅ After (Tailwind CSS)
```tsx
<div className="bg-gradient-to-r from-deep-blue to-deep-blue-light py-20 px-4 text-center text-white">
  <h1 className="text-5xl font-bold mb-6">
    Welcome to Foundify
  </h1>
  <p className="text-xl mb-8 opacity-90">
    Find what you're looking for
  </p>
  <button className="bg-white text-deep-blue px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
    Get Started
  </button>
</div>
```

---

## Example 2: Feature Card

### ❌ Before (Custom CSS)
```tsx
// Custom CSS file:
.feature-card {
  padding: 24px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: #eff6ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

// Component:
<div className="feature-card">
  <div className="feature-icon">
    <Icon />
  </div>
  <h3>Feature Title</h3>
  <p>Feature description</p>
</div>
```

### ✅ After (Tailwind CSS)
```tsx
<div className="p-6 bg-card border border-border rounded-xl shadow-md hover:-translate-y-1 hover:shadow-xl transition-all">
  <div className="w-12 h-12 bg-deep-blue-50 rounded-lg flex items-center justify-center mb-4">
    <Icon className="text-deep-blue" />
  </div>
  <h3 className="text-lg font-semibold text-foreground mb-2">
    Feature Title
  </h3>
  <p className="text-muted-foreground">
    Feature description
  </p>
</div>
```

---

## Example 3: Navigation Bar

### ❌ Before (Custom CSS)
```tsx
// Custom CSS:
.navbar {
  position: sticky;
  top: 0;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  z-index: 50;
}

.nav-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.nav-link {
  color: #374151;
  text-decoration: none;
  margin-right: 24px;
}

.nav-link:hover {
  color: #1e40af;
}

// Component:
<nav className="navbar">
  <div className="nav-container">
    <div className="logo">Foundify</div>
    <div className="nav-links">
      <a href="#" className="nav-link">Features</a>
      <a href="#" className="nav-link">Pricing</a>
      <button className="btn-primary">Sign In</button>
    </div>
  </div>
</nav>
```

### ✅ After (Tailwind CSS)
```tsx
<nav className="sticky top-0 bg-background border-b border-border z-50">
  <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
    <div className="text-2xl font-bold text-deep-blue">
      Foundify
    </div>
    <div className="flex items-center gap-6">
      <a href="#" className="text-foreground hover:text-deep-blue transition-colors">
        Features
      </a>
      <a href="#" className="text-foreground hover:text-deep-blue transition-colors">
        Pricing
      </a>
      <button className="px-6 py-2 bg-deep-blue text-white rounded-lg hover:bg-deep-blue-dark transition-colors">
        Sign In
      </button>
    </div>
  </div>
</nav>
```

---

## Example 4: Form Input

### ❌ Before (Custom CSS)
```tsx
// Custom CSS:
.input-field {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #1e40af;
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
}

.input-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}

// Component:
<div>
  <label className="input-label">Email Address</label>
  <input 
    type="email"
    className="input-field"
    placeholder="you@example.com"
  />
</div>
```

### ✅ After (Tailwind CSS)
```tsx
<div>
  <label className="block mb-2 font-medium text-foreground">
    Email Address
  </label>
  <input 
    type="email"
    className="w-full px-4 py-3 border border-border rounded-lg text-foreground bg-input-background focus:border-deep-blue focus:ring-2 focus:ring-deep-blue/20 outline-none transition-colors"
    placeholder="you@example.com"
  />
</div>
```

---

## Example 5: Premium Badge

### ❌ Before (Custom CSS)
```tsx
// Custom CSS:
.premium-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: white;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

// Component:
<span className="premium-badge">Premium</span>
```

### ✅ After (Tailwind CSS)
```tsx
<span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-premium-purple to-premium-purple-dark text-white rounded-full text-xs font-semibold uppercase tracking-wider">
  Premium
</span>
```

---

## Example 6: Pricing Card (Complex Component)

### ❌ Before (Custom CSS)
```tsx
// Custom CSS:
.pricing-card {
  padding: 32px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  text-align: center;
}

.pricing-card.featured {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: white;
  border: none;
  transform: scale(1.05);
}

.price-amount {
  font-size: 48px;
  font-weight: bold;
  margin: 16px 0;
}

// Component:
<div className="pricing-card featured">
  <div className="badge">Most Popular</div>
  <h3>Pro Plan</h3>
  <div className="price-amount">$29</div>
  <p>per month</p>
  <ul className="features-list">
    <li>All features</li>
    <li>Priority support</li>
    <li>Advanced analytics</li>
  </ul>
  <button className="cta-button">Get Started</button>
</div>
```

### ✅ After (Tailwind CSS)
```tsx
<div className="relative p-8 bg-gradient-to-br from-premium-purple to-premium-purple-dark text-white rounded-2xl shadow-2xl scale-105 text-center">
  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
    <span className="px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
      Most Popular
    </span>
  </div>
  
  <h3 className="text-2xl font-bold mb-4">Pro Plan</h3>
  
  <div className="flex items-baseline justify-center gap-2 mb-2">
    <span className="text-5xl font-bold">$29</span>
    <span className="text-white/80">per month</span>
  </div>
  
  <ul className="space-y-3 mb-8 text-left">
    <li className="flex items-center gap-2">
      <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">✓</span>
      All features
    </li>
    <li className="flex items-center gap-2">
      <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">✓</span>
      Priority support
    </li>
    <li className="flex items-center gap-2">
      <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">✓</span>
      Advanced analytics
    </li>
  </ul>
  
  <button className="w-full py-3 bg-white text-premium-purple rounded-lg font-semibold hover:bg-white/90 transition-colors">
    Get Started
  </button>
</div>
```

---

## Example 7: Dark Mode Aware Component

### ❌ Before (No Dark Mode Support)
```tsx
<div style={{ background: 'white', color: '#111' }}>
  <h2>This looks bad in dark mode!</h2>
</div>
```

### ✅ After (Automatic Dark Mode)
```tsx
<div className="bg-background text-foreground">
  <h2>This looks great in both modes!</h2>
</div>
```

---

## Key Takeaways

1. **Replace inline styles** with Tailwind utility classes
2. **Remove custom CSS files** - Tailwind has it all
3. **Use theme colors** (`bg-background`, `text-foreground`) for dark mode support
4. **Use brand colors** (`bg-deep-blue`, `bg-premium-purple`) for consistent branding
5. **Combine utilities** - Tailwind is designed for composition
6. **Use hover/focus states** - Built right into the class names
7. **Responsive by default** - Add `md:`, `lg:` prefixes when needed

## Migration Strategy

1. Start with new components - use Tailwind from the start
2. Migrate high-traffic pages first (landing page, dashboard)
3. Gradually replace custom CSS in existing components
4. Delete old CSS files once components are migrated
5. Test in both light and dark modes

---

**Pro Tip:** Use the browser DevTools to experiment with Tailwind classes in real-time. Just edit the `className` attribute and see changes instantly!

