import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import ReportsPage from './page';
import { BrowserRouter } from 'react-router-dom';

describe('ReportsPage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('renders truthful unavailable state instead of a fake generate button', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<ReportsPage />, { wrapper: BrowserRouter });
    expect(screen.getByText('Report generation unavailable')).toBeInTheDocument();
    expect(screen.getByText('Report generation and export are not connected.')).toBeInTheDocument();
    expect(screen.queryByText('Generate Report')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /generate report/i })).not.toBeInTheDocument();
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it('preserves existing real report page content', () => {
    render(<ReportsPage />, { wrapper: BrowserRouter });
    expect(screen.getByText('Reports & Analytics')).toBeInTheDocument();
    expect(screen.getByText('AVAILABLE ANALYTIC FEEDS')).toBeInTheDocument();
    expect(screen.getByText('Revenue Report')).toBeInTheDocument();
  });
});
