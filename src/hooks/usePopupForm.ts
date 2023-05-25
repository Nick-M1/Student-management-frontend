import {useCallback, useState} from "react";

export default function usePopupForm<T>() {
    const [popupFormOpen, setPopupFormOpen] = useState(false)
    const [popupFormItem, setPopupFormItem] = useState<T | null>(null)

    const closePopupForm = useCallback(() => {
        setPopupFormOpen(false)
        setPopupFormItem(null)
    }, [])

    return [
        popupFormOpen,
        setPopupFormOpen,
        popupFormItem,
        setPopupFormItem,
        closePopupForm
    ] as const
}