/** @type {chrome.runtime.ManifestV3} */
const manifest = {
  manifest_version: 3,
  name: 'ViSync',
  description: 'Sync videos across any site',
  version: '1.0',
  host_permissions: ['<all_urls>'],
  icons: {
    16: 'icons/logo16.png',
    48: 'icons/logo48.png',
    128: 'icons/logo128.png',
    256: 'icons/logo256.png',
  },
  permissions: ['tabs', 'storage'],
  action: {},
  background: {},
  content_scripts: [],
};

export default manifest;
