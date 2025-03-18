import type { Meta, StoryObj } from '@storybook/react';
import { Field } from '../components/Field';
import '../styles/style.css'

const meta: Meta<typeof Field> = {
    component: Field,
    tags: ['autodocs']
};

export default meta;

export const Default: StoryObj<typeof Field> = {
    args: {},
};