This projects has 2 screens:

1) Load the balance of an XRP account
2) Load a webview and inject a basic web3 "XRP Provider" into it that websites can use to interact with it.

<img src="/assets/homescreen.jpg" width="300"/>
<img src="/assets/webview.jpg" width="300"/>

# Technical description of xrp-meets-web3

This document consists of two sections.

1) Section 1 is the technical description of the current technical status of the mobile app.
2) Section 2 is the technical description of xrp-meets-web3

Keep in mind that the proposed technology will be demoed within our app, but can also be integrated into other mobile
apps.

## 1. Current technical overview

The crypto world moves fast. In order to keep up with the pace, a flexible architecture is needed that allows for rapid
development.

### 1.1 Programming language framework: React Native

The core framework used for development React Native. This javascript-based framework allows a developer to develop in
one programming language for both iOS and Android. All screens are written in javascript and then “exported” to a native
iOS and Android app. This allows for rapid development while also offering a native app experience to the end-user.

Furthermore, SolidiFi’s web counter-part (SolidiFi Web, https://solidifi.app) is built in React. This allows code
sharing between the two projects. So writing functionality for SolidiFi Web, makes it easily portable to SolidiFi Wallet
without much extra development time.

### 1.2 App development framework: Expo

Expo is a framework that offers tools to easily build a React Native project and convert it to native iOS and Android
applications. Expo is also used to submit builds directly to the app stores.

### 1.3 Code style: Typescript & Prettier

Typescript is used to add type safety and coherent code. Prettier is used so that each developer is writing the code in
the same style.

### 1.4 General storage management: Redux

Redux is used to manage the global state of the application. It allows for storage of data such as user preferences.
Once the user re-opens the app, redux is used to load the previous state of the application as well as personal user
settings.

### 1.5 Private keys management: Expo SecureStore

Expo SecureStore provides a way to encrypt and securely store key–value pairs locally on the device. In the background,
for iOS it uses the recommended native keychain service and for Android it uses Android's Keystore system to safely
secure user’s secret data (private keys in this case).

### 1.6 Interacting with the XRPL: xrpl-client.js

The xrpl-client.js library is a well known javascript library for interacting with the XRPL. Within SolidiFi wallet it
is used to request a user’s balance, acquire blockchain data such as current ledger index as well as loading NFTs and
transactions.

### 1.7 Crash analytics: Bugsnag

Bugsnag is a cloud-based error analytics and reporting tool. It allows for real-time error reporting as it fetches crash
and error reports from the user’s devices. Within the code Bugsnag should be triggered in every try-catch block, unless
privacy related data could potentially end up in the error message.

### 1.8 API’s

SolidiFi Wallet is designed with privacy in mind. When it comes to personal data, a no-interest-policy is maintained
which means that there is no effort made to collect any personal data. Interaction with APIs is therefor kept to an
absolute minimum.

Currently SolidiFi Wallet interacts with a few APIs for loading data such as fiat currency rates as well as the Terms of
Service and Privacy Policy.

## 2. Technical overview of xrp-meets-web3

### 2.1 The web3 browser

XRP-meets-Web3 will get a dedicated WebView within the mobile app that is able to navigate to dApps (decentralised
applications) that are built by developers (could be anyone). Users will be able to load their wallets (could be
multiple) and connect to a dApp on web3 accordingly. Popups will be used to view and confirm transactions (and can be
approved through Face ID and Pin Code entry).

The web3 browser will implement security practices that we have learned from out audit. For example, we will strictly
only allow https connections and encrypt data that is being sent back and forth with webpages with AES.

### 2.2 The injected javascript

This is the important part, where a javascript file is injected into a website that offers the dApp. This file is
injected to allow for (secure) communication with the mobile application itself. This file can (through a documented API
that developers can see on a dedicated website we'd like to build) interact with the user interface on the website.

### 2.3 A dedicated website to introduce this technology and have a place to showcase XRP dApps

This supportive website is the go-to place to learn about web3 for XRP. It will have a demo application for developers
to test their integration, and API documentation of the injected javascript.
Furthermore, it can host various showcases that app users can load as bookmarks within the mobile app.

The API documentation allows other developers to integrate xrp-meets-web3 into their mobile applications and therefor
access the entire XRP dApp ecosystem as well.

### 2.4. Workflow

Below is an example workflow:

1) User logs in to the mobile app
2) Opens web3 browser and navigates to a dApp (for example sologenic, onxrp, bithomp etc)
3) Browser asks if users trusts the dApp
4) User confirms and can choose which wallet to connect
5) User navigates through user interface of the dApp, let's take a DEX as example
6) User places order, web3 browser shows popup to confirm transaction (thanks to injected javascript this will be
   possible)
7) Mobile app connects to XRP node, submits transaction through xrpl-client.js
8) Mobile app sends message back to browser and the dApp that transaction is completed.

## 3 How to install

1) yarn install
2) yarn start
3) i (to open ios emulator on MacOS or a to open the android emulator)


## EXTRA:
XRPL Labs has released a xApp to the web at 6th April 2023 (https://unhosted.exchange/). This transition is precisely what we are expecting to see :)

There is no connection standard, and therefor we can't use it the way it should be used: a native integration should be possible in any mobile application with an easy to use API to communicate. So a great move, but we can't use it. With XRP-meets-Web3 we would like to provide this to the developers space. Probably right on time before a whole ecosystem of dApps emerges on the web, it's best to have an easy to implement javascript module that any developer can use to make their dApp available to the world! 



