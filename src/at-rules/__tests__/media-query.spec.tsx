import { mediaQuery } from '../media-query';

describe('[mediaQuery]: basic behavior', () => {
  it('should return "@media " for empty input', () => {
    const media = mediaQuery([]);

    expect(media).toBe('@media ');
  });

  it('should return "@media print" for single mediaType', () => {
    const media = mediaQuery([{ mediaType: 'print' }]);

    expect(media).toBe('@media print');
  });

  it('should return multiple media types separated by comma', () => {
    const media = mediaQuery([{ mediaType: 'screen' }, { mediaType: 'print' }]);

    expect(media).toBe('@media screen, print');
  });

  it('should include operator before mediaType', () => {
    const media = mediaQuery([{ operator: 'only', mediaType: 'screen' }]);

    expect(media).toBe('@media only screen');
  });

  it('should include min-width condition with default mediaType', () => {
    const media = mediaQuery([{ minWidth: '1280px' }]);

    expect(media).toBe('@media screen and (min-width: 1280px)');
  });

  it('should include operator and min-width condition', () => {
    const media = mediaQuery([{ operator: 'only', minWidth: '1280px' }]);

    expect(media).toBe('@media only screen and (min-width: 1280px)');
  });

  it('should include max-width condition with default mediaType', () => {
    const media = mediaQuery([{ maxWidth: '480px' }]);

    expect(media).toBe('@media screen and (max-width: 480px)');
  });

  it('should include both min-width and max-width conditions', () => {
    const media = mediaQuery([{ minWidth: '640px', maxWidth: '960px' }]);

    expect(media).toBe('@media screen and (min-width: 640px) and (max-width: 960px)');
  });

  it('should include both min-height and max-height conditions', () => {
    const media = mediaQuery([{ minHeight: '360px', maxHeight: '640px' }]);

    expect(media).toBe('@media screen and (min-height: 360px) and (max-height: 640px)');
  });

  it('should include orientation condition', () => {
    const media = mediaQuery([{ orientation: 'landscape' }]);

    expect(media).toBe('@media screen and (orientation: landscape)');
  });

  it('should include both width and height conditions', () => {
    const media = mediaQuery([{ width: '700px' }, { height: '500px' }]);

    expect(media).toBe('@media screen and (width: 700px), screen and (height: 500px)');
  });
});
