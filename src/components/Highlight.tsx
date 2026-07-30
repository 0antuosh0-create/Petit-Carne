import { Fragment } from "react";

/** Accent-insensitive fold: café → cafe, ÉTOILE → etoile. */
function fold(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * Highlights matches in `text` for every word in `query`.
 * Accent- and case-insensitive: typing "cafe" lights up "café".
 * Uses Array.from so multi-byte characters (é, emoji) map correctly.
 */
export default function Highlight({ text, query }: { text: string; query: string }) {
  const words = query
    .split(/\s+/)
    .map((word) => fold(word).replace(/[^\p{L}\p{N}]/gu, ""))
    .filter((word) => word.length > 0);

  if (!words.length) return <>{text}</>;

  const originalChars = Array.from(text);
  const foldedChars: string[] = [];
  /** Index in `foldedChars` → index of the originating char in `originalChars`. */
  const origin: number[] = [];

  originalChars.forEach((character, index) => {
    for (const foldedCharacter of Array.from(fold(character))) {
      foldedChars.push(foldedCharacter);
      origin.push(index);
    }
  });

  const foldedText = foldedChars.join("");
  const marked = new Array(originalChars.length).fill(false);

  for (const word of words) {
    let cursor = foldedText.indexOf(word);
    while (cursor !== -1) {
      const start = origin[cursor];
      const end = origin[cursor + word.length - 1];
      if (start !== undefined && end !== undefined) {
        for (let index = start; index <= end; index += 1) marked[index] = true;
      }
      cursor = foldedText.indexOf(word, cursor + word.length);
    }
  }

  const chunks: { text: string; mark: boolean }[] = [];
  originalChars.forEach((character, index) => {
    const current = chunks[chunks.length - 1];
    if (current?.mark === marked[index]) current.text += character;
    else chunks.push({ text: character, mark: marked[index] });
  });

  return (
    <>
      {chunks.map((chunk, index) =>
        chunk.mark ? (
          <mark key={index}>{chunk.text}</mark>
        ) : (
          <Fragment key={index}>{chunk.text}</Fragment>
        ),
      )}
    </>
  );
}
