// Illustrated mock-ups for projects that don't have a screenshot (private work, research tools).
// Pure CSS/SVG so they stay crisp and light. Picked by the project's category.

const Frame = ({ children, tint }) => (
  <div className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-linear-to-br ${tint} p-4`}>
    <div
      aria-hidden="true"
      className="absolute inset-0 opacity-[0.15]"
      style={{ backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)", backgroundSize: "18px 18px" }}
    />
    <div className="relative w-full max-w-md transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.02]">
      {children}
    </div>
  </div>
);

const WindowBar = ({ title }) => (
  <div className="flex items-center gap-1.5 border-b border-gray-100 px-3 py-2">
    <span className="h-2 w-2 rounded-full bg-red-300" />
    <span className="h-2 w-2 rounded-full bg-yellow-300" />
    <span className="h-2 w-2 rounded-full bg-green-300" />
    <span className="ml-2 text-[10px] font-medium text-gray-400">{title}</span>
  </div>
);

const KanbanMock = () => {
  const columns = [
    { name: "New", color: "bg-blue-500", cards: [70, 45, 60] },
    { name: "In progress", color: "bg-orange-500", cards: [55, 80] },
    { name: "Won", color: "bg-green-500", cards: [65, 40, 50] },
  ];
  return (
    <Frame tint="from-orange-50 to-amber-100 text-orange-500">
      <div className="rounded-xl bg-white shadow-lg ring-1 ring-black/5">
        <WindowBar title="WayPoint · Deals pipeline" />
        <div className="grid grid-cols-3 gap-2 p-3">
          {columns.map((col) => (
            <div key={col.name} className="rounded-lg bg-gray-50 p-2">
              <div className="mb-2 flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${col.color}`} />
                <span className="text-[10px] font-semibold text-gray-600">{col.name}</span>
              </div>
              <div className="space-y-1.5">
                {col.cards.map((w, i) => (
                  <div key={i} className="rounded-md bg-white p-1.5 shadow-sm ring-1 ring-black/5">
                    <div className="h-1.5 rounded-full bg-gray-200" style={{ width: `${w}%` }} />
                    <div className="mt-1 h-1 w-1/3 rounded-full bg-gray-100" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
};

const CandlestickMock = () => {
  // [open, close, high, low] in chart units (0 = top)
  const candles = [
    [60, 48, 42, 66], [48, 52, 44, 58], [52, 40, 36, 55], [40, 44, 34, 50], [44, 30, 26, 47],
    [30, 36, 24, 40], [36, 26, 20, 40], [26, 32, 22, 36], [32, 20, 14, 35], [20, 24, 12, 28],
    [24, 14, 10, 27], [14, 18, 8, 22],
  ];
  return (
    <Frame tint="from-purple-50 to-indigo-100 text-purple-500">
      <div className="rounded-xl bg-white shadow-lg ring-1 ring-black/5">
        <WindowBar title="EUR/USD · H1 · walk-forward test" />
        <div className="p-3">
          <svg viewBox="0 0 240 80" className="h-20 w-full" aria-hidden="true">
            {[20, 40, 60].map((y) => (
              <line key={y} x1="0" x2="240" y1={y} y2={y} stroke="#f3f4f6" />
            ))}
            {candles.map(([o, c, h, l], i) => {
              const x = 10 + i * 19;
              const up = c < o;
              const color = up ? "#16a34a" : "#ef4444";
              return (
                <g key={i}>
                  <line x1={x} x2={x} y1={h} y2={l} stroke={color} strokeWidth="1.2" />
                  <rect x={x - 4} y={Math.min(o, c)} width="8" height={Math.max(Math.abs(o - c), 2)} rx="1" fill={color} />
                </g>
              );
            })}
          </svg>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            {[
              ["Agents", "7"],
              ["Risk / trade", "1%"],
              ["Tests", "432"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-md bg-gray-50 py-1.5">
                <p className="text-xs font-bold text-gray-800">{value}</p>
                <p className="text-[9px] text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
};

const AgentMock = () => (
  <Frame tint="from-blue-50 to-sky-100 text-blue-500">
    <div className="rounded-xl bg-white shadow-lg ring-1 ring-black/5">
      <WindowBar title="Lead agent · MCP" />
      <div className="space-y-2 p-3">
        <div className="ml-auto w-fit max-w-[80%] rounded-lg rounded-br-sm bg-blue-600 px-2.5 py-1.5 text-[10px] text-white">
          Research SACCOs in Nakuru and score them
        </div>
        <div className="w-fit max-w-[85%] rounded-lg rounded-bl-sm bg-gray-100 px-2.5 py-1.5 text-[10px] text-gray-700">
          Found 17 SACCOs · cleaned duplicates · scored on 7 factors
        </div>
        <div className="rounded-lg border border-gray-200 p-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-gray-800">Example Sacco Ltd</span>
            <span className="rounded-full bg-green-100 px-1.5 py-0.5 text-[9px] font-semibold text-green-700">86 / 100</span>
          </div>
          <div className="mt-1.5 h-1.5 rounded-full bg-gray-100">
            <div className="h-1.5 w-[86%] rounded-full bg-green-500" />
          </div>
          <div className="mt-2 flex gap-1.5">
            <span className="rounded bg-blue-600 px-2 py-0.5 text-[9px] font-semibold text-white">Approve</span>
            <span className="rounded border border-gray-200 px-2 py-0.5 text-[9px] text-gray-600">Reject</span>
          </div>
        </div>
      </div>
    </div>
  </Frame>
);

const PhoneMock = () => (
  <Frame tint="from-purple-50 to-pink-100 text-purple-500">
    <div className="mx-auto w-36 rounded-[1.5rem] border-4 border-gray-800 bg-white p-2 shadow-xl">
      <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-gray-300" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="mb-1.5 flex gap-1.5 rounded-md bg-gray-50 p-1.5">
          <div className="h-7 w-7 rounded bg-purple-200" />
          <div className="flex-1 space-y-1 pt-0.5">
            <div className="h-1.5 w-3/4 rounded-full bg-gray-300" />
            <div className="h-1 w-1/2 rounded-full bg-gray-200" />
          </div>
        </div>
      ))}
      <div className="mt-2 rounded-md bg-purple-600 py-1 text-center text-[9px] font-semibold text-white">View</div>
    </div>
  </Frame>
);

const DashboardMock = () => (
  <Frame tint="from-green-50 to-emerald-100 text-green-500">
    <div className="rounded-xl bg-white shadow-lg ring-1 ring-black/5">
      <WindowBar title="Dashboard" />
      <div className="grid grid-cols-3 gap-2 p-3">
        {[
          ["Collected", "412k", "text-green-600"],
          ["Owed", "38k", "text-orange-600"],
          ["Units", "23/24", "text-gray-800"],
        ].map(([label, value, color]) => (
          <div key={label} className="rounded-md bg-gray-50 p-2">
            <p className="text-[9px] text-gray-500">{label}</p>
            <p className={`text-xs font-bold ${color}`}>{value}</p>
          </div>
        ))}
        <div className="col-span-3 flex h-16 items-end gap-1.5 rounded-md bg-gray-50 p-2">
          {[40, 65, 50, 80, 60, 90, 75].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm bg-green-400" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  </Frame>
);

const BrowserMock = () => (
  <Frame tint="from-blue-50 to-cyan-100 text-blue-500">
    <div className="rounded-xl bg-white shadow-lg ring-1 ring-black/5">
      <WindowBar title="website" />
      <div className="space-y-2 p-3">
        <div className="h-16 rounded-md bg-linear-to-r from-blue-100 to-cyan-100" />
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-10 rounded-md bg-gray-100" />
          ))}
        </div>
      </div>
    </div>
  </Frame>
);

export default function ProjectVisual({ category = "" }) {
  const c = category.toLowerCase();
  if (c.includes("work")) return <KanbanMock />;
  if (c.includes("research")) return <CandlestickMock />;
  if (c.includes("ai")) return <AgentMock />;
  if (c.includes("mobile")) return <PhoneMock />;
  if (c.includes("fintech")) return <DashboardMock />;
  return <BrowserMock />;
}
