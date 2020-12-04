import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';

test('renders an app', () => {
  render(<App />);
  const appName = screen.getByText(/Just Note/i);
  expect(appName).toBeInTheDocument();
});


test('has a footer', () => {
  render(<App />);
  const footer = screen.getByText(/Notes management app/i);
  expect(footer).toBeInTheDocument();
});