import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { pluck, map, multicast, refCount } from 'rxjs/operators';

const pluckArrayValue = map((arr: any[]) => arr ? arr.map(v => v.value) : []);

@Injectable({
  providedIn: 'root',
})
export class ObjectsService {
  data$ = new BehaviorSubject({});

  areas$ = this.data$.pipe(pluck('areas'), pluckArrayValue, multicast(new BehaviorSubject([])), refCount());
  components$ = this.data$.pipe(pluck('components'), pluckArrayValue, multicast(new BehaviorSubject([])), refCount());
  customers$ = this.data$.pipe(pluck('customers'), pluckArrayValue, multicast(new BehaviorSubject([])), refCount());
  manufacturingOrders$ = this.data$.pipe(pluck('manufacturingOrders'), pluckArrayValue, multicast(new BehaviorSubject([])), refCount());

  constructor() {}
}
