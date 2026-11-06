import React, { useMemo, useState } from 'react';
import {
  MdAdd,
  MdArrowDownward,
  MdArrowUpward,
  MdBolt,
  MdBusiness,
  MdChevronRight,
  MdClose,
  MdCloud,
  MdFilterList,
  MdLocationOn,
  MdSearch,
  MdSouthAmerica,
  MdStorage,
  MdPublic,
  MdWbSunny,
} from 'react-icons/md';

type FacilityStatus = 'Operational' | 'Under construction' | 'Planned';
type DataCenter = {
  id: string;
  name: string;
  operator: string;
  city: string;
  country: string;
  region: string;
  status: FacilityStatus;
  itCapacityMW: number;
  pue: number;
  onsiteGenerationMW: number;
  energyMix: string;
  updated: string;
};

// Illustrative starter records, not a census or verified live data. Replace or augment
// these records with sourced facility data before using the dashboard for reporting.
const starterFacilities: DataCenter[] = [
  { id: 'dc-001', name: 'Ashburn Campus', operator: 'CloudCore', city: 'Ashburn, VA', country: 'United States', region: 'North America', status: 'Operational', itCapacityMW: 180, pue: 1.28, onsiteGenerationMW: 12, energyMix: 'Grid + solar', updated: '2026-10-28' },
  { id: 'dc-002', name: 'Hillsboro Technology Park', operator: 'Northstar Cloud', city: 'Hillsboro, OR', country: 'United States', region: 'North America', status: 'Operational', itCapacityMW: 96, pue: 1.31, onsiteGenerationMW: 8, energyMix: 'Grid + wind PPA', updated: '2026-10-25' },
  { id: 'dc-003', name: 'Frankfurt West', operator: 'EuroStack', city: 'Frankfurt', country: 'Germany', region: 'Europe', status: 'Operational', itCapacityMW: 72, pue: 1.35, onsiteGenerationMW: 4, energyMix: 'Grid + solar', updated: '2026-10-21' },
  { id: 'dc-004', name: 'Singapore One-North', operator: 'CloudCore', city: 'Singapore', country: 'Singapore', region: 'Asia Pacific', status: 'Under construction', itCapacityMW: 64, pue: 1.38, onsiteGenerationMW: 0, energyMix: 'Grid', updated: '2026-10-19' },
  { id: 'dc-005', name: 'Tokyo West', operator: 'Sakura Compute', city: 'Tokyo', country: 'Japan', region: 'Asia Pacific', status: 'Operational', itCapacityMW: 48, pue: 1.42, onsiteGenerationMW: 2, energyMix: 'Grid + solar', updated: '2026-10-16' },
  { id: 'dc-006', name: 'Querétaro Digital Hub', operator: 'LatAm Data Co.', city: 'Querétaro', country: 'Mexico', region: 'Latin America', status: 'Planned', itCapacityMW: 36, pue: 1.40, onsiteGenerationMW: 6, energyMix: 'Grid + solar', updated: '2026-10-12' },
  { id: 'dc-007', name: 'Johannesburg North', operator: 'AfricaCloud', city: 'Johannesburg', country: 'South Africa', region: 'Africa', status: 'Operational', itCapacityMW: 22, pue: 1.48, onsiteGenerationMW: 3, energyMix: 'Grid + solar', updated: '2026-10-08' },
  { id: 'dc-008', name: 'Dublin South', operator: 'EuroStack', city: 'Dublin', country: 'Ireland', region: 'Europe', status: 'Operational', itCapacityMW: 54, pue: 1.32, onsiteGenerationMW: 1, energyMix: 'Grid + wind PPA', updated: '2026-10-02' },
  { id: 'dc-009', name: 'Santiago Andes', operator: 'LatAm Data Co.', city: 'Santiago', country: 'Chile', region: 'Latin America', status: 'Operational', itCapacityMW: 18, pue: 1.45, onsiteGenerationMW: 2, energyMix: 'Grid + solar', updated: '2026-09-27' },
];

const regions = ['All regions', 'North America', 'Europe', 'Asia Pacific', 'Latin America', 'Africa', 'Middle East'];
const statusOptions: FacilityStatus[] = ['Operational', 'Under construction', 'Planned'];
const cx = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ');
const annualEnergy = (facility: DataCenter) => facility.itCapacityMW * facility.pue * 8.76;
const formatNumber = (value: number, maximumFractionDigits = 0) => new Intl.NumberFormat('en-US', { maximumFractionDigits }).format(value);

function loadFacilities(): DataCenter[] {
  try {
    const saved = localStorage.getItem('data-centers-tracker-facilities');
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed as DataCenter[];
    }
  } catch {
    // Ignore unavailable or malformed browser storage and use the sample inventory.
  }
  return starterFacilities;
}

const Dashboard: React.FC = () => {
  const [facilities, setFacilities] = useState<DataCenter[]>(loadFacilities);
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('All regions');
  const [status, setStatus] = useState('All statuses');
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({ name: '', operator: '', city: '', country: '', region: 'North America', status: 'Operational' as FacilityStatus, itCapacityMW: '', pue: '1.35', onsiteGenerationMW: '0', energyMix: 'Grid' });

  const filteredFacilities = useMemo(() => facilities.filter((facility) => {
    const matchesQuery = [facility.name, facility.operator, facility.city, facility.country].join(' ').toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (region === 'All regions' || facility.region === region) && (status === 'All statuses' || facility.status === status);
  }), [facilities, query, region, status]);

  const operational = facilities.filter((facility) => facility.status === 'Operational');
  const capacity = operational.reduce((sum, facility) => sum + facility.itCapacityMW, 0);
  const annualDemand = operational.reduce((sum, facility) => sum + annualEnergy(facility), 0);
  const generation = operational.reduce((sum, facility) => sum + facility.onsiteGenerationMW, 0);
  const companies = new Set(facilities.map((facility) => facility.operator)).size;
  const regionSummary = regions.slice(1).map((name) => ({
    name,
    count: facilities.filter((facility) => facility.region === name).length,
    capacity: facilities.filter((facility) => facility.region === name && facility.status === 'Operational').reduce((sum, facility) => sum + facility.itCapacityMW, 0),
  }));
  const maxCapacity = Math.max(...regionSummary.map((item) => item.capacity), 1);

  const saveFacility = (event: React.FormEvent) => {
    event.preventDefault();
    const itCapacityMW = Number(form.itCapacityMW);
    const pue = Number(form.pue);
    const onsiteGenerationMW = Number(form.onsiteGenerationMW);
    if (!form.name.trim() || !form.operator.trim() || !form.city.trim() || !form.country.trim() || itCapacityMW <= 0 || pue < 1 || onsiteGenerationMW < 0) {
      setFormError('Add the required facility details and use valid capacity, PUE (at least 1.0), and generation values.');
      return;
    }
    const next = [{
      id: `dc-${Date.now()}`, name: form.name.trim(), operator: form.operator.trim(), city: form.city.trim(), country: form.country.trim(), region: form.region,
      status: form.status, itCapacityMW, pue, onsiteGenerationMW, energyMix: form.energyMix.trim() || 'Not reported', updated: new Date().toISOString().slice(0, 10),
    }, ...facilities];
    setFacilities(next);
    try { localStorage.setItem('data-centers-tracker-facilities', JSON.stringify(next)); } catch { /* The new row remains available for this session. */ }
    setForm({ name: '', operator: '', city: '', country: '', region: 'North America', status: 'Operational', itCapacityMW: '', pue: '1.35', onsiteGenerationMW: '0', energyMix: 'Grid' });
    setFormError('');
    setShowForm(false);
  };

  return (
    <div className="mx-auto max-w-[1500px] space-y-7 pb-10">
      <section className="flex flex-col justify-between gap-5 rounded-2xl bg-[#102c2a] px-7 py-7 text-white md:flex-row md:items-end md:px-9">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-emerald-100"><MdPublic /> GLOBAL INFRASTRUCTURE INDEX</div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Data centers, in perspective.</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-100/75">Explore facilities, operators and power footprints across the world. The starter inventory is illustrative—not a verified global census.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#c4f06b] px-4 py-3 text-sm font-semibold text-[#16332c] transition hover:bg-[#d2f58e]"><MdAdd size={20} /> Add a facility</button>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={<MdStorage />} label="Tracked facilities" value={formatNumber(facilities.length)} note={`${operational.length} operational`} accent="green" />
        <Metric icon={<MdBolt />} label="Operational IT capacity" value={`${formatNumber(capacity)} MW`} note="Nameplate capacity in tracked records" accent="blue" />
        <Metric icon={<MdCloud />} label="Est. annual energy demand" value={`${formatNumber(annualDemand / 1000, 2)} TWh`} note="Operational · capacity × PUE × 8,760 h" accent="amber" />
        <Metric icon={<MdWbSunny />} label="On-site generation" value={`${formatNumber(generation)} MW`} note={`${companies} operators represented · operational sites`} accent="purple" />
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.05fr_1.95fr]">
        <div className="rounded-2xl border border-[#e5e9e4] bg-white p-6">
          <div className="flex items-start justify-between"><div><h2 className="font-semibold text-[#18332f]">Regional footprint</h2><p className="mt-1 text-xs text-slate-500">Tracked sites and operational IT capacity</p></div><MdSouthAmerica className="text-xl text-[#79938b]" /></div>
          <div className="mt-6 space-y-5">
            {regionSummary.map((item) => <div key={item.name}>
              <div className="mb-2 flex items-center justify-between gap-2 text-xs"><span className="font-medium text-slate-700">{item.name}</span><span className="text-slate-500">{item.count} sites <span className="mx-1 text-slate-300">·</span>{formatNumber(item.capacity)} MW</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-[#eef2ed]"><div className="h-full rounded-full bg-[#568a70]" style={{ width: `${Math.max(item.capacity ? 5 : 0, item.capacity / maxCapacity * 100)}%` }} /></div>
            </div>)}
          </div>
          <div className="mt-6 rounded-xl bg-[#f3f7f2] p-4"><div className="flex items-center gap-2 text-sm font-medium text-[#234c3d]"><MdLocationOn /> Location coverage</div><p className="mt-1 text-xs leading-5 text-slate-500">Filter the facility list by region, operator, city or country. Regional totals reflect only records in this tracker.</p></div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#e5e9e4] bg-white">
          <div className="flex flex-col justify-between gap-4 border-b border-[#edf0eb] p-6 sm:flex-row sm:items-center">
            <div><h2 className="font-semibold text-[#18332f]">Facility inventory</h2><p className="mt-1 text-xs text-slate-500">Consumption estimates use IT capacity × PUE × annual hours.</p></div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative"><span className="sr-only">Search facilities</span><MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search facilities…" className="w-full rounded-lg border border-[#e3e8e2] bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[#6b9b7d] sm:w-48" /></label>
              <label className="relative"><MdFilterList className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" /><select aria-label="Filter by region" value={region} onChange={(event) => setRegion(event.target.value)} className="w-full appearance-none rounded-lg border border-[#e3e8e2] bg-white py-2 pl-8 pr-7 text-sm text-slate-700 outline-none focus:border-[#6b9b7d] sm:w-40">{regions.map((item) => <option key={item}>{item}</option>)}</select></label>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto px-6 pt-4">
            {['All statuses', ...statusOptions].map((item) => <button key={item} onClick={() => setStatus(item)} className={cx('whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition', status === item ? 'bg-[#183e35] text-white' : 'bg-[#f3f5f2] text-slate-600 hover:bg-[#e8eee8]')}>{item}</button>)}
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead><tr className="border-y border-[#edf0eb] bg-[#fafbf9] text-[10px] uppercase tracking-[0.12em] text-slate-400"><th className="px-6 py-3 font-medium">Facility / operator</th><th className="px-4 py-3 font-medium">Location</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 text-right font-medium">IT load</th><th className="px-4 py-3 text-right font-medium">Est. demand / yr</th><th className="px-6 py-3 text-right font-medium">Generation</th></tr></thead>
              <tbody className="divide-y divide-[#f0f2ef]">
                {filteredFacilities.map((facility) => <tr key={facility.id} className="transition hover:bg-[#fbfcfa]">
                  <td className="px-6 py-4"><div className="font-medium text-[#18332f]">{facility.name}</div><div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><MdBusiness className="text-sm" />{facility.operator}</div></td>
                  <td className="px-4 py-4"><div className="text-sm text-slate-700">{facility.city}, {facility.country}</div><div className="mt-1 text-xs text-slate-400">{facility.region}</div></td>
                  <td className="px-4 py-4"><span className={cx('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium', facility.status === 'Operational' ? 'bg-[#eaf5ed] text-[#37734d]' : facility.status === 'Under construction' ? 'bg-[#fff4df] text-[#9a6a15]' : 'bg-[#edf0f5] text-[#66748b]')}><span className="h-1.5 w-1.5 rounded-full bg-current" />{facility.status}</span></td>
                  <td className="px-4 py-4 text-right text-sm font-medium tabular-nums text-slate-700">{formatNumber(facility.itCapacityMW)} MW</td>
                  <td className="px-4 py-4 text-right text-sm tabular-nums text-slate-700">{facility.status === 'Operational' ? `${formatNumber(annualEnergy(facility), 0)} GWh` : '—'}</td>
                  <td className="px-6 py-4 text-right"><div className="text-sm tabular-nums text-slate-700">{formatNumber(facility.onsiteGenerationMW)} MW</div><div className="mt-1 text-[10px] text-slate-400">{facility.energyMix}</div></td>
                </tr>)}
                {filteredFacilities.length === 0 && <tr><td colSpan={6} className="px-6 py-12 text-center"><div className="font-medium text-slate-600">No facilities match those filters</div><p className="mt-1 text-sm text-slate-400">Try another search or add a facility to the inventory.</p></td></tr>}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-[#edf0eb] px-6 py-3 text-xs text-slate-400"><span>Showing {filteredFacilities.length} of {facilities.length} facilities</span><span className="inline-flex items-center gap-1">Updated from tracked records <MdChevronRight /></span></div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <InfoCard icon={<MdArrowDownward />} title="Energy demand" value="Estimated, not metered" description="Annual facility energy is calculated from IT load and PUE. Reported totals exclude planned and construction projects." />
        <InfoCard icon={<MdArrowUpward />} title="Power generation" value="On-site nameplate capacity" description="Generation values describe reported on-site capacity; they are not annual output or a measure of renewable procurement." />
        <InfoCard icon={<MdPublic />} title="Coverage & confidence" value="Curated inventory" description="There is no implied worldwide facility count here. Add source links and verification dates as the dataset grows." />
      </section>

      {showForm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10221f]/55 p-4" role="dialog" aria-modal="true" aria-labelledby="add-facility-title">
        <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5"><div><h2 id="add-facility-title" className="text-lg font-semibold text-[#18332f]">Add a data center</h2><p className="mt-1 text-xs text-slate-500">Create a local inventory record. Values are saved in this browser.</p></div><button onClick={() => { setShowForm(false); setFormError(''); }} aria-label="Close form" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><MdClose size={20} /></button></div>
          <form onSubmit={saveFacility} className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <FormInput label="Facility name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required />
            <FormInput label="Owner / operator" value={form.operator} onChange={(value) => setForm({ ...form, operator: value })} required />
            <FormInput label="City / metro" value={form.city} onChange={(value) => setForm({ ...form, city: value })} required />
            <FormInput label="Country" value={form.country} onChange={(value) => setForm({ ...form, country: value })} required />
            <label className="text-xs font-medium text-slate-600">Region<select value={form.region} onChange={(event) => setForm({ ...form, region: event.target.value })} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-[#6b9b7d]">{regions.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="text-xs font-medium text-slate-600">Project status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as FacilityStatus })} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-[#6b9b7d]">{statusOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
            <FormInput label="IT capacity (MW)" type="number" min="0.1" step="0.1" value={form.itCapacityMW} onChange={(value) => setForm({ ...form, itCapacityMW: value })} required />
            <FormInput label="PUE" type="number" min="1" step="0.01" value={form.pue} onChange={(value) => setForm({ ...form, pue: value })} required />
            <FormInput label="On-site generation capacity (MW)" type="number" min="0" step="0.1" value={form.onsiteGenerationMW} onChange={(value) => setForm({ ...form, onsiteGenerationMW: value })} required />
            <FormInput label="Energy mix / notes" value={form.energyMix} onChange={(value) => setForm({ ...form, energyMix: value })} />
            {formError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 sm:col-span-2">{formError}</p>}
            <div className="flex justify-end gap-3 pt-2 sm:col-span-2"><button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button><button type="submit" className="rounded-lg bg-[#183e35] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#245345]">Save facility</button></div>
          </form>
        </div>
      </div>}
    </div>
  );
};

const Metric: React.FC<{ icon: React.ReactNode; label: string; value: string; note: string; accent: string }> = ({ icon, label, value, note, accent }) => {
  const colors: Record<string, string> = { green: 'bg-[#eaf5ed] text-[#4c8660]', blue: 'bg-[#e9f1f8] text-[#4f7896]', amber: 'bg-[#fff4df] text-[#ad7c2d]', purple: 'bg-[#f0ecf7] text-[#7a6799]' };
  return <div className="rounded-2xl border border-[#e5e9e4] bg-white p-5"><div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">{label}</span><span className={cx('flex h-9 w-9 items-center justify-center rounded-xl text-xl', colors[accent])}>{icon}</span></div><div className="mt-4 text-2xl font-semibold tracking-tight text-[#18332f]">{value}</div><div className="mt-1 text-[11px] text-slate-400">{note}</div></div>;
};

const InfoCard: React.FC<{ icon: React.ReactNode; title: string; value: string; description: string }> = ({ icon, title, value, description }) => <div className="rounded-xl border border-[#e5e9e4] bg-white p-5"><div className="flex items-center gap-2 text-xs font-medium text-[#518168]">{icon}{title}</div><div className="mt-3 text-sm font-semibold text-[#18332f]">{value}</div><p className="mt-1 text-xs leading-5 text-slate-500">{description}</p></div>;

const FormInput: React.FC<{ label: string; value: string; onChange: (value: string) => void; type?: string; min?: string; step?: string; required?: boolean }> = ({ label, value, onChange, type = 'text', min, step, required }) => <label className="text-xs font-medium text-slate-600">{label}<input type={type} min={min} step={step} value={value} onChange={(event) => onChange(event.target.value)} required={required} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-[#6b9b7d]" /></label>;

export default Dashboard;
