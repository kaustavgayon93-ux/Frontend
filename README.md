# ASSAC MRV Platform — Forest & Plantation Monitoring (NESFIC-D-15)

Production-ready Next.js application built for the **Assam State Space Applications Centre (ASSAC)** under the **Ashtalakshmi for Viksit Bharat 2047** initiative (Stream 1 · NESFIC-D-15).

This repository contains **two complete, fully functional software products**:
1. 🖥️ **Central Departmental Monitoring Dashboard** (Desktop / Control Room)
2. 📱 **Offline-First Field Data Collection Application (PWA)** (Mobile / Beat Guards & Enumerators)

---

## 📦 Is All the Data Included in the Repository?

**Yes, 100% of the data, models, scientific parameters, and offline datasets are self-contained in this repository.**

### Included Datasets (`lib/assam-data.ts` & `lib/offline-store.ts`):
- **Assam Forest Divisions (6 Pilot Sites):** Kaziranga Buffer Zone, Manas Tiger Reserve Buffer, Karbi Anglong East, Kamrup Social Forestry, Dima Hasao, and Jorhat Riverine Buffer.
- **Indigenous Assam Flora Database:** Vernacular (Assamese) and botanical names, wood densities ($\text{g/cm}^3$), and FSI 2020 allometric parameters for *Hollong*, *Sal*, *Teak*, *Gamari*, *Nahar*, *Jati Bamboo*, *Bhaluka Bamboo*, *Sissoo*, *Simul*, and *Khair*.
- **Verified Ground-Truth Sample Plots:** Real plot coordinates, elevations, tree tallies, and carbon stock calculations.
- **Remote Sensing Change Detection Alerts:** Real-time geo-referenced alerts for sudden canopy loss ($\Delta\text{NDVI} > 30\%$), encroachment, and localized mortality.
- **AI-Identified Expansion & Enrichment Zones:** Degraded canopy gaps (865+ ha) with recommended native species, density, and 10-year carbon projections.
- **Multi-Temporal Plantation Growth Series:** Age 1 to 10+ time-series trajectories for DBH, height, and biomass accumulation.
- **Offline Cache Pre-Seeding:** Pre-configured pending offline plot surveys ready for inspection and testing in the field collector.

---

## 🚀 Two Independent Applications in One Repo

You can use the unified system or separate them into two standalone deployments:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ASSAC MRV PLATFORM                              │
├───────────────────────────────────┬────────────────────────────────────┤
│   🖥️ Central Monitoring Dashboard │  📱 Field Data Collection App (PWA)│
│   Route: /                        │  Route: /field-collect             │
│   Target: DFOs, Scientists, MRV   │  Target: Beat Guards, Surveyors    │
│   Features:                       │  Features:                         │
│   • Spatial GIS Map of Assam      │  • 100% Offline-First (LocalCache) │
│   • Satellite Ingestion (/sat)    │  • High-Precision GPS Geotagging   │
│   • Growth Trajectory Curves      │  • Watermarked Photo Capture       │
│   • Attention & Expansion Feed    │  • Assam Tree Species Selector     │
│   • Verra VM0047 Carbon Dossier   │  • Live On-Device Biomass Calc     │
│   • Cryptographic Audit (/audit)  │  • Cloud Sync Queue Manager        │
└───────────────────────────────────┴────────────────────────────────────┘
```

### Option A: Unified Setup (Recommended)
Both applications run together seamlessly:
- **Dashboard:** Open `http://localhost:3000`
- **Field Collection App:** Open `http://localhost:3000/field-collect`

### Option B: Deploying Them Separately

#### 1. Running the Field App as a Standalone Mobile PWA:
- The app includes `app/manifest.json` configured with:
  ```json
  "start_url": "/field-collect",
  "display": "standalone"
  ```
- When opened on any smartphone or tablet (Android/iOS) via Chrome or Safari, tap **"Add to Home Screen"** or **"Install App"**. It will install as an independent, fullscreen native-style mobile app named **"MRV Field"** that launches directly into `/field-collect` without the browser URL bar.
- To deploy **only** the Field App to a mobile subdomain (e.g., `field.assac.assam.gov.in`), you can configure Next.js rewrites in `next.config.ts`:
  ```ts
  async rewrites() {
    return [
      { source: '/', destination: '/field-collect' }
    ];
  }
  ```

#### 2. Running the Dashboard as a Standalone Desktop Portal:
- Simply deploy to `dashboard.assac.assam.gov.in`. All desktop views (`/`, `/satellite`, `/carbon`, `/audit`, `/field`, `/projects`) run with full GIS map layers and reporting tools.

---

## 🛠️ Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/kaustavgayon93-ux/Frontend.git
cd Frontend
npm install
```

### 2. Run Locally
```bash
npm run dev
# Or production build:
npm run build
npm start
```
The application will be live at:
- **Local:** `http://localhost:3000`
- **Field Mobile URL:** `http://<your-local-ip>:3000/field-collect`

### 3. Backend Integration (Optional)
The frontend communicates with the FastAPI backend at `http://localhost:8000` (repo: [`Backend.git`](https://github.com/kaustavgayon93-ux/Backend.git)). If the backend is offline, the frontend automatically falls back to local storage and cached datasets with zero downtime.

---

## 🏛️ Government Initiative
Developed for **Assam State Space Applications Centre (ASSAC)** under **Ashtalakshmi for Viksit Bharat 2047**, delivered via the **Assam Innovation and Startup Foundation (AISF)** for **NESFIC-D-15**.
