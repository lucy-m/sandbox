import { Delay } from '../delay';
import { TimeStretch } from '../time-stretch';
import { TimePipe } from '../pipe';

export default describe('TimePipe', () => {
  it('Applies the converters in the given order', () => {
    const delay = Delay(10);
    const stretch = TimeStretch(2);
    const pipe = TimePipe([delay, stretch]);

    const time = 100;
    const convertedTime = pipe.convert({ time }).time;

    // expect the time to be converted to
    // (100 - 10) / 2

    expect(convertedTime).toBe(45);
  });
});
