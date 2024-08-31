import { HoymilesResponse } from '@/hoymiles/models/hoymiles'
import axios from 'axios'
import type { LoginData } from '@/authentication/models/login'

export class AuthenticationService {
  private static tokenKey = btoa('base64')

  constructor(private readonly _apiUrl: string) {}

  private async login(): Promise<HoymilesResponse<LoginData>> {
    const url = `${import.meta.env.VITE_API_URL}iam/auth_login`
    console.log(url)
    const response = await axios.post<HoymilesResponse<LoginData>>(this._apiUrl, {
      body: {
        user_name: import.meta.env.VITE_USER_NAME,
        password: import.meta.env.VITE_PASSWORD
      },
      requestUrl: url
    })

    return response.data
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
