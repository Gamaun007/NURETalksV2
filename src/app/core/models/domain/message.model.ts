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
  /* This values is used to identify the time of any operation was made on the message, it helps to listen for changes on FE side*/
  lastOperationTime?: Timestamp;
}

export interface MessageWithAttachments extends Message {
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  name: string;
  file_path: string;
}

export enum MessageType {
  REGULAR = 'regular',
  ATTACHMENTS = 'attachments',
}
