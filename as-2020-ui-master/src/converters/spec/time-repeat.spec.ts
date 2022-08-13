import { Time, TimeConverter } from '../model';
import { TimeRepeat } from '../time-repeat';

export default fdescribe('TimeRepeat', () => {
  describe('For a valid interval', () => {
    let timeRepeat: TimeConverter;

    beforeEach(() => {
      timeRepeat = TimeRepeat(2, 8);
    });

    it('A time inside the interval is itself', () => {
      const time = 5;
      const convertedTime = timeRepeat.convert({ time }).time;

      expect(convertedTime).toBe(time);
    });

    it('A time before the interval is itself', () => {
      const time = 1;
      const convertedTime = timeRepeat.convert({ time }).time;

      expect(convertedTime).toBe(time);
    });

    it('A time after the interval is set inside the interval', () => {
      const time = 10;
      const convertedTime = timeRepeat.convert({ time }).time;

      expect(convertedTime).toBe(4);
    });
  });

  describe('For an invalid interval', () => {
    it('Throws exception', () => {
      expect(() => TimeRepeat(8, 2)).toThrowError();
    });
  });
});
