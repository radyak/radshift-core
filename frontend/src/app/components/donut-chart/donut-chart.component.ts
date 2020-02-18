import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss']
})
export class DonutChartComponent implements OnInit {

  @Input()
  percentage: number = 0.85;

  @Input()
  percentagePoints: number;

  @Input()
  fractions: number[];
  
  @Input()
  color: string;
  
  constructor() { }

  ngOnInit() {
  }

  getDashArray(): string {
    let percentage = this.percentage;
    if (this.percentagePoints) {
      percentage = this.percentagePoints / 100;
    } else if (this.fractions && this.fractions.length > 1) {
      percentage = this.fractions[0]/this.fractions[1]
    }
    let dashArray = `${100 * percentage} ${100 - 100 * percentage}`;
    return dashArray;
  }

}
