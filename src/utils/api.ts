// API utility functions for Murder Mystery app

export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`/api${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export async function createScenario(data: {
  title: string;
  description?: string;
}): Promise<{ id: string }> {
  return fetchAPI('/scenarios', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getScenarios(): Promise<
  Array<{ id: string; title: string; description?: string }>
> {
  return fetchAPI('/scenarios');
}

export async function getScenario(id: string): Promise<{
  id: string;
  title: string;
  description?: string;
}> {
  return fetchAPI(`/scenarios/${id}`);
}

export async function updateScenario(
  id: string,
  data: { title?: string; description?: string }
): Promise<void> {
  return fetchAPI(`/scenarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteScenario(id: string): Promise<void> {
  return fetchAPI(`/scenarios/${id}`, {
    method: 'DELETE',
  });
}

// Character API functions
export async function createCharacter(
  scenarioId: string,
  data: {
    name: string;
    role?: string;
    backstory?: string;
    goal?: string;
  }
): Promise<{ id: string }> {
  return fetchAPI(`/scenarios/${scenarioId}/characters`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getCharacters(scenarioId: string): Promise<
  Array<{
    id: string;
    name: string;
    role?: string;
    backstory?: string;
    goal?: string;
  }>
> {
  return fetchAPI(`/scenarios/${scenarioId}/characters`);
}

export async function updateCharacter(
  scenarioId: string,
  characterId: string,
  data: {
    name?: string;
    role?: string;
    backstory?: string;
    goal?: string;
  }
): Promise<void> {
  return fetchAPI(`/scenarios/${scenarioId}/characters/${characterId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCharacter(
  scenarioId: string,
  characterId: string
): Promise<void> {
  return fetchAPI(`/scenarios/${scenarioId}/characters/${characterId}`, {
    method: 'DELETE',
  });
}

// Timeline API functions
export async function createTimeline(
  scenarioId: string,
  data: {
    event_time: string;
    event_description: string;
  }
): Promise<{ id: string }> {
  return fetchAPI(`/scenarios/${scenarioId}/timelines`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getTimelines(scenarioId: string): Promise<
  Array<{
    id: string;
    event_time: string;
    event_description: string;
  }>
> {
  return fetchAPI(`/scenarios/${scenarioId}/timelines`);
}

export async function updateTimeline(
  scenarioId: string,
  timelineId: string,
  data: {
    event_time?: string;
    event_description?: string;
  }
): Promise<void> {
  return fetchAPI(`/scenarios/${scenarioId}/timelines/${timelineId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteTimeline(
  scenarioId: string,
  timelineId: string
): Promise<void> {
  return fetchAPI(`/scenarios/${scenarioId}/timelines/${timelineId}`, {
    method: 'DELETE',
  });
}

// Card API functions
export async function createCard(
  scenarioId: string,
  data: {
    card_type: string;
    title: string;
    content: string;
    assigned_to_character_id?: string;
  }
): Promise<{ id: string }> {
  return fetchAPI(`/scenarios/${scenarioId}/cards`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getCards(scenarioId: string): Promise<
  Array<{
    id: string;
    card_type: string;
    title: string;
    content: string;
    assigned_to_character_id?: string;
  }>
> {
  return fetchAPI(`/scenarios/${scenarioId}/cards`);
}

export async function updateCard(
  scenarioId: string,
  cardId: string,
  data: {
    card_type?: string;
    title?: string;
    content?: string;
    assigned_to_character_id?: string;
  }
): Promise<void> {
  return fetchAPI(`/scenarios/${scenarioId}/cards/${cardId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCard(scenarioId: string, cardId: string): Promise<void> {
  return fetchAPI(`/scenarios/${scenarioId}/cards/${cardId}`, {
    method: 'DELETE',
  });
}
