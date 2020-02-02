import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'userSearchFilter'
})
export class UserSearchFilterPipe implements PipeTransform {

  transform(value: any, search: string): any {
    if (!search) {
      return value;
    }
    return value.filter(v => {
      if (!v) {
        return;
      }
      return v.lastName.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
             v.name.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    });
  }

}

@Pipe({
  name: 'groupSearchFilter'
})
export class GroupSearchFilterPipe implements PipeTransform {

  transform(value: any, search: string): any {
    if (!search) {
      return value;
    }

    return value.filter(v => {
      if (!v) {
        return;
      }

      return v.title.toLowerCase().indexOf(search.toLowerCase()) !== -1
        || v.description.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    });
  }

}
