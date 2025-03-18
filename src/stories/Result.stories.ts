import type { Meta, StoryObj } from '@storybook/react';
import { Result } from '../components/Result';

const meta: Meta<typeof Result> = {
    component: Result,
    tags: ['autodocs']
};

export default meta;

export const Default: StoryObj<typeof Result> = {
  args: {},
};