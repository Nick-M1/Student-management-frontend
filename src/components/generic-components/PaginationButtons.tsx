type Props = {
    numberOfElements: number
    offset: number
    totalElements: number

    first: boolean
    last: boolean
    nextPage: () => void
    prevPage: () => void
}

export default function PaginationButtons({ numberOfElements, offset, totalElements, first, last, nextPage, prevPage }: Props) {
    return (
        <div className='flex space-x-2'>
            <p>
                Showing <b>{ totalElements === 0 ? 0 : offset + 1 }</b> to <b>{ offset + numberOfElements }</b> of { totalElements } results
            </p>
            <div className='flex-grow'/>

            <button onClick={prevPage} disabled={first} className={`btn-secondary text-sm ${first && 'cursor-not-allowed'}`}>
                Previous
            </button>

            <button onClick={nextPage} disabled={last} className={`btn-secondary text-sm ${last && 'cursor-not-allowed'}`}>
                Next
            </button>
        </div>
    )
}