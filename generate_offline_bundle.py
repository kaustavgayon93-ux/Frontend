import os

html_content = r'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>ASSAC MRV - Forest Field Collect</title>
  <style>
    :root {
      --primary: #15803d;
      --primary-dark: #166534;
      --primary-light: #22c55e;
      --primary-subtle: #f0fdf4;
      --accent: #ca8a04;
      --bg: #f8fafc;
      --surface: #ffffff;
      --border: #e2e8f0;
      --text: #0f172a;
      --text-muted: #64748b;
      --danger: #ef4444;
      --radius: 12px;
      --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      -webkit-tap-highlight-color: transparent;
    }

    body {
      background-color: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      padding-bottom: 70px;
    }

    /* Header */
    header {
      background: linear-gradient(135deg, #14532d 0%, #166534 100%);
      color: white;
      padding: 16px 20px;
      position: sticky;
      top: 0;
      z-index: 50;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .header-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-icon {
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.15);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .brand-title {
      font-size: 1.15rem;
      font-weight: 700;
      letter-spacing: -0.01em;
    }
    .brand-subtitle {
      font-size: 0.72rem;
      opacity: 0.85;
    }
    .network-pill {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 20px;
      background: #22c55e;
      color: white;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .network-pill.offline {
      background: #eab308;
      color: #713f12;
    }

    /* Top stats row */
    .stats-bar {
      background: #14532d;
      color: #bbf7d0;
      padding: 8px 20px;
      font-size: 0.75rem;
      display: flex;
      justify-content: space-around;
      border-top: 1px solid rgba(255,255,255,0.1);
    }
    .stat-item {
      text-align: center;
    }
    .stat-val {
      font-weight: 700;
      color: white;
      font-size: 0.85rem;
    }

    /* Container */
    .container {
      max-width: 600px;
      margin: 0 auto;
      width: 100%;
      padding: 16px;
    }

    /* Tabs */
    .tab-content {
      display: none;
    }
    .tab-content.active {
      display: block;
      animation: fadeIn 0.2s ease-in-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Cards */
    .card {
      background: var(--surface);
      border-radius: var(--radius);
      border: 1px solid var(--border);
      padding: 16px;
      margin-bottom: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .card-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--primary-dark);
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Forms */
    .form-group {
      margin-bottom: 14px;
    }
    label {
      display: block;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 5px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    input, select, textarea {
      width: 100%;
      padding: 11px 14px;
      border-radius: 8px;
      border: 1.5px solid var(--border);
      font-size: 0.95rem;
      background: #ffffff;
      color: var(--text);
      transition: border-color 0.15s;
    }
    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: var(--primary);
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .form-row-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 10px;
    }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      padding: 12px 18px;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      width: 100%;
      transition: background 0.15s, transform 0.05s;
    }
    .btn:active {
      transform: scale(0.98);
    }
    .btn-primary {
      background: var(--primary);
      color: white;
    }
    .btn-primary:hover {
      background: var(--primary-dark);
    }
    .btn-secondary {
      background: #f1f5f9;
      color: var(--text);
      border: 1px solid var(--border);
    }
    .btn-gps {
      background: #0284c7;
      color: white;
    }
    .btn-sm {
      padding: 6px 12px;
      font-size: 0.8rem;
      border-radius: 6px;
      width: auto;
    }
    .btn-danger {
      background: #fee2e2;
      color: #b91c1c;
    }

    /* Tree row item */
    .tree-item {
      background: #f8fafc;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 10px;
      position: relative;
    }
    .tree-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .tree-tag {
      font-weight: 700;
      color: var(--primary-dark);
      font-size: 0.85rem;
    }
    .tree-carbon-badge {
      background: var(--primary-subtle);
      color: var(--primary-dark);
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 700;
    }

    /* Live calculation box */
    .calc-box {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border: 1.5px solid #86efac;
      border-radius: 10px;
      padding: 14px;
      margin-top: 14px;
    }
    .calc-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      text-align: center;
      margin-top: 8px;
    }
    .calc-grid-item {
      background: rgba(255,255,255,0.7);
      padding: 8px 4px;
      border-radius: 6px;
    }
    .calc-num {
      font-size: 1.05rem;
      font-weight: 800;
      color: #14532d;
    }
    .calc-lbl {
      font-size: 0.68rem;
      color: #166534;
      text-transform: uppercase;
      font-weight: 600;
    }

    /* Plot card in list */
    .plot-card {
      border: 1.5px solid var(--border);
      border-radius: 10px;
      padding: 14px;
      margin-bottom: 12px;
      background: white;
      transition: all 0.15s;
    }
    .plot-card:hover {
      border-color: var(--primary);
    }
    .plot-card-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 6px;
    }
    .plot-code {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text);
    }
    .plot-div {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .plot-stats {
      display: flex;
      gap: 16px;
      font-size: 0.8rem;
      margin: 8px 0;
      color: var(--text-muted);
    }
    .plot-stats b {
      color: var(--text);
    }

    /* Bottom Navigation */
    nav.bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 64px;
      background: white;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: space-around;
      align-items: center;
      z-index: 100;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
    }
    .nav-btn {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.72rem;
      font-weight: 600;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px 0;
      transition: color 0.15s;
    }
    .nav-btn svg {
      width: 22px;
      height: 22px;
    }
    .nav-btn.active {
      color: var(--primary);
    }

    /* Modal / Inspect Overlay */
    .modal {
      display: none;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.6);
      z-index: 200;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .modal.active {
      display: flex;
    }
    .modal-box {
      background: white;
      border-radius: 14px;
      max-width: 500px;
      width: 100%;
      max-height: 85vh;
      overflow-y: auto;
      padding: 20px;
    }

    .banner-assac {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 0.8rem;
      color: #1e40af;
      margin-bottom: 14px;
      line-height: 1.4;
    }
  </style>
</head>
<body>

  <!-- App Header -->
  <header>
    <div class="header-top">
      <div class="brand">
        <div class="brand-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L3 9h3v11h12V9h3L12 2z"></path>
            <path d="M12 9v11"></path>
            <path d="M9 13l3-3 3 3"></path>
          </svg>
        </div>
        <div>
          <div class="brand-title">ASSAC MRV Field</div>
          <div class="brand-subtitle">Assam State Space Applications Centre</div>
        </div>
      </div>
      <div id="netStatus" class="network-pill">
        <span>●</span> <span id="netStatusText">Online</span>
      </div>
    </div>
  </header>

  <!-- Live Stats Bar -->
  <div class="stats-bar">
    <div class="stat-item">
      <div class="stat-val" id="statStoredPlots">0</div>
      <div>Stored Plots</div>
    </div>
    <div class="stat-item">
      <div class="stat-val" id="statTotalTrees">0</div>
      <div>Trees Logged</div>
    </div>
    <div class="stat-item">
      <div class="stat-val" id="statTotalBiomass">0.0 t</div>
      <div>Total Biomass</div>
    </div>
    <div class="stat-item">
      <div class="stat-val" id="statPendingSync">0</div>
      <div>Pending Sync</div>
    </div>
  </div>

  <!-- Main Container -->
  <div class="container">

    <!-- TAB 1: NEW PLOT FORM -->
    <div id="tab-survey" class="tab-content active">
      <div class="banner-assac">
        <b>Assam Forest MRV Protocol (NESFIC-D-15)</b><br>
        Collect sample quadrate data (20m x 20m = 0.04 ha). All data is saved 100% offline to this Android device.
      </div>

      <div class="card">
        <div class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          Plot Location & Metadata
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Plot Identifier</label>
            <input type="text" id="plotCode" placeholder="AS-KZR-2026-P01">
          </div>
          <div class="form-group">
            <label>Survey Date</label>
            <input type="date" id="surveyDate">
          </div>
        </div>

        <div class="form-group">
          <label>Forest Division</label>
          <select id="divisionSelect">
            <option value="div-kaziranga">Kaziranga Buffer Zone & Agroforestry</option>
            <option value="div-manas">Manas Tiger Reserve Buffer & Corridor</option>
            <option value="div-karbi">Karbi Anglong East Forest Division</option>
            <option value="div-dima">Dima Hasao Hill Forest Division</option>
            <option value="div-kamrup">Kamrup Social Forestry & Jalukbari</option>
            <option value="div-dehing">Dehing Patkai Rain Forest Division</option>
            <option value="div-sonitpur">Sonitpur East Forest Division</option>
            <option value="div-cachar">Cachar Forest Division (Barak Valley)</option>
          </select>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Range</label>
            <input type="text" id="plotRange" placeholder="e.g. Bokakhat Range">
          </div>
          <div class="form-group">
            <label>Beat</label>
            <input type="text" id="plotBeat" placeholder="e.g. Diffolu Beat">
          </div>
        </div>

        <div class="form-group">
          <label>Forest Canopy Type</label>
          <select id="forestType">
            <option value="Tropical Semi-Evergreen">Tropical Semi-Evergreen</option>
            <option value="Tropical Moist Deciduous (Sal)">Tropical Moist Deciduous (Sal Dominant)</option>
            <option value="Tropical Wet Evergreen">Tropical Wet Evergreen (Hollong-Nahor)</option>
            <option value="Riverine Alluvial Forest">Riverine Alluvial & Silt Forest</option>
            <option value="Bamboo Brakes / Secondary">Bamboo Brakes / Secondary Growth</option>
            <option value="Agroforestry / Plantation">Agroforestry / Compensatory Plantation</option>
          </select>
        </div>

        <!-- GPS Capture Box -->
        <div style="background:#f0f9ff; border:1.5px solid #bae6fd; border-radius:10px; padding:12px; margin-bottom:14px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-size:0.8rem; font-weight:700; color:#0369a1; text-transform:uppercase;">GPS Coordinates</span>
            <span id="gpsAccuracy" style="font-size:0.75rem; color:#0284c7; font-weight:600;">No GPS lock yet</span>
          </div>
          <div class="form-row">
            <div class="form-group" style="margin-bottom:6px;">
              <label>Latitude (°N)</label>
              <input type="number" id="gpsLat" step="0.000001" placeholder="26.582400">
            </div>
            <div class="form-group" style="margin-bottom:6px;">
              <label>Longitude (°E)</label>
              <input type="number" id="gpsLng" step="0.000001" placeholder="93.184200">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group" style="margin-bottom:8px;">
              <label>Elevation (m)</label>
              <input type="number" id="gpsElev" placeholder="78">
            </div>
            <div class="form-group" style="margin-bottom:8px;">
              <label>Slope (°)</label>
              <input type="number" id="plotSlope" placeholder="5">
            </div>
          </div>
          <button type="button" class="btn btn-gps" id="btnGetGps" onclick="captureDeviceGPS()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
            Capture Device GPS (Auto-Fix)
          </button>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Surveyor Name</label>
            <input type="text" id="surveyorName" placeholder="e.g. Ranjit Kalita">
          </div>
          <div class="form-group">
            <label>Designation</label>
            <input type="text" id="surveyorDesig" placeholder="Forest Guard / GIS Surveyor">
          </div>
        </div>
      </div>

      <!-- Tree Measurements Card -->
      <div class="card">
        <div class="card-title" style="justify-content:space-between;">
          <div style="display:flex; align-items:center; gap:8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22v-7"></path><path d="M7 15l5-5 5 5"></path><path d="M5 10l7-7 7 7"></path></svg>
            Tree Enumeration (<span id="treeCountDisplay">0</span> Trees)
          </div>
          <button type="button" class="btn btn-sm btn-primary" onclick="addTreeRow()">+ Add Tree</button>
        </div>

        <div id="treesContainer">
          <!-- Tree rows dynamically inserted here -->
        </div>

        <!-- Live Plot Biomass Aggregation -->
        <div class="calc-box">
          <div style="font-size:0.85rem; font-weight:700; color:#166534; display:flex; justify-content:space-between;">
            <span>Estimated Plot Biomass & Carbon</span>
            <span style="font-size:0.75rem; color:#15803d;">FSI 2020 Model</span>
          </div>
          <div class="calc-grid">
            <div class="calc-grid-item">
              <div class="calc-num" id="liveAgb">0.0</div>
              <div class="calc-lbl">AGB (kg)</div>
            </div>
            <div class="calc-grid-item">
              <div class="calc-num" id="liveBgb">0.0</div>
              <div class="calc-lbl">BGB (kg)</div>
            </div>
            <div class="calc-grid-item">
              <div class="calc-num" id="liveCarbon">0.0</div>
              <div class="calc-lbl">Carbon (kg)</div>
            </div>
          </div>
          <div class="calc-grid" style="grid-template-columns: 1fr 1fr; margin-top:8px;">
            <div class="calc-grid-item">
              <div class="calc-num" id="liveTco2e">0.000</div>
              <div class="calc-lbl">Total CO₂e (Tonnes)</div>
            </div>
            <div class="calc-grid-item">
              <div class="calc-num" id="liveTonnesPerHa">0.0</div>
              <div class="calc-lbl">Est. Biomass (t/ha)</div>
            </div>
          </div>
        </div>

        <div style="margin-top:16px; display:flex; gap:10px;">
          <button type="button" class="btn btn-primary" onclick="saveCurrentPlot()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
            Save Plot to Offline Storage
          </button>
        </div>
      </div>
    </div>

    <!-- TAB 2: SAVED PLOTS LIST -->
    <div id="tab-plots" class="tab-content">
      <div class="card">
        <div class="card-title" style="justify-content:space-between;">
          <div style="display:flex; align-items:center; gap:8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            Saved Field Surveys
          </div>
          <button class="btn btn-sm btn-secondary" onclick="renderPlotsList()">Refresh</button>
        </div>
        <div id="savedPlotsList">
          <!-- Plots rendered here -->
        </div>
      </div>
    </div>

    <!-- TAB 3: SYNC & EXPORT -->
    <div id="tab-sync" class="tab-content">
      <div class="card">
        <div class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
          ASSAC Central Cloud Synchronization
        </div>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:14px;">
          When internet or WiFi is restored, push pending field survey plots directly to the ASSAC Central Forest MRV Database.
        </p>

        <div class="form-group">
          <label>Central MRV API Endpoint</label>
          <input type="text" id="apiEndpoint" value="http://localhost:8000/api/v1">
        </div>

        <button class="btn btn-primary" onclick="syncWithAssacServer()" style="margin-bottom:12px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
          Sync Pending Surveys (<span id="syncPendingBtnCount">0</span>)
        </button>

        <div id="syncResultStatus" style="display:none; padding:10px; border-radius:8px; font-size:0.85rem; margin-top:10px;"></div>
      </div>

      <div class="card">
        <div class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Offline Backup & Export
        </div>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:14px;">
          Export field survey data directly as CSV (for Excel, QGIS) or JSON to transfer via WhatsApp, SD card, or email.
        </p>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
          <button class="btn btn-secondary" onclick="exportData('csv')">Export CSV (Excel)</button>
          <button class="btn btn-secondary" onclick="exportData('json')">Export JSON</button>
        </div>
      </div>
    </div>

  </div>

  <!-- Bottom Navigation -->
  <nav class="bottom-nav">
    <button class="nav-btn active" onclick="switchTab('survey', this)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
      <span>New Survey</span>
    </button>
    <button class="nav-btn" onclick="switchTab('plots', this)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
      <span>Saved Plots</span>
    </button>
    <button class="nav-btn" onclick="switchTab('sync', this)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
      <span>Sync / Cloud</span>
    </button>
  </nav>

  <!-- Inspect Plot Modal -->
  <div id="inspectModal" class="modal">
    <div class="modal-box">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <h3 id="modalPlotTitle" style="color:var(--primary-dark);">Plot Details</h3>
        <button class="btn btn-sm btn-secondary" onclick="closeInspectModal()">✕</button>
      </div>
      <div id="modalPlotContent"></div>
    </div>
  </div>

  <script>
    // -------------------------------------------------------------
    // SPECIES DEFINITIONS (Assam Forest Department & FSI Models)
    // -------------------------------------------------------------
    const ASSAM_SPECIES = [
      { id: 'sp-sal', name: 'Sal (শালো)', scientific: 'Shorea robusta', density: 0.88, cat: 'Commercial' },
      { id: 'sp-teak', name: 'Teak (চেগুণ)', scientific: 'Tectona grandis', density: 0.65, cat: 'Commercial' },
      { id: 'sp-hollong', name: 'Hollong (হোলোং - State Tree)', scientific: 'Dipterocarpus retusus', density: 0.72, cat: 'Ecological' },
      { id: 'sp-gamari', name: 'Gamari (গমাৰী)', scientific: 'Gmelina arborea', density: 0.51, cat: 'Commercial' },
      { id: 'sp-nahar', name: 'Nahar / Ironwood (নাহৰ)', scientific: 'Mesua ferrea', density: 0.94, cat: 'Ecological' },
      { id: 'sp-sissoo', name: 'Sissoo / Shisham (শিশু)', scientific: 'Dalbergia sissoo', density: 0.75, cat: 'Commercial' },
      { id: 'sp-simul', name: 'Simul (শিমলু)', scientific: 'Bombax ceiba', density: 0.42, cat: 'Ecological' },
      { id: 'sp-khair', name: 'Khair (খৈৰ)', scientific: 'Senegalia catechu', density: 0.88, cat: 'Commercial' },
      { id: 'sp-bamboo-jati', name: 'Jati Bamboo (জাতি বাঁহ)', scientific: 'Bambusa tulda', density: 0.68, cat: 'Bamboo' },
      { id: 'sp-bamboo-bhaluka', name: 'Bhaluka Bamboo (ভালুকা বাঁহ)', scientific: 'Bambusa balcooa', density: 0.72, cat: 'Bamboo' },
      { id: 'sp-rubber', name: 'Rubber (ৰাবাৰ)', scientific: 'Hevea brasiliensis', density: 0.60, cat: 'Agroforestry' },
      { id: 'sp-other', name: 'Other Indigenous Species', scientific: 'Indigenous misc', density: 0.65, cat: 'Mixed' }
    ];

    // Current Survey State
    let currentTrees = [];

    // Allometric calculation based on FSI & Chave et al.
    function calcTreeBiomass(dbhCm, heightM, woodDensity) {
      if (!dbhCm || dbhCm <= 0 || !heightM || heightM <= 0) {
        return { agb: 0, bgb: 0, total: 0, carbon: 0, tco2e: 0 };
      }
      // AGB = 0.0673 * (woodDensity * DBH^2 * H)^0.976
      const agb = 0.0673 * Math.pow(woodDensity * Math.pow(dbhCm, 2) * heightM, 0.976);
      const bgb = agb * 0.26; // Root-to-shoot
      const total = agb + bgb;
      const carbon = total * 0.47;
      const tco2e = (carbon * (44 / 12)) / 1000;
      return {
        agb: parseFloat(agb.toFixed(2)),
        bgb: parseFloat(bgb.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        carbon: parseFloat(carbon.toFixed(2)),
        tco2e: parseFloat(tco2e.toFixed(4))
      };
    }

    // Tab Navigation
    function switchTab(tabId, btn) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
      document.getElementById('tab-' + tabId).classList.add('active');
      if (btn) btn.classList.add('active');

      if (tabId === 'plots') renderPlotsList();
      if (tabId === 'sync') updateSyncTab();
    }

    // Generate species options HTML
    function getSpeciesOptionsHtml(selectedId) {
      return ASSAM_SPECIES.map(sp => 
        `<option value="${sp.id}" data-density="${sp.density}" ${sp.id === selectedId ? 'selected' : ''}>${sp.name} (ρ=${sp.density})</option>`
      ).join('');
    }

    // Add a tree row
    function addTreeRow(initial = null) {
      const idx = currentTrees.length + 1;
      const tree = initial || {
        id: 't-' + Date.now() + '-' + idx,
        tag: 'T-' + String(idx).padStart(2, '0'),
        speciesId: 'sp-sal',
        density: 0.88,
        dbh: '',
        height: '',
        crown: '',
        health: 'HEALTHY'
      };

      currentTrees.push(tree);
      renderTrees();
    }

    // Render tree list
    function renderTrees() {
      const container = document.getElementById('treesContainer');
      document.getElementById('treeCountDisplay').innerText = currentTrees.length;

      if (currentTrees.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:20px; font-size:0.85rem; color:var(--text-muted);">No trees added to this quadrate yet. Tap "+ Add Tree" to begin enumeration.</p>';
        updateLiveBiomassTotals();
        return;
      }

      container.innerHTML = currentTrees.map((tree, i) => {
        const m = calcTreeBiomass(Number(tree.dbh), Number(tree.height), tree.density);
        return `
          <div class="tree-item" id="tree-row-${i}">
            <div class="tree-item-header">
              <span class="tree-tag">#${i+1} Tag: ${tree.tag}</span>
              <div style="display:flex; align-items:center; gap:8px;">
                <span class="tree-carbon-badge">${m.carbon} kg C (${m.tco2e} tCO₂e)</span>
                <button type="button" class="btn btn-sm btn-danger" onclick="removeTreeRow(${i})">✕</button>
              </div>
            </div>

            <div class="form-group" style="margin-bottom:8px;">
              <label>Species (Vernacular & Botanical)</label>
              <select onchange="updateTreeSpecies(${i}, this.value)">
                ${getSpeciesOptionsHtml(tree.speciesId)}
              </select>
            </div>

            <div class="form-row-3">
              <div class="form-group" style="margin-bottom:4px;">
                <label>DBH (cm)</label>
                <input type="number" step="0.1" value="${tree.dbh}" placeholder="e.g. 28.5" oninput="updateTreeField(${i}, 'dbh', this.value)">
              </div>
              <div class="form-group" style="margin-bottom:4px;">
                <label>Height (m)</label>
                <input type="number" step="0.1" value="${tree.height}" placeholder="e.g. 14.2" oninput="updateTreeField(${i}, 'height', this.value)">
              </div>
              <div class="form-group" style="margin-bottom:4px;">
                <label>Crown (m)</label>
                <input type="number" step="0.1" value="${tree.crown}" placeholder="e.g. 6.5" oninput="updateTreeField(${i}, 'crown', this.value)">
              </div>
            </div>
          </div>
        `;
      }).join('');

      updateLiveBiomassTotals();
    }

    function removeTreeRow(index) {
      currentTrees.splice(index, 1);
      renderTrees();
    }

    function updateTreeSpecies(index, speciesId) {
      const sp = ASSAM_SPECIES.find(s => s.id === speciesId);
      if (sp) {
        currentTrees[index].speciesId = speciesId;
        currentTrees[index].density = sp.density;
        renderTrees();
      }
    }

    function updateTreeField(index, field, value) {
      currentTrees[index][field] = value;
      updateLiveBiomassTotals();
    }

    function updateLiveBiomassTotals() {
      let totalAgb = 0, totalBgb = 0, totalCarbon = 0, totalTco2e = 0;
      currentTrees.forEach(t => {
        const m = calcTreeBiomass(Number(t.dbh), Number(t.height), t.density);
        totalAgb += m.agb;
        totalBgb += m.bgb;
        totalCarbon += m.carbon;
        totalTco2e += m.tco2e;
      });

      document.getElementById('liveAgb').innerText = totalAgb.toFixed(1);
      document.getElementById('liveBgb').innerText = totalBgb.toFixed(1);
      document.getElementById('liveCarbon').innerText = totalCarbon.toFixed(1);
      document.getElementById('liveTco2e').innerText = totalTco2e.toFixed(3);
      
      // Standard 20m x 20m quadrate is 400 m² = 0.04 ha -> factor is 25x to get per ha
      const tonnesPerHa = ((totalAgb + totalBgb) / 1000) * 25;
      document.getElementById('liveTonnesPerHa').innerText = tonnesPerHa.toFixed(1);
    }

    // Geolocation Auto-Capture
    function captureDeviceGPS() {
      const accSpan = document.getElementById('gpsAccuracy');
      const btn = document.getElementById('btnGetGps');
      accSpan.innerText = 'Locking onto satellites...';
      btn.disabled = true;

      if (!navigator.geolocation) {
        accSpan.innerText = 'Geolocation not supported on device';
        btn.disabled = false;
        return;
      }

      navigator.geolocation.getCurrentPosition(
        pos => {
          document.getElementById('gpsLat').value = pos.coords.latitude.toFixed(6);
          document.getElementById('gpsLng').value = pos.coords.longitude.toFixed(6);
          if (pos.coords.altitude) {
            document.getElementById('gpsElev').value = Math.round(pos.coords.altitude);
          }
          accSpan.innerText = `Accuracy: ±${pos.coords.accuracy.toFixed(1)}m (Lock OK)`;
          accSpan.style.color = '#15803d';
          btn.disabled = false;
        },
        err => {
          accSpan.innerText = `GPS error: ${err.message}. Enter manually.`;
          accSpan.style.color = '#b91c1c';
          btn.disabled = false;
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    }

    // Local Storage Plots Store
    const STORAGE_KEY = 'assac_mrv_plots_v1';

    function getLocalPlots() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    }

    function saveLocalPlots(plots) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plots));
      updateGlobalStats();
    }

    // Save Current Plot Survey
    function saveCurrentPlot() {
      const code = document.getElementById('plotCode').value.trim() || ('AS-PLOT-' + Date.now().toString().slice(-4));
      const divisionSelect = document.getElementById('divisionSelect');
      const divisionName = divisionSelect.options[divisionSelect.selectedIndex].text;
      const divisionId = divisionSelect.value;
      const date = document.getElementById('surveyDate').value || new Date().toISOString().split('T')[0];
      const range = document.getElementById('plotRange').value.trim() || 'Central Range';
      const beat = document.getElementById('plotBeat').value.trim() || 'Forest Beat 1';
      const forestType = document.getElementById('forestType').value;
      const lat = parseFloat(document.getElementById('gpsLat').value) || 26.5824;
      const lng = parseFloat(document.getElementById('gpsLng').value) || 93.1842;
      const elevation = parseFloat(document.getElementById('gpsElev').value) || 65;
      const slope = parseFloat(document.getElementById('plotSlope').value) || 4;
      const surveyor = document.getElementById('surveyorName').value.trim() || 'Enumerator (Field Staff)';
      const surveyorDesig = document.getElementById('surveyorDesig').value.trim() || 'Forester-I';

      let totalAgb = 0, totalBgb = 0, totalCarbon = 0, totalTco2e = 0;
      const processedTrees = currentTrees.map(t => {
        const m = calcTreeBiomass(Number(t.dbh), Number(t.height), t.density);
        totalAgb += m.agb;
        totalBgb += m.bgb;
        totalCarbon += m.carbon;
        totalTco2e += m.tco2e;
        const sp = ASSAM_SPECIES.find(s => s.id === t.speciesId);
        return {
          id: t.id,
          tag: t.tag,
          speciesVernacular: sp ? sp.name : 'Sal',
          speciesScientific: sp ? sp.scientific : 'Shorea robusta',
          density: t.density,
          dbhCm: Number(t.dbh) || 0,
          heightM: Number(t.height) || 0,
          crownM: Number(t.crown) || 0,
          health: t.health || 'HEALTHY',
          agbKg: m.agb,
          bgbKg: m.bgb,
          carbonKg: m.carbon,
          tco2e: m.tco2e
        };
      });

      const newPlot = {
        id: 'plot-' + Date.now(),
        plotCode: code,
        divisionId,
        divisionName,
        range,
        beat,
        forestType,
        surveyDate: date,
        lat,
        lng,
        elevationM: elevation,
        slopeDeg: slope,
        surveyorName: surveyor,
        surveyorDesignation: surveyorDesig,
        trees: processedTrees,
        treeCount: processedTrees.length,
        totalAgbKg: parseFloat(totalAgb.toFixed(2)),
        totalBgbKg: parseFloat(totalBgb.toFixed(2)),
        totalCarbonKg: parseFloat(totalCarbon.toFixed(2)),
        totalTco2e: parseFloat(totalTco2e.toFixed(4)),
        synced: false,
        createdAt: new Date().toISOString()
      };

      const plots = getLocalPlots();
      plots.unshift(newPlot);
      saveLocalPlots(plots);

      alert(`Plot ${code} successfully saved to local offline storage!\n${processedTrees.length} trees recorded, ${totalTco2e.toFixed(3)} tCO₂e.`);

      // Reset form
      initNewPlotForm();
      switchTab('plots');
    }

    // Initialize Form with Fresh Defaults
    function initNewPlotForm() {
      const now = new Date();
      const codeNum = Math.floor(100 + Math.random() * 900);
      document.getElementById('plotCode').value = `AS-KZR-${now.getFullYear()}-P${codeNum}`;
      document.getElementById('surveyDate').value = now.toISOString().split('T')[0];
      document.getElementById('plotRange').value = 'Bokakhat Range';
      document.getElementById('plotBeat').value = 'Diffolu Beat';
      document.getElementById('gpsLat').value = '26.582410';
      document.getElementById('gpsLng').value = '93.184200';
      document.getElementById('gpsElev').value = '74';
      document.getElementById('plotSlope').value = '3';
      document.getElementById('surveyorName').value = 'Assam Field Team';
      document.getElementById('surveyorDesig').value = 'Forester-I (GIS)';

      // Seed 2 default trees
      currentTrees = [
        { id: 't-1', tag: 'T-01', speciesId: 'sp-sal', density: 0.88, dbh: '28.4', height: '15.2', crown: '6.2', health: 'HEALTHY' },
        { id: 't-2', tag: 'T-02', speciesId: 'sp-hollong', density: 0.72, dbh: '34.0', height: '18.5', crown: '7.8', health: 'HEALTHY' }
      ];
      renderTrees();
    }

    // Render Saved Plots List
    function renderPlotsList() {
      const container = document.getElementById('savedPlotsList');
      const plots = getLocalPlots();

      if (plots.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:30px; color:var(--text-muted);">No surveys saved yet. Start a new survey tab to collect data in the field.</p>';
        return;
      }

      container.innerHTML = plots.map(p => `
        <div class="plot-card">
          <div class="plot-card-head">
            <div>
              <div class="plot-code">${p.plotCode}</div>
              <div class="plot-div">${p.divisionName} • ${p.range}</div>
            </div>
            <span style="font-size:0.75rem; padding:3px 8px; border-radius:12px; font-weight:700; ${p.synced ? 'background:#dcfce7; color:#15803d;' : 'background:#fef3c7; color:#b45309;'}">
              ${p.synced ? 'Synced' : 'Offline Pending'}
            </span>
          </div>
          <div class="plot-stats">
            <div>Trees: <b>${p.treeCount}</b></div>
            <div>Biomass: <b>${((p.totalAgbKg + p.totalBgbKg) / 1000).toFixed(2)} t</b></div>
            <div>Carbon: <b>${p.totalTco2e.toFixed(3)} tCO₂e</b></div>
          </div>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:10px;">
            GPS: ${p.lat.toFixed(5)}°N, ${p.lng.toFixed(5)}°E (${p.elevationM}m) • Date: ${p.surveyDate}
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-sm btn-secondary" onclick="inspectPlot('${p.id}')">Inspect</button>
            <button class="btn btn-sm btn-danger" onclick="deletePlot('${p.id}', '${p.plotCode}')">Delete</button>
          </div>
        </div>
      `).join('');
    }

    function inspectPlot(plotId) {
      const plots = getLocalPlots();
      const p = plots.find(x => x.id === plotId);
      if (!p) return;

      document.getElementById('modalPlotTitle').innerText = `Plot Survey: ${p.plotCode}`;
      let treesHtml = p.trees.map((t, idx) => `
        <tr style="border-bottom:1px solid #e2e8f0; font-size:0.8rem;">
          <td style="padding:6px 4px;">${t.tag}</td>
          <td style="padding:6px 4px;"><b>${t.speciesVernacular}</b><br><small>${t.speciesScientific}</small></td>
          <td style="padding:6px 4px;">${t.dbhCm} cm</td>
          <td style="padding:6px 4px;">${t.heightM} m</td>
          <td style="padding:6px 4px;">${t.carbonKg} kg</td>
          <td style="padding:6px 4px;"><b>${t.tco2e}</b></td>
        </tr>
      `).join('');

      document.getElementById('modalPlotContent').innerHTML = `
        <div style="font-size:0.85rem; margin-bottom:14px; line-height:1.6;">
          <b>Division:</b> ${p.divisionName}<br>
          <b>Range / Beat:</b> ${p.range}, ${p.beat}<br>
          <b>Coordinates:</b> ${p.lat}°N, ${p.lng}°E (Elev: ${p.elevationM}m, Slope: ${p.slopeDeg}°)<br>
          <b>Forest Type:</b> ${p.forestType}<br>
          <b>Surveyor:</b> ${p.surveyorName} (${p.surveyorDesignation})<br>
          <b>Total Biomass:</b> ${((p.totalAgbKg + p.totalBgbKg) / 1000).toFixed(2)} Metric Tonnes<br>
          <b>Total Carbon Stock:</b> ${p.totalCarbonKg} kg C (${p.totalTco2e} tCO₂e)
        </div>
        <h4 style="font-size:0.9rem; margin-bottom:8px; color:var(--primary-dark);">Tree Enumeration List</h4>
        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; text-align:left;">
            <thead>
              <tr style="background:#f1f5f9; font-size:0.75rem; text-transform:uppercase;">
                <th style="padding:6px 4px;">Tag</th>
                <th style="padding:6px 4px;">Species</th>
                <th style="padding:6px 4px;">DBH</th>
                <th style="padding:6px 4px;">Height</th>
                <th style="padding:6px 4px;">Carbon</th>
                <th style="padding:6px 4px;">tCO₂e</th>
              </tr>
            </thead>
            <tbody>
              ${treesHtml}
            </tbody>
          </table>
        </div>
      `;
      document.getElementById('inspectModal').classList.add('active');
    }

    function closeInspectModal() {
      document.getElementById('inspectModal').classList.remove('active');
    }

    function deletePlot(plotId, plotCode) {
      if (confirm(`Are you sure you want to delete survey plot ${plotCode}?`)) {
        let plots = getLocalPlots();
        plots = plots.filter(x => x.id !== plotId);
        saveLocalPlots(plots);
        renderPlotsList();
      }
    }

    // Global Stats update
    function updateGlobalStats() {
      const plots = getLocalPlots();
      const storedCount = plots.length;
      const treeCount = plots.reduce((acc, p) => acc + (p.trees ? p.trees.length : 0), 0);
      const totalBiomassKg = plots.reduce((acc, p) => acc + (p.totalAgbKg || 0) + (p.totalBgbKg || 0), 0);
      const pendingCount = plots.filter(p => !p.synced).length;

      document.getElementById('statStoredPlots').innerText = storedCount;
      document.getElementById('statTotalTrees').innerText = treeCount;
      document.getElementById('statTotalBiomass').innerText = (totalBiomassKg / 1000).toFixed(1) + ' t';
      document.getElementById('statPendingSync').innerText = pendingCount;
      const syncBtnCount = document.getElementById('syncPendingBtnCount');
      if (syncBtnCount) syncBtnCount.innerText = pendingCount;
    }

    function updateSyncTab() {
      updateGlobalStats();
    }

    // Synchronize with ASSAC Central Server
    async function syncWithAssacServer() {
      const endpoint = document.getElementById('apiEndpoint').value.trim() || 'http://localhost:8000/api/v1';
      const statusBox = document.getElementById('syncResultStatus');
      statusBox.style.display = 'block';
      statusBox.style.background = '#eff6ff';
      statusBox.style.color = '#1e40af';
      statusBox.innerText = 'Connecting to ASSAC Central Server...';

      let plots = getLocalPlots();
      let pending = plots.filter(p => !p.synced);

      if (pending.length === 0) {
        statusBox.style.background = '#dcfce7';
        statusBox.style.color = '#15803d';
        statusBox.innerText = 'All survey plots are already synced with ASSAC Central Server!';
        return;
      }

      try {
        let syncedCount = 0;
        for (const plot of pending) {
          try {
            // Push to backend /plots endpoint
            const res = await fetch(`${endpoint}/plots`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                plot_code: plot.plotCode,
                division_id: plot.divisionId,
                division_name: plot.divisionName,
                range: plot.range,
                beat: plot.beat,
                lat: plot.lat,
                lng: plot.lng,
                elevation_m: plot.elevationM,
                forest_type: plot.forestType,
                surveyor_name: plot.surveyorName,
                survey_date: plot.surveyDate,
                tree_count: plot.treeCount,
                total_agb_kg: plot.totalAgbKg,
                total_bgb_kg: plot.totalBgbKg,
                total_carbon_kg: plot.totalCarbonKg,
                total_tco2e: plot.totalTco2e
              })
            });
            if (res.ok) {
              plot.synced = true;
              syncedCount++;
            }
          } catch (e) {
            console.warn('Single plot sync error:', e);
          }
        }

        saveLocalPlots(plots);
        if (syncedCount > 0) {
          statusBox.style.background = '#dcfce7';
          statusBox.style.color = '#15803d';
          statusBox.innerText = `Success! Synced ${syncedCount} of ${pending.length} plots with ASSAC Central Server.`;
        } else {
          statusBox.style.background = '#fef3c7';
          statusBox.style.color = '#b45309';
          statusBox.innerText = `Central server unreachable (${endpoint}). All surveys remain safely cached on this phone.`;
        }
      } catch (err) {
        statusBox.style.background = '#fef3c7';
        statusBox.style.color = '#b45309';
        statusBox.innerText = `Network offline: Surveys safely preserved in offline storage.`;
      }
      updateGlobalStats();
    }

    // Export Data (CSV / JSON)
    function exportData(format) {
      const plots = getLocalPlots();
      if (plots.length === 0) {
        alert('No survey plots available to export.');
        return;
      }

      if (format === 'json') {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(plots, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `ASSAC_Field_Plots_${Date.now()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      } else if (format === 'csv') {
        // Flatten trees into CSV
        let csv = 'PlotCode,Division,Range,Beat,Date,Lat,Lng,ElevationM,ForestType,Surveyor,TreeTag,SpeciesVernacular,SpeciesScientific,WoodDensity,DBH_cm,Height_m,AGB_kg,BGB_kg,Carbon_kg,tCO2e\n';
        plots.forEach(p => {
          if (p.trees && p.trees.length > 0) {
            p.trees.forEach(t => {
              csv += `"${p.plotCode}","${p.divisionName}","${p.range}","${p.beat}","${p.surveyDate}",${p.lat},${p.lng},${p.elevationM},"${p.forestType}","${p.surveyorName}","${t.tag}","${t.speciesVernacular}","${t.speciesScientific}",${t.density},${t.dbhCm},${t.heightM},${t.agbKg},${t.bgbKg},${t.carbonKg},${t.tco2e}\n`;
            });
          } else {
            csv += `"${p.plotCode}","${p.divisionName}","${p.range}","${p.beat}","${p.surveyDate}",${p.lat},${p.lng},${p.elevationM},"${p.forestType}","${p.surveyorName}","","","",0,0,0,${p.totalAgbKg},${p.totalBgbKg},${p.totalCarbonKg},${p.totalTco2e}\n`;
          }
        });

        const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `ASSAC_Field_Enumeration_${Date.now()}.csv`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      }
    }

    // Network Status listener
    function updateNetStatus() {
      const isOnline = navigator.onLine;
      const pill = document.getElementById('netStatus');
      const text = document.getElementById('netStatusText');
      if (isOnline) {
        pill.className = 'network-pill';
        text.innerText = 'Online';
      } else {
        pill.className = 'network-pill offline';
        text.innerText = 'Offline Mode';
      }
    }

    window.addEventListener('online', updateNetStatus);
    window.addEventListener('offline', updateNetStatus);

    // Initial Seed Data if empty
    function seedInitialDemoData() {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const demoPlots = [
          {
            id: 'plot-demo-1',
            plotCode: 'AS-KZR-2026-P01',
            divisionId: 'div-kaziranga',
            divisionName: 'Kaziranga Buffer Zone & Agroforestry',
            range: 'Bokakhat Range',
            beat: 'Diffolu River Beat',
            forestType: 'Tropical Semi-Evergreen',
            surveyDate: '2026-09-28',
            lat: 26.582410,
            lng: 93.184200,
            elevationM: 74,
            slopeDeg: 3,
            surveyorName: 'Pranab Saikia',
            surveyorDesignation: 'Forest Guard',
            treeCount: 3,
            totalAgbKg: 1420.5,
            totalBgbKg: 369.3,
            totalCarbonKg: 841.2,
            totalTco2e: 3.084,
            synced: true,
            createdAt: '2026-09-28T09:30:00Z',
            trees: [
              { id: 't1', tag: 'T-01', speciesVernacular: 'Sal (শালো)', speciesScientific: 'Shorea robusta', density: 0.88, dbhCm: 32.5, heightM: 16.4, agbKg: 680.2, bgbKg: 176.8, carbonKg: 402.8, tco2e: 1.477 },
              { id: 't2', tag: 'T-02', speciesVernacular: 'Hollong (হোলোং)', speciesScientific: 'Dipterocarpus retusus', density: 0.72, dbhCm: 29.0, heightM: 18.0, agbKg: 520.1, bgbKg: 135.2, carbonKg: 308.0, tco2e: 1.129 },
              { id: 't3', tag: 'T-03', speciesVernacular: 'Gamari (গমাৰী)', speciesScientific: 'Gmelina arborea', density: 0.51, dbhCm: 24.2, heightM: 12.8, agbKg: 220.2, bgbKg: 57.3, carbonKg: 130.4, tco2e: 0.478 }
            ]
          }
        ];
        saveLocalPlots(demoPlots);
      }
    }

    // App Initialization
    window.addEventListener('DOMContentLoaded', () => {
      updateNetStatus();
      seedInitialDemoData();
      initNewPlotForm();
      updateGlobalStats();
    });
  </script>
</body>
</html>
'''

target_paths = [
    'android-source/source/app/src/main/assets/www/index.html',
    'public/field-collect-offline.html',
    'public/index-field.html'
]

for p in target_paths:
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(html_content)
    print(f"[OK] Written {p} ({len(html_content)} bytes)")
