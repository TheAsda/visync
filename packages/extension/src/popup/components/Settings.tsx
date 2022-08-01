import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import { getSettings } from '../lib/runtime/getSettings';
import { saveSettings } from '../lib/runtime/saveSettings';
import { Checkbox } from './Checkbox';
import { ErrorScreen } from './ErrorScreen';
import { Loader } from './Loader';
import './Settings.css';

export const Settings = () => {
  const queryClient = useQueryClient();
  const { mutate: setSettings } = useMutation(saveSettings, {
    onSuccess: (settings) => {
      queryClient.setQueryData(queryKeys.settings, settings);
    },
  });
  const { data: settings, status: settingsStatus } = useQuery(
    queryKeys.settings,
    getSettings
  );

  if (settingsStatus === 'loading') {
    return <Loader loadingText="Loading settings..." />;
  }

  if (settingsStatus === 'error') {
    return <ErrorScreen message="Failed to get settings" />;
  }

  return (
    <div className="settings">
      <div className="settings__setting">
        <Checkbox
          className="settings__setting-checkbox"
          checked={settings.useForcedDisplaying}
          onChange={(e) => {
            setSettings({
              ...settings,
              useForcedDisplaying: e.target.checked,
            });
          }}
        />
        <label className="settings__setting-label">Use forced rendering</label>
        <p className="settings__setting-helper-text">
          May overlap player's controls and make them inaccessible
        </p>
      </div>
    </div>
  );
};
