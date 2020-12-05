import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './App.css';
import Search from './components/search/Search'
import List from './components/list/List';
import NoteService from './services/NotesService'

const { REACT_APP_API_URL } = process.env;
const App: React.FC = () => {

  const initialNotes: NoteData[] = [];
  const [noteState, setNoteState] = useState({ isLoaded: false, notes: initialNotes, searchQuery: "" });

  const service = useMemo(() => new NoteService(REACT_APP_API_URL || ""), []);

  const repaintNote = useCallback((notes: NoteData[], searchQuery?: string) => {
    searchQuery = searchQuery !== undefined ? searchQuery : noteState.searchQuery;
    setNoteState({ notes, searchQuery, isLoaded: true });
  }, [noteState.searchQuery]);

  useEffect(() => {
    if (!noteState.isLoaded) {
      service.getUserNotes().then(res => {
        repaintNote(res.notes || [])
      });
    }
  }, [repaintNote, service, noteState.isLoaded]);


  const searchNotes: SearchNotes = (searchQuery) => {
    repaintNote(noteState.notes, searchQuery)
  }

  const addNote: AddNote = (content: string) => {
    const newNote: NoteData = { time: String(Date.now()), content: content, isBusy: true };
    repaintNote([newNote, ...noteState.notes]);
    service.addUserNote(newNote).then((res) => {
      delete newNote.isBusy;
      repaintNote([newNote, ...noteState.notes], "");
    });
  }

  const updateNote: UpdateNote = (updatedNote: NoteData) => {
    repaintNote(noteState.notes);
    service.updateUserNote(updatedNote).then((res) => {
      const notes = noteState.notes.map((note) => {
        let time = note.time;
        let content = note.content;
        if (note.time === updatedNote.time) {
          content = updatedNote.content;
          return { time, content };
        }
        return { time, content, isBusy: note.isBusy };
      });
      repaintNote(notes)
    });
  }

  const deleteNote: DeleteNote = async (selectedNote: NoteData) => {
    repaintNote(noteState.notes);
    await service.deleteUserNote(selectedNote).then((res) => {
      const notes = noteState.notes.filter((note) => note !== selectedNote);
      repaintNote(notes)
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <img className="App-logo" alt="logo" src="./logo128.png" />
        <span className="App-name">Just Note</span>
        <Search onSearch={searchNotes} searchQuery={noteState.searchQuery} />
        <button className="App-add-button" onClick={() =>
          addNote("")
        }> + </button>
      </header>
      <div className="App-main">
        <List notes={noteState.notes}
          searchQuery={noteState.searchQuery}
          onDelete={deleteNote}
          onChange={updateNote} />
      </div>
      <div className="App-footer">
        Simple Notes management app by Rajendra Patil
      </div>
    </div>
  );
}

export default App;
