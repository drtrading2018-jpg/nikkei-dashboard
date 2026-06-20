"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const STORAGE_KEY = "nikkei-analysis-log";

const C = {
  bg: "#0A0E14",
  surface: "#131920",
  border: "#1E2730",
  textPrimary: "#E8EEF4",
  textSecondary: "#7A8A99",
  textMuted: "#4A5A68",
  bullish: "#2ECC71",
  bearish: "#E74C3C",
  uncertain: "#F39C12",
  accent: "#3498DB",
  bullishBg: "rgba(46,204,113,0.08)",
  bearishBg: "rgba(231,76,60,0.08)",
  uncertainBg: "rgba(243,156,18,0.08)",
};

const verdictColor = { bullish: C.bullish, bearish: C.bearish, uncertain: C.uncertain };
const verdictBg = { bullish: C.bullishBg, bearish: C.bearishBg, uncertain: C.uncertainBg };
const impactColor = { bullish: C.bullish, bearish: C.bearish, neutral: C.textMuted };
const importanceColor = { high: C.bearish, medium: C.uncertain, low: C.textMuted };

export default function NikkeiDashboard() {
  const [chartData, setChartData] = useState(null);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState(null);

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [outcomeInput, setOutcomeInput] = useState({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch (_) {}
  }, []);

  function persistHistory(updated) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch (_) {}
  }

  async function loadChart() {
    setChartLoading(true);
    setChartError(null);
    try {
      const res = await fetch("/api/chart");
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Chart request failed");
      setChartData(data.points);
    } catch (err) {
      setChartError(err.message);
    } finally {
      setChartLoading(false);
    }
  }

  async function runAnalysis() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze");
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Analysis request failed");
      setAnalysis(data);
      const updated = [{ ...data, outcome: null }, ...history].slice(0, 90);
      setHistory(updated);
      persistHistory(updated);
    } catch (err) {
      setError("Analysis failed — " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function runAll() {
    loadChart();
    runAnalysis();
  }

  function saveOutcome(index) {
    const o = outcomeInput[index];
    if (!o?.direction) return;
    const updated = history.map((h, i) => (i === index ? { ...h, outcome: o } : h));
    setHistory(updated);
    persistHistory(updated);
  }

  const fmt = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  const chartUp = chartData && chartData.length > 1 && chartData[chartData.length - 1].price >= chartData[0].price;

  const s = {
    root: { background: C.bg, minHeight: "100vh", color: C.textPrimary, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", maxWidth: 480, margin: "0 auto", paddingBottom: 48 },
    header: { padding: "18px 16px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" },
    titleBlock: { display: "flex", flexDirection: "column", gap: 2 },
    title: { fontSize: 16, fontWeight: 700, color: C.textPrimary, margin: 0, letterSpacing: "-0.01em" },
    sub: { fontSize: 11, color: C.textMuted, fontFamily: "monospace", margin: 0 },
    btn: (disabled) => ({ background: disabled ? C.border : C.accent, color: disabled ? C.textMuted : "#fff", border: "none", borderRadius: 6, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer" }),
    body: { padding: "14px 16px 0" },
    card: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px", marginBottom: 10 },
    label: { fontSize: 10, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, margin: "0 0 6px" },
    verdictCard: (v) => ({ background: verdictBg[v] || C.surface, border: `1px solid ${verdictColor[v] || C.border}`, borderRadius: 10, padding: "16px", marginBottom: 10 }),
    verdictText: (v) => ({ fontSize: 30, fontWeight: 800, color: verdictColor[v] || C.textPrimary, textTransform: "uppercase", letterSpacing: "-0.02em", margin: "0 0 6px" }),
    badge: (v) => ({ display: "inline-block", fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 12, background: verdictBg[v] || "transparent", color: verdictColor[v] || C.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", border: `1px solid ${verdictColor[v] || C.border}` }),
    reasoning: { fontSize: 13, color: "#B8C4CE", lineHeight: 1.55, margin: "10px 0 0" },
    row: (last) => ({ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: last ? "none" : `1px solid ${C.border}` }),
    rowLabel: { fontSize: 12, color: C.textSecondary },
    rowValue: (up) => ({ fontSize: 13, fontWeight: 600, fontFamily: "monospace", color: up ? C.bullish : C.bearish }),
    evtRow: (last) => ({ display: "flex", gap: 8, padding: "7px 0", borderBottom: last ? "none" : `1px solid ${C.border}`, alignItems: "flex-start" }),
    dot: (imp) => ({ width: 7, height: 7, borderRadius: "50%", background: importanceColor[imp] || C.textMuted, marginTop: 4, flexShrink: 0 }),
    evtTime: { fontSize: 11, fontFamily: "monospace", color: C.textMuted, minWidth: 48, paddingTop: 1 },
    evtName: { fontSize: 12, color: "#B8C4CE", flex: 1 },
    newsRow: (last) => ({ padding: "8px 0", borderBottom: last ? "none" : `1px solid ${C.border}` }),
    newsHead: { fontSize: 12, color: "#B8C4CE", lineHeight: 1.45, margin: 0 },
    newsImpact: (imp) => ({ fontSize: 10, fontWeight: 600, color: impactColor[imp] || C.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginTop: 3 }),
    watchout: { fontSize: 12, color: "#B8C4CE", padding: "3px 0", display: "flex", gap: 6 },
    ts: { fontSize: 11, color: C.textMuted, fontFamily: "monospace", padding: "2px 0 14px" },
    histBtn: { background: "none", border: `1px solid ${C.border}`, color: C.textSecondary, borderRadius: 8, padding: "10px 16px", fontSize: 12, cursor: "pointer", width: "100%", marginBottom: 12 },
    histItem: { padding: "12px 0", borderBottom: `1px solid ${C.border}` },
    histHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
    histVerdict: (v) => ({ fontSize: 14, fontWeight: 700, color: verdictColor[v] || C.textPrimary, textTransform: "uppercase" }),
    histMeta: { fontSize: 11, color: C.textMuted, margin: "2px 0 6px" },
    outcomeRow: { display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginTop: 6 },
    outcomeLbl: { fontSize: 11, color: C.textMuted },
    select: { background: C.border, border: "none", color: C.textPrimary, borderRadius: 4, padding: "4px 8px", fontSize: 11 },
    input: { background: C.border, border: "none", color: C.textPrimary, borderRadius: 4, padding: "4px 8px", fontSize: 11, width: 70 },
    saveBtn: { background: C.accent, color: "#fff", border: "none", borderRadius: 4, padding: "4px 10px", fontSize: 11, cursor: "pointer" },
    outcomeSet: (v) => ({ fontSize: 11, fontWeight: 600, color: verdictColor[v] || C.bullish, padding: "3px 8px", background: verdictBg[v] || C.bullishBg, borderRadius: 4 }),
    empty: { textAlign: "center", padding: "40px 24px", color: C.textSecondary },
    emptyTitle: { fontSize: 16, fontWeight: 600, color: C.textPrimary, marginBottom: 8 },
    emptyText: { fontSize: 13, lineHeight: 1.6, color: C.textSecondary },
    errBox: { background: "rgba(231,76,60,0.08)", border: "1px solid rgba(231,76,60,0.25)", borderRadius: 8, padding: "12px 14px", margin: "12px 16px", fontSize: 12, color: C.bearish, lineHeight: 1.5 },
    spinTextSm: { fontSize: 12, color: C.textMuted, padding: "30px 0", textAlign: "center" },
  };

  return (
    <div style={s.root}>
      <div style={s.header}>
        <div style={s.titleBlock}>
          <p style={s.title}>Japan 225 · Pre-Open</p>
          <p style={s.sub}>1am BST · Tokyo Direction Signal</p>
        </div>
        <button style={s.btn(loading || chartLoading)} onClick={runAll} disabled={loading || chartLoading}>
          {loading || chartLoading ? "Running..." : "Analyse"}
        </button>
      </div>

      <div style={{ ...s.card, margin: "14px 16px 0" }}>
        <p style={s.label}>Nikkei 225 · Last Session (30m)</p>
        {chartError && <p style={{ fontSize: 12, color: C.bearish, lineHeight: 1.5 }}>{chartError}</p>}
        {chartLoading && <p style={s.spinTextSm}>Loading chart…</p>}
        {!chartLoading && chartData && chartData.length > 0 && (
          <div style={{ height: 180, marginTop: 6 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 6, right: 6, bottom: 0, left: 0 }}>
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: C.textMuted }} interval="preserveStartEnd" axisLine={{ stroke: C.border }} tickLine={false} />
                <YAxis domain={["auto", "auto"]} tick={{ fontSize: 9, fill: C.textMuted }} axisLine={false} tickLine={false} width={48} />
                <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, fontSize: 11, borderRadius: 6 }} labelStyle={{ color: C.textSecondary }} />
                <Line type="monotone" dataKey="price" stroke={chartUp ? C.bullish : C.bearish} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        {!chartLoading && !chartData && !chartError && <p style={s.spinTextSm}>Tap Analyse to load the chart</p>}
      </div>

      {error && <div style={s.errBox}>{error}</div>}

      {!analysis && !loading && !error && (
        <div style={s.empty}>
          <p style={s.emptyTitle}>Ready to analyse</p>
          <p style={s.emptyText}>
            Tap Analyse to pull the live Nikkei chart, S&amp;P 500 close, scheduled economic events and breaking news.
          </p>
        </div>
      )}

      {loading && !analysis && <div style={s.spinTextSm}>Searching events &amp; news…</div>}

      {analysis && !loading && (
        <div style={s.body}>
          <div style={s.verdictCard(analysis.verdict)}>
            <p style={s.label}>Direction Verdict</p>
            <p style={s.verdictText(analysis.verdict)}>{analysis.verdict}</p>
            <span style={s.badge(analysis.verdict)}>{analysis.confidence} confidence</span>
            <p style={s.reasoning}>{analysis.reasoning}</p>
          </div>

          {analysis.spx && (
            <div style={s.card}>
              <p style={s.label}>S&amp;P 500 Close</p>
              <div style={s.row(true)}>
                <span style={s.rowLabel}>{analysis.spx.notes}</span>
                <span style={s.rowValue(analysis.spx.direction === "up")}>{analysis.spx.change}</span>
              </div>
            </div>
          )}

          {analysis.events?.length > 0 && (
            <div style={s.card}>
              <p style={s.label}>Economic Events · Next 24h</p>
              {analysis.events.map((ev, i) => (
                <div key={i} style={s.evtRow(i === analysis.events.length - 1)}>
                  <div style={s.dot(ev.importance)} />
                  <span style={s.evtTime}>{ev.time}</span>
                  <span style={s.evtName}>{ev.event}</span>
                </div>
              ))}
            </div>
          )}

          {analysis.news?.length > 0 && (
            <div style={s.card}>
              <p style={s.label}>Market News</p>
              {analysis.news.map((item, i) => (
                <div key={i} style={s.newsRow(i === analysis.news.length - 1)}>
                  <p style={s.newsHead}>{item.headline}</p>
                  <p style={s.newsImpact(item.impact)}>{item.impact}</p>
                </div>
              ))}
            </div>
          )}

          {analysis.watchouts?.length > 0 && (
            <div style={s.card}>
              <p style={s.label}>Watch For</p>
              {analysis.watchouts.map((w, i) => (
                <div key={i} style={s.watchout}>
                  <span style={{ color: C.accent, flexShrink: 0 }}>›</span>
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}

          <p style={s.ts}>Analysed {fmt(analysis.timestamp)}</p>
        </div>
      )}

      {history.length > 0 && (
        <div style={{ padding: "0 16px" }}>
          <button style={s.histBtn} onClick={() => setShowHistory(!showHistory)}>
            {showHistory ? "Hide" : "Show"} History ({history.length} sessions)
          </button>

          {showHistory && (
            <div>
              {history.map((item, i) => (
                <div key={i} style={{ ...s.histItem, borderBottom: i === history.length - 1 ? "none" : `1px solid ${C.border}` }}>
                  <div style={s.histHeader}>
                    <span style={s.histVerdict(item.verdict)}>{item.verdict}</span>
                    <span style={{ fontSize: 11, color: C.textMuted, fontFamily: "monospace" }}>{fmt(item.timestamp)}</span>
                  </div>
                  <p style={s.histMeta}>{item.confidence} confidence · SPX {item.spx?.change || "—"}</p>

                  {item.outcome ? (
                    <span style={s.outcomeSet(item.outcome.direction)}>
                      Actual: {item.outcome.direction} {item.outcome.points ? `· ${item.outcome.points}pts` : ""}
                    </span>
                  ) : (
                    <div style={s.outcomeRow}>
                      <span style={s.outcomeLbl}>What happened?</span>
                      <select
                        style={s.select}
                        value={outcomeInput[i]?.direction || ""}
                        onChange={(e) => setOutcomeInput((p) => ({ ...p, [i]: { ...p[i], direction: e.target.value } }))}
                      >
                        <option value="">direction</option>
                        <option value="bullish">Up</option>
                        <option value="bearish">Down</option>
                        <option value="uncertain">Flat</option>
                      </select>
                      <input
                        style={s.input}
                        type="number"
                        placeholder="pts"
                        value={outcomeInput[i]?.points || ""}
                        onChange={(e) => setOutcomeInput((p) => ({ ...p, [i]: { ...p[i], points: e.target.value } }))}
                      />
                      <button style={s.saveBtn} onClick={() => saveOutcome(i)} disabled={!outcomeInput[i]?.direction}>
                        Save
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
