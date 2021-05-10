import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { create } from 'jss';
import rtl from 'jss-rtl';
import grey from '@material-ui/core/colors/grey';
import { StylesProvider, jssPreset, createMuiTheme, Theme } from '@material-ui/core/styles';

import { getValue, CONFIG_THEME_DIR, CONFIG_PALETTE_COLORS } from './configProvider';
import { Palette, PaletteColor } from '@material-ui/core/styles/createPalette';

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

const direction = getValue(CONFIG_THEME_DIR);
const palette = getValue(CONFIG_PALETTE_COLORS);

// must change dir on <body> tag
document.body.setAttribute('dir', direction);

export interface CustomTheme extends Theme {
  palette: CustomPaletteInterface;
}

export interface CustomPaletteInterface extends Palette {
  primary: CustomPrimaryInterface;
}

export interface CustomPrimaryInterface extends PaletteColor {
  appPrimaryBackgroundColor: string;
  appPrimaryLightBackgroundColor: string;
  appSecondaryBackgroundColor: string;
  appPrimaryTextColor: string;
  appSecondaryTextColor: string;
  appPrimaryDisableTextColor: string;
  appPrimaryDividerColor: string;
  appPrimaryIconColor: string;
  appPrimaryDisableIconColor: string;
}

export const themeParams = {
  direction: direction, // Both here and <body dir="rtl">
  palette: {
    // type: 'dark',
    primary: {
      main: '#26394b',
      appPrimaryBackgroundColor: '#eef1f5',
      appPrimaryLightBackgroundColor: grey[200],
      appSecondaryBackgroundColor: 'rgba(255, 255, 255, 1)',
      appPrimaryTextColor: 'rgba(0, 0, 0, 0.87)' /* hsl(240, 5%, 28%), */,
      appSecondaryTextColor: 'rgba(0, 0, 0, 0.54)',
      appPrimaryDisableTextColor: 'rgba(0, 0, 0, 0.38)',
      appPrimaryDividerColor: 'rgba(0, 0, 0, 0.12)',
      appPrimaryIconColor: 'rgba(0, 0, 0, 0.7)' /* original alpha in material: 54% */,
      appPrimaryDisableIconColor: 'rgba(0, 0, 0, 0.38)',
      gradientAppBar: 'linear-gradient(180deg, #26394B 0%, #495D70 99.99%)',
    },
    secondary: {
      main: '#2bbdb9',
    },
    warning: {
      main: '#f3a200',
    },
    ...palette,
  },
  typography: {
    useNextVariants: true,
    // https://material-ui.com/customization/themes/#typography
    body2: {
      fontWeight: 600,
    },
    fontFamily: [
      'WebErpFont',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
};

const theme = createMuiTheme(themeParams);

function RawAppLayoutDirection(props) {
  return <StylesProvider jss={jss}>{props.children}</StylesProvider>;
}

RawAppLayoutDirection.propTypes = {
  children: PropTypes.any.isRequired,
};

export const AppLayoutDirection = memo(RawAppLayoutDirection);

export default theme;
