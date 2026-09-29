export interface ForestDivision {
  id: string;
  name: string;
  district: string;
  hq: string;
  totalAreaHa: number;
  plantationAreaHa: number;
  denseForestHa: number;
  openForestHa: number;
  carbonStockTco2e: number;
  center: [number, number]; // [lng, lat]
  samplePlotsCount: number;
  activeAlertsCount: number;
  dfoName: string;
  description: string;
  coordinates: number[][][]; // GeoJSON polygon coordinates
}

export interface TreeSpecies {
  id: string;
  vernacular: string; // Assamese / Local
  scientific: string;
  family: string;
  woodDensity: number; // g/cm³
  allometricEquation: string;
  typicalMaxHeight: number; // m
  carbonRatio: number; // % dry weight (typically 0.47)
  category: 'Commercial' | 'Ecological' | 'Bamboo' | 'Agroforestry';
  nativeToAssam: boolean;
}

export interface SamplePlotRecord {
  id: string;
  plotCode: string;
  divisionId: string;
  divisionName: string;
  range: string;
  beat: string;
  lat: number;
  lng: number;
  elevationM: number;
  slopeDeg: number;
  aspectDeg: number;
  radiusMeters: number;
  forestType: string;
  canopyDensityPercent: number;
  soilType: string;
  disturbances: string[];
  surveyorName: string;
  surveyorDesignation: string;
  surveyDate: string;
  treeCount: number;
  totalAgbKg: number;
  totalBgbKg: number;
  totalCarbonKg: number;
  totalTco2e: number;
  dominantSpecies: string;
  photoUrl?: string;
  verificationStatus: 'VERIFIED' | 'PENDING_REVIEW' | 'FLAGGED';
}

export interface TreeRecord {
  id: string;
  plotId: string;
  plotCode: string;
  tagNumber: string;
  speciesVernacular: string;
  speciesScientific: string;
  dbhCm: number;
  heightM: number;
  crownDiameterM?: number;
  woodDensity: number;
  healthStatus: 'HEALTHY' | 'STRESSED' | 'DAMAGED' | 'DEAD';
  agbKg: number;
  bgbKg: number;
  carbonKg: number;
  tco2eKg: number;
  photoUrl?: string;
  measuredAt: string;
}

export interface RemoteSensingAlert {
  id: string;
  divisionId: string;
  divisionName: string;
  range: string;
  beat: string;
  type: 'DEGRADATION_CANOPY_LOSS' | 'ENCROACHMENT' | 'FIRE_BURN_SCAR' | 'PLANTATION_MORTALITY' | 'GAP_EXPANSION_OPPORTUNITY';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'OPPORTUNITY';
  lat: number;
  lng: number;
  areaHa: number;
  detectedDate: string;
  sensor: 'Sentinel-2 MSI' | 'Sentinel-1 C-SAR' | 'PlanetScope' | 'MODIS/VIIRS';
  ndviDropPercent?: number;
  baselineNdvi?: number;
  currentNdvi?: number;
  status: 'DETECTED' | 'DISPATCHED' | 'GROUND_TRUTHED' | 'REMEDIATED' | 'CLOSED';
  assignedOfficer?: string;
  description: string;
  recommendedAction: string;
}

export interface ExpansionRecommendation {
  id: string;
  divisionId: string;
  divisionName: string;
  locationName: string;
  lat: number;
  lng: number;
  availableAreaHa: number;
  currentLandUse: string;
  canopyDensity: string;
  recommendedSpecies: string[];
  plantingDensityStemsPerHa: number;
  est10YrSequestrationTco2e: number;
  estCarbonCreditsTco2e: number;
  priorityScore: number; // 1-100
  suitabilityReason: string;
}

export interface SatelliteSceneRecord {
  id: string;
  sceneId: string;
  sensor: 'Sentinel-2A' | 'Sentinel-2B' | 'Sentinel-1A (SAR)' | 'Landsat-9';
  acquisitionDate: string;
  cloudCoverPercent: number;
  divisionCovered: string;
  resolutionM: number;
  bandsAvailable: string[];
  status: 'PROCESSED' | 'INGESTED' | 'READY_FOR_ANALYSIS';
  indicesCalculated: string[];
  meanNdvi: number;
  meanEvi: number;
  thumbnailUrl: string;
  storageMb: number;
}

// -------------------------------------------------------------
// ASSAM FOREST DIVISIONS DATA (Focus on ASSAC / NESFIC-D-15 Pilot Sites)
// -------------------------------------------------------------
export const ASSAM_DIVISIONS: ForestDivision[] = [
  {
    id: 'div-kaziranga',
    name: 'Kaziranga Buffer Zone & Agroforestry Division',
    district: 'Golaghat & Nagaon',
    hq: 'Bokakhat',
    totalAreaHa: 18450,
    plantationAreaHa: 4850,
    denseForestHa: 8900,
    openForestHa: 4700,
    carbonStockTco2e: 485200,
    center: [93.18, 26.58],
    samplePlotsCount: 24,
    activeAlertsCount: 3,
    dfoName: 'Shri Arunabh Bordoloi, AFS',
    description: 'Critical corridor buffer zone surrounding Kaziranga National Park. Multi-species agroforestry & enrichment plantations to mitigate human-wildlife conflict and sequester carbon.',
    coordinates: [[
      [93.05, 26.52], [93.35, 26.54], [93.38, 26.68], [93.12, 26.66], [93.05, 26.52]
    ]]
  },
  {
    id: 'div-manas',
    name: 'Manas Tiger Reserve Buffer & Corridor Division',
    district: 'Baksa & Chirang',
    hq: 'Barpeta Road',
    totalAreaHa: 22100,
    plantationAreaHa: 6200,
    denseForestHa: 11400,
    openForestHa: 4500,
    carbonStockTco2e: 562100,
    center: [90.95, 26.72],
    samplePlotsCount: 18,
    activeAlertsCount: 2,
    dfoName: 'Smti Ruma Saikia, IFS',
    description: 'Biodiversity hotspot corridor connecting Manas with Royal Manas Bhutan. Social forestry and compensatory afforestation blocks.',
    coordinates: [[
      [90.80, 26.65], [91.15, 26.67], [91.18, 26.85], [90.82, 26.82], [90.80, 26.65]
    ]]
  },
  {
    id: 'div-karbi',
    name: 'Karbi Anglong East Forest Division',
    district: 'Karbi Anglong',
    hq: 'Diphu',
    totalAreaHa: 34500,
    plantationAreaHa: 8900,
    denseForestHa: 17200,
    openForestHa: 8400,
    carbonStockTco2e: 890400,
    center: [93.42, 26.05],
    samplePlotsCount: 32,
    activeAlertsCount: 4,
    dfoName: 'Shri Bikash Sing Teron, AFS',
    description: 'Hilly terrain featuring extensive indigenous Sal, Gamari, and commercial Bamboo plantations with high carbon sequestration potential.',
    coordinates: [[
      [93.25, 25.90], [93.65, 25.92], [93.68, 26.22], [93.28, 26.20], [93.25, 25.90]
    ]]
  },
  {
    id: 'div-kamrup',
    name: 'Kamrup Social Forestry & Agroforestry Division',
    district: 'Kamrup & Kamrup Metro',
    hq: 'Guwahati',
    totalAreaHa: 14200,
    plantationAreaHa: 4100,
    denseForestHa: 5800,
    openForestHa: 4300,
    carbonStockTco2e: 312800,
    center: [91.75, 26.12],
    samplePlotsCount: 16,
    activeAlertsCount: 1,
    dfoName: 'Shri Himangshu Goswami, AFS',
    description: 'Urban and peri-urban compensatory afforestation, riverbank bamboo stabilization, and degraded hill slope revegetation.',
    coordinates: [[
      [91.55, 26.00], [91.95, 26.02], [91.98, 26.25], [91.58, 26.23], [91.55, 26.00]
    ]]
  },
  {
    id: 'div-dimahasao',
    name: 'Dima Hasao Hill Slope Revegetation Division',
    district: 'Dima Hasao',
    hq: 'Haflong',
    totalAreaHa: 28900,
    plantationAreaHa: 7300,
    denseForestHa: 14800,
    openForestHa: 6800,
    carbonStockTco2e: 724000,
    center: [92.98, 25.28],
    samplePlotsCount: 20,
    activeAlertsCount: 2,
    dfoName: 'Shri P. J. Phonglo, AFS',
    description: 'Catchment revegetation along Barak-Brahmaputra watershed. High-altitude mixed broadleaf and indigenous bamboo blocks.',
    coordinates: [[
      [92.80, 25.10], [93.20, 25.12], [93.22, 25.45], [92.82, 25.42], [92.80, 25.10]
    ]]
  },
  {
    id: 'div-jorhat',
    name: 'Jorhat Riverine & Agroforestry Division',
    district: 'Jorhat & Majuli',
    hq: 'Jorhat',
    totalAreaHa: 12800,
    plantationAreaHa: 3600,
    denseForestHa: 4900,
    openForestHa: 4300,
    carbonStockTco2e: 245000,
    center: [94.22, 26.75],
    samplePlotsCount: 14,
    activeAlertsCount: 1,
    dfoName: 'Smti Dipali Kalita, AFS',
    description: 'Floodplain and sandbar (chapori) afforestation using Simul, Khair, and Sissoo, plus tea-estate shade tree agroforestry MRV.',
    coordinates: [[
      [94.05, 26.65], [94.40, 26.67], [94.42, 26.88], [94.08, 26.85], [94.05, 26.65]
    ]]
  }
];

// -------------------------------------------------------------
// INDIGENOUS ASSAM TREE SPECIES & FSI ALLOMETRIC PARAMETERS
// -------------------------------------------------------------
export const ASSAM_TREE_SPECIES: TreeSpecies[] = [
  {
    id: 'sp-hollong',
    vernacular: 'Hollong (হোলং)',
    scientific: 'Dipterocarpus macrocarpus',
    family: 'Dipterocarpaceae',
    woodDensity: 0.72,
    allometricEquation: 'AGB = 0.0673 * (ρ * DBH² * H)^0.976 (Chave et al. / FSI Moist Deciduous)',
    typicalMaxHeight: 45,
    carbonRatio: 0.47,
    category: 'Commercial',
    nativeToAssam: true
  },
  {
    id: 'sp-sal',
    vernacular: 'Sal (শাল)',
    scientific: 'Shorea robusta',
    family: 'Dipterocarpaceae',
    woodDensity: 0.82,
    allometricEquation: 'AGB = 0.0509 * ρ * DBH² * H (FSI Sal Model 2020)',
    typicalMaxHeight: 35,
    carbonRatio: 0.475,
    category: 'Commercial',
    nativeToAssam: true
  },
  {
    id: 'sp-teak',
    vernacular: 'Teak / Segun (চেগুন)',
    scientific: 'Tectona grandis',
    family: 'Lamiaceae',
    woodDensity: 0.65,
    allometricEquation: 'AGB = 0.0887 * (DBH^2.44) * (H^0.35) (IPCC / FSI Teak)',
    typicalMaxHeight: 32,
    carbonRatio: 0.47,
    category: 'Commercial',
    nativeToAssam: false
  },
  {
    id: 'sp-gamari',
    vernacular: 'Gamari (গমাৰী)',
    scientific: 'Gmelina arborea',
    family: 'Lamiaceae',
    woodDensity: 0.51,
    allometricEquation: 'AGB = 0.0673 * (ρ * DBH² * H)^0.976',
    typicalMaxHeight: 28,
    carbonRatio: 0.465,
    category: 'Commercial',
    nativeToAssam: true
  },
  {
    id: 'sp-nahar',
    vernacular: 'Nahar / Ironwood (নাহৰ)',
    scientific: 'Mesua ferrea',
    family: 'Calophyllaceae',
    woodDensity: 0.94,
    allometricEquation: 'AGB = 0.0712 * (ρ * DBH² * H)^0.98',
    typicalMaxHeight: 30,
    carbonRatio: 0.48,
    category: 'Ecological',
    nativeToAssam: true
  },
  {
    id: 'sp-bamboo-jati',
    vernacular: 'Jati Bamboo (জাতি বাঁহ)',
    scientific: 'Bambusa tulda',
    family: 'Poaceae',
    woodDensity: 0.68,
    allometricEquation: 'AGB = 0.0825 * (DBH^2.15) (FSI Bamboo Culm Model)',
    typicalMaxHeight: 18,
    carbonRatio: 0.46,
    category: 'Bamboo',
    nativeToAssam: true
  },
  {
    id: 'sp-bamboo-bhaluka',
    vernacular: 'Bhaluka Bamboo (ভালুকা বাঁহ)',
    scientific: 'Bambusa balcooa',
    family: 'Poaceae',
    woodDensity: 0.72,
    allometricEquation: 'AGB = 0.0910 * (DBH^2.21)',
    typicalMaxHeight: 22,
    carbonRatio: 0.465,
    category: 'Bamboo',
    nativeToAssam: true
  },
  {
    id: 'sp-rubber',
    vernacular: 'Rubber (ৰাবাৰ)',
    scientific: 'Hevea brasiliensis',
    family: 'Euphorbiaceae',
    woodDensity: 0.60,
    allometricEquation: 'AGB = 0.0673 * (ρ * DBH² * H)^0.976',
    typicalMaxHeight: 25,
    carbonRatio: 0.46,
    category: 'Agroforestry',
    nativeToAssam: false
  },
  {
    id: 'sp-sissoo',
    vernacular: 'Sissoo / Shisham (শিশু)',
    scientific: 'Dalbergia sissoo',
    family: 'Fabaceae',
    woodDensity: 0.75,
    allometricEquation: 'AGB = 0.0620 * ρ * DBH² * H',
    typicalMaxHeight: 25,
    carbonRatio: 0.47,
    category: 'Commercial',
    nativeToAssam: true
  },
  {
    id: 'sp-simul',
    vernacular: 'Simul (শিমলু)',
    scientific: 'Bombax ceiba',
    family: 'Malvaceae',
    woodDensity: 0.42,
    allometricEquation: 'AGB = 0.054 * (DBH^2.31)',
    typicalMaxHeight: 38,
    carbonRatio: 0.45,
    category: 'Ecological',
    nativeToAssam: true
  },
  {
    id: 'sp-khair',
    vernacular: 'Khair (খৈৰ)',
    scientific: 'Senegalia catechu',
    family: 'Fabaceae',
    woodDensity: 0.88,
    allometricEquation: 'AGB = 0.065 * (ρ * DBH² * H)^0.976',
    typicalMaxHeight: 15,
    carbonRatio: 0.48,
    category: 'Commercial',
    nativeToAssam: true
  }
];

// -------------------------------------------------------------
// SAMPLE PLOTS GROUND-TRUTH DATA (Assam Pilots)
// -------------------------------------------------------------
export const INITIAL_SAMPLE_PLOTS: SamplePlotRecord[] = [
  {
    id: 'plot-kaz-001',
    plotCode: 'KAZ-001',
    divisionId: 'div-kaziranga',
    divisionName: 'Kaziranga Buffer Zone',
    range: 'Bokakhat Range',
    beat: 'Panbari Beat',
    lat: 26.5824,
    lng: 93.1512,
    elevationM: 88,
    slopeDeg: 3,
    aspectDeg: 140,
    radiusMeters: 15,
    forestType: 'Semi-Evergreen Mixed Plantation',
    canopyDensityPercent: 78,
    soilType: 'Alluvial Clay Loam',
    disturbances: ['Minor elephant browsing'],
    surveyorName: 'Forest Guard Biren Gogoi',
    surveyorDesignation: 'Beat Officer, Panbari',
    surveyDate: '2026-09-15',
    treeCount: 42,
    totalAgbKg: 18450,
    totalBgbKg: 4797,
    totalCarbonKg: 10926,
    totalTco2e: 40.06,
    dominantSpecies: 'Shorea robusta (Sal)',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'plot-kaz-002',
    plotCode: 'KAZ-002',
    divisionId: 'div-kaziranga',
    divisionName: 'Kaziranga Buffer Zone',
    range: 'Kaziranga Range',
    beat: 'Kohora Buffer',
    lat: 26.5910,
    lng: 93.1840,
    elevationM: 92,
    slopeDeg: 2,
    aspectDeg: 120,
    radiusMeters: 15,
    forestType: 'Indigenous Agroforestry Block (Yr 4)',
    canopyDensityPercent: 72,
    soilType: 'Sandy Alluvium',
    disturbances: ['None'],
    surveyorName: 'Forest Guard Pranab Hazarika',
    surveyorDesignation: 'Field Enumerator',
    surveyDate: '2026-09-18',
    treeCount: 38,
    totalAgbKg: 14200,
    totalBgbKg: 3692,
    totalCarbonKg: 8408,
    totalTco2e: 30.83,
    dominantSpecies: 'Dipterocarpus macrocarpus (Hollong)',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'plot-man-001',
    plotCode: 'MAN-001',
    divisionId: 'div-manas',
    divisionName: 'Manas Tiger Reserve Buffer',
    range: 'Bansbari Range',
    beat: 'Kahitama Beat',
    lat: 26.7180,
    lng: 90.9620,
    elevationM: 110,
    slopeDeg: 4,
    aspectDeg: 180,
    radiusMeters: 15,
    forestType: 'Moist Deciduous Corridor',
    canopyDensityPercent: 82,
    soilType: 'Terai Sandy Loam',
    disturbances: ['Invasive Mikania patches'],
    surveyorName: 'Forest Guard Manash Basumatary',
    surveyorDesignation: 'Range Field Assistant',
    surveyDate: '2026-09-20',
    treeCount: 45,
    totalAgbKg: 21100,
    totalBgbKg: 5486,
    totalCarbonKg: 12495,
    totalTco2e: 45.81,
    dominantSpecies: 'Gmelina arborea (Gamari)',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'plot-kar-001',
    plotCode: 'KAR-001',
    divisionId: 'div-karbi',
    divisionName: 'Karbi Anglong East',
    range: 'Diphu Range',
    beat: 'Manja Beat',
    lat: 26.0420,
    lng: 93.4150,
    elevationM: 245,
    slopeDeg: 12,
    aspectDeg: 90,
    radiusMeters: 15,
    forestType: 'Hilly Teak & Bamboo Plantation',
    canopyDensityPercent: 68,
    soilType: 'Red Lateritic Soil',
    disturbances: ['Controlled traditional fire break'],
    surveyorName: 'Forest Guard Sontosh Rongphar',
    surveyorDesignation: 'Beat Officer, Manja',
    surveyDate: '2026-09-22',
    treeCount: 52,
    totalAgbKg: 16900,
    totalBgbKg: 4394,
    totalCarbonKg: 10008,
    totalTco2e: 36.69,
    dominantSpecies: 'Tectona grandis (Teak)',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'plot-kam-001',
    plotCode: 'KAM-001',
    divisionId: 'div-kamrup',
    divisionName: 'Kamrup Social Forestry',
    range: 'Rani Range',
    beat: 'Garbhanga Buffer',
    lat: 26.0950,
    lng: 91.7120,
    elevationM: 140,
    slopeDeg: 8,
    aspectDeg: 210,
    radiusMeters: 15,
    forestType: 'Compensatory Afforestation (Yr 3)',
    canopyDensityPercent: 64,
    soilType: 'Red Silty Clay',
    disturbances: ['Cattle grazing traces'],
    surveyorName: 'Forest Guard Rituraj Das',
    surveyorDesignation: 'Field Surveyor',
    surveyDate: '2026-09-24',
    treeCount: 36,
    totalAgbKg: 9800,
    totalBgbKg: 2548,
    totalCarbonKg: 5803,
    totalTco2e: 21.28,
    dominantSpecies: 'Mesua ferrea (Nahar)',
    verificationStatus: 'PENDING_REVIEW'
  }
];

// -------------------------------------------------------------
// ACTIVE ALERTS & AREAS REQUIRING ATTENTION
// (Fulfills: "Identification of areas requiring attention or expansion")
// -------------------------------------------------------------
export const REMOTE_SENSING_ALERTS: RemoteSensingAlert[] = [
  {
    id: 'alt-001',
    divisionId: 'div-kaziranga',
    divisionName: 'Kaziranga Buffer Zone',
    range: 'Bokakhat Range',
    beat: 'Diffloo Beat (Sector 4)',
    type: 'DEGRADATION_CANOPY_LOSS',
    severity: 'CRITICAL',
    lat: 26.5680,
    lng: 93.2140,
    areaHa: 4.8,
    detectedDate: '2026-09-26',
    sensor: 'Sentinel-2 MSI',
    ndviDropPercent: 34.2,
    baselineNdvi: 0.76,
    currentNdvi: 0.50,
    status: 'DISPATCHED',
    assignedOfficer: 'Range Officer J. C. Das',
    description: 'Sudden canopy loss detected over 4.8 hectares in buffer strip. NDVI dropped from 0.76 to 0.50 within a 10-day satellite window.',
    recommendedAction: 'Immediate joint field inspection with beat team to verify illegal felling vs flood scouring; dispatch drone verification.'
  },
  {
    id: 'alt-002',
    divisionId: 'div-manas',
    divisionName: 'Manas Tiger Reserve Buffer',
    range: 'Panbari Range',
    beat: 'Kukurmara Beat',
    type: 'ENCROACHMENT',
    severity: 'HIGH',
    lat: 26.6850,
    lng: 90.8920,
    areaHa: 8.5,
    detectedDate: '2026-09-24',
    sensor: 'Sentinel-1 C-SAR',
    status: 'DETECTED',
    assignedOfficer: 'Beat Officer H. Brahma',
    description: 'Persistent SAR backscatter alteration indicating land clearing and temporary structure buildup inside reserve boundary perimeter.',
    recommendedAction: 'Verify cadastral boundary alignment; notify District Magistrate & enforce Assam Forest Protection Act notice.'
  },
  {
    id: 'alt-003',
    divisionId: 'div-karbi',
    divisionName: 'Karbi Anglong East',
    range: 'Hamren Range',
    beat: 'Baithalangso Beat',
    type: 'PLANTATION_MORTALITY',
    severity: 'MEDIUM',
    lat: 25.9840,
    lng: 93.3120,
    areaHa: 12.2,
    detectedDate: '2026-09-22',
    sensor: 'Sentinel-2 MSI',
    ndviDropPercent: 22.8,
    baselineNdvi: 0.68,
    currentNdvi: 0.52,
    status: 'GROUND_TRUTHED',
    assignedOfficer: 'Forest Guard B. Terang',
    description: 'Year-2 Gamari plantation showing high mortality rate (approx 28% sapling loss) due to post-monsoon localized drought and termite stress.',
    recommendedAction: 'Schedule gap-filling (beating up) with 2,500 nursery saplings during pre-winter planting window; apply biological pest control.'
  },
  {
    id: 'alt-004',
    divisionId: 'div-jorhat',
    divisionName: 'Jorhat Riverine Division',
    range: 'Majuli Range',
    beat: 'Salmora Riverbank',
    type: 'FIRE_BURN_SCAR',
    severity: 'MEDIUM',
    lat: 26.8120,
    lng: 94.1850,
    areaHa: 6.4,
    detectedDate: '2026-09-27',
    sensor: 'MODIS/VIIRS',
    status: 'REMEDIATED',
    assignedOfficer: 'Range Officer P. Bora',
    description: 'Grassland burn scar impinging on peripheral Simul regeneration belt. Fire extinguished by local joint forest committee.',
    recommendedAction: 'Establish 10m plowed fire trace along riverine plantation border; conduct community awareness meeting.'
  }
];

// -------------------------------------------------------------
// AI-IDENTIFIED AREAS SUITABLE FOR EXPANSION & ENRICHMENT
// (Fulfills: "Identification of areas requiring attention or expansion")
// -------------------------------------------------------------
export const EXPANSION_OPPORTUNITIES: ExpansionRecommendation[] = [
  {
    id: 'exp-001',
    divisionId: 'div-karbi',
    divisionName: 'Karbi Anglong East',
    locationName: 'Manja-Langvoku Degraded Scrub Valley',
    lat: 26.0650,
    lng: 93.3850,
    availableAreaHa: 420,
    currentLandUse: 'Degraded Open Scrub (Canopy < 15%)',
    canopyDensity: 'Open Scrub (0.12 NDVI)',
    recommendedSpecies: ['Gamari (Gmelina arborea)', 'Jati Bamboo (Bambusa tulda)', 'Hollong'],
    plantingDensityStemsPerHa: 1100,
    est10YrSequestrationTco2e: 48500,
    estCarbonCreditsTco2e: 38800,
    priorityScore: 94,
    suitabilityReason: 'Optimal topography, fertile alluvial slope, high community willingness through Karbi Anglong Autonomous Council JFM committees.'
  },
  {
    id: 'exp-002',
    divisionId: 'div-kaziranga',
    divisionName: 'Kaziranga Buffer Zone',
    locationName: 'Mornoi Corridor Agroforestry Gap',
    lat: 26.5420,
    lng: 93.2850,
    availableAreaHa: 185,
    currentLandUse: 'Fallow Riverine Silt Land',
    canopyDensity: 'Non-Forest / Fallow (0.18 NDVI)',
    recommendedSpecies: ['Sal (Shorea robusta)', 'Simul (Bombax ceiba)', 'Khair (Senegalia catechu)'],
    plantingDensityStemsPerHa: 800,
    est10YrSequestrationTco2e: 22400,
    estCarbonCreditsTco2e: 17920,
    priorityScore: 89,
    suitabilityReason: 'Direct animal migration corridor; provides flood refuge high ground while maximizing additionality for carbon credits.'
  },
  {
    id: 'exp-003',
    divisionId: 'div-kamrup',
    divisionName: 'Kamrup Social Forestry',
    locationName: 'Garbhanga South Degraded Ridge',
    lat: 26.0450,
    lng: 91.7650,
    availableAreaHa: 260,
    currentLandUse: 'Degraded Hill Canopy (Canopy < 25%)',
    canopyDensity: 'Fragmented Forest (0.35 NDVI)',
    recommendedSpecies: ['Nahar (Mesua ferrea)', 'Sal (Shorea robusta)', 'Teak'],
    plantingDensityStemsPerHa: 950,
    est10YrSequestrationTco2e: 34100,
    estCarbonCreditsTco2e: 27280,
    priorityScore: 86,
    suitabilityReason: 'Soil stabilization to prevent urban siltation in Guwahati drainage basins; eligible under compensatory afforestation guidelines.'
  }
];

// -------------------------------------------------------------
// SATELLITE SCENES INGESTED (Optical + SAR for Assam Monsoons)
// (Fulfills: "Generate repeatable spatial monitoring layers")
// -------------------------------------------------------------
export const SATELLITE_SCENES: SatelliteSceneRecord[] = [
  {
    id: 'sc-01',
    sceneId: 'S2B_MSIL2A_20260925T043709_N0511_R033_T46RGS',
    sensor: 'Sentinel-2B',
    acquisitionDate: '2026-09-25',
    cloudCoverPercent: 4.2,
    divisionCovered: 'Kaziranga & Karbi Anglong East',
    resolutionM: 10,
    bandsAvailable: ['B02 (Blue)', 'B03 (Green)', 'B04 (Red)', 'B08 (NIR)', 'B11 (SWIR)'],
    status: 'READY_FOR_ANALYSIS',
    indicesCalculated: ['NDVI', 'EVI', 'NDRE', 'Canopy Height Model'],
    meanNdvi: 0.74,
    meanEvi: 0.58,
    thumbnailUrl: '/assets/satellite/s2_kaziranga.jpg',
    storageMb: 840
  },
  {
    id: 'sc-02',
    sceneId: 'S1A_IW_GRDH_1SDV_20260923T115542_056123_06C4F1',
    sensor: 'Sentinel-1A (SAR)',
    acquisitionDate: '2026-09-23',
    cloudCoverPercent: 0.0, // SAR penetrates clouds!
    divisionCovered: 'Manas & Baksa Corridor',
    resolutionM: 10,
    bandsAvailable: ['VV (Co-polar)', 'VH (Cross-polar)', 'VV/VH Ratio'],
    status: 'PROCESSED',
    indicesCalculated: ['SAR Backscatter', 'Biomass Surface Roughness', 'Canopy Water Content'],
    meanNdvi: 0.71,
    meanEvi: 0.54,
    thumbnailUrl: '/assets/satellite/s1_manas.jpg',
    storageMb: 1120
  },
  {
    id: 'sc-03',
    sceneId: 'S2A_MSIL2A_20260918T043651_N0511_R033_T46RFT',
    sensor: 'Sentinel-2A',
    acquisitionDate: '2026-09-18',
    cloudCoverPercent: 8.7,
    divisionCovered: 'Kamrup Social Forestry & Dima Hasao',
    resolutionM: 10,
    bandsAvailable: ['B02', 'B03', 'B04', 'B08', 'B11', 'B12'],
    status: 'READY_FOR_ANALYSIS',
    indicesCalculated: ['NDVI', 'NDRE', 'Canopy Cover Density'],
    meanNdvi: 0.69,
    meanEvi: 0.51,
    thumbnailUrl: '/assets/satellite/s2_kamrup.jpg',
    storageMb: 790
  }
];

// -------------------------------------------------------------
// MULTI-TEMPORAL PLANTATION GROWTH TRAJECTORY DATA
// (Fulfills: "Track change/growth and relevant indicators over time")
// -------------------------------------------------------------
export const PLANTATION_GROWTH_SERIES = [
  { year: 'Year 1 (2022)', ageYears: 1, expectedDbh: 4.5, actualDbh: 4.8, expectedHeight: 3.2, actualHeight: 3.5, ndvi: 0.42, biomassTonsPerHa: 8.5 },
  { year: 'Year 2 (2023)', ageYears: 2, expectedDbh: 8.2, actualDbh: 8.6, expectedHeight: 6.1, actualHeight: 6.4, ndvi: 0.55, biomassTonsPerHa: 22.4 },
  { year: 'Year 3 (2024)', ageYears: 3, expectedDbh: 12.4, actualDbh: 12.9, expectedHeight: 9.5, actualHeight: 10.1, ndvi: 0.68, biomassTonsPerHa: 45.8 },
  { year: 'Year 4 (2025)', ageYears: 4, expectedDbh: 16.5, actualDbh: 17.2, expectedHeight: 13.0, actualHeight: 13.8, ndvi: 0.74, biomassTonsPerHa: 76.2 },
  { year: 'Year 5 (2026)', ageYears: 5, expectedDbh: 20.2, actualDbh: 21.4, expectedHeight: 16.2, actualHeight: 17.1, ndvi: 0.79, biomassTonsPerHa: 112.5 },
  { year: 'Year 7 (Proj)', ageYears: 7, expectedDbh: 26.5, actualDbh: 27.8, expectedHeight: 21.0, actualHeight: 22.2, ndvi: 0.83, biomassTonsPerHa: 175.0 },
  { year: 'Year 10 (Proj)', ageYears: 10, expectedDbh: 34.0, actualDbh: 35.5, expectedHeight: 26.5, actualHeight: 27.8, ndvi: 0.86, biomassTonsPerHa: 254.0 },
];

// -------------------------------------------------------------
// HELPER ALLOMETRIC BIOMASS CALCULATOR (FSI & Chave et al.)
// -------------------------------------------------------------
export function computeTreeCarbonMetrics(dbhCm: number, heightM: number, woodDensity: number = 0.65) {
  if (!dbhCm || dbhCm <= 0 || !heightM || heightM <= 0) {
    return { agbKg: 0, bgbKg: 0, totalBiomassKg: 0, carbonKg: 0, tco2e: 0 };
  }

  // Chave et al. (2014) Moist Tropical Forest Model:
  // AGB = 0.0673 * (ρ * DBH² * H)^0.976
  const agbKg = 0.0673 * Math.pow(woodDensity * Math.pow(dbhCm, 2) * heightM, 0.976);
  
  // Cairns et al. (1997) / IPCC Good Practice Guidance root-to-shoot ratio: 0.26
  const bgbKg = agbKg * 0.26;
  
  const totalBiomassKg = agbKg + bgbKg;
  
  // Carbon fraction = 0.47 (IPCC 2006 default)
  const carbonKg = totalBiomassKg * 0.47;
  
  // CO2 equivalent = Carbon * (44 / 12)
  const tco2e = (carbonKg * (44 / 12)) / 1000; // in metric tonnes

  return {
    agbKg: Number(agbKg.toFixed(2)),
    bgbKg: Number(bgbKg.toFixed(2)),
    totalBiomassKg: Number(totalBiomassKg.toFixed(2)),
    carbonKg: Number(carbonKg.toFixed(2)),
    tco2e: Number(tco2e.toFixed(4))
  };
}
