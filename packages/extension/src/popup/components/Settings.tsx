import { useEffect, useState } from 'react';
import { RuntimeRequest, RuntimeResponse } from '../../types/runtimeMessages';
import { ClientSettings } from '../../types/settings';
import { Checkbox } from './Checkbox';
import { Loader } from './Loader';
import './Settings.css';

const saveSettings = (settings: ClientSettings) => {
  const request: RuntimeRequest = {
    type: 'update-settings',
    payload: settings,
  };
  chrome.runtime.sendMessage(JSON.stringify(request));
};

export const Settings = () => {
  const [settings, setSettings] = useState<ClientSettings>();

  useEffect(() => {
    const request: RuntimeRequest = {
      type: 'settings',
    };
    chrome.runtime.sendMessage(JSON.stringify(request), (data) => {
      const response = JSON.parse(data) as RuntimeResponse;

      if (response.type !== 'settings') {
        return;
      }
      setSettings(response.payload);
    });
  }, []);

  useEffect(() => {
    if (!settings) {
      return;
    }
    saveSettings(settings);
  }, [settings]);

  if (!settings) {
    return <Loader />;
  }

  return (
    <div className="settings">
      <div className="settings__setting">
        <Checkbox
          className="settings__setting-checkbox"
          checked={settings.useForcedDisplaying}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              useForcedDisplaying: e.target.checked,
            }))
          }
        />
        <label className="settings__setting-label">Use forced rendering</label>
        <p className="settings__setting-helper-text">
          May overlap player's controls and make them inaccessible
        </p>
      </div>
    </div>
  );
};
