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
    } else if (browser === 'IOS') {
      window.open(XVERSE_APP_STORE_URL, '_blank');
    } else if (browser === 'Android') {
      window.open(XVERSE_PLAY_STORE_URL, '_blank');
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
            {isMobile ? (
              <span class="modal-title">Add a Wallet to your mobile</span>
            ) : browser ? (
              <span class="modal-title desktop">Add a Wallet to {browser}</span>
            ) : (
              <span class="modal-title desktop">Your browser isn't supported</span>
            )}
            <div class="modal-subtitle">
              To sign in to {this.authOptions.appDetails.name}, you will need a Stacks compatible
              wallet.
            </div>
          </div>

          <div class="modal-content">
            {(browser || isMobile) && <span class="choose-a-wallet">Choose a wallet</span>}
            <div class={isMobile ? 'mobile-wallet-container' : 'wallet-container'}>
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
                      Browser Extension for {` `}
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
                  {browser  ? 
                       <div class="modal-wallet-text">
                      Xverse is your gateway to Stacks on mobile.  </div>: isMobile?
                    <div class="modal-wallet-text">
                     Xverse is your gateway to Stacks apps like {this.authOptions.appDetails.name}. Download it on your device to continue.
                    </div>
                   : 
                    <div class="modal-wallet-text">Mobile Application for iOS and Android.</div>
                  }
                  <span
                    class="link"
                    onClick={() => window.open('https://www.xverse.app/', '_blank')}
                  >
                    About Xverse Wallet →
                  </span>
                  {isMobile && (
                    <div class="download-app-container">
                      {this.hasOpenedInstall ? (
                        <span
                          class="link"
                          onClick={() =>
                            window.open(
                              `stacks://browser?url=${window.location.href}`,
                              '_blank'
                            )
                          }
                        >
                          Open this page in Xverse Wallet →
                        </span>
                      ) : (
                        <button
                          class="button"
                          onClick={() => {
                            this.handleDownloadPath(isMobile);
                          }}
                        >
                          Download
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
