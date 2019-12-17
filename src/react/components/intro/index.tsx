import React from 'react';
import { Box, Stack } from '@blockstack/ui';
import { ScreenTemplate } from '../screen';
import { CheckList } from '../checklist';
import { Link } from '../link';
import { AppIcon } from '../app-icon';
import { authenticate } from '../../../auth';
import { useConnect } from '../../hooks/useConnect';

const Intro = () => {
  const { name, icon } = {
    name: 'test app',
    icon:
      'https://appco.imgix.net/apps/409b27e0-5c04-48e0-b9a2-7a6e92cce4f6?fit=clip&h=180&w=180'
  };
  const { authOptions } = useConnect();
  return (
    <>
      <ScreenTemplate
        before={<AppIcon mx="auto" size="78px" src={icon} alt={name} />}
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
            // doTrack(INTRO_CREATE);
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
                  console.log('show screen');
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
