import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PAGINATOR_LABELS } from '../misc/paginator-labels';

@Injectable()
export class CustomPaginatorIntl extends MatPaginatorIntl {
  constructor() {
    super();
    Object.assign(this, PAGINATOR_LABELS);
  }
}
