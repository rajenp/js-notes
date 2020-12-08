const LS_KEY = "just_note_notes";

export default class LocalNotesService implements NotesSericeIface {
    private notes: NoteData[] = [];
    async getUserNotes(): Promise<Notes> {
        const notes = this.notes = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
        return Promise.resolve({ notes: [...notes] });
    }

    async addUserNote(note: NoteData): Promise<NoteData> {
        note = Object.assign({}, note);
        this.notes.push(note);
        localStorage.setItem(LS_KEY, JSON.stringify(this.notes));
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
        localStorage.setItem(LS_KEY, JSON.stringify(newNotes));
        return Promise.resolve(note);
    }

    async deleteUserNote(note: NoteData): Promise<Response> {
        note = Object.assign({}, note);
        const newNotes = this.notes.filter((n: NoteData) => n.time !== note.time);
        localStorage.setItem(LS_KEY, JSON.stringify(newNotes));
        return Promise.resolve({} as Response);
    }
}