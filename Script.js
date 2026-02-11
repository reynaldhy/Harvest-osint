async function startScan() {
  const domain = document.getElementById("domainInput").value;
  const loading = document.getElementById("loading");
  
  const emailList = document.getElementById("emailList");
  const subdomainList = document.getElementById("subdomainList");
  const dnsInfo = document.getElementById("dnsInfo");
  const ipInfo = document.getElementById("ipInfo");
  const whoisInfo = document.getElementById("whoisInfo");
  
  emailList.innerHTML = "";
  subdomainList.innerHTML = "";
  dnsInfo.innerText = "";
  ipInfo.innerText = "";
  whoisInfo.innerText = "";
  
  loading.classList.remove("hidden");
  
  // 🔎 Email Pattern Generator
  const patterns = ["admin", "info", "support", "contact", "sales", "help"];
  patterns.forEach(p => {
    let li = document.createElement("li");
    li.innerText = p + "@" + domain;
    emailList.appendChild(li);
  });
  
  // 🌐 Subdomain wordlist
  const subs = ["mail", "api", "dev", "test", "blog", "vpn"];
  subs.forEach(s => {
    let li = document.createElement("li");
    li.innerText = s + "." + domain;
    subdomainList.appendChild(li);
  });
  
  // 📡 DNS via Google DNS API
  try {
    const dnsRes = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
    const dnsData = await dnsRes.json();
    dnsInfo.innerText = JSON.stringify(dnsData.Answer || "No DNS found", null, 2);
  } catch {
    dnsInfo.innerText = "DNS lookup failed.";
  }
  
  // 🧠 IP Resolver
  try {
    const ipRes = await fetch(`https://api.ipify.org?domain=${domain}&format=json`);
    const ipData = await ipRes.json();
    ipInfo.innerText = JSON.stringify(ipData, null, 2);
  } catch {
    ipInfo.innerText = "IP lookup failed.";
  }
  
  // 🛡️ WHOIS (free public API)
  try {
    const whoisRes = await fetch(`https://api.api-ninjas.com/v1/whois?domain=${domain}`, {
      headers: { 'X-Api-Key': '7bq0l12fMkqrbZPeVLOXLXqesfQ1fwym7j53CGjs' }
    });
    const whoisData = await whoisRes.json();
    whoisInfo.innerText = JSON.stringify(whoisData, null, 2);
  } catch {
    whoisInfo.innerText = "WHOIS failed (Need API Key)";
  }
  
  loading.classList.add("hidden");
}

function exportResults() {
  const content = document.querySelector(".result-box").innerText;
  const blob = new Blob([content], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "osint-result.txt";
  a.click();
}
