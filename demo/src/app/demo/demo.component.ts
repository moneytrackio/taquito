import { Component, OnInit } from '@angular/core';
import { TezosService } from '../tezos.service';
import { FormControl } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { filter, startWith, map, delay, debounceTime, tap } from 'rxjs/operators';
import { zip } from 'lodash';


import * as Highcharts from 'highcharts';

@Component({
  selector: 'tz-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {

  public addressInput = new FormControl(this.tezos.getAddress());
  public autoRefreshToggle = new FormControl(true);
  public networkSelect = new FormControl('https://api.tez.ie/rpc/mainnet');

  public head$ = this.tezos.latestHead$;

  public addressDetail$ = this.tezos.addressDetail$;
  public blockDetail$ = this.tezos.lastBlock$;

  public options: any = {
    chart: {
      type: 'line',
      height: 400
    },
    title: {
      text: 'Balance History'
    },
    credits: {
      enabled: false
    },
    tooltip: {
      formatter: function (this: any) {
        return `${Highcharts.dateFormat('%e %b %y', this.x)}: ${Number(this.y) / 1000000 + 'ꜩ'}`;
      }
    },
    xAxis: {
      type: 'datetime',
      labels: {
        formatter: function (this: any) {
          return Highcharts.dateFormat('%e %b %y', this.value);
        }
      }
    },
    yAxis: {
      labels: {
        formatter: function (this: any) {
          return Number(this.value) / 1000000 + 'ꜩ';
        }
      }
    },
    series: [
      {
        name: 'Balance',
        data: [[new Date('2018-01-25 18:38:31').getTime(), 2]]
      },
    ]
  }

  public loading$ = combineLatest(this.tezos.blockLoading$, this.tezos.addressLoading$).pipe(map(([block, address]) => block || address));

  constructor(private tezos: TezosService) { }

  ngOnInit() {
    this.addressDetail$.subscribe(({ address }) => {
      this.addressInput.patchValue(address, { emitEvent: false })
    })

    this.networkSelect.valueChanges.subscribe((val) => {
      this.tezos.setNetwork(val);
    })

    this.addressDetail$.pipe(
      debounceTime(200),
      tap(({ history }) => {
        const serie = this.options.series[0];
        serie.data = zip(history.timestamp.map((x) => new Date(x).getTime()), history.value)
      }),
      delay(0))
      .subscribe(() => {
        Highcharts.chart('chart', this.options);
      })

    combineLatest(
      this.addressInput.valueChanges.pipe(startWith(this.addressInput.value)),
      this.head$.pipe(
        filter(() => {
          return this.autoRefreshToggle.value;
        })
      ),
      this.networkSelect.valueChanges.pipe(startWith({})))
      .subscribe(([value]) => {
        this.tezos.setAddress(value);
      })
  }

}