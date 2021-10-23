import { Timestamp } from '@firebase/firestore-types';

export interface Message {
  id?: string;
  room_id: string;
  sender_id: string;
  //senderName?: string;
  text: string;
  //Date type from Angular should be 'any' to has an oportunity to cast into this property
  time?: Timestamp;
}
