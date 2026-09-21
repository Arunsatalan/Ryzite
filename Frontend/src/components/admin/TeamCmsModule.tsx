import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Edit3,
  Search,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Linkedin,
  Github,
  Tag,
  Code,
  Globe,
  X,
  RefreshCw,
  ShieldAlert,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { LeadershipTeamMemberItem, StatisticStatus } from '../../types';
import { api } from '../../lib/api';

export const TeamCmsModule: React.FC = () => {
  const [members, setMembers] = useState<LeadershipTeamMemberItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingMember, setEditingMember] = useState<Partial<LeadershipTeamMemberItem> | null>(null);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  // Delete modal state
  const [deleteConfirmMember, setDeleteConfirmMember] = useState<LeadershipTeamMemberItem | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  // Load team data
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminTeam().catch(() => []);
      setMembers(data);
    } catch (err: any) {
      console.error('Error loading team members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Cloudinary Image Upload
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Only JPEG, PNG, and WebP images are allowed.');
      return;
    }

    // Validate max file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }

    setUploadingImage(true);
    try {
      const uploadRes = await api.uploadTeamMemberImage(file);
      setEditingMember(prev => ({
        ...prev,
        profileImageUrl: uploadRes.url,
        profileImagePublicId: uploadRes.public_id,
        profileImageWidth: uploadRes.width,
        profileImageHeight: uploadRes.height,
        profileImageAlt: prev?.profileImageAlt || `${prev?.name || 'Team Member'} - ${prev?.title || 'Leadership'} at Ryzite`
      }));
    } catch (err: any) {
      alert('Image upload to Cloudinary failed: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  // Save / Update Team Member
  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editingMember.name || !editingMember.title || !editingMember.shortBio) {
      alert('Name, Title, and Short Bio are required.');
      return;
    }
    if (!editingMember.profileImageUrl || !editingMember.profileImagePublicId) {
      alert('Profile Image is required. Please upload an image.');
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      if (editingMember.id) {
        await api.updateTeamMember(editingMember.id, editingMember);
        setMessage({ type: 'success', text: `Team member ${editingMember.name} updated successfully!` });
      } else {
        await api.createTeamMember(editingMember);
        setMessage({ type: 'success', text: `Team member ${editingMember.name} created successfully!` });
      }
      setModalOpen(false);
      setEditingMember(null);
      loadData();
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Failed to save member: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  // Safe Transactional Delete
  const handleConfirmDelete = async () => {
    if (!deleteConfirmMember) return;
    setDeleting(true);
    try {
      const res = await api.deleteTeamMember(deleteConfirmMember.id);
      setMessage({ type: 'success', text: res.message || `${deleteConfirmMember.name} and profile photo destroyed on Cloudinary.` });
      setDeleteConfirmMember(null);
      loadData();
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  // Filtered members list
  const filtered = members.filter(m => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.title.toLowerCase().includes(q) ||
      m.shortBio.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-500 text-xs">
        <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-[#0052FF]" />
        <span>Loading Technical Leadership Team CMS...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* NOTIFICATION MESSAGES */}
      {message && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 border shadow-xs ${
          message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-600" /> : <AlertCircle size={16} className="text-rose-600" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* CMS HEADER BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Technical Leadership Team</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#0052FF] border border-blue-200">
              {members.filter(m => m.status === 'PUBLISHED').length} Published Members
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Senior software architects taking direct hands-on ownership of client repositories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <button
            onClick={() => {
              setEditingMember({
                name: '',
                title: '',
                shortBio: '',
                longBio: '',
                profileImageUrl: '',
                profileImagePublicId: '',
                profileImageAlt: '',
                expertise: [],
                technologies: [],
                linkedinUrl: '',
                githubUrl: '',
                displayOrder: members.length + 1,
                status: 'PUBLISHED',
                isActive: true
              });
              setModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#0052FF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
          >
            <Plus size={16} />
            <span>Add Team Member</span>
          </button>
        </div>
      </div>

      {/* TEAM MEMBERS GRID / ROWS */}
      {filtered.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-xs bg-white border border-dashed border-slate-200 rounded-2xl">
          No team members match your query. Click "Add Team Member" to create a new profile.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(member => (
            <div key={member.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                {/* 1:1 PROFILE IMAGE THUMBNAIL */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={member.profileImageUrl}
                    alt={member.profileImageAlt || member.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <span className={`absolute top-2 right-2 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    member.status === 'PUBLISHED' ? 'bg-emerald-500 text-white shadow-xs' : 'bg-amber-500 text-white'
                  }`}>
                    {member.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">{member.name}</h3>
                  <p className="text-xs font-semibold text-[#0052FF]">{member.title}</p>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {member.shortBio}
                </p>

                {/* EXPERTISE TAGS */}
                {member.expertise && member.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {member.expertise.slice(0, 3).map((exp, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium">
                        {exp}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* FOOTER ACTIONS */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {member.linkedinUrl && (
                    <a href={member.linkedinUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors">
                      <Linkedin size={15} />
                    </a>
                  )}
                  {member.githubUrl && (
                    <a href={member.githubUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors">
                      <Github size={15} />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingMember(member);
                      setModalOpen(true);
                    }}
                    className="p-1.5 text-slate-600 hover:text-[#0052FF] hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmMember(member)}
                    className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT TEAM MEMBER MODAL */}
      {modalOpen && editingMember && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingMember.id ? 'Edit Leadership Team Member' : 'Add Leadership Team Member'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Smith"
                    value={editingMember.name || ''}
                    onChange={e => setEditingMember({ ...editingMember, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Professional Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Principal Software Architect"
                    value={editingMember.title || ''}
                    onChange={e => setEditingMember({ ...editingMember, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* PROFILE IMAGE CLOUDINARY UPLOADER (1:1 PREVIEW) */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <label className="font-bold text-slate-700 block">Profile Photo * (Cloudinary ryzite/team)</label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {editingMember.profileImageUrl ? (
                    <div className="relative w-24 h-24 aspect-square rounded-xl overflow-hidden border border-slate-300 shrink-0">
                      <img src={editingMember.profileImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-24 h-24 aspect-square rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-400 shrink-0">
                      <ImageIcon size={32} />
                    </div>
                  )}

                  <div className="space-y-2 flex-1 w-full">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageFileChange}
                      disabled={uploadingImage}
                      className="text-xs"
                    />
                    {uploadingImage && <span className="text-blue-600 font-semibold block">Uploading to Cloudinary...</span>}
                    <input
                      type="text"
                      placeholder="Image Alt Text (e.g. John Smith - Principal Architect at Ryzite)"
                      value={editingMember.profileImageAlt || ''}
                      onChange={e => setEditingMember({ ...editingMember, profileImageAlt: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Short Bio * (Public card summary)</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Senior software architect focused on scalable full-stack systems..."
                  value={editingMember.shortBio || ''}
                  onChange={e => setEditingMember({ ...editingMember, shortBio: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Extended Biography (Optional)</label>
                <textarea
                  rows={3}
                  value={editingMember.longBio || ''}
                  onChange={e => setEditingMember({ ...editingMember, longBio: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Core Expertise (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Distributed Systems, Cloud Architecture, AI"
                    value={editingMember.expertise ? editingMember.expertise.join(', ') : ''}
                    onChange={e => setEditingMember({ ...editingMember, expertise: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Technologies Used (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Next.js, Node.js, PostgreSQL, AWS"
                    value={editingMember.technologies ? editingMember.technologies.join(', ') : ''}
                    onChange={e => setEditingMember({ ...editingMember, technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    placeholder="https://linkedin.com/in/..."
                    value={editingMember.linkedinUrl || ''}
                    onChange={e => setEditingMember({ ...editingMember, linkedinUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">GitHub Profile URL</label>
                  <input
                    type="text"
                    placeholder="https://github.com/..."
                    value={editingMember.githubUrl || ''}
                    onChange={e => setEditingMember({ ...editingMember, githubUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Display Order</label>
                  <input
                    type="number"
                    value={editingMember.displayOrder ?? 1}
                    onChange={e => setEditingMember({ ...editingMember, displayOrder: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Publishing Status</label>
                  <select
                    value={editingMember.status || 'PUBLISHED'}
                    onChange={e => setEditingMember({ ...editingMember, status: e.target.value as StatisticStatus })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="PUBLISHED">PUBLISHED (Live on Website)</option>
                    <option value="DRAFT">DRAFT (Hidden)</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="px-4 py-2 bg-[#0052FF] hover:bg-blue-700 text-white rounded-xl font-bold shadow-sm"
                >
                  {saving ? 'Saving...' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SAFE TRANSACTIONAL DELETE CONFIRMATION MODAL */}
      {deleteConfirmMember && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600">
              <ShieldAlert size={28} />
              <h3 className="text-base font-bold text-slate-900">Delete Team Member Permanently?</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This action will permanently delete member <strong className="text-slate-900">{deleteConfirmMember.name}</strong> from PostgreSQL AND destroy their profile image (<code className="bg-slate-100 px-1 font-mono text-rose-700">{deleteConfirmMember.profileImagePublicId}</code>) on Cloudinary.
            </p>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 text-xs">
              <button
                onClick={() => setDeleteConfirmMember(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-sm"
              >
                {deleting ? 'Destroying on Cloudinary...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
