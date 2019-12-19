import React from 'react';
import { Box, Stack } from '@blockstack/ui';
import { ScreenTemplate } from '../../screen';
import { CheckList } from '../../checklist';
import { Link } from '../../link';
import { AppIcon } from '../../app-icon';
import { authenticate } from '../../../../auth';
import { useConnect } from '../../../hooks/useConnect';
import { Logo } from '../../logo';
import { useAppDetails } from '../../../hooks/useAppDetails';

const AppElement = ({
  name,
  icon,
  ...rest
}: {
  name: string;
  icon: string;
}) => (
  <Box mx="auto" size="78px" position="relative" {...rest}>
    <Box position="absolute" top="-4px" right="-4px">
      <Logo />
    </Box>
    <AppIcon size="78px" src={icon} alt={name} borderRadius="0" />
  </Box>
);

const Intro = () => {
  const { doGoToHowItWorksScreen, authOptions } = useConnect();
  const { name, icon } = useAppDetails();
  return (
    <>
      <ScreenTemplate
        before={<AppElement name={name} icon={icon} />}
        textAlign="center"
        noMinHeight
        title={`Use ${name} privately and securely with Data Vault`}
        body={[
          `${name} will use your Data Vault to store your data privately, where no one but you can see it.`,
          <Box mx="auto" width="128px" height="1px" bg="#E5E5EC" />,
          <CheckList
            items={[
              `Keep everything you do in ${name} private with encryption and blockchain`,
              'It’s free and takes just 2 minutes to create'
            ]}
          />
        ]}
        action={{
          label: 'Create Data Vault',
          onClick: () => {
            authenticate(authOptions);
          }
        }}
        footer={
          <>
            <Stack spacing={4} isInline>
              <Link
                onClick={() => {
                  authenticate({ ...authOptions, sendToSignIn: true });
                }}
              >
                Sign in instead
              </Link>
              <Link
                onClick={() => {
                  doGoToHowItWorksScreen();
                }}
              >
                How Data Vault works
              </Link>
            </Stack>
            <Link>Help</Link>
          </>
        }
      />
    </>
  );
};

export { Intro };
