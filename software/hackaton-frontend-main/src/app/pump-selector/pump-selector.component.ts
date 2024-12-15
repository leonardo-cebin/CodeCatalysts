import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbButtonModule, NbCardModule, NbInputModule, NbSelectModule, NbStepperModule } from '@nebular/theme';
import { CoefficientService } from '../services/coefficient.service';
import { HttpClientModule } from '@angular/common/http';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-pump-selector',
  standalone: true,
  imports: [NbCardModule, NbButtonModule, NbInputModule, NbSelectModule, ReactiveFormsModule, HttpClientModule, NgIf],
  templateUrl: './pump-selector.component.html',
  styleUrl: './pump-selector.component.scss',
  providers: [CoefficientService]
})
export class PumpSelectorComponent implements OnInit {
  form!: FormGroup;

  isTemperatureInvalid = false;

  coefficients: any[] = [];

  fluid: any;

  vaporPressure: any;

  constructor(private fb: FormBuilder, private router:Router, private coefficientService: CoefficientService) {
    this.form = this.fb.group({
      geometricHeight: [null, Validators.required],
      suctionHeight: [null, Validators.required],
      suctionPressureLoss: [null, Validators.required],
      pressureLossInThePump: [null, Validators.required],
      fluid: [null, Validators.required],
      averageFluidTemperature: [null, Validators.required],
      fluidPressureInCapture: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.coefficientService.listCoefficients().subscribe((response: any) => {
      this.coefficients = response;
      console.log('this.coefficients', response);
    });

    this.form.get('fluid')?.valueChanges.subscribe((response) => {
      this.fluid = this.coefficients.find((coefficient) => coefficient.id === response);
    });
    
    this.form.get('averageFluidTemperature')?.valueChanges.subscribe((response) => {
      if(response < this.fluid.tmin || response > this.fluid.tmax) {
        this.isTemperatureInvalid = false;
        this.form.get('averageFluidTemperature')?.setErrors({ customError: 'Campo inválido' });
        this.form.get('averageFluidTemperature')?.markAsTouched();
        this.vaporPressure = 0;
      } else {
        this.isTemperatureInvalid = true;
        this.form.get('averageFluidTemperature')?.setErrors(null);
        this.vaporPressure = Math.trunc(this.calcularPressaoVapor(this.fluid.constanta, this.fluid.constantb, this.fluid.constantc, response) * 133.322);
        console.log('vaporPressure', this.vaporPressure);
      }
      console.log('isTemperatureInvalid', this.isTemperatureInvalid);
    });
  }

  calcularPressaoVapor(A: any, B: any, C: any, Temp: any) {
      const logPvapor = A - (B / (C + Temp));
      const Pvapor = Math.pow(10, logPvapor);
      return Pvapor;
  }

  consult(): void {
    localStorage.setItem('adviceData', `
          Gostaria que me fornecesse uma recomendação de uma bomba/pump.
          Vou fornecer a altura manométrica em metros sendo ela ${this.form.get('geometricHeight')?.value}, altura de sucção em metros sendo ela ${this.form.get('suctionHeight')?.value}, perda de carga no trajeto de sucção em metros sendo ela ${this.form.get('suctionPressureLoss')?.value}, perda de carga de bomba em metros sendo ela ${this.form.get('pressureLossInThePump')?.value}, a pressão de vapor do fluído sendo ela ${this.vaporPressure}, a densidade do fluído em km/m³ sendo ela ${this.fluid.density} e a pressão do fluído na captação em Pascals sendo ela ${this.form.get('fluidPressureInCapture')?.value}.
          Através destes dados, calcule o NPSH disponível/available, e me mostre qual a melhor bomba recomendada para estes valores. Não me mostre os cálculos, mas apenas a conclusão de forma sucinta.
        `);
      this.router.navigate(['/advice']);
  }
}
