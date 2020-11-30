import { makeSpringBezierMaker } from '.';
import {
  addPoint,
  p,
  Point,
  Sharp,
  SpringProperties,
  VertexShape,
  Zero,
} from '../../shapes';
import { unique } from '../../util';
import {
  SpringBezierFn,
  SpringBezierMaker,
  SpringBezierShape,
} from './spring-bezier-vertex';

describe('spring-bezier-vertex', () => {
  const makeSquare = (origin: Point): VertexShape => ({
    start: Sharp(origin),
    subsequent: [
      Sharp(addPoint(origin, p(1, 0))),
      Sharp(addPoint(origin, p(1, 1))),
      Sharp(addPoint(origin, p(0, 1))),
    ],
  });

  const makeTriangle = (origin: Point): VertexShape => ({
    start: Sharp(origin),
    subsequent: [
      Sharp(addPoint(origin, p(1, 0))),
      Sharp(addPoint(origin, p(0, 1))),
    ],
  });

  let bezierMaker: SpringBezierMaker;
  let springProperties: SpringProperties;
  const zeroSpring = () => ({
    endPoint: Zero,
    position: Zero,
    velocity: Zero,
    properties: springProperties,
  });

  beforeEach(() => {
    springProperties = {
      stiffness: 1,
      weight: 10,
      friction: 10,
    };
    bezierMaker = makeSpringBezierMaker(springProperties, false);
  });

  describe('bezierMaker', () => {
    describe('for a square', () => {
      let springShape: SpringBezierShape;

      beforeEach(() => {
        springShape = bezierMaker.shape(makeSquare(Zero));
      });

      it('creates springs correctly', () => {
        const expected: SpringBezierShape = {
          start: {
            deleted: false,
            inGradient: zeroSpring(),
            outGradient: zeroSpring(),
            position: zeroSpring(),
          },
          subsequent: [
            {
              deleted: false,
              inGradient: zeroSpring(),
              outGradient: zeroSpring(),
              position: {
                position: p(1, 0),
                endPoint: p(1, 0),
                velocity: Zero,
                properties: springProperties,
              },
            },
            {
              deleted: false,
              inGradient: zeroSpring(),
              outGradient: zeroSpring(),
              position: {
                position: p(1, 1),
                endPoint: p(1, 1),
                velocity: Zero,
                properties: springProperties,
              },
            },
            {
              deleted: false,
              inGradient: zeroSpring(),
              outGradient: zeroSpring(),
              position: {
                position: p(0, 1),
                endPoint: p(0, 1),
                velocity: Zero,
                properties: springProperties,
              },
            },
          ],
        };

        expect(springShape).toEqual(expected);
      });
    });
  });

  describe('spacedMorph', () => {
    describe('for a square', () => {
      let initialSquare: VertexShape;
      let initialSpringShape: SpringBezierShape;

      beforeEach(() => {
        initialSquare = makeSquare(Zero);
        initialSpringShape = bezierMaker.shape(initialSquare);
      });

      describe('morphing to the same shape', () => {
        let newSpringShape: SpringBezierShape;

        beforeEach(() => {
          newSpringShape = SpringBezierFn.spacedMorph(
            initialSpringShape,
            initialSquare
          );
        });

        it('does nothing', () => {
          expect(newSpringShape).toEqual(initialSpringShape);
        });
      });

      describe('morphing to a translated square', () => {
        let newSquare: VertexShape;
        let newSpringShape: SpringBezierShape;

        beforeEach(() => {
          newSquare = makeSquare(p(1, 0));
          newSpringShape = SpringBezierFn.spacedMorph(
            initialSpringShape,
            newSquare
          );
        });

        it('updates springs correctly', () => {
          const expected: SpringBezierShape = {
            start: {
              deleted: false,
              inGradient: zeroSpring(),
              outGradient: zeroSpring(),
              position: {
                position: p(0, 0),
                endPoint: p(1, 0),
                velocity: Zero,
                properties: springProperties,
              },
            },
            subsequent: [
              {
                deleted: false,
                inGradient: zeroSpring(),
                outGradient: zeroSpring(),
                position: {
                  position: p(1, 0),
                  endPoint: p(2, 0),
                  velocity: Zero,
                  properties: springProperties,
                },
              },
              {
                deleted: false,
                inGradient: zeroSpring(),
                outGradient: zeroSpring(),
                position: {
                  position: p(1, 1),
                  endPoint: p(2, 1),
                  velocity: Zero,
                  properties: springProperties,
                },
              },
              {
                deleted: false,
                inGradient: zeroSpring(),
                outGradient: zeroSpring(),
                position: {
                  position: p(0, 1),
                  endPoint: p(1, 1),
                  velocity: Zero,
                  properties: springProperties,
                },
              },
            ],
          };

          expect(newSpringShape).toEqual(expected);
        });
      });

      describe('morphing to a triangle', () => {
        let triangle: VertexShape;
        let newSpringShape: SpringBezierShape;

        beforeEach(() => {
          triangle = makeTriangle(Zero);
          newSpringShape = SpringBezierFn.spacedMorph(
            initialSpringShape,
            triangle
          );
        });

        it('collapses two vertices together', () => {
          const posEndPoints = [
            newSpringShape.start,
            ...newSpringShape.subsequent,
          ].map((s) => s.position.endPoint);

          const uniqueEndPoints = unique(posEndPoints);
          expect(uniqueEndPoints.length).toBe(3);
        });

        it('end points are all on triangle', () => {
          const posEndPoints = [
            newSpringShape.start,
            ...newSpringShape.subsequent,
          ].map((s) => s.position.endPoint);

          const uniqueEndPoints = unique(posEndPoints);

          const expected = [Zero, p(1, 0), p(0, 1)];

          expect(uniqueEndPoints).toEqual(expected);
        });
      });
    });

    describe('for a triangle', () => {
      let initialTriangle: VertexShape;
      let initialSpringShape: SpringBezierShape;

      beforeEach(() => {
        initialTriangle = makeTriangle(Zero);
        initialSpringShape = bezierMaker.shape(initialTriangle);
      });

      describe('morphing to a square', () => {
        let square: VertexShape;
        let newSpringShape: SpringBezierShape;

        beforeEach(() => {
          square = makeSquare(Zero);
          newSpringShape = SpringBezierFn.spacedMorph(
            initialSpringShape,
            square
          );
        });

        it('creates an extra vertex', () => {
          const vertexCount = newSpringShape.subsequent.length + 1;
          expect(vertexCount).toBe(4);
        });

        it('start points are all on triangle', () => {
          const startPoints = [
            newSpringShape.start,
            ...newSpringShape.subsequent,
          ].map((s) => s.position.position);

          const uniqueStartPoints = unique(startPoints);

          const expected = [Zero, p(1, 0), p(0, 1)];

          expect(uniqueStartPoints).toEqual(expected);
        });

        it('end points are all on square', () => {
          const endPoints = [
            newSpringShape.start,
            ...newSpringShape.subsequent,
          ].map((s) => s.position.endPoint);

          const expected = [Zero, p(1, 0), p(1, 1), p(0, 1)];

          expect(endPoints).toEqual(expected);
        });
      });
    });
  });
});
