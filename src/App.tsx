import React, { useState } from 'react';
import './App.css';
import Search from './components/search/Search'
import List from './components/list/List';

const App: React.FC = () => {
  const t = Date.now();
  const initialNotes = [
    {
      time: t,
      content: "Note one"
    },
    {
      time: t + 1,
      content: "Note 2"
    },
    {
      time: t + 2,
      content: "Note 3"
    },
    {
      time: t + 3,
      content: "Note 4"
    }
  ];

  const [noteState, setNoteState] = useState({ notes: initialNotes, searchQuery: "" });

  const deleteNote: DeleteNote = (selectedNote: NoteData) => {
    const notes = noteState.notes.filter((note) => note !== selectedNote);
    setNoteState({ notes, searchQuery: noteState.searchQuery });
  }

  const searchNotes: SearchNotes = (searchQuery) => {
    setNoteState({ notes: noteState.notes, searchQuery: searchQuery });
  }

  const updateNote: UpdateNote = (updatedNote: NoteData) => {
    const notes = noteState.notes.map((note) => {
      let time = note.time;
      let content = note.content;
      if (note.time === updatedNote.time) {
        content = updatedNote.content;
        time = Date.now();
      }
      return { time, content };
    });

    setNoteState({ notes: notes, searchQuery: noteState.searchQuery });
  }
  const addNote: AddNote = (content: string) => {
    const newNote = { time: Date.now(), content: content };
    setNoteState({
      notes: [newNote, ...noteState.notes],
      searchQuery: noteState.searchQuery
    });

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
