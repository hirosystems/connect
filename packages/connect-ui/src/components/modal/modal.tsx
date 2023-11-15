import { Component, Element, Prop, h } from '@stencil/core';
import { StxProvider } from '../../providers';
import { setSelectedProvider } from '../../session';
import CloseIcon from './assets/close-icon.svg';
import { getBrowser, getPlatform } from './utils';

@Component({
  tag: 'connect-modal',
  styleUrl: 'modal.scss',
  assetsDirs: ['assets'],
  shadow: true,
})
export class Modal {
  @Prop() defaultProviders: StxProvider[];
  @Prop() registeredProviders: StxProvider[];

  @Prop() callback: Function;

  @Element() modalEl: HTMLConnectModalElement;

  handleSelectProvider(providerId: string) {
    setSelectedProvider(providerId);
    this.modalEl.remove();
    this.callback();
  }

  handleCloseModal() {
    this.modalEl.remove();
    // todo: throw Error that website can catch and handle (e.g. ConnectCancelError)
  }

  // todo: nice to have:
  // getComment(provider: StxProvider, browser: string, isMobile?: string) {
  //   if (!provider.urls) return null;

  //   const hasExtension = this.getBrowserUrl(provider);
  //   const hasMobile = this.getMobileUrl(provider);

  //   if (isMobile && hasExtension && !hasMobile) return 'Extension Only';
  //   if (!isMobile && !hasExtension && hasMobile) return 'Mobile Only';

  //   if (!isMobile && !browser) return 'Current browser not supported';

  //   return null;
  // }

  getBrowserUrl(provider: StxProvider) {
    return provider.urls?.chromeWebStore ?? provider.urls?.mozillaWebStore;
  }

  getMobileUrl(provider: StxProvider) {
    return provider.urls?.iOSAppStore ?? provider.urls?.androidAppStore;
  }

  getInstallUrl(provider: StxProvider, browser: string) {
    if (browser === 'Chrome') {
      return provider.urls?.chromeWebStore ?? this.getMobileUrl(provider) ?? provider.urls?.about;
    } else if (browser === 'Firefox') {
      return provider.urls?.mozillaWebStore ?? this.getMobileUrl(provider) ?? provider.urls?.about;
    } else if (browser === 'IOS') {
      return provider.urls?.iOSAppStore ?? this.getBrowserUrl(provider) ?? provider.urls?.about;
    } else if (browser === 'Android') {
      return provider.urls?.androidAppStore ?? this.getBrowserUrl(provider) ?? provider.urls?.about;
    } else {
      return this.getBrowserUrl(provider) ?? provider.urls?.about ?? this.getMobileUrl(provider);
    }
  }

  render() {
    const browser = getBrowser();
    const mobile = getPlatform();

    return (
      <div class="modal-container">
        <div class="modal-body leading-snug space-y-5 cursor-default">
          {/* INTRO */}
          <div class="modal-header space-y-2">
            <div class="close-modal flex items-center">
              <div class="font-semibold text-lg flex-1">Select wallet</div>
              <button
                class="p-1 bg-transparent rounded-full hover:bg-gray-100 active:scale-95"
                onClick={() => this.handleCloseModal()}
              >
                <span class="sr-only">Close popup</span>
                <img src={CloseIcon} />
              </button>
            </div>
            {this.registeredProviders.length === 0 ? (
              <div class="space-y-3">
                <p>No installed wallets detected. You can install one from the list below.</p>
                <div class="text-center">
                  <a
                    class="rounded-xl text-sm font-semibold bg-gray-200 text-gray-500 px-3 py-1.5 hover:bg-gray-300"
                    // href="" todo: link to docs
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    🔐 What's a wallet?
                  </a>
                </div>
              </div>
            ) : (
              <div>Choose the wallet you want to continue with or install a new one.</div>
            )}
            {!mobile && !browser && (
              <p class="text-yellow-500 py-4">⚠️ Unfortunately, your browser isn't supported</p>
            )}
          </div>

          {/* INSTALLED SECTION */}
          {this.registeredProviders.length > 0 && (
            <div class="space-y-2">
              <p class="text-xs font-semibold text-gray-400">INSTALLED</p>
              {this.registeredProviders.map((provider: StxProvider) => (
                <div class="flex gap-3 items-center">
                  <div class="basis-12 aspect-square">
                    <img src={provider.icon} alt={`${provider.name} Icon`} class="w-full h-full" />
                  </div>
                  <div class="flex-1">
                    <div class="text-xl font-bold">{provider.name}</div>
                    {provider.urls?.about && (
                      <a
                        href={provider.urls.about}
                        class="text-gray-400 text-sm"
                        rel="noopener noreferrer"
                      >
                        About →
                      </a>
                    )}
                  </div>
                  <button
                    class="text-sm px-5 py-1.5 min-w-[72px] text-white bg-green-500 rounded-full hover:bg-green-400 active:scale-95"
                    onClick={() => this.handleSelectProvider(provider.id)}
                  >
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
                <div class="flex gap-3 items-center">
                  <div class="basis-12 aspect-square">
                    <img src={provider.icon} alt={`${provider.name} Icon`} class="w-full h-full" />
                  </div>
                  <div class="flex-1">
                    <div class="text-xl font-bold">{provider.name}</div>
                    {provider.urls?.about && (
                      <a
                        href={provider.urls.about}
                        class="text-gray-400 text-sm"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        About →
                      </a>
                    )}
                  </div>
                  {this.getInstallUrl(provider, browser) && (
                    <a
                      class="relative text-sm px-5 py-1.5 min-w-[72px] text-white bg-blue-500 rounded-full hover:bg-blue-400 active:scale-95 cursor-pointer"
                      href={this.getInstallUrl(provider, browser)}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      INSTALL
                    </a>
                  )}
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
