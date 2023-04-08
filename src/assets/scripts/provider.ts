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
          var selectedAddress = data.result.result.address[0];
                    
          window.xrp.selectedAddress = selectedAddress;
          window.xrp.emit("accountsChanged", data.result.result.address);
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

    XRPProvider.prototype._events = {};
    XRPProvider.prototype.isSolidiFi = true; // allows UI detection for SolidiFi
    XRPProvider.prototype.isConnected = function () {
      return true;
    };

    XRPProvider.prototype.enable = function () {
      return sendAPIrequest("web3");
    };
    
    XRPProvider.prototype.on = function (name, listener) {
      if (!this._events[name]) {
        this._events[name] = [];
      }
      this._events[name].push(listener);
    };
    
    XRPProvider.prototype.emit = function (name, data) {
      if (!this._events[name]) {
        return;
      }
      
      this._events[name].forEach((cb) => {
       try {
          cb(data);
        } catch (e) {
          setTimeout(() => {
            throw e;
          });
        }
      });
    };
  }

  window.xrp = new XRPProvider();
})();`;
};
