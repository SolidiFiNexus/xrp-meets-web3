import {Animated, StyleSheet, View, TouchableOpacity, Alert} from "react-native";
import * as React from "react";
import {WebView, WebViewNavigation} from "react-native-webview";
import {useEffect, useRef, useState} from "react";
import {fadeIn, fadeOut} from "../helpers/animation.helper";
import {JSONRPCResponse, ProviderMessage} from "../types/web3.types";
import {vars} from "../globals";
import {XrplClient} from "xrpl-client";
import ProgressBarComponent from "../components/progress-bar.component";
import {RouteNavigation} from "../types/app.types";
import {DappBrowserState} from "../types/browser.types";
import Ionicons from "@expo/vector-icons/Ionicons";
import {web3Provider} from "../assets/scripts/provider";

/**
 * WebView screen with injected XRP web3 provider
 *
 * @param navigation
 * @param route
 * @constructor
 */
export const WebViewScreen = ({navigation, route}: RouteNavigation) => {
  const [progressBarOpacity] = useState(new Animated.Value(0));
  const [progress, setProgress] = useState(0);
  const [browserState, setBrowserState] = useState<DappBrowserState>({
    enableBack: false,
    enableForward: false,
    title: "",
    url: "https://solidifi.app",
    initialized: false,
  });
  const webviewRef = useRef<WebView | null>(null);
  const client = useRef(new XrplClient());

  const styles = getStyles();

  /**
   * On ready method
   */
  useEffect(() => {
    updateHeader();

    return () => {
      // close the websocket connection of the XRPL client
      client.current.close();
    };
  }, [browserState]);

  /**
   * The browser navigation header
   * Includes refresh button, go back and forward buttons
   */
  const updateHeader = () => {
    navigation.setOptions({
      headerBackTitle: "Go Back",
      headerRight: () => (
        <View style={styles.navRow}>
          <TouchableOpacity
            disabled={!browserState.enableBack}
            style={{marginRight: 10, opacity: browserState.enableBack ? 1 : 0.4}}
            onPress={() => webviewRef.current?.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name={"arrow-back-outline"} size={20} color={"#333"}/>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={!browserState.enableForward}
            style={{marginRight: 10, opacity: browserState.enableForward ? 1 : 0.4}}
            onPress={() => webviewRef.current?.goForward()}
            activeOpacity={0.7}
          >
            <Ionicons name={"arrow-forward-outline"} size={20} color={"#333"}/>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => webviewRef.current?.reload()} activeOpacity={0.7}>
            <Ionicons name={"reload"} size={20} color={"#333"}/>
          </TouchableOpacity>
        </View>
      ),
    });
  };

  /**
   * Handler for what to do when page is about to start loading
   */
  const onLoadStart = () => {
    setProgress(0);
    fadeIn(progressBarOpacity, 1200).start();
  };

  /**
   * Handler for what to do when page is currently loading
   * @param progress
   */
  const onLoadProgress = ({nativeEvent: {progress}}: any) => {
    setProgress(progress);
  };

  /**
   * Handler for what to do when page finished loading
   */
  const onLoadEnd = () => {
    fadeOut(progressBarOpacity, 1200).start();
  };

  /**
   * Get the balance of an XRP account
   */
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
        return balance / 1e6;
      }
    } catch (e) {
    }
    return 0;
  };

  /**
   * Get the latest ledger index
   */
  const getLedgerIndex = async () => {
    const ledgerData = await client.current.send({
      id: 14,
      command: "ledger",
      ledger_index: "validated",
      full: false,
      accounts: false,
      transactions: false,
      expand: false,
      owner_funds: false,
    });
    return ledgerData.ledger.ledger_index;
  };

  /**
   * Handle XRPL-based messages from a website
   */
  const onMessage = async ({nativeEvent}: any) => {
    let data = JSON.parse(nativeEvent.data) as ProviderMessage;

    let response: JSONRPCResponse = {
      messageId: data.messageId,
      type: "web3-send-async-callback",
      result: {id: data.messageId, jsonrpc: "2.0", result: null},
    };

    if (data.type === "api-request" && data.permission === "web3") {
      Alert.alert(
        "Allow website to read wallet?",
        "Do you want to allow this website to read your wallet?",
        [
          {text: "No"},
          {
            text: "Yes",
            onPress: () => {
              response = {
                ...response,
                type: "api-response",
                permission: "web3",
              };

              response.result.result = {address: [vars.xrpAddress]};
              const permissionResponse = JSON.stringify(response);
              webviewRef.current?.postMessage(permissionResponse);
            },
          },
        ]
      );
    } else {
      // the following is for demo purposes and not functional within this mobile app.
      // it illustrates the responds a mobile application can make to specificic requests
      // coming from the XRP web3 provider
      if (data.payload) {
        // SECURITY NOTE: strictly allow only hardcoded methods so we have full control
        // over the responses. everything else will be ignored
        switch (data.payload.method) {
          case "ledger_index":
            response.result.result = getLedgerIndex();
            const ledgerIndexResponse = JSON.stringify(response);
            webviewRef.current?.postMessage(ledgerIndexResponse);
            break;
          case "get_balance":
            response.result.result = getBalance();
            const balanceResponse = JSON.stringify(response);
            webviewRef.current?.postMessage(balanceResponse);
            break;
          case "request_accounts":
            response.result.result = [vars.xrpAddress];
            const accountsResponse = JSON.stringify(response);
            webviewRef.current?.postMessage(accountsResponse);
            break;
        }
      }
    }
  };

  return (
    <View style={{flex: 1}}>
      <ProgressBarComponent progress={progress} progressBarOpacity={progressBarOpacity}/>
      <WebView
        ref={webviewRef}
        originWhitelist={["https://*", "http://*"]}
        decelerationRate={"normal"}
        injectedJavaScriptBeforeContentLoadedForMainFrameOnly={true}
        injectedJavaScriptBeforeContentLoaded={web3Provider()}
        onLoadStart={onLoadStart}
        onNavigationStateChange={(e: WebViewNavigation) => {
          setBrowserState({
            enableBack: e.canGoBack,
            enableForward: e.canGoForward,
            title: e.title,
            url: e.url.toString(),
            initialized: true,
          });

          if (!e.loading) {
            Alert.alert(
              "Successful",
              "XRP provider successfully injected!\n\nSee src/screens/webview.screen.tsx line 216.\n\nSince the XRP web3 provider is now injected, the dApp on this page is now ready to interact with the wallet within the mobile app.\n\nA mobile app user can sign transactions, place DEX orders, purchase NFTs and do all other things the XRPL has to offer.\n\nAny mobile app can make use of this, opening up the entire web3 ecosystem to its users.\n\nPretty cool!"
            );
          }
        }}
        onLoadEnd={onLoadEnd}
        onLoadProgress={onLoadProgress}
        onMessage={onMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        allowsInlineMediaPlayback={true}
        source={{uri: "https://solidifi.app/grant-application"}}
        testID={"xrp-meets-web3"}
        applicationNameForUserAgent={"WebView SolidiFiMobileApp"}
      />
    </View>
  );
};

const getStyles = () => {
  return StyleSheet.create({
    navRow: {
      flexDirection: "row",
      alignContent: "center",
      justifyContent: "space-between",
      marginRight: 20,
      paddingLeft: 15,
    },
  });
};
