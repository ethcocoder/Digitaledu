# DigitalEdu - Connect the World of Education

A modern, elite-level landing page for a global digital education platform connecting learners of all levels—from early childhood to Grade 12, university, and professional courses from any country curriculum.

## 🎨 Design Philosophy

**Futuristic Neon Elegance** - A sophisticated cyberpunk-inspired aesthetic combining premium tech aesthetics with educational excellence.

### Visual Identity
- **Primary Colors**: Deep Navy (#0A1128), Neon Cyan (#00D9FF), Gold (#FFD700)
- **Effects**: Glassmorphism, diagonal elements, floating particles, glowing neon borders
- **Layout**: Asymmetric arrangements with layered depth and overlapping cards
- **Motion**: Kinetic animations suggesting technological advancement

### Typography
- **Display**: Space Mono (bold, futuristic)
- **Headings**: Poppins (geometric, modern)
- **Body**: Inter (clean, readable)

## 🏗️ Project Structure

```
DigitalEdu-Landing-Page/
├── client/
│   ├── public/              # Static assets (favicon, robots.txt)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx     # Main landing page with all sections
│   │   │   └── NotFound.tsx
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility helpers
│   │   ├── App.tsx          # Routes & top-level layout
│   │   ├── main.tsx         # React entry point
│   │   └── index.css        # Global styles with custom theme
│   └── index.html
├── server/                  # Backend placeholder (static-only)
├── shared/                  # Shared types
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 📋 Features

### Hero Section
- Strong headline: "Connect the World of Education"
- Subtext explaining global access to all education levels
- Dual CTA buttons (Get Started / Explore Courses)
- Animated background gradient with floating particles

### Features Section
- **Global Curriculum Access** - Worldwide educational systems
- **All Levels of Learning** - Early education through professional development
- **Smart Learning System** - AI-powered personalization
- **Global Community** - Connect with 150+ countries

### Categories Section
- Kids Education (Ages 3-8)
- School (Grade 1-12)
- University (All Years)
- Professional Courses (Career Growth)

### About Section
- Platform vision and mission statement
- Emphasis on democratizing global education

### Team Section
- **Latera Zelalem** - CEO & Founder
- **Natnael Ermiyas** - CTO
- **Tadios Aschalew** - Technical Manager

### Footer
- Quick links and navigation
- Social media connections
- Copyright information

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (package manager)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Development Server
The dev server runs on `http://localhost:3000` with hot module reloading enabled.

## 🎯 Key Animations & Interactions

- **Floating Animation**: Elements gently float up and down
- **Glow Pulse**: Neon borders pulse with intensity
- **Fade-in-up**: Smooth entrance animations on scroll
- **Hover Effects**: Cards lift and glow on hover
- **Scroll Parallax**: Background moves at different speeds

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + Custom CSS
- **Routing**: Wouter (client-side)
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Fonts**: Google Fonts (Space Mono, Poppins, Inter)

## 📱 Responsive Design

The landing page is fully responsive with breakpoints for:
- Mobile (< 640px)
- Tablet (640px - 1024px)
- Desktop (> 1024px)

## 🌐 Deployment

### Render Deployment

1. Push code to GitHub repository
2. Connect repository to Render
3. Configure environment:
   - Build Command: `pnpm build`
   - Start Command: `pnpm start`
4. Deploy

### Environment Variables
The project uses built-in Manus environment variables:
- `VITE_ANALYTICS_ENDPOINT`
- `VITE_ANALYTICS_WEBSITE_ID`
- `VITE_APP_ID`
- `VITE_APP_TITLE`

## 📦 Asset Management

All visual assets are stored in CDN and served via cloud URLs:
- Hero background with fluid gradients
- Feature section backgrounds
- Category patterns
- Tech orbs and decorative elements

## 🎨 Customization

### Colors
Edit CSS variables in `client/src/index.css`:
```css
:root {
  --primary: #00D9FF;        /* Neon Cyan */
  --secondary: #FFD700;      /* Gold */
  --background: #0A1128;     /* Deep Navy */
  --foreground: #E8F4F8;     /* Light Blue */
}
```

### Typography
Font families are defined in `client/src/index.css`:
```css
.font-display { font-family: 'Space Mono', monospace; }
.font-heading { font-family: 'Poppins', sans-serif; }
.font-body { font-family: 'Inter', sans-serif; }
```

## 📄 License

MIT License - See LICENSE file for details

## 👥 Team

**Paradox Team**
- Latera Zelalem (CEO & Founder)
- Natnael Ermiyas (CTO)
- Tadios Aschalew (Technical Manager)

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the team.

---

**DigitalEdu** - Connecting the World of Education, One Learner at a Time
