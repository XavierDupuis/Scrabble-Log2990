import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { AppComponent } from '@app/pages/app/app.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';
import { HeaderBarComponent } from './components/header-bar/header-bar.component';
import { GameLogicModule } from './GameLogic/game-logic.module';
import { ClassicGameComponent } from './pages/classic-game/classic-game.component';
import { BoardComponent } from './pages/game-page/board/board.component';
import { ChatBoxComponent } from './pages/game-page/chat-box/chat-box.component';
import { HorseComponent } from './pages/game-page/horse/horse.component';
import { InfoBoxComponent } from './pages/game-page/info-box/info-box.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { LeaderboardComponent } from './pages/leaderboard/leaderboard.component';
import { Log2990GameComponent } from './pages/log2990-game/log2990-game.component';

/**
 * Main module that is used in main.ts.
 * All automatically generated components will appear in this module.
 * Please do not move this module in the module folder.
 * Otherwise Angular Cli will not know in which module to put new component
 */
@NgModule({
    declarations: [
        AppComponent,
        GamePageComponent,
        MainPageComponent,
        MaterialPageComponent,
        PlayAreaComponent,
        SidebarComponent,
        InfoBoxComponent,
        ChatBoxComponent,
        BoardComponent,
        HorseComponent,
        HomepageComponent,
        ClassicGameComponent,
        Log2990GameComponent,
        LeaderboardComponent,
        HeaderBarComponent,
    ],
    imports: [AppMaterialModule, AppRoutingModule, BrowserAnimationsModule, BrowserModule, FormsModule, HttpClientModule, GameLogicModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
