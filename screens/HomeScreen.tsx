// import React, {useState} from 'react';
// import {ScrollView, StyleSheet} from 'react-native';
import '../shim'; // required by rn-nodeify

// import { Appbar, Portal } from "react-native-paper";
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
// import AccountInfo from '../components/AccountInfo';
// import RecordMessageButton from '../components/RecordMessageButton';
// import SignMessageButton from '../components/SignMessageButton';
// import useAuthorization from '../utils/useAuthorization';
import React, { Fragment, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet } from 'react-native';
import { Appbar, Divider, Portal, Text, TextInput, Button } from 'react-native-paper';

import AccountInfo from '../components/AccountInfo';
import DomainButton from '../components/DomainButton';
import MintButton from '../components/MintButton';
import useAuthorization from '../utils/useAuthorization';

export default function HomeScreen({ navigation }: Props) {
    const { accounts, onChangeAccount, selectedAccount, authorizeSession } =
        useAuthorization();

    useEffect(() => {
        if (!selectedAccount) {
            transact(wallet => authorizeSession(wallet));
        }
    }, []);

    const fundCircle = async () => {
        navigation.navigate('AddFunds');
    };

    return (
        <Fragment>
            <Appbar.Header elevated mode="center-aligned">
                <Appbar.Content title="OurGlass" />
            </Appbar.Header>

            <Portal.Host>
                <Button
                    icon="hand-coin-outline"
                    mode="elevated"
                    onPress={async () => {
                        await fundCircle();
                    }}>
                    Add Funds.
                </Button>
                <ScrollView contentContainerStyle={styles.container}>
                    <Image source={require('../assets/arianagrande.png')} />
                    <Text variant="bodyLarge">Mint a new music album.</Text>
                    <MintButton />
                </ScrollView>



                {/* {accounts && selectedAccount ? (
                    <AccountInfo
                        accounts={accounts}
                        onChange={onChangeAccount}
                        selectedAccount={selectedAccount}
                        navigation={navigation}
                    />
                ) : null} */}
            </Portal.Host>
        </Fragment>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    shell: {
        height: '100%',
    },
    spacer: {
        marginVertical: 16,
        width: '100%',
    },
    textInput: {
        width: '100%',
    },
});
