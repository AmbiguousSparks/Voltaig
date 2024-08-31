import axios from 'axios'
import type { AxiosResponse } from 'axios'
import {
  HoymilesResponse,
  ListData,
  StationData,
  StationEnergyData,
  StationRealData
} from '../models/hoymiles'
import type { AuthenticationService } from '@/authentication/services/authentication-service'

export class HoymilesService {
  constructor(
    private readonly _authenticationService: AuthenticationService,
    private readonly _apiUrl: string
  ) {}

  public async getDailyData(sid: string, date: string): Promise<ArrayBuffer> {
    const url = `${import.meta.env.VITE_CHART_API_URL}/count_power_by_day`
    const token = await this._authenticationService.getToken()

    const response = await axios.post(
      url,
      { sid, date },
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    )

    return response.data
  }

  public async getStations(): Promise<HoymilesResponse<ListData<StationData>>> {
    const url = `${import.meta.env.VITE_API_URL}pvm/station_select_by_page`
    const token = await this._authenticationService.getToken()
    const response = await axios.post<HoymilesResponse<ListData<StationData>>>(this._apiUrl, {
      requestUrl: url,
      token: token
    })

    return response.data
  }

  public async getMonthData(sid: string, date: string): Promise<ArrayBuffer> {
    const url = 'https://neapi.hoymiles.com/pvm-data/api/0/station/data/count_eq_by_day_of_month'
    const response = await axios.post(
      url,
      { sid, date },
      {
        headers: {
          Authorization:
            '2.nFrKMkY4S55wVtRXLz9axZlqoxOWcTVaaQW6Q7tlXFGwTgniK4kJdXlDSAsgmFGueiUTTCQIGba.0',
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    )

    return response.data
  }

  public async getStationEnergyData(
    sids: string[]
  ): Promise<HoymilesResponse<StationEnergyData[]>> {
    const url = `${import.meta.env.VITE_API_URL}pvmrd/rd_query`
    const token = await this._authenticationService.getToken()

    const response = await axios.post<HoymilesResponse<StationEnergyData[]>>(this._apiUrl, {
      requestUrl: url,
      token: token,
      body: {
        sids
      }
    })

    return response.data
  }

  public async getStationRealData(sid: string): Promise<HoymilesResponse<StationRealData>> {
    const url = `${import.meta.env.VITE_API_URL}pvm-data/data_count_station_real_data`
    const token = await this._authenticationService.getToken()

    const response = await axios.post<HoymilesResponse<StationRealData>>(this._apiUrl, {
      requestUrl: url,
      token: token,
      body: {
        sid
      }
    })

    return response.data
  }
}
