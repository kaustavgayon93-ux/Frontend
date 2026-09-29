"use client";

import React, { useState } from 'react';
import { ArrowLeft, MapPin, Camera, Navigation, Layers, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ASSAM_DIVISIONS } from '@/lib/assam-data';
import { LocalPlot, savePlotLocally } from '@/lib/offline-store';
import TreeForm from './tree-form';

interface PlotFormProps {
  onBack: () => void;
  initialData?: LocalPlot;
}

const DISTURBANCE_OPTIONS = [
  'None / Undisturbed',
  'Elephant / Wildlife browsing',
  'Cattle / Domestic grazing',
  'Illegal lopping / Felling traces',
  'Invasive weed encroachment (Mikania / Lantana)',
  'Old fire / Char traces',
  'Soil erosion / Gully'
];

export default function PlotForm({ onBack, initialData }: PlotFormProps) {
  const [showTreeForm, setShowTreeForm] = useState(false);

  // Form State
  const [selectedDivisionId, setSelectedDivisionId] = useState(initialData?.divisionId || ASSAM_DIVISIONS[0].id);
  const [rangeName, setRangeName] = useState(initialData?.range || 'Bokakhat Range');
  const [beatName, setBeatName] = useState(initialData?.beat || 'Panbari Corridor');
  const [plotCode, setPlotCode] = useState(initialData?.plotCode || `KAZ-${Math.floor(100 + Math.random() * 900)}`);
  const [radiusMeters, setRadiusMeters] = useState(initialData?.radiusMeters || 15);
  
  // GPS State
  const [lat, setLat] = useState<number>(initialData?.lat || 26.5824);
  const [lng, setLng] = useState<number>(initialData?.lng || 93.1512);
  const [elevationM, setElevationM] = useState<number>(initialData?.elevationM || 88);
  const [accuracyM, setAccuracyM] = useState<number>(initialData?.accuracyM || 2.4);
  const [gpsStatus, setGpsStatus] = useState<string>('Coordinates acquired');
  const [isGettingGps, setIsGettingGps] = useState(false);

  // Environmental context
  const [forestType, setForestType] = useState(initialData?.forestType || 'Semi-Evergreen Mixed Plantation');
  const [canopyDensity, setCanopyDensity] = useState(initialData?.canopyDensityPercent || 75);
  const [soilType, setSoilType] = useState(initialData?.soilType || 'Alluvial Clay Loam');
  const [disturbances, setDisturbances] = useState<string[]>(initialData?.disturbances || ['None / Undisturbed']);
  const [surveyorName, setSurveyorName] = useState(initialData?.surveyorName || 'Forest Guard Biren Gogoi');
  const [surveyorDesignation, setSurveyorDesignation] = useState(initialData?.surveyorDesignation || 'Beat Officer');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.photoUrl || null);

  const selectedDivision = ASSAM_DIVISIONS.find(d => d.id === selectedDivisionId) || ASSAM_DIVISIONS[0];

  // Geolocation trigger
  const handleCaptureGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }
    setIsGettingGps(true);
    setGpsStatus('Acquiring high-precision satellite fix...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(Number(pos.coords.latitude.toFixed(6)));
        setLng(Number(pos.coords.longitude.toFixed(6)));
        setAccuracyM(Number((pos.coords.accuracy || 3.0).toFixed(1)));
        setElevationM(pos.coords.altitude ? Math.round(pos.coords.altitude) : 88);
        setGpsStatus('Live GPS Lock Confirmed (±' + (pos.coords.accuracy || 3).toFixed(1) + 'm)');
        setIsGettingGps(false);
      },
      (err) => {
        console.warn('GPS error, using divisional fallback coordinates', err);
        setLat(selectedDivision.center[1]);
        setLng(selectedDivision.center[0]);
        setAccuracyM(4.5);
        setGpsStatus('Using Division Reference GPS (Simulated)');
        setIsGettingGps(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Quick preset selector
  const handleApplyDivisionPreset = (divId: string) => {
    setSelectedDivisionId(divId);
    const div = ASSAM_DIVISIONS.find(d => d.id === divId);
    if (div) {
      setLat(div.center[1]);
      setLng(div.center[0]);
      if (div.id === 'div-kaziranga') {
        setRangeName('Bokakhat Range');
        setBeatName('Panbari Corridor');
        setPlotCode(`KAZ-${Math.floor(100 + Math.random() * 900)}`);
      } else if (div.id === 'div-manas') {
        setRangeName('Bansbari Range');
        setBeatName('Kahitama Beat');
        setPlotCode(`MAN-${Math.floor(100 + Math.random() * 900)}`);
      } else if (div.id === 'div-karbi') {
        setRangeName('Diphu Range');
        setBeatName('Manja Hill Beat');
        setPlotCode(`KAR-${Math.floor(100 + Math.random() * 900)}`);
      } else if (div.id === 'div-kamrup') {
        setRangeName('Rani Range');
        setBeatName('Garbhanga Buffer');
        setPlotCode(`KAM-${Math.floor(100 + Math.random() * 900)}`);
      }
      setGpsStatus(`Applied ${div.name} Reference Pin`);
    }
  };

  const toggleDisturbance = (dist: string) => {
    if (dist === 'None / Undisturbed') {
      setDisturbances(['None / Undisturbed']);
      return;
    }
    const filtered = disturbances.filter(d => d !== 'None / Undisturbed');
    if (filtered.includes(dist)) {
      const next = filtered.filter(d => d !== dist);
      setDisturbances(next.length ? next : ['None / Undisturbed']);
    } else {
      setDisturbances([...filtered, dist]);
    }
  };

  // Photo capture with simulated watermark
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgUrl = event.target?.result as string;
      setPhotoPreview(imgUrl);
    };
    reader.readAsDataURL(file);
  };

  // Build current plot object
  const currentPlotData: LocalPlot = {
    id: initialData?.id || `plot-${Date.now()}`,
    plotCode: plotCode.trim() || 'PLOT-DEMO',
    divisionId: selectedDivisionId,
    divisionName: selectedDivision.name,
    range: rangeName,
    beat: beatName,
    lat: lat,
    lng: lng,
    elevationM: elevationM,
    accuracyM: accuracyM,
    radiusMeters: Number(radiusMeters),
    forestType: forestType,
    canopyDensityPercent: Number(canopyDensity),
    soilType: soilType,
    disturbances: disturbances,
    surveyorName: surveyorName,
    surveyorDesignation: surveyorDesignation,
    surveyDate: new Date().toISOString().split('T')[0],
    trees: initialData?.trees || [],
    synced: false,
    photoUrl: photoPreview || undefined,
    notes: notes
  };

  const handleProceedToTrees = () => {
    savePlotLocally(currentPlotData);
    setShowTreeForm(true);
  };

  if (showTreeForm) {
    return (
      <TreeForm 
        plotData={currentPlotData} 
        onBack={() => setShowTreeForm(false)} 
        onFinish={onBack} 
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 pt-3 pb-24 px-3 sm:px-0">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">New Sample Plot Survey</h2>
            <p className="text-xs text-gray-500">ASSAC Ground Verification Protocol (NESFIC-D-15)</p>
          </div>
        </div>
        <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> FSI MRV Standard
        </span>
      </div>

      {/* Division & Administrative Info */}
      <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
        <h3 className="font-semibold text-gray-800 text-sm border-b pb-2 flex items-center gap-2">
          <Layers className="w-4 h-4 text-forest-600" /> Administrative Jurisdiction
        </h3>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Forest Division (Assam)
          </label>
          <select
            value={selectedDivisionId}
            onChange={(e) => handleApplyDivisionPreset(e.target.value)}
            className="w-full h-11 border border-gray-300 rounded-md px-3 text-sm bg-white focus:ring-2 focus:ring-forest-500 focus:outline-none font-medium"
          >
            {ASSAM_DIVISIONS.map(div => (
              <option key={div.id} value={div.id}>
                {div.name} ({div.district})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Forest Range
            </label>
            <Input 
              value={rangeName} 
              onChange={e => setRangeName(e.target.value)}
              className="h-10 text-sm"
              placeholder="e.g. Bokakhat"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Forest Beat / Block
            </label>
            <Input 
              value={beatName} 
              onChange={e => setBeatName(e.target.value)}
              className="h-10 text-sm"
              placeholder="e.g. Panbari"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Plot Code
            </label>
            <Input 
              value={plotCode} 
              onChange={e => setPlotCode(e.target.value)}
              className="h-10 text-sm font-mono font-bold text-forest-800"
              placeholder="KAZ-001"
            />
          </div>
        </div>
      </div>

      {/* High-Accuracy GPS Capture Card */}
      <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" /> Geolocation & Plot Geometry
          </h3>
          <span className="text-xs text-gray-500">{gpsStatus}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-3.5 rounded-lg border">
          <div>
            <span className="text-[10px] text-gray-500 block uppercase font-semibold">Latitude</span>
            <span className="text-sm font-mono font-bold text-gray-900">{lat}° N</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 block uppercase font-semibold">Longitude</span>
            <span className="text-sm font-mono font-bold text-gray-900">{lng}° E</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 block uppercase font-semibold">Elevation</span>
            <span className="text-sm font-mono font-bold text-gray-900">{elevationM} m MSL</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 block uppercase font-semibold">GPS Precision</span>
            <span className="text-sm font-mono font-bold text-emerald-700">±{accuracyM} m</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCaptureGps}
            disabled={isGettingGps}
            className="flex-1 h-11 border-forest-600 text-forest-700 hover:bg-forest-50"
          >
            <Navigation className={`w-4 h-4 mr-2 ${isGettingGps ? 'animate-spin' : ''}`} />
            {isGettingGps ? 'Acquiring Satellites...' : 'Capture Real-Time GPS'}
          </Button>

          <Button 
            type="button" 
            variant="secondary"
            onClick={() => handleApplyDivisionPreset(selectedDivisionId)}
            className="h-11 text-xs"
            title="Snap coordinates to division centroid"
          >
            Snap to {selectedDivision.hq}
          </Button>
        </div>

        {/* Plot Radius */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Sample Plot Dimension (Radius in meters)
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[10, 15, 20].map(rad => (
              <button
                key={rad}
                type="button"
                onClick={() => setRadiusMeters(rad)}
                className={`py-2 px-3 text-sm font-medium rounded-lg border text-center transition ${
                  radiusMeters === rad 
                    ? 'border-forest-600 bg-forest-50 text-forest-800 font-bold ring-2 ring-forest-500' 
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                r = {rad} m ({(Math.PI * rad * rad / 10000).toFixed(3)} ha)
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Forest Condition & Canopy Closure */}
      <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
        <h3 className="font-semibold text-gray-800 text-sm border-b pb-2">
          Forest & Ecological Attributes
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Forest / Plantation Type
            </label>
            <select
              value={forestType}
              onChange={e => setForestType(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md px-3 text-sm bg-white focus:ring-2 focus:ring-forest-500 focus:outline-none"
            >
              <option>Semi-Evergreen Mixed Plantation</option>
              <option>Sal (Shorea robusta) Pure/Mixed Stand</option>
              <option>Teak (Tectona grandis) Timber Stand</option>
              <option>Moist Deciduous Corridor</option>
              <option>Riverine Simul-Khair Formation</option>
              <option>Commercial / Rural Bamboo Brake</option>
              <option>Degraded Scrub for Enrichment</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Soil Classification
            </label>
            <select
              value={soilType}
              onChange={e => setSoilType(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md px-3 text-sm bg-white focus:ring-2 focus:ring-forest-500 focus:outline-none"
            >
              <option>Alluvial Clay Loam (Floodplain)</option>
              <option>Red Lateritic Loam (Hill slope)</option>
              <option>Terai Sandy Loam</option>
              <option>Riverine Fine Sand & Silt</option>
              <option>Black Humus-rich Forest Soil</option>
            </select>
          </div>
        </div>

        {/* Canopy Density Slider */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Canopy Cover Density: <span className="text-forest-700 font-bold">{canopyDensity}%</span>
            </label>
            <span className="text-xs text-gray-500">
              {canopyDensity >= 70 ? 'Very Dense Forest (VDF)' :
               canopyDensity >= 40 ? 'Moderately Dense (MDF)' :
               canopyDensity >= 10 ? 'Open Forest (OF)' : 'Scrub / Degraded'}
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="95"
            value={canopyDensity}
            onChange={e => setCanopyDensity(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-forest-600"
          />
        </div>

        {/* Disturbance Factors */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Signs of Disturbance / Stress in Plot
          </label>
          <div className="flex flex-wrap gap-2">
            {DISTURBANCE_OPTIONS.map(opt => {
              const isChecked = disturbances.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleDisturbance(opt)}
                  className={`text-xs px-2.5 py-1.5 rounded-full border transition flex items-center gap-1 ${
                    isChecked 
                      ? 'bg-amber-100 border-amber-300 text-amber-900 font-medium' 
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 text-amber-700" />}
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Geotagged Photo Evidence Capture */}
      <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
        <h3 className="font-semibold text-gray-800 text-sm border-b pb-2 flex items-center gap-2">
          <Camera className="w-4 h-4 text-forest-600" /> Geotagged Photo Evidence
        </h3>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="w-full sm:w-1/2">
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition">
              <Camera className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-xs font-semibold text-gray-700">Capture or Upload Canopy / Bole Photo</span>
              <span className="text-[10px] text-gray-400 mt-1">Automatic Watermark: Coordinates, Plot & Timestamp</span>
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                onChange={handlePhotoUpload} 
                className="hidden" 
              />
            </label>
          </div>

          <div className="w-full sm:w-1/2">
            {photoPreview ? (
              <div className="relative rounded-lg overflow-hidden border">
                <img src={photoPreview} alt="Field preview" className="w-full h-36 object-cover" />
                <div className="absolute bottom-0 inset-x-0 bg-black/70 text-white p-1.5 text-[9px] font-mono leading-tight">
                  PLOT: {plotCode} | {lat.toFixed(4)}°N, {lng.toFixed(4)}°E | {new Date().toLocaleDateString()} | ASSAC
                </div>
              </div>
            ) : (
              <div className="h-36 bg-gray-100 rounded-lg border border-dashed flex items-center justify-center text-xs text-gray-400">
                Watermarked photo preview will appear here
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Surveyor Identification */}
      <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
        <h3 className="font-semibold text-gray-800 text-sm border-b pb-2">
          Surveyor Attestation
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Field Officer Name
            </label>
            <Input 
              value={surveyorName} 
              onChange={e => setSurveyorName(e.target.value)}
              className="h-10 text-sm font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Designation
            </label>
            <Input 
              value={surveyorDesignation} 
              onChange={e => setSurveyorDesignation(e.target.value)}
              className="h-10 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        <Button 
          type="button" 
          onClick={handleProceedToTrees}
          className="w-full h-14 bg-forest-700 hover:bg-forest-800 text-white font-bold text-base shadow-lg flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5 text-emerald-300" />
          Save Plot Header & Begin Tree Measurements
        </Button>
        <p className="text-center text-xs text-gray-500">
          Plot coordinates, environmental conditions, and jurisdiction will be saved locally.
        </p>
      </div>
    </div>
  );
}
