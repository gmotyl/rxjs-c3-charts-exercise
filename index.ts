
import { Purchase } from './types';

const jsf = require('json-schema-faker')
const schema = require('./purchase.schema.json')

const to2 = (n: number) => Math.round(n * 100) / 100;
const getPurchase = (): Purchase => jsf(schema)
console.log(getPurchase());

const purchaseTotalPrice = (p: Purchase) => (p.amount * p.unitPrice)

import * as c3 from 'c3'
import 'c3/c3.css'

var chart = c3.generate({
    bindto: '#chart',
    data: {
      columns: [
        ['total', 30, 200, 100, 400, 150, 250],
        // ['data2', 50, 20, 10, 40, 15, 25]
      ]
    }
});

const refreshChart = (values: number[]) => {
    chart.load({
      columns: [
        ['total', ...values],
      ]
    });
}

import { interval, of } from 'rxjs'; 
import { map, scan } from 'rxjs/operators';

const purchase$ = interval(4000).pipe(
  map(_ => getPurchase()),
);

const purchasePrice$ = purchase$.pipe(
  map(p => purchaseTotalPrice(p)),
  scan((sum, price) => sum + price, 0),
  map(to2),
);

const purchasePriceHistory$ = purchasePrice$.pipe(
  scan((list, item) => [...list, item], [] as number[])
);

purchasePriceHistory$.subscribe(x => {
  console.log(x);
  refreshChart(x);
});
