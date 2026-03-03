'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';

type Cell = { r: number; c: number }; // r=시간, c=요일
export type Slot = { day: number; hour: number }; // day=0~6, hour=11~20
type Props = {
  value?: Slot[];
  onChange?: (selected: Slot[]) => void; // 셀 선택
  disabledCell?: (slot: Slot) => boolean; // 셀 비활성화 여부
};

const DAYS = ['월', '화', '수', '목', '금', '토', '일'] as const;

const START_HOUR = 11;
const END_HOUR = 21;
const ROWS = END_HOUR - START_HOUR; // 10
const COLS = DAYS.length;

// 시간 표시
const SHOW_LABEL_HOURS = new Set([12, 15, 18]);

const keyOf = (cell: Cell) => `${cell.r},${cell.c}`;
const parseKey = (key: string): Cell => {
  const [r, c] = key.split(',').map(Number);
  return { r, c };
};

// Cell -> Slot
const cellToSlot = (cell: Cell): Slot => ({
  day: cell.c,
  hour: START_HOUR + cell.r,
});

// Slot -> Cell
const slotToCell = (slot: Slot): Cell => ({
  r: slot.hour - START_HOUR,
  c: slot.day,
});

// slot 배열 -> Set<String>
const slotsToKeySet = (slots: Slot[]) => {
  const set = new Set<string>();
  for (const slot of slots) {
    const cell = slotToCell(slot);
    if (cell.r >= 0 && cell.r < ROWS && cell.c >= 0 && cell.c < COLS) {
      set.add(keyOf(cell));
    }
  }
  return set;
};

const signatureOf = (set: Set<string>) => Array.from(set).sort().join('|');

export default function TimeGrid({
  value = [],
  onChange,
  disabledCell,
}: Props) {
  // 외부 value -> Set
  const externalKeySet = useMemo(() => slotsToKeySet(value), [value]);
  const externalSig = useMemo(
    () => signatureOf(externalKeySet),
    [externalKeySet],
  );

  // 내부 선택 상태
  const [selected, setSelected] = useState<Set<string>>(() => externalKeySet);

  // emit 중복 방지
  const lastEmittedRef = useRef<string>(externalSig);

  // 언마운트 직전 최종 커밋용
  const latestSelectedRef = useRef<Set<string>>(selected);
  useEffect(() => {
    latestSelectedRef.current = selected;
  }, [selected]);

  // 외부 value 동기화
  useEffect(() => {
    setSelected((prev) => {
      const prevSig = signatureOf(prev);
      if (prevSig === externalSig) return prev;
      lastEmittedRef.current = externalSig;
      return externalKeySet;
    });
  }, [externalKeySet, externalSig]);

  const isPressing = useRef(false);
  const lastHit = useRef<string | null>(null);
  const paintMode = useRef<'PAINT' | 'ERASE'>('PAINT');

  const isSelected = (cell: Cell) => selected.has(keyOf(cell));

  const isDisabled = (cell: Cell) => {
    const slot = cellToSlot(cell);
    return disabledCell?.(slot) ?? false;
  };

  const setCell = (cell: Cell, mode: 'PAINT' | 'ERASE') => {
    if (isDisabled(cell)) return;

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
    if (isDisabled(cell)) return;

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
    if (isDisabled(cell)) return;

    setCell(cell, paintMode.current);
    lastHit.current = k;
  };

  const onPointerUp = () => {
    isPressing.current = false;
    lastHit.current = null;
  };

  useEffect(() => {
    if (!onChange) return;

    const keys = Array.from(selected).sort();
    const sig = keys.join('|');

    if (sig === lastEmittedRef.current) return;
    lastEmittedRef.current = sig;

    const nextSlots: Slot[] = keys.map((k) => cellToSlot(parseKey(k)));
    onChange(nextSlots);
  }, [selected, onChange]);

  useEffect(() => {
    return () => {
      if (!onChange) return;

      const keys = Array.from(latestSelectedRef.current).sort();
      const sig = keys.join('|');

      if (sig === lastEmittedRef.current) return;
      lastEmittedRef.current = sig;

      const nextSlots: Slot[] = keys.map((k) => cellToSlot(parseKey(k)));
      onChange(nextSlots);
    };
  }, [onChange]);

  // 비활성 셀 제거
  useEffect(() => {
    if (!disabledCell) return;

    setSelected((prev) => {
      let changed = false;
      const next = new Set(prev);
      for (const k of prev) {
        const slot = cellToSlot(parseKey(k));
        if (disabledCell(slot)) {
          next.delete(k);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [disabledCell]);

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
              <TimeLabel>{label}</TimeLabel>

              {Array.from({ length: COLS }).map((__, c) => {
                const cell = { r, c };
                const active = isSelected(cell);

                return (
                  <TimeCell
                    key={`${r}-${c}`}
                    data-cell="1"
                    data-r={r}
                    data-c={c}
                    $disabled={isDisabled(cell)}
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

const TimeGridContainer = styled.div`
  margin-top: 21px;
  margin-bottom: 100px;
`;

const TimeGridWrapper = styled.div`
  display: grid;
  gap: 6px;
  user-select: none;
  touch-action: none;
`;

const DayHeader = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #707070;
  line-height: 145%;
  text-align: center;
  letter-spacing: -0.01em;
`;

const TimeLabel = styled.div`
  text-align: right;
  font-size: 10px;
  color: #d6d6d6;
  font-weight: 500;
  line-height: 145%;
  letter-spacing: -0.01em;
`;

const TimeCell = styled.div<{ $disabled: boolean; $active: boolean }>`
  height: 30px;
  border: 1px solid #d6d6d6;
  background-color: ${({ $disabled, $active }) =>
    $disabled ? '#f3f3f3' : $active ? '#FFEEE5' : '#ffffff'};
`;
