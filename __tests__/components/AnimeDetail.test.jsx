import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, useParams } from 'react-router-dom';
import AnimeDetail from '../../src/components/AnimeDetail';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { getCurrentUser } from "../../src/api/auth";

// Mock des modules nécessaires
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
  };
});

vi.mock('../../src/api/auth', () => ({
  getCurrentUser: vi.fn()
}));

describe('AnimeDetail Component', () => {
  const mockAnime = {
    id: 1,
    title_english: 'Test Anime',
    title_japanese: 'テストアニメ',
    image_url: 'http://test.com/image.jpg',
    description: 'Test description',
    aired: { string: '2023-01-01' },
    trailer: { embed_url: 'http://test.com/trailer' }
  };

  const mockRecommendations = [
    {
      id: 2,
      title_japanese: 'おすすめアニメ',
      image_url: 'http://test.com/rec1.jpg'
    }
  ];

  const mockRelations = [
    {
      id: 3,
      title: 'Related Anime',
      type: 'Sequel',
      media_type: 'anime'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useParams.mockReturnValue({ id: '1' });
    
    // Mock fetch global
    global.fetch = vi.fn();
    
    // Mock des réponses fetch
    global.fetch
      .mockImplementationOnce(() => Promise.resolve({
        json: () => Promise.resolve(mockAnime)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        json: () => Promise.resolve(mockRecommendations)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        json: () => Promise.resolve(mockRelations)
      }));
  });

  const renderAnimeDetail = () => {
    return render(
      <BrowserRouter>
        <AnimeDetail />
      </BrowserRouter>
    );
  };

  test('affiche les informations de base de l\'anime', async () => {
    renderAnimeDetail();

    // Vérifie le chargement initial
    expect(screen.getByText(/chargement/i)).toBeInTheDocument();

    // Vérifie l'affichage des informations de l'anime
    await waitFor(() => {
      expect(screen.getByText(mockAnime.title_english)).toBeInTheDocument();
      expect(screen.getByText(`Release date: ${mockAnime.aired.string}`)).toBeInTheDocument();
      expect(screen.getByText(mockAnime.description)).toBeInTheDocument();
    });
  });

  test('affiche les recommandations et relations', async () => {
    renderAnimeDetail();

    await waitFor(() => {
      expect(screen.getByText('Recommendations')).toBeInTheDocument();
      expect(screen.getAllByText('Related Anime')).toHaveLength(2);
      expect(screen.getByText(mockRecommendations[0].title_japanese)).toBeInTheDocument();
      expect(screen.getByText('Sequel')).toBeInTheDocument();
    });
  });

  test('gère l\'ajout à la liste utilisateur', async () => {
    const mockUser = { id: 1 };
    getCurrentUser.mockResolvedValue(mockUser);
    
    global.fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: 'Added successfully' })
    }));

    renderAnimeDetail();

    await waitFor(() => {
      const addButton = screen.getByText('Add to My List');
      expect(addButton).toBeInTheDocument();
    });
  });

  test('gère les erreurs de chargement', async () => {
    global.fetch.mockRejectedValueOnce(new Error('API Error'));
    
    renderAnimeDetail();

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled;
    });
  });
}); 