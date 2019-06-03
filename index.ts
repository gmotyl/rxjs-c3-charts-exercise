
import { Purchase } from './types';

const jsf = require('json-schema-faker')
const schema = require('./purchase.schema.json')

const to2 = (n: number) => Math.round(n * 100) / 100;
const getPurchase = (): Purchase => jsf(schema)
console.log(getPurchase());

const purchaseTotalPrice = (p: Purchase) => (p.amount * p.unitPrice)
const purchaseNetPrice = (p: Purchase) => purchaseTotalPrice(p) * (1 - p.vatTax)
const purchaseTaxPrice = (p: Purchase) => purchaseTotalPrice(p) * p.vatTax

import * as c3 from 'c3'
import 'c3/c3.css'

var chart = c3.generate({
    bindto: '#chart',
    data: {
      columns: [
        ['total', 30, 200, 100, 400, 150, 250],
      ]
    }
});

const refreshChart = (data: any) =>
  chart.load({
    columns: [
      data,
    ]
});

import { interval, of, pipe, merge } from 'rxjs'; 
import { map, scan, shareReplay } from 'rxjs/operators';

const sumAndRoundHistory = (chartName: string) => pipe(
  scan((sum: number, price: number) => sum + price, 0),
  map(to2),
  scan(( list, item ) => [...list, item], [] as number[]),
  map(list => [chartName, ...list]),
);

const purchase$ = interval(4000).pipe(
  map(_ => getPurchase()),
  shareReplay(),
);

const purchaseTotalPrice$ = purchase$.pipe(
  map(p => purchaseTotalPrice(p)),
  sumAndRoundHistory('total'),
);

const purchaseNetPrice$ = purchase$.pipe(
  map(p => purchaseNetPrice(p)),
  sumAndRoundHistory('net'),
)

const purchaseTaxPrice$ = purchase$.pipe(
  map(p => purchaseTaxPrice(p)),
  sumAndRoundHistory('tax'),
)

// purchaseTotalPrice$.subscribe(refreshChart);
// purchaseNetPrice$.subscribe(refreshChart);
// purchaseTaxPrice$.subscribe(refreshChart);

const chartUpdates$ = merge(
  purchaseTotalPrice$,
  purchaseNetPrice$,
  purchaseTaxPrice$,
)

chartUpdates$.subscribe(refreshChart);

