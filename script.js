let pyodideInstance = null;
let calculateMetricsPy = null;

async function initPython() {
  const statusEl = document.getElementById("status");
  try {
    statusEl.innerText = "Loading Pyodide runtime...";
    pyodideInstance = await loadPyodide();

    // Fetch and load the external main.py file
    const response = await fetch("main.py");
    if (!response.ok) {
      throw new Error(`Failed to load main.py (status: ${response.status})`);
    }
    const pythonCode = await response.text();
    await pyodideInstance.runPythonAsync(pythonCode);

    // Bind the Python helper function directly to a JavaScript variable
    calculateMetricsPy = pyodideInstance.globals.get("calculate_metrics");

    statusEl.innerText = "Python environment ready.";
    statusEl.style.color = "#059669";

    updateCalculator();
  } catch (err) {
    statusEl.innerText = "Error: " + err.message;
    statusEl.style.color = "#dc2626";
    console.error(err);
  }
}

initPython();