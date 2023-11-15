import { Component, Element, Prop, State, h } from '@stencil/core';
import { StxProvider } from '../../providers';
import CloseIcon from './assets/close-icon.svg';
import { setSelectedProvider } from '../../session';

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
  @Prop() defaultProviders: StxProvider[];
  @Prop() registeredProviders: StxProvider[];
  @Prop() selectedProvider: StxProvider | undefined;

  @Prop() callback: Function;

  @State() hasOpenedInstall: boolean;

  @State() hasOpenedInstallXverse: boolean;

  @Element() modalEl: HTMLConnectModalElement;

  handleSelectProvider(providerId: string) {
    setSelectedProvider(providerId);
    this.callback();
  }

  handleCloseModal() {
    this.modalEl.remove();
    // todo: throw Error that website can catch and handle (e.g. ConnectCancelError)
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
    // const browser = getBrowser();
    // const isMobile = getPlatform();

    // IF INCOMPATIBLE BROWSER
    // todo:

    return (
      <div class="modal-container">
        <div class="modal-body leading-snug space-y-5">
          {/* INTRO */}
          <div class="modal-header space-y-2">
            <div class="close-modal flex items-center">
              <p class="font-bold text-lg flex-1">Select wallet</p>
              <img class="close-icon" src={CloseIcon} onClick={() => this.handleCloseModal()} />
            </div>
            {this.registeredProviders.length === 0 ? (
              <div class="space-y-3">
                <p>No installed wallets detected. You can install one from the list below.</p>
                <div class="text-center">
                  <a
                    class="rounded-xl text-sm font-semibold bg-gray-200 text-gray-500 px-3 py-1.5 hover:bg-gray-300"
                    href=""
                  >
                    What's a wallet?
                  </a>
                </div>
              </div>
            ) : (
              <div>Choose the wallet you want to continue with or install a new one.</div>
            )}
          </div>

          {/* INSTALLED SECTION */}
          {this.registeredProviders.length > 0 && (
            <div class="space-y-2">
              <p class="text-xs font-semibold text-gray-400">INSTALLED</p>
              {this.registeredProviders.map((provider: StxProvider) => (
                <div class="flex gap-2 items-center">
                  <div class="basis-12 aspect-square">
                    <img src={provider.icon} alt={`${provider.name} Icon`} class="w-full h-full" />
                  </div>
                  <div class="flex-1 text-xl font-bold">{provider.name}</div>
                  <button class="text-sm px-5 py-1.5 min-w-[72px] text-white bg-green-500 rounded-full hover:bg-green-400">
                    SELECT
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* DEFAULT SECTION */}
          {this.defaultProviders.length > 0 && (
            <div class="space-y-2">
              <p class="text-xs font-semibold text-gray-400">POPULAR</p>
              {this.defaultProviders.map((provider: StxProvider) => (
                <div class="flex gap-4 items-center">
                  <div class="basis-12 aspect-square">
                    <img src={provider.icon} alt={`${provider.name} Icon`} class="w-full h-full" />
                  </div>
                  <div class="flex-1 text-xl font-bold">{provider.name}</div>
                  <a
                    class="text-sm px-5 py-1.5 min-w-[72px] text-white bg-blue-500 rounded-full hover:bg-blue-400"
                    href={provider.urls.website}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    INSTALL
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );

    // return (
    //   <div class="modal-container">
    //     <div class="modal-body">
    //       <div class="modal-header">
    //         <div class="close-modal">
    //           <img class="close-icon" src={CloseIcon} onClick={() => this.handleCloseModal()} />
    //         </div>
    //         {isMobile || browser ? (
    //           <span class="modal-title">Get wallet to use {this.authOptions.appDetails.name}</span>
    //         ) : (
    //           <span class="modal-title">Your browser isn't supported</span>
    //         )}
    //       </div>
    //       <div class="modal-subtitle">
    //         To sign in to {this.authOptions.appDetails.name}, you will need a Stacks-compatible
    //         wallet.
    //       </div>
    //       <div class="modal-content">
    //         <div class="wallet-container">
    //           <div class="modal-wallet-card">
    //             <img src={LeatherLogo} />
    //             <div class="modal-wallet-card-content">
    //               <span class="modal-subheading">Leather</span>
    //               {browser && !isMobile ? (
    //                 <div class="modal-wallet-text">
    //                   Leather is the only Bitcoin wallet you need to tap into the emerging Bitcoin
    //                   economy.
    //                 </div>
    //               ) : (
    //                 <div class="modal-wallet-text">
    //                   Browser extension for {` `}
    //                   <a href={CHROME_BROWSER_URL} target="_blank">
    //                     Chrome
    //                   </a>
    //                   {`, `}
    //                   <a href={BRAVE_BROWSER_URL} target="_blank">
    //                     Brave
    //                   </a>
    //                   {`, or `}
    //                   <a href={FIREFOX_BROWSER_URL} target="_blank">
    //                     Firefox
    //                   </a>
    //                   {` on desktop.`}
    //                 </div>
    //               )}
    //               <span class="link" onClick={() => window.open('https://leather.io/', '_blank')}>
    //                 About Leather →
    //               </span>
    //               {browser && !isMobile && (
    //                 <div class="download-app-container">
    //                   {this.hasOpenedInstall ? (
    //                     <div class="modal-wallet-text">
    //                       After installing Leather, reload this page and sign in.
    //                     </div>
    //                   ) : (
    //                     <button
    //                       class="button"
    //                       onClick={() => {
    //                         this.handleDownloadPath(browser);
    //                       }}
    //                     >
    //                       Download
    //                     </button>
    //                   )}
    //                 </div>
    //               )}
    //             </div>
    //           </div>

    //           <div class="modal-wallet-card">
    //             <img src={XverseWalletLogo} />
    //             <div class="modal-wallet-card-content">
    //               <span class="modal-subheading">Xverse Wallet</span>
    //               {browser === 'Chrome' ? (
    //                 <div class="modal-wallet-text">
    //                   Xverse is an advanced web3 wallet for Bitcoin and Stacks. Available for
    //                   Chrome, Android and iOS. Add it to Chrome to continue.
    //                 </div>
    //               ) : isMobile ? (
    //                 <div class="modal-wallet-text">
    //                   Xverse is your gateway to Stacks apps like {this.authOptions.appDetails.name}.
    //                   Install it on your device to continue.`
    //                 </div>
    //               ) : (
    //                 <div class="modal-wallet-text">
    //                   Browser extension for {` `}
    //                   <a href={CHROME_BROWSER_URL} target="_blank">
    //                     Chrome
    //                   </a>
    //                   {` on desktop, application for iOS and Android on mobile.`}
    //                 </div>
    //               )}
    //               <span
    //                 class="link"
    //                 onClick={() => window.open('https://www.xverse.app/', '_blank')}
    //               >
    //                 About Xverse Wallet →
    //               </span>
    //               <div class="download-app-container">
    //                 {this.hasOpenedInstallXverse ? (
    //                   isMobile ? (
    //                     <span
    //                       class="link"
    //                       onClick={() =>
    //                         window.open(`stacks://browser?url=${window.location.href}`, '_blank')
    //                       }
    //                     >
    //                       Open this page in Xverse Wallet →
    //                     </span>
    //                   ) : (
    //                     <div class="modal-wallet-text">
    //                       After installing Xverse Wallet, reload this page and sign in.
    //                     </div>
    //                   )
    //                 ) : (
    //                   (browser === 'Chrome' || isMobile) && (
    //                     <button
    //                       class="button"
    //                       onClick={() => {
    //                         this.handleDownloadPath(isMobile ?? `Xverse-${browser}`);
    //                       }}
    //                     >
    //                       Download
    //                     </button>
    //                   )
    //                 )}
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // );
  }
}
