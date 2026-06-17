// Admin Profile Settings Component
import React, { useState } from 'react';
import { FiSave, FiLock, FiUser, FiMail, FiCamera, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const ProfileSettings = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [saving, setSaving] = useState(false);
  
  // Profile info state
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Club Administrator',
    email: user?.email || 'clubadmin@universalclub.com',
    username: user?.username || 'clubadmin',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
  });
  const [profileErrors, setProfileErrors] = useState({});

  // Password state
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [changingPass, setChangingPass] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    if (profileErrors[name]) setProfileErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) setPasswordErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateProfile = () => {
    const errors = {};
    if (!profileData.name.trim()) errors.name = 'Full name is required';
    if (!profileData.username.trim()) errors.username = 'Username is required';
    if (!profileData.avatar.trim()) errors.avatar = 'Avatar Image URL is required';
    
    if (!profileData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = 'Please enter a valid email';
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;

    setSaving(true);
    try {
      await updateProfile(profileData);
      showToast('Admin profile details updated!', 'success');
    } catch (err) {
      showToast('Failed to save profile parameters', 'error');
    } finally {
      setSaving(false);
    }
  };

  const validatePassword = () => {
    const errors = {};
    if (!passwordData.current) errors.current = 'Current password is required to verify';
    if (!passwordData.new) errors.new = 'New password is required';
    
    if (passwordData.new.length < 5) {
      errors.new = 'Password must be at least 5 characters long';
    }
    
    if (passwordData.new !== passwordData.confirm) {
      errors.confirm = 'Confirm password does not match new password';
    }

    // Mock validation checks current is "adm12345"
    if (passwordData.current !== 'adm12345') {
      errors.current = 'Incorrect current password provided (Hint: default is "adm12345")';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setChangingPass(true);
    // Simulate API delay
    setTimeout(() => {
      setChangingPass(false);
      showToast('Password credentials updated successfully!', 'success');
      setPasswordData({ current: '', new: '', confirm: '' });
    }, 600);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Profile & Credentials</h1>
        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Configure profile details and login passwords</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Card: Info form */}
        <div className="lg:col-span-7 rounded-2xl border border-gray-850 bg-gray-900/10 p-6 sm:p-8 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-gray-900 pb-3">Administrative Profile</h3>
          
          <form onSubmit={handleSaveProfile} className="space-y-4">
            
            {/* Avatar Preview Section */}
            <div className="flex items-center gap-4">
              <div className="relative group rounded-full overflow-hidden w-16 h-16 border border-gray-700">
                <img
                  src={profileData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80'}
                  alt="Admin Avatar Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">
                  <FiCamera />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Profile Avatar</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Input an Unsplash image URL below to change</p>
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="settings-name">Full Display Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-gray-500" />
                <input
                  id="settings-name"
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className="form-input pl-9 text-xs sm:text-sm"
                />
              </div>
              {profileErrors.name && <p className="text-red-500 text-[10px] mt-1">{profileErrors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label" htmlFor="settings-username">Username Handle</label>
                <input
                  id="settings-username"
                  type="text"
                  name="username"
                  value={profileData.username}
                  onChange={handleProfileChange}
                  className="form-input text-xs sm:text-sm"
                />
                {profileErrors.username && <p className="text-red-500 text-[10px] mt-1">{profileErrors.username}</p>}
              </div>

              <div>
                <label className="form-label" htmlFor="settings-email">Administrative Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3 text-gray-500" />
                  <input
                    id="settings-email"
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="form-input pl-9 text-xs sm:text-sm"
                  />
                </div>
                {profileErrors.email && <p className="text-red-500 text-[10px] mt-1">{profileErrors.email}</p>}
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="settings-avatar">Avatar URL</label>
              <input
                id="settings-avatar"
                type="text"
                name="avatar"
                value={profileData.avatar}
                onChange={handleProfileChange}
                className="form-input text-xs sm:text-sm"
                placeholder="Unsplash image URL"
              />
              {profileErrors.avatar && <p className="text-red-500 text-[10px] mt-1">{profileErrors.avatar}</p>}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-primary hover:bg-primary-hover disabled:bg-gray-800 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <FiSave /> {saving ? 'Saving Profile...' : 'Save Profile Details'}
            </button>

          </form>
        </div>

        {/* Right Card: Credentials form */}
        <div className="lg:col-span-5 rounded-2xl border border-gray-850 bg-gray-900/10 p-6 sm:p-8 space-y-6 h-fit">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-gray-900 pb-3">Update Credentials</h3>
          
          <form onSubmit={handleSavePassword} className="space-y-4">
            <div>
              <label className="form-label" htmlFor="pass-current">Current Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-500" />
                <input
                  id="pass-current"
                  type="password"
                  name="current"
                  value={passwordData.current}
                  onChange={handlePasswordChange}
                  className="form-input pl-9 text-xs sm:text-sm"
                  placeholder="Enter current password"
                />
              </div>
              {passwordErrors.current && <p className="text-red-500 text-[10px] mt-1">{passwordErrors.current}</p>}
            </div>

            <div>
              <label className="form-label" htmlFor="pass-new">New Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-500" />
                <input
                  id="pass-new"
                  type="password"
                  name="new"
                  value={passwordData.new}
                  onChange={handlePasswordChange}
                  className="form-input pl-9 text-xs sm:text-sm"
                  placeholder="At least 5 characters"
                />
              </div>
              {passwordErrors.new && <p className="text-red-500 text-[10px] mt-1">{passwordErrors.new}</p>}
            </div>

            <div>
              <label className="form-label" htmlFor="pass-confirm">Confirm New Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-500" />
                <input
                  id="pass-confirm"
                  type="password"
                  name="confirm"
                  value={passwordData.confirm}
                  onChange={handlePasswordChange}
                  className="form-input pl-9 text-xs sm:text-sm"
                  placeholder="Verify new password"
                />
              </div>
              {passwordErrors.confirm && <p className="text-red-500 text-[10px] mt-1">{passwordErrors.confirm}</p>}
            </div>

            <button
              type="submit"
              disabled={changingPass}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FiLock /> {changingPass ? 'Changing credentials...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default ProfileSettings;
