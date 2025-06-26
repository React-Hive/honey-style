import { convertHexToHexWithAlpha } from '../utils';

describe('[convertHexToHexWithAlpha]: basic behavior', () => {
  it('should convert short hex without hash and alpha 0 to hex with alpha', () => {
    expect(convertHexToHexWithAlpha('FFF', 0)).toBe('#FFFFFF00');
  });

  it('should convert short hex with hash and alpha 0 to hex with alpha', () => {
    expect(convertHexToHexWithAlpha('#FFF', 0)).toBe('#FFFFFF00');
  });

  it('should convert short hex with hash and alpha 1 to hex with alpha', () => {
    expect(convertHexToHexWithAlpha('#FFF', 1)).toBe('#FFFFFFFF');
  });

  it('should convert full hex with alpha 0 to hex with alpha', () => {
    expect(convertHexToHexWithAlpha('#FFFFFF', 0)).toBe('#FFFFFF00');
  });

  it('should convert full hex with alpha 0.7 to hex with alpha', () => {
    expect(convertHexToHexWithAlpha('#FFFFFF', 0.7)).toBe('#FFFFFFB3');
  });

  it('should convert full hex with alpha 1 to hex with alpha', () => {
    expect(convertHexToHexWithAlpha('#FFFFFF', 1)).toBe('#FFFFFFFF');
  });

  it('should convert minimum 3-char hex with alpha 0 to hex with alpha', () => {
    expect(convertHexToHexWithAlpha('#000', 0)).toBe('#00000000');
  });

  it('should convert maximum 3-char hex with alpha 1 to hex with alpha', () => {
    expect(convertHexToHexWithAlpha('#FFF', 1)).toBe('#FFFFFFFF');
  });

  it('should convert minimum 6-char hex with alpha 0 to hex with alpha', () => {
    expect(convertHexToHexWithAlpha('#000000', 0)).toBe('#00000000');
  });

  it('should convert maximum 6-char hex with alpha 1 to hex with alpha', () => {
    expect(convertHexToHexWithAlpha('#FFFFFF', 1)).toBe('#FFFFFFFF');
  });

  it('should throw error for invalid hex code', () => {
    expect(() => convertHexToHexWithAlpha('#ZZZ', 0)).toThrow();
  });

  it('should throw error for alpha value less than 0', () => {
    expect(() => convertHexToHexWithAlpha('#FFF', -0.1)).toThrow();
  });

  it('should throw error for alpha value greater than 1', () => {
    expect(() => convertHexToHexWithAlpha('#FFF', 1.1)).toThrow();
  });
});
