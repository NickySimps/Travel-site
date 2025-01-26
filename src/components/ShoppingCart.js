import { CONFIG } from './config.js';

export const initializeCart = () => {
    window.SnipcartSettings = {
      publicApiKey: 'ZjFmOWZjNDUtM2VmMC00ZmExLTkzMTctMjExM2UzZDcwZjI3NjM4Njg4Nzc3OTMyNzM5MTQ3',
      loadStrategy: 'on-user-interaction',
      modalStyle: "side",
      protocol: 'https',
      domain: 'cdn.snipcart.com'
    };
  };

  const script = document.createElement('script');
  script.src = "https://cdn.snipcart.com/themes/v3.0/default/snipcart.js";
  document.body.appendChild(script);

  const link = document.createElement('link');
  link.rel = "stylesheet";
  link.href = "https://cdn.snipcart.com/themes/v3.0/default/snipcart.css";
  document.head.appendChild(link);
