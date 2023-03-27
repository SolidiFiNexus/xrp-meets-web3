export const web3Provider = () => {
  return `(async function () {
  if (typeof XRPProvider === "undefined") {

    var callbackId = 0;
    var callbacks = {};

    var bridgeSend = function (data) {
      ReactNativeWebView.postMessage(JSON.stringify(data));
    };
    
    function sendAPIrequest(permission, params) {
      var messageId = callbackId++;
      var params = params || {};

      bridgeSend({
        type: "api-request",
        permission: permission,
        messageId: messageId,
        params: params,
      });

      return new Promise(function (resolve, reject) {
        params["resolve"] = resolve;
        params["reject"] = reject;
        callbacks[messageId] = params;
      });
    }

    window.addEventListener("message", async function (event) {
      var data = JSON.parse(event.data);
      var id = data.messageId;
      var callback = callbacks[id];

      if (data.type === "api-response") {
        if (data.permission == "web3") {
          var selectedAddress = data.data[0];
          window.xrp.selectedAddress = selectedAddress;
          window.xrp.emit("accountsChanged", data.data);
        }

        if (callback) {
          callback.resolve(data.data);
        }
      } else if (data.type === "web3-send-async-callback") {
        if (callback) {
          callback.resolve(data.result.result);
        }
      }
    }, true);

    ////////////////////////////////////////////////////////////////////
    ///// WEB3 XRP PROVIDER
    ////////////////////////////////////////////////////////////////////
    var XRPProvider = function () {};

    XRPProvider.prototype.isSolidiFi = true; // allows UI detection for SolidiFi
    XRPProvider.prototype.isConnected = function () {
      return true;
    };

    XRPProvider.prototype.enable = function () {
      return sendAPIrequest("web3");
    };

    XRPProvider.prototype.request = function (requestArguments) {
      if (!requestArguments) {
        return Promise.reject(new Error("Request is not valid."));
      }
      var method = requestArguments.method;
      if (!method) {
        return Promise.reject(new Error("Request is not valid."));
      }

      var messageId = callbackId++;
  
      if (messageId == 0) {
        return sendAPIrequest("web3");
      }

      var payload = {
        id: messageId,
        jsonrpc: "2.0",
        method: method,
        params: requestArguments.params,
      };

      bridgeSend({
        type: "web3-send-async-read-only",
        messageId: messageId,
        payload: payload,
      });

      return new Promise(function (resolve, reject) {
        callbacks[messageId] = {
          beta: true,
          method: method,
          resolve: resolve,
          reject: reject,
        };
      });
    };
  }

  window.xrp = new XRPProvider();
})();`;
};
