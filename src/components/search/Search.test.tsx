import { render, screen } from '@testing-library/react';
import React from 'react';
import Search from './Search';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

let query = "";

const onSearch: SearchNotes = (searchQuery: string) => {
    query = searchQuery;
}
configure({ adapter: new Adapter() });

test('renders an search', () => {
    const search = shallow(<Search onSearch={onSearch} searchQuery={query} />);
    const input = search.find('input');

    expect(input.props().value).to.equal(query);
    expect(input.props().placeholder).to.equal('Search notes');
    expect(input.props().type).to.equal('text');    
});


test('updates query on search', () => {
    const search = shallow(<Search onSearch={onSearch} />);
    const input = search.find('input');
    input.simulate('change', { target: { value: 'Test' } });
    
    expect(query).to.equal('Test');    
    
});