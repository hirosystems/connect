import { Component, h, Prop, State, Element } from '@stencil/core';
import CloseIcon from './assets/close-icon.svg';
import KeyAndKeyhole from './assets/key-and-keyhole.svg';
import StacksIcon from './assets/stacks-icon.svg';
import type { AuthOptions } from '@stacks/connect/types/auth';
import { getBrowser } from './extension-util';

const CHROME_STORE_URL =
  'https://chrome.google.com/webstore/detail/stacks-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj';
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
              <span>Stacks Wallet</span>
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
            <span class="modal-title">{`Add Stacks Wallet to ${browser}`}</span>
            <div class="modal-subtitle">
              Stacks Wallet is your gateway to Stacks apps like {this.authOptions.appDetails.name}.
              Add it to {browser} to continue.
            </div>
            {this.hasOpenedInstall ? (
              <div class="modal-subtitle">
                After installing Stacks Wallet, reload this page and sign in.
              </div>
            ) : (
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
            )}
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
