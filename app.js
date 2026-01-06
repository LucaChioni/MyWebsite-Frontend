const out = document.getElementById("out");

document.getElementById("ping").addEventListener("click", async () => {
  out.textContent = "Chiamo /api/hello ...";
  const r = await fetch("/api/hello");
  const data = await r.json();
  out.textContent = JSON.stringify(data, null, 2);
});

document.getElementById("db_check").addEventListener("click", async () => {
  debugger
  out.textContent = "Chiamo /api/db-check ...";
  const r = await fetch("/api/db-check");
  const data = await r.json();
  out.textContent = JSON.stringify(data, null, 2);
});
