import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MyReactLib } from './my-react-lib';

export default {
  component: MyReactLib,
  title: 'MyReactLib',
} as ComponentMeta<typeof MyReactLib>;

const Template: ComponentStory<typeof MyReactLib> = (args) => (
  <MyReactLib {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
