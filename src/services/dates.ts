export const getMonday = (currentDate: Date) => {
    return new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()))
}

