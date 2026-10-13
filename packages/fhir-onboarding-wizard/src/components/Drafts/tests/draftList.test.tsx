import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DraftList } from '../draftList';

type Item = { name: string };
const drafts: Item[] = [{ name: 'Org A' }, { name: 'Org B' }];
const getLabel = (item: Item) => item.name;

describe('DraftList', () => {
  it('renders nothing when there are no drafts', () => {
    const { container } = render(
      <DraftList drafts={[]} getLabel={getLabel} onEdit={jest.fn()} onRemove={jest.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('shows one row per draft', () => {
    render(<DraftList drafts={drafts} getLabel={getLabel} onEdit={jest.fn()} onRemove={jest.fn()} />);
    expect(screen.queryByText('Org A')).not.toBeNull();
    expect(screen.queryByText('Org B')).not.toBeNull();
  });

  it('calls onEdit with the index of the clicked draft', () => {
    const onEdit = jest.fn();
    render(<DraftList drafts={drafts} getLabel={getLabel} onEdit={onEdit} onRemove={jest.fn()} />);
    fireEvent.click(screen.getAllByRole('button', { name: /edit/i })[1]);
    expect(onEdit).toHaveBeenCalledWith(1);
  });

  it('calls onRemove with the index of the clicked draft', () => {
    const onRemove = jest.fn();
    render(<DraftList drafts={drafts} getLabel={getLabel} onEdit={jest.fn()} onRemove={onRemove} />);
    fireEvent.click(screen.getAllByRole('button', { name: /remove/i })[0]);
    expect(onRemove).toHaveBeenCalledWith(0);
  });

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <DraftList drafts={drafts} getLabel={getLabel} onEdit={jest.fn()} onRemove={jest.fn()} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});