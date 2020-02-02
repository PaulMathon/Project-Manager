import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';


@Injectable()
export class SearchHeaderService {

  private searchHeaderContent = new BehaviorSubject('');
  currentsearchHeaderContent = this.searchHeaderContent.asObservable();

  constructor() { }

  changeSearchHeaderContent(message: string) {
    this.searchHeaderContent.next(message);
  }

}
