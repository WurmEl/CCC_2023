import { Point2D } from "../models/point2D.model";

export class Island {
  public coordinates: Point2D[];

  public containsTwoPoints(point1: Point2D, point2: Point2D): boolean {
    return (
      this.coordinates.some((p) => p.x === point1.x && p.y === point1.y) &&
      this.coordinates.some((p) => p.x === point2.x && p.y === point2.y)
    );
  }
}
