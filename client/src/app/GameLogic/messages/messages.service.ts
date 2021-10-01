import { Injectable } from '@angular/core';
import { CommandParserService } from '@app/GameLogic/commands/command-parser/command-parser.service';
import { BehaviorSubject } from 'rxjs';
import { Message, MessageType } from './message.interface';

@Injectable({
    providedIn: 'root',
})
export class MessagesService {
    static readonly sysName = 'System';
    static readonly sysErrorName = 'SystemError';
    messagesLog: Message[] = [];

    messages$: BehaviorSubject<Message[]> = new BehaviorSubject([] as Message[]);
    constructor(private commandParser: CommandParserService) {}

    receiveMessage(forwarder: string, content: string) {
        const message: Message = {
            content,
            from: forwarder,
            type: MessageType.Player1,
        };
        this.addMessageToLog(message);
        try {
            this.commandParser.parse(content, forwarder);
        } catch (e) {
            if (e instanceof Error) {
                this.receiveError(e as Error);
            }
        }
    }

    receiveSystemMessage(content: string) {
        const systemMessage: Message = {
            content,
            from: MessagesService.sysName,
            type: MessageType.System,
        };
        this.addMessageToLog(systemMessage);
    }

    receiveErrorMessage(content: string) {
        const errorMessage = {
            content,
            from: MessagesService.sysErrorName,
            type: MessageType.System,
        };
        this.addMessageToLog(errorMessage);
    }

    receiveError(error: Error) {
        const errorMessage = {
            content: error.message,
            from: MessagesService.sysErrorName,
            type: MessageType.System,
        };
        this.addMessageToLog(errorMessage);
    }

    clearLog(): void {
        this.messagesLog = [];
        this.messages$.next(this.messagesLog);
    }

    private addMessageToLog(message: Message) {
        const messageCopy = { ...message };
        this.messagesLog.push(messageCopy);
        this.messages$.next(this.messagesLog);
    }
}