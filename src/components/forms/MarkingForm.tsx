import {FormEvent, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import postMarking from "../../DB/postMarking";
import putMarking from "../../DB/putMarking";
import putCourse from "../../DB/putCourse";
import postCourse from "../../DB/postCourse";
import PopupLargeCustom from "../headlessui/PopupLargeCustom";
import getAllCourses from "../../DB/getAllCourses";
import DropdownCustom from "../headlessui/DropdownCustom";
import {capitalise} from "../../utils/textUtils";


type Props = {
    open: boolean,
    setClose: () => void,
    itemName: string,
    itemToEdit: Marking | null,
    setItemToEdit: (item: Marking | null) => void,
    setRecentlyUpdatedItem: (index: number) => void,

    studentId: number
}

export default function MarkingForm({
   open,
   setClose,
   itemName,
   itemToEdit,
   setItemToEdit,
   setRecentlyUpdatedItem,
   studentId
}: Props) {

    const [courses, setCourses] = useState<Course[]>([])
    const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(undefined)
    useEffect(() => {
        getAllCourses().then(courses => {
            setCourses(courses)
        })
    },[])

    const isEdit = itemToEdit != null

    async function markingFormHandler(e: FormEvent<HTMLFormElement>) {
        console.log(selectedCourse)

        e.preventDefault()
        if (!isEdit && typeof selectedCourse === 'undefined')
            return

        const score: string = e.currentTarget.score.value

        const response = isEdit
            ? await putMarking(itemToEdit.id, score)           //todo: dont modify marking's course
            : await postMarking(selectedCourse!.id, score, studentId)


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
                { !isEdit && <div>
                    <h3 className='leading-6 font-medium text-gray-900'> Course </h3>
                    <DropdownCustom
                        options={courses}
                        selected={selectedCourse}
                        setSelected={setSelectedCourse}
                        displayOption={(option) =>
                            typeof option === 'undefined' ? '------' : `${option?.code}: ${capitalise(option?.title)}`
                        }
                    />
                </div>}
                <div>
                    <label htmlFor='score' className='leading-6 font-medium text-gray-900'> Score </label>
                    <input
                        type="number"
                        step='0.01'
                        name="score"
                        id="score"
                        className={`mt-1 block w-full input-primary ${true ? '' : 'input-secondary-invalid' }`}
                        defaultValue={itemToEdit?.score || 0.00}
                    />
                </div>

                <button type='submit' className='btn-primary'>ADD</button>
            </form>
        </PopupLargeCustom>
    )
}