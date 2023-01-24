import { ParticipantPopulated } from "./types";

export const userIsConversationParticipant = (
  participants: Array<ParticipantPopulated>,
  userId: string
): boolean => {
  return !!participants.find((p) => p.userId === userId);
};
