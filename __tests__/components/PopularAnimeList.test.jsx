import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PopularAnimeList from '../../src/components/PopularAnimeList';
import axios from 'axios';
import { vi } from 'vitest';

// Mock axios
vi.mock('axios');

describe('PopularAnimeList Component', () => {
  const mockAnimes = [
    {
      id: 1,
      title: 'Anime Populaire 1',
      image_url: 'http://test.com/image1.jpg',
      description: 'Description populaire 1'
    },
    {
      id: 2,
      title_japanese: 'テストアニメ 2',
      image_url: 'http://test.com/image2.jpg',
      description: 'Description populaire 2'
    }
  ];

  const renderPopularAnimeList = () => {
    return render(
      <BrowserRouter>
        <PopularAnimeList />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('affiche le chargement puis les animes populaires', async () => {
    axios.get.mockResolvedValueOnce({ data: mockAnimes });
    renderPopularAnimeList();

    // Vérifie l'affichage du chargement
    expect(screen.getByText(/chargement/i)).toBeInTheDocument();

    // Vérifie l'affichage des animes après le chargement
    await waitFor(() => {
      expect(screen.getByText('Anime Populaire 1')).toBeInTheDocument();
      expect(screen.getByText('テストアニメ 2')).toBeInTheDocument();
    });

    // Vérifie que les descriptions sont présentes
    expect(screen.getByText(/Description populaire 1/)).toBeInTheDocument();
    expect(screen.getByText(/Description populaire 2/)).toBeInTheDocument();
  });

  test('gère les erreurs de chargement', async () => {
    axios.get.mockRejectedValueOnce(new Error('Erreur API'));
    renderPopularAnimeList();

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch new animes')).toBeInTheDocument();
    });
  });

  test('vérifie que les liens sont correctement générés', async () => {
    axios.get.mockResolvedValueOnce({ data: mockAnimes });
    renderPopularAnimeList();

    await waitFor(() => {
      const links = screen.getAllByRole('link');
      expect(links[0]).toHaveAttribute('href', '/anime/1');
      expect(links[1]).toHaveAttribute('href', '/anime/2');
    });
  });
});