'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  TimeGridContainer,
  TimeGridWrapper,
  DayHeader,
  TimeLabel,
  TimeCell,
} from './style';

type Cell = { r: number; c: number }; // r=시간, c=요일
type Props = {
  onChange?: (selectedCount: number) => void; // 셀 선택
};

const DAYS = ['월', '화', '수', '목', '금', '토', '일'] as const;

const START_HOUR = 11;
const END_HOUR = 21;
const ROWS = END_HOUR - START_HOUR; // 10
const COLS = DAYS.length;

// 시간 표시
const SHOW_LABEL_HOURS = new Set([12, 15, 18]);

const keyOf = (cell: Cell) => `${cell.r},${cell.c}`;

export default function TimeGrid({ onChange }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const isPressing = useRef(false);
  const lastHit = useRef<string | null>(null);
  const paintMode = useRef<'PAINT' | 'ERASE'>('PAINT');

  const isSelected = (cell: Cell) => selected.has(keyOf(cell));

  const setCell = (cell: Cell, mode: 'PAINT' | 'ERASE') => {
    const k = keyOf(cell);
    setSelected((prev) => {
      const next = new Set(prev);
      if (mode === 'PAINT') next.add(k);
      else next.delete(k);
      return next;
    });
  };

  const hitTestCell = (x: number, y: number): Cell | null => {
    const el = document.elementFromPoint(x, y) as HTMLElement | null;
    if (!el) return null;

    const cellEl = el.closest('[data-cell="1"]') as HTMLElement | null;
    if (!cellEl) return null;

    const r = Number(cellEl.dataset.r);
    const c = Number(cellEl.dataset.c);
    if (Number.isNaN(r) || Number.isNaN(c)) return null;

    return { r, c };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);

    isPressing.current = true;
    lastHit.current = null;

    const cell = hitTestCell(e.clientX, e.clientY);
    if (!cell) return;

    paintMode.current = isSelected(cell) ? 'ERASE' : 'PAINT';
    setCell(cell, paintMode.current);
    lastHit.current = keyOf(cell);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPressing.current) return;

    const cell = hitTestCell(e.clientX, e.clientY);
    if (!cell) return;

    const k = keyOf(cell);
    if (k === lastHit.current) return;

    setCell(cell, paintMode.current);
    lastHit.current = k;
  };

  const onPointerUp = () => {
    isPressing.current = false;
    lastHit.current = null;
  };

  useEffect(() => {
    onChange?.(selected.size);
  }, [selected, onChange]);

  return (
    <TimeGridContainer>
      <TimeGridWrapper
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          gridTemplateColumns: `7px repeat(${COLS}, 1fr)`,
        }}
      >
        {/* (0,0) 빈칸 */}
        <div />

        {/* 요일 헤더 */}
        {DAYS.map((d) => (
          <DayHeader
            key={d}
            style={{
              textAlign: 'center',
              fontWeight: 600,
              padding: '6px 0',
              borderRadius: 10,
              background: '#f3f3f3',
            }}
          >
            {d}
          </DayHeader>
        ))}

        {/* 시간 행 */}
        {Array.from({ length: ROWS }).map((_, r) => {
          const hour = START_HOUR + r;
          const label = SHOW_LABEL_HOURS.has(hour) ? String(hour) : '';

          return (
            <React.Fragment key={r}>
              {/* 시간 라벨 */}
              <TimeLabel>{label}</TimeLabel>

              {/* 요일 셀들 */}
              {Array.from({ length: COLS }).map((__, c) => {
                const cell = { r, c };
                const active = isSelected(cell);

                return (
                  <TimeCell
                    key={`${r}-${c}`}
                    data-cell="1"
                    data-r={r}
                    data-c={c}
                    $active={active}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
      </TimeGridWrapper>
    </TimeGridContainer>
  );
}
