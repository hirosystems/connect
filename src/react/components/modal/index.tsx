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
// import ChevronRightIcon from 'mdi-react/ChevronRightIcon';
import CloseIcon from 'mdi-react/CloseIcon';
import { useHover } from 'use-events';
import { Logo } from '../logo';
import { Intro } from '../screens/intro';
import { HowItWorks } from '../screen/how-it-works';
import { ContinueWithDataVault } from '../screen/sign-in';
// import { AppIcon } from '../app-icon';
import { useConnect } from '../../hooks/useConnect';
import { SCREENS_HOW_IT_WORKS, SCREENS_SIGN_IN } from '../connect/context';
// import { useAppDetails } from '../../hooks/useAppDetails';x

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
  title: string;
  close?: boolean;
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

const ModalHeader = ({ title, hideIcon, close, ...rest }: IModalHeader) => {
  // const { icon } = useAppDetails();

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
        {/*{icon ? (*/}
        {/*  <Box pr={1} pl={2} color="ink.300">*/}
        {/*    <ChevronRightIcon size={20} />*/}
        {/*  </Box>*/}
        {/*) : null}*/}
        <HeaderTitle hideIcon={hideIcon} title={title} />
      </Flex>
      {close ? <ModalHeaderCloseButtom onClick={close} /> : null}
    </Flex>
  );
};

const RenderScreen: React.FC = () => {
  const { screen } = useConnect();
  switch (screen) {
    case SCREENS_HOW_IT_WORKS: {
      return <HowItWorks />;
    }
    case SCREENS_SIGN_IN: {
      return (
        <Box width="100%">
          <ContinueWithDataVault />
        </Box>
      );
    }
    default: {
      return <Intro />;
    }
  }
};

const Modal = () => {
  const { isOpen, screen } = useConnect();
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <BlockstackModal
        headerComponent={
          <ModalHeader
            close
            title={screen === SCREENS_SIGN_IN ? 'Sign In' : 'Data Vault'}
          />
        }
        isOpen={isOpen}
      >
        <RenderScreen />
      </BlockstackModal>
    </ThemeProvider>
  );
};

export { Modal };
