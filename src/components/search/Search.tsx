import React from 'react';
import './Search.css';

const Search: React.FC = () => (
    <div className="Search">
        <input className="Search-input" type="search" placeholder="Search notes"></input>
    </div>
);

export default Search;