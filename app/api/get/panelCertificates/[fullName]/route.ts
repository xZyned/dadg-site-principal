import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import CertificateModel from "@/app/lib/models/CertificateModel";

export const dynamic = "force-dynamic";

const DIACRITIC_GROUPS: Record<string, string> = {
  a: "aáàâãäåāăą",
  c: "cçćč",
  e: "eéèêëēĕėęě",
  i: "iíìîïīĭį",
  n: "nñń",
  o: "oóòôõöōŏő",
  u: "uúùûüūŭůűų",
  y: "yýÿ",
};

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function buildOwnerNamePattern(fullName: string) {
  const normalizedName = fullName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ");

  return normalizedName
    .split("")
    .map((character) => {
      if (/\s/.test(character)) return "\\s+";

      const group = DIACRITIC_GROUPS[character.toLowerCase()];
      if (group) return `[${group}]`;

      return escapeRegex(character);
    })
    .join("");
}

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ fullName: string }>;
  }
) {
  const { fullName } = await params;
  const decodedFullName = safeDecode(fullName).trim().replace(/\s+/g, " ");

  if (decodedFullName.length < 3 || decodedFullName.length > 120) {
    return NextResponse.json({ message: "Informe um nome completo valido." }, { status: 400 });
  }

  await connectToDatabase();

  const certificates = await CertificateModel.find({
    isReady: true,
    ownerName: {
      $regex: buildOwnerNamePattern(decodedFullName),
      $options: "i",
    },
  })
    .select("_id ownerName eventName certificateHours createdAt updatedAt")
    .sort({ createdAt: -1 })
    .lean();

  if (certificates.length === 0) {
    return NextResponse.json({ message: "Nenhum certificado encontrado." }, { status: 404 });
  }

  return NextResponse.json({ data: certificates });
}
