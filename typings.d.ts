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

type StudentColumn = {
    header: string
    accessor: string
};

type Marking = {
    id: number,
    subject: string,
    score: number
}

type MarkingResponse = {
    markings: Marking[]
    mean: {
        [key: string]: number
    }
}