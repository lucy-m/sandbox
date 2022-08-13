import { render } from '@testing-library/react';

import MyReactLib from './my-react-lib';

describe('MyReactLib', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MyReactLib />);
    expect(baseElement).toBeTruthy();
  });
});
