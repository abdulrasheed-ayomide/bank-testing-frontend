import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { accountService, profileService } from '../../services/bankingService';
import { authService } from '../../services/authService';
import { getErrorMessage, getFieldErrors } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { getInitials, formatDate } from '../../utils/format';
import PasswordInput from '../../components/common/PasswordInput';

const ProfilePage = () => {
  const { user, setUser, refreshUser } = useAuth();
  const toast = useToast();

  const [account, setAccount] = useState(null);
  const [profileForm, setProfileForm] = useState({ fullName: '', phoneNumber: '' });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [photoUploading, setPhotoUploading] = useState(false);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react/set-state-in-effect
      setProfileForm({ fullName: user.fullName || '', phoneNumber: user.phoneNumber || '' });
    }
    const loadAccount = async () => {
      try {
        const { data } = await accountService.getMyAccount();
        setAccount(data.data.account);
      } catch {
        /* silent */
      }
    };
    loadAccount();
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setProfileErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileErrors({});
    setProfileLoading(true);
    try {
      const { data } = await profileService.updateProfile(profileForm);
      setUser(data.data.user);
      toast.success('Profile updated successfully.');
    } catch (error) {
      const fieldErrors = getFieldErrors(error);
      if (Object.keys(fieldErrors).length > 0) {
        setProfileErrors(fieldErrors);
      } else {
        toast.error(getErrorMessage(error, 'Could not update profile.'));
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPasswordErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordErrors({});

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordErrors({ confirmNewPassword: 'Passwords do not match' });
      return;
    }

    setPasswordLoading(true);
    try {
      await authService.changePassword(passwordForm);
      toast.success('Password changed. Please log in again on other devices.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (error) {
      const fieldErrors = getFieldErrors(error);
      if (Object.keys(fieldErrors).length > 0) {
        setPasswordErrors(fieldErrors);
      } else {
        toast.error(getErrorMessage(error, 'Could not change password.'));
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Photo must be smaller than 2MB.');
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);

    setPhotoUploading(true);
    try {
      const { data } = await profileService.uploadPhoto(formData);
      setUser(data.data.user);
      toast.success('Profile photo updated.');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not upload photo.'));
    } finally {
      setPhotoUploading(false);
      await refreshUser().catch(() => {});
    }
  };

  return (
    <div className="flex-col gap-6">
      {/* --- Account details --- */}
      {account && (
        <div className="card">
          <h3 className="mb-4">Account details</h3>
          <div className="grid grid-3">
            <div>
              <div className="text-xs text-muted mb-1">Account number</div>
              <div className="mono">{account.accountNumber}</div>
            </div>
            <div>
              <div className="text-xs text-muted mb-1">Customer ID</div>
              <div className="mono">{account.customerId}</div>
            </div>
            <div>
              <div className="text-xs text-muted mb-1">Account opened</div>
              <div>{formatDate(account.accountOpenedDate)}</div>
            </div>
            <div>
              <div className="text-xs text-muted mb-1">Account type</div>
              <div style={{ textTransform: 'capitalize' }}>{account.accountType}</div>
            </div>
            <div>
              <div className="text-xs text-muted mb-1">Status</div>
              <span className="badge badge-success" style={{ textTransform: 'capitalize' }}>{account.accountStatus}</span>
            </div>
            <div>
              <div className="text-xs text-muted mb-1">KYC status</div>
              <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>{user?.kycStatus?.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
      )}

      {/* --- Profile photo --- */}
      <div className="card">
        <h3 className="mb-4">Profile photo</h3>
        <div className="photo-upload">
          <span className="avatar">
            {user?.profilePhoto ? <img src={user.profilePhoto} alt="" /> : getInitials(user?.fullName)}
          </span>
          <div>
            <label htmlFor="photo-upload" className="btn btn-secondary btn-sm">
              {photoUploading ? <span className="spinner" /> : 'Upload new photo'}
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
              disabled={photoUploading}
            />
            <p className="text-xs text-muted mt-2 mb-0">JPEG, PNG, or WEBP. Max 2MB.</p>
          </div>
        </div>
      </div>

      {/* --- Profile information --- */}
      <div className="card">
        <h3 className="mb-4">Personal information</h3>
        <form onSubmit={handleProfileSubmit} noValidate>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">Full name</label>
              <input
                id="fullName"
                name="fullName"
                className={`form-input ${profileErrors.fullName ? 'has-error' : ''}`}
                value={profileForm.fullName}
                onChange={handleProfileChange}
              />
              {profileErrors.fullName && <span className="form-error">{profileErrors.fullName}</span>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="phoneNumber">Phone number</label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                className={`form-input ${profileErrors.phoneNumber ? 'has-error' : ''}`}
                value={profileForm.phoneNumber}
                onChange={handleProfileChange}
              />
              {profileErrors.phoneNumber && <span className="form-error">{profileErrors.phoneNumber}</span>}
            </div>
          </div>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email address</label>
              <input id="email" className="form-input" value={user?.email || ''} disabled />
              <span className="form-hint">Email cannot be changed. Contact support if needed.</span>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <input id="username" className="form-input" value={user?.username || ''} disabled />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={profileLoading}>
            {profileLoading ? <span className="spinner" /> : 'Save changes'}
          </button>
        </form>
      </div>

      {/* --- Change password --- */}
      <div className="card">
        <h3 className="mb-4">Change password</h3>
        <form onSubmit={handlePasswordSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="currentPassword">Current password</label>
            <PasswordInput
              id="currentPassword"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter your current password"
              hasError={!!passwordErrors.currentPassword}
              autoComplete="current-password"
            />
            {passwordErrors.currentPassword && <span className="form-error">{passwordErrors.currentPassword}</span>}
          </div>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="newPassword">New password</label>
              <PasswordInput
                id="newPassword"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                placeholder="New password"
                hasError={!!passwordErrors.newPassword}
                autoComplete="new-password"
              />
              {passwordErrors.newPassword && <span className="form-error">{passwordErrors.newPassword}</span>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="confirmNewPassword">Confirm new password</label>
              <PasswordInput
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={passwordForm.confirmNewPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                hasError={!!passwordErrors.confirmNewPassword}
                autoComplete="new-password"
              />
              {passwordErrors.confirmNewPassword && <span className="form-error">{passwordErrors.confirmNewPassword}</span>}
            </div>
          </div>
          <span className="form-hint" style={{ display: 'block', marginBottom: 'var(--space-4)' }}>
            At least 8 characters, with uppercase, lowercase, a number, and a special character.
          </span>
          <button type="submit" className="btn btn-primary" disabled={passwordLoading}>
            {passwordLoading ? <span className="spinner" /> : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
