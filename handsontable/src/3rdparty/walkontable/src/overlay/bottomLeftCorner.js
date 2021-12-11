import {
  getScrollbarWidth,
  outerHeight,
  outerWidth,
  resetCssTransform
} from '../../../../helpers/dom/element';
import BottomLeftCornerOverlayTable from './../table/bottomLeftCorner';
import { Overlay } from './_base';
import {
  CLONE_BOTTOM_LEFT_CORNER,
} from './constants';

/**
 * @class TopLeftCornerOverlay
 */
export class BottomLeftCornerOverlay extends Overlay {
  /**
   * @param {Walkontable} wotInstance The Walkontable instance. @TODO refactoring: check if can be deleted.
   * @param {FacadeGetter} facadeGetter Function which return proper facade.
   * @param {Settings} wtSettings The Walkontable settings.
   * @param {DomBindings} domBindings Dom elements bound to the current instance.
   */
  constructor(wotInstance, facadeGetter, wtSettings, domBindings) {
    super(wotInstance, facadeGetter, CLONE_BOTTOM_LEFT_CORNER, wtSettings, domBindings);
  }

  /**
   * Factory method to create a subclass of `Table` that is relevant to this overlay.
   *
   * @see Table#constructor
   * @param {...*} args Parameters that will be forwarded to the `Table` constructor.
   * @returns {BottomLeftCornerOverlayTable}
   */
  createTable(...args) {
    return new BottomLeftCornerOverlayTable(...args);
  }

  /**
   * Checks if overlay should be fully rendered.
   *
   * @returns {boolean}
   */
  shouldBeRendered() {
    return this.wtSettings.getSetting('shouldRenderBottomOverlay')
      && this.wtSettings.getSetting('shouldRenderLeftOverlay');
  }

  /**
   * Updates the corner overlay position.
   *
   * @returns {boolean}
   */
  resetFixedPosition() {
    const { wot } = this;

    this.updateTrimmingContainer();

    if (!wot.wtTable.holder.parentNode) {
      // removed from DOM
      return false;
    }

    const overlayRoot = this.clone.wtTable.holder.parentNode;

    overlayRoot.style.top = '';

    if (this.trimmingContainer === this.domBindings.rootWindow) {
      const { wtTable } = this.wot;
      const { rootDocument } = this.domBindings;
      const hiderRect = wtTable.hider.getBoundingClientRect();
      const bottom = Math.ceil(hiderRect.bottom);
      const left = Math.ceil(hiderRect.left);
      const bodyHeight = rootDocument.documentElement.clientHeight;
      let finalLeft;
      let finalBottom;

      if (left < 0) {
        finalLeft = -left;
      } else {
        finalLeft = 0;
      }

      if (bottom > bodyHeight) {
        finalBottom = (bottom - bodyHeight);
      } else {
        finalBottom = 0;
      }

      finalBottom += 'px';
      finalLeft += 'px';

      overlayRoot.style.left = finalLeft;
      overlayRoot.style.bottom = finalBottom;

    } else {
      resetCssTransform(overlayRoot);
      this.repositionOverlay();
    }

    let tableHeight = outerHeight(this.clone.wtTable.TABLE);
    const tableWidth = outerWidth(this.clone.wtTable.TABLE);

    if (!this.wot.wtTable.hasDefinedSize()) {
      tableHeight = 0;
    }

    overlayRoot.style.height = `${tableHeight}px`;
    overlayRoot.style.width = `${tableWidth}px`;

    return false;
  }

  /**
   * Reposition the overlay.
   */
  repositionOverlay() {
    const { wtTable } = this.wot;
    const { rootDocument } = this.domBindings;
    const cloneRoot = this.clone.wtTable.holder.parentNode;
    let scrollbarWidth = getScrollbarWidth(rootDocument);

    if (wtTable.holder.clientHeight === wtTable.holder.offsetHeight) {
      scrollbarWidth = 0;
    }

    cloneRoot.style.bottom = `${scrollbarWidth}px`;
  }
}
