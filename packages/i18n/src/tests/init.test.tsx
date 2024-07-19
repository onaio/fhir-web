import * as module from '../init';
import { waitFor, screen, fireEvent, render, cleanup } from '@testing-library/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

afterAll(() => {
  cleanup();
});

jest.mock('../resources', () => {
  const mockResources = {
    sw_core: {
      translation: {
        Hello: 'Jambo',
      },
    },
    en_core: {
      translation: {
        Hello: 'Hello',
      },
    },
  };
  return {
    esModule: true,
    resources: mockResources,
  };
});

jest.mock('@opensrp/pkg-config', () => {
  return {
    _esModule: true,
    getConfig: (key: string) => {
      const configs = {
        languageCode: 'en',
        projectCode: 'core',
      };
      return configs[key];
    },
  };
});

const i18nextLngKey = 'i18nextLng';
let mockStorage = {};
Object.defineProperty(window, 'localStorage', {
  value: {
    setItem: jest.fn((key, value) => (mockStorage[key] = value)),
    getItem: jest.fn((key) => mockStorage[key]),
    removeItem: jest.fn((key) => delete mockStorage[key]),
  },
});

afterEach(() => {
  mockStorage = {};
  cleanup();
});

test('loads up the correct resources', async () => {
  const { OpensrpWebI18nProvider } = module;
  const MockComponent = () => {
    const { t, i18n } = useTranslation();
    return (
      <>
        <button
          onClick={() => {
            return i18n.changeLanguage('sw_core');
          }}
        >
          change
        </button>
        <p>Placebo text</p>
        <p>{t('Hello')}</p>
      </>
    );
  };
  render(
    <>
      <OpensrpWebI18nProvider>
        <MockComponent />
      </OpensrpWebI18nProvider>
    </>
  );

  await waitFor(() => {
    expect(screen.getByText(/Hello/)).toBeInTheDocument();
    expect(screen.getByText(/Placebo/)).toBeInTheDocument();
    expect(screen.queryByText(/Jambo/)).not.toBeInTheDocument();
  });

  expect(window.localStorage.getItem(i18nextLngKey)).toBe(undefined);

  fireEvent.click(screen.getByText(/change/i));

  // selected language is stored on localstarage
  expect(window.localStorage.getItem(i18nextLngKey)).toBe('sw_core');
  await waitFor(() => {
    expect(screen.getByText(/Jambo/)).toBeInTheDocument();
    expect(screen.queryByText(/Hello/)).not.toBeInTheDocument();
  });
});
