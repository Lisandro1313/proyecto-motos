"use client";

import Image from "next/image";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { Camera, KeyRound, Save, X } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { readImageAsResizedDataUrl } from "@/lib/file-utils";

type ProfileSettingsModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ProfileSettingsModal({
  open,
  onClose,
}: ProfileSettingsModalProps) {
  const { activeProfile, updateProfile } = useAuth();
  const [photoPreview, setPhotoPreview] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  if (!open || !activeProfile) return null;

  async function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    setMessage("");
    setPhotoPreview(await readImageAsResizedDataUrl(file));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeProfile) return;

    const formData = new FormData(event.currentTarget);
    const nextPin = String(formData.get("pin") || "").trim();

    if (nextPin && !/^\d{4,6}$/.test(nextPin)) {
      setMessage("El PIN debe tener entre 4 y 6 números.");
      return;
    }

    if (!nextPin && !photoPreview) {
      setMessage("Cambiá la foto o el PIN para guardar.");
      return;
    }

    setSaving(true);
    const update: { pin?: string; photo?: string } = {};
    if (nextPin) update.pin = nextPin;
    if (photoPreview) update.photo = photoPreview;
    updateProfile(activeProfile.id, update);
    setSaving(false);
    setPhotoPreview("");
    setMessage("Listo, perfil actualizado.");
    event.currentTarget.reset();
  }

  const currentPhoto = photoPreview || activeProfile.photo;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-950">Mi perfil</h2>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div
            className="relative grid size-16 place-items-center overflow-hidden rounded-full text-lg font-bold text-white"
            style={{ backgroundColor: activeProfile.color }}
          >
            {currentPhoto ? (
              <Image
                src={currentPhoto}
                alt={activeProfile.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              activeProfile.name.slice(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <p className="font-semibold text-slate-950">{activeProfile.name}</p>
            <p className="text-sm text-slate-500">
              {activeProfile.role} · {activeProfile.branch}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block space-y-1.5">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
              <Camera className="size-4" /> Foto del perfil
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
              <KeyRound className="size-4" /> Nuevo PIN
            </span>
            <input
              name="pin"
              inputMode="numeric"
              maxLength={6}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#3f6f4d]"
              placeholder="Dejar vacío para mantener"
            />
          </label>

          {message ? (
            <p className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
              {message}
            </p>
          ) : null}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cerrar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#3f6f4d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#345f41] disabled:opacity-70"
            >
              <Save className="size-4" />
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
