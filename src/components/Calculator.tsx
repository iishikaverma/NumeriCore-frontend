import { useState, type FormEvent } from 'react';
import type { ApiResponse, CalculateRequest, MethodKey, Operation } from '../types';

const SAMPLE = {
  operation: 'calculate_area' as Operation,
  start: '0',
  end: '4',
  xValues: '0, 1, 2, 3, 4',
  yValues: '0, 1, 4, 9, 16',
  midpointValues: '0.25, 2.25, 6.25, 12.25',
  actual: '21.3333333333333',
};

const METHODS: { key: MethodKey; label: string }[] = [
  { key: 'trapezoidal', label: 'Trapezoidal' },
  { key: 'midpoint', label: 'Midpoint' },
  { key: 'simpson', label: "Simpson's 1/3" },
];

function parseNums(text: string): number[] {
  return text
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s !== '')
    .map(Number);
}

function fmt(n: number | null): string {
  if (n === null) return '—';
  if (n !== 0 && Math.abs(n) < 1e-4) return n.toExponential(3);
  return String(parseFloat(n.toPrecision(8)));
}

export default function Calculator() {
  const [form, setForm] = useState(SAMPLE);
  const [res, setRes] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [netError, setNetError] = useState<string | null>(null);

  const actualLabel = form.operation === 'calculate_volume' ? 'Actual volume' : 'Actual area';

  function set<K extends keyof typeof SAMPLE>(key: K, value: (typeof SAMPLE)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setNetError(null);

    const payload: CalculateRequest = {
      operation: form.operation,
      start: Number(form.start),
      end: Number(form.end),
      x_values: parseNums(form.xValues),
      y_values: parseNums(form.yValues),
      midpoint_values: parseNums(form.midpointValues),
    };
    const actual = form.actual.trim();
    if (actual !== '') {
      const key = form.operation === 'calculate_volume' ? 'actual_volume' : 'actual_area';
      payload[key] = Number(actual);
    }

    try {
      const base = import.meta.env.VITE_API_BASE ?? '';
      const r = await fetch(`${base}/api/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setRes((await r.json()) as ApiResponse);
    } catch (err) {
      setNetError(err instanceof Error ? err.message : String(err));
      setRes(null);
    } finally {
      setLoading(false);
    }
  }

  const data = res?.success ? res.data : null;
  const best = new Set(data?.most_accurate_methods ?? []);

  const xCount = parseNums(form.xValues).length;
  const yCount = parseNums(form.yValues).length;
  const mCount = parseNums(form.midpointValues).length;

  return (
    <div className="calc-grid">
      <form className="card calc-card" onSubmit={onSubmit}>
        <div className="field">
          <span className="field-label">Operation</span>
          <div className="segmented" role="group" aria-label="Operation">
            {(['calculate_area', 'calculate_volume'] as Operation[]).map((op) => (
              <button
                key={op}
                type="button"
                className={'seg' + (form.operation === op ? ' active' : '')}
                aria-pressed={form.operation === op}
                onClick={() => set('operation', op)}
              >
                {op === 'calculate_area' ? 'Area' : 'Volume'}
              </button>
            ))}
          </div>
        </div>

        <div className="field-row two">
          <label className="field">
            Start
            <input value={form.start} onChange={(e) => set('start', e.target.value)} inputMode="decimal" />
          </label>
          <label className="field">
            End
            <input value={form.end} onChange={(e) => set('end', e.target.value)} inputMode="decimal" />
          </label>
        </div>

        <label className="field">
          <span className="field-label-row">
            x values <span className="hint">{xCount} value{xCount === 1 ? '' : 's'}</span>
          </span>
          <input value={form.xValues} onChange={(e) => set('xValues', e.target.value)} />
        </label>
        <label className="field">
          <span className="field-label-row">
            y values <span className="hint">{yCount} value{yCount === 1 ? '' : 's'}</span>
          </span>
          <input value={form.yValues} onChange={(e) => set('yValues', e.target.value)} />
        </label>
        <label className="field">
          <span className="field-label-row">
            Midpoint values <span className="hint">{mCount} value{mCount === 1 ? '' : 's'} · one per interval</span>
          </span>
          <input
            value={form.midpointValues}
            onChange={(e) => set('midpointValues', e.target.value)}
          />
        </label>
        <label className="field">
          <span className="field-label-row">
            {actualLabel} <span className="hint">optional reference</span>
          </span>
          <input value={form.actual} onChange={(e) => set('actual', e.target.value)} inputMode="decimal" />
        </label>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Calculating…' : 'Calculate'}
        </button>
      </form>

      {netError && (
        <div className="card error-card">
          <strong>Network error</strong>
          <p>{netError}</p>
        </div>
      )}

      {res && !res.success && res.error && (
        <div className="card error-card">
          <strong>{res.error.code}</strong>
          <p>{res.error.message}</p>
        </div>
      )}

      {data && (
        <div className="card result-card">
          <div className="summary">
            <span>Step size <b>{fmt(data.step_size)}</b></span>
            <span>Reference <b>{fmt(data.actual_value)}</b></span>
            <span>Comparison <b>{data.comparison_available ? 'yes' : 'no'}</b></span>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Estimate</th>
                  <th>Absolute error</th>
                  <th>% error</th>
                </tr>
              </thead>
              <tbody>
                {METHODS.map(({ key, label }) => {
                  const m = data.results[key];
                  return (
                    <tr key={key} className={best.has(key) ? 'best' : undefined}>
                      <td>
                        {label}
                        {best.has(key) && <span className="pill-best">most accurate</span>}
                      </td>
                      <td>{fmt(m.estimated_value)}</td>
                      <td>{fmt(m.absolute_error)}</td>
                      <td>{fmt(m.percentage_error)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
