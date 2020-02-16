import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentage'
})
export class PercentagePipe implements PipeTransform {

  transform(value: number, decimals: number = 2): string {
    let power = Math.pow(10, decimals);
    return (Math.round(value * 100 * power) / power) + ' %';
  }

}
