import {Dispatch, ReactNode, SetStateAction, useCallback, useState} from "react";
import PopupSmallCustom from "../headlessui/PopupSmallCustom";
import {ExclamationTriangleIcon} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import {toastOptionsCustom} from "../../utils/toast-options-custom";
import SortUpIcon from "../../icons/SortUpIcon";
import SortDownIcon from "../../icons/SortDownIcon";
import {HasId} from "../../interfaces";




type Props<T> = {
    itemName: string
    columns: TableColumn[]

    rowData: T[]
    displaySingleRow: (item: T) => ReactNode

    recentlyUpdatedItem: number | null
    setRecentlyUpdatedItem: Dispatch<SetStateAction<number | null>>

    onEdit: (item: T) => void
    onDelete: (item: T) => Promise<Response>

    // QUERYING
    sortingAsc: boolean
    setSortingAsc: Dispatch<SetStateAction<boolean>>
    sortingOrderby: string
    setSortingOrderby: Dispatch<SetStateAction<string>>
}

export default function TableCustom<T extends HasId>({ itemName, columns, rowData, displaySingleRow, recentlyUpdatedItem, setRecentlyUpdatedItem, onEdit, onDelete, sortingAsc, setSortingAsc, sortingOrderby, setSortingOrderby }: Props<T>) {
    const [deletePopupItem, setDeletePopupItem] = useState<T | null>(null)
    const closeDeletePopup = useCallback(() => setDeletePopupItem(null), [])

    const handleDelete = useCallback(async () => {
        toast.loading(`Deleting ${itemName} from database...`, { ...toastOptionsCustom, id: 'deleting' } )

        if (deletePopupItem === null) {
            toast.error('Delete failed', { id: 'deleting' })
            return
        }

        await onDelete(deletePopupItem)
            .then(
                () => {
                    setDeletePopupItem(null)
                    toast.success(`Deleted ${itemName} successfully`, { id: 'deleting' })
                    setRecentlyUpdatedItem(deletePopupItem.id)
                },
                () => {
                    toast.error('Delete failed', { id: 'deleting' })
                }
            )
    }, [deletePopupItem, onDelete])

    return (
        <>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg scrollbar">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            { columns.map( (column) => (
                                <th scope="col" className="px-6 py-3" key={column.header}>
                                    <div
                                        className="flex items-center cursor-pointer"
                                        onClick={() => {
                                            if (column.accessor == sortingOrderby)
                                                setSortingAsc(asc => !asc)
                                            else {
                                                setSortingOrderby(column.accessor)
                                                setSortingAsc(true)
                                            }
                                        }}
                                    >
                                        { column.header }

                                        <div className='ml-2'>
                                            <SortUpIcon className={`w-3.5 h-3.5 -mb-3 ${column.accessor == sortingOrderby && !sortingAsc && 'opacity-0' }`}/>
                                            <SortDownIcon className={`w-3.5 h-3.5 ${column.accessor == sortingOrderby && sortingAsc && 'opacity-0' }`}/>
                                        </div>
                                    </div>
                                </th>
                            ))}
                            <th scope="col" className="px-6 py-3">
                                <span className="sr-only">Edit</span>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <span className="sr-only">Delete</span>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        { rowData.map( (item) => (
                            <tr key={item.id} className={`group border-b smooth-transition ${recentlyUpdatedItem == item.id ? 'bg-cyan-50' : 'bg-white hover:bg-gray-50'}`} >
                                { displaySingleRow(item) }

                                <td className="px-6 py-4 text-right">
                                    <button
                                        type='button'
                                        className="font-medium text-blue-500 dark:text-blue-500 hover:text-blue-700 smooth-transition"
                                        onClick={() => onEdit(item)}
                                    >
                                        Edit
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        type='button'
                                        className="font-medium text-red-500 dark:text-blue-400 hover:text-red-700 smooth-transition"
                                        onClick={() => setDeletePopupItem(item)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <PopupSmallCustom
                modal={deletePopupItem !== null}
                setModal={closeDeletePopup}
                confirmHandler={handleDelete}
                titleText={`Delete this ${itemName}`}
                descriptionText={`Are you sure you want to delete this ${itemName}? 😥`}
                buttonText={'Delete'}
                IconImg={ExclamationTriangleIcon}
            />
        </>
    );
};