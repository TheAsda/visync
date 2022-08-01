export interface Status {
  clientId: string;
  room?: {
    roomId: string;
    clientsCount: number;
  };
  isSynced: boolean;
  tabIsSynced?: boolean;
}
