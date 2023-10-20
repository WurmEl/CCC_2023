export class Level4Route {
  routeStartPoint: Point2D;
  routeEndPoint: Point2D;
  islandBitMap: boolean[][];
  maxRouteLength: number;

  routeCoordinates: Point2D[];

  constructor(
    start: Point2D,
    end: Point2D,
    islandBitMap: boolean[][],
    maxRouteLength: number
  ) {
    this.routeStartPoint = start;
    this.routeEndPoint = end;
    this.islandBitMap = islandBitMap;
    this.maxRouteLength = maxRouteLength;
  }

  calculateValidRoute(): void {
    const openList: Point2D[] = [this.routeStartPoint];
    const cameFrom: { [key: string]: Point2D | undefined } = {};

    const gScore: { [key: string]: number } = {};
    gScore[this.routeStartPoint.x + "," + this.routeStartPoint.y] = 0;

    const fScore: { [key: string]: number } = {};
    fScore[this.routeStartPoint.x + "," + this.routeStartPoint.y] =
      this.heuristic(this.routeStartPoint, this.routeEndPoint);

    while (openList.length > 0) {
      // find lowest fScore
      openList.sort(
        (a, b) => fScore[a.x + "," + a.y] - fScore[b.x + "," + b.y]
      );
      const current: Point2D = openList.shift();

      if (current.comparePoint(this.routeEndPoint)) {
        // found path
        this.reconstructPath(
          cameFrom,
          this.routeStartPoint,
          this.routeEndPoint
        );
        return;
      }

      for (const neighbor of this.getNeighbors(current)) {
        const tentativeGScore = gScore[current.x + "," + current.y] + 1;

        if (
          !gScore[neighbor.x + "," + neighbor.y] ||
          tentativeGScore < gScore[neighbor.x + "," + neighbor.y]
        ) {
          // better path
          cameFrom[neighbor.x + "," + neighbor.y] = current;
          gScore[neighbor.x + "," + neighbor.y] = tentativeGScore;
          fScore[neighbor.x + "," + neighbor.y] =
            gScore[neighbor.x + "," + neighbor.y] +
            this.heuristic(neighbor, this.routeEndPoint);

          if (!openList.some((p) => p.comparePoint(neighbor))) {
            openList.push(neighbor);
          }
        }
      }
    }
  }

  heuristic(pointA: Point2D, pointB: Point2D): number {
    return Math.abs(pointA.x - pointB.x) + Math.abs(pointA.y - pointB.y);
  }

  getNeighbors(point: Point2D): Point2D[] {
    const neighbors: Point2D[] = [];

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;

        const neighbor = new Point2D(point.x + dx, point.y + dy);
        if (
          this.isValidPoint(neighbor) &&
          (dx === 0 || dy === 0 || this.areTwoPointsDiagonal(point, neighbor))
        ) {
          neighbors.push(neighbor);
        }
      }
    }
    return neighbors;
  }

  isValidPoint(point: Point2D): boolean {
    return (
      point.x >= 0 &&
      point.x < this.islandBitMap.length &&
      point.y >= 0 &&
      point.y < this.islandBitMap[0].length &&
      this.islandBitMap[point.x][point.y]
    );
  }

  reconstructPath(
    cameFrom: { [key: string]: Point2D | undefined },
    startPoint: Point2D,
    endPoint: Point2D
  ): void {
    const path: Point2D[] = [endPoint];
    let current = endPoint;

    while (!current.comparePoint(startPoint)) {
      const parent = cameFrom[current.x + "," + current.y];
      if (!parent) {
        console.log("error");
        return null;
      }
      path.unshift(parent);
      current = parent;
    }

    console.log(path);
    this.routeCoordinates = path;
  }

  areTwoPointsDiagonal(pointA: Point2D, pointB: Point2D): boolean {
    return pointA.x !== pointB.x && pointA.y !== pointB.y;
  }

  routeToString(): string {
    return this.routeCoordinates
      .map((c) => c.y.toString() + "," + c.x.toString())
      .join(" ");
  }
}

export class Point2D {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  comparePoint(point: Point2D): boolean {
    return this.x === point.x && this.y === point.y;
  }
}
