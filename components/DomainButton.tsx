import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import React, { useContext, useState } from 'react';
import { Button } from 'react-native-paper';
import { useSWRConfig } from 'swr';

import useGuardedCallback from '../utils/useGuardedCallback';
import { SnackbarContext } from './SnackbarProvider';

type Props = Readonly<{
  children?: React.ReactNode;
  publicKey: PublicKey;
}>;

const LAMPORTS_PER_AIRDROP = 100000000;

export default function DomainButton({ children, publicKey, navigation }: Props) {
  const { connection } = useConnection();
  const { mutate } = useSWRConfig();
  const setSnackbarProps = useContext(SnackbarContext);
  const [airdropInProgress, setAirdropInProgress] = useState(false);
  const requestAirdropGuarded = useGuardedCallback(async () => {
    const signature = await connection.requestAirdrop(
      publicKey,
      LAMPORTS_PER_AIRDROP,
    );
    return await connection.confirmTransaction(signature);
  }, [connection]);

  const fundCircle = async () => {
    navigation.navigate('Domain');
  };

  return (
    <Button
      icon="hand-coin-outline"
      mode="elevated"
      loading={airdropInProgress}
      onPress={async () => {
        await fundCircle();
      }}>
      {children}
    </Button>
  );
}
