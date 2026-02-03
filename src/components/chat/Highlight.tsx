'use client';

export default function Highlight({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight.trim()) {
    return <>{text}</>;
  }

  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-accent/50 rounded-sm px-0.5 py-0">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}
