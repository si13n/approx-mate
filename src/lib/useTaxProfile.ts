import { useState, useEffect } from "react";
import { TaxProfile, DEFAULT_TAX_PROFILE } from "../config/tax";

const STORAGE_KEY = "approxmate.taxProfile";

export function useTaxProfile() {
  const [profile, setProfile] = useState<TaxProfile>(DEFAULT_TAX_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile(parsed);
      }
    } catch (e) {
      console.warn("[TaxProfile] Failed to load from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  // Persist to localStorage whenever profile changes
  const updateProfile = (newProfile: TaxProfile) => {
    setProfile(newProfile);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    } catch (e) {
      console.warn("[TaxProfile] Failed to save to localStorage", e);
    }
  };

  const resetToDefaults = () => {
    updateProfile(DEFAULT_TAX_PROFILE);
  };

  return {
    profile,
    updateProfile,
    resetToDefaults,
    isLoaded,
  };
}
