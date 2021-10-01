import { Injectable } from '@angular/core';
import { Action } from '@app/GameLogic/actions/action';
import { ActionValidatorService } from '@app/GameLogic/actions/action-validator.service';
import { ActionCompilerService } from '@app/GameLogic/commands/actionCompiler/action-compiler.service';
import { CommandParserService } from '@app/GameLogic/commands/command-parser/command-parser.service';
import { Command, CommandType } from '@app/GameLogic/commands/command.interface';
import { DEBUG_MESSAGE_ACTIVATED, DEBUG_MESSAGE_DEACTIVATED } from '@app/GameLogic/constants';
import { MessagesService } from '@app/GameLogic/messages/messages.service';

@Injectable({
    providedIn: 'root',
})
export class CommandExecuterService {
    private debugMode = false;
    get isDebugModeActivated() {
        return this.debugMode;
    }

    constructor(
        private commandParser: CommandParserService,
        private actionCompilerService: ActionCompilerService,
        private actionValidator: ActionValidatorService,
        private messageService: MessagesService,
    ) {
        this.commandParser.parsedCommand$.subscribe((command) => {
            this.execute(command);
        });
    }

    resetDebug() {
        this.debugMode = false;
    }

    execute(command: Command) {
        const type = command.type;
        if (type === CommandType.Debug) {
            this.executeDebug();
            return;
        }

        if (type === CommandType.Help) {
            return;
        }

        if (type === CommandType.Exchange || type === CommandType.Pass || type === CommandType.Place) {
            try {
                const action = this.actionCompilerService.translate(command);
                this.sendAction(action);
            } catch (e) {}
        }
    }

    private executeDebug() {
        this.debugMode = !this.debugMode;
        if (this.debugMode) {
            this.messageService.receiveSystemMessage(DEBUG_MESSAGE_ACTIVATED);
        } else {
            this.messageService.receiveSystemMessage(DEBUG_MESSAGE_DEACTIVATED);
        }
    }

    private sendAction(action: Action) {
        try {
            this.actionValidator.sendAction(action);
        } catch (e) {
            this.messageService.receiveError(e as Error);
        }
    }
}
