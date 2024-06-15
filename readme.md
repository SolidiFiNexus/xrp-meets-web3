# Introduction

In recent years, the XRP Ledger has seen a surge in applications that offer features beyond basic XRP transactions. Notable examples include Bithomp, onXRP, and xrptoolkit. These applications demonstrate the expanding potential of the XRP Ledger ecosystem.

In 2023, XRPL Labs released a web app (https://unhosted.exchange/), highlighting the shift towards decentralized applications (dApps). This transition is crucial for ensuring that applications are interconnected and accessible to all users, rather than being isolated. Despite the usefulness of the DEX developed by XRPL Labs for XUMM, its full potential remains untapped due to the absence of a standard connection method.

At SolidiFi Nexus, we have also built our own DEX interface and it can be found at: https://solidifi.app/dex. 

Imagine if any mobile application could seamlessly access such dApps. Mobile applications offer a high security when it comes to storing private keys. What if XRPL users want to use those mobile applications (such as Xaman and SolidiFi Wallet) and choose their favorite platform to interact with? What if connecting your non-custodial mobile wallet to any dApp was as simple as pressing a button?

With XRP-meets-web3, we aim to turn this vision into reality. What has become standard practice in the Ethereum Virtual Machine (EVM) world has yet to be realized for the XRP Ledger. This project will provide developers with a straightforward tool to integrate their online dApps, enabling secure and seamless interactions with self-custodial wallets in a secure and user-friendly manner.

# What does this repo contain?

This repository contains two main components:

- XRP-meets-Web3 Provider: A web3 provider that allows seamless communication between dApps and mobile applications with XRP wallets. The injected provider can be found at: https://github.com/SolidiFiNexus/xrp-meets-web3/blob/master/src/assets/scripts/provider.ts.

- React Native Demonstration Project: An example mobile application built with React Native to demonstrate the capabilities of the XRP-meets-Web3 provider. This project includes a webview that connects to a live example dApp deployed at https://solidifi.app/grant-application. The source code for this dApp can be found in the ```client/``` folder.

# Overview

This projects has 2 screens:

1) Load the balance of an XRP account
2) Load a webview and inject a basic web3 "XRP Provider" into it that websites can use to interact with it.

- once the webview is loaded, a user clicks the connect button
- a popup asks for confirmation to allow website to read wallet address
- the address is returned from the mobile application
- website is now able to access the wallet address!

Here is a visual representation of the app

### Home - basic example of a random XRP address

<img src="/assets/explainers/home.jpg" width="300"/>

### WebView Injection - Mobile app injects the javascript-based XRP provider

<img src="/assets/explainers/injected.jpg" width="300"/>

### WebView Start - The user can start interact with the dApp by pressing the connect button

<img src="/assets/explainers/start.jpg" width="300"/>

### WebView Confirmation - The mobile app checks if the user approves the connection

<img src="/assets/explainers/confirm-connect.jpg" width="300"/>

### WebView Connected! - In this simple example the wallet address is read from the mobile app.

<img src="/assets/explainers/connected.jpg" width="300"/>

Aweseome! You have now witnessed the world's first native web3 connection to the XRPL for a mobile application. Everything is happening in one application: loading a webpage, loading the web3 provider, loading the wallet data and bridging this data with a dApp. And all of it is happening without navigating away from the mobile application itself. We believe this is a powerfool tool that can push adoption of XRP within the web3 DeFi space. 

Below is a technical description of the project.

# Technical description of xrp-meets-web3

This document contains 2 technical descriptions.

1) Section 1 is the technical description of the current technical status of the SolidiFi Wallet in which we would like
   to integrate the web3 provider and present it to the world.
2) Section 2 is the technical description of xrp-meets-web3

As stated in our application, we would like to open source this technology, properly document it so that any developer
can use it.

This way we hope to open up many many many possibilities for the XRPL. We personally can't wait to ask Bithomp, XRPL
Labs, onXRP and others to add support for this technology so that even more users can make use of the great work these
developers have done.

## 1. Current technical overview

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

A simple example of this file can be found at `src/assets/scripts`

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

# Next steps

We have demonstrated a simple interaction with the XRP web3 provider, but there is much more to achieve. Our next steps include expanding support to cover the full range of XRPL functionalities, such as creating trust lines, placing DEX orders, managing NFTs, AMM and more. The JavaScript web3 provider will also incorporate robust data encryption methods to prevent malicious users from intercepting data and standardized error handling to ensure reliability and security.

In addition, we will provide comprehensive API documentation, enabling other developers to easily implement this technology in their own projects. This initiative will unlock countless possibilities for integrating XRP into the web3 ecosystem, and we are excited to make this vision a reality.

We appreciate your time and consideration of our project and look forward to your feedback.




