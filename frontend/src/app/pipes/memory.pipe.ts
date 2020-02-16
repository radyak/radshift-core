import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'memory'
})
export class MemoryPipe implements PipeTransform {

  transform(value: any, unit: string = 'GB', decimals: number = 2): string {
    let factor = this.getFactor(unit);
    return this.round(value / factor, decimals) + ' ' + unit;
  }

  private getFactor(unit: string): number {
    unit = unit.trim().toUpperCase();
    if (unit === 'KB') {
      return 1024;
    }
    if (unit === 'MB') {
      return 1024 * 1024;
    }
    if (unit === 'GB') {
      return 1024 * 1024 * 1024;
    }
  }

  private round(value: number, decimals: number): number {
    let power = Math.pow(10, decimals);
    return (Math.round(value * power) / power);
  }

}
