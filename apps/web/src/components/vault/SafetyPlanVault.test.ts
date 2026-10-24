import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  encryptVaultData,
  decryptVaultData,
  bytesToHex,
  hexToBytes,
  DEFAULT_SAFETY_PLAN,
  purgeVaultStorage,
  VAULT_STORAGE_KEY,
  type SafetyPlanData,
} from "./SafetyPlanVault";

describe("Safety Plan Vault Cryptography & Local Storage (Web Crypto API)", () => {
  const samplePlan: SafetyPlanData = {
    reasonsToStay: [
      "Seeing the morning sun over the Meghna river",
      "My little brother who counts on my guidance",
      "Experiencing quiet peaceful moments without panic",
    ],
    trustedContacts: [
      { name: "Best Friend", phoneOrLink: "+8801700000000" },
      { name: "Kaan Pete Roi Lifeline", phoneOrLink: "+8801779554391" },
    ],
    safePlaces: ["Under my warm quilt with low lighting", "Rooftop garden during calm evenings"],
    copingStrategies: ["Drink a glass of cold water slowly", "4-7-8 breathing countdown"],
    notes: "Hold on for one more hour. The sun will rise again.",
  };

  it("converts bytes to hex and back losslessly", () => {
    const originalBytes = new Uint8Array([0, 15, 16, 255, 128, 42]);
    const hex = bytesToHex(originalBytes);
    expect(hex).toBe("000f10ff802a");

    const recovered = hexToBytes(hex);
    expect(recovered).toEqual(originalBytes);
  });

  it("encrypts and decrypts safety plan using 4-digit PIN and Web Crypto AES-GCM", async () => {
    const pin = "7412";
    const encryptedPayload = await encryptVaultData(samplePlan, pin);

    expect(encryptedPayload.encrypted).toBe(true);
    expect(typeof encryptedPayload.salt).toBe("string");
    expect(encryptedPayload.salt.length).toBe(32); // 16 bytes = 32 hex chars
    expect(typeof encryptedPayload.iv).toBe("string");
    expect(encryptedPayload.iv.length).toBe(24); // 12 bytes = 24 hex chars
    expect(encryptedPayload.ciphertext.length).toBeGreaterThan(50);

    const decrypted = await decryptVaultData(encryptedPayload, pin);
    expect(decrypted.reasonsToStay).toEqual(samplePlan.reasonsToStay);
    expect(decrypted.trustedContacts).toEqual(samplePlan.trustedContacts);
    expect(decrypted.safePlaces).toEqual(samplePlan.safePlaces);
    expect(decrypted.notes).toBe(samplePlan.notes);
  });

  it("fails decryption when an incorrect PIN is provided", async () => {
    const correctPin = "9880";
    const wrongPin = "1234";

    const encrypted = await encryptVaultData(samplePlan, correctPin);

    await expect(decryptVaultData(encrypted, wrongPin)).rejects.toThrow();
  });

  it("validates default safety plan structure and compassionate content", () => {
    expect(DEFAULT_SAFETY_PLAN.reasonsToStay.length).toBeGreaterThanOrEqual(3);
    expect(DEFAULT_SAFETY_PLAN.trustedContacts.length).toBeGreaterThanOrEqual(2);
    expect(DEFAULT_SAFETY_PLAN.safePlaces.length).toBeGreaterThanOrEqual(1);
    expect(DEFAULT_SAFETY_PLAN.copingStrategies.length).toBeGreaterThanOrEqual(1);
  });

  describe("Purge Storage Hygiene", () => {
    const mockStorage: Record<string, string> = {};

    beforeEach(() => {
      // Setup hermetic localStorage mock
      vi.stubGlobal("localStorage", {
        getItem: (k: string) => mockStorage[k] ?? null,
        setItem: (k: string, v: string) => {
          mockStorage[k] = v;
        },
        removeItem: (k: string) => {
          delete mockStorage[k];
        },
        clear: () => {
          for (const k of Object.keys(mockStorage)) {
            delete mockStorage[k];
          }
        },
      });
      vi.stubGlobal("window", { localStorage: globalThis.localStorage });
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("permanently purges vault data from storage on 1-click purge command", () => {
      mockStorage[VAULT_STORAGE_KEY] = JSON.stringify({ encrypted: false, data: samplePlan });
      expect(mockStorage[VAULT_STORAGE_KEY]).toBeDefined();

      purgeVaultStorage();

      expect(mockStorage[VAULT_STORAGE_KEY]).toBeUndefined();
    });
  });
});
