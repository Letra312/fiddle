import { ElectronVersionSource, ElectronVersionState } from '../../src/interfaces';
import { BisectInstance } from '../../src/renderer/bisect';

const generateVersionRange = (rangeLength: number) =>
  (new Array(rangeLength)).fill(0).map((_, i) => ({
    state: ElectronVersionState.ready,
    version: `${i + 1}.0.0`,
    source: ElectronVersionSource.local
  }));

describe('bisect', () => {
  let bisectInstance: BisectInstance;

  beforeEach(() => {
    const versions = generateVersionRange(9);
    bisectInstance = new BisectInstance(versions);
  });

  it('selects a pivot in the middle of the array', () => {
    const pivot = bisectInstance.getCurrentVersion();
    const middleIndex = Math.floor(bisectInstance.revList.length / 2);
    expect(pivot).toBe(bisectInstance.revList[middleIndex]);
  });

  describe('continue()', () => {
    it('returns the current version', () => {
      const result = bisectInstance.continue(true);
      const version = bisectInstance.getCurrentVersion();
      expect(result).toBe(version);
    });

    it('discards lower half of the range if pivot is good version', () => {
      const pivotVersion = bisectInstance.getCurrentVersion();
      bisectInstance.continue(true);
      expect(bisectInstance.revList[bisectInstance.minRev]).toBe(pivotVersion);
    });

    it('discards upper half of the range if pivot is bad version', () => {
      const pivotVersion = bisectInstance.getCurrentVersion();
      bisectInstance.continue(false);
      expect(bisectInstance.revList[bisectInstance.maxRev]).toBe(pivotVersion);
    });

    it('terminates if fewer than 2 items are left', () => {
      const versions = generateVersionRange(2);
      bisectInstance = new BisectInstance(versions);

      expect(bisectInstance.revList.length).toBe(2);
      const responseGood = bisectInstance.continue(true);
      expect(responseGood).toHaveLength(2);
      expect(versions).toContain(responseGood[0]);
      expect(versions).toContain(responseGood[1]);

      bisectInstance = new BisectInstance(versions);

      expect(bisectInstance.revList.length).toBe(2);
      const responseBad = bisectInstance.continue(false);
      expect(responseBad).toHaveLength(2);
      expect(versions).toContain(responseBad[0]);
      expect(versions).toContain(responseBad[1]);
    });
  });

  describe('getCurrentVersion()', () => {
    it('returns a version within the range', () => {
      const version = bisectInstance.getCurrentVersion();
      expect(bisectInstance.revList).toContain(version);
    });
  });
});
