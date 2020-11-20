export type SelectedDateState = {
    selectedDate: Date
}

export const selectedDateInitState: SelectedDateState = {
    selectedDate: new Date()
}

export const selectedDataActions = {
    updateSelectedDate: (date: Date) => (operations: any) => {
        operations.setState({
            selectedDate: new Date(date),
        });
    },
}