(function() {
    'use strict';

    var Note = React.createClass({

        displayName: "Note",

        render: function() {
            var note = this.props.note,
            isNew = !note.id,
            cls = 'fa fa-times-circle',
            noteCls = isNew ? ['note', 'new_note'] : ['note'],
            time = note.id ? new Date(note.id).toLocaleString() : '',
            fn = isNew ? this.props.onCancel : this.onDelete;

            note.id = note.id || "";
            note.active ? noteCls.push('active') : null;
            return (
                 <div id={note.id + "_p"} className={noteCls.join(' ')} onFocus={this.activate.bind(this, true)} onBlur={this.activate.bind(this, false)}>
                    <div className="shadow">
                        <div className="note_controls">
                            <span className="time">{time}</span>
                            <a className="button delete" onClick={fn.bind(this, note.id)} href="javascript:void(0)"><i className={cls}></i></a>
                        </div>
                        <div id={note.id + "_data"} className="note_data" contentEditable={true} spellCheck={false}
                        dangerouslySetInnerHTML={{__html: note.note}}/>
                    </div>
                    <div>&nbsp;</div>
                </div>
            );
            // <a className="button" onClick={this.onSave.bind(this, note.id)}  href="javascript:void(0)"><i className="fa fa-check-circle-o"></i></a>
        },
        activate: function (activate) {
            var node = myLib.$(this.props.note.id + "_p"),
            that = this;
            if (activate) {
                node.className += ' active';
            } else {
                node.className = node.className.replace('active','');
                //auto save on blur?
                var noteId = this.props.note.id;
                node = myLib.$(noteId + "_data");
                if (!node || !node.innerHTML) {
                    this.props.onCancel();
                } else {
                    that.props.onSave({id: noteId, note: node.innerHTML});
                }
            }
        },
        onSave: function (noteId) {
            this.props.onSave({id: noteId, note: myLib.$(noteId+"_data").innerHTML});
        },
        onDelete: function (noteId) {
            this.props.onDelete(noteId);
        },
        componentDidMount: function () {
            if (!this.props.note.id)  {
                var node = myLib.$(this.props.note.id + "_data");
                node.focus();
            }
        }

    });

    var NoteFilter = React.createClass({

        displayName: "noteFilter",

        render: function() {
            return (
                 <div id="searchbar">
                    <i id="search_icon" className="fa fa-search"></i>
                    <input id="searchfor" type="text" placeholder="search for notes" onKeyUp={this.onKeyUp}/>
                </div>
            );
        },
        onKeyUp: function(evt) {
            var me = this;
            var target = evt.target || evt.srcElement;
            clearTimeout(this._timeout);
            this._timeout = setTimeout(function(){
                me.props.onSearch && me.props.onSearch(target.value);
            }, 200);
        },
        componentWillUnmount: function() {
            clearTimeout(this._timeout);
        }

    });

    var NotesList = React.createClass({

        displayName: "NotesList",

        _onClick: function(evt) {
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

        render: function() {
            var that = this,
            cls = this.props.notes.length > 1 ? '' : 'with_single_item';

            return (
                <div id="notes_list" className={cls}>
                    {this.props.notes.map(function(note){
                      return <Note key={note.id}
                            note={note}
                            onCancel={that.props.onCancel}
                            onDelete={that.props.onDelete}
                            onSave={that.props.onSave}/>
                    })}
                </div>
            );
        }
    });

    var NotesView = React.createClass({

        displayName: "NotesView",

        getInitialState: function() {
            return {
                notes: []
            }
        },
        showNote: function(evt) {
            var newState = React.addons.update(this.state, {
                notes: {
                    $splice: [[0, 0, {active: true}]]
                }
            });
            this.setState(newState);
            this.showAddButton(false);
            this.showMessage("Add new note");
        },
        render: function() {
            return (
                <div id="main_view">
                    <a href="javascript:void(0)" id="add_note_btn" onClick={this.showNote}><i className="fa fa-pencil"></i></a>
                    <NoteFilter onSearch={this.props.onSearch}/>
                    <div id='msg'>Loading...</div>
                    <NotesList
                        notes={this.state.notes}
                        onCancel={this.onCancel}
                        onDelete={this.props.onDelete}
                        onSave={this.props.onSave}/>
                </div>
            );

        },
        onCancel: function(evt) {
            var pendingSave = this.state.notes[0];
            if(pendingSave && !pendingSave.id) {
                var newState = React.addons.update(this.state, {
                    notes: {
                        $splice: [[0, 1]]
                    }
                });
                this.setState(newState);
            }
            this.showAddButton(true);
        },
        showMessage: function(msg, style) {
            var div = myLib.$("msg");
            if (div) {
                clearTimeout(this._timeout);
                div.className = style || "info";
                div.innerHTML = msg || ""; //Escape
                this._timeout = setTimeout(function() {
                    div.className = "hide";
                }, 2000); //2 seconds delay
            }
        },
        showFilter: function(show) {
            var div = myLib.$("filter");
            if (div) {
                div.className = show ? "filter" : "hide";
            }
        },
        findIndexById: function(noteId) {
            var notes = this.state.notes || [];
            for (var idx = 0, len = notes.length; idx < len; idx++) {
                if (notes[idx].id == noteId) {
                    return idx;
                }
            }
            return -1;
        },
        refreshNotes: function(notes) {
            var newState = React.addons.update(this.state, {
                notes: {
                    $set: notes
                }
            });
            this.setState(newState);
        },
        addNote: function(note) {
            this.showAddButton(true);
            if (!note || !note.id) return;
            var newState = React.addons.update(this.state, {
                notes: {
                    $splice: [[0, 1, note]]
                }
            });
            this.setState(newState);

        },
        removeNote: function(noteId) {
            var index = this.findIndexById(noteId);
            if (index > -1) {
                var newState = React.addons.update(this.state, {
                    notes: {
                        $splice: [
                            [index, 1]
                        ]
                    }
                });
                this.setState(newState);
            }
        },
        updateNote: function(noteId, note) {
            var index = this.findIndexById(noteId);
            if (index > -1) {
                var newState = React.addons.update(this.state, {
                    notes: {
                        [index]: {
                            $apply: function(aNote) {
                                aNote = note;
                                return aNote;
                            }
                        }
                    }
                });
                this.setState(newState);
            }
        },
        showAddButton: function (show) {
            if(show) {
                myLib.$("add_note_btn").style.display = "";
                myLib.$("searchbar").style.display = "";
            } else {
                myLib.$("add_note_btn").style.display = "none";
                myLib.$("searchbar").style.display = "none";
            }
        }
    });

    window.NotesView = NotesView;

}());
