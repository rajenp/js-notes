'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function () {
    'use strict';

    var Note = React.createClass({

        displayName: "Note",

        render: function render() {
            var note = this.props.note,
                isNew = !note.id,
                cls = 'fa fa-times-circle',
                noteCls = isNew ? ['note', 'new_note'] : ['note'],
                time = note.id ? new Date(note.id).toLocaleString() : '',
                fn = isNew ? this.props.onCancel : this.onDelete;

            note.id = note.id || "";
            note.active ? noteCls.push('active') : null;
            return React.createElement(
                'div',
                { id: note.id + "_p", className: noteCls.join(' '), onFocus: this.activate.bind(this, true), onBlur: this.activate.bind(this, false) },
                React.createElement(
                    'div',
                    { className: 'shadow' },
                    React.createElement(
                        'div',
                        { className: 'note_controls' },
                        React.createElement(
                            'span',
                            { className: 'time' },
                            time
                        ),
                        React.createElement(
                            'a',
                            { className: 'button delete', onClick: fn.bind(this, note.id), href: 'javascript:void(0)' },
                            React.createElement('i', { className: cls })
                        )
                    ),
                    React.createElement('div', { id: note.id + "_data", className: 'note_data', contentEditable: true, spellCheck: false,
                        dangerouslySetInnerHTML: { __html: note.note } })
                ),
                React.createElement(
                    'div',
                    null,
                    ' '
                )
            );
            // <a className="button" onClick={this.onSave.bind(this, note.id)}  href="javascript:void(0)"><i className="fa fa-check-circle-o"></i></a>
        },
        activate: function activate(_activate) {
            var node = myLib.$(this.props.note.id + "_p"),
                that = this;
            if (_activate) {
                node.className += ' active';
            } else {
                node.className = node.className.replace('active', '');
                //auto save on blur?
                var noteId = this.props.note.id;
                node = myLib.$(noteId + "_data");
                if (!node || !node.innerHTML) {
                    this.props.onCancel();
                } else {
                    that.props.onSave({ id: noteId, note: node.innerHTML });
                }
            }
        },
        onSave: function onSave(noteId) {
            this.props.onSave({ id: noteId, note: myLib.$(noteId + "_data").innerHTML });
        },
        onDelete: function onDelete(noteId) {
            this.props.onDelete(noteId);
        },
        componentDidMount: function componentDidMount() {
            if (!this.props.note.id) {
                var node = myLib.$(this.props.note.id + "_data");
                node.focus();
            }
        }

    });

    var NoteFilter = React.createClass({

        displayName: "noteFilter",

        render: function render() {
            return React.createElement(
                'div',
                { id: 'searchbar' },
                React.createElement('i', { id: 'search_icon', className: 'fa fa-search' }),
                React.createElement('input', { id: 'searchfor', type: 'text', placeholder: 'search for notes', onKeyUp: this.onKeyUp })
            );
        },
        onKeyUp: function onKeyUp(evt) {
            var me = this;
            var target = evt.target || evt.srcElement;
            clearTimeout(this._timeout);
            this._timeout = setTimeout(function () {
                me.props.onSearch && me.props.onSearch(target.value);
            }, 200);
        },
        componentWillUnmount: function componentWillUnmount() {
            clearTimeout(this._timeout);
        }

    });

    var NotesList = React.createClass({

        displayName: "NotesList",

        _onClick: function _onClick(evt) {
            var target = evt.target || evt.srcElement;
            if (target.id && target.className.indexOf("checkbox") >= 0) {
                var noteId = target.id,
                    checked = target.className.indexOf("checked") >= 0;
                this.props.onnoteChange && this.props.onnoteChange({
                    noteId: noteId,
                    complete: !checked
                });
            } else if (target.id && target.id.indexOf("_delete") > 0) {
                var noteId = target.id.split("_")[0];
                this.props.onNoteDelete && this.props.onNoteDelete(noteId);
            }
        },

        render: function render() {
            var that = this,
                cls = this.props.notes.length > 1 ? '' : 'with_single_item';

            return React.createElement(
                'div',
                { id: 'notes_list', className: cls },
                this.props.notes.map(function (note) {
                    return React.createElement(Note, { key: note.id,
                        note: note,
                        onCancel: that.props.onCancel,
                        onDelete: that.props.onDelete,
                        onSave: that.props.onSave });
                })
            );
        }
    });

    var NotesView = React.createClass({

        displayName: "NotesView",

        getInitialState: function getInitialState() {
            return {
                notes: []
            };
        },
        showNote: function showNote(evt) {
            var newState = React.addons.update(this.state, {
                notes: {
                    $splice: [[0, 0, { active: true }]]
                }
            });
            this.setState(newState);
            this.showAddButton(false);
            this.showMessage("Add new note");
        },
        render: function render() {
            return React.createElement(
                'div',
                { id: 'main_view' },
                React.createElement(
                    'a',
                    { href: 'javascript:void(0)', id: 'add_note_btn', onClick: this.showNote },
                    React.createElement('i', { className: 'fa fa-pencil' })
                ),
                React.createElement(NoteFilter, { onSearch: this.props.onSearch }),
                React.createElement(
                    'div',
                    { id: 'msg' },
                    'Loading...'
                ),
                React.createElement(NotesList, {
                    notes: this.state.notes,
                    onCancel: this.onCancel,
                    onDelete: this.props.onDelete,
                    onSave: this.props.onSave })
            );
        },
        onCancel: function onCancel(evt) {
            var pendingSave = this.state.notes[0];
            if (pendingSave && !pendingSave.id) {
                var newState = React.addons.update(this.state, {
                    notes: {
                        $splice: [[0, 1]]
                    }
                });
                this.setState(newState);
            }
            this.showAddButton(true);
        },
        showMessage: function showMessage(msg, style) {
            var div = myLib.$("msg");
            if (div) {
                clearTimeout(this._timeout);
                div.className = style || "info";
                div.innerHTML = msg || ""; //Escape
                this._timeout = setTimeout(function () {
                    div.className = "hide";
                }, 2000); //2 seconds delay
            }
        },
        showFilter: function showFilter(show) {
            var div = myLib.$("filter");
            if (div) {
                div.className = show ? "filter" : "hide";
            }
        },
        findIndexById: function findIndexById(noteId) {
            var notes = this.state.notes || [];
            for (var idx = 0, len = notes.length; idx < len; idx++) {
                if (notes[idx].id == noteId) {
                    return idx;
                }
            }
            return -1;
        },
        refreshNotes: function refreshNotes(notes) {
            var newState = React.addons.update(this.state, {
                notes: {
                    $set: notes
                }
            });
            this.setState(newState);
        },
        addNote: function addNote(note) {
            this.showAddButton(true);
            if (!note || !note.id) return;
            var newState = React.addons.update(this.state, {
                notes: {
                    $splice: [[0, 1, note]]
                }
            });
            this.setState(newState);
        },
        removeNote: function removeNote(noteId) {
            var index = this.findIndexById(noteId);
            if (index > -1) {
                var newState = React.addons.update(this.state, {
                    notes: {
                        $splice: [[index, 1]]
                    }
                });
                this.setState(newState);
            }
        },
        updateNote: function updateNote(noteId, note) {
            var index = this.findIndexById(noteId);
            if (index > -1) {
                var newState = React.addons.update(this.state, {
                    notes: _defineProperty({}, index, {
                        $apply: function $apply(aNote) {
                            aNote = note;
                            return aNote;
                        }
                    })
                });
                this.setState(newState);
            }
        },
        showAddButton: function showAddButton(show) {
            if (show) {
                myLib.$("add_note_btn").style.display = "";
                myLib.$("searchbar").style.display = "";
            } else {
                myLib.$("add_note_btn").style.display = "none";
                myLib.$("searchbar").style.display = "none";
            }
        }
    });

    window.NotesView = NotesView;
})();

