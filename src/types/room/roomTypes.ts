export type RoomType = {
  name: string;
  description: string;
  maxParticipants: number;
  isPrivate: boolean;
  requireApproval: boolean;
  allowRecording: boolean;
  scheduledTime: string;
  duration: number;
};
