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

function toggleInputs(prefix) {
  const type = document.getElementById(`shape${prefix}Type`).value;
  const isSquare = type === "square";

  document.getElementById(`row${prefix}Width`).classList.toggle("hidden", isSquare);
  document.getElementById(`row${prefix}Height`).classList.toggle("hidden", isSquare);
  document.getElementById(`row${prefix}Side`).classList.toggle("hidden", !isSquare);
}

function updateCalculator() {
  if (!calculateMetricsPy) return;

  const typeA = document.getElementById("shapeAType").value;
  const aW = document.getElementById("shapeAWidth").value || 1;
  const aH = document.getElementById("shapeAHeight").value || 1;
  const aS = document.getElementById("shapeASide").value || 1;

  const typeB = document.getElementById("shapeBType").value;
  const bW = document.getElementById("shapeBWidth").value || 1;
  const bH = document.getElementById("shapeBHeight").value || 1;
  const bS = document.getElementById("shapeBSide").value || 1;

  // Call the Python function as a standard JS function
  const pyMap = calculateMetricsPy(typeA, aW, aH, aS, typeB, bW, bH, bS);
  const results = pyMap.toJs();
  pyMap.destroy();

  // Populate UI
  document.getElementById("statArea").innerText = results.get("area");
  document.getElementById("statPerimeter").innerText = results.get("perimeter");
  document.getElementById("statDiagonal").innerText = results.get("diagonal");
  document.getElementById("statFits").innerText = results.get("fits");
  document.getElementById("shapeRepr").innerText = results.get("repr");
  document.getElementById("pictureDisplay").innerText = results.get("picture");
}