import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Navigation, Loader2, X } from "lucide-react";

// Major Indian cities
const INDIAN_CITIES = [
  { city: "Hyderabad", state: "Telangana" },
  { city: "Bengaluru", state: "Karnataka" },
  { city: "Chennai", state: "Tamil Nadu" },
  { city: "Mumbai", state: "Maharashtra" },
  { city: "Pune", state: "Maharashtra" },
  { city: "Delhi", state: "Delhi" },
  { city: "Gurugram", state: "Haryana" },
  { city: "Noida", state: "Uttar Pradesh" },
  { city: "Kolkata", state: "West Bengal" },
  { city: "Ahmedabad", state: "Gujarat" },
  { city: "Jaipur", state: "Rajasthan" },
  { city: "Visakhapatnam", state: "Andhra Pradesh" },
  { city: "Vijayawada", state: "Andhra Pradesh" },
  { city: "Coimbatore", state: "Tamil Nadu" },
  { city: "Kochi", state: "Kerala" },
  { city: "Indore", state: "Madhya Pradesh" },
  { city: "Nagpur", state: "Maharashtra" },
  { city: "Chandigarh", state: "Chandigarh" },
  { city: "Surat", state: "Gujarat" },
  { city: "Lucknow", state: "Uttar Pradesh" },
  { city: "Mysuru", state: "Karnataka" },
  { city: "Warangal", state: "Telangana" },
  { city: "Guntur", state: "Andhra Pradesh" },
  { city: "Madurai", state: "Tamil Nadu" },
  { city: "Patna", state: "Bihar" },
  { city: "Bhubaneswar", state: "Odisha" },
  { city: "Guwahati", state: "Assam" },
  { city: "Thiruvananthapuram", state: "Kerala" },
  { city: "Goa", state: "Goa" },
];

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (state: string, city: string) => void;
  initialState?: string;
  initialCity?: string;
}

export function LocationModal({ isOpen, onClose, onSave, initialState = "", initialCity = "" }: LocationModalProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(
    initialState && initialCity ? `${initialCity}, ${initialState}` : ""
  );
  const [selectedCity, setSelectedCity] = useState<{ city: string; state: string } | null>(
    initialState && initialCity ? { city: initialCity, state: initialState } : null
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const tr = (key: string, fallback: string) => t(key, { defaultValue: fallback });

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setInputValue(initialState && initialCity ? `${initialCity}, ${initialState}` : "");
      setSelectedCity(initialState && initialCity ? { city: initialCity, state: initialState } : null);
      setError(null);
    }
  }, [isOpen, initialState, initialCity]);

  // Filter cities
  const filteredCities = inputValue.length > 0
    ? INDIAN_CITIES.filter(c => 
        c.city.toLowerCase().includes(inputValue.toLowerCase()) ||
        c.state.toLowerCase().includes(inputValue.toLowerCase())
      ).slice(0, 5)
    : [];

  // Detect location
  const detectLocation = async () => {
    if (!navigator.geolocation) {
      setError(tr("location.geoNotSupported", "Location not supported"));
      return;
    }

    setIsDetecting(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000,
        });
      });

      const { latitude, longitude } = position.coords;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      );

      if (!response.ok) throw new Error("Failed");

      const data = await response.json();
      const address = data.address || {};
      const city = address.city || address.town || address.village || address.state_district || "";
      const state = address.state || "";

      if (city && state) {
        setSelectedCity({ city, state });
        setInputValue(`${city}, ${state}`);
        setShowDropdown(false);
      } else {
        setError(tr("location.couldNotDetect", "Couldn't detect. Type manually."));
      }
    } catch {
      setError(tr("location.detectionFailed", "Detection failed. Type manually."));
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSelect = (city: typeof INDIAN_CITIES[0]) => {
    setSelectedCity(city);
    setInputValue(`${city.city}, ${city.state}`);
    setShowDropdown(false);
  };

  const handleSave = () => {
    if (selectedCity) {
      onSave(selectedCity.state, selectedCity.city);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm rounded-2xl border border-purple-900/40 bg-[#0c0c0c] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-600/15 flex items-center justify-center">
              <MapPin className="w-4.5 h-4.5 text-purple-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              {tr("location.setLocation", "Set location")}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Detect Button */}
        <button
          type="button"
          onClick={detectLocation}
          disabled={isDetecting}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-purple-700/50 bg-purple-900/20 hover:bg-purple-900/30 text-purple-300 text-sm font-medium transition-colors disabled:opacity-50 mb-3"
        >
          {isDetecting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {tr("location.detecting", "Detecting...")}
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4" />
              {tr("location.useCurrentLocation", "Use current location")}
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-px bg-purple-900/30" />
          <span className="text-xs text-gray-600">{tr("location.or", "or")}</span>
          <div className="flex-1 h-px bg-purple-900/30" />
        </div>

        {/* Input */}
        <div className="relative mb-3">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setSelectedCity(null);
              setShowDropdown(true);
              setError(null);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder={tr("location.placeholder", "Type city name...")}
            className="w-full px-4 py-2.5 rounded-lg border border-purple-900/40 bg-[#050505] text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
          />

          {/* Dropdown */}
          {showDropdown && filteredCities.length > 0 && (
            <div className="absolute z-10 w-full mt-1 rounded-lg border border-purple-900/40 bg-[#111] shadow-xl overflow-hidden">
              {filteredCities.map((city, i) => (
                <button
                  key={`${city.city}-${i}`}
                  type="button"
                  onClick={() => handleSelect(city)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-purple-900/20 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-sm text-white">{city.city}</span>
                  <span className="text-sm text-gray-500">, {city.state}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && <p className="text-xs text-amber-400 mb-3">{error}</p>}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-gray-700 text-gray-300 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            {tr("common.cancel", "Cancel")}
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedCity}
            className="flex-1 py-2.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {tr("location.save", "Save")}
          </button>
        </div>
      </div>
    </div>
  );
}
