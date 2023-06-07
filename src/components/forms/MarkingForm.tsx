import React, {FormEvent, useEffect, useState} from "react";
import postMarking from "../../DB/markings/postMarking";
import putMarking from "../../DB/markings/putMarking";
import PopupLargeCustom from "../headlessui/PopupLargeCustom";
import getAllCourses from "../../DB/courses/getAllCourses";
import DropdownCustom from "../headlessui/DropdownCustom";
import {capitalise} from "../../utils/textUtils";


type Props = {
    open: boolean,
    setClose: () => void,
    itemName: string,
    itemToEdit: Marking | null,
    setItemToEdit: (item: Marking | null) => void,
    setRecentlyUpdatedItem: (index: number) => void,

    jwtToken: string
    studentId: number
}

export default function MarkingForm({
    open,
    setClose,
    itemName,
    itemToEdit,
    setItemToEdit,
    setRecentlyUpdatedItem,
    jwtToken,
    studentId,
}: Props) {

    const [courses, setCourses] = useState<Course[]>([])
    const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(undefined)
    useEffect(() => {
        getAllCourses(jwtToken).then(courses => {
            setCourses(courses)
        })
    },[])

    const isEdit = itemToEdit != null

    async function markingFormHandler(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!isEdit && typeof selectedCourse === 'undefined')
            return

        const title: string = e.currentTarget.title_input.value
        const score: string = e.currentTarget.score_input.value

        const response = isEdit
            ? await putMarking(jwtToken, itemToEdit.id, title, score)
            : await postMarking(jwtToken, selectedCourse!.id, title, score, studentId)


        if (response.ok) {
            const jsonResponse = await response.json()

            setItemToEdit(null)
            setRecentlyUpdatedItem(isEdit ? jsonResponse.id : jsonResponse)
            setClose()
        }
    }


    return (
        <PopupLargeCustom open={open} setOpen={setClose} title={`${isEdit ? 'Edit' : 'Add new'} ${itemName} 👨🏻‍🎓`}>
            <form onSubmit={markingFormHandler} className='space-y-5 py-4'>
                { !isEdit && (
                    <div>
                        <h3 className='leading-6 font-medium text-gray-900'> Course </h3>
                        <DropdownCustom
                            options={courses}
                            selected={selectedCourse}
                            setSelected={setSelectedCourse}
                            displayOption={(option) =>
                                typeof option === 'undefined' ? '------' : `${option?.code}: ${capitalise(option?.title)}`
                            }
                        />
                    </div>
                )}
                <div>
                    <label htmlFor='title_input' className='leading-6 font-medium text-gray-900'> Title </label>
                    <input
                        type="text"
                        name="title_input"
                        id="title_input"
                        className={`mt-1 block w-full input-primary ${true ? '' : 'input-secondary-invalid' }`}
                        defaultValue={itemToEdit?.title}
                    />
                </div>

                <div>
                    <label htmlFor='score_input' className='leading-6 font-medium text-gray-900'> Score </label>
                    <input
                        type="number"
                        step='0.01'
                        name="score_input"
                        id="score_input"
                        className={`mt-1 block w-full input-primary ${true ? '' : 'input-secondary-invalid' }`}
                        defaultValue={itemToEdit?.score || 0.00}
                    />
                </div>

                <button type='submit' className='btn-primary'>ADD</button>
            </form>
        </PopupLargeCustom>
    )
}