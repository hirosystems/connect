import { Component, Element, Prop, h } from '@stencil/core';
import { WebBTCProvider } from '../../providers';
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
  @Prop() defaultProviders: WebBTCProvider[];
  @Prop() installedProviders: WebBTCProvider[];

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
  // getComment(provider: WebBTCProvider, browser: string, isMobile?: string) {
  //   if (!provider) return null;

  //   const hasExtension = this.getBrowserUrl(provider);
  //   const hasMobile = this.getMobileUrl(provider);

  //   if (isMobile && hasExtension && !hasMobile) return 'Extension Only';
  //   if (!isMobile && !hasExtension && hasMobile) return 'Mobile Only';

  //   if (!isMobile && !browser) return 'Current browser not supported';

  //   return null;
  // }

  getBrowserUrl(provider: WebBTCProvider) {
    return provider.chromeWebStoreUrl ?? provider.mozillaAddOnsUrl;
  }

  getMobileUrl(provider: WebBTCProvider) {
    return provider.iOSAppStoreUrl ?? provider.googlePlayStoreUrl;
  }

  getInstallUrl(provider: WebBTCProvider, browser: string) {
    if (browser === 'Chrome') {
      return provider.chromeWebStoreUrl ?? this.getMobileUrl(provider) ?? provider.webUrl;
    } else if (browser === 'Firefox') {
      return provider.mozillaAddOnsUrl ?? this.getMobileUrl(provider) ?? provider.webUrl;
    } else if (browser === 'IOS') {
      return provider.iOSAppStoreUrl ?? this.getBrowserUrl(provider) ?? provider.webUrl;
    } else if (browser === 'Android') {
      return provider.googlePlayStoreUrl ?? this.getBrowserUrl(provider) ?? provider.webUrl;
    } else {
      return this.getBrowserUrl(provider) ?? provider.webUrl ?? this.getMobileUrl(provider);
    }
  }

  render() {
    const browser = getBrowser();
    const mobile = getPlatform();

    const notInstalledProviders = this.defaultProviders.filter(
      p => this.installedProviders.findIndex(i => i.id === p.id) === -1 // keep providers NOT already in installed list
    );

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
            {this.installedProviders.length === 0 ? (
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
          {this.installedProviders.length > 0 && (
            <div class="space-y-2">
              <p class="text-xs font-semibold text-gray-400">INSTALLED</p>
              {this.installedProviders.map((provider: WebBTCProvider) => (
                <div class="flex gap-3 items-center">
                  <div class="basis-12 aspect-square overflow-hidden">
                    <img src={provider.icon} class="w-full h-full bg-gray-700 rounded-[10px]" />
                  </div>
                  <div class="flex-1">
                    <div class="text-xl font-bold">{provider.name}</div>
                    {provider.webUrl && (
                      <a
                        href={provider.webUrl}
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

          {/* NOT INSTALLED DEFAULT SECTION */}
          {notInstalledProviders.length > 0 && (
            <div class="space-y-2">
              <p class="text-xs font-semibold text-gray-400">POPULAR</p>
              {notInstalledProviders.map((provider: WebBTCProvider) => (
                <div class="flex gap-3 items-center">
                  <div class="basis-12 aspect-square overflow-hidden">
                    <img src={provider.icon} class="w-full h-full bg-gray-700 rounded-[10px]" />
                  </div>
                  <div class="flex-1">
                    <div class="text-xl font-bold">{provider.name}</div>
                    {provider.webUrl && (
                      <a
                        href={provider.webUrl}
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
  }
}
