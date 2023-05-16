import {FormEvent} from "react";
import {useNavigate} from "react-router-dom";

type Props = {
    studentId: number
    defaultMarking: Marking | null
}

async function updateMarking(markingId: number, subject: string, score: string) {
    const urlSearchParams = new URLSearchParams({
        subject, score
    });

    return await fetch(
        `http://localhost:8080/api/v1/marking/${markingId}?${urlSearchParams}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
}

async function addNewMarking(subject: string, score: string, studentId: number) {
    const newMarking = {
        subject,
        score,
        student: {
            id: studentId
        }
    }

    return await fetch(
        'http://localhost:8080/api/v1/marking',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMarking),
        }
    )
}

export default function MarkingForm({ studentId, defaultMarking }: Props) {
    const navigate = useNavigate()

    async function addNewMarkingHandler(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const subject: string = e.currentTarget.subject.value?.toLowerCase()
        const score: string = e.currentTarget.score.value

        const response = defaultMarking === null
            ? await addNewMarking(subject, score, studentId)
            : await updateMarking(defaultMarking.id, subject, score)

        if (response.ok)
            navigate(0)
    }

    return (
        <form onSubmit={addNewMarkingHandler} className='space-y-5 py-4'>
            <div>
                <label htmlFor='subject' className='leading-6 font-medium text-gray-900'> Subject </label>
                <input
                    type="text"
                    name="subject"
                    id="subject"
                    className={`mt-1 block w-full input-primary ${true ? '' : 'input-secondary-invalid' }`}
                    placeholder="English"
                    defaultValue={defaultMarking?.subject}
                />
            </div>
            <div>
                <label htmlFor='score' className='leading-6 font-medium text-gray-900'> Score </label>
                <input
                    type="number"
                    step='0.01'
                    name="score"
                    id="score"
                    className={`mt-1 block w-full input-primary ${true ? '' : 'input-secondary-invalid' }`}
                    defaultValue={defaultMarking?.score || 0.00}
                />
            </div>

            <button type='submit' className='btn-primary'>ADD</button>
        </form>
    )
}