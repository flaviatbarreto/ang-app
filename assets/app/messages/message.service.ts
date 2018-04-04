import { Message } from "./message.model"

export class MessageService {
    private messages: Message[] = [];

    addMessage(message: Message) {
        this.messages.push(message);
        //console.log(this.messages);
    }

    getMessages(){
        return this.messages;
    }

    deleteMessage(message: Message){
        this.message.splice(this.message.indexOf(message), 1);
    }
}
