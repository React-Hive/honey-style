import { css } from '../css';
import { themeMock } from '../__mocks__';
import type { HoneyStyledInterpolation } from '../types';

const createFakeTemplate = (strings: string[]): TemplateStringsArray => {
  const r = strings as unknown as TemplateStringsArray;
  (r as any).raw = [...strings];

  return r;
};

const evaluateCss = (strings: string[], ...interpolations: HoneyStyledInterpolation<any>[]) =>
  css(createFakeTemplate(strings), ...interpolations)({ theme: themeMock });

describe('[css]: basic behavior', () => {
  it('should return empty string for empty template and no interpolations', () => {
    expect(evaluateCss([''])).toBe('');
  });

  it('should return empty string for empty string interpolation', () => {
    expect(evaluateCss([''], '')).toBe('');
  });

  it('should return empty string for empty string wrapped in array', () => {
    expect(evaluateCss([''], [''])).toBe('');
  });

  it('should return stringified 0 for numeric interpolation', () => {
    expect(evaluateCss([''], 0)).toBe('0');
  });

  it('should return stringified 0 for numeric interpolation in array', () => {
    expect(evaluateCss([''], [0])).toBe('0');
  });

  it('should return empty string for null interpolation', () => {
    expect(evaluateCss([''], null)).toBe('');
  });

  it('should return empty string for null interpolation in array', () => {
    expect(evaluateCss([''], [null])).toBe('');
  });

  it('should return empty string for undefined interpolation', () => {
    expect(evaluateCss([''], undefined)).toBe('');
  });

  it('should return empty string for undefined interpolation in array', () => {
    expect(evaluateCss([''], [undefined])).toBe('');
  });

  it('should return empty string for false interpolation', () => {
    expect(evaluateCss([''], false)).toBe('');
  });

  it('should return empty string for false interpolation in array', () => {
    expect(evaluateCss([''], [false])).toBe('');
  });

  it('should join multiple style rules from interpolations with newline', () => {
    expect(evaluateCss(['', ''], ['width: 100%;', 'height: 100%;'])).toBe(
      'width: 100%;\nheight: 100%;',
    );
  });

  it('should resolve component with $$ComponentId', () => {
    const component = () => null;
    (component as any).$$ComponentId = 'hsc-123';

    expect(evaluateCss([''], component)).toBe('.hsc-123');
  });

  it('should convert object interpolation to kebab-case CSS string', () => {
    expect(
      evaluateCss([''], {
        width: '100%',
        backgroundColor: 'red',
      }),
    ).toBe('width: 100%;\nbackground-color: red;');
  });
});
