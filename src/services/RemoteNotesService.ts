export default class RemoteNotesService implements NotesSericeIface {

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

    async updateUserNote(note: NoteData): Promise<NoteData> {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(note)
        };
        return fetch(`${this.endpoint}/notes/${note.time}/update`, requestOptions).then((res) => note);
    }

    async deleteUserNote(note: NoteData): Promise<Response> {
        return fetch(`${this.endpoint}/notes/${note.time}/delete`, { method: "DELETE" });
    }
}