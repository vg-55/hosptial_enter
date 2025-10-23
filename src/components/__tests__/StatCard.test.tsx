import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatCard from '../StatCard';
import { Activity } from 'lucide-react';

describe('StatCard', () => {
  it('renders title and value correctly', () => {
    render(<StatCard title="Test Metric" value={100} />);
    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('formats currency values correctly', () => {
    render(<StatCard title="Revenue" value={1000} format="currency" />);
    expect(screen.getByText('$1,000')).toBeInTheDocument();
  });

  it('formats percentage values correctly', () => {
    render(<StatCard title="Rate" value={75.5} format="percentage" />);
    expect(screen.getByText('75.5%')).toBeInTheDocument();
  });

  it('displays trend indicator when change is provided', () => {
    render(<StatCard title="Metric" value={100} change={5.5} trend="up" />);
    expect(screen.getByText('+5.5%')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    const { container } = render(<StatCard title="Metric" value={100} icon={Activity} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
