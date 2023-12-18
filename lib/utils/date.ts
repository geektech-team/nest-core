export class DateUtil {
  static TimeInOneMinute = 60 * 1000;
  static TimeInOneHour = 60 * DateUtil.TimeInOneMinute;
  static TimeInOneDay = 24 * DateUtil.TimeInOneHour;

  static beginningOfDate(date: Date) {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  static endOfDate(date: Date) {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  }

  static firstWeekDayOfDate(date: Date) {
    const dayInweek = date.getDay() || 7;
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() - dayInweek + 1,
    );
  }

  static firstDayOfLastNMonth(date: Date, n: number) {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month - n, 1);
  }

  static firstYearDayOfDate(date: Date) {
    const year = date.getFullYear();
    return new Date(year, 0, 1);
  }

  static lastWeekDayOfDate(date: Date) {
    const dayInweek = 7 - (date.getDay() || 7);
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + dayInweek,
    );
  }

  static firstMonthDayOfDate(date: Date) {
    const result = new Date(date);
    result.setDate(1);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  static dayAgoOfDate(date: Date, ago: number) {
    return new Date(date.getTime() - ago * DateUtil.TimeInOneDay);
  }

  static dayAfterOfDate(date: Date, after: number) {
    return new Date(date.getTime() + after * DateUtil.TimeInOneDay);
  }

  /**
   * 格式化
   * @param date 日期
   * @param format yyyy.MM.dd hh:mm:ss
   * @returns 格式化后的string
   */
  static format(date: Date, format = 'yyyy-MM-dd hh:mm:ss'): string {
    const year = `${date.getFullYear()}`;
    let month = `${date.getMonth() + 1}`;
    if (month.length === 1) {
      month = `0${month}`;
    }
    let day = `${date.getDate()}`;
    if (day.length === 1) {
      day = `0${day}`;
    }

    let hours = `${date.getHours()}`;
    if (hours.length === 1) {
      hours = `0${hours}`;
    }
    let minutes = `${date.getMinutes()}`;
    if (minutes.length === 1) {
      minutes = `0${minutes}`;
    }
    let seconds = `${date.getSeconds()}`;
    if (seconds.length === 1) {
      seconds = `0${seconds}`;
    }

    return format
      .replace(/yyyy/g, year)
      .replace(/MM/g, month)
      .replace(/dd/g, day)

      .replace(/hh/g, hours)
      .replace(/mm/g, minutes)
      .replace(/ss/g, seconds);
  }
}
