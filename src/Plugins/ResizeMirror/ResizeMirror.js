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
    requestAnimationFrame(
      animateResize({
        dragEvent,
        draggableSelector: this.draggable.options.draggable,
        originalSourceClassName: this.draggable.getClassNameFor('source:original'),
      }),
    );
  }
}

function animateResize({dragEvent, draggableSelector, originalSourceClassName}) {
  return () => {
    const overElement =
      dragEvent.over || dragEvent.overContainer.querySelector(`${draggableSelector}:not(.${originalSourceClassName})`);

    if (!overElement) {
      return;
    }

    const overRect = overElement.getBoundingClientRect();
    dragEvent.overContainer.appendChild(dragEvent.mirror);

    dragEvent.mirror.style.width = `${overRect.width}px`;
    dragEvent.mirror.style.height = `${overRect.height}px`;
  };
}
