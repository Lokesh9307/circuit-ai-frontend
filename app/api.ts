// utils/api.ts
export interface GenerateResponse {
  image_url: string;
  explanation: string;
  arduino_code: string;
}


const BACKEND_URL = process.env.NEXT_PUBLIC_CIRCUIT_API_URL || "http://localhost:8000";


/**
 * Call FastAPI backend to generate circuit diagram + code.
 */
export async function generateCircuit(
  query: string,
  forceFallback = false
): Promise<GenerateResponse> {
  const res = await fetch(`${BACKEND_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, force_fallback: forceFallback }),
  });

  if (!res.ok) {
    throw new Error(`Backend error: ${res.status}`);
  }
  console.log("Generate response status:", res.status);
  return res.json() as Promise<GenerateResponse>;

}

/**
 * Health check endpoint
 */
export async function checkHealth(): Promise<{ ok: boolean; gemini: boolean }> {
  const res = await fetch(`${BACKEND_URL}/health`);
  if (!res.ok) {
    throw new Error("Health check failed");
  }
  return res.json();
}

/**
 * Call SerpAPI for additional search info about the circuit/project.
 */
// frontend/app/api.ts

export async function searchSerpApi(query: string) {
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error(`API error: ${res.statusText}`);

    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("Frontend API Error:", err);
    return [];
  }
}




