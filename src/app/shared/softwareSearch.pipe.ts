import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'softwareSearch' })
export class SoftwareFilterPipe implements PipeTransform {
  public transform(softwares: any[], searchText: any): any {
    if (searchText == null || softwares == null) {
      return softwares;
    }
    return softwares.filter(software => software.Software_Name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
  }
}