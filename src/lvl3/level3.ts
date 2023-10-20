import * as fs from "fs";
import { TileType } from "../models/tile-type.enum";
import { Point2D } from "../models/point2D.model";
import { Route } from "./route";
import { ValidRoute } from "../models/valid-route.enum";

export function level3(inFilePath, outFilePath): void {
  const fileContent = fs.readFileSync(inFilePath, "utf8");

  const lines = fileContent.split("\n");

  const mapSize = +lines[0];

  const tileMap: TileType[][] = [];

  for (let i = 1; i <= mapSize; i++) {
    const row = lines[i]
      .trim()
      .split("")
      .map((char) => (char === "L" ? TileType.L : TileType.W));
    tileMap.push(row);
  }

  const additionalData = lines.slice(mapSize + 1);

  const numberOfCoordinates = +additionalData[0];

  let output = "";

  for (let i = 1; i <= numberOfCoordinates; i++) {
    const coordinatePairs = additionalData[i].split(" ");

    const routeCoordinates: Point2D[] = coordinatePairs.map(
      (pair) => new Point2D(+pair.split(",")[1], +pair.split(",")[0])
    );

    const route: Route = new Route(routeCoordinates);
    output += (route.isValid() ? ValidRoute.VALID : ValidRoute.INVALID) + "\n";
  }
  fs.writeFileSync(outFilePath, output);
}
