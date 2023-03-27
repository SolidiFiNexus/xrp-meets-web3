import {StyleSheet, Text, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import * as React from "react";
import {vars} from "../globals";
import QRCode from 'react-native-qrcode-svg';
import {useWindowDimensions} from 'react-native';
import {XrplClient} from "xrpl-client";
import {useEffect, useRef, useState} from "react";

export const HomeScreen = () => {
  const {width} = useWindowDimensions();
  const [balance, setBalance] = useState(0);
  const client = useRef(new XrplClient());
  const [loading, setLoading] = useState(true);

  const getBalance = async () => {
    try {
      const accountInfo: any = await client.current?.send({
        command: "account_info",
        account: vars.xrpAddress,
        strict: true,
        ledger_index: "validated",
        queue: false,
      });

      if (accountInfo?.account_data) {
        const balance = accountInfo.account_data.Balance;
        setBalance(balance / 1e6);
      }
    } catch (e) {
    }
    setLoading(false);
  }

  useEffect(() => {
    getBalance();

    return () => {
      client.current.close();
    }
  }, [])

  return (
    <View style={styles.container}>
      <Text style={{marginBottom: 10, fontSize: 14}}>Welcome!</Text>
      <QRCode size={width * 0.5} logoMargin={3} logoSize={10} logoBackgroundColor={'white'}
              logo={require('../assets/xrp-logo.png')} value={vars.xrpAddress}/>
      <Text style={{textAlign: 'center', marginTop: 20}}>{vars.xrpAddress}</Text>
      <Text style={{textAlign: 'center', marginTop: 20}}>{loading ? '...' : balance} XRP</Text>
      <StatusBar style="auto"/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

