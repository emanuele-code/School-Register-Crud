import React from 'react';
import { render, screen } from '@testing-library/react';
import SchoolRegister from './webparts/schoolRegister/SchoolRegister';

test('renders learn react link', () => {
  render(<SchoolRegister />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
