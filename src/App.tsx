import React, { useState } from 'react';
import './App.css';
import Search from './components/search/Search'
import List from './components/list/List';

const App: React.FC = () => {
  const notes = [
    {
      time: new Date().getTime(),
      content: "Test"
    },
    {
      time: new Date().getTime(),
      content: "Test1"
    }
  ];
  return (
    <div className="App">
      <header className="App-header">
        <img className="App-logo" alt="logo" src="./logo128.png" />
        <span className="App-name">Just Note</span>
        <Search />
      </header>
      <div className="App-main">
        <List notes={notes} />
      </div>
      <div className="App-footer">
        Simple Notes management app by Rajendra Patil
      </div>
    </div>
  );

}

export default App;
