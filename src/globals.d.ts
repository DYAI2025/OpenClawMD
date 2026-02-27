interface Window {
  gtag: (...args: unknown[]) => void;
  adsbygoogle: Array<Record<string, unknown>> & { pauseAdRequests?: number };
}
