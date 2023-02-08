import React, { useEffect } from 'react';
import RenderHtml from 'react-native-render-html';
import { namehash, resolveBothChains, resolveZilliqaNetwork } from '../services/utils';
import { init } from '../services/ethers'

import "@walletconnect/react-native-compat";
import SignClient from "@walletconnect/sign-client";

import {
    Button,
    SafeAreaView,
    StyleSheet,
    TextInput,
    Text,
} from 'react-native';

import { Appbar } from 'react-native-paper';

export default function DomainScreen() {
    const [data, setData] = React.useState<any>();
    const [search, setSearch] = React.useState<string>('alice.uns-devtest-ourglass-test.crypto');
    const [polygonContract, setPolygonContract] = React.useState<any>();
    const [ethContract, setEthContract] = React.useState<any>();
    const [msgSearch, setMsgSearch] = React.useState<any>('');
    const [subdomain, setSubdomain] = React.useState<string>('alice');
    const [msgMint, setMsgMint] = React.useState<any>('');

    useEffect(() => {
        const [ethContract, polygonContract] = init();
        const resData = init();
        setData(resData);
    }, []);

    useEffect(() => {
        if (data) {
            const [ethContract1, polygonContract1] = data;

            setPolygonContract(polygonContract1)
            setEthContract(ethContract1)
        }
    }, [data]);

    const handleSearch = (e: any) => {
        setSearch(e);
    }

    const handleSubdomain = (e: any) => {
        setSubdomain(e);
    }

    const onClickSearch = async (e: any) => {
        e.preventDefault();
        const resData = init();
        setData(resData);

        const domain = search;
        if (!domain) return;

        const token = namehash(domain);

        if (domain.endsWith('.zil')) {
            const res = await resolveZilliqaNetwork(token);
            setMsgSearch(JSON.stringify(res));
            return;
        }

        const interestedKeys = ['crypto.BTC.address', 'crypto.ETH.address'];
        const [ethContract1, polygonContract1] = resData;
        const res = await resolveBothChains(polygonContract1, ethContract1, token, interestedKeys);
        setMsgSearch(JSON.stringify(res));
    }

    const onClickMint = async (e: any) => {
        e.preventDefault();

        const domain = subdomain;
        if (!domain) return;

        // const web3 = new Web3();

        // hash message
        // const hashedMessage =  Web3.utils.sha3("Your Ourglass subdomain will be " + subdomain + ".uns-devtest-ourglass-test.crypto");

        // sign hashed message
        // const signature = await window.ethereum.request({
        //     method: 'personal_sign',
        //     params: [hashedMessage, defaultAccount],
        // });

        // const r = signature.slice(0, 66);
        // const s = signature.slice(66, 130);
        // const v = parseInt(signature.slice(130, 132), 16);

        // const requestOptions = {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         subdomain,
        //         address: defaultAccount,
        //         message: web3.eth.accounts.hashMessage(hashedMessage),
        //         // signature: `${r}${s}${v.toString(16)}`,
        //         signature: r + s + signature.slice(130, 132)
        //     }),
        //     redirect: 'follow',
        // };

        // fetch("http://localhost:3001/subdomain", requestOptions)
        //     .then(response => response.text())
        //     .then(result => {
        //         console.log(result);
        //         setMsgMint(result);
        //     })
        //     .catch(error => console.log('error', error));
    }

    const handleConnect = async (e: any) => {
        try {

            const signClient = await SignClient.init({
                projectId: "68b5beeb348445d74c15afe6e309bad5",
                metadata: {
                    name: "Test Wallet",
                    description: "Test Wallet",
                    url: "#",
                    icons: ["https://walletconnect.com/walletconnect-logo.png"],
                },
            });
            console.log(signClient);
            return;

        } catch (error) {
            console.log(error)
        }
    }



    const sourceSearch = {
        html: `
      <pre>
        ${msgSearch}
      </pre>`
    };
    const sourceMint = {
        html: `
      <pre>
        ${msgMint}
      </pre>`
    };

    return (
        <SafeAreaView>
            <Appbar.Header elevated mode="center-aligned">
                <Appbar.Content title="Domains" />
            </Appbar.Header>
            <TextInput
                style={styles.input}
                onChangeText={handleSearch}
                value={search}
                placeholder="Search domain"
            />
            <Button
                title="Search"
                onPress={onClickSearch}
            />
            <RenderHtml
                contentWidth={100}
                source={sourceSearch}
            />
            <TextInput
                style={styles.input}
                onChangeText={handleSubdomain}
                value={subdomain}
                placeholder="Mint"
            />
            <Button
                title="Mints"
                onPress={onClickMint}
            />
            <RenderHtml
                contentWidth={100}
                source={sourceMint}
            />
            <Button
                title="Connect"
                onPress={handleConnect}
            />
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 16,
    },
    text: {
        height: 40,
        marginTop: 20,
        paddingTop: 10,
    },
    amount: {
        height: 105,
        paddingLeft: 20,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    inputCV: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: 50,
    },
    inputValue: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: 90,
    },
    fixToText: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'red',
    },
    buttonStyle: {
        marginTop: 30,
        marginLeft: 50,
        marginRight: 50,
        borderWidth: 2,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 10,
    },
    loading: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
