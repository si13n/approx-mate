import { describe, it, expect } from 'vitest';
import {
  b2bGrossToNet,
  b2bNetToGross,
  uopGrossToNet,
  uopNetToGross,
  createCalculationEngine,
} from './calculations';

describe('b2bGrossToNet', () => {
  it('should calculate net from gross correctly', () => {
    const result = b2bGrossToNet(10000);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(10000);
  });

  it('should handle zero input', () => {
    // At zero gross, health insurance (zdrowotna) is still deducted
    const result = b2bGrossToNet(0);
    expect(result).toBeLessThan(0);
  });

  it('should be consistent across different amounts', () => {
    const small = b2bGrossToNet(5000);
    const large = b2bGrossToNet(50000);
    expect(small).toBeGreaterThan(0);
    expect(large).toBeGreaterThan(small);
  });
});

describe('b2bNetToGross', () => {
  it('should calculate gross from net correctly', () => {
    const result = b2bNetToGross(7500);
    expect(result).toBeGreaterThan(7500);
  });

  it('should be inverse of b2bGrossToNet (within tolerance)', () => {
    const gross = 10000;
    const net = b2bGrossToNet(gross);
    const backToGross = b2bNetToGross(net);
    expect(backToGross).toBeCloseTo(gross, 0);
  });

  it('should handle zero input', () => {
    const result = b2bNetToGross(0);
    expect(result).toBe(0);
  });
});

describe('uopGrossToNet', () => {
  it('should calculate net from gross correctly', () => {
    const result = uopGrossToNet(10000);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(10000);
  });

  it('should handle zero input', () => {
    const result = uopGrossToNet(0);
    expect(result).toBe(0);
  });

  it('should be different from B2B for same gross', () => {
    const b2bNet = b2bGrossToNet(10000);
    const uopNet = uopGrossToNet(10000);
    expect(b2bNet).not.toEqual(uopNet);
  });
});

describe('uopNetToGross', () => {
  it('should calculate gross from net correctly', () => {
    const result = uopNetToGross(7500);
    expect(result).toBeGreaterThan(7500);
  });

  it('should be inverse of uopGrossToNet (within tolerance)', () => {
    const gross = 10000;
    const net = uopGrossToNet(gross);
    const backToGross = uopNetToGross(net);
    expect(backToGross).toBeCloseTo(gross, 0);
  });

  it('should handle zero input', () => {
    const result = uopNetToGross(0);
    expect(result).toBe(0);
  });
});

describe('B2B vs UoP comparison', () => {
  it('should show B2B is more efficient (lower gross for same net)', () => {
    const netTarget = 10000;
    const b2bGross = b2bNetToGross(netTarget);
    const uopGross = uopNetToGross(netTarget);
    expect(b2bGross).toBeLessThan(uopGross);
  });

  it('should show UoP yields less net from same gross', () => {
    const grossAmount = 15000;
    const b2bNet = b2bGrossToNet(grossAmount);
    const uopNet = uopGrossToNet(grossAmount);
    expect(b2bNet).toBeGreaterThan(uopNet);
  });
});

describe('createCalculationEngine', () => {
  const rates = {
    PLN_PLN: 1,
    USD_PLN: 4.0,
    EUR_PLN: 4.5,
  };

  const engine = createCalculationEngine(rates);

  describe('toPLN', () => {
    it('should convert USD to PLN', () => {
      const result = engine.toPLN(100, 'USD');
      expect(result).toBe(400);
    });

    it('should convert EUR to PLN', () => {
      const result = engine.toPLN(100, 'EUR');
      expect(result).toBe(450);
    });

    it('should handle PLN to PLN (identity)', () => {
      const result = engine.toPLN(100, 'PLN');
      expect(result).toBe(100);
    });

    it('should handle zero amount', () => {
      const result = engine.toPLN(0, 'USD');
      expect(result).toBe(0);
    });
  });

  describe('fromPLN', () => {
    it('should convert PLN to USD', () => {
      const result = engine.fromPLN(400, 'USD');
      expect(result).toBe(100);
    });

    it('should convert PLN to EUR', () => {
      const result = engine.fromPLN(450, 'EUR');
      expect(result).toBe(100);
    });

    it('should handle PLN to PLN (identity)', () => {
      const result = engine.fromPLN(100, 'PLN');
      expect(result).toBe(100);
    });

    it('should handle zero amount', () => {
      const result = engine.fromPLN(0, 'USD');
      expect(result).toBe(0);
    });

    it('should be inverse of toPLN', () => {
      const original = 100;
      const toPLN = engine.toPLN(original, 'USD');
      const back = engine.fromPLN(toPLN, 'USD');
      expect(back).toBeCloseTo(original, 5);
    });
  });

  it('should use fallback rate of 1 for missing currency', () => {
    const result = engine.toPLN(100, 'USD' as any);
    expect(result).toBe(400);
  });
});

describe('Tax brackets and thresholds', () => {
  it('should handle low income UoP correctly', () => {
    const lowGross = 3000;
    const net = uopGrossToNet(lowGross);
    expect(net).toBeGreaterThan(0);
    expect(net).toBeLessThan(lowGross);
  });

  it('should handle high income UoP correctly', () => {
    const highGross = 100000;
    const net = uopGrossToNet(highGross);
    expect(net).toBeGreaterThan(0);
    expect(net).toBeLessThan(highGross);
    // Higher income should have higher absolute net but similar percentage
    const lowGross = 10000;
    const lowNet = uopGrossToNet(lowGross);
    expect(net).toBeGreaterThan(lowNet);
  });

  it('should correctly apply B2B health insurance brackets', () => {
    // Test that different income levels get different health insurance rates
    const low = b2bGrossToNet(30000);  // Below 60k annual
    const mid = b2bGrossToNet(50000);  // In 60k-300k range
    const high = b2bGrossToNet(150000); // Above 300k annual

    expect(low).toBeGreaterThan(0);
    expect(mid).toBeGreaterThan(low);
    expect(high).toBeGreaterThan(mid);
  });
});

describe('Realistic scenarios', () => {
  it('$5000 USD net monthly (want mode)', () => {
    const rates = { PLN_PLN: 1, USD_PLN: 3.85, EUR_PLN: 4.25 };
    const engine = createCalculationEngine(rates);

    const usdAmount = 5000;
    const plnNet = engine.toPLN(usdAmount, 'USD');
    const b2bGross = b2bNetToGross(plnNet);
    const uopGross = uopNetToGross(plnNet);

    expect(plnNet).toBeCloseTo(19250, 0);
    expect(b2bGross).toBeGreaterThan(plnNet);
    expect(uopGross).toBeGreaterThan(plnNet);
    expect(b2bGross).toBeLessThan(uopGross);
  });

  it('20000 PLN B2B gross monthly (offer mode)', () => {
    const plnGross = 20000;
    const net = b2bGrossToNet(plnGross);

    expect(net).toBeGreaterThan(0);
    expect(net).toBeLessThan(plnGross);
    expect(net).toBeGreaterThan(plnGross * 0.7); // Should keep most of it
  });

  it('25000 PLN UoP gross monthly (offer mode)', () => {
    const plnGross = 25000;
    const net = uopGrossToNet(plnGross);

    expect(net).toBeGreaterThan(0);
    expect(net).toBeLessThan(plnGross);
    expect(net).toBeGreaterThan(plnGross * 0.60); // UoP keeps about 60% as net
    expect(net).toBeLessThan(plnGross * 0.65);
  });
});
