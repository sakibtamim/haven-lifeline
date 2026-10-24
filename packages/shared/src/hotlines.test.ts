import { describe, it, expect } from "vitest";
import { emergencyHotlines, getHotlineForCountry, formatTelLink, formatSmsLink } from "./hotlines";
import { hotlineSchema } from "./schemas";

describe("Emergency Hotlines Catalog", () => {
  it("validates all hotlines against Zod schema", () => {
    for (const hotline of emergencyHotlines) {
      const parsed = hotlineSchema.safeParse(hotline);
      expect(parsed.success).toBe(true);
      expect(hotline.isEmergency).toBe(true);
    }
  });

  it("retrieves Bangladesh hotline when BD is requested", () => {
    const bd = getHotlineForCountry("BD");
    expect(bd.countryCode).toBe("BD");
    expect(bd.name).toContain("Bangladesh");
    expect(bd.primaryPhone).toBe("999");
    expect(bd.phoneDisplay).toContain("+880");
  });

  it("falls back to Bangladesh when unknown country is passed", () => {
    const fallback = getHotlineForCountry("ZZ");
    expect(fallback.countryCode).toBe("BD");
    expect(fallback.primaryPhone).toBe("999");
  });

  it("correctly formats tel: URI without spaces or hyphens", () => {
    expect(formatTelLink("+880 1779-554391")).toBe("tel:+8801779554391");
    expect(formatTelLink("116 123")).toBe("tel:116123");
    expect(formatTelLink("988")).toBe("tel:988");
  });

  it("correctly formats sms: URI with prefilled keyword", () => {
    expect(formatSmsLink("741741", "HOME")).toBe("sms:741741?body=HOME");
    expect(formatSmsLink("85258")).toBe("sms:85258");
  });
});
