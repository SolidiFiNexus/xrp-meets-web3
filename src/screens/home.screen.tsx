import {StyleSheet, Text, Image, ScrollView, RefreshControl} from "react-native";
import {StatusBar} from "expo-status-bar";
import * as React from "react";
import {vars} from "../globals";
import QRCode from "react-native-qrcode-svg";
import {useWindowDimensions} from "react-native";
import {XrplClient} from "xrpl-client";
import {useEffect, useRef, useState} from "react";

export const HomeScreen = () => {
  const {width} = useWindowDimensions();
  const [balance, setBalance] = useState(0);
  const [rate, setRate] = useState(0);
  const client = useRef(new XrplClient());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getRate = () => {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd")
      .then((x) => x.json())
      .then((y) => {
        setRate(y.ripple.usd);
        setRefreshing(false);
      })
      .catch((err) => {
        setRefreshing(false);
      });
  };

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
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getBalance();
    getRate();
  }, []);

  useEffect(() => {
    getBalance();
    getRate();
    return () => {
      client.current.close();
    };
  }, []);

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
      contentContainerStyle={styles.container}
    >
      <Image
        resizeMode="contain"
        style={{width: 150, height: 150}}
        source={require("../assets/images/xrp-logo.png")}
      />
      <Text style={styles.header}>Welcome!</Text>
      <Text style={styles.subheader}>
        This screen is a simple demonstration of retrieving info from the XRPL.
      </Text>
      <QRCode
        size={width * 0.5}
        logoMargin={3}
        logoSize={10}
        logoBackgroundColor={"white"}
        logo={require("../assets/images/xrp-logo.png")}
        value={vars.xrpAddress}
      />
      <Text style={styles.defaultText}>{vars.xrpAddress}</Text>
      <Text style={styles.defaultText}>Balance: {loading ? "..." : balance} XRP</Text>
      <Text style={[styles.defaultText, {fontSize: 20}]}>${(rate * balance).toFixed(2)}</Text>

      <StatusBar style="auto"/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 50,
  },
  header: {marginBottom: 10, fontSize: 14},
  subheader: {marginBottom: 30, fontStyle: "italic", textAlign: "center", color: "#aaa"},
  defaultText: {textAlign: "center", marginTop: 20},
});
