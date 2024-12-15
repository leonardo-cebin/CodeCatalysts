import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbButtonModule } from '@nebular/theme';
import { EChartsCoreOption } from 'echarts/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { FormsModule } from '@angular/forms';

interface GridCell {
  type: number;
  isStart: boolean;
  isEnd: boolean;
  rotation: number;
}

@Component({
  selector: 'app-pressure-loss',
  standalone: true,
  imports: [NbCardModule, NbButtonModule, FormsModule],
  templateUrl: './pressure-loss.component.html',
  styleUrls: ['./pressure-loss.component.scss'],
})
export class PressureLossComponent {
  rows = 10;
  cols = 15;
  grid: any[] = [];

  selectedRow: number | null = null;
  selectedCol: number | null = null;

  types = ['Junção 90º', 'Junção T', 'Valvula Aberta', 'Valvula 1/2', 'Reto Horizontal'];
  materials = ['Cobre', 'Ferro', 'Aço'];

  selectedType = '';
  selectedMaterial = '';
  length = '';

  ngOnInit() {
    this.initializeGrid();
  }

  initializeGrid() {
    this.grid = Array.from({ length: this.rows }, (_, rowIndex) =>
      Array.from({ length: this.cols }, (_, colIndex) => ({
        rowIndex,
        colIndex,
        isStart: false,
        isEnd: false,
        image: null,
        length: null
      }))
    ).flat();
  }

  selectCell(row: number, col: number) {
    this.selectedRow = this.selectedRow === row && this.selectedCol === col ? null : row;
    this.selectedCol = this.selectedRow !== null ? col : null;
  }

  isSelected(row: number, col: number) {
    return this.selectedRow === row && this.selectedCol === col;
  }

  moveUp() {
    if (this.selectedRow !== null && this.selectedRow > 0) this.selectedRow--;
  }

  moveDown() {
    if (this.selectedRow !== null && this.selectedRow < this.rows - 1) this.selectedRow++;
  }

  moveLeft() {
    if (this.selectedCol !== null && this.selectedCol > 0) this.selectedCol--;
  }

  moveRight() {
    if (this.selectedCol !== null && this.selectedCol < this.cols - 1) this.selectedCol++;
  }

  rotateElement() {
    // Lógica de rotação a ser adicionada
  }

  defineStart() {
    if (this.selectedRow !== null && this.selectedCol !== null) {
      this.grid.forEach(cell => (cell.isStart = false));
      this.grid[this.selectedRow * this.cols + this.selectedCol].isStart = true;
    }
  }

  defineEnd() {
    if (this.selectedRow !== null && this.selectedCol !== null) {
      this.grid.forEach(cell => (cell.isEnd = false));
      this.grid[this.selectedRow * this.cols + this.selectedCol].isEnd = true;
    }
  }

  addElement() {
    if (this.selectedRow !== null && this.selectedCol !== null) {
      const index = this.selectedRow * this.cols + this.selectedCol;
      this.grid[index].image = this.getImagePath(this.selectedType, this.selectedMaterial) as any;
      this.grid[index].length = this.length as any;
    }
  }

  private getImagePath(type: string, material: string): string {
    // Retorna o caminho da imagem com base nos tipos e materiais
    return ''; // Implementar lógica
  }  
}
