import React from 'react';
import {
  Modal as BlockstackModal,
  ThemeProvider,
  theme,
  CSSReset,
  Flex,
  Box,
  Text
} from '@blockstack/ui';
import ChevronRightIcon from 'mdi-react/ChevronRightIcon';
import CloseIcon from 'mdi-react/CloseIcon';
import { useHover } from 'use-events';
import { Logo } from '../logo';
import { Intro } from '../intro';
import { AppIcon } from '../app-icon';
import { useConnect } from '../../hooks/useConnect';

interface HeaderTitleProps {
  title: string;
  hideIcon?: boolean;
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({
  hideIcon = false,
  title
}) => (
  <Flex align="center">
    {hideIcon ? null : <Logo mr={2} />}
    <Text fontWeight="bold" fontSize={'12px'}>
      {title}
    </Text>
  </Flex>
);

interface IModalHeader {
  appIcon?: string;
  title: string;
  close?: () => void;
  hideIcon?: boolean;
}

const ModalHeaderCloseButtom = (props: any) => {
  const [hover, bind] = useHover();
  const { doCloseDataVault } = useConnect();

  return (
    <Box
      cursor={hover ? 'pointer' : 'unset'}
      opacity={hover ? 1 : 0.5}
      {...bind}
      {...props}
      onClick={doCloseDataVault}
    >
      <CloseIcon size={20} />
    </Box>
  );
};

const ModalHeader = ({
  appIcon,
  title,
  hideIcon,
  close,
  ...rest
}: IModalHeader) => {
  return (
    <Flex
      p={[4, 5]}
      borderBottom="1px solid"
      borderBottomColor="inherit"
      borderRadius={['unset', '6px 6px 0 0']}
      bg="white"
      align="center"
      justify="space-between"
      {...rest}
    >
      <Flex align="center">
        {appIcon ? <AppIcon src={appIcon} alt="replace with app name" /> : null}
        {appIcon ? (
          <Box pr={1} pl={2} color="ink.300">
            <ChevronRightIcon size={20} />
          </Box>
        ) : null}
        <HeaderTitle hideIcon={hideIcon} title={title} />
      </Flex>
      {close ? <ModalHeaderCloseButtom onClick={close} /> : null}
    </Flex>
  );
};

const Modal = () => {
  const { isOpen } = useConnect();
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <BlockstackModal
        headerComponent={
          <ModalHeader
            appIcon={
              'https://appco.imgix.net/apps/409b27e0-5c04-48e0-b9a2-7a6e92cce4f6?fit=clip&h=180&w=180'
            }
            close={() => console.log('close')}
            title={'Data Vault'}
          />
        }
        isOpen={isOpen}
      >
        <Intro />
      </BlockstackModal>
    </ThemeProvider>
  );
};

export { Modal };
