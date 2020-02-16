import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timespan'
})
export class TimespanPipe implements PipeTransform {

  transform(value: number, ...args: any[]): string {
    var hours   = Math.floor(value / 3600);
    var minutes = Math.floor((value - (hours * 3600)) / 60);
    var seconds = value - (hours * 3600) - (minutes * 60);

    let hoursString = (hours   < 10) ? "0"+hours : hours;
    let minutesString = (minutes   < 10) ? "0"+minutes : minutes;
    let secondsString = (seconds   < 10) ? "0"+seconds : seconds;
    return hoursString+':'+minutesString+':'+secondsString;
  }

}
