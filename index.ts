import * as fs from "fs";
import * as yargs from "yargs";

function pickWinners(
  contestants: string[],
  num: number,
  winners: string[] = []
): string[] {
  if (num > contestants.length) {
    throw new Error("Not enough contestants.");
  }

  if (num === 0) {
    return winners;
  }

  const randomIndex = Math.floor(Math.random() * contestants.length);
  const nextWinner = contestants[randomIndex];

  if (winners.includes(nextWinner)) {
    return pickWinners(contestants, num, winners);
  }

  const winnersSoFar = [...winners, nextWinner];
  return pickWinners(contestants, num - 1, winnersSoFar);
}

const fileNames = fs.readdirSync(`${__dirname}/contestants`);
const contestants = fileNames.map(file => {
  return fs.readFileSync(`${__dirname}/contestants/${file}`, "utf-8");
});

const { number } = yargs
  .usage("Usage: $0 --number [num]")
  .demandOption(["number"]).argv;

const winners = pickWinners(contestants, number as number).join("\n");
fs.writeFile(`${__dirname}/winners.txt`, winners, err => {
  if (err) {
    console.error(`Oops! There was an error: ${err}.`);
  } else {
    console.log(`Done, ${number} winners selected! 🎉 🎉 🎉`);
  }
});
