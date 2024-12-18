import { readFileSync } from "fs";

const genBadWordsList = () => {
  console.log("regenerating bad words list");
  const plData = readFileSync("assets/BadWords/pl.txt", "utf-8")
    .toString()
    .split("\n");
  const enData = readFileSync("assets/BadWords/en.txt", "utf-8")
    .toString()
    .split("\r\n");
  return [...plData, ...enData];
};

const genProfanityGuard = () => {
  try {
    const censor = (input: string) => {
      if (!input) {
        return input;
      }
      const badWordsList = genBadWordsList();
      const segmenter = new Intl.Segmenter([], { granularity: "word" });
      const segmentedText = segmenter.segment(input);
      return Array.from(segmentedText)
        .map((segment) => {
          const word = segment.segment;
          if (!segment.isWordLike) return word;
          return badWordsList.some((badWord) =>
            new RegExp(`^${word.replace(/\P{L}/gu, "")}$`, "giu").test(badWord)
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

export const profanityGuard = genProfanityGuard();
