import React from 'react'
import './List.css'
import Note from '../note/Note'

interface ListProps {
    notes: NoteData[],
    searchQuery: string,
    onDelete: DeleteNote,
    onChange: UpdateNote
}
const List: React.FC<ListProps> = ({ notes, searchQuery, onDelete, onChange }) => {
    let html;
    const filteredNotes = notes
        .filter((note) => searchQuery.length === 0 || note.content.indexOf(searchQuery) > -1);
    const classes = `List count-${filteredNotes.length}`

    if (filteredNotes.length > 0) {
        html = <div className={classes}>
            {filteredNotes
                .map((note) => {
                    return <Note key={note.time} note={note} onDelete={onDelete} onChange={onChange} />
                })}
        </div>;
    } else {
        html = <div className={classes}>
            <div className="Empty">
                <img src="./logo128.png" alt="empty"></img>
                <div className="Empty-message">
                    {searchQuery.length > 0
                        ? `No notes found`
                        : "You have no saved notes"}
                </div>
            </div>
        </div>
    }
    return (
        html
    );
}

export default List;