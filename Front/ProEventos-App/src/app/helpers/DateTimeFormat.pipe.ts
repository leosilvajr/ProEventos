import { Constants } from '@app/util/constants';
import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'DateFormatPipe',
})
export class DateTimeFormatPipe extends DatePipe implements PipeTransform {
  override transform(value: any, args?: any): any {
    if (typeof value !== 'string' || value.length < 16) {
      // Verifique se value é uma string válida com pelo menos 16 caracteres.
      return value;
    }

    let month = value.substring(0, 2)
    let day = value.substring(3, 5)
    let year = value.substring(6, 10)
    let hour = value.substring(11, 13)
    let minutes = value.substring(14, 16)

    value = day + '/' + month + '/' + year + ' ' + hour + ':' + minutes;
    return super.transform(value, Constants.DATE_TIME_FMT);
  }
}
