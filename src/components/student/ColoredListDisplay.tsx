import subjectToColour from "../../utils/subject-to-colour";
import {capitalise} from "../../utils/textUtils";

type Props = {
    items: string[]
}

export default function ColoredListDisplay({ items }: Props) {
    return (
        <>
            { items.map(item =>
                <span key={item} className={`px-2 py-1 mr-1 rounded-md ${subjectToColour(item)}`}>{capitalise(item)}</span>
            )}
        </>
    )
}