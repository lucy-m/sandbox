import { TimeStretch } from '../time-stretch';

export default describe('TimeStretch', () => {
  it('Stretches time by the given factor', () => {
    const time = 100;
    const timeStretch = TimeStretch(200);
    const convertedTime = timeStretch.convert({ time }).time;
    expect(convertedTime).toBe(0.5);
  });
});
