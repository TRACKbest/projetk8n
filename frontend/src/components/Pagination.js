import React from 'react';

function Pagination({ page, pages, total, limit, onChange }) {
  if (!total) return null;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const go = (p) => {
    if (p < 1 || p > pages || p === page) return;
    onChange(p);
  };

  // Compact window of page numbers
  const windowSize = 5;
  const half = Math.floor(windowSize / 2);
  let from = Math.max(1, page - half);
  let to = Math.min(pages, from + windowSize - 1);
  from = Math.max(1, to - windowSize + 1);
  const numbers = [];
  for (let i = from; i <= to; i++) numbers.push(i);

  return (
    <div className="pagination">
      <div className="muted small">
        Showing <strong>{start}</strong>–<strong>{end}</strong> of <strong>{total}</strong>
      </div>
      <div className="pager">
        <button className="page-btn" disabled={page <= 1} onClick={() => go(page - 1)}>‹ Prev</button>
        {from > 1 && (
          <>
            <button className="page-btn" onClick={() => go(1)}>1</button>
            {from > 2 && <span className="page-gap">…</span>}
          </>
        )}
        {numbers.map((n) => (
          <button
            key={n}
            className={`page-btn ${n === page ? 'active' : ''}`}
            onClick={() => go(n)}
          >{n}</button>
        ))}
        {to < pages && (
          <>
            {to < pages - 1 && <span className="page-gap">…</span>}
            <button className="page-btn" onClick={() => go(pages)}>{pages}</button>
          </>
        )}
        <button className="page-btn" disabled={page >= pages} onClick={() => go(page + 1)}>Next ›</button>
      </div>
    </div>
  );
}

export default Pagination;
