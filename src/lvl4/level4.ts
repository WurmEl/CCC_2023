import * as fs from "fs";
import { TileType } from "../models/tile-type.enum";
import { Point2D } from "../models/point2D.model";
import { Level4Route } from "./lvl4-route";

export function level4(inFilePath, outFilePath): void {
  const fileContent = fs.readFileSync(inFilePath, "utf8");

  const lines = fileContent.split("\n");

  const mapSize = +lines[0];

  const tileMap: TileType[][] = [];
  const bitmap: boolean[][] = [];

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
      row.push(tileMap[i][j] === TileType.L ? false : true);
    }
    bitmap.push(row);
  }

  const additionalData = lines.slice(mapSize + 1);

  const numberOfCoordinates = +additionalData[0];

  let output = "";

  for (let i = 1; i <= numberOfCoordinates; i++) {
    const coordinates = additionalData[i].split(" ");

    const startPoint = new Point2D(
      +coordinates[0].split(",")[1],
      +coordinates[0].split(",")[0]
    );

    const endPoint = new Point2D(
      +coordinates[1].split(",")[1],
      +coordinates[1].split(",")[0]
    );

    const route = new Level4Route(
      startPoint,
      endPoint,
      bitmap,
      mapSize * 2 - 1
    );
    // calc valid route
    route.calculateValidRoute();
    output += route.routeToString() + "\n";
  }
  fs.writeFileSync(outFilePath, output);
}
