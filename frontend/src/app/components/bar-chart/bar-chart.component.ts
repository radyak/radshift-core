import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {

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

  getPercentage(): number {
    return 100 * this.fractions[0]/this.fractions[this.fractions.length - 1];
  }

}
