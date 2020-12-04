import { render, screen } from '@testing-library/react';
import React from 'react';
import Note from './Note';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

let noteData: NoteData = {
    time: new Date().getTime(),
    content: "Test note"
}
let isDeleted = false;
const onDelete: DeleteNote = (note: NoteData) => {
    isDeleted = true;
}
const onUpdate: UpdateNote = (note: NoteData) => {
    noteData.content = note.content;
}
configure({ adapter: new Adapter() });

test('renders a editable Note', () => {
    const note = renderShallow();

    expect(note.props().id).to.equal(String(noteData.time));
    expect(note.find('.Note-content').html())
        .to.equal(`<div class="Note-content" contenteditable="true" spellcheck="false">Test note</div>`);
});

test('delete note', () => {
    const note = renderShallow();
    expect(isDeleted).to.equal(false);
    note.find('.Note-delete').simulate('click');
    expect(isDeleted).to.equal(true);
});

test('updates note only if content changed', () => {
    const note = renderShallow();
    expect(isDeleted).to.equal(false);
    note.find('.Note-content')
        .simulate('blur', { target: { innerHTML: "Changed note text" } });
    expect(noteData.content).to.equal('Changed note text');
});

test('does not update note only if content is same', () => {
    const time = noteData.time;
    const note = renderShallow();
    expect(isDeleted).to.equal(false);
    note.find('.Note-content')
        .simulate('blur', { target: { innerHTML: noteData.content } });
    // Time shouldn't change
    expect(noteData.time).to.equal(time);
});

function renderShallow() {
    isDeleted = false;
    return shallow(<Note onChange={onUpdate} onDelete={onDelete} note={noteData} />);
}