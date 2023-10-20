import { level4 } from "./lvl4/level4";

const levelPath = "./res/lvl4/level4_";
const levelOutPath = "./out/lvl4/level4_";
const fileCount = 1;

let i = 1;

while (i <= fileCount) {
  const inPath = levelPath + i + ".in";
  const outPath = levelOutPath + i + ".out";

  // level1(inPath, outPath);
  // level2(inPath, outPath);
  // level3(inPath, outPath);
  level4(levelPath + "example.in", levelPath + "example_mine.out");

  i++;
}
