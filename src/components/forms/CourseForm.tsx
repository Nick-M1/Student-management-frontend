import React, {Dispatch, FormEvent, SetStateAction, useEffect, useState} from "react";
import DateSelector from "../shared/DateSelector";
import dateFormatter from "../../utils/time-formatter";
import toast from "react-hot-toast";
import {toastOptionsCustom} from "../../utils/toast-options-custom";
import SubjectSelector from "../headlessui/SubjectSelector";
import getAllPossibleSubjects from "../../DB/getAllPossibleSubjects";
import {DEFAULT_PROFILE_IMAGE} from "../../constants/assets-constants";
import PopupLargeCustom from "../headlessui/PopupLargeCustom";
import postMarking from "../../DB/postMarking";
import putMarking from "../../DB/putMarking";
import postCourse from "../../DB/postCourse";
import putCourse from "../../DB/putCourse";
import DropdownCustom from "../headlessui/DropdownCustom";
import {ALL_YEARGROUPS} from "../../constants/yeargroup-enum";
import {capitalise} from "../../utils/textUtils";

type Props = {
    open: boolean,
    setClose: () => void,
    itemName: string,
    itemToEdit: Course | null,
    setItemToEdit: (item: Course | null) => void,
    setRecentlyUpdatedItem: (index: number) => void,
}

export default function CourseForm({
    open,
    setClose,
    itemName,
    itemToEdit,
    setItemToEdit,
    setRecentlyUpdatedItem
}: Props) {

    const isEdit = itemToEdit != null
    const [selectedDepartment, setSelectedDepartment] = useState<string>(getAllPossibleSubjects()[0])

    async function courseFormHandler(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const code: string = e.currentTarget.code_input.value
        const title: string = e.currentTarget.title_input.value

        const response = isEdit
            ? await putCourse(itemToEdit.id, code, title, selectedDepartment)
            : await postCourse(code, title, selectedDepartment)


        if (response.ok) {
            const jsonResponse = await response.json()

            setItemToEdit(null)
            setRecentlyUpdatedItem(isEdit ? jsonResponse.id : jsonResponse)
            setClose()
        }
    }

    return (
        <PopupLargeCustom open={open} setOpen={setClose} title={`${isEdit ? 'Edit' : 'Add new'} ${itemName} 👨🏻‍🎓`}>
            <form onSubmit={courseFormHandler} className='space-y-5 py-4'>
                <div className=''>
                    <label htmlFor='department_input' className='leading-6 font-medium text-gray-900'> Department </label>
                    <DropdownCustom options={getAllPossibleSubjects()} selected={selectedDepartment} setSelected={setSelectedDepartment} displayOption={(option) => typeof option === 'undefined' ? '' : capitalise(option)}/>
                </div>
                <div>
                    <label htmlFor='code_input' className='leading-6 font-medium text-gray-900'> Code </label>
                    <input
                        type="text"
                        name="code_input"
                        id="code_input"
                        className={`mt-1 block w-full input-primary ${true ? '' : 'input-secondary-invalid' }`}
                        placeholder="English"
                        defaultValue={itemToEdit?.code}
                    />
                </div>
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


                <button type='submit' className='btn-primary'>ADD</button>
            </form>
        </PopupLargeCustom>
    )
}