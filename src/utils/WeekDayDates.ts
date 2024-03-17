import { WeekDaysEnum } from '$lib/schemas';

/**
 * Weekdays are stores as the days the instance is available so to get the days that we need to 
 * block, we need to inverse the days.
 */
export function inverseWeekDaysEnum(weekDays: WeekDaysEnum[]): WeekDaysEnum[] {
  const weekDaysEnum = Object.values(WeekDaysEnum);
  return weekDaysEnum.filter((day) => !weekDays.includes(day as WeekDaysEnum)) as WeekDaysEnum[];
}

export function dayNumToEnum(dayNum: number): WeekDaysEnum {
  return Object.values(WeekDaysEnum)[dayNum];
}

// Function to get weekday dates based on given weekdays and maximum offset
// weekdays: array of weekdays (e.g., ['Monday', 'Wednesday', 'Friday'])
// maxOffset: maximum number of months to calculate dates for (default is 1)
export function getWeekdayDates(
  weekdays: string[],
  maxOffset = 1
): Date[] {
  const result: Date[] = [];
  const currentDate = new Date();

  // Loop through each offset (month)
  for (let offset = 0; offset <= maxOffset; offset++) {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + offset;

    // Loop through each weekday
    for (let weekdayIndex = 0; weekdayIndex < weekdays.length; weekdayIndex++) {
      const weekday = weekdays[weekdayIndex];
      // The 'limit' variable determines the maximum number of days in a month.
      // It is used to set the upper bound for iterating over the days in a month.

      // If the 'offset' is equal to the 'maxOffset', it means that the current date
      // is the last day of the month. In this case, we set the 'limit' to the current
      // date using 'currentDate.getDate()'.

      // Otherwise, if the 'offset' is not equal to the 'maxOffset', it means that the
      // current date is not the last day of the month. In this case, we set the 'limit'
      // to 31, which is the maximum number of days in a month.

      const limit = offset === maxOffset ? currentDate.getDate() : 31

      // Loop through each day of the month
      for (let day = 1; day <= limit; day++) {
        const date = new Date(currentYear, currentMonth, day);

        // Break the loop if the month changes
        if (date.getMonth() !== currentMonth) {
          break;
        }

        // Check if the day matches the desired weekday
        if (dayNumToEnum(date.getDay()) === weekday) {
          result.push(date);
        }
      }
    }
  }

  return result;
}
