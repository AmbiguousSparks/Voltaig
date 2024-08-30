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
  private static apiUrl: string = import.meta.env.API_URL || ''

  constructor(private readonly _authenticationService: AuthenticationService) {}

  public async getDailyData(sid: string, date: string): Promise<AxiosResponse<ArrayBuffer>> {
    const url = 'https://neapi.hoymiles.com/pvm-data/api/0/station/data/count_power_by_day'
    const token = await this._authenticationService.getToken()

    return axios.post(
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
  }

  public async getStations(): Promise<AxiosResponse<HoymilesResponse<ListData<StationData>>>> {
    const url = `${import.meta.env.BASE_URL}pvm/station_select_by_page`
    const token = await this._authenticationService.getToken()
    return axios.post<HoymilesResponse<ListData<StationData>>>(HoymilesService.apiUrl, {
      requestUrl: url,
      token: token
    })
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
    const url = `${import.meta.env.API_URL}pvmrd/rd_query`
    const token = await this._authenticationService.getToken()

    const response = await axios.post<HoymilesResponse<StationEnergyData[]>>(
      HoymilesService.apiUrl,
      {
        requestUrl: url,
        token: token,
        body: {
          sids
        }
      }
    )

    return response.data
  }

  public async getStationRealData(sid: string): Promise<HoymilesResponse<StationRealData>> {
    const url = `${import.meta.env.API_URL}pvm-data/data_count_station_real_data`
    const token = await this._authenticationService.getToken()

    const response = await axios.post<HoymilesResponse<StationRealData>>(HoymilesService.apiUrl, {
      requestUrl: url,
      token: token,
      body: {
        sid
      }
    })

    return response.data
  }
}
