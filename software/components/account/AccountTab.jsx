import Image from "next/image";
import confirm from "/public/images/icon/confirm.png";
import not_confirm from "/public/images/icon/not-confirm.png";
import pending from "/public/images/icon/pending.png";
import owner_profile_2 from "/public/images/owner-profile-2.png";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";

const AccountTab = () => {
  const { user, updateProfile, errors, setErrors, resendEmailVerification } = useAuth();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      setAvatarPreview(user.avatar_url || owner_profile_2);
    }
  }, [user]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("phone", formData.phone);
    if (avatar) {
      data.append("avatar", avatar);
    }

    try {
      await updateProfile(data);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update profile error:", error);
      if (error.response?.status !== 422) {
        alert("Failed to update profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setResending(true);
    try {
      await resendEmailVerification({ setStatus: (status) => alert(status || "Verification email sent!") });
    } catch (error) {
      console.error("Resend email error:", error);
      alert("Failed to resend verification email.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div
      className="tab-pane fade show active"
      id="account"
      role="tabpanel"
      aria-labelledby="account-tab"
    >
      <div className="upload-avatar">
        <div className="avatar-left d-flex align-items-center">
          <div className="profile-img">
            <Image src={avatarPreview || owner_profile_2} alt="avatar" width={100} height={100} className="rounded-circle" />
          </div>
          <div className="instraction">
            <h6>Your Avatar</h6>
            <p>Profile picture size: 400px x 400px</p>
          </div>
        </div>
        <div className="avatar-right">
          <div className="file-upload">
            <div className="right-area">
              <label className="file">
                <input type="file" onChange={handleFileChange} accept="image/*" />
                <span className="file-custom"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row justify-content-center">
          <div className="col-md-12">
            <div className="single-input">
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Full Name" 
              />
              {errors.name && <span className="text-danger">{errors.name[0]}</span>}
            </div>
          </div>
          <div className="col-md-12">
            <div className="single-input">
              <label htmlFor="email">Email</label>
              <div className="row input-status d-flex align-items-center">
                <div className="col-6">
                  <input
                    type="text"
                    id="email"
                    value={formData.email}
                    disabled
                    placeholder="Email Address"
                  />
                </div>
                <div className="col-6">
                  {user?.email_verified_at ? (
                    <span className="confirm">
                      <Image src={confirm} alt="icon" />
                      E-mail confirmed
                    </span>
                  ) : (
                    <div className="d-flex align-items-center gap-2">
                      <span className="pending">
                        <Image src={pending} alt="icon" />
                        E-mail confirmation in pending
                      </span>
                      <button 
                        type="button" 
                        className="cmn-btn py-1 px-2" 
                        style={{ fontSize: '12px' }}
                        onClick={handleResendEmail}
                        disabled={resending}
                      >
                        {resending ? "Sending..." : "Resend"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="single-input">
              <label htmlFor="phone">Phone</label>
              <div className="row input-status d-flex align-items-center">
                <div className="col-6">
                  <input 
                    type="text" 
                    id="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder="Phone Number" 
                  />
                  {errors.phone && <span className="text-danger">{errors.phone[0]}</span>}
                </div>
                <div className="col-6">
                   {formData.phone && (
                      <span className="confirm">
                        <Image src={confirm} alt="icon" />
                        Phone number provided
                      </span>
                   )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Address field removed as it's not in the User model yet */}
          
          <div className="col-md-12">
            <div className="btn-border">
              <button className="cmn-btn" disabled={loading}>
                {loading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AccountTab;
