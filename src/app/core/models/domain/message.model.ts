interface IMessage {
  id?: string;
  senderId: string;
  //senderName?: string;
  text: string;
  //Date type from Angular should be 'any' to has an oportunity to cast into this property
  time?: any;
}
