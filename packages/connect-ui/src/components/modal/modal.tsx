import { Component, h, Prop, State, Element } from '@stencil/core';
import CloseIcon from './assets/close-icon.svg';
import KeyAndKeyhole from './assets/key-and-keyhole.svg';
import StacksIcon from './assets/stacks-icon.svg';
import type { AuthOptions } from '@stacks/connect/types/auth';
import { getBrowser } from './utils';

const CHROME_BROWSER_URL = 'https://www.google.com/chrome/';
const BRAVE_BROWSER_URL = 'https://brave.com/';
const FIREFOX_BROWSER_URL = 'https://www.mozilla.org/en-US/';
const CHROME_STORE_URL =
  'https://chrome.google.com/webstore/detail/stacks-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj/';
const FIREFOX_STORE_URL = 'https://addons.mozilla.org/en-US/firefox/addon/stacks-wallet/';

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
              <img src={StacksIcon} />
            </div>
            <img class="header-right" src={CloseIcon} onClick={() => this.handleCloseModal()} />
          </div>
          <div class="modal-content">
            <div class="modal-illustration">
              <img src={KeyAndKeyhole} />
              <div class="app-logo">
                <img src={this.authOptions.appDetails.icon} />
              </div>
            </div>
            {browser ? (
              <span class="modal-title supported">Add Stacks Wallet to {browser}</span>
            ) : (
              <span class="modal-title unsupported">Your browser isn't supported</span>
            )}
            <div class="modal-subtitle">
              {browser ? (
                <div>
                  Stacks Wallet is your gateway to Stacks apps like{' '}
                  {this.authOptions.appDetails.name}. Add it to {browser} to continue.
                </div>
              ) : (
                <div>
                  To sign in to {this.authOptions.appDetails.name} using the Stacks Wallet browser
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
              )}
            </div>
            {this.hasOpenedInstall ? (
              <div class="modal-subtitle">
                After installing Stacks Wallet, reload this page and sign in.
              </div>
            ) : browser ? (
              <div class="button-container">
                <button
                  class="button"
                  onClick={() => {
                    this.handleDownloadPath(browser);
                  }}
                >
                  Download Stacks Wallet
                </button>
              </div>
            ) : null}
            <div class="modal-footer">
              <span
                class="link"
                onClick={() => window.open('https://www.hiro.so/wallet', '_blank')}
              >
                About Stacks Wallet →
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
