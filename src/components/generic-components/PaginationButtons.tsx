import {NUMBER_OF_ITEMS_PER_PAGE} from "../../constants/table-constants";
import {useMemo} from "react";

type Props = {
    totalNumberOfItems: number
    numberOfItemsFound: number

    pagenumber: number
    nextPage: () => void
    prevPage: () => void
}

export default function PaginationButtons({ totalNumberOfItems, numberOfItemsFound, pagenumber, nextPage, prevPage }: Props) {
    const firstItemIndexOnPage = useMemo(() => pagenumber * NUMBER_OF_ITEMS_PER_PAGE, [pagenumber])
    const lastItemIndexOnPage = useMemo(() => firstItemIndexOnPage + numberOfItemsFound, [firstItemIndexOnPage, numberOfItemsFound])

    const disablePrevPageNav = firstItemIndexOnPage === 0
    const disableNextPageNav = lastItemIndexOnPage === totalNumberOfItems

    return (
        <div className='flex space-x-2'>
            <p>
                Showing <b>{ firstItemIndexOnPage + 1 }</b> to <b>{ lastItemIndexOnPage }</b> of { totalNumberOfItems } results
            </p>
            <div className='flex-grow'/>

            <button onClick={prevPage} disabled={disablePrevPageNav} className={`btn-secondary text-sm ${disablePrevPageNav && 'cursor-not-allowed'}`}>
                Previous
            </button>

            <button onClick={nextPage} disabled={disableNextPageNav} className={`btn-secondary text-sm ${disableNextPageNav && 'cursor-not-allowed'}`}>
                Next
            </button>
        </div>
    )
}