"use client";

import * as React from "react";
import { Button } from "../ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import {
  Lock,
  Unlock,
  KeyRound,
  Shield,
  Trash2,
  Save,
  Plus,
  Phone,
  Heart,
  Home,
  Check,
  AlertTriangle,
} from "lucide-react";
import { formatTelLink } from "@haven/shared";

export interface TrustedContact {
  name: string;
  phoneOrLink: string;
}

export interface SafetyPlanData {
  reasonsToStay: string[];
  trustedContacts: TrustedContact[];
  safePlaces: string[];
  copingStrategies: string[];
  notes?: string;
  updatedAt?: number;
}

export interface EncryptedVaultPayload {
  encrypted: true;
  salt: string; // hex
  iv: string; // hex
  ciphertext: string; // hex
  updatedAt: number;
}

export interface UnencryptedVaultPayload {
  encrypted: false;
  data: SafetyPlanData;
  updatedAt: number;
}

export type StoredVaultPayload = EncryptedVaultPayload | UnencryptedVaultPayload;

export const VAULT_STORAGE_KEY = "haven_crisis_safety_vault_v1";

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/**
 * Derives an AES-GCM 256-bit encryption key from a user's 4-digit PIN via PBKDF2 with 100,000 iterations.
 */
export async function deriveKeyFromPin(pin: string, saltBytes: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(pin),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: saltBytes as unknown as BufferSource,
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypts safety plan data using client-side Web Crypto AES-GCM + PBKDF2.
 * Zero bytes ever leave the client device.
 */
export async function encryptVaultData(
  data: SafetyPlanData,
  pin: string
): Promise<EncryptedVaultPayload> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKeyFromPin(pin, salt);

  const encodedData = new TextEncoder().encode(JSON.stringify(data));
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encodedData
  );

  return {
    encrypted: true,
    salt: bytesToHex(salt),
    iv: bytesToHex(iv),
    ciphertext: bytesToHex(new Uint8Array(encryptedBuffer)),
    updatedAt: Date.now(),
  };
}

/**
 * Decrypts encrypted safety plan payload with user PIN.
 * Throws an error if PIN is invalid or ciphertext is corrupted.
 */
export async function decryptVaultData(
  payload: EncryptedVaultPayload,
  pin: string
): Promise<SafetyPlanData> {
  const salt = hexToBytes(payload.salt);
  const iv = hexToBytes(payload.iv);
  const ciphertext = hexToBytes(payload.ciphertext);

  const key = await deriveKeyFromPin(pin, salt);
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv as unknown as BufferSource },
    key,
    ciphertext as unknown as BufferSource
  );

  const decodedJson = new TextDecoder().decode(decryptedBuffer);
  return JSON.parse(decodedJson) as SafetyPlanData;
}

export function loadVaultFromStorage(): StoredVaultPayload | null {
  if (typeof window === "undefined" || !window.localStorage) return null;
  try {
    const raw = localStorage.getItem(VAULT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredVaultPayload;
  } catch (err) {
    console.error("Failed to read safety vault from localStorage:", err);
    return null;
  }
}

export function saveVaultToStorage(payload: StoredVaultPayload): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error("Failed to save safety vault to localStorage:", err);
  }
}

export function purgeVaultStorage(): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    localStorage.removeItem(VAULT_STORAGE_KEY);
  } catch (err) {
    console.error("Failed to purge safety vault from localStorage:", err);
  }
}

export const DEFAULT_SAFETY_PLAN: SafetyPlanData = {
  reasonsToStay: [
    "My pet / family member who needs my presence and warmth.",
    "The sunrise and gentle morning coffee on quiet days.",
    "The future version of myself who survived this storm and found peace.",
  ],
  trustedContacts: [
    { name: "Closest Friend / Supporter", phoneOrLink: "555-0199" },
    { name: "Crisis Text Line", phoneOrLink: "741741" },
  ],
  safePlaces: [
    "Under a heavy weighted blanket in my room with low lighting.",
    "A quiet park bench or walking path near nature.",
  ],
  copingStrategies: [
    "Drink a large glass of ice-cold water slowly.",
    "Put on noise-cancelling headphones with rain or brown noise.",
    "Press hands flat against a solid wall and feel its stability.",
  ],
  notes: "Take this minute by minute. I have survived 100% of my worst days so far.",
};

export function SafetyPlanVault() {
  const [isLocked, setIsLocked] = React.useState(false);
  const [hasEncryptedVault, setHasEncryptedVault] = React.useState(false);
  const [pinInput, setPinInput] = React.useState("");
  const [unlockError, setUnlockError] = React.useState<string | null>(null);

  const [planData, setPlanData] = React.useState<SafetyPlanData>(DEFAULT_SAFETY_PLAN);
  const [enablePinEncryption, setEnablePinEncryption] = React.useState(false);
  const [vaultPin, setVaultPin] = React.useState("");
  const [saveSuccessNotice, setSaveSuccessNotice] = React.useState(false);
  const [purgeSuccessNotice, setPurgeSuccessNotice] = React.useState(false);

  // Initialize vault on client mount
  React.useEffect(() => {
    const stored = loadVaultFromStorage();
    if (!stored) {
      setIsLocked(false);
      setHasEncryptedVault(false);
      return;
    }

    if (stored.encrypted) {
      setHasEncryptedVault(true);
      setIsLocked(true);
    } else {
      setHasEncryptedVault(false);
      setIsLocked(false);
      if (stored.data) {
        setPlanData(stored.data);
      }
    }
  }, []);

  const handleUnlock = async () => {
    if (pinInput.length < 4) {
      setUnlockError("Please enter your complete 4-digit PIN.");
      return;
    }

    setUnlockError(null);
    const stored = loadVaultFromStorage();
    if (!stored || !stored.encrypted) {
      setIsLocked(false);
      return;
    }

    try {
      const decrypted = await decryptVaultData(stored, pinInput);
      setPlanData(decrypted);
      setIsLocked(false);
      setVaultPin(pinInput);
      setEnablePinEncryption(true);
      setPinInput("");
    } catch (_err) {
      setUnlockError("Incorrect PIN. Please try again or purge vault if forgotten.");
    }
  };

  const handleSave = async () => {
    const dataToSave: SafetyPlanData = {
      ...planData,
      updatedAt: Date.now(),
    };

    if (enablePinEncryption && vaultPin.length >= 4) {
      try {
        const encrypted = await encryptVaultData(dataToSave, vaultPin);
        saveVaultToStorage(encrypted);
        setHasEncryptedVault(true);
      } catch (err) {
        console.error("Encryption failed while saving vault:", err);
        return;
      }
    } else {
      const unencrypted: UnencryptedVaultPayload = {
        encrypted: false,
        data: dataToSave,
        updatedAt: Date.now(),
      };
      saveVaultToStorage(unencrypted);
      setHasEncryptedVault(false);
    }

    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const handlePurge = () => {
    purgeVaultStorage();
    setPlanData(DEFAULT_SAFETY_PLAN);
    setIsLocked(false);
    setHasEncryptedVault(false);
    setEnablePinEncryption(false);
    setVaultPin("");
    setPinInput("");
    setUnlockError(null);
    setPurgeSuccessNotice(true);
    setTimeout(() => setPurgeSuccessNotice(false), 4000);
  };

  const updateReason = (index: number, val: string) => {
    setPlanData((prev) => {
      const updated = [...prev.reasonsToStay];
      updated[index] = val;
      return { ...prev, reasonsToStay: updated };
    });
  };

  const addReason = () => {
    setPlanData((prev) => ({
      ...prev,
      reasonsToStay: [...prev.reasonsToStay, ""],
    }));
  };

  const updateContact = (index: number, field: keyof TrustedContact, val: string) => {
    setPlanData((prev) => {
      const updated = [...prev.trustedContacts];
      const target = updated[index] ?? { name: "", phoneOrLink: "" };
      updated[index] = { ...target, [field]: val };
      return { ...prev, trustedContacts: updated };
    });
  };

  const addContact = () => {
    setPlanData((prev) => ({
      ...prev,
      trustedContacts: [...prev.trustedContacts, { name: "", phoneOrLink: "" }],
    }));
  };

  const updateSafePlace = (index: number, val: string) => {
    setPlanData((prev) => {
      const updated = [...prev.safePlaces];
      updated[index] = val;
      return { ...prev, safePlaces: updated };
    });
  };

  const addSafePlace = () => {
    setPlanData((prev) => ({
      ...prev,
      safePlaces: [...prev.safePlaces, ""],
    }));
  };

  return (
    <Card className="w-full max-w-3xl mx-auto border-indigo-900/40 bg-slate-900/95 shadow-2xl backdrop-blur-xl">
      <CardHeader className="border-b border-slate-800/80 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-bold text-white">
                  My Anonymous Safety Plan
                </CardTitle>
                <Badge variant={hasEncryptedVault ? "teal" : "secondary"} className="text-[10px]">
                  {hasEncryptedVault ? "AES-256 Encrypted" : "Local Storage"}
                </Badge>
              </div>
              <CardDescription className="text-xs text-slate-400">
                100% Client-Side • Stored solely in your browser • Zero server knowledge
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePurge}
              title="Permanently obliterate all safety plan data"
              className="text-xs text-rose-300 hover:text-rose-200 border-rose-900/40 hover:bg-rose-950/40 gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge All Data</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {purgeSuccessNotice && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-600/40 text-xs text-rose-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>All local vault entries and cryptographic keys permanently obliterated.</span>
          </div>
        )}

        {saveSuccessNotice && (
          <div className="p-3.5 rounded-xl bg-teal-950/60 border border-teal-500/40 text-xs text-teal-200 flex items-center gap-2">
            <Check className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Safety plan securely saved directly to your browser.</span>
          </div>
        )}

        {/* Locked Vault Screen */}
        {isLocked ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4 max-w-sm mx-auto text-center">
            <div className="w-12 h-12 rounded-full bg-indigo-900/40 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-white">Safety Plan Vault Locked</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Enter your 4-digit PIN to decrypt and access your personal reasons to stay and trusted contacts.
              </p>
            </div>

            <div className="w-full space-y-2">
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                placeholder="4-digit PIN"
                className="w-full text-center tracking-[0.5em] font-mono text-xl bg-slate-950 border border-slate-700 rounded-xl py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {unlockError && (
                <p className="text-xs text-rose-400 font-medium">{unlockError}</p>
              )}
            </div>

            <div className="flex items-center gap-2 w-full">
              <Button
                variant="default"
                size="default"
                onClick={handleUnlock}
                disabled={pinInput.length < 4}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white gap-1.5"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Vault</span>
              </Button>
            </div>
          </div>
        ) : (
          /* Unlocked Vault Screen */
          <div className="space-y-6">
            {/* Section 1: Reasons to Hold On */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-teal-300">
                  <Heart className="w-4 h-4 text-teal-400" />
                  <span>3 Reasons to Hold On & Stay</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={addReason}
                  className="text-xs text-slate-400 hover:text-white gap-1 h-7"
                >
                  <Plus className="w-3 h-3" /> Add item
                </Button>
              </div>

              <div className="space-y-2">
                {planData.reasonsToStay.map((reason, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500 w-4">{idx + 1}.</span>
                    <input
                      type="text"
                      value={reason}
                      onChange={(e) => updateReason(idx, e.target.value)}
                      placeholder="e.g. My sibling, seeing tomorrow's ocean, finishing my art..."
                      className="flex-1 bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Trusted Contacts */}
            <div className="space-y-3 pt-4 border-t border-slate-800/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-indigo-300">
                  <Phone className="w-4 h-4 text-indigo-400" />
                  <span>People I Can Reach Out To</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={addContact}
                  className="text-xs text-slate-400 hover:text-white gap-1 h-7"
                >
                  <Plus className="w-3 h-3" /> Add contact
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {planData.trustedContacts.map((contact, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2"
                  >
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => updateContact(idx, "name", e.target.value)}
                      placeholder="Name or relationship"
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={contact.phoneOrLink}
                        onChange={(e) => updateContact(idx, "phoneOrLink", e.target.value)}
                        placeholder="Phone or handle"
                        className="flex-1 bg-slate-900 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      {contact.phoneOrLink && (
                        <a href={formatTelLink(contact.phoneOrLink)}>
                          <Button
                            variant="sanctuary"
                            size="sm"
                            className="h-7 px-2 text-xs text-teal-300"
                            title="Call contact"
                          >
                            <Phone className="w-3 h-3" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Safe Place / Soothing Ground */}
            <div className="space-y-3 pt-4 border-t border-slate-800/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
                  <Home className="w-4 h-4 text-emerald-400" />
                  <span>Safe Places & Soothing Actions</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={addSafePlace}
                  className="text-xs text-slate-400 hover:text-white gap-1 h-7"
                >
                  <Plus className="w-3 h-3" /> Add place
                </Button>
              </div>

              <div className="space-y-2">
                {planData.safePlaces.map((place, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500 w-4">{idx + 1}.</span>
                    <input
                      type="text"
                      value={place}
                      onChange={(e) => updateSafePlace(idx, e.target.value)}
                      placeholder="e.g. My bedroom wrapped in cozy blankets, quiet garden..."
                      className="flex-1 bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Client-Side Encryption PIN Security Setting */}
            <div className="pt-4 border-t border-slate-800/60 space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <KeyRound className="w-4 h-4 text-indigo-400" />
                  <span>Lock with 4-Digit Local PIN (Client-Side AES-256)</span>
                </div>
                <input
                  type="checkbox"
                  checked={enablePinEncryption}
                  onChange={(e) => setEnablePinEncryption(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded bg-slate-900 border-slate-700 focus:ring-indigo-500"
                />
              </div>

              {enablePinEncryption && (
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="password"
                    maxLength={4}
                    value={vaultPin}
                    onChange={(e) => setVaultPin(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 4-digit PIN"
                    className="w-40 text-center tracking-widest font-mono text-sm bg-slate-900 border border-slate-700 rounded-lg py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-[11px] text-slate-400">
                    Keys are derived via PBKDF2 directly in browser memory.
                  </span>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="default"
                size="default"
                onClick={handleSave}
                className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 px-6"
              >
                <Save className="w-4 h-4" />
                <span>Save Safety Plan</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
