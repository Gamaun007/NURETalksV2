import { Timestamp } from '@firebase/firestore-types';

export interface Message {
  id?: string;
  room_id: string;
  sender_id: string;
  //senderName?: string;
  text: string;
  type: MessageType;
  //Date type from Angular should be 'any' to has an oportunity to cast into this property
  time?: Timestamp;
}

export interface MessageWithAttachments extends Message {
  attachments: {
    name: string;
    link: string;
  }[];
}

export enum MessageType {
  REGULAR = 'regular',
  ATTACHMENTS = 'attachments',
}
