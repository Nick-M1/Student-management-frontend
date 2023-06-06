type Student = {
    id: number,
    name: string,
    email: string,
    image: string,
    dob: string,
    age: number
    yeargroup: import('src/constants/yeargroup-enum').YeargroupEnum
    subjects: string[]
};

type StudentRequest = {
    name: string,
    email: string,
    image: string,
    dob: string,
    yeargroup: number | string
    subjects: string[]
};

type TableColumn = {
    header: string
    accessor: string
};

type Marking = {
    id: number,
    course: Course,
    title: string,
    score: number
}

type MarkingStatistics = [string, number][]

type Course = {
    id: number
    code: string
    title: string
    department: string
}

type Pageable<T> = {
    content: T[]
    first: boolean
    last: boolean

    number: number
    numberOfElements: number

    pageable: {
        offset: number
        pageNumber: number
    }

    totalElements: number
    totalPages: number
}