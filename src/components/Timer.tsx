import React from 'react'
import { Timestamp, Time, Quarter } from '../Types'


export default function Timer(props: { now: Timestamp, till: Time }) {
  const humanTime = new HumanTime(props.now, props.till)
  
  let text = humanTime.past ? '' : 'Состоится '
  text += humanTime.absolute
  return (
    <div className='time'>
      {text}
      {humanTime.relative && <span className='additional'> &mdash; {humanTime.relative}</span>}
    </div>
  )
}



type NumberCase = 0 | 1 | 2

function quarterCases(quarter: Quarter) {
  const o = (quarter === 2) ? 'о' : ''
  return `в${o} ${quarter}-м квартале`
}

function toInt(n: number) {
  return ~~n
}

function getNumberCase(n: number): NumberCase {
  if (toInt(n / 10) % 10 === 1) { // #1#
    return 0
  } else {
    if (n % 10 === 1) return 1
    if ((n % 10 <= 4) && (n % 10 >= 2)) return 2
    return 0
  }
}

function getDaysCase(days: number) {
  return ['дней', 'день', 'дня'][getNumberCase(days)]
}

function getHoursCase(hours: number) {
  return ['часов', 'час', 'часа'][getNumberCase(hours)]
}

function getMinutesCase(minutes: number) {
  return ['минут', 'минуту', 'минуты'][getNumberCase(minutes)]
}

const months = [
  'января', 'февраля', 'марта', 'апреля',
  'мая', 'июня', 'июля', 'августа',
  'сентября', 'октября', 'ноября', 'декабря'
]

function singleMonth(index: number) {
  const month = months[index]
  return month.substr(0, month.length - 1) + 'е'
}

class HumanTime {
  past: boolean
  absolute: string
  relative?: string

  constructor(now: Timestamp, till: Time) {
    const dateNow = new Date(now)

    this.past = false
    const targetDate = new Date(now)
    targetDate.setFullYear(till.years)
    if (till.months === null) {
      if (till.quarter === null) {
        const year = (dateNow.getFullYear() === till.years) ? 'этом' : till.years
        this.absolute = `в ${year} году`
      } else {
        const year = (dateNow.getFullYear() === till.years) ? 'этого' : till.years
        this.absolute = `${quarterCases(till.quarter)} ${year} года`
      }
    } else {
      targetDate.setMonth(till.months - 1)
      if (till.date === null) {
        this.absolute = `в ${singleMonth(till.months)}`
      } else {
        targetDate.setDate(till.date)
        if (till.hours === null || till.minutes === null) {
          this.absolute = `${till.date} ${months[targetDate.getMonth()]}`
          if (dateNow.getFullYear() !== till.years) {
            this.absolute += ` ${till.years} года`
          } else {
            this.absolute += ` этого года`
          }
        } else {
          targetDate.setHours(till.hours)
          targetDate.setMinutes(till.minutes)
          this.past = targetDate.getTime() < now
          const minutes = (till.minutes < 10) ? '0' + till.minutes : till.minutes
          this.absolute = `${till.date} ${months[targetDate.getMonth()]} в ${till.hours}:${minutes}`

          const timeDelta = Math.abs(targetDate.getTime() - now)
          const daysRemained = toInt(timeDelta / 24 / 60 / 60 / 1000)
          const relativeTextParts: string[] = []
          if (daysRemained > 0) {
            relativeTextParts.push(`${daysRemained} ${getDaysCase(daysRemained)}`)
          }
          const hoursRemained = toInt(timeDelta / 60 / 60 / 1000) % 24
          const minutesRemained = toInt(timeDelta / 60 / 1000) % 60
          if (hoursRemained > 0 || daysRemained > 0) {
            relativeTextParts.push(`${hoursRemained} ${getHoursCase(hoursRemained)}`)
          }
          relativeTextParts.push(`${minutesRemained} ${getMinutesCase(minutesRemained)}`)
          this.relative = relativeTextParts.join(' ')
          if (this.past) {
            this.relative += ' назад'
          } else {
            this.relative = 'через ' + this.relative
          }
        }
      }
    }
  }
}