export const getWorkdaysFromMondayOf = (currentDate: Date, howManyDays: number) => {
    let dates: Date[] = [];

    let i = 0;
    while (dates.length != howManyDays) {
        //TODO: do not recalculate startDate
        var startDate = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()))
        var newDate = new Date(startDate.setDate(startDate.getDate() - startDate.getDay() + i));
        i++;
        if (newDate.getDay() == 6 || newDate.getDay() == 0) continue;
        dates.push(newDate)
    }

    return dates;
}