"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Lock, Eye, Copy, Check, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


export default function SecretSharing() {
  const [secret, setSecret] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [decryptedSecret, setDecryptedSecret] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  useEffect(() => {
    // Check if there is a hash fragment on load to decrypt
    if (typeof window !== "undefined" && window.location.hash) {
      setIsViewing(true);
      decryptSecretFromHash(window.location.hash.substring(1));
    }
  }, []);

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const base64ToArrayBuffer = (base64: string) => {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const generateSecretLink = async () => {
    if (!secret.trim()) return;
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(secret);

      const key = await window.crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );

      const iv = window.crypto.getRandomValues(new Uint8Array(12));

      const encrypted = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        data
      );

      const exportedKey = await window.crypto.subtle.exportKey("raw", key);

      // Pack into hash: base64(iv) | base64(key) | base64(encrypted)
      const ivB64 = arrayBufferToBase64(iv.buffer);
      const keyB64 = arrayBufferToBase64(exportedKey);
      const dataB64 = arrayBufferToBase64(encrypted);
      
      const payload = encodeURIComponent(`${ivB64}|${keyB64}|${dataB64}`);
      
      const url = new URL(window.location.href);
      url.hash = payload;
      setShareUrl(url.toString());
      setSecret(""); // clear it
    } catch (e) {
      console.error(e);
      setErrorMsg("Encryption failed. Your browser might not support Web Crypto.");
    }
  };

  const decryptSecretFromHash = async (hashPayload: string) => {
    try {
      const decodedPayload = decodeURIComponent(hashPayload);
      const parts = decodedPayload.split("|");
      if (parts.length !== 3) throw new Error("Invalid payload format");

      const iv = base64ToArrayBuffer(parts[0]);
      const rawKey = base64ToArrayBuffer(parts[1]);
      const encryptedData = base64ToArrayBuffer(parts[2]);

      const key = await window.crypto.subtle.importKey(
        "raw",
        rawKey,
        { name: "AES-GCM" },
        false,
        ["decrypt"]
      );

      const decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: new Uint8Array(iv) },
        key,
        encryptedData
      );

      const decoder = new TextDecoder();
      setDecryptedSecret(decoder.decode(decrypted));
      // Optionally clear the hash from the URL so it's not accidentally shared again
      window.history.replaceState(null, "", window.location.pathname);
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to decrypt the secret. The link may be broken or modified.");
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isViewing) {
    return (
      <ToolLayout id="view-secret" name="View Secret" description="Decrypting the secret passed in the secure URL fragment.">
        <div className="bg-bg-panel border border-border-line rounded-xl p-8 max-w-2xl mx-auto text-center">
          {errorMsg ? (
            <div className="text-accent-danger font-mono mb-4">{errorMsg}</div>
          ) : decryptedSecret ? (
            <>
              <ShieldAlert className="w-12 h-12 text-accent-secondary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-4">Secret Decrypted</h3>
              <p className="text-sm text-text-muted mb-6">The URL fragment has been cleared. Copy this secret now, it will be gone if you refresh.</p>
              <Textarea
                readOnly
                value={decryptedSecret}
                className="w-full bg-bg-panel border border-border-line rounded-lg p-4 font-mono text-white min-h-[150px] outline-none"
              />
            </>
          ) : (
            <div className="text-text-muted animate-pulse font-mono">Decrypting locally...</div>
          )}
          <div className="mt-8">
            <button 
              onClick={() => { setIsViewing(false); setDecryptedSecret(""); setErrorMsg(""); }}
              className="text-accent-primary hover:text-white transition-colors"
            >
              Create a new secret
            </button>
          </div>
        </div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout id="secure-secret-sharing" name="Secure Secret Sharing" description="Encrypt a message into a URL fragment. The encryption key is in the URL hash, which never hits the server.">
      <div className="max-w-2xl mx-auto">
        <div className="bg-accent-primary/10 border border-accent-primary/20 text-accent-primary p-4 rounded-lg mb-6 text-sm">
          <strong>How this works:</strong> Your text is encrypted locally using AES-256-GCM. The key and encrypted data are embedded directly into the URL after the <code>#</code> symbol. Because browsers never send the URL hash to the server, we have zero knowledge of your secret.
        </div>

        <div className="bg-bg-panel border border-border-line rounded-xl overflow-hidden mb-6">
          <div className="px-4 py-2 border-b border-border-line font-mono text-xs text-text-muted bg-bg-panel">
            Secret Content
          </div>
          <Textarea
            className="w-full bg-transparent p-4 outline-none font-mono text-sm resize-y min-h-[200px]"
            placeholder="Type your sensitive API key, password, or message here..."
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            spellCheck={false}
          />
        </div>

        <button
          onClick={generateSecretLink}
          disabled={!secret.trim()}
          className="w-full bg-accent-primary text-black font-bold px-6 py-4 rounded-lg hover:bg-accent-primary/90 transition-colors disabled:opacity-50"
        >
          Encrypt & Generate Link
        </button>

        {shareUrl && (
          <div className="mt-8 bg-bg-panel border border-border-line rounded-xl p-6">
            <h4 className="font-semibold mb-4 text-accent-secondary flex items-center gap-2">
              <Check className="w-5 h-5" /> Secret Encrypted Successfully
            </h4>
            <div className="flex gap-2">
              <Input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-black/60 border border-border-line rounded-lg p-3 font-mono text-xs text-text-muted outline-none"
              />
              <button
                onClick={handleCopyUrl}
                className="bg-bg-panel border border-border-line px-4 rounded-lg hover:border-accent-primary hover:text-white transition-colors flex items-center justify-center min-w-[100px]"
              >
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
            <p className="mt-4 text-xs text-faint font-mono">
              Share this link securely. Anyone with this exact link can read the secret.
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}