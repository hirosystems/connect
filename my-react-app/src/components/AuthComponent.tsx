// src/components/AuthComponent.tsx

import React from 'react';

const AuthComponent: React.FC = () => {
  const { doOpenAuth } = useConnect();

  const handleSignIn = () => {
    doOpenAuth();
  };

  return (
    <div>
      <button onClick={handleSignIn}>Sign In with Stacks</button>
    </div>
  );
};

export default AuthComponent;
function useConnect(): { doOpenAuth: any; } {
    throw new Error('Function not implemented.');
}

