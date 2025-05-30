import type { SVGAttributes, TdHTMLAttributes } from 'react';

import type { HoneyBreakpointName } from './types';

const ENV = process.env.NODE_ENV || 'development';

export const __DEV__ = ENV !== 'production';

if (__DEV__ && typeof window !== 'undefined' && !process.env.JEST_WORKER_ID) {
  console.info(
    '[@react-hive/honey-style]: You are running in development mode. ' +
      'This build is not optimized for production and may include extra checks or logs.',
  );
}

export const HONEY_STYLED_COMPONENT_ID_PROP = '$$ComponentId';

export const HONEY_GLOBAL_STYLE_ATTR = 'data-honey-global-style';
export const HONEY_STYLE_ATTR = 'data-honey-style';

export const HONEY_BREAKPOINTS: HoneyBreakpointName[] = ['xs', 'sm', 'md', 'lg', 'xl'];

const VALID_HTML_ATTRS = new Set([
  'accept',
  'accessKey',
  'alt',
  'aria',
  'as',
  'autoCapitalize',
  'autoComplete',
  'autoFocus',
  'capture',
  'checked',
  'className',
  'contentEditable',
  'contextMenu',
  'controls',
  'crossOrigin',
  'dangerouslySetInnerHTML',
  'data',
  'dir',
  'disabled',
  'download',
  'draggable',
  'form',
  'formAction',
  'formEncType',
  'formMethod',
  'formNoValidate',
  'formTarget',
  'height',
  'hidden',
  'href',
  'hrefLang',
  'id',
  'is',
  'isMap',
  'inert',
  'key',
  'lang',
  'list',
  'loop',
  'max',
  'maxLength',
  'media',
  'min',
  'minLength',
  'multiple',
  'muted',
  'name',
  'pattern',
  'placeholder',
  'readOnly',
  'required',
  'role',
  'size',
  'slot',
  'spellCheck',
  'src',
  'srcSet',
  'step',
  'style',
  'tabIndex',
  'target',
  'title',
  'translate',
  'type',
  'useMap',
  'value',
  'width',
  'ref',
  'children',
  'class',
  'char',
  'charOff',
  'unselectable',
  'inputMode',
]);

const VALID_TABLE_ATTRS = new Set<keyof TdHTMLAttributes<any>>([
  'colSpan',
  'rowSpan',
  'headers',
  'abbr',
  'scope',
  /**
   * @deprecated https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableCellElement/align
   */
  'align',
  /**
   * @deprecated https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableCellElement/vAlign
   */
  'valign',
]);

const VALID_SVG_ATTRS = new Set<keyof SVGAttributes<any>>([
  'viewBox',
  'fill',
  'stroke',
  'strokeWidth',
  'strokeLinecap',
  'strokeLinejoin',
  'strokeDasharray',
  'strokeDashoffset',
  'strokeOpacity',
  'fillOpacity',
  'opacity',
  'pointerEvents',
  'focusable',
  'x',
  'y',
  'x1',
  'x2',
  'y1',
  'y2',
  'cx',
  'cy',
  'r',
  'rx',
  'ry',
  'd',
  'points',
  'height',
  'transform',
  'xmlns',
  'preserveAspectRatio',
  'mask',
  'clipPath',
  'pathLength',
  'markerStart',
  'markerMid',
  'markerEnd',
  'refX',
  'refY',
  'dominantBaseline',
  'textAnchor',
]);

const VALID_EVENT_ATTRS = new Set([
  // Clipboard
  'onCopy',
  'onCut',
  'onPaste',
  // Composition
  'onCompositionEnd',
  'onCompositionStart',
  'onCompositionUpdate',
  // Focus
  'onFocus',
  'onBlur',
  // Form
  'onChange',
  'onInput',
  'onInvalid',
  'onReset',
  'onSubmit',
  // Keyboard
  'onKeyDown',
  'onKeyPress',
  'onKeyUp',
  // Mouse
  'onClick',
  'onContextMenu',
  'onDoubleClick',
  'onMouseDown',
  'onMouseEnter',
  'onMouseLeave',
  'onMouseMove',
  'onMouseOut',
  'onMouseOver',
  'onMouseUp',
  // Drag & Drop
  'onDrag',
  'onDragEnd',
  'onDragEnter',
  'onDragExit',
  'onDragLeave',
  'onDragOver',
  'onDragStart',
  'onDrop',
  // Pointer
  'onPointerDown',
  'onPointerMove',
  'onPointerUp',
  'onPointerCancel',
  'onPointerEnter',
  'onPointerLeave',
  'onPointerOver',
  'onPointerOut',
  'onGotPointerCapture',
  'onLostPointerCapture',
  // Selection
  'onSelect',
  // Touch
  'onTouchCancel',
  'onTouchEnd',
  'onTouchMove',
  'onTouchStart',
  // UI
  'onScroll',
  // Wheel
  'onWheel',
  // Media
  'onAbort',
  'onCanPlay',
  'onCanPlayThrough',
  'onDurationChange',
  'onEmptied',
  'onEncrypted',
  'onEnded',
  'onLoadedData',
  'onLoadedMetadata',
  'onLoadStart',
  'onPause',
  'onPlay',
  'onPlaying',
  'onProgress',
  'onRateChange',
  'onSeeked',
  'onSeeking',
  'onStalled',
  'onSuspend',
  'onTimeUpdate',
  'onVolumeChange',
  'onWaiting',
  // Image
  'onLoad',
  'onError',
]);

export const VALID_DOM_ELEMENT_ATTRS = new Set([
  ...VALID_HTML_ATTRS,
  ...VALID_TABLE_ATTRS,
  ...VALID_SVG_ATTRS,
  ...VALID_EVENT_ATTRS,
]);
