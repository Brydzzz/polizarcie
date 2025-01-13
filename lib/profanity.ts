import { readFileSync } from "fs";

declare global {
  var badWordsList: string[] | undefined;
}

const genBadWordsList = () => {
  console.log("regenerating bad words list");
  const plData = readFileSync(
    process.cwd() + "/public/badWords/pl.txt",
    "utf-8"
  )
    .toString()
    .split("\n");
  const enData = readFileSync(
    process.cwd() + "/public/badWords/en.txt",
    "utf-8"
  )
    .toString()
    .split("\n");
  return [...plData, ...enData];
};

export const getProfanityGuard = () => {
  try {
    if (!globalThis.badWordsList) globalThis.badWordsList = genBadWordsList();

    const censor = (input: string) => {
      if (!input) {
        return input;
      }
      const segmenter = new Intl.Segmenter([], { granularity: "word" });
      const segmentedText = segmenter.segment(input);
      return Array.from(segmentedText)
        .map((segment) => {
          const word = segment.segment;
          if (!segment.isWordLike) return word;
          const wordExp = new RegExp(
            `^${segment.segment.replace(/[^0-9\p{L}]/gu, "")}$`,
            "giu"
          );
          return globalThis.badWordsList?.some((badWord) =>
            wordExp.test(badWord)
          )
            ? word.replace(/./g, "*")
            : word;
        })
        .join("");
    };

    return { censor };
  } catch (error) {
    console.log(error);
    const censor = (input: string) => input;
    return { censor };
  }
};
