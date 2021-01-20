export class Message {
    constructor(
        public senderId: string,
        public recipientName : string,
        public recipientId : string,
        public sendername : string,
        public contenu: string,
        public timestamp: number, 
        public keyPair : string, 
        public uid : string
    ){}
}