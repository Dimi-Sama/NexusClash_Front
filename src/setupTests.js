import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock fetch global
global.fetch = vi.fn();

// Mock console.error pour éviter les logs pendant les tests
console.error = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
};
global.localStorage = localStorageMock;

// Nettoyage après chaque test
afterEach(() => {
  vi.clearAllMocks();
});