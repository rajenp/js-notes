export default class NotesService {

    private endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    async getUserNotes() {
        return fetch(this.endpoint + "/notes")
            .then(res => res.json())
    }

    async addUserNote(content: string): Promise<NoteData> {
        const newNote = { time: String(Date.now()), content: content };
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newNote)
        };

        return fetch(`${this.endpoint}/notes/add`, requestOptions)
            .then((res) => newNote);
    }

    async updateUserNote(note: NoteData) {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(note)
        };
        return fetch(`${this.endpoint}/notes/${note.time}/update`, requestOptions);
    }

    async deleteUserNote(time: string) {
        return fetch(`${this.endpoint}/notes/${time}/delete`, { method: "delete" });

    }

}