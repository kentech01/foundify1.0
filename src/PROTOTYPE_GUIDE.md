# Foundify Prototype Guide

## 🎯 User Flow

### 1. **Landing Page** (Starting Point)
- Beautiful modern landing page with gradient animations
- Shows features, pricing, testimonials, and benefits
- **Action**: Click any "Start Free" button

### 2. **Pitch Builder** (6 Questions)
- Step-by-step questionnaire with progress bar
- **Questions asked**:
  1. Startup name
  2. Problem you're solving
  3. Target audience
  4. Your solution
  5. Unique value proposition
  6. Email address
- Smooth navigation with Back/Next buttons
- **Action**: Complete all 6 questions and click "Generate Pitch"

### 3. **AI Generation Loading** (Modal)
- Animated loading modal showing progress
- Shows 4 steps of AI generation:
  - Understanding your startup
  - Crafting compelling copy
  - Structuring your story
  - Polishing final touches
- Progress bar from 0-100%
- **Duration**: ~10-12 seconds

### 4. **Dashboard** (Main Hub)
- Shows your created pitch(es)
- **Stats displayed**:
  - Total Pitches
  - Total Views
  - Published Pitches
- **For each pitch you can**:
  - Generate/Download PDF (with loading modal)
  - Create/View Landing Page (with loading modal)
- Premium upgrade CTA at bottom

## ✨ Key Features

### Loading States
1. **Generating Pitch** - When completing the 6 questions
2. **Generating PDF** - When creating PDF download
3. **Building Landing Page** - When publishing landing page

Each loading modal shows:
- Animated icon with glow effect
- Progress percentage
- Step-by-step process
- Estimated time

### Success Notifications
- Toast notifications appear when:
  - PDF is generated
  - Landing page is published
- Positioned at top-right corner
- Auto-dismiss after a few seconds

### Responsive Design
- Fully responsive across all devices
- Mobile-friendly forms and dashboard
- Optimized touch targets

## 🎨 Design Highlights

- **Color Scheme**: Premium Purple (#7c3aed) + Deep Blue (#1e40af)
- **Gradients**: Smooth transitions between colors
- **Animations**: 
  - Blob animations in hero
  - Progress bars
  - Hover effects
  - Loading spinners
- **Typography**: Clean, modern Inter font
- **Cards**: Rounded corners, subtle shadows, hover states

## 📋 Current State vs Premium

### Free Plan (Current)
- Basic pitch landing page generation
- One-click PDF downloads
- Professional templates
- Export basic landing page

### Premium ($10/month)
- Professional hosted landing page
- Built-in analytics
- Multiple premium templates
- AI-assisted pitch building
- All 4 founder tools
- Remove Foundify badge
- Priority support

## 🔄 Navigation Flow

```
Landing Page
    ↓ (Click "Start Free")
Pitch Builder (6 Questions)
    ↓ (Click "Generate Pitch")
Loading Modal (AI Generation)
    ↓ (Auto-redirect when complete)
Dashboard
    ├─ Generate PDF → Loading Modal → Success Toast
    └─ Create Landing → Loading Modal → Success Toast
```

## 🚀 Next Steps for Development

1. **Backend Integration**
   - Connect to actual AI API for pitch generation
   - Store pitches in database
   - Generate real PDFs
   - Host landing pages

2. **Authentication**
   - User signup/login
   - Session management
   - Password reset

3. **Analytics**
   - Track page views
   - Monitor pitch performance
   - User engagement metrics

4. **Premium Features**
   - Stripe integration for payments
   - Unlock premium templates
   - Enable advanced features

5. **Additional Tools**
   - Invoice Generator
   - Contract Templates
   - 360° Team Feedback
   - Investor Email Generator

## 💡 Tips for Testing

1. Click "Start Free" buttons on landing page
2. Fill out the 6-question form
3. Watch the loading animation
4. Explore the dashboard
5. Try generating PDFs and landing pages
6. Notice the success toasts
7. Click "New Pitch" to restart flow

## 🎭 Demo Mode
Currently in prototype mode with:
- Simulated AI generation (progress bars)
- Mock data and statistics
- Fake loading times (10-15 seconds)
- Sample pitch data

Ready to be connected to real backend services!