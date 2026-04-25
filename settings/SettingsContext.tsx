import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

export type Settings = {
  useCloud: boolean;
  cloudUrl: string;
  authKey: string;
  deviceId: string;
  localIp: string;
};

const defaults: Settings = {
  useCloud: false,
  cloudUrl: '',
  authKey: '',
  deviceId: '',
  localIp: '',
};

const SETTINGS_KEY = 'app.settings';

type SettingsContextValue = {
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaults);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync(SETTINGS_KEY).then(raw => {
      if (raw) setSettings({ ...defaults, ...JSON.parse(raw) });
      setLoaded(true);
    });
  }, []);

  function updateSettings(patch: Partial<Settings>) {
    setSettings(prev => {
      const next = { ...prev, ...patch };
      SecureStore.setItemAsync(SETTINGS_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {loaded ? children : null}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
