export async function GET() {
  try {
    const url = "https://query1.finance.yahoo.com/v8/finance/chart/%5EN225?range=1d&interval=30m";
    const res = await fetch(url, { headers: { "Accept": "application/json" } });
    const raw = await res.text();

    let data;
    try { data = JSON.parse(raw); }
    catch (e) { return Response.json({ error: "Yahoo returned non-JSON: " + raw.slice(0, 200) }, { status: 502 }); }

    if (!res.ok || data?.chart?.error) {
      return Response.json({ error: data?.chart?.error?.description || `Yahoo error (status ${res.status})` }, { status: 502 });
    }

    const result = data?.chart?.result?.[0];
    if (!result) {
      return Response.json({ error: "No chart data returned for ^N225" }, { status: 502 });
    }

    const timestamps = result.timestamp || [];
    const closes = result.indicators?.quote?.[0]?.close || [];

    const points = timestamps
      .map((t, i) => {
        const d = new Date(t * 1000);
        return {
          time: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) + " " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
          price: closes[i],
        };
      })
      .filter((p) => p.price !== null && p.price !== undefined)
      .slice(-30);

    if (points.length === 0) {
      return Response.json({ error: "Chart data was empty after filtering" }, { status: 502 });
    }

    return Response.json({ points });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
export async function GET() {
  const key = process.env.TWELVE_DATA_KEY;
  if (!key) {
    return Response.json({ error: "TWELVE_DATA_KEY is not set on the server" }, { status: 500 });
  }

  try {
    const url = `https://api.twelvedata.com/time_series?symbol=N225&interval=30min&outputsize=60&apikey=${key}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status === "error" || data.code >= 400) {
      return Response.json({ error: data.message || `Twelve Data error (${data.code})` }, { status: 502 });
    }
    if (!Array.isArray(data.values) || data.values.length === 0) {
      return Response.json({ error: "No chart data returned — check symbol coverage on your plan" }, { status: 502 });
    }

    const points = data.values
      .slice()
      .reverse()
      .map((v) => ({
        time: v.datetime.slice(5, 16).replace(" ", " "),
        price: parseFloat(v.close),
      }));

    return Response.json({ points });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
