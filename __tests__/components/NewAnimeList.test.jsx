import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NewAnimeList from '../../src/components/NewAnimeList';
import axios from 'axios';
import { vi } from 'vitest';

// Mock axios
vi.mock('axios');

describe('NewAnimeList Component', () => {
  const mockAnimes = [
    {
      id: 1,
      title: 'Test Anime 1',
      image_url: 'http://test.com/image1.jpg',
      description: 'Description test 1'
    },
    {
      id: 2,
      title_japanese: 'テストアニメ 2',
      image_url: 'http://test.com/image2.jpg',
      description: 'Description test 2'
    }
  ];

  const renderNewAnimeList = () => {
    return render(
      <BrowserRouter>
        <NewAnimeList />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    // Reset des mocks avant chaque test
    vi.clearAllMocks();
  });

  test('affiche le chargement puis les animes', async () => {
    axios.get.mockResolvedValueOnce({ data: mockAnimes });
    renderNewAnimeList();

    // Vérifie l'affichage du chargement
    expect(screen.getByText(/chargement/i)).toBeInTheDocument();

    // Vérifie l'affichage des animes après le chargement
    await waitFor(() => {
      expect(screen.getByText('Test Anime 1')).toBeInTheDocument();
      expect(screen.getByText('テストアニメ 2')).toBeInTheDocument();
    });

    // Vérifie que les descriptions sont tronquées
    expect(screen.getByText(/Description test 1/)).toBeInTheDocument();
    expect(screen.getByText(/Description test 2/)).toBeInTheDocument();
  });

  test('gère les erreurs de chargement', async () => {
    axios.get.mockRejectedValueOnce(new Error('Erreur API'));
    renderNewAnimeList();

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch new animes/i)).toBeInTheDocument();
    });
  });

  test('vérifie que les liens sont correctement générés', async () => {
    axios.get.mockResolvedValueOnce({ data: mockAnimes });
    renderNewAnimeList();

    await waitFor(() => {
      const links = screen.getAllByRole('link');
      expect(links[0]).toHaveAttribute('href', '/anime/1');
      expect(links[1]).toHaveAttribute('href', '/anime/2');
    });
  });
}); 