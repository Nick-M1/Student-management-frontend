import {useCallback, useState} from "react";

export default function usePagination() {
    const [pagenumber, setPagenumber] = useState(0)

    const nextPageNavigate = useCallback(() => {
        setPagenumber(prevState => prevState + 1)
    }, [])

    const previousPageNavigate = useCallback(() => {
        setPagenumber(prevState => prevState > 0 ? prevState - 1 : prevState)
    }, [])

    return [pagenumber, nextPageNavigate, previousPageNavigate] as const
}