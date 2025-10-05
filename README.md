<!-- index.html -->
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>BulsionySec Fortify — Viewer</title>
  <!-- ============================================================= -->
  <!--  PROPRIETARY LEGAL NOTICE                                    -->
  <!--  Copyright © BulsionySec™ SP. All Rights Reserved.           -->
  <!--  This file and its contents are proprietary and confidential. -->
  <!--  Unauthorized copying, modification, distribution, reverse    -->
  <!--  engineering, or disclosure of this material is strictly      -->
  <!--  prohibited. Use of this file constitutes acceptance of the   -->
  <!--  following terms:                                             -->
  <!--   - Provided "AS IS" without warranty of any kind.            -->
  <!--   - Use entirely at your own risk.                            -->
  <!--   - The author and copyright holder shall not be liable for   -->
  <!--     any damages, losses, or claims arising from its use.      -->
  <!--   - No commercial or private redistribution is allowed         -->
  <!--     without explicit written consent from BulsionySec™ SP.    -->
  <!-- ============================================================= -->
  <link rel="preload" href="/index.html" as="document">
  <link rel="preload" href="/styles.css" as="style">
  <link rel="preload" href="/script.js" as="script">
  <style>
    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,'Helvetica Neue',Arial;margin:20px;background:#f7fafc;color:#0f172a}
    .card{background:#fff;padding:18px;border-radius:12px;box-shadow:0 6px 18px rgba(2,6,23,0.08);max-width:980px;margin:12px auto}
    pre{background:#0b1220;color:#dbeafe;padding:12px;border-radius:8px;overflow:auto}
    button{cursor:pointer;padding:8px 12px;border-radius:8px;border:0;background:#0ea5a4;color:white}
    .row{display:flex;gap:12px;flex-wrap:wrap}
    .muted{color:#475569;font-size:0.95rem}
    h1{margin:0 0 8px 0}
  </style>
</head>
<body>
  <div class="card">
    <h1>BulsionySec Fortify — Local Viewer</h1>
    <p class="muted">This page shows the provided Bash script and extracts the configuration (preloaded) for easy viewing and download.</p>

    <div class="row" style="margin-top:12px;">
      <button id="copyBtn">Copy script</button>
      <button id="downloadBtn">Download script</button>
      <button id="showJsonBtn">Show parsed JSON</button>
    </div>

    <section style="margin-top:16px;">
      <h3>Script (fortify.sh)</h3>
      <pre id="scriptBlock" tabindex="0"></pre>
    </section>

    <section style="margin-top:12px;">
      <h3>Parsed Configuration</h3>
      <pre id="jsonBlock">(click "Show parsed JSON")</pre>
    </section>
  </div>

  <script id="embedded-bash" type="text/plain">
#!/usr/bin/env bash
# Standalone executable Bash program based on provided device configuration.
# Copyright © BulsionySec™ SP

# --- Device Configuration ---
macAddress="00:00:00:00:00:00"
btAddress="00:00:00:00:00:00"

# --- IP Configuration ---
ip4="127.0.0.1"
ip6="::1"

# --- Firewall Rule ---
firewall_deny=true
firewall_port=0
firewall_protocol="ALL"

# --- Telemetry ---
telemetry_enabled=false

# --- Hostname & DNS ---
hostname="127.0.0.1"
dns_primary="127.0.0.1"
dns_secondary="::1"

# --- Encryption ---
encryption_method="AES-256"
encryption_enable=true

# --- Traceroute & Fingerprinting ---
traceroute_block=true
fingerprinting_obfuscate=true

# --- Generate Encryption Key (MD5 hash of text) ---
text="Copyright © PyDonSec™ SP"
encryption_key=$(echo -n "$text" | md5sum | awk '{print $1}')

# --- Print Configuration as JSON-like output ---
echo -e "System Configuration Loaded:\n"
cat <<EOF
{
    "device": {
        "macAddress": "$macAddress",
        "btAddress": "$btAddress"
    },
    "ipAddress": {
        "ip4": "$ip4",
        "ip6": "$ip6"
    },
    "firewallRule": {
        "deny": $firewall_deny,
        "port": $firewall_port,
        "protocol": "$firewall_protocol"
    },
    "telemetry": {
        "enabled": $telemetry_enabled
    },
    "hostname": "$hostname",
    "dns": {
        "primary": "$dns_primary",
        "secondary": "$dns_secondary"
    },
    "encryption": {
        "method": "$encryption_method",
        "enable": $encryption_enable,
        "encryption_key": "$encryption_key"
    },
    "traceroute": {
        "block": $traceroute_block
    },
    "fingerprinting": {
        "obfuscate": $fingerprinting_obfuscate
    }
}
EOF

# --- Generate License Key (MD5 hash) ---
license_key=$(echo -n "$text" | md5sum | awk '{print $1}')
echo "Your license key (MD5): $license_key"

# --- Success Message ---
echo "Successfully Fortified!"
  </script>

  <script>
  (function preload(){
    const raw = document.getElementById('embedded-bash').textContent;
    document.getElementById('scriptBlock').textContent = raw.trim();

    const cfg = {};
    raw.split(/\n/).forEach(line=>{
      const m = line.match(/^([a-zA-Z0-9_]+)=(?:"([^"]*)"|(true|false|[0-9:._-]+))$/);
      if(m){
        const key=m[1]; const val=(m[2]!==undefined?m[2]:(m[3]));
        cfg[key]= (val==='true'?true:(val==='false'?false:(/^[0-9]+$/.test(val)?Number(val):val)));
      }
    });

    const parsed = {
      device: { macAddress: cfg.macAddress || '', btAddress: cfg.btAddress || '' },
      ipAddress: { ip4: cfg.ip4||'', ip6: cfg.ip6||'' },
      firewallRule: { deny: cfg.firewall_deny===true, port: cfg.firewall_port||0, protocol: cfg.firewall_protocol||'' },
      telemetry: { enabled: cfg.telemetry_enabled===true },
      hostname: cfg.hostname||'', dns: { primary: cfg.dns_primary||'', secondary: cfg.dns_secondary||'' },
      encryption: { method: cfg.encryption_method||'', enable: cfg.encryption_enable===true },
      traceroute: { block: cfg.traceroute_block===true },
      fingerprinting: { obfuscate: cfg.fingerprinting_obfuscate===true }
    };

    window._fortifyConfig = {raw, cfg, parsed};
    document.getElementById('jsonBlock').textContent = JSON.stringify(parsed, null, 4);
  })();
  </script>

  <script>
  (function(){
    const copyBtn=document.getElementById('copyBtn');
    const downloadBtn=document.getElementById('downloadBtn');
    const showJsonBtn=document.getElementById('showJsonBtn');
    const scriptText = ()=>window._fortifyConfig && window._fortifyConfig.raw || '';

    copyBtn.addEventListener('click', async ()=>{
      try{ await navigator.clipboard.writeText(scriptText()); alert('Script copied to clipboard'); }
      catch(e){ prompt('Copy the script manually:', scriptText()); }
    });

    downloadBtn.addEventListener('click', ()=>{
      const blob=new Blob([scriptText()],{type:'text/x-sh'});
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a'); a.href=url; a.download='fortify.sh'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    });

    showJsonBtn.addEventListener('click', ()=>{
      const pre=document.getElementById('jsonBlock');
      pre.textContent = JSON.stringify(window._fortifyConfig.parsed, null, 4);
      pre.scrollIntoView({behavior:'smooth'});
    });
  })();
  </script>

  <!-- ============================================================= -->
  <!-- END OF FILE LEGAL DISCLAIMER                                  -->
  <!-- This HTML viewer is provided for informational and testing     -->
  <!-- purposes only. No guarantees are made regarding functionality, -->
  <!-- accuracy, or security. By using this file you agree that the   -->
  <!-- author, copyright holder, and affiliates cannot be held        -->
  <!-- responsible for any damages or losses of any kind.            -->
  <!-- ============================================================= -->
</body>
</html>


<!-- Separate README.md file -->

# BulsionySec™ Fortify — Bash Standalone

A small standalone Bash program that outputs a JSON-like system configuration and a license key (MD5). This repository contains:

- `fortify.sh` — the Bash program (provided by the user).
- `index.html` — a local viewer for the script plus convenience actions (copy, download, view JSON output simulated).

## Features
- Prints device, IP, firewall, DNS, encryption and telemetry configuration.
- Generates an MD5-based encryption and license key from the built-in text string.
- `index.html` provides a readable UI, a copy-to-clipboard button, and a download button for the Bash script.

## Usage
1. Make the script executable: `chmod +x fortify.sh`
2. Run: `./fortify.sh`

## Notes
- This HTML file is static and intended for local use only.
- The HTML calculates the MD5 license key using a small JS implementation for preview only; it does not run the Bash script.
- Replace example values (macAddress, ip4, etc.) with real values before deploying on a live system.

---

## Proprietary License and Liability Disclaimer

**Copyright © BulsionySec™ SP. All Rights Reserved.**  
This software, documentation, and associated files are proprietary and confidential. Redistribution, modification, reverse-engineering, or derivative works are strictly prohibited without explicit written consent from BulsionySec™ SP.

### Terms of Use
- Provided strictly on an **AS-IS** basis with **no warranty** of any kind, express or implied.
- The author, copyright holder, and affiliates **disclaim all liability** for damages, losses, or claims resulting from use, misuse, or inability to use this software.
- You agree to use this software **entirely at your own risk**.
- Commercial use, resale, sublicensing, or distribution is **prohibited without written authorization**.
- No guarantees are made regarding suitability, fitness, accuracy, or compatibility.

By using or accessing this software, you acknowledge and accept that **BulsionySec™ SP** and its affiliates shall **not be held liable** for any direct, indirect, incidental, or consequential damages, regardless of the form or theory of action.

---

**End of Document**
