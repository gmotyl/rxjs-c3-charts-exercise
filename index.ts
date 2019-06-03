
import { Purchase } from './types';

const jsf = require('json-schema-faker')
const schema = require('./purchase.schema.json')

const to2 = (n: number) => Math.round(n * 100) / 100;
const getPurchase = (): Purchase => jsf(schema)
console.log(getPurchase());

const purchaseTotalPrice = (p: Purchase) => (p.amount * p.unitPrice)
const purchaseNetPrice = (p: Purchase) => purchaseTotalPrice(p) * (1 - p.vatTax)

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

const refreshChart = (chartName: string) =>
  (values: number[]) => {
    chart.load({
      columns: [
        [chartName, ...values]
      ]
    });
  }

import { interval, of, pipe } from 'rxjs'; 
import { map, scan } from 'rxjs/operators';

const sumAndRound = pipe(
  scan((sum: number, price: number) => sum + price, 0),
  map(to2)  
);

const purchase$ = interval(4000).pipe(
  map(_ => getPurchase()),
);

const purchaseTotalPrice$ = purchase$.pipe(
  map(p => purchaseTotalPrice(p)),
  sumAndRound,
);

const purchaseNetPrice$ = purchase$.pipe(
  map(p => purchaseTotalPrice(p)),
  sumAndRound
)

const purchasePriceHistory$ = purchaseTotalPrice$.pipe(
  scan(( list, item ) => [...list, item], [] as number[])
)

purchasePriceHistory$.subscribe(x => {
  console.log(x)
  refreshChart('total')(x)
});

