import { render } from '@testing-library/react';

import MyReactLibTwo from './my-react-lib-two';

describe('MyReactLibTwo', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MyReactLibTwo />);
    expect(baseElement).toBeTruthy();
  });
});
