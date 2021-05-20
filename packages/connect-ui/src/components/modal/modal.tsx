import { Component, h, Prop, State, Element } from '@stencil/core';
import { CloseIcon } from './assets/close-icon';
import type { AuthOptions } from '@stacks/connect/types/auth';
import { getBrowser } from './extension-util';
import { StacksIcon } from './assets/stacks-icon';

const CHROME_STORE_URL =
  'https://chrome.google.com/webstore/detail/stacks-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj';

@Component({
  tag: 'connect-modal',
  styleUrl: 'modal.scss',
  assetsDirs: ['screens', 'assets'],
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

  render() {
    const browser = getBrowser();

    return (
      <div class="modal-container">
        <div class="modal-body">
          <div class="modal-top">
            <CloseIcon onClick={() => this.handleCloseModal()} />
          </div>
          <div class="modal-content">
            <div>
              <div class="hero-icon">
                <StacksIcon />
              </div>
              <span class="modal-header pxl">
                Use {this.authOptions.appDetails.name} with Stacks
              </span>
              <div class="intro-subtitle pxl">
                Stacks Wallet gives you control over your digital assets and data in apps like{' '}
                {this.authOptions.appDetails.name}.
                {browser ? ` Add it to ${browser} to continue.` : ''}
              </div>
              {this.hasOpenedInstall ? (
                <div class="intro-subtitle pxl">
                  After installing Stacks Wallet, reload this page and sign in.
                </div>
              ) : (
                <div class="button-container">
                  <button
                    class="button"
                    onClick={() => {
                      if (browser === 'Chrome') {
                        window.open(CHROME_STORE_URL, '_blank');
                      } else {
                        window.open('https://www.hiro.so/wallet/install-web', '_blank');
                      }
                      this.hasOpenedInstall = true;
                    }}
                  >
                    <span>Install Stacks Wallet</span>
                  </button>
                </div>
              )}
              <div class="modal-footer">
                <span
                  class="link"
                  onClick={() =>
                    window.open('https://www.hiro.so/questions/how-does-stacks-work', '_blank')
                  }
                >
                  How it works
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
