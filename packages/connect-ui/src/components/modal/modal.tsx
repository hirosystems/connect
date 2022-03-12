import { Component, getAssetPath, h, Prop, State, Element } from '@stencil/core';
import CloseIcon from './assets/close-icon.svg';
import HiroWalletLogo from './assets/hiro-wallet-logo.svg';
import type { AuthOptions } from '@stacks/connect/types/auth';
import { getBrowser } from './utils';

const browserNotSupportedAssetPath = './assets/browser-not-supported.png';
const downloadHiroWalletAssetPath = './assets/download-hiro-wallet.png';

const CHROME_BROWSER_URL = 'https://www.google.com/chrome/';
const BRAVE_BROWSER_URL = 'https://brave.com/';
const FIREFOX_BROWSER_URL = 'https://www.mozilla.org/en-US/';
const CHROME_STORE_URL =
  'https://chrome.google.com/webstore/detail/stacks-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj/';
const FIREFOX_STORE_URL = 'https://addons.mozilla.org/en-US/firefox/addon/hiro-wallet/';
@Component({
  tag: 'connect-modal',
  styleUrl: 'modal.scss',
  assetsDirs: ['assets'],
  shadow: true,
})
export class Modal {
  @Prop() authOptions: AuthOptions;

  @State()
  hasOpenedInstall: boolean;

  @Element() modalEl: HTMLElement;

  handleCloseModal() {
    this.modalEl.remove();
    this.authOptions.onCancel?.();
  }

  handleDownloadPath(browser: string) {
    if (browser === 'Chrome') {
      window.open(CHROME_STORE_URL, '_blank');
    } else if (browser === 'Firefox') {
      window.open(FIREFOX_STORE_URL, '_blank');
    } else {
      window.open('https://www.hiro.so/wallet/install-web', '_blank');
    }
    this.hasOpenedInstall = true;
  }

  render() {
    const browser = getBrowser();

    return (
      <div class="modal-container">
        <div class="modal-body">
          <div class="modal-header">
            <div class="header-left">
              <img src={HiroWalletLogo} />
            </div>
            <img class="header-right" src={CloseIcon} onClick={() => this.handleCloseModal()} />
          </div>
          {browser ? (
            <div class="modal-content">
              <div class="modal-illustration">
                <img src={getAssetPath(downloadHiroWalletAssetPath)} width={310} />
              </div>
              <span class="modal-title supported">Add Hiro Wallet to {browser}</span>
              <div class="modal-subtitle">
                Hiro Wallet is your gateway to Stacks apps like {this.authOptions.appDetails.name}.
                Add it to {browser} to continue.
              </div>
            </div>
          ) : (
            <div class="modal-content">
              <div class="modal-illustration">
                <img src={getAssetPath(browserNotSupportedAssetPath)} width={239} />
              </div>
              <span class="modal-title unsupported">Your browser isn't supported</span>
              <div class="modal-subtitle">
                To sign in to {this.authOptions.appDetails.name} using the Hiro Wallet browser
                extension, try{` `}
                <a href={CHROME_BROWSER_URL} target="_blank">
                  Chrome
                </a>
                {`, `}
                <a href={BRAVE_BROWSER_URL} target="_blank">
                  Brave
                </a>
                {`, or `}
                <a href={FIREFOX_BROWSER_URL} target="_blank">
                  Firefox
                </a>
                {` on desktop.`}
              </div>
            </div>
          )}
          {this.hasOpenedInstall ? (
            <div class="modal-subtitle">
              After installing Hiro Wallet, reload this page and sign in.
            </div>
          ) : browser ? (
            <div class="button-container">
              <button
                class="button"
                onClick={() => {
                  this.handleDownloadPath(browser);
                }}
              >
                Download Hiro Wallet
              </button>
            </div>
          ) : null}
          <div class="modal-footer">
            <span class="link" onClick={() => window.open('https://www.hiro.so/wallet', '_blank')}>
              About Hiro Wallet →
            </span>
          </div>
        </div>
      </div>
    );
  }
}
