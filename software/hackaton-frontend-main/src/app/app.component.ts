import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { NbThemeModule, NbLayoutModule, NbStepperModule } from '@nebular/theme'
import { ChatComponent } from './components/chat/chat.component';
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { provideEchartsCore } from 'ngx-echarts';
echarts.use([BarChart, LineChart, GridComponent, CanvasRenderer, LegendComponent, TooltipComponent]);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NbLayoutModule, NbStepperModule, RouterModule, ChatComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    provideEchartsCore({ echarts }),
  ]
})
export class AppComponent {
  title = 'hackaton-frontend';

  constructor(private router: Router) {}
  
  isCurrentRoute(url: string): boolean {
    return this.router.url === '/' + url;
  }
}
