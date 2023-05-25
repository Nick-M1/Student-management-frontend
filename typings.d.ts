type Student = {
    id: number,
    name: string,
    email: string,
    image: string,
    dob: string,
    age: number
    subjects: string[]
    // year: string
};

type StudentRequest = {
    name: string,
    email: string,
    image: string,
    dob: string,
    subjects: string[]
    // year: string
};

type TableColumn = {
    header: string
    accessor: string
};

type Marking = {
    id: number,
    course: Course,
    score: number
}

type MarkingResponse = {
    markings: Marking[]
    mean: {
        [key: string]: number
    }
}

type Course = {
    id: number
    code: string
    title: string
}