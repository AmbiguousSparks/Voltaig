import {Component, OnInit} from '@angular/core';
import {HoymilesService} from "../services/hoymiles.service";
import {StationData, StationEnergyData} from "../models/model";
import {concatMap, concatWith, finalize, find, take} from "rxjs";
import {ChartDecoder} from "../services/ChartDecoder";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  basicData: {
    labels: any[],
    datasets: any[],
    id: number;
  }[] = [];

  basicOptions: any;

  public stationsData: StationData[] = [];

  public stationEnergyData: StationEnergyData[] = [];

  constructor(private _hoymilesService: HoymilesService) {
  }

  ngOnInit() {

    //this._hoymilesService.getStationData('4840260');
    this._hoymilesService.getStations()
      .pipe(take(1))
      .subscribe(x => {
        this.stationsData = x.data.list;

        this.stationsData.forEach(x => {
          x.chartCalendarDate = new Date();

          this.getChartData(x);

          this._hoymilesService.getStationRealData(x.id.toString())
            .subscribe(realData => {
              x.stationRealData = realData.data;
            });
        });


        this._hoymilesService.getStationEnergyData(this.stationsData.map(x => x.id.toString()))
          .pipe(take(1))
          .subscribe(y => {
            for (const stationData of this.stationsData) {
              stationData.stationEnergyData = y.data.find(res => res.sid == stationData.id)!;
            }
          });
      });

    this.plotData();
  }

  private getChartData(stationData: StationData) {

    const formattedDate = this.formatDate(stationData.chartCalendarDate);

    this._hoymilesService.getDailyData(stationData.id.toString(), formattedDate)
      .subscribe(async (bufferResponse: ArrayBuffer) => {
        const data: {
          labels: any[],
          datasets: any[],
          id: number
        } = {
          labels: [],
          datasets: [],
          id: stationData.id
        };

        const buffer = new Uint8Array(bufferResponse);
        const decoded = new ChartDecoder().decode(buffer);
        if (!data.labels.length) {
          data.labels = decoded.labels;
        }

        const rColor = Math.round(Math.random() * 255);

        data.datasets.push(
          {
            id: stationData.id,
            label: 'Production',
            data: decoded.data,
            backgroundColor: `rgba(${rColor}, 159, 64, 0.2)`,
            borderColor: [`rgb(${rColor}, 159, 64)', 'rgb(75, 192, 192)`],
            borderWidth: 1,
            fill: true
          });

        if (this.basicData.find(x => x.id === stationData.id)) {
          this.basicData[this.basicData.findIndex(x => x.id === stationData.id)] = data;
          console.log(this.basicData);
          return;
        }

        this.basicData.push(data);
      });
  }

  private plotData() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary
          },
          title: {
            display: true
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }

  protected getProgressByStation(stationData: StationData): number {
    return Math.round(stationData?.stationEnergyData.gp / 1000 / parseFloat(stationData.capacitor) * 100);
  }

  protected changeCalendarDate(stationData: StationData) {
    console.log(stationData);

    this.getChartData(stationData);
  }

  private formatDate(chartCalendarDate: Date): string {
    return chartCalendarDate.toISOString().substring(0, 10);
  }

  findBasicData(id: number) {
    return this.basicData.find(x => x.id === id);
  }

  protected readonly find = find;

  getFormattedEnergyData(data: number) {
    return (data / 1000).toFixed(2);
  }
}
