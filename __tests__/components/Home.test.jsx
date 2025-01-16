import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../../src/components/Home';
import { vi } from 'vitest';

// Mock des composants enfants
vi.mock('../../src/components/NewAnimeList', () => ({
  default: () => <div data-testid="new-anime-list">NewAnimeList</div>
}));

vi.mock('../../src/components/PopularAnimeList', () => ({
  default: () => <div data-testid="popular-anime-list">PopularAnimeList</div>
}));

describe('Home Component', () => {
  const renderHome = () => {
    return render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  };

  test('rend le composant Home avec ses composants enfants', () => {
    renderHome();
    
    // Vérifie que les composants enfants sont présents
    expect(screen.getByTestId('popular-anime-list')).toBeInTheDocument();
    expect(screen.getByTestId('new-anime-list')).toBeInTheDocument();
  });
});