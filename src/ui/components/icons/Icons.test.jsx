// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  HomeIcon,
  TeacherIcon,
  CashIcon,
  SearchIcon,
  SettingsIcon,
  PlusIcon,
  TrashIcon,
  TrendingUp,
  TrendingDown,
} from './Icons.jsx';

describe('Icons', () => {
  const iconCases = [
    ['HomeIcon', HomeIcon],
    ['TeacherIcon', TeacherIcon],
    ['CashIcon', CashIcon],
    ['SearchIcon', SearchIcon],
    ['SettingsIcon', SettingsIcon],
    ['PlusIcon', PlusIcon],
    ['TrashIcon', TrashIcon],
    ['TrendingUp', TrendingUp],
    ['TrendingDown', TrendingDown],
  ];

  it.each(iconCases)('%s renders an svg element', (_, Component) => {
    const { container } = render(<Component />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('TeacherIcon accepts size and className props', () => {
    const { container } = render(<TeacherIcon size={32} className="custom-icon" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
    expect(svg).toHaveClass('custom-icon');
  });

  it('CashIcon accepts size and className props', () => {
    const { container } = render(<CashIcon size={40} className="money-icon" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '40');
    expect(svg).toHaveAttribute('height', '40');
    expect(svg).toHaveClass('money-icon');
  });

  it('SettingsIcon forwards props via IconBase', () => {
    const { container } = render(<SettingsIcon width="20" height="20" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('height', '20');
  });

  it('HomeIcon renders with default stroke currentColor', () => {
    const { container } = render(<HomeIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
  });
});
