import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './App.css';
import Search from './components/search/Search'
import List from './components/list/List';
import RemoteNoteService from './services/RemoteNotesService'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import LocalNotesService from './services/LocalNotesService';

const { REACT_APP_API_URL, REACT_APP_CLIENT_ID } = process.env;
const LS_KEY = 'just_note_user_id';

const createRemoteService = (userId: string): NotesSericeIface => {
  return new RemoteNoteService((REACT_APP_API_URL || "") + "/" + userId)
}
const App: React.FC = () => {

  const initialNotes: NoteData[] = [];
  const [noteState, setNoteState] = useState({ isLoaded: false, notes: initialNotes, searchQuery: "", userId: localStorage.getItem(LS_KEY) });

  let service: NotesSericeIface = useMemo(() => {
    if (noteState.userId) {
      return createRemoteService(noteState.userId);
    } else {
      return new LocalNotesService();
    }
  }, [noteState.userId]);

  const repaintNote = useCallback((notes: NoteData[], searchQuery?: string, userId?: string) => {
    searchQuery = searchQuery !== undefined ? searchQuery : noteState.searchQuery;
    setNoteState({ notes, searchQuery, isLoaded: true, userId: userId === undefined ? noteState.userId : userId });
  }, [noteState.searchQuery, noteState.userId]);

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
    //repaintNote([newNote, ...noteState.notes]);
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
      repaintNote(notes);
    });
  }

  const syncNotes = (newService: NotesSericeIface, userId = '') => {
    service.getUserNotes().then(async (res) => {

      for (const note of res?.notes ?? []) {
        await newService.addUserNote(note);
      }

      service = newService;
      service.getUserNotes().then(res => {
        repaintNote(res?.notes ?? [], noteState.searchQuery, userId);
      });
    });
  }

  const loginSuccess = (res: any) => {
    const userId = res.profileObj.email;
    localStorage.setItem(LS_KEY, userId);
    syncNotes(createRemoteService(userId), userId);
  }

  const logoutSuccess = () => {
    syncNotes(new LocalNotesService());
    localStorage.removeItem(LS_KEY);
  }

  let googleLogin: any;
  let clientKey = REACT_APP_CLIENT_ID || '';
  if (!noteState.userId || noteState.userId.length === 0) {
    googleLogin =
      <GoogleLogin
        className="Google-login"
        buttonText={`Login`}
        clientId={clientKey}
        onSuccess={loginSuccess}
        isSignedIn={true}
      />
  } else {
    googleLogin =
      <GoogleLogout
        className="Google-logout"
        clientId={clientKey}
        buttonText={`Logout | ${noteState.userId}`}
        onLogoutSuccess={logoutSuccess}
      />
  }
  const appClass = `App ${noteState.userId ? 'logged-in' : ''}`
  return (
    <div className={appClass}>
      <header className="App-header">
        <div className="App-logo-name">
          <img className="App-logo" alt="logo" src="./logo128.png" />
          <span className="App-name">Just Note</span>
        </div>
        <Search onSearch={searchNotes} searchQuery={noteState.searchQuery} />
      </header>
      <div className="App-login">
        <div>{googleLogin} {!noteState.userId && ' to save remotely.'} </div>
        <button aria-label="Add new note" title="Add new note"
          className="App-add-button" onClick={() =>
            addNote("")
          }> + </button>
      </div>
      <div className="App-main">
        <List notes={noteState.notes}
          searchQuery={noteState.searchQuery}
          onDelete={deleteNote}
          onChange={updateNote} />
      </div>
      <div className="App-footer">
        &copy; {new Date().getFullYear()} | Just Note App by <a target="blank" href="https://www.linkedin.com/in/rajendrapatil/">Rajendra Patil</a>
      </div>
    </div>
  );
}

export default App;
