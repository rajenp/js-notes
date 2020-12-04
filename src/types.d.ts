interface NoteData {
    time: string,
    content: string
}

interface Notes {
    notes: NoteData[]
}

type AddNote = (content: string) => void;
type UpdateNote = (note: NoteData) => void;
type DeleteNote = (note: NoteData) => void;
type SearchNotes = (seachQuery: string) => void;