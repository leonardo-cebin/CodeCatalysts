import { Routes } from '@angular/router';
import { PumpSelectorComponent } from './pump-selector/pump-selector.component';
import {  PressureLossComponent } from './pressure-loss/pressure-loss.component';
import { HeatExchangerComponent } from './heat-exchanger/heat-exchanger.component';
import { ChatComponent } from './components/chat/chat.component';

export const routes: Routes = [
  { path: 'heat-exchanger', component: HeatExchangerComponent },
  { path: 'pressure-loss', component: PressureLossComponent },
  { path: 'pump-selector', component: PumpSelectorComponent },
  { path: 'advice', component: ChatComponent },
  { path: '', pathMatch: 'full', redirectTo: '/pump-selector' }
];
