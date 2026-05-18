import PageHeader from '../../components/PageHeader';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { updateProfile as apiUpdateProfile } from '../../services/userService';
import { loadUser } from '../../redux/slices/authSlice';
import { setUser } from '../../redux/slices/authSlice';

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user) || {};

  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(user.profileImage || '');
  const [fileName, setFileName] = useState('');
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState(!!user.name || !!user.profileImage);

  useEffect(() => {
    setName(user.name || '');
    setPhone(user.phone || '');
    setPreview(user.profileImage || '');
  }, [user]);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // reset created flag when user edits any field or picks a new file
  useEffect(() => {
    if (created) setCreated(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, phone, file]);

  const validateFile = (f) => {
    if (!f) return { ok: false, reason: 'No file' };
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const MAX_MB = 10; // must match backend MAX_UPLOAD_SIZE_MB
    if (!allowed.includes(f.type.toLowerCase())) return { ok: false, reason: 'Invalid file type' };
    if (f.size > MAX_MB * 1024 * 1024) return { ok: false, reason: `File too large (max ${MAX_MB}MB)` };
    return { ok: true };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const form = new FormData();
      form.append('name', name);
      form.append('phone', phone);
      if (file) form.append('profileImage', file);

      const res = await apiUpdateProfile(form);
      // server returns { success, message, data }
      if (res && res.data) {
        dispatch(setUser(res.data));
        // ensure preview uses server URL so it persists
        if (res.data.profileImage) setPreview(res.data.profileImage);
        setFile(null);
        setFileName('');
        setCreated(true);
        toast.success(res.message || 'Profile updated');
      } else {
        toast.success('Profile updated');
        dispatch(loadUser());
      }
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="Profile" subtitle="Manage your name, contact details, and avatar." />
      <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6">
        <div className="grid gap-4 md:grid-cols-2 items-center">
          <label className="block">
            <span className="text-sm text-slate-300">Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input-field mt-1" placeholder="Full name" />
          </label>
          <label className="block">
            <span className="text-sm text-slate-300">Phone</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field mt-1" placeholder="Phone number" type="tel" />
          </label>

          <div className="md:col-span-2">
            <label className="block text-sm mb-2 text-slate-300">Profile picture</label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center">
                {preview ? <img src={preview} alt="preview" className="h-full w-full object-cover" /> : <div className="text-slate-400">No image</div>}
              </div>
              <div className="flex-1 w-full">
                <label className="inline-flex items-center gap-3 cursor-pointer bg-white/5 hover:bg-white/6 px-4 py-2 rounded-lg">
                  <span className="text-sm font-medium text-slate-100">Choose file</span>
                  <input
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      if (!f) { setFile(null); setFileName(''); return; }
                      const ok = validateFile(f);
                      if (!ok.ok) {
                        setFile(null);
                        setFileName('');
                        toast.error(ok.reason || 'Invalid file');
                        return;
                      }
                      setFile(f);
                      setFileName(f.name);
                    }}
                  />
                </label>
                {fileName ? <p className="text-sm text-slate-300 mt-2">{fileName}</p> : <p className="text-xs text-slate-400 mt-2">No file chosen</p>}
                <p className="text-xs text-slate-400 mt-2">Upload a profile picture (jpg, png, webp). Max size configured on server.</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <button className="btn-primary w-full" disabled={saving || created}>{saving ? 'Saving...' : created ? 'Profile saved' : 'Save profile'}</button>
            {created && <p className="text-sm text-emerald-300 mt-2">Profile created successfully.</p>}
          </div>
        </div>
      </form>
    </div>
  );
}