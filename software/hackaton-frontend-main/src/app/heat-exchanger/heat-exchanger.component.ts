import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../data/services/websocket.service';
import { NgIf } from '@angular/common';
import { NbButtonModule, NbCardModule, NbInputModule, NbRadioModule, NbSelectModule } from '@nebular/theme';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { io, Socket } from 'socket.io-client';
import { CoefficientService } from '../services/coefficient.service';
import { HttpClientModule } from '@angular/common/http';
import { EChartsCoreOption } from 'echarts/core';
import { NgxEchartsDirective } from 'ngx-echarts';

@Component({
  selector: 'app-heat-exchanger',
  standalone: true,
  imports: [NbCardModule, NbButtonModule, NbInputModule, NbSelectModule, NbRadioModule, ReactiveFormsModule, HttpClientModule, NgxEchartsDirective, NgIf],
  templateUrl: './heat-exchanger.component.html',
  styleUrl: './heat-exchanger.component.scss',
  providers: [CoefficientService]
})
export class HeatExchangerComponent implements OnInit, OnDestroy {
  sensorData: any;

  private socket!: Socket;

  form!: FormGroup;

  result: any;

  coefficients: any[] = [];

  tHotInFluid: any;

  tColdInFluid: any;

  hasResult = false;

  flowOption: EChartsCoreOption = {
    tooltip: {
      trigger: 'axis', // ou 'item' dependendo do seu caso
      axisPointer: {
        type: 'cross' // opcional, para um ponteiro mais detalhado
      }
    },
    legend: {
      orient: 'horizontal', // ou 'vertical'
      left: 'center', // posicionamento da legenda
      top: 'bottom'
    },
    xAxis: {
      type: 'category',
      data: [],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [],
        type: 'line',
        smooth: true
      },
    ],
  };

  temperatureOption: EChartsCoreOption = {
    tooltip: {
      trigger: 'axis', // ou 'item' dependendo do seu caso
      axisPointer: {
        type: 'cross' // opcional, para um ponteiro mais detalhado
      }
    },
    legend: {
      orient: 'horizontal', // ou 'vertical'
      left: 'center', // posicionamento da legenda
      top: 'bottom'
    },
    xAxis: {
      type: 'category',
      data: [],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [],
        type: 'line',
        smooth: true
      },
    ],
  };

  constructor(private websocketService: WebsocketService, private fb: FormBuilder, private coefficientService: CoefficientService) {
    this.form = this.fb.group({
      coeficient: [null, Validators.required],
      radius: [null, Validators.required],
      pipeLength: [null, Validators.required],
      pipeQtd: [null, Validators.required],
      T_hot_in: [null, Validators.required],
      T_hot_out: [null, Validators.required],
      T_cold_in: [null, Validators.required],
      T_cold_out: [null, Validators.required],
      flowType: [null, Validators.required],
      scale: ['C'],
      T_hot_inFluid: [null, Validators.required],
      T_cold_inFluid: [null, Validators.required],
      T_hot_outFluid: [null, Validators.required],
      T_cold_outFluid: [null, Validators.required],
      // firstFlow: [null, Validators.required],
      // secondFlow: [null, Validators.required],
      hotInFluid: [null],
      coldInFluid: [null]
    });
  }

  ngOnInit(): void {
    this.coefficientService.listCoefficients().subscribe((response: any) => {
      this.coefficients = response;
    });

    this.socket = io('http://localhost:3000/heat-exchanger', {
      withCredentials: true,
    });

    this.socket.on('calculation-result', (data: any) => {
      this.result = data;
      this.hasResult = true;
      console.log('Resultado recebido do backend:', data);

      this.updateChartData(data);
    });

    this.form.get('T_hot_inFluid')?.valueChanges.subscribe((response) => {
      this.form.get('T_hot_outFluid')?.setValue(response);
      this.tHotInFluid = this.coefficients.find((coefficient) => coefficient.id === response);
      this.form.get('hotInFluid')?.setValue(this.tHotInFluid);
    });

    this.form.get('T_cold_inFluid')?.valueChanges.subscribe((response) => {
      this.form.get('T_cold_outFluid')?.setValue(response);
      this.tColdInFluid = this.coefficients.find((coefficient) => coefficient.id === response);
      this.form.get('coldInFluid')?.setValue(this.tColdInFluid);
    });
  }

  updateChartData(data: any): void {
    let T_hot_initial = this.form.get('T_hot_in')?.value;
    let T_cold_initial = this.form.get('T_cold_in')?.value;
    let time_max = 1000;    
    let deltaT = 1;         
    let U = this.form.get('coeficient')?.value;       
    let A = data.area;          
    let c_hot = this.tHotInFluid.specific_heat;       
    let c_cold = this.tColdInFluid.specific_heat;      
    let rho_hot = this.tHotInFluid.density;     
    let rho_cold = this.tColdInFluid.specific_heat;     
    let V_hot = data.hotFlow;          
    let V_cold = data.coldFlow;         

  
    let m_hot = rho_hot * V_hot;
    let m_cold = rho_cold * V_cold;

  
    let k_transfer_hot = (U * A) / (m_hot * c_hot);
    let k_transfer_cold = (U * A) / (m_cold * c_cold);

  
    function rateOfChangeHot(T_hot: any, T_cold: any) {
      return -(k_transfer_hot * 5000) * (T_hot - T_cold);
    }

  
    function rateOfChangeCold(T_hot: any, T_cold: any) {
      return (k_transfer_cold * 5000) * (T_hot - T_cold);
    }

  
    let time = [];
    let temperaturesHot = [];
    let temperaturesCold = [];

  
    let currentT_hot = T_hot_initial;
    let currentT_cold = T_cold_initial;
    let currentTime = 0;

  
    for (let t = 0; t <= time_max; t += deltaT) {
    
      let dT_dt_hot = rateOfChangeHot(currentT_hot, currentT_cold);
      let dT_dt_cold = rateOfChangeCold(currentT_hot, currentT_cold);

    
      currentT_hot += dT_dt_hot * deltaT;
      currentT_cold += dT_dt_cold * deltaT;

    
      time.push(currentTime);
      temperaturesHot.push(currentT_hot);
      temperaturesCold.push(currentT_cold);

    
      currentTime += deltaT;

    
      console.log(`Time: ${currentTime}s, Hot Fluid Temp: ${currentT_hot.toFixed(2)} °C, Rate of Change (Hot): ${dT_dt_hot.toFixed(2)} °C/s, ` +
                  `Cold Fluid Temp: ${currentT_cold.toFixed(2)} °C, Rate of Change (Cold): ${dT_dt_cold.toFixed(2)} °C/s`);
    }

  

    let hotFlowCalculed = [];
    let coldFlowCalculed = [];
    for (let index = 0; index < 100; index++) {
      hotFlowCalculed.push(data.hotFlow * index + 1);
      coldFlowCalculed.push(data.hotFlow * index + 1);
    }

    // Supondo que os dados recebidos contenham um array de valores para o gráfico
    this.flowOption = {
      ...this.flowOption,
      legend: {
        data: ['Fluido quente', 'Fluido frio'] // Replace with your desired legend names
      },
      series: [
        {
          data: hotFlowCalculed, // Atualiza os dados da série
          type: 'line',
          smooth: true
        },
        {
          data: coldFlowCalculed, // Atualiza os dados da série
          type: 'line',
          smooth: true
        },
      ],
      xAxis: {
        type: 'category',
        data: Array.from({ length: 100 }).map((_, i) => i + 1),
      },
    };
  
    this.temperatureOption = {
      ...this.temperatureOption,
      legend: {
        data: ['Fluido quente', 'Fluido frio'] // Replace with your desired legend names
      },
      series: [
        {
          name: 'Fluido 1',
          data: temperaturesHot, // Atualiza os dados da série
          type: 'line',
          smooth: true
        },
        {
          name: 'Fluido 2',
          data: temperaturesCold, // Atualiza os dados da série
          type: 'line',
          smooth: true
        },
      ],
      xAxis: {
        type: 'category',
        data: Array.from({ length: time_max }).map((_, i) => i + 1),
      },
    };
  }
  

  onSubmit(): void {
    const data = this.form.value;
    data.flowType = Number(data.flowType);

    console.log('Enviando dados para o backend:', data);
    this.socket.emit('calculate-heat-exchanger', data);
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }
  }