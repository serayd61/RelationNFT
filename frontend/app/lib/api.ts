const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface MintRequest {
  user1: string;
  user2: string;
  milestoneType: number;
  interactionCount?: number;
  totalTipsExchanged?: string | number;
  metadataURI1?: string;
  metadataURI2?: string;
}

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

export async function mintRelationshipNFT(payload: MintRequest) {
  const response = await fetch(`${API_URL}/api/mint`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Mint request failed');
  }

  return data;
}
