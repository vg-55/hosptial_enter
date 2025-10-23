import { extendTheme } from '@chakra-ui/react';

import { colors, spacing, typography } from '@platform/shared';

export const theme = extendTheme({
  colors,
  space: spacing,
  fonts: typography.fonts,
  fontSizes: typography.fontSizes,
  fontWeights: typography.fontWeights,
  lineHeights: typography.lineHeights,
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true,
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.900',
      },
    },
  },
});
