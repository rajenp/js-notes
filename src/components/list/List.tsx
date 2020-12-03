import React from 'react'
import './List.css'
import Note from '../note/Note'

const List: React.FC<Notes> = ({ notes }) => {
    return (
        <div className="List">
            {notes.map((note, index) => {
                return <Note key={note.time} content={note.content} time={note.time} />
            })}
        </div>
    );
}

export default List;