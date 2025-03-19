import type { UserProgress } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Función para obtener todos los usuarios para el leaderboard
export async function fetchLeaderboard(): Promise<UserProgress[]> {
  const response = await fetch(`${API_BASE_URL}/userProgress`);
  
  if (!response.ok) {
    throw new Error('Error al obtener datos del leaderboard');
  }
  
  return response.json();
}

// Función para obtener el progreso de un usuario específico
export async function fetchUserProgress(userId: number): Promise<UserProgress> {
  const response = await fetch(`${API_BASE_URL}/userProgress/${userId}`);
  
  if (!response.ok) {
    throw new Error('Error al obtener progreso del usuario');
  }
  
  return response.json();
}

// Función para guardar el progreso de una pregunta
export async function saveQuestionProgress(
  userId: number, 
  weekId: number, 
  questionId: number, 
  completed: boolean, 
  points: number,
  failed: boolean = false,
  userAnswer?: string,
): Promise<UserProgress> {
  const response = await fetch(`${API_BASE_URL}/userProgress/${userId}/question`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      weekId,
      questionId,
      completed,
      points,
      failed,
      userAnswer,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Error al guardar progreso de la pregunta');
  }
  
  return response.json();
} 