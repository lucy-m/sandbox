import { Delay } from '../delay';

export default describe('Delay', () => {
  it('Delays time by the given amount', () => {
    const delay = Delay(10);
    const time = 25;
    const convertedTime = delay.convert({ time }).time;

    expect(convertedTime).toBe(15);
  });
});
