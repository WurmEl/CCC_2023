import * as fs from "fs";
import { TileType } from "../models/tile-type.enum";
import { Point2D } from "../models/point2D.model";
import { Island } from "./island";
import { SameIsland } from "../models/same-island.enum";

export function level2(inFilePath, outFilePath): void {
  const fileContent = fs.readFileSync(inFilePath, "utf8");

  const lines = fileContent.split("\n");

  const mapSize = +lines[0];

  const tileMap: TileType[][] = [];
  const bitmap: boolean[][] = [];

  const islands: Island[] = [];

  for (let i = 1; i <= mapSize; i++) {
    const row = lines[i]
      .trim()
      .split("")
      .map((char) => (char === "L" ? TileType.L : TileType.W));
    tileMap.push(row);
  }

  // init bitmap
  for (let i = 0; i < mapSize; i++) {
    const row: boolean[] = [];
    for (let j = 0; j < mapSize; j++) {
      row.push(false);
    }
    bitmap.push(row);
  }

  //calc islands
  for (let row = 0; row < mapSize; row++) {
    for (let col = 0; col < mapSize; col++) {
      if (checkIfTileIsValid(row, col)) {
        islands.push(calcIsland(row, col));
      }
    }
  }

  function checkIfTileIsValid(row: number, col: number): boolean {
    return (
      row >= 0 &&
      row < mapSize &&
      col >= 0 &&
      col < tileMap[row].length &&
      tileMap[row][col] === TileType.L &&
      !bitmap[row][col]
    );
  }

  function calcIsland(x: number, y: number): Island {
    const island: Island = new Island();
    bitmap[x][y] = true;
    island.coordinates = [{ x, y }];

    expandIslandRecursive(island, x, y);

    return island;
  }

  function expandIslandRecursive(island: Island, x: number, y: number): void {
    if (checkIfTileIsValid(x + 1, y)) {
      bitmap[x + 1][y] = true;
      island.coordinates.push({ x: x + 1, y });
      expandIslandRecursive(island, x + 1, y);
    }
    if (checkIfTileIsValid(x - 1, y)) {
      bitmap[x - 1][y] = true;
      island.coordinates.push({ x: x - 1, y });
      expandIslandRecursive(island, x - 1, y);
    }
    if (checkIfTileIsValid(x, y + 1)) {
      bitmap[x][y + 1] = true;
      island.coordinates.push({ x, y: y + 1 });
      expandIslandRecursive(island, x, y + 1);
    }
    if (checkIfTileIsValid(x, y - 1)) {
      bitmap[x][y - 1] = true;
      island.coordinates.push({ x, y: y - 1 });
      expandIslandRecursive(island, x, y - 1);
    }
  }

  const additionalData = lines.slice(mapSize + 1);

  const numberOfCoordinates = +additionalData[0];

  let output = "";

  for (let i = 1; i <= numberOfCoordinates; i++) {
    const coordinates = additionalData[i].split(" ");

    const point1: Point2D = {
      x: +coordinates[0].split(",")[1],
      y: +coordinates[0].split(",")[0],
    };

    const point2: Point2D = {
      x: +coordinates[1].split(",")[1],
      y: +coordinates[1].split(",")[0],
    };

    output +=
      (islands.some((island) => island.containsTwoPoints(point1, point2))
        ? SameIsland.SAME
        : SameIsland.DIFFERENT) + "\n";
  }
  fs.writeFileSync(outFilePath, output);
}
