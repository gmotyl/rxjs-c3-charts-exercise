
import { Purchase } from './types';

const jsf = require('json-schema-faker')
const schema = require('./purchase.schema.json')

const getPurchase = (): Purchase => jsf(schema)
console.log(getPurchase());

const purchaseTotalPrice = (p: Purchase) => (p.amount * p.unitPrice)

import * as c3 from 'c3'
import 'c3/c3.css'

var chart = c3.generate({
    bindto: '#chart',
    data: {
      columns: [
        ['data1', 30, 200, 100, 400, 150, 250],
        ['data2', 50, 20, 10, 40, 15, 25]
      ]
    }
});

setInterval(() => {
    chart.load({
      columns: [
        ['data1', 30, 200, 100, 400, 150, 250, 200],
        ['data2', 50, 20, 10, 40, 15, 25, 10]
      ]
    });
}, 2000)



import { interval, of } from 'rxjs'; 
import { map, scan } from 'rxjs/operators';

// const source = interval(1000).pipe(
//   map(_ => getPurchase())
// );

const source = of(getPurchase()).pipe(
  map(p => purchaseTotalPrice(p)),
  scan((sum, price) => sum + price, 0),
);

source.subscribe(x => console.log(x));
