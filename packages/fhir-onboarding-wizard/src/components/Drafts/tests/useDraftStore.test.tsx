import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useDraftStore, readDrafts, clearAllDrafts } from '../useDraftStore';

type Item = { name: string };

const Probe = ({ stepKey }: { stepKey: string }) => {
  const { drafts, addDraft, removeDraft } = useDraftStore<Item>(stepKey);
  return (
    <div>
      <ul>
        {drafts.map((d, i) => (
          <li key={i}>{d.name}</li>
        ))}
      </ul>
      <button onClick={() => addDraft({ name: 'first' })}>add</button>
      <button onClick={() => addDraft({ name: 'edited' }, 0)}>edit-first</button>
      <button onClick={() => removeDraft(0)}>remove-first</button>
    </div>
  );
};

describe('useDraftStore', () => {
  beforeEach(() => sessionStorage.clear());

  it('starts empty', () => {
    render(<Probe stepKey="organization" />);
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('adds a draft and saves it to session storage', () => {
    render(<Probe stepKey="organization" />);
    fireEvent.click(screen.getByText('add'));
    expect(screen.queryByText('first')).not.toBeNull();
    expect(readDrafts<Item>('organization')).toEqual([
      { name: 'first', draftId: expect.any(String) },
    ]);
  });

  it('replaces a draft in place when editing', () => {
    render(<Probe stepKey="organization" />);
    fireEvent.click(screen.getByText('add'));
    fireEvent.click(screen.getByText('edit-first'));
    expect(screen.queryByText('first')).toBeNull();
    expect(readDrafts<Item>('organization')).toEqual([
      { name: 'edited', draftId: expect.any(String) },
    ]);
  });

  it('removes a draft', () => {
    render(<Probe stepKey="organization" />);
    fireEvent.click(screen.getByText('add'));
    fireEvent.click(screen.getByText('remove-first'));
    expect(readDrafts<Item>('organization')).toEqual([]);
  });

  it('restores drafts saved earlier in the session', () => {
    sessionStorage.setItem('wizard-draft:organization', JSON.stringify([{ name: 'saved' }]));
    render(<Probe stepKey="organization" />);
    expect(screen.queryByText('saved')).not.toBeNull();
  });

  it('keeps each step separate', () => {
    render(<Probe stepKey="organization" />);
    fireEvent.click(screen.getByText('add'));
    expect(readDrafts<Item>('careTeam')).toEqual([]);
  });
});

describe('readDrafts', () => {
  beforeEach(() => sessionStorage.clear());

  it('returns an empty list when nothing is stored', () => {
    expect(readDrafts('organization')).toEqual([]);
  });

  it('returns an empty list when the stored value is not valid JSON', () => {
    sessionStorage.setItem('wizard-draft:organization', '{not json');
    expect(readDrafts('organization')).toEqual([]);
  });
});

describe('clearAllDrafts', () => {
  it('removes every wizard draft and nothing else', () => {
    sessionStorage.setItem('wizard-draft:organization', '[]');
    sessionStorage.setItem('wizard-draft:careTeam', '[]');
    sessionStorage.setItem('unrelated', 'keep me');
    clearAllDrafts();
    expect(sessionStorage.getItem('wizard-draft:organization')).toBeNull();
    expect(sessionStorage.getItem('wizard-draft:careTeam')).toBeNull();
    expect(sessionStorage.getItem('unrelated')).toBe('keep me');
  });
});

describe('draft ids', () => {
  beforeEach(() => sessionStorage.clear());

  it('gives every stored draft its own draftId', () => {
    sessionStorage.setItem(
      'wizard-draft:users',
      JSON.stringify([
        { name: 'a' },
        { name: 'b' },
        { name: 'c', draftId: 'x' },
        { name: 'd', draftId: 'x' },
      ])
    );
    const ids = readDrafts<{ draftId: string }>('users').map((d) => d.draftId);
    expect(ids.every(Boolean)).toBe(true);
    expect(new Set(ids).size).toBe(4);
  });

  it('keeps a repaired id stable across reads', () => {
    sessionStorage.setItem('wizard-draft:users', JSON.stringify([{ name: 'a' }]));
    const first = readDrafts<{ draftId: string }>('users')[0].draftId;
    expect(readDrafts<{ draftId: string }>('users')[0].draftId).toBe(first);
  });
});