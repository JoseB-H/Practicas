export async function request<T>(
  path: string,
  method = 'GET',
  body?: unknown,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      headers:
        body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error(
      'No pudimos conectar con YitVerse. Comprueba la conexión e inténtalo de nuevo.',
    );
  }
  if (response.status === 204) return undefined as T;
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('No pudimos cargar los datos. Inténtalo de nuevo.');
  }
  if (!response.ok)
    throw new Error(
      data.error || 'No pudimos guardar el cambio. Inténtalo de nuevo.',
    );
  return data as T;
}
