export type CreateRoomRequest = {
  link: string;
  clientId: string;
};

export type JoinRoomRequest = {
  roomId: string;
  clientId: string;
};

export type LeaveRoomRequest = {
  roomId: string;
  clientId: string;
};
