
export default class LocalNotesService implements NotesSericeIface {
    private notes: NoteData[] = [];
    constructor(private readonly key: string) {

    }
    async getUserNotes(): Promise<Notes> {
        let notes = this.notes = JSON.parse(localStorage.getItem(this.key) || '[]');
        notes = notes.sort((a: NoteData, b: NoteData) => {
            return Number(b.time) - Number(a.time);
        });
        return Promise.resolve({ notes });
    }

    async addUserNote(note: NoteData): Promise<NoteData> {
        note = Object.assign({}, note);
        this.notes.push(note);
        localStorage.setItem(this.key, JSON.stringify(this.notes));
        return Promise.resolve(note);
    }

    async updateUserNote(note: NoteData): Promise<NoteData> {
        note = Object.assign({}, note);
        const newNotes = this.notes.map((n: NoteData) => {
            if (n.time === note.time) {
                n.content = note.content;
            }
            return n;
        });
        localStorage.setItem(this.key, JSON.stringify(newNotes));
        return Promise.resolve(note);
    }

    async deleteUserNote(note: NoteData): Promise<Response> {
        note = Object.assign({}, note);
        this.notes = this.notes.filter((n: NoteData) => Number(n.time) !== Number(note.time));
        localStorage.setItem(this.key, JSON.stringify(this.notes));
        return Promise.resolve({} as Response);
    }
}