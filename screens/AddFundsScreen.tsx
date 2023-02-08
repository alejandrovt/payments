import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import React, { Fragment, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Button,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { Appbar } from 'react-native-paper';
import { v4 as uuid_v4 } from 'uuid';

import api from '../api/api';
import useAuthorization from '../utils/useAuthorization';

export default function AddFundsScreen({ navigation }: Props) {
    const { accounts, onChangeAccount, selectedAccount, authorizeSession } =
        useAuthorization();
    const [cardNumber, onChangeCardNumber] = React.useState(null);
    const [dueDate, onChangeDueDate] = React.useState('');
    const [cv, onChangeCV] = React.useState(null);
    const [amount, onChangeAmount] = React.useState(null);
    const [fee, onChangeFee] = React.useState(0);
    const [paymentStatus, onChangePaymentStatus] = React.useState(null);
    const [paymentId, onChangePaymentId] = React.useState(null);
    const [amountTransfer, onChangeAmountTransfer] = React.useState(0);
    const [transfertId, onChangeTransferId] = React.useState(null);
    const [trasnferStatus, onChangeTransferStatus] = React.useState(null);
    const [viewButtonsStatus, onChangeViewButtonsStatus] = React.useState(false);
    const [loadingStatus, onChangeLoadingStatus] = React.useState(false);
    const [messageStatus, onChangeMessageStatus] = React.useState('hola');

    useEffect(() => {
        if (!selectedAccount) {
            transact(wallet => authorizeSession(wallet));
        }
    }, []);

    useEffect(() => {
        if (paymentId) {
            setTimeout(() => {
                onChangeMessageStatus('Verified funds on card.');
                onClickCheckTx();
            }, 3000);
        }
    }, [paymentId]);

    useEffect(() => {
        if (fee && fee > 0) {
            setTimeout(() => {
                onChangeMessageStatus('Transfer funds to wallet.');
                onClickTransferFunds();
            }, 6000);
        }
    }, [fee]);

    useEffect(() => {
        if (transfertId) {
            setTimeout(() => {
                onChangeMessageStatus('Transfer completed.');
                onChangeLoadingStatus(false);
            }, 5000);
        }
    }, [transfertId]);

    const onClickAddFund = async () => {
        if (!cardNumber) {
            alert('card number required');
            return;
        }
        if (!dueDate) {
            alert('due date required');
            return;
        }
        if (!cv) {
            alert('card cv required');
            return;
        }
        if (!amount) {
            alert('amount required');
            return;
        }

        const data = {
            idempotencyKey: uuid_v4(),
            autoCapture: true,
            amount: {
                amount: amount,
                currency: 'USD',
            },
            source: {
                id: '94850aeb-1450-46cf-a904-10037e696387',
                type: 'card',
            },
            description: 'Payment',
            verificationSuccessUrl: 'https://sislisus.in/req.php',
            verificationFailureUrl: 'https://sislisus.in/req.php',
            metadata: {
                email: 'satoshi@circle.com',
                phoneNumber: '+14155555555',
                sessionId: 'xxx',
                ipAddress: '244.28.239.130',
            },
            channel: '',
            verification: 'cvv',
            encryptedData:
                'LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tCgp3Y0JNQTBYV1NGbEZScFZoQVFmL2J2bVVkNG5LZ3dkbExKVTlEdEFEK0p5c0VOTUxuOUlRUWVGWnZJUWEKMGgzQklpRFNRU0RMZmI0NEs2SXZMeTZRbm54bmFLcWx0MjNUSmtPd2hGWFIrdnNSMU5IbnVHN0lUNWJECmZzeVdleXlNK1JLNUVHV0thZ3NmQ2tWamh2NGloY29xUnlTTGtJbWVmRzVaR0tMRkJTTTBsTFNPWFRURQpiMy91eU1zMVJNb3ZiclNvbXkxa3BybzUveWxabWVtV2ZsU1pWQlhNcTc1dGc1YjVSRVIraXM5ckc0cS8KMXl0M0FOYXA3UDhKekFhZVlyTnVNZGhGZFhvK0NFMC9CQnN3L0NIZXdhTDk4SmRVUEV0NjA5WFRHTG9kCjZtamY0YUtMQ01xd0RFMkNVb3dPdE8vMzVIMitnVDZKS3FoMmtjQUQyaXFlb3luNWcralRHaFNyd3NKWgpIdEphQWVZZXpGQUVOaFo3Q01IOGNsdnhZVWNORnJuNXlMRXVGTkwwZkczZy95S3loclhxQ0o3UFo5b3UKMFVxQjkzQURKWDlJZjRBeVQ2bU9MZm9wUytpT2lLall4bG1NLzhlVWc3OGp1OVJ5T1BXelhyTzdLWTNHClFSWm8KPXc1dEYKLS0tLS1FTkQgUEdQIE1FU1NBR0UtLS0tLQo',
            keyId: 'key1',
        };

        onChangeLoadingStatus(true);
        onChangeMessageStatus('Creating payment.');

        api
            .postData('/payments', data)
            .then(response => {
                const dataResponse = response.data.data;
                onChangePaymentId(dataResponse.id);
                onChangePaymentStatus(dataResponse.status);
                console.log('------------OK AddFund ', { dataResponse });
            })
            .catch(error => {
                console.log('------------Error AddFund ', error);
                onChangeLoadingStatus(false);
            });
    };

    const onClickCheckTx = async () => {
        api
            .getData(`/payments/${paymentId}`)
            .then(response => {
                const dataResponse = response.data.data;
                console.log('------------OK CheckTx ', { dataResponse });

                if (
                    dataResponse.status === 'confirmed' ||
                    dataResponse.status === 'paid'
                ) {
                    const amountTrans =
                        parseFloat(dataResponse.amount.amount) -
                        parseFloat(dataResponse.fees.amount);
                    onChangeAmountTransfer(amountTrans);
                    onChangeFee(dataResponse.fees.amount);
                }

                onChangePaymentStatus(dataResponse.status);
            })
            .catch(error => {
                console.log('------------Error CheckTx ', error, paymentId);
                onChangeLoadingStatus(false);
            });
    };

    const onClickTransferFunds = async () => {
        const data = {
            idempotencyKey: uuid_v4(),
            source: {
                type: 'wallet',
                id: '1011856127',
            },
            destination: {
                type: 'blockchain',
                chain: 'SOL',
                address: 'D2NQcLo3eZs5qph3HHyhu4iymed97cg7eW5h9qzx6MqH', //selectedAccount.publicKey,
            },
            amount: {
                amount: amountTransfer.toFixed(2),
                currency: 'USD',
            },
        };

        api
            .postData('/transfers', data)
            .then(response => {
                //setResponseData(response.data);
                const dataResponse = response.data.data;
                onChangeTransferId(dataResponse.id);
                onChangeTransferStatus(dataResponse.status);

                onChangePaymentId(null);
                onChangePaymentStatus(null);

                console.log('------------OK TransferFunds ', { dataResponse });
            })
            .catch(error => {
                console.log('------------Error TransferFunds ', error, { data });
                onChangeLoadingStatus(false);
            });
    };

    const onClickCheckTransfer = async () => {
        api
            .getData(`/businessAccount/transfers/${transfertId}`)
            .then(response => {
                const dataResponse = response.data.data;
                console.log('------------OK ', dataResponse);

                if (dataResponse.status === 'complete') {
                    alert('Transfer completed');
                    onChangeTransferId(null);
                    onChangeTransferStatus(null);
                }
            })
            .catch(error => {
                console.log('------------Error ', error);
            });
    };

    return (
        <SafeAreaView>
            <Appbar.Header elevated mode="center-aligned">
                <Appbar.Content title="Payments and Transfer" />
            </Appbar.Header>
            <TextInput
                style={styles.input}
                onChangeText={onChangeCardNumber}
                value={cardNumber}
                placeholder="Card number"
                keyboardType="numeric"
            />
            <View style={styles.fixToText}>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeDueDate}
                    value={dueDate}
                    placeholder="Due date (MM/YY)"
                    maxLength={5}
                />
                <TextInput
                    style={styles.inputCV}
                    onChangeText={onChangeCV}
                    value={cv}
                    placeholder="CV"
                    keyboardType="numeric"
                    maxLength={3}
                />
                <TextInput
                    style={styles.inputValue}
                    onChangeText={onChangeAmount}
                    value={amount}
                    placeholder="Amount"
                    keyboardType="numeric"
                />
                <Text numberOfLines={5} style={styles.text}>
                    USD
                </Text>
            </View>
            <View style={styles.buttonStyle}>
                <Button
                    title="Add Funds"
                    onPress={() => onClickAddFund()}
                    style={styles.button}
                    disabled={loadingStatus ? true : false}
                />
            </View>
            {viewButtonsStatus &&
                paymentStatus &&
                (paymentStatus === 'pending' || paymentStatus === 'confirmed') && (
                    <View style={styles.buttonStyle}>
                        <Button
                            title="Check TX"
                            onPress={() => onClickCheckTx()}
                            style={styles.button}
                        />
                    </View>
                )}
            {viewButtonsStatus && paymentStatus && paymentStatus === 'paid' && (
                <View style={styles.buttonStyle}>
                    <Button
                        title="Transfer Funds"
                        onPress={() => onClickTransferFunds()}
                        style={styles.button}
                    />
                </View>
            )}
            {viewButtonsStatus && trasnferStatus && trasnferStatus === 'pending' && (
                <View style={styles.buttonStyle}>
                    <Button
                        title="Check Tranfer"
                        onPress={() => onClickCheckTransfer()}
                        style={styles.button}
                    />
                </View>
            )}

            {messageStatus && (
                <>
                    <Text numberOfLines={5} style={styles.amount}>
                        Amount: {amount}
                    </Text>

                    <Text numberOfLines={5} style={styles.amount}>
                        Fee: {fee}
                    </Text>
                    <Text numberOfLines={5} style={styles.amount}>
                        Net: {amountTransfer.toFixed(2)}
                    </Text>
                </>
            )}

            {messageStatus && (
                <View style={styles.loading}>
                    <Text numberOfLines={5} style={styles.amount}>
                        {messageStatus}
                    </Text>
                    {loadingStatus && <ActivityIndicator size="large" />}
                </View>
            )}
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
        height: 25,
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
