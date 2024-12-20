document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("toggle-tracking");
    const downloadButton = document.getElementById("download-har");
    const clearButton = document.getElementById("clear-calls");
  
    let isTrackingEnabled = false;
  
    const updateToggleButton = () => {
      toggleButton.textContent = isTrackingEnabled ? "Disable Tracking" : "Enable Tracking";
    };
  
    toggleButton.addEventListener("click", () => {
      isTrackingEnabled = !isTrackingEnabled;
      chrome.runtime.sendMessage({ type: "toggle-tracking", enabled: isTrackingEnabled }, (response) => {
        if (response.success) {
          updateToggleButton();
        }
      });
    });
  
    downloadButton.addEventListener("click", () => {
      chrome.runtime.sendMessage({ type: "get-har" }, (response) => {
        if (response.har) {
          const blob = new Blob([response.har], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "network-calls.har";
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    });
  
    clearButton.addEventListener("click", () => {
      chrome.storage.local.set({ calls: [] }, loadCalls);
    });
  
    updateToggleButton();
  });
  