import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PiecesService,StatsPieces } from '../../piecesdash';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  public stats?: StatsPieces;

  constructor(private piecesService: PiecesService) {}

  ngOnInit(): void {
    this.piecesService.getStats().subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error(err)
    });
  }

  getPercentage(value: number): string {
    if (!this.stats || this.stats.total === 0) return '0%';
    return ((value / this.stats.total) * 100).toFixed(1) + '%';
  }

  getDonutStyle(): string {
    if (!this.stats || this.stats.total === 0) return 'conic-gradient(#333 0% 100%)';

    const p1 = (this.stats.motorisation / this.stats.total) * 100;
    const p2 = p1 + (this.stats.transmission / this.stats.total) * 100;
    const p3 = p2 + (this.stats.freinage / this.stats.total) * 100;
    const p4 = p3 + (this.stats.carrosserie / this.stats.total) * 100;

    return `conic-gradient(
      #2ecc71 0% ${p1}%,
      #3498db ${p1}% ${p2}%,
      #e74c3c ${p2}% ${p3}%,
      #f1c40f ${p3}% ${p4}%,
      #9b59b6 ${p4}% 100%
    )`;
  }
}
