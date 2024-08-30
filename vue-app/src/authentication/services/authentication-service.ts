import { HoymilesResponse } from '@/hoymiles/models/hoymiles'
import axios from 'axios'
import type { LoginData } from '@/authentication/models/login'

export class AuthenticationService {
  private static apiUrl: string = import.meta.env.API_URL || ''
  private static tokenKey = btoa('base64')
  private async login(): Promise<HoymilesResponse<LoginData>> {
    const url = `${import.meta.env.BASE_URL}iam/auth_login`
    return axios
      .post<HoymilesResponse<LoginData>>(AuthenticationService.apiUrl, {
        body: {
          user_name: import.meta.env.USER_NAME,
          password: import.meta.env.PASSWORD
        },
        requestUrl: url
      })
      .then((response) => response.data)
  }

  public async getToken(): Promise<string> {
    let loginData = sessionStorage.getItem(AuthenticationService.tokenKey)
    if (!loginData) {
      const loginResponse = await this.login()
      loginData = JSON.stringify(loginResponse.data)
      sessionStorage.setItem(AuthenticationService.tokenKey, loginData)
    }
    return JSON.parse(loginData).token
  }
}
