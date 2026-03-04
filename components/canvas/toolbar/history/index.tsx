"use client";
import { Redo, Undo2 } from "lucide-react";
import React from "react";

interface HistoryPillProps {
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

const HistoryPill = ({
  onUndo,
  onRedo,
  canUndo = true,
  canRedo = true,
}: HistoryPillProps) => {
  return (
    <div className="col-span-1 flex justify-start items-center">
      <div className="inline-flex items-center rounded-full backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] p-2 text-neutral-300 saturate-150">
        <button
          type="button"
          aria-label="Undo"
          onClick={onUndo}
          disabled={!canUndo}
          className="inline-grid h-9 w-9 place-items-center rounded-full hover:bg-white/[0.12] transition-all disabled:opacity-50"
        >
          {" "}
          <Undo2 size={18} className="opacity-80 stroke-[1.75]" />
        </button>{" "}
        <span className="mx-1 h-5 w-px rounded bg-white/[0.16]" />
        <button
          type="button"
          aria-label="Redo"
          onClick={onRedo}
          disabled={!canRedo}
          className="inline-grid h-9 w-9 place-items-center rounded-full hover:bg-white/[0.12] transition-all disabled:opacity-50"
        >
          {" "}
          <Redo size={18} className="opacity-80 stroke-[1.75]" />
        </button>
      </div>
    </div>
  );
};

export default HistoryPill;
