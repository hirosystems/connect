// eslint-disable-next-line unused-imports/no-unused-imports
import { Component, h, Prop, State, Element } from '@stencil/core';
import CloseIcon from './assets/close-icon.svg';
import HiroWalletLogo from './assets/hiro-wallet-logo.svg';
import XverseWalletLogo from './assets/xverse-wallet-logo.svg';
import type { AuthOptions } from '@stacks/connect/types/auth';
import { getBrowser, getPlatform } from './utils';

const CHROME_BROWSER_URL = 'https://www.google.com/chrome/';
const BRAVE_BROWSER_URL = 'https://brave.com/';
const FIREFOX_BROWSER_URL = 'https://www.mozilla.org/en-US/';
const CHROME_STORE_URL =
  'https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj/';
const FIREFOX_STORE_URL = 'https://addons.mozilla.org/en-US/firefox/addon/hiro-wallet/';
const XVERSE_APP_STORE_URL = 'https://apps.apple.com/app/id1552272513';
const XVERSE_PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse';
const XVERSE_CHROME_STORE_URL =
  'https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg';

@Component({
  tag: 'connect-modal',
  styleUrl: 'modal.scss',
  assetsDirs: ['assets'],
  shadow: true,
})
export class Modal {
  @Prop() authOptions: AuthOptions;

  @State() hasOpenedInstall: boolean;

  @Element() modalEl: HTMLConnectModalElement;

  handleCloseModal() {
    this.modalEl.remove();
    this.authOptions.onCancel?.();
  }

  handleDownloadPath(browser: string) {
    if (browser === 'Chrome') {
      window.open(CHROME_STORE_URL, '_blank');
    } else if (browser === 'Firefox') {
      window.open(FIREFOX_STORE_URL, '_blank');
    } else if (browser === 'IOS') {
      window.open(XVERSE_APP_STORE_URL, '_blank');
      this.hasOpenedInstallXverse = true;
      return;
    } else if (browser === 'Android') {
      window.open(XVERSE_PLAY_STORE_URL, '_blank');
      this.hasOpenedInstallXverse = true;
      return;
    } else if (browser === 'Xverse-Chrome') {
      window.open(XVERSE_CHROME_STORE_URL, '_blank');
      this.hasOpenedInstallXverse = true;
      return;
    } else {
      window.open('https://www.hiro.so/wallet/install-web', '_blank');
    }
    this.hasOpenedInstall = true;
  }

  render() {
    const browser = getBrowser();
    const isMobile = getPlatform();

    return (
      <div class="modal-container">
        <div class="modal-body">
          <div class="modal-header">
            <div class="close-modal">
              <img class="close-icon" src={CloseIcon} onClick={() => this.handleCloseModal()} />
            </div>
            {isMobile || browser ? (
              <span class="modal-title">Get wallet to use {this.authOptions.appDetails.name}</span>
            ) : (
              <span class="modal-title">Your browser isn't supported</span>
            )}
          </div>
          <div class="modal-subtitle">
            To sign in to {this.authOptions.appDetails.name}, you will need a Stacks-compatible
            wallet.
          </div>
          <div class="modal-content">
            <div class="wallet-container">
              <div class="modal-wallet-card">
                <img src={HiroWalletLogo} />
                <div class="modal-wallet-card-content">
                  <span class="modal-subheading">Hiro Wallet</span>
                  {browser && !isMobile ? (
                    <div class="modal-wallet-text">
                      Hiro Wallet is your gateway to Stacks apps like{' '}
                      {this.authOptions.appDetails.name}. Add it to {browser} to continue{' '}
                    </div>
                  ) : (
                    <div class="modal-wallet-text">
                      Browser extension for {` `}
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
                  )}
                  <span
                    class="link"
                    onClick={() => window.open('https://www.hiro.so/wallet', '_blank')}
                  >
                    About Hiro Wallet →
                  </span>
                  {browser && !isMobile && (
                    <div class="download-app-container">
                      {this.hasOpenedInstall ? (
                        <div class="modal-wallet-text">
                          After installing Hiro Wallet, reload this page and sign in.
                        </div>
                      ) : (
                        <button
                          class="button"
                          onClick={() => {
                            this.handleDownloadPath(browser);
                          }}
                        >
                          Download
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div class="modal-wallet-card">
                <img src={XverseWalletLogo} />
                <div class="modal-wallet-card-content">
                  <span class="modal-subheading">Xverse Wallet</span>
                  {browser === 'Chrome' ? (
                    <div class="modal-wallet-text">
                      Xverse is an advanced web3 wallet for Bitcoin and Stacks. Available for
                      Chrome, Android and iOS. Add it to Chrome to continue.
                    </div>
                  ) : isMobile ? (
                    <div class="modal-wallet-text">
                      Xverse is your gateway to Stacks apps like {this.authOptions.appDetails.name}.
                      Install it on your device to continue.`
                    </div>
                  ) : (
                    <div class="modal-wallet-text">
                      Browser extension for {` `}
                      <a href={CHROME_BROWSER_URL} target="_blank">
                        Chrome
                      </a>
                      {` on desktop, application for iOS and Android on mobile.`}
                    </div>
                  )}
                  <span
                    class="link"
                    onClick={() => window.open('https://www.xverse.app/', '_blank')}
                  >
                    About Xverse Wallet →
                  </span>
                  <div class="download-app-container">
                    {this.hasOpenedInstallXverse ? (
                      isMobile ? (
                        <span
                          class="link"
                          onClick={() =>
                            window.open(`stacks://browser?url=${window.location.href}`, '_blank')
                          }
                        >
                          Open this page in Xverse Wallet →
                        </span>
                      ) : (
                        <div class="modal-wallet-text">
                          After installing Xverse Wallet, reload this page and sign in.
                        </div>
                      )
                    ) : (
                      (browser === 'Chrome' || isMobile) && (
                        <button
                          class="button"
                          onClick={() => {
                            this.handleDownloadPath(isMobile ?? `Xverse-${browser}`);
                          }}
                        >
                          Download
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
