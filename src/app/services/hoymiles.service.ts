import {Injectable} from '@angular/core';
import {HoymilesServiceInt} from "./interfaces/hoymiles.service";
import {HoymilesResponse, ListData, LoginData, StationData, StationEnergyData, StationRealData} from "../models/model";
import {environment} from "../../environment/environment";
import {HttpClient} from "@angular/common/http";
import {concatMap, Observable, take, tap} from "rxjs";


@Injectable()
export class HoymilesService implements HoymilesServiceInt {

  private static ApiUrl: string = environment.apiUrl;
  private static TokenKey = btoa("token");

  constructor(private _httpClient: HttpClient) {
  }

  getDailyData(sid: string, date: string): Observable<ArrayBuffer> {
    const url = 'https://neapi.hoymiles.com/pvm-data/api/0/station/data/count_power_by_day';

    return this.getToken()
      .pipe(take(1))
      .pipe(concatMap(x => this._httpClient.post(url, {sid, date}, {
        headers: {
          Authorization: x.token,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      })))
  }

  public getStationData(id: string): void {

  }

  private login(): Observable<HoymilesResponse<LoginData>> {
    const url = `${environment.baseUrl}iam/auth_login`;

    return this._httpClient.post<HoymilesResponse<LoginData>>(HoymilesService.ApiUrl, {
      body: {
        user_name: environment.userName,
        password: environment.password
      },
      requestUrl: url
    });
  }

  private getToken(): Observable<LoginData> {
    return new Observable<LoginData>(subscription => {
      const loginData = sessionStorage.getItem(HoymilesService.TokenKey)

      if (!loginData) {
        this.login()
          .pipe(take(1))
          .subscribe(x => {
            sessionStorage.setItem(HoymilesService.TokenKey, JSON.stringify(x.data));
            subscription.next(x.data);
          });
      }

      subscription.next(JSON.parse(loginData!));
    });
  }

  getStations(): Observable<HoymilesResponse<ListData<StationData>>> {
    const url = `${environment.baseUrl}pvm/station_select_by_page`;

    return this.getToken()
      .pipe(take(1))
      .pipe(concatMap(x => this._httpClient.post<HoymilesResponse<ListData<StationData>>>(HoymilesService.ApiUrl, {
        requestUrl: url,
        token: x.token
      })))
  }


  getMonthData(sid: string, date: string): Observable<Object> {
    const url = 'https://neapi.hoymiles.com/pvm-data/api/0/station/data/count_eq_by_day_of_month';

    return this._httpClient.post(url, {sid, date}, {
      headers: {
        Authorization: '2.nFrKMkY4S55wVtRXLz9axZlqoxOWcTVaaQW6Q7tlXFGwTgniK4kJdXlDSAsgmFGueiUTTCQIGba.0',
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer'
    })
  }

  getStationEnergyData(sids: string[]): Observable<HoymilesResponse<StationEnergyData[]>> {
    const url = `${environment.baseUrl}pvmrd/rd_query`;

    return this.getToken()
      .pipe(concatMap(x => this._httpClient.post<HoymilesResponse<StationEnergyData[]>>(HoymilesService.ApiUrl, {
        requestUrl: url,
        token: x.token,
        body: {
          sids
        }
      })))
  }

  getStationRealData(sid: string): Observable<HoymilesResponse<StationRealData>> {
    const url = `${environment.baseUrl}pvm-data/data_count_station_real_data`;

    return this.getToken()
      .pipe(concatMap(x => this._httpClient.post<HoymilesResponse<StationRealData>>(HoymilesService.ApiUrl, {
        requestUrl: url,
        token: x.token,
        body: {
          sid
        }
      })))
  }

}
