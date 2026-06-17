export const getStatusHtml = (stats) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Krushisarthi API Service</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #0b0f19;
            --card-bg: rgba(17, 24, 39, 0.7);
            --border-color: rgba(255, 255, 255, 0.08);
            --primary: #10b981;
            --primary-glow: rgba(16, 185, 129, 0.15);
            --text-main: #f3f4f6;
            --text-muted: #9ca3af;
            --accent: #3b82f6;
            --accent-glow: rgba(59, 130, 246, 0.15);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow-x: hidden;
            position: relative;
        }

        /* Decorative background elements */
        body::before {
            content: '';
            position: absolute;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%);
            top: 10%;
            left: 10%;
            z-index: -1;
            filter: blur(50px);
        }

        body::after {
            content: '';
            position: absolute;
            width: 350px;
            height: 350px;
            background: radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%);
            bottom: 10%;
            right: 10%;
            z-index: -1;
            filter: blur(60px);
        }

        .container {
            width: 100%;
            max-width: 750px;
            padding: 24px;
            z-index: 1;
        }

        .card {
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--border-color);
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 32px;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 24px;
        }

        .title-area {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .logo-placeholder {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            width: 48px;
            height: 48px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            color: #fff;
            font-size: 20px;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .title-text h1 {
            font-family: 'Outfit', sans-serif;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.5px;
            background: linear-gradient(to right, #ffffff, #d1d5db);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .title-text p {
            font-size: 14px;
            color: var(--text-muted);
            margin-top: 2px;
        }

        .badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            border-radius: 9999px;
            font-size: 13px;
            font-weight: 600;
            background: var(--primary-glow);
            color: var(--primary);
            border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .pulse-dot {
            width: 8px;
            height: 8px;
            background-color: var(--primary);
            border-radius: 50%;
            display: inline-block;
            animation: pulse 1.8s infinite ease-in-out;
        }

        @keyframes pulse {
            0% {
                transform: scale(0.85);
                box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
            }
            70% {
                transform: scale(1);
                box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
            }
            100% {
                transform: scale(0.85);
                box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
            }
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 32px;
        }

        .metric-card {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 20px;
            transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .metric-card:hover {
            transform: translateY(-2px);
            border-color: rgba(255, 255, 255, 0.15);
        }

        .metric-label {
            font-size: 13px;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
            font-weight: 500;
        }

        .metric-value {
            font-size: 18px;
            font-weight: 600;
            color: var(--text-main);
            font-family: 'Outfit', sans-serif;
        }

        .endpoints {
            margin-top: 32px;
        }

        .endpoints-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 16px;
            color: var(--text-main);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .endpoint-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 18px;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid var(--border-color);
            margin-bottom: 12px;
            transition: all 0.2s ease;
        }

        .endpoint-row:hover {
            background: rgba(255, 255, 255, 0.04);
            border-color: rgba(59, 130, 246, 0.3);
        }

        .endpoint-path {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .method-badge {
            font-size: 11px;
            font-weight: 700;
            padding: 4px 8px;
            border-radius: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .method-get {
            background: rgba(59, 130, 246, 0.15);
            color: #3b82f6;
            border: 1px solid rgba(59, 130, 246, 0.25);
        }

        .path-text {
            font-family: monospace;
            font-size: 14px;
            color: #d1d5db;
        }

        .btn-link {
            text-decoration: none;
            font-size: 13px;
            color: var(--accent);
            font-weight: 600;
            transition: opacity 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }

        .btn-link:hover {
            opacity: 0.8;
            text-decoration: underline;
        }

        .footer {
            text-align: center;
            margin-top: 24px;
            font-size: 12px;
            color: var(--text-muted);
        }

        @media (max-width: 600px) {
            .grid {
                grid-template-columns: 1fr;
            }
            .card {
                padding: 24px;
            }
            .header {
                flex-direction: column;
                align-items: flex-start;
                gap: 16px;
            }
            .badge {
                align-self: flex-start;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="header">
                <div class="title-area">
                    <div class="logo-placeholder">KS</div>
                    <div class="title-text">
                        <h1>Krushisarthi Backend</h1>
                        <p>Express.js API Service</p>
                    </div>
                </div>
                <div class="badge">
                    <span class="pulse-dot"></span>
                    <span>System Online</span>
                </div>
            </div>

            <div class="grid">
                <div class="metric-card">
                    <div class="metric-label">Environment</div>
                    <div class="metric-value">${stats.env}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Uptime</div>
                    <div class="metric-value">${stats.uptime}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Memory Usage</div>
                    <div class="metric-value">${stats.memory}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Node Version</div>
                    <div class="metric-value">${stats.nodeVersion}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Database Status</div>
                    <div class="metric-value" style="color: ${stats.dbColor};">${stats.dbStatus}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Database Host</div>
                    <div class="metric-value" style="font-size: 14px; font-family: monospace; word-break: break-all;">${stats.dbHost}</div>
                </div>
            </div>

            <div class="endpoints">
                <h2 class="endpoints-title">Available Routes</h2>
                
                <div class="endpoint-row">
                    <div class="endpoint-path">
                        <span class="method-badge method-get">GET</span>
                        <span class="path-text">/</span>
                    </div>
                    <span style="font-size: 13px; color: var(--text-muted);">API dashboard (this page)</span>
                </div>

                <div class="endpoint-row">
                    <div class="endpoint-path">
                        <span class="method-badge method-get">GET</span>
                        <span class="path-text">/api/health</span>
                    </div>
                    <a href="/api/health" class="btn-link" target="_blank">Test JSON ↗</a>
                </div>

                <div class="endpoint-row">
                    <div class="endpoint-path">
                        <span class="method-badge" style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.25);">POST</span>
                        <span class="path-text">/api/orders</span>
                    </div>
                    <span style="font-size: 13px; color: var(--text-muted);">Place a new order</span>
                </div>

                <div class="endpoint-row">
                    <div class="endpoint-path">
                        <span class="method-badge method-get">GET</span>
                        <span class="path-text">/api/orders</span>
                    </div>
                    <a href="/api/orders" class="btn-link" target="_blank">View All ↗</a>
                </div>
            </div>
        </div>
        <div class="footer">
            Hope Foundation Gadhinglaj Pvt. Ltd. &copy; ${new Date().getFullYear()} &bull; Built with Node.js & Express
        </div>
    </div>
</body>
</html>
  `;
};
