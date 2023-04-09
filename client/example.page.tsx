import React, {useEffect, useState} from "react";
import {Button, Col, Layout, Row} from "antd";
import HeaderComponent from "./layout/header.component";
import FooterComponent from "./layout/footer.component";

const {Content} = Layout;

/**
 * Page for connecting a wallet through a mobile application
 * This page is currently hosted at: https://solidifi.app/grant-application
 *
 * @constructor
 */
function ExamplePage() {
  const [address, setAddress] = useState<string | null>(null);

  /**
   * On ready method for this page
   */
  useEffect(() => {
    // scroll to the top of the page when it's loaded
    window.scrollTo(0, 0);
  }, []);

  /**
   * Connect to the XRP web3 provider
   *
   * 1. call enable() on the web3 provider to request permission to access a user's wallet
   * 2. listen to the "accountsChanged" event and update the received address in the UI of this page.
   */
  const connect = async () => {
    // @ts-ignore
    if (window.xrp) {
      try {
        // @ts-ignore
        window.xrp.on("accountsChanged", (data) => {
          setAddress(data);
        });
        // @ts-ignore
        await window.xrp.enable();
      } catch (e) {
        alert(e);
      }
    }
  };

  return (
    <Layout className="layout page-grant">
      <HeaderComponent/>
      <Content>
        <Row justify={"center"}>
          <Col xs={24} sm={18} xl={12}>
            <div className={"widget-container"}>
              <Row gutter={[20, 20]}>
                <Col xs={24}>
                  <h2>Hello XRPL Grant Team!</h2>

                  <h3>Welcome</h3>

                  <p style={{marginTop: 20}}>Let's connect to your wallet and check out its balance!</p>

                  <Button disabled={address !== null} onClick={() => connect()} type={"primary"}>
                    {address ? "CONNECTED" : "CONNECT"}
                  </Button>

                  <Row style={{marginTop: 20}}>
                    {address && (
                      <Col xs={24}>
                        <strong>World premiere!! </strong>
                        <p>{address} is the first XRP wallet to natively connect to web3 within a mobile app!</p>
                      </Col>
                    )}
                  </Row>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Content>
      <FooterComponent/>
    </Layout>
  );
}

export default ExamplePage;
