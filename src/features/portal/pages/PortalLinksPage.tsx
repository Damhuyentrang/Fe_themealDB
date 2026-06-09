import { useState } from 'react';
import { usePortalAuthStore } from '../stores/portalAuth.store';

const BASE_URL = 'https://shop.example.com';

interface ReferralLink {
  id: string;
  name: string;
  slug: string;
  clicks: number;
  orders: number;
  earned: number;
  createdAt: string;
}

const INITIAL_LINKS: ReferralLink[] = [
  { id: 'l1', name: 'Link mặc định',     slug: '',           clicks: 247, orders: 38, earned: 3_200_000, createdAt: '2026-01-15' },
  { id: 'l2', name: 'Campaign Tết 2026', slug: 'tet2026',    clicks: 65,  orders: 9,  earned: 1_050_000, createdAt: '2026-01-20' },
];

function fmt(n: number) {
  return n.toLocaleString('vi-VN') + '₫';
}

export default function PortalLinksPage() {
  const { member } = usePortalAuthStore();
  const [links, setLinks] = useState<ReferralLink[]>(INITIAL_LINKS);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');

  const buildUrl = (link: ReferralLink) => {
    const base = `${BASE_URL}?ref=${member?.referralCode}`;
    return link.slug ? `${base}&c=${link.slug}` : base;
  };

  const copyLink = (link: ReferralLink) => {
    navigator.clipboard.writeText(buildUrl(link));
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    const link: ReferralLink = {
      id: `l${Date.now()}`,
      name: newName.trim(),
      slug: newSlug.trim().toLowerCase().replace(/\s+/g, '-'),
      clicks: 0, orders: 0, earned: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setLinks((prev) => [...prev, link]);
    setNewName('');
    setNewSlug('');
    setShowCreate(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Link & Mã giới thiệu</h1>
          <p className="text-sm text-gray-500 mt-0.5">Mã giới thiệu của bạn: <strong className="text-gray-700 font-mono">{member?.referralCode}</strong></p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Tạo link mới
        </button>
      </div>

      {/* Referral code card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-5 text-white">
        <p className="text-sm opacity-80 mb-1">Mã giới thiệu của bạn</p>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold tracking-widest font-mono">{member?.referralCode}</span>
          <button
            onClick={() => { navigator.clipboard.writeText(member?.referralCode ?? ''); }}
            className="text-xs bg-white/20 hover:bg-white/30 border border-white/30 rounded-md px-2.5 py-1 transition-colors"
          >
            Sao chép
          </button>
        </div>
        <p className="text-xs opacity-70 mt-2">Khách hàng nhập mã này khi thanh toán để bạn nhận hoa hồng</p>
      </div>

      {/* Create link form */}
      {showCreate && (
        <div className="bg-white border border-blue-200 rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-800">Tạo link mới</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Tên link <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="VD: Campaign hè 2026"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Slug (tùy chọn)</label>
              <input
                type="text"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                placeholder="VD: he2026"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
            </div>
          </div>
          {(newName || newSlug) && (
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <p className="text-xs text-gray-400 mb-0.5">Preview:</p>
              <p className="text-xs font-mono text-gray-700 break-all">
                {BASE_URL}?ref={member?.referralCode}{newSlug ? `&c=${newSlug.toLowerCase()}` : ''}
              </p>
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={!newName.trim()}
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Tạo link
            </button>
            <button
              onClick={() => { setShowCreate(false); setNewName(''); setNewSlug(''); }}
              className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg border border-gray-200 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Links table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800">Danh sách link ({links.length})</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {links.map((link) => {
            const url = buildUrl(link);
            const convRate = link.clicks > 0 ? ((link.orders / link.clicks) * 100).toFixed(1) : '0.0';
            return (
              <div key={link.id} className="px-4 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-800 text-sm">{link.name}</span>
                      {link.id === 'l1' && (
                        <span className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-0.5 rounded-full">Mặc định</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-3 py-1.5 w-fit">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 shrink-0"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                      <span className="text-xs font-mono text-gray-600 truncate max-w-xs">{url}</span>
                      <button
                        onClick={() => copyLink(link)}
                        className="ml-1 text-xs text-blue-500 hover:text-blue-700 font-medium whitespace-nowrap"
                      >
                        {copiedId === link.id ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0 text-right">
                    <div>
                      <p className="text-base font-semibold text-gray-900">{link.clicks}</p>
                      <p className="text-xs text-gray-400">Lượt click</p>
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900">{link.orders}</p>
                      <p className="text-xs text-gray-400">Đơn hàng</p>
                    </div>
                    <div>
                      <p className="text-base font-semibold text-green-600">{convRate}%</p>
                      <p className="text-xs text-gray-400">Chuyển đổi</p>
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900">{fmt(link.earned)}</p>
                      <p className="text-xs text-gray-400">Hoa hồng</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">Tạo ngày {link.createdAt}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
