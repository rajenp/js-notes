(function() {
    'use strict';

    var IView = ["addNote", "updateNote", "removeNote", "refreshNotes", "showMessage"];

    var NotesController = function() {};

    myLib.Extend(NotesController, myLib.EventTarget, {
        init: function() {
            // Plug the Right Service.
            this._service = LocalNotesService;
            var me = this;

            // Plug the Right View.
            this._view = this.createView();

            //Ensure View has all APIs we need
            myLib.Impls(this._view, IView);

            this._model = [];
            this._listReady = false;
        },
        createView: function() {
            return this._createReactView();
        },
        _createReactView: function() {
            var me = this;
            return React.render(React.createElement(NotesView, {
                notes: [],
                onSave: function(note) {
                    if (note.id) {
                        me.updateNote(note);
                    } else {
                        me.addNote(note);
                    }

                },
                onSearch: function(filter) {
                    me.search(filter);
                },
                onDelete: function(noteId) {
                    me.clearNote(noteId);
                }
            }), myLib.$("view_container"));
        },
        _preProcessResponse: function(response) {
            var error = !response || !response.response || response.error || response.response.error,
                msg = response.error || response.response.error;
            if (!error) {
                return typeof response.response === "string" ? JSON.parse(response.response) : response.response;
            }
            this._view.showMessage("Error: " + (msg || "Something went wrong!"), "error");
        },
        launch: function(prefs) {
            this.init(prefs);
            this.getNotes(); //start getting existing notes
        },
        //Add
        addNote: function(note) {
            if (!note || !note.note) {
                return this._view.showMessage("Please enter note", "error");
            }
            this._view.showMessage("Adding new note...");
            this._service.updateNote(note, new myLib.Callback(this.noteAdded, this));
        },
        noteAdded: function(response) {
            var note = this._preProcessResponse(response);
            if (note) {
                if (!this._listReady) {
                    return this.getNotes();
                }
                this._view.addNote(note);
                this._view.showMessage("note added");
            }
            //this.search({});
        },
        //List
        getNotes: function() {
            this._view.showMessage("Fetching notes...");
            this._service.getNotes(new myLib.Callback(this.notesReceived, this));
        },
        notesReceived: function(response) {
            var notes = this._preProcessResponse(response);
            if (notes) {
                this._model = notes;
                this._view.refreshNotes(notes);
                this._view.showMessage(notes.length + " note" + (notes.length > 1 ? "s" : "") + " found");
                this._listReady = true;
            }
        },
        updateNote: function(note) {
            if (note) {
                //this._view.showMessage("Updating note...");
                this._service.updateNote(note, new myLib.Callback(this.noteUpdated, this));
            }
        },
        noteUpdated: function(response) {
            var note = this._preProcessResponse(response);
            if (note) {
                //this._view.updateNote(note.id, note);
                //this._view.showMessage("note saved");
            }
        },
        //clear
        clearNote: function(noteId) {
            this._service.clearNote(noteId, new myLib.Callback(this.noteCleared, this));
        },
        noteCleared: function(response) {
            var note = this._preProcessResponse(response);
            if (note) {
                this._view.removeNote(note.id);
                this._view.showMessage("note cleared");
            }
        },
        //search
        search: function(props) {
            this._service.search(props, new myLib.Callback(this.notesReceived, this));
        }
    });

    window.NotesController = NotesController;

}());
