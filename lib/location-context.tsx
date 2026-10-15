'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface DeliveryLocation {
  id: string;
  name: string;
  city: string;
  pincode: string;
  isDeliverable: boolean;
  deliveryTime: string;
  distanceKm?: number;
}

export const POPULAR_LOCATIONS: DeliveryLocation[] = [
  {
    id: 'ashiana-town',
    name: 'Ashiana Town, Sector 33',
    city: 'Bhiwadi',
    pincode: '301019',
    isDeliverable: true,
    deliveryTime: 'Today in 2-3 hrs',
    distanceKm: 2.5,
  },
  {
    id: 'alwar-bypass',
    name: 'Alwar Bypass Road',
    city: 'Bhiwadi',
    pincode: '301019',
    isDeliverable: true,
    deliveryTime: 'Today in 2-3 hrs',
    distanceKm: 4.1,
  },
  {
    id: 'capital-galleria',
    name: 'Capital Galleria / Phoolbagh',
    city: 'Bhiwadi',
    pincode: '301019',
    isDeliverable: true,
    deliveryTime: 'Today in 2-3 hrs',
    distanceKm: 3.2,
  },
  {
    id: 'uiet-riico',
    name: 'RIICO Industrial Area & UIET',
    city: 'Bhiwadi',
    pincode: '301019',
    isDeliverable: true,
    deliveryTime: 'Today in 2-3 hrs',
    distanceKm: 5.0,
  },
  {
    id: 'bhiwadi-central',
    name: 'Central Market & Modipat',
    city: 'Bhiwadi',
    pincode: '301019',
    isDeliverable: true,
    deliveryTime: 'Today in 2-3 hrs',
    distanceKm: 3.8,
  },
  {
    id: 'dharuhera-sec6',
    name: 'Dharuhera (Sector 6 & NH-48)',
    city: 'Dharuhera',
    pincode: '122106',
    isDeliverable: true,
    deliveryTime: 'Today in 3-4 hrs',
    distanceKm: 8.5,
  },
];

interface LocationContextType {
  currentLocation: DeliveryLocation;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  setLocation: (location: DeliveryLocation) => void;
  detectCurrentLocation: () => Promise<{ success: boolean; message: string }>;
  isDetecting: boolean;
  checkPincode: (pincode: string) => { deliverable: boolean; location?: DeliveryLocation };
}

const DEFAULT_LOCATION: DeliveryLocation = POPULAR_LOCATIONS[0];

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState<DeliveryLocation>(DEFAULT_LOCATION);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  // Load saved location from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bakeistry_location');
      if (saved) {
        setCurrentLocation(JSON.parse(saved));
      }
    } catch {
      // fallback to default
    }
  }, []);

  const setLocation = (loc: DeliveryLocation) => {
    setCurrentLocation(loc);
    try {
      localStorage.setItem('bakeistry_location', JSON.stringify(loc));
    } catch {
      // ignore
    }
  };

  const detectCurrentLocation = async (): Promise<{ success: boolean; message: string }> => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      return { success: false, message: 'Geolocation is not supported by your browser.' };
    }

    setIsDetecting(true);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsDetecting(false);
          const { latitude, longitude } = position.coords;

          // Bhiwadi center approx: 28.2100° N, 76.8606° E
          // Calculate approximate distance to Bhiwadi bakery
          const bakeryLat = 28.2095;
          const bakeryLon = 76.8615;
          const distKm = Math.sqrt(
            Math.pow((latitude - bakeryLat) * 111, 2) +
            Math.pow((longitude - bakeryLon) * 96, 2)
          );

          const roundedDist = Math.round(distKm * 10) / 10;
          const isWithinRadius = roundedDist <= 12;

          const detectedLocation: DeliveryLocation = {
            id: 'current-gps-location',
            name: `Current Location (${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E)`,
            city: roundedDist < 10 ? 'Bhiwadi' : 'Near Bhiwadi',
            pincode: '301019',
            isDeliverable: isWithinRadius,
            deliveryTime: isWithinRadius ? 'Today in 2-3 hrs' : 'Next Day / Scheduled',
            distanceKm: roundedDist,
          };

          setLocation(detectedLocation);
          resolve({
            success: true,
            message: isWithinRadius
              ? `Location detected! Within ${roundedDist} km of kitchen.`
              : `Location detected (~${roundedDist} km). Please verify delivery slot.`,
          });
        },
        (error) => {
          setIsDetecting(false);
          let message = 'Could not access GPS location.';
          if (error.code === error.PERMISSION_DENIED) {
            message = 'Location permission denied. Please select your area below.';
          } else if (error.code === error.TIMEOUT) {
            message = 'Location request timed out. Please select from the list.';
          }
          resolve({ success: false, message });
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  };

  const checkPincode = (pincode: string) => {
    const cleanPin = pincode.trim();
    const matched = POPULAR_LOCATIONS.find((l) => l.pincode === cleanPin);
    if (matched) {
      return { deliverable: true, location: matched };
    }
    if (cleanPin.startsWith('3010') || cleanPin === '122106') {
      return {
        deliverable: true,
        location: {
          id: `pin-${cleanPin}`,
          name: `Pincode ${cleanPin}`,
          city: cleanPin.startsWith('3010') ? 'Bhiwadi' : 'Dharuhera',
          pincode: cleanPin,
          isDeliverable: true,
          deliveryTime: 'Today in 2-3 hrs',
        },
      };
    }
    return { deliverable: false };
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        isLocationModalOpen,
        setIsLocationModalOpen,
        setLocation,
        detectCurrentLocation,
        isDetecting,
        checkPincode,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
