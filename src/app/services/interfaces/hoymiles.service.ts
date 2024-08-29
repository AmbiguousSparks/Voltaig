import { Observable } from "rxjs";
import {HoymilesResponse, ListData, StationData, StationEnergyData, StationRealData} from "../../models/model";
import {HoymilesService} from "../hoymiles.service";

export interface HoymilesServiceInt {
  getStationData(id: string): void;

  getDailyData(sid: string, date: string): Observable<Object>;

  getMonthData(sid: string, date: string): Observable<Object>;

  getStations(): Observable<HoymilesResponse<ListData<StationData>>>;

  getStationEnergyData(sids: string[]): Observable<HoymilesResponse<StationEnergyData[]>>;

  getStationRealData(sid: string): Observable<HoymilesResponse<StationRealData>>;
}
