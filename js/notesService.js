(function() {
    'use strict';
    /* Service Interface to be implemented by a Service */
    var IService = ["getNotes", "clearNote", "updateNote", "search"];

    var LocalNotesService = {
        _storage: (function() {
            var storage = {
                    notes: {}
                },
                notes,
                serialize = false;
            if ('localStorage' in window && window['localStorage'] !== null) {
                storage = window['localStorage'];
                notes = storage.notes;
                if (!notes) {
                    storage.notes = "{}";
                }
                serialize = true;
            }
            return {
                get: function(key) {
                    var data = storage[key];
                    if (data && serialize) {
                        data = JSON.parse(data);
                    }
                    return data;
                },
                set: function(key, value) {
                    if (!serialize) { //For JS memory storage we, don't need to do this
                        return;
                    }
                    storage[key] = serialize && typeof value !== "string" ? JSON.stringify(value) : value;
                }
            };
        })(),
        _callback: function(cb, resp) {
            resp = {
                response: resp
            };
            cb(resp);
        },
        getNotes: function(callback) {
            var notes = [],
                snotes = this._storage.get("notes");
            for (var key in snotes) {
                notes.push(snotes[key]);
            }
            this._callback(callback, notes);
        },
        updateNote: function(note, callback) {
            var notes = this._storage.get("notes");
            note.id = note.id || new Date().getTime();
            notes[note.id] = note;
            this._storage.set("notes", notes);
            this._callback(callback, note);
        },
        clearNote: function(noteId, callback) {
            var notes = this._storage.get("notes");
            var note = notes[noteId];
            if (note) {
                delete notes[noteId];
                this._storage.set("notes", notes);
                this._callback(callback, note);
            }
        },
        search: function(text, callback) {
            var notes = [],
                note,
                allnotes = this._storage.get("notes");
            for (var key in allnotes) {
                note = allnotes[key];
                if (note && note.note.match(new RegExp(text, "ig"))) {
                    notes.push(note);
                }
            }
            this._callback(callback, notes);
        }
    };
    myLib.Impls(LocalNotesService, IService);

    window.LocalNotesService = LocalNotesService;

}());
