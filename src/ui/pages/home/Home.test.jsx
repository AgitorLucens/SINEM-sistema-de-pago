// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('../../components/home/sidebar/SideBar.jsx', () => ({
  default: ({ currentPage, setCurrentPage }) => (
    <div data-testid="sidebar" data-currentpage={currentPage}>
      Sidebar
    </div>
  ),
}));

vi.mock('../../components/home/content/Content.jsx', () => ({
  default: ({ page }) => <div data-testid="content" data-page={page}>Content</div>,
}));

vi.mock('../../constant/Pages.jsx', () => ({
  Page: { DASHBOARD: 'dashboard' },
}));

beforeEach(() => {
  window.api = { quitApp: vi.fn(), getCurrentImage: vi.fn().mockResolvedValue({ image: null }) };
});

import Home from './Home.jsx';

describe('Home', () => {
  it('renders Sidebar component', () => {
    render(<Home />);
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('renders Content component', () => {
    render(<Home />);
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('passes DASHBOARD as initial page to both Sidebar and Content', () => {
    render(<Home />);
    expect(screen.getByTestId('sidebar')).toHaveAttribute('data-currentpage', 'dashboard');
    expect(screen.getByTestId('content')).toHaveAttribute('data-page', 'dashboard');
  });
});
