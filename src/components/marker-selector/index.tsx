import React from "react";
import {Select} from "antd";
import {ICalendarCellMarker} from "../../markers";
import {useMarkers} from "../../store/markers";

const {Option} = Select;
//TODO: unused -> delete
export const MarkerSelector = () => {
    const [, {changeMarker}] = useMarkers();
    const markers: { [key: string]: { marker: ICalendarCellMarker, name: string } } = {}
    const onMarkerChanged = (key: string) => {
        if(key in markers)
            changeMarker(markers[key].marker)
        else
            changeMarker(undefined)
    }
    return (
        <Select allowClear={true} placeholder={"Wybierz marker"} style={{width: 120}} onChange={onMarkerChanged}>
            {
                Object.keys(markers).map((key) => {
                    let obj = markers[key];
                    return <Option value={key}>{obj.name}</Option>
                })
            }
        </Select>
    )
}