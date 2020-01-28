import React from 'react';
import { Flex } from '@blockstack/ui';

export const ScreenActions: React.FC = ({ children, ...rest }) => (
  <Flex px={6} {...rest}>
    {children}
  </Flex>
);
