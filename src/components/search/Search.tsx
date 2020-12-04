import React from 'react';
import './Search.css';

interface SearchProps {
    onSearch: SearchNotes
    searchQuery?: string
}

const Search: React.FC<SearchProps> = ({ onSearch, searchQuery }) => (
    <div className="Search">
        <input
            value={searchQuery}
            className="Search-input"
            type="text" placeholder="Search notes"
            onChange={(evt) => {
                searchQuery = evt.target.value;
                onSearch(searchQuery)
            }}></input>
    </div>
);

export default Search;