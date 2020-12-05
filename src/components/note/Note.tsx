import React from 'react'
import './Note.css'
import { CSSTransition } from 'react-transition-group';

interface NoteProps {
    note: NoteData
    onDelete: DeleteNote,
    onChange: UpdateNote
}

const Note: React.FC<NoteProps> = ({ note, onDelete, onChange }: NoteProps) => {
    const classNames = `Note ShowsProgress`;
    return (
        <CSSTransition
            in={note.isBusy}
            timeout={500}
            classNames="isBusy"            
        >
            <div className={classNames} id={note.time.toString()}>
                <div className="Note-header">
                    <div className="Note-time">{new Date(Number(note.time)).toLocaleString()}</div>
                    <button onClick={() => {
                        note.isBusy = true;
                        onDelete(note);
                    }} className="Note-delete" tabIndex={0}>✕</button>
                </div>
                <div className="Note-content" contentEditable={true} spellCheck={false}
                    onBlur={(evt) => {
                        if (note.content !== evt.target.innerHTML) {
                            note.content = evt.target.innerHTML || '';
                            note.isBusy = true;
                            onChange(note);
                        }
                    }}
                    dangerouslySetInnerHTML={{ __html: note.content }} />
            </div>
        </CSSTransition>
    );
}

export default Note;