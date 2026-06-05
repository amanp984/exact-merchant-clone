import logoAsset from "@/assets/paytmm-lite-logo.png.asset.json";

export function Logo({ className = "h-9 w-auto" }: { className?: string }) {
  return <img src={logoAsset.url} alt="PAYTMM LITE for Business" className={className} />;
}

export const LOGO_URL = logoAsset.url;
