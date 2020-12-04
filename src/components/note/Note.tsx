import React from 'react'
import './Note.css'

interface NoteProps {
    note: NoteData
    onDelete: DeleteNote,
    onChange: UpdateNote
}

const Note: React.FC<NoteProps> = ({ note, onDelete, onChange }: NoteProps) => {
    return (
        <div className="Note" id={note.time.toString()}>
            <div className="Note-header">
                <div className="Note-time">{new Date(note.time).toLocaleString()}</div>
                <button onClick={() => { onDelete(note) }}
                    className="Note-delete" tabIndex={0}>✕</button>
            </div>
            <div className="Note-content" contentEditable={true} spellCheck={false}
                onBlur={(evt) => {
                    if (note.content !== evt.target.innerHTML) {
                        note.content = evt.target.innerHTML || '';
                        onChange(note);
                    }
                }}
                dangerouslySetInnerHTML={{ __html: note.content }} />
        </div>
    );
}

export default Note;