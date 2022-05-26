/* eslint-disable @next/next/no-img-element */
import { useDashboard } from "@contexts/DashboardContext";
import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { useToasts } from "react-toast-notifications";

const ProxyList = () => {
  const { addToast, removeToast } = useToasts();
  const { state } = useDashboard();
  const [proxies, setProxies] = useState("");

  useEffect(() => {
    if (state.generatedState.proxies.length > 0) {
      let generatedProxiesText = "";

      state.generatedState.proxies.forEach((x) => {
        generatedProxiesText += `${x}\n`;
      });

      setProxies(generatedProxiesText);
    }
  }, [state.generatedState.proxies]);

  const handleCopyToClipboard = async () => {
    await navigator.clipboard.writeText(proxies);
    addToast("Copied!", { appearance: "info", autoDismiss: true });
  };

  const handleDownloadProxies = async () => {
    var blob = new Blob([proxies], {
      type: "text/plain;charset=utf-8",
    });

    saveAs(blob, "nora-elite-proxies-generated.txt");
  };

  const clearProxies = async () => {
    setProxies("");
    state.generatedState.proxies = [];
  };

  return (
    <>
      <div className="proxies-right">
        <div className="isp-btn">
          <button>Residential</button>
          <button className="btn_isp">ISP</button>
        </div>
        <div className="proxies-table-wrap">
          <h2>Proxies</h2>
          <div className="table-icon">
            <button>
              {state.generatedState.proxies.length} Proxies Generated
            </button>
            <button title="clear proxies" onClick={clearProxies}>
              <img src="/imgs/close.png" alt="clear proxies" />
            </button>
            <button title="download proxies" onClick={handleDownloadProxies}>
              <img src="/imgs/download.png" alt="" />
            </button>
            <button title="copy proxies" onClick={handleCopyToClipboard}>
              <img src="/imgs/file.png" alt="" />
            </button>
          </div>
          <div className="">
            <textarea
              className="form-control"
              id="proxy-textarea"
              style={{
                backgroundColor: "black",
                border: "1px solid #7e6961",
                overflowY: "scroll",
                resize: "none",
                color: "white",
                height: "635px",
              }}
              value={proxies}
              cols={30}
              rows={25}
              disabled={true}
            ></textarea>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProxyList;
