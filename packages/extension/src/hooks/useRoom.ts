import { useEffect, useState } from 'react';
import { Room } from 'syncboii-contracts';

const useRoom = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {}, []);
};
