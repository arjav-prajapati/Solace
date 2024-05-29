export type Friend = {
    _id: string;
    roomId: string;
    email: string;
    name: string;
    isLive: boolean;
    lastMessage: {
        [key: string]: any;
    };
    unreadCount: number;
}


export type Chat = {
    messageId: string;
    senderMail: string;
    receiverMail: string;
    roomId: string;
    message: string;
    time: Date;
    status: string;
}