import { Component, OnInit } from '@angular/core';
import { ExchangeLetter } from '@app/GameLogic/actions/exchange-letter';
import { Game } from '@app/GameLogic/game/games/game';
import { GameManagerService } from '@app/GameLogic/game/games/game-manager.service';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
    game001: Game;
    constructor(private gms: GameManagerService) {}
    ngOnInit(): void {
        const settings = {
            playerName: 'Xavier',
            botDifficulty: 'easy',
            timePerTurn: 3000,
        };
        this.gms.createGame(settings);
        this.gms.startGame();
        const player = this.gms.game.getActivePlayer();
        const lettersToExchange = [...player.letterRack]
        player.action$.next(new ExchangeLetter(player, lettersToExchange));
        console.log(this.gms.game);

        return;
    }
}
