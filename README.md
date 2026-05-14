# RTCMon Dashboard

RTCMon Dashboard is a high-density, operator-focused monitoring interface for WebRTC telemetry. It provides real-time insights into conference quality, session-level debugging, and fleet-wide analytics.

## 🚀 Key Features

- **Conference Explorer**: Searchable and filterable list of active and historical WebRTC conferences.
- **Session Debugger**: Synchronized time-series charts for Bitrate, Packet Loss, Jitter, RTT, and eMOS.
- **Visual Topology**: Interactive network path visualization (Client → Relay → SFU).
- **Fleet Analytics**: Global KPIs, eMOS trends, and dimensional breakdowns (Browser, OS, Region, Network).
- **User Lookup**: Identify and troubleshoot sessions based on participant identity or display name.
- **Team Management**: Admin interface for managing members, roles, and invitations.
- **Application Settings**: Configure observation thresholds and data retention policies per application.

## 🛠 Tech Stack

- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Data Viz**: Custom SVG-based charts (optimized for high-density telemetry)
- **API Communication**: Native Fetch with typed wrappers and session management

## 📦 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Create a `.env` file in the root directory:
   ```bash
   VITE_API_BASE_URL=http://localhost:8081
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production

```bash
npm run build
npm run preview
```

## 📂 Project Structure

```text
src/
├── assets/         # Static assets and images
├── components/     # UI components
│   ├── analytics/  # Analytics-specific components
│   ├── layout/     # Sidebar, Header, and Shell
│   ├── lookup/     # User search components
│   ├── settings/   # Multi-tab settings components
│   ├── team/       # Team management components
│   └── ui/         # Atomic UI primitives
├── context/        # React Context providers (Auth, App, Theme)
├── lib/            # Utility libraries (API client, helpers)
├── pages/          # Top-level page components
├── App.tsx         # Main routing and entry point
└── index.css       # Global styles and design system tokens
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Base URL for the RTCMon Query API | `http://localhost:8081` |

## 📄 License

© 2026 RTCMon Team. All rights reserved.
