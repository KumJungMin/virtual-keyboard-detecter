import { debounce } from './debounce.js';

/**
 * 프레임워크에 독립적인 가상 키보드 감지 클래스.
 * 'keyboardOpen', 'keyboardClose', 그리고 애니메이션 종료 후 발생하는
 * 'keyboardStableClose' 커스텀 이벤트를 발생시킵니다.
 */
class KeyboardDetector {
  #listeners: { [key: string]: Function[] } = {};
  #isOpen = false;
  #stableViewportHeight = 0;
  #threshold;
  #debouncedResizeHandler;

  #rAF_id: number | null = null;
  
  constructor(options: { threshold?: number; debounceMs?: number } = {}) {
    this.#threshold = options.threshold ?? 100;
    const debounceMs = options.debounceMs ?? 150;
    this.#debouncedResizeHandler = debounce(() => this.#handleResize(), debounceMs);
  }

  /**
   * 이벤트 리스너를 등록합니다.
   * @param {'keyboardOpen' | 'keyboardClose' | 'keyboardStableClose'} eventName
   * @param {function} listener
   */
  on(eventName: string | number, listener: any) {
    if (!this.#listeners[eventName]) { this.#listeners[eventName] = []; }
    this.#listeners[eventName].push(listener);
  }

  init() {
    this.#stableViewportHeight = this.#getCurrentViewportHeight();
    const target = window.visualViewport ?? window;
    target.addEventListener('resize', this.#debouncedResizeHandler);
  }

  destroy() {
    this.#debouncedResizeHandler.cancel();
    const target = window.visualViewport ?? window;
    target.removeEventListener('resize', this.#debouncedResizeHandler);

    if (this.#rAF_id) {
      cancelAnimationFrame(this.#rAF_id);
    }

    this.#listeners = {};
  }

  #handleResize() {
    const currentHeight = this.#getCurrentViewportHeight();
    const isKeyboardNowOpen = this.#stableViewportHeight - currentHeight > this.#threshold;

    if (!isKeyboardNowOpen) {
      this.#stableViewportHeight = currentHeight;
    }

    if (this.#isOpen !== isKeyboardNowOpen) {
      const oldIsOpen = this.#isOpen;
      this.#isOpen = isKeyboardNowOpen;

      if (isKeyboardNowOpen) {
        this.#emit('keyboardOpen');
      } else if (oldIsOpen) {
        this.#emit('keyboardClose');
        this.#runWhenViewportStable(() => {
          this.#emit('keyboardStableClose');
        });
      }
    }
  }
  
  /**
   * visualViewport의 높이가 안정될 때까지 기다린 후 콜백을 실행합니다.
   * @private
   * @param {function} callback - 뷰포트가 안정된 후 실행할 함수
   */
  #runWhenViewportStable(callback: () => void) {
    const STABILITY_THRESHOLD = 6; // 6 프레임 동안 높이가 동일해야 안정적이라고 판단합니다.
    let lastHeight = this.#getCurrentViewportHeight();
    let stableFrameCount = 0;

    const checkStability = () => {
      const currentHeight = this.#getCurrentViewportHeight();
      if (currentHeight === lastHeight) {
        stableFrameCount++;
      } else {
        lastHeight = currentHeight;
        stableFrameCount = 0;
      }

      if (stableFrameCount >= STABILITY_THRESHOLD) {
        callback();
        this.#rAF_id = null;
      } else {
        this.#rAF_id = requestAnimationFrame(checkStability);
      }
    };
    if (this.#rAF_id) {
      cancelAnimationFrame(this.#rAF_id);
    }
    
    this.#rAF_id = requestAnimationFrame(checkStability);
  }

  isOpen() {
    return this.#isOpen;
  }

  #emit(eventName: string | number) {
    const listeners = this.#listeners[eventName];
    if (listeners) {
      listeners.forEach(l => l());
    }
  }

  #getCurrentViewportHeight() { 
    return window.visualViewport ? window.visualViewport.height : window.innerHeight; 
  }
}

export const keyboardDetector = (options: { threshold?: number; debounceMs?: number; } | undefined) => new KeyboardDetector(options);