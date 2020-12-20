import {CalendarCellData} from "../../models/calendarCellData";

export const getOriginalCapacity = (cellData: CalendarCellData) => {
    if (!cellData.timeBlock) return 0;
    return cellData.timeBlock.Sites.reduce((prev, curr, i, arr) => {
        return prev + curr.OriginalCapacitySum;
    }, 0);
};

export const getLeftCapacity = (cellData: CalendarCellData) => {
    if (!cellData.timeBlock) return 0;
    return cellData.timeBlock.Sites.reduce((prev, curr, i, arr) => {
        let value = 0;
        for (let property in curr.Capacity) {
            value += +curr.Capacity[property];
        }
        return prev + value;
    }, 0);

};
//TODO: Change to marker
export const changeCellDataStyle = (orig: number, left: number, cellData: CalendarCellData) => {
    const emptyColor = 'transparent';
    const freeColor = 'hsl(120,95%,80%)';
    const mediumColor = 'hsl(45,95%,80%)';
    const fullColor = 'hsl(360,95%,80%)';

    let used = orig - left;
    let percent = (used / orig) * 100;
    if (!cellData.style.backgroundColor) {
        if (percent === 0) cellData.style.backgroundColor = emptyColor;
        if (percent > 0 && percent <= 25)
            cellData.style.backgroundColor = freeColor;
        if (percent > 25 && percent <= 100)
            cellData.style.backgroundColor = mediumColor;
        if (percent >= 100) cellData.style.backgroundColor = fullColor;
    }
}