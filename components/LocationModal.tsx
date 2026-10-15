'use client';

import React, { useState } from 'react';
import {
  MapPin,
  X,
  Navigation,
  Check,
  Search,
  Clock,
  Sparkles,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useLocation, POPULAR_LOCATIONS, DeliveryLocation } from '../lib/location-context';

export function LocationModal() {
  const {
    currentLocation,
    isLocationModalOpen,
    setIsLocationModalOpen,
    setLocation,
    detectCurrentLocation,
    isDetecting,
    checkPincode,
  } = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  if (!isLocationModalOpen) return null;

  const handleDetectGPS = async () => {
    setGpsMessage(null);
    const result = await detectCurrentLocation();
    setGpsMessage(result.message);
    if (result.success) {
      setTimeout(() => {
        setIsLocationModalOpen(false);
      }, 900);
    }
  };

  const handleSelect = (loc: DeliveryLocation) => {
    setLocation(loc);
    setIsLocationModalOpen(false);
  };

  const filteredLocations = searchQuery.trim()
    ? POPULAR_LOCATIONS.filter(
        (l) =>
          l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.pincode.includes(searchQuery.trim())
      )
    : POPULAR_LOCATIONS;

  const pincodeResult =
    searchQuery.trim().length === 6 && !isNaN(Number(searchQuery.trim()))
      ? checkPincode(searchQuery.trim())
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs transition-opacity p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        onClick={() => setIsLocationModalOpen(false)}
        aria-hidden="true"
      />

      <div
        className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in slide-in-from-bottom-6 duration-200 flex flex-col max-h-[88vh]"
        role="dialog"
        aria-modal="true"
        aria-label="Select delivery location"
      >
        {/* Mobile handle */}
        <div className="w-10 h-1 bg-[#E0D9CF] rounded-full mx-auto mt-2.5 sm:hidden" />

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#F5ECE1] flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#2C1810] flex items-center gap-1.5">
              <MapPin className="w-5 h-5 text-[#C27838]" />
              <span>Select Delivery Location</span>
            </h3>
            <p className="text-xs text-[#8A796F] mt-0.5">
              Fresh cakes delivered directly from our Bhiwadi studio kitchen
            </p>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="w-8 h-8 rounded-full bg-[#FAF6F0] text-[#8A796F] hover:text-[#2C1810] flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* GPS Current Location Button */}
          <button
            onClick={handleDetectGPS}
            disabled={isDetecting}
            className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-[#FAF6F0] to-[#F5ECE1] hover:from-[#F5ECE1] hover:to-[#EADBC8] border border-[#E8DEC8] flex items-center gap-3 transition-all active:scale-[0.99] text-left group shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#2C1810] text-white flex items-center justify-center shrink-0 shadow-xs">
              {isDetecting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Navigation className="w-5 h-5 text-[#DE9E62] group-hover:rotate-45 transition-transform" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs sm:text-sm text-[#2C1810]">
                  {isDetecting ? 'Detecting your GPS location...' : 'Use Current Location'}
                </span>
                <span className="text-[10px] bg-[#15803D] text-white font-semibold px-2 py-0.2 rounded-full">
                  GPS
                </span>
              </div>
              <p className="text-[11px] text-[#6B4F3B] truncate mt-0.5">
                Automatically verify delivery eligibility &amp; slots
              </p>
            </div>
          </button>

          {/* GPS feedback message */}
          {gpsMessage && (
            <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#E8DEC8] text-xs text-[#2C1810] flex items-center gap-2 animate-in fade-in">
              <Sparkles className="w-4 h-4 text-[#DE9E62] shrink-0" />
              <span>{gpsMessage}</span>
            </div>
          )}

          {/* Search or Pincode Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C27838]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search area, society, or 6-digit pincode..."
              className="w-full pl-10 pr-9 py-2.5 text-[16px] sm:text-xs rounded-xl border border-[#E8DEC8] bg-[#FAF6F0] text-[#2C1810] focus:outline-none focus:border-[#C27838]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8A796F] hover:text-[#2C1810]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Pincode evaluation banner */}
          {pincodeResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                pincodeResult.deliverable
                  ? 'bg-[#E8F8EE] border-[#25D366]/40 text-[#1E281C]'
                  : 'bg-[#FFF3E0] border-[#FFB74D] text-[#E65100]'
              }`}
            >
              <div className="flex items-center gap-2">
                {pincodeResult.deliverable ? (
                  <Check className="w-4 h-4 text-[#15803D]" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-[#E65100]" />
                )}
                <span>
                  {pincodeResult.deliverable
                    ? `Pincode ${searchQuery}: Delivery Available! (2-3 hrs)`
                    : `Pincode ${searchQuery}: Outside standard radius. WhatsApp for custom order.`}
                </span>
              </div>
              {pincodeResult.deliverable && pincodeResult.location && (
                <button
                  onClick={() => handleSelect(pincodeResult.location!)}
                  className="px-2.5 py-1 bg-[#2C1810] text-white rounded-lg text-xs font-semibold"
                >
                  Deliver Here
                </button>
              )}
            </div>
          )}

          {/* Popular Delivery Areas List (Bakingo Style) */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#8A796F] px-1">
              Popular Delivery Areas in &amp; around Bhiwadi
            </p>

            <div className="space-y-1 max-h-[35vh] overflow-y-auto pr-1">
              {filteredLocations.map((loc) => {
                const isSelected = currentLocation.id === loc.id;

                return (
                  <button
                    key={loc.id}
                    onClick={() => handleSelect(loc)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#F5ECE1] border-[#C27838] shadow-2xs'
                        : 'bg-white hover:bg-[#FAF6F0] border-[#E8DEC8]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#2C1810] text-white' : 'bg-[#FAF6F0] text-[#C27838]'
                        }`}
                      >
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#2C1810] truncate">
                          {loc.name}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-[#8A796F] mt-0.5">
                          <span>{loc.city} ({loc.pincode})</span>
                          <span>•</span>
                          <span className="text-[#15803D] font-semibold flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            {loc.deliveryTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#C27838] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 sm:p-4 bg-[#FAF6F0] border-t border-[#E8DEC8] text-[11px] text-[#8A796F] flex items-center justify-between">
          <span>Need delivery to Delhi/NCR or special venues?</span>
          <a
            href="https://wa.me/918198978095?text=Hi%20Chef%20Mitali%2C%20I%20need%20cake%20delivery%20to%20my%20location"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#15803D] font-bold hover:underline"
          >
            WhatsApp Support &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
