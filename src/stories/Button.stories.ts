import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from '../components/Button';
import '../styles/style.css'

const meta: Meta<typeof Button> = {
    component: Button,
    tags: ['autodocs']
};

export default meta;

export const Default: StoryObj<typeof Button> = {
    args: {
        handleClick: fn()
    },
};