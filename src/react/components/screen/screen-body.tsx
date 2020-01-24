import React from 'react';

import { Stack } from '@blockstack/ui';
import { Title, Body, Pretitle } from '../typography';

interface ScreenBodyProps {
  title: string;
  pretitle?: string | React.ElementType;
  body?: (string | JSX.Element)[];
}

export const ScreenBody: React.FC<ScreenBodyProps> = ({ title, body, pretitle }) => (
  <Stack spacing={2}>
    {pretitle && <Pretitle>{pretitle}</Pretitle>}
    <Title>{title}</Title>
    <Stack spacing={[3, 4]}>
      {body && body.length ? body.map((text, key) => <Body key={key}>{text}</Body>) : body}
    </Stack>
  </Stack>
);
