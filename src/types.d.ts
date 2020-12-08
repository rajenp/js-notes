interface NoteData {
    time: string,
    content: string
    isBusy?: boolean
}

interface Notes {
    notes: NoteData[]
}

type AddNote = (content: string) => void;
type UpdateNote = (note: NoteData) => void;
type DeleteNote = (note: NoteData) => void;
type SearchNotes = (seachQuery: string) => void;


interface NotesSericeIface {
    async getUserNotes(): Promise<Notes>;

    async addUserNote(note: NoteData): Promise<NoteData>;

    async updateUserNote(note: NoteData): Promise<NoteData>;

    async deleteUserNote(note: NoteData): Promise<Response>;
}