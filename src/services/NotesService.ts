export default class NotesService {

    private endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    async getUserNotes() {
        return fetch(this.endpoint + "/notes")
            .then(res => res.json())
    }

    async addUserNote(note: NoteData): Promise<NoteData> {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(note)
        };
        return fetch(`${this.endpoint}/notes/add`, requestOptions)
            .then((res) => {
                return note;
            });
    }

    async updateUserNote(note: NoteData) {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(note)
        };
        return fetch(`${this.endpoint}/notes/${note.time}/update`, requestOptions);
    }

    async deleteUserNote(note: NoteData) {
        return fetch(`${this.endpoint}/notes/${note.time}/delete`, { method: "DELETE" });
    }
}