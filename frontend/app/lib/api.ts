const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function fetchUserStats(address: string) {
  const response = await fetch(`${API_URL}/api/user/${address}/stats`);
  if (!response.ok) throw new Error('Failed to fetch user stats');
  return response.json();
}

export async function fetchRelationship(user1: string, user2: string) {
  const response = await fetch(`${API_URL}/api/relationship/${user1}/${user2}`);
  if (!response.ok) throw new Error('Failed to fetch relationship');
  return response.json();
}

export async function healthCheck() {
  const response = await fetch(`${API_URL}/api/health`);
  if (!response.ok) throw new Error('API health check failed');
  return response.json();
}
