import { render, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';

import HomePage from '../page';

describe('HomePage', () => {
  it('renders page title', () => {
    render(<HomePage />);
    expect(screen.getByText(/platform analytics dashboard/i)).toBeInTheDocument();
  });
});
