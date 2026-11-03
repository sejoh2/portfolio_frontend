import { useState } from "react";
import { Bot, MapPin, Smartphone, Wallet } from "lucide-react";

const FloatingBadge = ({ Icon, tint, label, sub, className }) => (
  <div
    className={`absolute z-10 hidden items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-gray-800 shadow-lg ring-1 ring-black/5 lg:flex ${className}`}
  >
    <span className={`grid h-7 w-7 place-items-center rounded-lg ${tint}`}>
      <Icon className="w-4 h-4" />
    </span>
    <span>
      {label}
      {sub && <span className="block text-[10px] font-medium text-gray-500">{sub}</span>}
    </span>
  </div>
);

// "Live" card linking to Kodi on Render, with a pulsing status dot.
const LiveProjectBadge = ({ href }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="absolute -right-8 top-[58%] z-10 hidden items-center gap-2.5 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-gray-800 shadow-lg ring-1 ring-black/5 transition hover:ring-orange-300 animate-float lg:flex"
  >
    <span className="relative flex h-2.5 w-2.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
    </span>
    <span>
      Kodi is live
      <span className="block text-[10px] font-medium text-gray-500">4 apps on Render</span>
    </span>
  </a>
);

const Badges = ({ liveUrl }) => (
  <>
    <FloatingBadge Icon={Wallet} tint="bg-green-50 text-green-600" label="M-Pesa payments" className="-left-6 -top-5 animate-float" />
    <FloatingBadge Icon={Bot} tint="bg-blue-50 text-blue-600" label="AI agents" sub="MCP · Gemini" className="-right-6 top-[30%] animate-float-delayed" />
    {liveUrl && <LiveProjectBadge href={liveUrl} />}
    <FloatingBadge Icon={Smartphone} tint="bg-purple-50 text-purple-600" label="Flutter apps" className="-right-3 -bottom-4 animate-float" />
  </>
);

// Hero right side: your photo with a "currently" card, or a profile card when no photo is available.
const HeroVisual = ({ profile, photo, photoCaption, currentJob, initials, liveUrl }) => {
  const [photoFailed, setPhotoFailed] = useState(false);
  const showPhoto = photo && !photoFailed;

  if (showPhoto) {
    return (
      <div className="relative mx-auto max-w-xl lg:max-w-none">
        <Badges liveUrl={liveUrl} />
        <figure className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-2 shadow-xl">
          <img
            src={photo}
            alt={photoCaption || profile.full_name}
            onError={() => setPhotoFailed(true)}
            className="aspect-[16/10] w-full rounded-2xl object-cover object-top"
          />
          {photoCaption && (
            <figcaption className="absolute right-5 top-5 rounded-full bg-black/55 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
              {photoCaption}
            </figcaption>
          )}
        </figure>

        {currentJob && (
          <div className="absolute -bottom-8 left-6 right-16 z-10 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:right-auto sm:max-w-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Currently</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{currentJob.role}</p>
            <p className="text-sm font-semibold text-blue-600">{currentJob.company}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-xl lg:max-w-none">
      <Badges liveUrl={liveUrl} />
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-orange-500 text-xl font-bold text-white">{initials}</span>
          <div>
            <p className="text-lg font-semibold text-gray-900">{profile.full_name}</p>
            <p className="flex items-center gap-1.5 text-sm text-gray-500">
              <MapPin className="w-3.5 h-3.5" /> {profile.location}
            </p>
          </div>
        </div>
        {currentJob && (
          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Currently</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{currentJob.role}</p>
            <p className="text-sm font-semibold text-blue-600">{currentJob.company}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroVisual;
