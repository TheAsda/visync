import { useEffect, useState } from 'react';
import { Room } from 'syncboii-contracts';
import { logger } from '../../logger';
import { RuntimeRequest } from '../../types/runtimeMessages';

const fetchRoom = () => {
  const request: RuntimeRequest = {
    type: 'get-room',
  };
  return new Promise<Room>((resolve, reject) => {
    chrome.runtime.sendMessage(JSON.stringify(request), (room: Room | null) => {
      if (!room) {
        reject();
      } else {
        resolve(room);
      }
    });
  });
};

export const useRoom = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRoom()
      .then((room) => {
        setRoom(room);
      })
      .catch(() => {
        logger.info('Not in room');
      })
      .then(() => {
        setIsLoading(false);
      });
  }, []);

  const createRoom = (link: string) => {
    setIsLoading(true);
    const request: RuntimeRequest = {
      type: 'create-room',
      payload: {
        link,
      },
    };
    chrome.runtime.sendMessage(JSON.stringify(request), (room: Room) => {
      setRoom(room);
      setIsLoading(false);
    });
  };

  const joinRoom = (roomId: string) => {
    setIsLoading(true);
    const request: RuntimeRequest = {
      type: 'join-room',
      payload: {
        roomId,
      },
    };
    chrome.runtime.sendMessage(JSON.stringify(request), (room: Room) => {
      setRoom(room);
      setIsLoading(false);
    });
  };

  const leaveRoom = () => {
    setIsLoading(true);
    const request: RuntimeRequest = {
      type: 'leave-room',
    };
    chrome.runtime.sendMessage(JSON.stringify(request), (room: Room) => {
      setRoom(null);
      setIsLoading(false);
    });
  };

  return {
    room,
    isLoading,
    createRoom,
    joinRoom,
    leaveRoom,
  };
};
