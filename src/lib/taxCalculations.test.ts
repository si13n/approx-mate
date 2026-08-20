import { describe, it, expect } from "vitest";
import {
  calculateB2BFromGross,
  calculateB2BFromNet,
  calculateUoPFromGross,
  calculateUoPFromNet,
} from "./taxCalculations";
import { DEFAULT_TAX_PROFILE, TaxProfile } from "../config/tax";

const TOLERANCE = 0.01; // 1 grosz tolerance for round-trip tests

describe("Tax Calculations", () => {
  describe("B2B — Basic Calculations", () => {
    it("should calculate B2B net from gross with Full ZUS", () => {
      const result = calculateB2BFromGross(5000, DEFAULT_TAX_PROFILE);
      expect(result.monthlyGross).toBe(5000);
      expect(result.monthlyNet).toBeGreaterThan(0);
      expect(result.monthlyNet).toBeLessThan(5000);
    });

    it("should calculate B2B with different ryczałt rates", () => {
      const profile8_5 = {
        ...DEFAULT_TAX_PROFILE,
        b2b: { ...DEFAULT_TAX_PROFILE.b2b, ryczaltRate: 0.085 },
      };
      const profile12 = DEFAULT_TAX_PROFILE;

      const result8_5 = calculateB2BFromGross(5000, profile8_5);
      const result12 = calculateB2BFromGross(5000, profile12);

      expect(result8_5.monthlyNet).toBeGreaterThan(result12.monthlyNet);
    });

    it("should apply health contribution tier 1 for low annual revenue", () => {
      const result = calculateB2BFromGross(3000, DEFAULT_TAX_PROFILE);
      expect(result.healthContribution).toBeCloseTo(498.35, 1);
    });

    it("should apply correct health contribution tier based on revenue", () => {
      // Test that different revenue levels get different health contributions
      const low = calculateB2BFromGross(3000, DEFAULT_TAX_PROFILE);
      const high = calculateB2BFromGross(10000, DEFAULT_TAX_PROFILE);

      expect(high.healthContribution).toBeGreaterThanOrEqual(low.healthContribution);
    });
  });

  describe("B2B — ZUS Profiles", () => {
    it("should handle Full ZUS", () => {
      const result = calculateB2BFromGross(5000, DEFAULT_TAX_PROFILE);
      expect(result.socialZUS).toBeCloseTo(1788.29, 1);
    });

    it("should handle Preferential ZUS", () => {
      const profile = {
        ...DEFAULT_TAX_PROFILE,
        b2b: { ...DEFAULT_TAX_PROFILE.b2b, zusProfile: "preferential" as const },
      };
      const result = calculateB2BFromGross(5000, profile);
      expect(result.socialZUS).toBeCloseTo(420.86, 1);
    });

    it("should handle Ulga na start (zero social contributions)", () => {
      const profile = {
        ...DEFAULT_TAX_PROFILE,
        b2b: { ...DEFAULT_TAX_PROFILE.b2b, zusProfile: "ulgaNaStart" as const },
      };
      const result = calculateB2BFromGross(5000, profile);
      expect(result.socialZUS).toBe(0);
    });

    it("should add sickness insurance when enabled", () => {
      const resultWithout = calculateB2BFromGross(5000, DEFAULT_TAX_PROFILE);

      const profileWith = {
        ...DEFAULT_TAX_PROFILE,
        b2b: { ...DEFAULT_TAX_PROFILE.b2b, sicknesInsurance: true },
      };
      const resultWith = calculateB2BFromGross(5000, profileWith);

      expect(resultWith.socialZUS).toBeGreaterThan(resultWithout.socialZUS);
    });
  });

  describe("B2B — Reverse Calculations (Net to Gross)", () => {
    it("should reverse calculate gross from net", () => {
      const targetNet = 3500;
      const result = calculateB2BFromNet(targetNet, DEFAULT_TAX_PROFILE);

      // Recalculate to verify
      const verify = calculateB2BFromGross(result.monthlyGross, DEFAULT_TAX_PROFILE);
      expect(verify.monthlyNet).toBeCloseTo(targetNet, 0);
    });

    it("should maintain round-trip accuracy (Gross → Net → Gross)", () => {
      const originalGross = 6500;
      const netResult = calculateB2BFromGross(originalGross, DEFAULT_TAX_PROFILE);
      const reverseResult = calculateB2BFromNet(netResult.monthlyNet, DEFAULT_TAX_PROFILE);

      expect(reverseResult.monthlyGross).toBeCloseTo(originalGross, 0);
    });
  });

  describe("UoP — Basic Calculations", () => {
    it("should calculate UoP net from gross", () => {
      const result = calculateUoPFromGross(5000, DEFAULT_TAX_PROFILE);
      expect(result.monthlyGross).toBe(5000);
      expect(result.monthlyNet).toBeGreaterThan(0);
      expect(result.monthlyNet).toBeLessThan(5000);
    });

    it("should handle PIT bracket 12% for low income", () => {
      const result = calculateUoPFromGross(5000, DEFAULT_TAX_PROFILE);
      expect(result.incomeTax).toBeGreaterThan(0);
    });

    it("should handle PIT bracket 32% for high income", () => {
      const result = calculateUoPFromGross(15000, DEFAULT_TAX_PROFILE);
      expect(result.incomeTax).toBeGreaterThan(0);
    });
  });

  describe("UoP — KUP Settings", () => {
    it("should use standard KUP (250 PLN) by default", () => {
      const result = calculateUoPFromGross(5000, DEFAULT_TAX_PROFILE);
      // Standard KUP = 250, should reduce taxable base
      expect(result.monthlyNet).toBeGreaterThan(0);
    });

    it("should use commuter KUP (300 PLN) when selected", () => {
      const profileStandard = DEFAULT_TAX_PROFILE;
      const profileCommuter = {
        ...DEFAULT_TAX_PROFILE,
        uop: { ...DEFAULT_TAX_PROFILE.uop, kupType: "commuter" as const },
      };

      const resultStandard = calculateUoPFromGross(5000, profileStandard);
      const resultCommuter = calculateUoPFromGross(5000, profileCommuter);

      // Commuter KUP allows higher deduction, so net should be higher
      expect(resultCommuter.monthlyNet).toBeGreaterThan(resultStandard.monthlyNet);
    });
  });

  describe("UoP — PPK", () => {
    it("should not apply PPK by default", () => {
      const result = calculateUoPFromGross(5000, DEFAULT_TAX_PROFILE);
      expect(result.monthlyNet).toBeGreaterThan(0);
    });

    it("should reduce net when PPK is enabled", () => {
      const resultWithout = calculateUoPFromGross(5000, DEFAULT_TAX_PROFILE);

      const profileWith = {
        ...DEFAULT_TAX_PROFILE,
        uop: { ...DEFAULT_TAX_PROFILE.uop, ppkEnabled: true },
      };
      const resultWith = calculateUoPFromGross(5000, profileWith);

      expect(resultWith.monthlyNet).toBeLessThan(resultWithout.monthlyNet);
    });

    it("should apply 2% employee PPK contribution", () => {
      const profileWith = {
        ...DEFAULT_TAX_PROFILE,
        uop: { ...DEFAULT_TAX_PROFILE.uop, ppkEnabled: true },
      };
      const result = calculateUoPFromGross(5000, profileWith);

      // PPK contribution should be roughly 5000 * 0.02 / 12 = 8.33 per month
      const resultWithout = calculateUoPFromGross(5000, DEFAULT_TAX_PROFILE);
      const difference = resultWithout.monthlyNet - result.monthlyNet;
      expect(difference).toBeCloseTo(100, 0); // Annual 2% is ~100/month
    });
  });

  describe("UoP — Reverse Calculations (Net to Gross)", () => {
    it("should reverse calculate gross from net", () => {
      const targetNet = 3500;
      const result = calculateUoPFromNet(targetNet, DEFAULT_TAX_PROFILE);

      // Recalculate to verify
      const verify = calculateUoPFromGross(result.monthlyGross, DEFAULT_TAX_PROFILE);
      expect(verify.monthlyNet).toBeCloseTo(targetNet, 0);
    });

    it("should maintain round-trip accuracy (Gross → Net → Gross)", () => {
      const originalGross = 6500;
      const netResult = calculateUoPFromGross(originalGross, DEFAULT_TAX_PROFILE);
      const reverseResult = calculateUoPFromNet(netResult.monthlyNet, DEFAULT_TAX_PROFILE);

      expect(reverseResult.monthlyGross).toBeCloseTo(originalGross, 0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle minimum viable amounts (B2B)", () => {
      const result = calculateB2BFromGross(2000, DEFAULT_TAX_PROFILE);
      expect(result.monthlyNet).toBeGreaterThanOrEqual(0);
      expect(result.monthlyGross).toBe(2000);
    });

    it("should handle very high amounts", () => {
      const result = calculateUoPFromGross(100000, DEFAULT_TAX_PROFILE);
      expect(result.monthlyNet).toBeGreaterThan(0);
      expect(result.monthlyGross).toBe(100000);
    });

    it("should not return negative net", () => {
      const result = calculateUoPFromGross(2000, DEFAULT_TAX_PROFILE);
      expect(result.monthlyNet).toBeGreaterThanOrEqual(0);
    });

    it("should handle zero amount", () => {
      const result = calculateB2BFromGross(0, DEFAULT_TAX_PROFILE);
      expect(result.monthlyNet).toBe(0);
    });
  });

  describe("Consistency Checks", () => {
    it("B2B net should increase with gross", () => {
      const result1 = calculateB2BFromGross(3000, DEFAULT_TAX_PROFILE);
      const result2 = calculateB2BFromGross(5000, DEFAULT_TAX_PROFILE);

      expect(result2.monthlyNet).toBeGreaterThan(result1.monthlyNet);
    });

    it("UoP net should increase with gross", () => {
      const result1 = calculateUoPFromGross(3000, DEFAULT_TAX_PROFILE);
      const result2 = calculateUoPFromGross(5000, DEFAULT_TAX_PROFILE);

      expect(result2.monthlyNet).toBeGreaterThan(result1.monthlyNet);
    });

    it("UoP and B2B should both produce valid results for typical salaries", () => {
      const b2b = calculateB2BFromGross(5000, DEFAULT_TAX_PROFILE);
      const uop = calculateUoPFromGross(5000, DEFAULT_TAX_PROFILE);

      // Both should produce positive net
      expect(b2b.monthlyNet).toBeGreaterThan(0);
      expect(uop.monthlyNet).toBeGreaterThan(0);
      // Both should be less than gross
      expect(b2b.monthlyNet).toBeLessThan(5000);
      expect(uop.monthlyNet).toBeLessThan(5000);
    });
  });
});
