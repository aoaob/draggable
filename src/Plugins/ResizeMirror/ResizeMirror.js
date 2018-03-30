import AbstractPlugin from 'shared/AbstractPlugin';

const onDragOver = Symbol('onDragOver');

/**
 * ResizeMirror default options
 * @property {Object} defaultOptions
 * @type {Object}
 */
export const defaultOptions = {};

/**
 * The ResizeMirror plugin resizes the mirror element to the dimensions of the draggable element that the mirror is hovering over
 * @class ResizeMirror
 * @module ResizeMirror
 * @extends AbstractPlugin
 */
export default class ResizeMirror extends AbstractPlugin {
  /**
   * ResizeMirror constructor.
   * @constructs ResizeMirror
   * @param {Draggable} draggable - Draggable instance
   */
  constructor(draggable) {
    super(draggable);

    /**
     * ResizeMirror options
     * @property {Object} options
     * @type {Object}
     */
    this.options = {
      ...defaultOptions,
      ...this.getOptions(),
    };

    this[onDragOver] = this[onDragOver].bind(this);
  }

  /**
   * Attaches plugins event listeners
   */
  attach() {
    this.draggable.on('drag:over', this[onDragOver]);
    this.draggable.on('drag:over:container', this[onDragOver]);
  }

  /**
   * Detaches plugins event listeners
   */
  detach() {
    this.draggable.off('drag:over', this[onDragOver]);
    this.draggable.off('drag:over:container', this[onDragOver]);
  }

  /**
   * Returns options passed through draggable
   * @return {Object}
   */
  getOptions() {
    return this.draggable.options.resizeMirror || {};
  }

  /**
   * Drag over handler
   * @param {DragOverEvent} dragEvent
   * @private
   */
  [onDragOver](dragEvent) {
    const originalSourceClassName = this.draggable.getClassNameFor('source:original');
    let overElement;

    if (dragEvent.over && !dragEvent.over.classList.contains(originalSourceClassName)) {
      overElement = dragEvent.over;
    } else {
      overElement = dragEvent.overContainer.querySelector(
        `${this.draggable.options.draggable}:not(.${originalSourceClassName})`,
      );
    }

    if (!overElement) {
      return;
    }

    dragEvent.overContainer.appendChild(dragEvent.mirror);

    requestAnimationFrame(() => {
      requestAnimationFrame(animateResize(dragEvent.mirror, overElement));
    });
  }
}

function animateResize(mirror, overElement) {
  return () => {
    const {width, height} = overElement.getBoundingClientRect();

    mirror.style.width = `${width}px`;
    mirror.style.height = `${height}px`;
  };
}
