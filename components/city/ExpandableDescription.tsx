"use client";

import { useState } from "react";

const LIMIT = 120;

export default function ExpandableDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > LIMIT;

  return (
    <p className="text-gray-600 text-base leading-relaxed">
      {isLong && !expanded ? (
        <>
          {text.slice(0, LIMIT).trimEnd()}&hellip;{" "}
          <button
            onClick={() => setExpanded(true)}
            className="text-[#E23744] font-semibold hover:underline whitespace-nowrap"
          >
            more
          </button>
        </>
      ) : (
        <>
          {text}{" "}
          {isLong && (
            <button
              onClick={() => setExpanded(false)}
              className="text-[#E23744] font-semibold hover:underline whitespace-nowrap"
            >
              less
            </button>
          )}
        </>
      )}
    </p>
  );
}
