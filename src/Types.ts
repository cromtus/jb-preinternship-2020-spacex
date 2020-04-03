export type Timestamp = number

export type Quarter = 1 | 2 | 3 | 4

export interface Time {
  years: number
  months: number | null
  date: number | null
  hours: number | null
  minutes: number | null
  quarter: Quarter | null
}

export interface Launch {
  mission: string
  launch: Time
  vehicle: string
  location: string
}