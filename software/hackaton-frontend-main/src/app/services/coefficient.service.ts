import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CoefficientService {

  constructor(private httpClient: HttpClient) { }

  listCoefficients(): any {
    return this.httpClient.get('http://localhost:3000/coefficients')
  }

}
