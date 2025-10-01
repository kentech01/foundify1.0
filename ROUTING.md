# Routing Documentation

## Overview

This application now uses **React Router** for proper client-side routing instead of the previous view-based state management approach.

## Route Structure

### Main Routes

- `/` - Landing page with product information
- `/builder` - Multi-step pitch creation form
- `/dashboard` - Dashboard layout (redirects to `/dashboard/pitches`)
- `/dashboard/pitches` - Pitch dashboard with pitch management
- `/dashboard/invoices` - Invoice generator page
- `/dashboard/essentials` - Founder essentials tools page
- `/upgrade` - Premium upgrade page with payment flow

## Architecture

### App Context (`src/context/AppContext.tsx`)

Manages global application state:

- `isPremium`: Premium subscription status
- `pitches`: Array of created pitch objects
- `isGenerating`: AI generation loading state
- `progress`: Progress percentage for loading states

### Navigation

All pages now use React Router's `useNavigate()` hook instead of callback props:

```tsx
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();
navigate("/dashboard"); // Navigate to dashboard
navigate("/builder"); // Navigate to pitch builder
```

### Context Usage

Pages access global state through the `useApp()` hook:

```tsx
import { useApp } from "../context/AppContext";

const { isPremium, pitches, addPitch, setIsPremium } = useApp();
```

## Component Changes

### Before (View-based)

```tsx
// Old approach with state
const [currentView, setCurrentView] = useState("landing");
setCurrentView("dashboard");

// Components received callback props
<Component onNavigate={() => setCurrentView("dashboard")} />;
```

### After (React Router)

```tsx
// New approach with routes
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/dashboard" element={<Dashboard />} />
</Routes>;

// Components use navigate hook
const navigate = useNavigate();
navigate("/dashboard");
```

## Benefits

1. **Proper URLs**: Each view has its own URL (`/builder`, `/dashboard`, etc.)
2. **Browser Navigation**: Back/forward buttons work correctly
3. **Bookmarkable**: Users can bookmark specific pages
4. **Shareable**: URLs can be shared directly
5. **Better UX**: Standard browser behavior and navigation patterns
6. **State Management**: Context API separates routing from state
7. **Scalability**: Easier to add new routes and nested routes

## Nested Routes

The dashboard uses nested routing for its sidebar navigation:

```tsx
// In DashboardMain.tsx
<Routes>
  <Route index element={<Navigate to="/dashboard/pitches" replace />} />
  <Route path="pitches" element={<PitchDashboard />} />
  <Route path="invoices" element={<InvoicesPage />} />
  <Route path="essentials" element={<FounderEssentialsPage />} />
</Routes>
```

The `DashboardLayout` component uses `useLocation()` to determine the active route and highlight the appropriate sidebar item.

## Updated Files

- `src/main.tsx` - Added BrowserRouter and AppProvider
- `src/App.tsx` - Converted to Routes configuration
- `src/context/AppContext.tsx` - New context for shared state
- `src/pages/LandingPage.tsx` - Uses useNavigate
- `src/pages/DashboardMain.tsx` - Uses nested Routes for sidebar navigation
- `src/pages/UpgradePage.tsx` - Uses useNavigate and useApp
- `src/components/PitchBuilder.tsx` - Uses useNavigate and useApp
- `src/components/DashboardLayout.tsx` - Uses useNavigate and useLocation for routing

## Running the Application

```bash
# Development
npm run dev

# Build
npm run build
```

The application will start on `http://localhost:3000` with proper routing enabled.
