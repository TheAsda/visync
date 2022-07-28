import { styled } from 'goober';
import { useEffect, useState } from 'react';
import { RuntimeRequest, RuntimeResponse } from '../../types/runtimeMessages';
import { ClientSettings } from '../../types/settings';
import { Checkbox } from './Checkbox';
import { Loader } from './Loader';

const Container = styled('section')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.3rem',
});

const FormControl = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '0.5rem',
  justifyContent: 'center',
  textAlign: 'center',
});

const FormLabel = styled('label')({});

const FormHelperText = styled('p')({
  fontSize: '0.8rem',
  filter: 'brightness(0.8)',
});

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
    <Container>
      <FormControl>
        <FormLabel>Use forced rendering</FormLabel>
        <Checkbox
          checked={settings.useForcedDisplaying}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              useForcedDisplaying: e.target.checked,
            }))
          }
        />
        <FormHelperText>
          May overlap player's controls and make them inaccessible
        </FormHelperText>
      </FormControl>
    </Container>
  );
};
