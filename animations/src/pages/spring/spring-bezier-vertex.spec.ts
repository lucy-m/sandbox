import { makeSpringBezierMaker } from '.';
import {
  addPoint,
  p,
  Point,
  Sharp,
  Smooth,
  SpringProperties,
  Vertex,
  VertexShape,
  Zero,
} from '../../shapes';
import { unique } from '../../util';
import {
  morphOne,
  SpringBezierFn,
  SpringBezierMaker,
  SpringBezierShape,
  SpringBezierVertex,
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

  describe('morphOne', () => {
    let spring: SpringBezierVertex;
    let vertex: Vertex;

    beforeEach(() => {
      spring = bezierMaker.vertex(Smooth(p(1, 1), p(1, 0)));
      vertex = Smooth(p(2, 1), p(2, 0));
    });

    interface TestCase {
      mergeTo: 'next' | 'previous' | 'none';
      splitFrom: 'next' | 'previous' | 'none';
      outGradientEndPoint: 'target' | Point;
      outGradientStart: 'original' | Point;
      inGradientEndPoint: 'target' | Point;
      inGradientStart: 'original' | Point;
    }

    const testCases: TestCase[] = [
      {
        mergeTo: 'none',
        splitFrom: 'none',
        outGradientEndPoint: 'target',
        outGradientStart: 'original',
        inGradientEndPoint: 'target',
        inGradientStart: 'original',
      },
      {
        mergeTo: 'next',
        splitFrom: 'none',
        outGradientEndPoint: Zero,
        outGradientStart: 'original',
        inGradientEndPoint: 'target',
        inGradientStart: 'original',
      },
      {
        mergeTo: 'previous',
        splitFrom: 'none',
        outGradientEndPoint: 'target',
        outGradientStart: 'original',
        inGradientEndPoint: Zero,
        inGradientStart: 'original',
      },
      {
        mergeTo: 'none',
        splitFrom: 'next',
        outGradientEndPoint: 'target',
        outGradientStart: Zero,
        inGradientEndPoint: 'target',
        inGradientStart: 'original',
      },
      {
        mergeTo: 'none',
        splitFrom: 'previous',
        outGradientEndPoint: 'target',
        outGradientStart: 'original',
        inGradientEndPoint: 'target',
        inGradientStart: Zero,
      },
    ];

    testCases.forEach((testCase) => {
      describe(`for a point with mergeTo ${testCase.mergeTo} and
      splitFrom ${testCase.splitFrom}`, () => {
        let result: SpringBezierVertex;

        beforeEach(() => {
          result = morphOne(
            spring,
            vertex,
            testCase.mergeTo,
            testCase.splitFrom
          );
        });

        it(
          'sets the out gradient end point to ' + testCase.outGradientEndPoint,
          () => {
            const outGradient = result.outGradient.endPoint;
            const expected =
              testCase.outGradientEndPoint === 'target'
                ? vertex.outGrad
                : testCase.outGradientEndPoint;

            expect(outGradient).toEqual(expected);
          }
        );

        it(
          'sets the out gradient start value to ' + testCase.outGradientStart,
          () => {
            const outGradient = result.outGradient.position;
            const expected =
              testCase.outGradientStart === 'original'
                ? spring.outGradient.position
                : testCase.outGradientStart;

            expect(outGradient).toEqual(expected);
          }
        );

        it(
          'sets the in gradient end point to ' + testCase.inGradientEndPoint,
          () => {
            const inGradient = result.inGradient.endPoint;
            const expected =
              testCase.inGradientEndPoint === 'target'
                ? vertex.inGrad
                : testCase.inGradientEndPoint;

            expect(inGradient).toEqual(expected);
          }
        );

        it(
          'sets the in gradient start value to ' + testCase.inGradientStart,
          () => {
            const inGradient = result.inGradient.position;
            const expected =
              testCase.inGradientStart === 'original'
                ? spring.inGradient.position
                : testCase.inGradientStart;

            expect(inGradient).toEqual(expected);
          }
        );
      });
    });
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
            inGradient: zeroSpring(),
            outGradient: zeroSpring(),
            position: zeroSpring(),
            mergedTo: 'none',
            splitFrom: 'none',
          },
          subsequent: [
            {
              inGradient: zeroSpring(),
              outGradient: zeroSpring(),
              position: {
                position: p(1, 0),
                endPoint: p(1, 0),
                velocity: Zero,
                properties: springProperties,
              },
              mergedTo: 'none',
              splitFrom: 'none',
            },
            {
              inGradient: zeroSpring(),
              outGradient: zeroSpring(),
              position: {
                position: p(1, 1),
                endPoint: p(1, 1),
                velocity: Zero,
                properties: springProperties,
              },
              mergedTo: 'none',
              splitFrom: 'none',
            },
            {
              inGradient: zeroSpring(),
              outGradient: zeroSpring(),
              position: {
                position: p(0, 1),
                endPoint: p(0, 1),
                velocity: Zero,
                properties: springProperties,
              },
              mergedTo: 'none',
              splitFrom: 'none',
            },
          ],
        };

        expect(springShape).toEqual(expected);
      });
    });
  });

  describe('morphFns', () => {
    interface TestCase {
      name: string;
      morphFn: (
        springShape: SpringBezierShape,
        vertexShape: VertexShape
      ) => SpringBezierShape;
    }

    const testCases: TestCase[] = [
      {
        name: 'spacedMorph',
        morphFn: SpringBezierFn.spacedMorph,
      },
      {
        name: 'nearestMorph',
        morphFn: SpringBezierFn.nearestMorph,
      },
    ];

    testCases.forEach((testCase) => {
      describe(`${testCase.name}`, () => {
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
              newSpringShape = testCase.morphFn(
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
              newSpringShape = testCase.morphFn(initialSpringShape, newSquare);
            });

            it('updates springs correctly', () => {
              const expected: SpringBezierShape = {
                start: {
                  inGradient: zeroSpring(),
                  outGradient: zeroSpring(),
                  position: {
                    position: p(0, 0),
                    endPoint: p(1, 0),
                    velocity: Zero,
                    properties: springProperties,
                  },
                  mergedTo: 'none',
                  splitFrom: 'none',
                },
                subsequent: [
                  {
                    inGradient: zeroSpring(),
                    outGradient: zeroSpring(),
                    position: {
                      position: p(1, 0),
                      endPoint: p(2, 0),
                      velocity: Zero,
                      properties: springProperties,
                    },
                    mergedTo: 'none',
                    splitFrom: 'none',
                  },
                  {
                    inGradient: zeroSpring(),
                    outGradient: zeroSpring(),
                    position: {
                      position: p(1, 1),
                      endPoint: p(2, 1),
                      velocity: Zero,
                      properties: springProperties,
                    },
                    mergedTo: 'none',
                    splitFrom: 'none',
                  },
                  {
                    inGradient: zeroSpring(),
                    outGradient: zeroSpring(),
                    position: {
                      position: p(0, 1),
                      endPoint: p(1, 1),
                      velocity: Zero,
                      properties: springProperties,
                    },
                    mergedTo: 'none',
                    splitFrom: 'none',
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
              newSpringShape = testCase.morphFn(initialSpringShape, triangle);
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
              newSpringShape = testCase.morphFn(initialSpringShape, square);
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
  });
});
