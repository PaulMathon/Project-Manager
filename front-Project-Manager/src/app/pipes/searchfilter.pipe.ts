import {Pipe, PipeTransform} from '@angular/core';
import * as Fuse from 'fuse.js';

@Pipe({
  name: 'userSearchFilter'
})
export class UserSearchFilterPipe implements PipeTransform {

  transform(users: any, search: string): any {
    if (!search) {
      return [];
    }
    const options: Fuse.FuseOptions<any> = {
      keys: ['lastName', 'name'],
    };
    const fuse = new Fuse(users, options);
    return fuse.search(search);
  }

}

@Pipe({
  name: 'groupSearchFilter'
})
export class GroupSearchFilterPipe implements PipeTransform {

  transform(groups: any, search: string): any {
    if (!search) {
      return groups;
    }
    const options: Fuse.FuseOptions<any> = {
      keys: [
        { name: 'title', weight: 0.45 },
        { name: 'description', weight: 0.2 },
        { name: 'startDate', weight: 0.1 },
        { name: 'endDate', weight: 0.1 },
        { name: 'members.email', weight: 0.05 },
        { name: 'members.name', weight: 0.05 },
        { name: 'members.lastName', weight: 0.05 }
      ],
    };
    const fuse = new Fuse(groups, options);
    return fuse.search(search);
  }

}
