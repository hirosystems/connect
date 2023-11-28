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

    const hasInstalled = this.installedProviders.length > 0;
    const hasMore = notInstalledProviders.length > 0;

    return (
      <div class="modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end overflow-y-scroll bg-[#00000040] md:items-center md:justify-center">
        <div class="modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl">
          {/* INTRO */}
          <div class="flex flex-col space-y-[10px]">
            <div class="flex items-center">
              <div class="flex-1 text-xl font-medium text-[#242629]">Connect a wallet</div>
              <button
                class="rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95"
                onClick={() => this.handleCloseModal()}
              >
                <span class="sr-only">Close popup</span>
                <img src={CloseIcon} />
              </button>
            </div>
            {hasInstalled ? (
              <p>Select the wallet you want to connect to.</p>
            ) : (
              <p>
                You don't have any wallets in your browser that support this app. You need to
                install a wallet to proceed.
              </p>
            )}
          </div>

          {!mobile && !browser && (
            <div class="mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-300">
              Unfortunately, your browser isn't supported
            </div>
          )}

          {/* INSTALLED SECTION */}
          {hasInstalled && (
            <div class="mt-6">
              <p class="mb-4 text-sm font-medium">Installed wallets</p>
              <ul class="space-y-3">
                {this.installedProviders.map((provider: WebBTCProvider) => (
                  <li class="flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]">
                    <div class="aspect-square basis-9 overflow-hidden">
                      <img src={provider.icon} class="h-full w-full rounded-[10px] bg-gray-700" />
                    </div>
                    <div class="flex-1">
                      <div class="text-sm font-medium text-[#242629]">{provider.name}</div>
                      {provider.webUrl && (
                        <a href={provider.webUrl} class="text-sm" rel="noopener noreferrer">
                          {new URL(provider.webUrl).hostname}
                        </a>
                      )}
                    </div>
                    <button
                      class="rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95"
                      onClick={() => this.handleSelectProvider(provider.id)}
                    >
                      Connect
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* RECOMMENDED SECTION */}
          {hasMore && (
            <div class="mt-6">
              {hasInstalled ? (
                <p class="mb-4 text-sm font-medium">Other wallets</p>
              ) : (
                <div class="mb-5 flex justify-between">
                  <p class="text-sm font-medium">Recommended wallets</p>
                  <a
                    class="flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline"
                    href="https://docs.hiro.so/what-is-a-wallet"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {/* QUESTION MARK ICON */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        stroke="#74777D"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.2"
                        d="M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"
                      />
                      <path
                        stroke="#74777D"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.2"
                        d="M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01"
                      />
                    </svg>
                    <p>
                      What is a wallet?&thinsp;<span class="align-text-bottom text-[9px]">↗</span>
                    </p>
                  </a>
                </div>
              )}
              <ul class="space-y-3">
                {notInstalledProviders.map((provider: WebBTCProvider) => (
                  <li class="flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]">
                    <div class="aspect-square basis-9 overflow-hidden">
                      <img src={provider.icon} class="h-full w-full rounded-[10px] bg-gray-700" />
                    </div>
                    <div class="flex-1">
                      <div class="text-sm font-medium text-[#242629]">{provider.name}</div>
                      {provider.webUrl && (
                        <a href={provider.webUrl} class="text-sm" rel="noopener noreferrer">
                          {new URL(provider.webUrl).hostname}
                        </a>
                      )}
                    </div>
                    {this.getInstallUrl(provider, browser) && (
                      <a
                        class="rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95"
                        href={this.getInstallUrl(provider, browser)}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Install &rarr;
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }
}
