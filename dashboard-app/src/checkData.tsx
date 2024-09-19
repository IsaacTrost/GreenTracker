import { LatLngExpression } from "leaflet";

const SQUARE_MILES_TO_SQUARE_METERS = 2589988.11;

function isRectangleWithinLimit(bounds: LatLngExpression[][], size: number): boolean {
    if (bounds.length !== 2) {
        throw new Error("Bounds should contain exactly two LatLng points.");
    }

    const [point1, point2] = bounds;
    const latDiff = Math.abs(point1[0] - point2[0]);
    const lngDiff = Math.abs(point1[1] - point2[1]);

    // Approximate conversion from degrees to meters
    const latDiffMeters = latDiff * 111320;
    const lngDiffMeters = lngDiff * 40075000 * Math.cos((point1[0] + point2[0]) / 2 * Math.PI / 180) / 360;

    const areaSquareMeters = latDiffMeters * lngDiffMeters;
    const areaSquareMiles = areaSquareMeters / SQUARE_MILES_TO_SQUARE_METERS;

    return areaSquareMiles <= size;
}

export { isRectangleWithinLimit };