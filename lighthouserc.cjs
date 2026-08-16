module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm.cmd run dev -- --hostname 127.0.0.1 --port 3100",
      startServerReadyPattern: "Ready",
      url: [
        "http://127.0.0.1:3100/",
        "http://127.0.0.1:3100/stays",
        "http://127.0.0.1:3100/stays/dalhousie",
        "http://127.0.0.1:3100/booking/stay/dalhousie?room=Standard%20Room",
        "http://127.0.0.1:3100/payment?type=stay&id=dalhousie&total=4500",
        "http://127.0.0.1:3100/cafe",
        "http://127.0.0.1:3100/trips/spiti",
      ],
      numberOfRuns: 1,
      settings: {
        preset: "desktop",
        chromeFlags: "--headless --no-sandbox",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.85 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["warn", { maxNumericValue: 0.1 }],
      },
    },
    upload: { target: "filesystem", outputDir: "test-artifacts/lighthouse" },
  },
}
