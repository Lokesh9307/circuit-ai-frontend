// frontend/app/api/search/route.ts
import { NextResponse } from "next/server";
import dotenv from "dotenv";

dotenv.config();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q) {
      return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
    }

    // const apiKey = process.env.SERP_API_KEY;
    // console.log("Using SerpAPI key:", apiKey);
    const apiKey = "475bf976e3395213ff6aafbc7c3805eba4c2050b91254282902077751cc5d14e";
    if (!apiKey) {
      console.error("❌ SERPAPI_KEY missing in environment!");
      return NextResponse.json({ error: "Missing SERPAPI_KEY" }, { status: 500 });
    }

    const serpUrl = `https://serpapi.com/search.json?q=${encodeURIComponent(q)}&api_key=${apiKey}`;
    console.log("🔍 Fetching SerpAPI:", serpUrl);

    const res = await fetch(serpUrl);
    const text = await res.text(); // get raw response
    let data: any;

    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      console.error("❌ Failed to parse SerpAPI response:", text);
      throw parseErr;
    }

    if (!res.ok) {
      console.error("❌ SerpAPI returned error:", data);
      return NextResponse.json({ error: data }, { status: res.status });
    }

    const results =
      data.organic_results?.map((item: any) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
      })) || [];

    return NextResponse.json({ results });
  } catch (err: any) {
    console.error("🔥 API Route Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
