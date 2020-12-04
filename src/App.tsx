import React, { useEffect, useState } from 'react';
import './App.css';
import Search from './components/search/Search'
import List from './components/list/List';
import NoteService from './services/NotesService'
import { servicesVersion } from 'typescript';

const API_URL = "https://rajendrapatil-api.herokuapp.com/rajendrapatil";
// const API_URL = "http://localhost:8080/rajendrapatil"

const App: React.FC = () => {

  const initialNotes: NoteData[] = [];
  const [noteState, setNoteState] = useState({ notes: initialNotes, searchQuery: "" });
  const service = new NoteService(API_URL);

  useEffect(() => {
    service.getUserNotes().then(res => {
      repaintNote(res.notes || [])
    });
  }, [noteState.searchQuery]);


  const searchNotes: SearchNotes = (searchQuery) => {
    repaintNote(noteState.notes, searchQuery)
  }

  const addNote: AddNote = (content: string) => {
    service.addUserNote(content).then((newNote) => {
      setNoteState({
        notes: [newNote, ...noteState.notes],
        searchQuery: noteState.searchQuery
      });
    });
  }

  const updateNote: UpdateNote = (updatedNote: NoteData) => {
    service.updateUserNote(updatedNote).then((res) => {
      const notes = noteState.notes.map((note) => {
        let time = note.time;
        let content = note.content;
        if (note.time === updatedNote.time) {
          content = updatedNote.content;
        }
        return { time, content };
      });
      repaintNote(notes)
    });
  }

  const deleteNote: DeleteNote = async (selectedNote: NoteData) => {
    await service.deleteUserNote(selectedNote.time).then((res) => {
      const notes = noteState.notes.filter((note) => note !== selectedNote);
      repaintNote(notes)
    });
  }

  const repaintNote = (notes: NoteData[], searchQuery?: string) => {
    setNoteState({ notes, searchQuery: searchQuery || noteState.searchQuery });
  }

  return (
    <div className="App">
      <header className="App-header">
        <img className="App-logo" alt="logo" src="./logo128.png" />
        <span className="App-name">Just Note</span>
        <Search onSearch={searchNotes} />
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
