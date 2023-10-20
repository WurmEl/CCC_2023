import * as fs from "fs";
import { TileType } from "../models/tile-type.enum";

export function level1(inFilePath, outFilePath): void {
  const fileContent = fs.readFileSync(inFilePath, "utf8");

  const lines = fileContent.split("\n");

  const size = +lines[0];

  const tileMap: TileType[][] = [];
  for (let i = 1; i <= size; i++) {
    const row = lines[i]
      .trim()
      .split("")
      .map((char) => (char === "L" ? TileType.L : TileType.W));
    tileMap.push(row);
  }

  const additionalData = lines.slice(size + 1);

  const numberOfCoordinates = +additionalData[0];

  let output = "";

  for (let i = 1; i <= numberOfCoordinates; i++) {
    const coordinates = additionalData[i].split(",");
    const row = +coordinates[1];
    const col = +coordinates[0];

    if (row >= 0 && row < size && col >= 0 && col < tileMap[row].length) {
      output += tileMap[row][col] === TileType.L ? "L\n" : "W\n";
    }
  }
  fs.writeFileSync(outFilePath, output);
}
