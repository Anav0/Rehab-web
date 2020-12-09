import React, {useEffect} from "react";
import {Button, Result} from "antd";
import {useHistory, useParams} from "react-router-dom";

type codeType = 403 | 404 | 500 | "403" | "404" | "500" | "success" | "error" | "info" | "warning" | undefined;

type RouteParams = {
    code: string,
    msg: string
}

export const ErrorPage = () => {
    let {code, msg} = useParams<RouteParams>();
    let history = useHistory();
    msg = msg.split('-').join(" ")

    return (
        <Result
            className={'center'}
            status={code as codeType ?? 404}
            title={code}
            subTitle={msg ?? "Coś poszło nie tak"}
            extra={<Button type="primary" onClick={() => history.goBack()}>Wróć</Button>}
        />
    )
}