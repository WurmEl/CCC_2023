import { Point2D } from "../models/point2D.model";

export class Route {
  totalRoute: SimpleRoute[] = [];

  constructor(coordinates: Point2D[]) {
    let prevPoint: Point2D = coordinates[0];

    for (let i = 1; i < coordinates.length; i++) {
      this.totalRoute.push(new SimpleRoute(prevPoint, coordinates[i]));
      prevPoint = coordinates[i];
    }
  }

  isValid(): boolean {
    const visitedCoordinates: Point2D[] = [];

    for (const currRoute of this.totalRoute) {
      visitedCoordinates.push(currRoute.startPoint);

      // check already visited
      if (
        visitedCoordinates.filter((vc) => vc.comparePoint(currRoute.endPoint))
          .length
      )
        return false;

      // check diagonals
      if (currRoute.isDiagonal()) {
        const pointToCheck1 = new Point2D(
          currRoute.startPoint.x,
          currRoute.endPoint.y
        );
        const pointToCheck2 = new Point2D(
          currRoute.endPoint.x,
          currRoute.startPoint.y
        );
        if (
          this.totalRoute.some(
            (route) =>
              (route.startPoint.comparePoint(pointToCheck1) &&
                route.endPoint.comparePoint(pointToCheck2)) ||
              (route.startPoint.comparePoint(pointToCheck2) &&
                route.endPoint.comparePoint(pointToCheck1))
          )
        )
          return false;
      }
    }

    return true;
  }
}

export class SimpleRoute {
  startPoint: Point2D;
  endPoint: Point2D;

  constructor(startPoint: Point2D, endPoint: Point2D) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;
  }

  isDiagonal(): boolean {
    return (
      this.startPoint.x !== this.endPoint.x &&
      this.startPoint.y !== this.endPoint.y
    );
  }
}
