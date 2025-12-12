import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ChevronDown, Image, Lock, LogOut, Settings2, Sparkles, Save, Loader2 } from "lucide-react";
import AuthContext from "../../context/AuthContext";

const API_BASE_URL = "https://smart-eseva-backend.onrender.com/api/v1";

const inputBaseClasses =
  "w-full rounded-xl border border-gray-300 bg-white/80 px-4 py-3 text-sm leading-[1.4] tracking-normal text-slate-900 placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition duration-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40";

const toggleClasses =
  "flex items-center justify-between rounded-xl border border-gray-200 bg-white/80 px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition duration-200 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-white";

const Profile = () => {
  const { auth } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    id: null,
    name: "",
    email: "",
    mobileNumber: "",
    meterNumber: "",
    wardNumber: "",
    linkedStatus: "Active",
    profileImage: null,
    role: "Citizen",
    createdAt: "",
    notificationsEnabled: true,
    themePreference: "light",
  });
  const [preferences, setPreferences] = useState({
    notifications: true,
    theme: "light",
    activityReport: true,
  });
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth?.token) {
        setLoading(false);
        setError("Please log in to view your profile.");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        
        const data = response.data;
        
        // Debug: Log the response
        console.log("Profile data received:", data);
        
        const formatDate = (dateString) => {
          if (!dateString) return "N/A";
          try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
          } catch {
            return dateString;
          }
        };

        // Handle response - User model may not have all fields
        setProfile({
          id: data.id || null,
          name: data.name || data.fullName || "",
          email: data.email || auth.email || "",
          mobileNumber: data.mobileNumber || data.phone || "",
          meterNumber: data.meterNumber || "",
          wardNumber: data.wardNumber || data.ward || "",
          linkedStatus: data.linkedStatus || data.status || "Active",
          profileImage: data.profileImage || data.profileImageUrl || null,
          role: data.role || auth.role || "Citizen",
          createdAt: formatDate(data.createdAt),
          notificationsEnabled: data.notificationsEnabled !== undefined ? data.notificationsEnabled : true,
          themePreference: data.themePreference || "light",
        });

        setPreferences({
          notifications: data.notificationsEnabled !== undefined ? data.notificationsEnabled : true,
          theme: data.themePreference || "light",
          activityReport: data.activityReport !== undefined ? data.activityReport : true,
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        console.error("Error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
        });
        
        let errorMsg = "Could not load your profile data.";
        if (error.response?.status === 500) {
          errorMsg = "Server error. The backend may be experiencing issues. Please try again later or contact support.";
        } else if (error.response?.status === 401 || error.response?.status === 403) {
          errorMsg = "Authentication failed. Please log in again.";
        } else if (error.response?.data?.message) {
          errorMsg = error.response.data.message;
        } else if (error.message) {
          errorMsg = error.message;
        }
        
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [auth?.token, auth?.email, auth?.role]);

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    if (!auth?.token) {
      toast.error("Unable to save: Please log in.");
      return;
    }

    if (!profile.id) {
      toast.error("Unable to save: User ID not found.");
      return;
    }

    setSaving(true);
    setError(null);
    const toastId = toast.loading("Saving profile...");

    try {
      const updateData = {
        name: profile.name,
        mobileNumber: profile.mobileNumber,
        meterNumber: profile.meterNumber || null,
      };

      // Try using admin endpoint for now (citizens can update their own profile)
      await axios.put(`${API_BASE_URL}/admin/users/${profile.id}`, updateData, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });

      toast.success("Profile updated successfully", { id: toastId });
    } catch (error) {
      console.error("Failed to update profile:", error);
      const errorMsg = error.response?.data?.message || error.response?.status === 500
        ? "Server error. Please try again later."
        : error.response?.status === 403
        ? "You don't have permission to update this profile."
        : "Unable to update profile";
      setError(errorMsg);
      toast.error(errorMsg, { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordInput = (event) => {
    const { name, value } = event.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    if (passwords.next !== passwords.confirm) {
      toast.error("Passwords must match!");
      return;
    }
    if (passwords.next.length < 6) {
      toast.error("Password should be 6+ characters.");
      return;
    }

    const toastId = toast.loading("Saving password...");
    try {
      await axios.post(
        `${API_BASE_URL}/users/change-password`,
        {
          currentPassword: passwords.current,
          newPassword: passwords.next,
          confirmPassword: passwords.confirm,
        },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      toast.success("Password updated!", { id: toastId });
      setPasswords({ current: "", next: "", confirm: "" });
      setShowPasswordFields(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update password.", { id: toastId });
    }
  };

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((part) => part.charAt(0))
        .join("")
        .slice(0, 2)
    : "U";

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-slate-50 pb-10 pt-8 dark:bg-slate-950">
        <div className="mx-auto w-full max-w-6xl space-y-6 px-4 sm:px-6">
          <div className="rounded-2xl border border-black/5 bg-gradient-to-br from-slate-50 to-slate-100 p-10 shadow-sm dark:border-white/10 dark:bg-gradient-to-br dark:from-slate-900/80 dark:to-slate-900/60">
            <div className="flex items-center gap-6">
              <div className="h-32 w-32 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="space-y-3">
                <div className="h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-black/5 bg-white/80 p-8 shadow-sm dark:border-white/10 dark:bg-white/5">
              <div className="h-6 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700 mb-4" />
              <div className="grid gap-6 md:grid-cols-2">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="space-y-2">
                    <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 pb-10 pt-8 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 sm:px-6">
        <section className="rounded-2xl border border-black/5 bg-gradient-to-br from-slate-50 to-slate-100 p-10 shadow-[0_8px_30px_rgba(15,23,42,0.15)] transition hover:-translate-y-0.5 hover:shadow-[0_15px_50px_rgba(15,23,42,0.2)] dark:border-white/10 dark:bg-gradient-to-br dark:from-slate-900/80 dark:to-slate-900/60">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-6">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  className="h-32 w-32 rounded-full object-cover shadow-sm transition duration-200 hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white/80 text-4xl font-semibold text-slate-900 shadow-sm transition duration-200 hover:scale-[1.03] dark:bg-white/10 dark:text-white">
                  {initials}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{profile.name || "Citizen"}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-300">{profile.email}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{profile.mobileNumber || "Add phone"}</p>
                <div className="mt-2 flex gap-3 text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                  <span>{profile.role}</span>
                  <span>•</span>
                  <span>Joined {profile.createdAt}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">
                    Verified Citizen
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition duration-200 hover:scale-[1.02] hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
              <button className="rounded-xl bg-white px-5 py-2 text-sm font-semibold text-slate-900 shadow border border-gray-200 transition duration-200 hover:scale-[1.02] hover:shadow-md dark:bg-white/10 dark:border-white/10 dark:text-white">
                <Image className="mr-2 h-4 w-4" />
                Update Photo
              </button>
            </div>
          </div>
          {error && (
            <div className="mt-4 rounded-xl border border-red-300 bg-red-50/80 p-4 text-sm text-red-700 dark:border-red-400/60 dark:bg-red-500/10 dark:text-red-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-semibold">Error loading profile</p>
                  <p className="mt-1 text-xs opacity-90">{error}</p>
                  {auth?.email && (
                    <p className="mt-2 text-xs opacity-75">Attempting to load profile for: {auth.email}</p>
                  )}
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100 dark:border-red-400/60 dark:bg-red-500/20 dark:text-red-200 dark:hover:bg-red-500/30"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="grid gap-6">
          <div className="rounded-2xl border border-black/5 bg-white/80 p-8 shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-white/5">
            <div className="space-y-2">
              <p className="text-lg font-semibold text-slate-900 dark:text-white">Personal Information</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">These values are synced with your Smart E-Seva account.</p>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleProfileChange("name", e.target.value)}
                  className={inputBaseClasses}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className={`${inputBaseClasses} cursor-not-allowed opacity-60`}
                  placeholder="Email cannot be changed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                <input
                  type="tel"
                  value={profile.mobileNumber}
                  onChange={(e) => handleProfileChange("mobileNumber", e.target.value)}
                  className={inputBaseClasses}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Meter Number</label>
                <input
                  type="text"
                  value={profile.meterNumber}
                  onChange={(e) => handleProfileChange("meterNumber", e.target.value)}
                  className={inputBaseClasses}
                  placeholder="Enter your meter number"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white/80 p-8 shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-white/5">
            <div className="space-y-2">
              <p className="text-lg font-semibold text-slate-900 dark:text-white">Utility Information</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Monitor your meter and billing status.</p>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ward Number</label>
                <div className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                  <Sparkles className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-slate-900 dark:text-white">{profile.wardNumber || "Not assigned"}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Meter Number</label>
                <div className="flex items-center justify-between rounded-xl border border-gray-300 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                  <span className="text-sm text-slate-900 dark:text-white">{profile.meterNumber}</span>
                  <button className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 transition duration-200 hover:bg-emerald-200">
                    Verify Meter Number
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Linked Account</label>
                <div className="inline-flex items-center rounded-full border border-green-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-400 dark:bg-emerald-500/20">
                  Active
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <div className="rounded-xl border border-gray-200 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white">
                  Meter synced with the Smart Grid
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white/80 p-8 shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-white/5">
            <div className="space-y-2">
              <p className="text-lg font-semibold text-slate-900 dark:text-white">Preferences</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Manage how notifications reach you.</p>
            </div>
            <div className="mt-6 space-y-4">
              <button
                onClick={() =>
                  setPreferences((prev) => ({ ...prev, notifications: !prev.notifications }))
                }
                className={toggleClasses}
              >
                <span>Notifications</span>
                <span>{preferences.notifications ? "Enabled" : "Disabled"}</span>
              </button>
              <div className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme preference</span>
                <select
                  value={preferences.theme}
                  onChange={(event) => setPreferences((prev) => ({ ...prev, theme: event.target.value }))}
                  className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40 dark:border-white/10 dark:bg-white/5 dark:text-white"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              <button
                onClick={() =>
                  setPreferences((prev) => ({ ...prev, activityReport: !prev.activityReport }))
                }
                className={toggleClasses}
              >
                <span>Email activity report</span>
                <span>{preferences.activityReport ? "Subscribed" : "Paused"}</span>
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-black/5 bg-white/80 p-8 shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">Security Settings</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Revoke access, update credentials, or end active sessions from anywhere.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:scale-[1.02] hover:shadow-md">
                <Lock className="h-4 w-4" />
                Change Password
              </button>
              <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition duration-200 hover:scale-[1.02] hover:shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white">
                <Settings2 className="h-4 w-4" />
                Manage Mobile Number
              </button>
              <button className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition duration-200 hover:scale-[1.02] hover:shadow-sm">
                <LogOut className="h-4 w-4" />
                Logout All Devices
              </button>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-red-300 bg-red-50/80 p-5 text-sm text-red-700 dark:border-red-400/60 dark:bg-red-500/10 dark:text-red-200">
            <p className="font-semibold text-red-700 dark:text-red-200">Danger zone</p>
            <p className="text-xs text-red-600/80 dark:text-red-200/80">
              Deleting your account removes all history. Contact support to request removal.
            </p>
            <button
              className="mt-3 rounded-xl border border-red-600 bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition duration-200 hover:scale-[1.03] hover:bg-red-700"
              onClick={() => toast.error("Account deletion is disabled.")}
            >
              Delete account
            </button>
          </div>
          {showPasswordFields && (
            <form onSubmit={handleChangePassword} className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current password</label>
                  <input
                    type="password"
                    name="current"
                    value={passwords.current}
                    onChange={handlePasswordInput}
                    className={inputBaseClasses}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New password</label>
                  <input
                    type="password"
                    name="next"
                    value={passwords.next}
                    onChange={handlePasswordInput}
                    className={inputBaseClasses}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm password</label>
                  <input
                    type="password"
                    name="confirm"
                    value={passwords.confirm}
                    onChange={handlePasswordInput}
                    className={inputBaseClasses}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:scale-[1.02] hover:shadow-md">
                  Save password
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordFields(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-slate-700 transition duration-200 hover:scale-[1.02] hover:shadow-sm dark:border-white/10 dark:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};

export default Profile;
 