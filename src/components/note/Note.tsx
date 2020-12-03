import React from 'react'
import './Note.css'

const Note: React.FC<NoteData> = ({ time, content }) => {
    return (
        <div className="Note" id={time.toString()}>
            <div className="Note-header">
                <div className="Note-time">{new Date(time).toLocaleString()}</div>
                <a className="Note-delete" tabIndex={0}>✕</a>
            </div>
            <div className="Note-content" contentEditable={true} spellCheck={false}
                dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
}

export default Note;