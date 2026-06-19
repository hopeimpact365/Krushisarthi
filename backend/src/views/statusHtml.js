export const getStatusHtml = (stats) => {
  const envCheckListJson = JSON.stringify(stats.envChecks || []);
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Krushisarthi Status Center</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #f8fafc;
            --card-bg: #ffffff;
            --border-color: #e2e8f0;
            --text-main: #0f172a;
            --text-muted: #64748b;
            --primary: #10b981;
            --primary-light: #ecfdf5;
            --accent: #3b82f6;
            --accent-light: #eff6ff;
            --warning: #f59e0b;
            --warning-light: #fef3c7;
            --danger: #ef4444;
            --danger-light: #fef2f2;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 40px 16px;
            line-height: 1.5;
        }

        .container {
            width: 100%;
            max-width: 900px;
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        /* Clean Header */
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 20px;
        }

        .brand h1 {
            font-family: 'Outfit', sans-serif;
            font-size: 22px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }

        .brand p {
            font-size: 13px;
            color: var(--text-muted);
            margin-top: 4px;
        }

        .status-pill {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px;
            border-radius: 9999px;
            font-size: 13px;
            font-weight: 600;
            border: 1px solid var(--border-color);
            background: var(--card-bg);
        }

        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            display: inline-block;
        }

        .pulse {
            animation: pulse-ring 2s infinite ease-in-out;
        }

        @keyframes pulse-ring {
            0% { opacity: 0.5; }
            50% { opacity: 1; }
            100% { opacity: 0.5; }
        }

        /* Bento Grid */
        .grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
        }

        .card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .card-label {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--text-muted);
        }

        .card-value {
            font-family: 'Outfit', sans-serif;
            font-size: 22px;
            font-weight: 600;
            color: var(--text-main);
            word-break: break-all;
        }

        .card-footer {
            font-size: 12px;
            color: var(--text-muted);
            margin-top: 4px;
        }

        /* Sections and Panels */
        .panel {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .panel-title {
            font-family: 'Outfit', sans-serif;
            font-size: 16px;
            font-weight: 600;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .col-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }

        /* Configuration auditor table */
        .table-wrapper {
            overflow-x: auto;
            width: 100%;
        }

        .status-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }

        .status-table th, .status-table td {
            padding: 10px 12px;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
        }

        .status-table th {
            font-weight: 600;
            color: var(--text-muted);
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .status-table tr:last-child td {
            border-bottom: none;
        }

        .monospace {
            font-family: monospace;
            font-size: 13px;
        }

        /* Status tags */
        .tag {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .tag-success {
            background-color: var(--primary-light);
            color: var(--primary);
        }

        .tag-danger {
            background-color: var(--danger-light);
            color: var(--danger);
        }

        .tag-warning {
            background-color: var(--warning-light);
            color: var(--warning);
        }

        .tag-info {
            background-color: var(--accent-light);
            color: var(--accent);
        }

        /* Custom buttons */
        .btn-simple {
            background: #ffffff;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            padding: 6px 12px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.15s;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .btn-simple:hover {
            background: #f8fafc;
            border-color: #cbd5e1;
        }

        .btn-simple:active {
            background: #f1f5f9;
        }

        /* Footer */
        .footer {
            text-align: center;
            font-size: 12px;
            color: var(--text-muted);
            margin-top: 16px;
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        @media (max-width: 768px) {
            .grid {
                grid-template-columns: 1fr;
            }
            .col-2 {
                grid-template-columns: 1fr;
            }
            .panel {
                padding: 16px;
            }
            body {
                padding: 20px 12px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- HEADER -->
        <header class="header">
            <div class="brand">
                <h1>Krushisarthi API Monitor</h1>
                <p>Express API server diagnostics for localhost:${stats.port}</p>
            </div>
            <div class="status-pill">
                <span class="status-dot pulse" style="background-color: ${stats.dbColor};"></span>
                <span style="color: ${stats.dbColor === '#10b981' ? 'var(--text-main)' : stats.dbColor};">
                    ${stats.dbStatus === 'Connected' ? 'System Operational' : 'Database Error'}
                </span>
            </div>
        </header>

        <!-- THREE CORE STATS -->
        <section class="grid">
            <div class="card">
                <span class="card-label">Active Environment</span>
                <span class="card-value" style="color: ${stats.env === 'Production' ? 'var(--warning)' : 'var(--accent)'}">${stats.env}</span>
                <span class="card-footer">Running in ${stats.env.toLowerCase()} mode</span>
            </div>
            <div class="card">
                <span class="card-label">Uptime</span>
                <span class="card-value" id="uptime-display">${stats.uptime}</span>
                <span class="card-footer">Process runtime duration</span>
            </div>
            <div class="card">
                <span class="card-label">Memory Usage</span>
                <span class="card-value">${stats.memory}</span>
                <span class="card-footer">Active heap allocation</span>
            </div>
        </section>

        <!-- CONFIGURATION AUDIT & SYSTEM TELEMETRY -->
        <section class="col-2">
            <!-- Env Config -->
            <div class="panel">
                <h2 class="panel-title">Environment Checklist</h2>
                <div class="table-wrapper">
                    <table class="status-table">
                        <thead>
                            <tr>
                                <th>Variable</th>
                                <th>Status</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(stats.envChecks || []).map(item => `
                                <tr>
                                    <td class="monospace" style="font-weight: 500;">${item.name}</td>
                                    <td>
                                        <span class="tag ${
                                            item.check.status === 'Valid' ? 'tag-success' : 
                                            item.check.status === 'Invalid' ? 'tag-warning' : 'tag-danger'
                                        }">
                                            ${item.check.status}
                                        </span>
                                    </td>
                                    <td class="monospace" style="color: var(--text-muted); font-size: 12px;">
                                        ${item.check.value}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- System Telemetry & Ping -->
            <div class="panel" style="justify-content: flex-start; gap: 20px;">
                <div>
                    <h2 class="panel-title" style="margin-bottom: 12px;">System Hardware</h2>
                    <table class="status-table">
                        <tbody>
                            <tr>
                                <td style="font-weight: 500; padding: 8px 0;">Platform</td>
                                <td class="monospace" style="text-align: right; padding: 8px 0; color: var(--text-muted);">${stats.platform} (${stats.arch})</td>
                            </tr>
                            <tr>
                                <td style="font-weight: 500; padding: 8px 0;">CPU Count</td>
                                <td class="monospace" style="text-align: right; padding: 8px 0; color: var(--text-muted);">${stats.cpuCount} Cores</td>
                            </tr>
                            <tr>
                                <td style="font-weight: 500; padding: 8px 0;">Node Version</td>
                                <td class="monospace" style="text-align: right; padding: 8px 0; color: var(--text-muted);">${stats.nodeVersion}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: 500; padding: 8px 0;">RAM Status</td>
                                <td class="monospace" style="text-align: right; padding: 8px 0; color: var(--text-muted);">${stats.systemFreeMem} free / ${stats.systemTotalMem}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style="border-top: 1px solid var(--border-color); padding-top: 16px;">
                    <h3 style="font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600; margin-bottom: 10px;">Database Diagnostics</h3>
                    <table class="status-table" style="margin-bottom: 16px;">
                        <tbody>
                            <tr>
                                <td style="font-weight: 500; padding: 6px 0;">Database Cluster</td>
                                <td class="monospace" style="text-align: right; padding: 6px 0; font-size: 11px; word-break: break-all; color: var(--text-muted);">${stats.dbHost}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: 500; padding: 6px 0;">Database Name</td>
                                <td class="monospace" style="text-align: right; padding: 6px 0; color: var(--text-muted);">${stats.dbName}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: 500; padding: 6px 0;">Latency</td>
                                <td class="monospace" id="latency-value" style="text-align: right; padding: 6px 0; font-weight: 600; color: var(--text-muted);">Measuring...</td>
                            </tr>
                        </tbody>
                    </table>
                    <button class="btn-simple" id="btn-ping-db" style="width: 100%; justify-content: center;">
                        Run Latency Check
                    </button>
                </div>
            </div>
        </section>

        <!-- API ROUTES GATEWAY -->
        <section class="panel">
            <h2 class="panel-title">Operational Routes</h2>
            <div class="table-wrapper">
                <table class="status-table">
                    <thead>
                        <tr>
                            <th>Method</th>
                            <th>Path</th>
                            <th>Description</th>
                            <th>Verify</th>
                            <th>Response</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><span class="tag tag-info">GET</span></td>
                            <td class="monospace" style="font-weight: 500;">/</td>
                            <td>Status portal view dashboard</td>
                            <td><a href="/" class="btn-simple" style="padding: 3px 8px;">Visit</a></td>
                            <td class="monospace" style="color: var(--primary);">200 OK</td>
                        </tr>
                        <tr>
                            <td><span class="tag tag-info">GET</span></td>
                            <td class="monospace" style="font-weight: 500;">/api/health</td>
                            <td>Telemetry JSON Healthcheck</td>
                            <td><button class="btn-simple btn-ping-route" data-route="/api/health" style="padding: 3px 8px;">Test</button></td>
                            <td class="monospace route-latency-display" data-route="/api/health">--</td>
                        </tr>
                        <tr>
                            <td><span class="tag tag-success">POST</span></td>
                            <td class="monospace" style="font-weight: 500;">/api/orders</td>
                            <td>Place checkout order confirmation</td>
                            <td><span style="color: var(--text-muted); font-size: 11px;">Auth / Payload required</span></td>
                            <td class="monospace">--</td>
                        </tr>
                        <tr>
                            <td><span class="tag tag-info">GET</span></td>
                            <td class="monospace" style="font-weight: 500;">/api/orders</td>
                            <td>Retrieve all orders dashboard dataset</td>
                            <td><button class="btn-simple btn-ping-route" data-route="/api/orders" style="padding: 3px 8px;">Test</button></td>
                            <td class="monospace route-latency-display" data-route="/api/orders">--</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- FOOTER -->
        <footer class="footer">
            <div>
                <strong>Hope Foundation Gadhinglaj Pvt. Ltd.</strong> &copy; ${new Date().getFullYear()}
            </div>
            <div style="font-size: 11px;">
                Node ${process.version} &bull; Express 4.19 &bull; Mongoose 8.4
            </div>
        </footer>
    </div>

    <!-- SCRIPTS -->
    <script>
        const btnPingDb = document.getElementById('btn-ping-db');
        const latencyValue = document.getElementById('latency-value');

        const testDbPing = async () => {
            latencyValue.innerText = 'Pinging...';
            latencyValue.style.color = 'var(--text-muted)';
            const start = Date.now();
            try {
                const response = await fetch('/api/db-ping');
                const data = await response.json();
                const latency = Date.now() - start;
                
                if (data.success) {
                    const finalMs = data.latencyMs || latency;
                    latencyValue.innerText = finalMs + ' ms';
                    if (finalMs < 100) {
                        latencyValue.style.color = 'var(--primary)';
                    } else if (finalMs < 300) {
                        latencyValue.style.color = 'var(--warning)';
                    } else {
                        latencyValue.style.color = 'var(--danger)';
                    }
                } else {
                    throw new Error('Ping failed');
                }
            } catch (err) {
                latencyValue.innerText = 'Error';
                latencyValue.style.color = 'var(--danger)';
            }
        };

        // Route latency check
        const routePingButtons = document.querySelectorAll('.btn-ping-route');
        routePingButtons.forEach(btn => {
            btn.addEventListener('click', async () => {
                const route = btn.dataset.route;
                const display = document.querySelector(\`.route-latency-display[data-route="\${route}"]\`);
                display.innerText = 'Testing...';
                display.style.color = 'var(--text-muted)';
                
                const start = Date.now();
                try {
                    const response = await fetch(route);
                    const duration = Date.now() - start;
                    
                    if (response.ok) {
                        display.innerText = duration + ' ms';
                        display.style.color = duration < 120 ? 'var(--primary)' : 'var(--warning)';
                    } else {
                        display.innerText = \`\${response.status} Err\`;
                        display.style.color = 'var(--danger)';
                    }
                } catch (e) {
                    display.innerText = 'Err';
                    display.style.color = 'var(--danger)';
                }
            });
        });

        // Initialize DB latency check
        testDbPing();
        btnPingDb.addEventListener('click', testDbPing);
    </script>
</body>
</html>
  `;
};
