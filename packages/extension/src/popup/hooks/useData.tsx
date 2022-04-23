import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { RuntimeResponse, RuntimeRequest } from '../../types/runtimeMessages';

type Data = {
  isLoading: boolean;
  clientId?: string;
  isSynced: boolean;
  room?: {
    roomId: string;
    clientsCount: number;
  };
  createRoom: () => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
};

const DataContext = createContext<Data | undefined>(undefined);

export const DataProvider = (props: { children?: ReactNode }) => {
  const [clientId, setClientId] = useState<string>();
  const [isSynced, setIsSynced] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [room, setRoom] = useState<Data['room']>();

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      const response = JSON.parse(message) as RuntimeResponse;
      switch (response.type) {
        case 'status':
          setClientId(response.payload.clientId);
          setIsSynced(response.payload.isSynced);
          setRoom(response.payload.room);
          setIsLoading(false);
          break;
      }
    });
    const request: RuntimeRequest = {
      type: 'status',
    };
    chrome.runtime.sendMessage(JSON.stringify(request));
  }, []);

  const createRoom = () => {
    setIsLoading(true);
    const request: RuntimeRequest = {
      type: 'create-room',
    };
    chrome.runtime.sendMessage(JSON.stringify(request));
  };

  const joinRoom = (roomId: string) => {
    setIsLoading(true);
    const request: RuntimeRequest = {
      type: 'join-room',
      payload: {
        roomId,
      },
    };
    chrome.runtime.sendMessage(JSON.stringify(request));
  };

  const leaveRoom = () => {
    setIsLoading(true);
    const request: RuntimeRequest = {
      type: 'leave-room',
    };
    chrome.runtime.sendMessage(JSON.stringify(request));
  };

  return (
    <DataContext.Provider
      value={{
        clientId,
        isLoading,
        isSynced,
        room,
        createRoom,
        joinRoom,
        leaveRoom,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useClient must be within DataProvider');
  }
  return context;
};
