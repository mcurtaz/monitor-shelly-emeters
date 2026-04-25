import { lightColors, darkColors, Colors } from './colors';

export type Theme = {
  dark: boolean;
  colors: Colors;
};

export const lightTheme: Theme = {
  dark: false,
  colors: lightColors,
};

export const darkTheme: Theme = {
  dark: true,
  colors: darkColors,
};
