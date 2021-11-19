import { GameCompiler } from '@app/game/game-compiler/game-compiler.service';
import { Action } from '@app/game/game-logic/actions/action';
import { ServerGame } from '@app/game/game-logic/game/server-game';
import { GameStateToken } from '@app/game/game-logic/interface/game-state.interface';
import { ObjectiveCreator } from '@app/game/game-logic/objectives/objective-creator/objective-creator.service';
import { Objective } from '@app/game/game-logic/objectives/objectives/objective';
import { ObjectiveUpdateParams } from '@app/game/game-logic/objectives/objectives/objective-update-params.interface';
import { PointCalculatorService } from '@app/game/game-logic/point-calculator/point-calculator.service';
import { TimerController } from '@app/game/game-logic/timer/timer-controller.service';
import { SystemMessagesService } from '@app/messages-service/system-messages-service/system-messages.service';
import { Subject } from 'rxjs';

export class SpecialServerGame extends ServerGame {
    privateObjectives: Map<string, Objective[]>;
    publicObjectives: Objective[];
    constructor(
        timerController: TimerController,
        public randomBonus: boolean,
        public timePerTurn: number,
        public gameToken: string,
        pointCalculator: PointCalculatorService,
        gameCompiler: GameCompiler,
        messagesService: SystemMessagesService,
        newGameStateSubject: Subject<GameStateToken>,
        endGameSubject: Subject<string>,
        private objectiveCreator: ObjectiveCreator,
    ) {
        super(
            timerController,
            randomBonus,
            timePerTurn,
            gameToken,
            pointCalculator,
            gameCompiler,
            messagesService,
            newGameStateSubject,
            endGameSubject,
        );
    }
    start() {
        this.allocateObjectives();
        super.start();
    }

    allocateObjectives() {
        this.allocatePrivateObjectives();
        this.allocatePublicObjectives();
    }

    updateObjectives(action: Action, params: ObjectiveUpdateParams) {
        for (const publicObjective of this.publicObjectives) {
            publicObjective.update(action, params);
        }

        const playerObjectives = this.privateObjectives.get(action.player.name);
        if (!playerObjectives) {
            return;
        }

        for (const privateObjective of playerObjectives) {
            privateObjective.update(action, params);
        }
    }

    private allocatePrivateObjectives() {
        this.privateObjectives = new Map<string, Objective[]>();
        for (const player of this.players) {
            const playerPrivateObjectives = this.objectiveCreator.chooseObjectives(this.gameToken, ObjectiveCreator.privateObjectiveCount);
            this.privateObjectives.set(player.name, playerPrivateObjectives);
        }
    }

    private allocatePublicObjectives() {
        this.publicObjectives = [];
        const publicObjectives = this.objectiveCreator.chooseObjectives(this.gameToken, ObjectiveCreator.publicObjectiveCount);
        this.publicObjectives = publicObjectives;
    }
}
