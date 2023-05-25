import {Dispatch, ReactNode, SetStateAction, useCallback, useMemo, useState} from "react";
import Searchbar from "../shared/Searchbar";
import SubjectSelector from "../headlessui/SubjectSelector";
import TableCustom from "./TableCustom";
import deleteStudent from "../../DB/deleteStudent";
import StudentForm from "../forms/StudentForm";
import {HasId} from "../../interfaces";
import PopupLargeCustom from "../headlessui/PopupLargeCustom";
import usePopupForm from "../../hooks/usePopupForm";
import PaginationButtons from "./PaginationButtons";

type Props<T> = {
    itemName: string
    columns: TableColumn[]

    data: T[]
    filterPossibleOptions: string[]

    recentlyUpdatedItem: number | null
    setRecentlyUpdatedItem: Dispatch<SetStateAction<number | null>>

    PopupForm: ReactNode
    setPopupFormOpen: Dispatch<SetStateAction<boolean>>
    setPopupFormItem: Dispatch<SetStateAction<T | null>>

    displayRowGenerator: (item: T) => ReactNode

    onDelete: (item: T) => Promise<Response>

    // QUERYING
    sortingAsc: boolean
    setSortingAsc: Dispatch<SetStateAction<boolean>>
    sortingOrderby: string
    setSortingOrderby: Dispatch<SetStateAction<string>>
    sortingTextsearch: string
    setSortingTextsearch: Dispatch<SetStateAction<string>>
    selectedFilterOptions: string[]
    setSelectedFilterOptions: Dispatch<SetStateAction<string[]>>

    totalNumberOfItems: number
    pagenumber: number
    nextPageNavigate: () => void
    previousPageNavigate: () => void
}

export default function TablePage<T extends HasId>({ itemName, columns, data, filterPossibleOptions, recentlyUpdatedItem, setRecentlyUpdatedItem,
                                                       PopupForm, setPopupFormOpen, setPopupFormItem, displayRowGenerator, onDelete, sortingAsc, setSortingAsc, sortingOrderby,
                                                       setSortingOrderby, sortingTextsearch, setSortingTextsearch, selectedFilterOptions, setSelectedFilterOptions, totalNumberOfItems,
                                                       pagenumber, nextPageNavigate, previousPageNavigate }: Props<T>) {

    const numberOfItemsFound = useMemo(() => data.length, [data])

    return (
        <>
            <main className="mx-auto">
                <div className='grid grid-cols-4'>
                    <div className='col-span-3'>
                        <Searchbar sortingTextsearch={sortingTextsearch} setSortingTextsearch={setSortingTextsearch}/>
                    </div>
                    <div className='col-start-5'>
                        <button
                            type='button'
                            onClick={() => {
                                setPopupFormItem(null)
                                setPopupFormOpen(true)
                            }}
                            className='btn-primary'
                        >
                            Add new { itemName }
                        </button>
                    </div>
                </div>

                <div className='mt-7 block leading-6 text-gray-700 mb-3'>
                    <p className='mb-1'>Filter by subjects</p>
                    <SubjectSelector allPossibleLabels={filterPossibleOptions} selectedLabels={selectedFilterOptions} setSelectedLabels={setSelectedFilterOptions} />
                </div>

                <div className="mt-6 mb-3">
                    <TableCustom
                        itemName={itemName}
                        columns={columns}
                        rowData={data}
                        displaySingleRow={displayRowGenerator}

                        recentlyUpdatedItem={recentlyUpdatedItem}
                        setRecentlyUpdatedItem={setRecentlyUpdatedItem}

                        onEdit={(item: T) => {
                            setPopupFormItem(item)
                            setPopupFormOpen(true)
                        }}
                        onDelete={onDelete}

                        sortingAsc={sortingAsc}
                        setSortingAsc={setSortingAsc}
                        sortingOrderby={sortingOrderby}
                        setSortingOrderby={setSortingOrderby}
                    />
                </div>

                <PaginationButtons
                    totalNumberOfItems={totalNumberOfItems}
                    numberOfItemsFound={numberOfItemsFound}
                    pagenumber={pagenumber}
                    nextPage={nextPageNavigate}
                    prevPage={previousPageNavigate}
                />
            </main>

            { PopupForm }
        </>
    );
}