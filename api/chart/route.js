export async function GET() {
  const key = process.env.TWELVE_DATA_KEY;
  if (!key) {
    return Response.json({ error: "TWELVE_DATA_KEY is not set on the server" }, { status: 500 });
  }

  try {
    const url = `https://api.twelvedata.com/time_series?symbol=NKY&interval=30min&outputsize=60&apikey=${key}`;
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
