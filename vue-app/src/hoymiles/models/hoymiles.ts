export class Config {
  sun_spec_num: number
  power_limit: string
  power_limit_pf: string
  power_limit_re: string
  module_max_power: number
  owner_is_show_layout: number
  owner_is_modify_dev: number
  third_party_user: any[]
  billing_type: number
  billing_start: string
  billing_every: number
  client_type: number
  layout_show: number
  fcs: number
  ess_cfg_edit: number
  grid_type: number
  diy: number
  weather: number
  au: number
}

export class Timezone {
  id: number
  dis_name: string
  name: string
  tz_name: string
  offset: number
}

export class ParentCity {
  id: number
  pid: number
  code: string
  weather_of_cid: number
  city_name: string
  country_code: string
  level: number
}

export class Group {
  id: number
  name: string
  pid: number
  type: number
  contact: string
  phone: string
  area: string
  icon: string
}

export class MoneyData {
  code: string
  unit: string
}

export class WarnData {
  s_uoff: boolean
  s_ustable: boolean
  s_uid: boolean
  l3_warn: boolean
  g_warn: boolean
  me_warn: boolean
}

export class ListData<T> {
  page: number
  page_size: number
  total: number
  list: T[]
}

export class StationData {
  id: number
  gid: number
  chartCalendarDate: Date = new Date()
  name: string
  type: number
  tz_id: number
  city_code: string
  status: number
  create_by: number
  create_at: string
  classify: number
  tz_name: string
  pic_path: string
  capacitor: string
  address: string
  layout_step: number
  is_balance: number
  is_reflux: number
  remarks: string
  config: Config
  is_stars: number
  money_unit: string
  electricity_price: number
  in_price: number
  usd: string
  nk_name: any
  int5m: number
  is_3rd: number
  dc: number
  city_id: number
  weather_of_cid: number
  timezone: Timezone
  local_time: string
  parent_city: ParentCity[]
  latitude: string
  longitude: string
  meter_location: number
  owner_list: any[]
  group: Group
  money_data: MoneyData
  warn_data: WarnData
  bms_capacitor: string
  inv_mode: number
  create_by_name: string
  lack: number
  ak: string
  flag_map: any
  stationEnergyData?: StationEnergyData
  stationRealData?: StationRealData
}

export class StationEnergyData {
  tm: string
  gp: number
  ed: number
  sid: number
}

export class StationRealData {
  today_eq: number
  month_eq: number
  year_eq: number
  total_eq: number
  real_power: string
  co2_emission_reduction: string
  plant_tree: string
  data_time: string
  last_data_time: string
  capacitor: string
  is_balance: number
  is_reflux: number
  reflux_station_data: any
}

export class HoymilesResponse<T> {
  status: string
  message: string
  data: T
  systemNotice: any
}
