import type * as SolarIcons from '@solar-icons/vue';

export type IconName = keyof typeof SolarIcons;

export interface Props {
  name: IconName;
  weight?: 'Bold' | 'Linear' | 'Outline' | 'BoldDuotone' | 'LineDuotone' | 'Broken';
  color?: string;
  size?: string | number;
  mirrored?: boolean;
  alt?: string;
}
