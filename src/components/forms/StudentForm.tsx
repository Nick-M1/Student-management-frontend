import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import DateSelector from "../shared/DateSelector";
import dateFormatter from "../../utils/time-formatter";
import toast from "react-hot-toast";
import {toastOptionsCustom} from "../../utils/toast-options-custom";
import SubjectSelector from "../headlessui/SubjectSelector";
import getAllPossibleSubjects from "../../DB/getAllPossibleSubjects";
import {DEFAULT_PROFILE_IMAGE} from "../../constants/assets-constants";
import PopupLargeCustom from "../headlessui/PopupLargeCustom";
import {ALL_YEARGROUPS, YeargroupEnum} from "../../constants/yeargroup-enum";
import DropdownCustom from "../headlessui/DropdownCustom";


type Props = {
    open: boolean,
    setClose: () => void,
    itemName: string,
    itemToEdit: Student | null,
    setItemToEdit: (item: Student | null) => void,
    setRecentlyUpdatedItem: (index: number) => void,

    jwtToken: string
}

export default function StudentForm({
   open,
   setClose,
   itemName,
   itemToEdit,
   setItemToEdit,
   setRecentlyUpdatedItem,
   jwtToken
}: Props) {

    const isEdit = itemToEdit != null

    const [studentName, setStudentName] = useState('')
    const [studentEmail, setStudentEmail] = useState( '')
    const [studentDob, setStudentDob] = useState<Date>(new Date())
    const [studentYeargroup, setStudentYeargroup] = useState( YeargroupEnum.YEAR_1 )
    const [studentSubjects, setStudentSubjects] = useState( [] as string[])
    const [studentImage, setStudentImage] = useState( '')

    // Set or reset state, based on what 'studentToEdit' is
    useEffect(() => {
        if (itemToEdit != null) {
            setStudentName(itemToEdit.name)
            setStudentEmail(itemToEdit.email)
            setStudentDob(new Date(itemToEdit.dob))
            setStudentYeargroup(itemToEdit.yeargroup)
            setStudentSubjects(itemToEdit.subjects)
            setStudentImage(itemToEdit.image)
        } else {
            setStudentName('')
            setStudentEmail('')
            setStudentDob(new Date())
            setStudentYeargroup(YeargroupEnum.YEAR_1)
            setStudentSubjects([] as string[])
            setStudentImage('')
        }
    }, [itemToEdit])


    // POST - Add new student to DB
    const postStudent = async () => {
        const studentRequest: StudentRequest = {
            name: studentName,
            email: studentEmail,
            image: studentImage == '' ? DEFAULT_PROFILE_IMAGE : studentImage,
            yeargroup: studentYeargroup.toString().at(-1) || 0,
            dob: dateFormatter(studentDob),
            subjects: studentSubjects
        }

        return fetch(
            'http://localhost:8080/api/v1/student',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify( studentRequest ),

            }
        )
    }

    // PUT - Update info of an already existing student in DB
    const putStudent = async () => {
        const urlSearchParams = new URLSearchParams({
            name: studentName,
            email: studentEmail,
            image: studentImage == '' ? DEFAULT_PROFILE_IMAGE : studentImage,
            yeargroup: studentYeargroup.toString().at(-1) || '0',
            dob: dateFormatter(studentDob),
        });

        studentSubjects.forEach(subject => urlSearchParams.append('subjects', subject))

        return fetch(
            `http://localhost:8080/api/v1/student/${itemToEdit?.id}?${urlSearchParams}`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
            }
        )
    }

    const submitHandler = async () => {
        toast.loading('Uploading student to database...', { ...toastOptionsCustom, id: 'post/put student' } )

        // Run checks
        if (studentName == '' || studentEmail == '') {
            toast.error('Upload failed as some inputs field were left empty', { id: 'post/put student' })
            return
        }

        const response = isEdit ? await putStudent() : await postStudent()
        const responseJson = await response.json()

        if (!response.ok) {
            console.log(responseJson)
            toast.error('Upload failed', { id: 'post/put student' })
            return
        }

        const newStudentId: number = responseJson as number
        toast.success('Uploaded student successfully', { id: 'post/put student' })

        setClose()
        if (setRecentlyUpdatedItem !== null)
            setRecentlyUpdatedItem(newStudentId)

        if (setItemToEdit !== null)
            setItemToEdit(null)

        setTimeout(() => {
            setStudentName('')
            setStudentEmail('')
            setStudentDob(new Date())
            // setStudentYear(getAllPossibleYears()[0])
            setStudentSubjects([] as string[])
            setStudentImage('')
        }, 200)
    }

    return (
        <PopupLargeCustom open={open} setOpen={setClose} title={`${isEdit ? 'Edit' : 'Add new'} ${itemName} 👨🏻‍🎓`}>
            <section className='space-y-5 py-4'>
                <div className="">
                    <div>
                        <h1 className='leading-6 font-medium text-gray-900'>
                            Student's Name
                        </h1>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            className={`mt-1 block w-full input-primary ${true ? '' : 'input-secondary-invalid' }`}
                            placeholder="Jack Smith"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                        />
                    </div>
                </div>
                <div className="">
                    <div>
                        <h1 className='leading-6 font-medium text-gray-900'>
                            Student's Email Address
                        </h1>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            className={`mt-1 block w-full input-primary ${true ? '' : 'input-secondary-invalid' }`}
                            placeholder="jacksmith@gmail.com"
                            value={studentEmail}
                            onChange={(e) => setStudentEmail(e.target.value)}
                        />
                    </div>
                </div>
                <div className=''>
                    <h1 className='leading-6 font-medium text-gray-900 mb-0.5'>
                        Student's Year Group
                    </h1>
                    <DropdownCustom options={ALL_YEARGROUPS} selected={studentYeargroup} setSelected={setStudentYeargroup} displayOption={(option) => typeof option === 'undefined' ? '' : `Year ${option.toString().at(-1)}`}/>
                </div>
                <div className=''>
                    <h1 className='leading-6 font-medium text-gray-900 mb-0.5'>
                        Student's Subjects
                    </h1>
                    <SubjectSelector allPossibleLabels={getAllPossibleSubjects()} selectedLabels={studentSubjects} setSelectedLabels={setStudentSubjects}/>
                </div>
                <div className="">
                    <h1 className='leading-6 font-medium text-gray-900'>
                        Student's Date of Birth
                    </h1>
                    <DateSelector studentDob={studentDob} setStudentDob={setStudentDob}/>
                </div>
                <div className="">
                    <div>
                        <h1 className='leading-6 font-medium text-gray-900'>
                            Student's Profile Image url
                        </h1>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            className={`mt-1 block w-full input-primary ${true ? '' : 'input-secondary-invalid' }`}
                            placeholder="www.example.com/image.png (optional)"
                            value={studentImage}
                            onChange={(e) => setStudentImage(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            <div className="mt-4 flex justify-end gap-x-2">
                <button
                    type="button"
                    className="inline-flex justify-center btn-secondary"
                    onClick={setClose}
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className="inline-flex justify-center btn-primary"
                    onClick={() => submitHandler()}
                >
                    Submit
                </button>
            </div>
        </PopupLargeCustom>
    )
}