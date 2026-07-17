import Image from "next/image";
import delete_2 from "/public/images/icon/delete-2.png";
import logout_icon from "/public/images/icon/logout.png";
import owner_profile from "/public/images/owner-profile.png";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const OwnerDetails = () => {
  const { user, logout, resendEmailVerification } = useAuth();
  const [resending, setResending] = useState(false);

  const avatarUrl = user?.avatar_url || owner_profile;

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
    <div className="owner-details">
      <div className="profile-area">
        <div className="profile-img">
          <Image src={avatarUrl} alt="image" width={100} height={100} className="rounded-circle" />
        </div>
        <div className="name-area">
          <h6>{user?.name || 'User'}</h6>
          <p className="active-status">Active</p>
        </div>
      </div>
      <div className="owner-info">
        <ul>
          <li>
            <p>Account ID:</p>
            <span className="mdr">{user?.lxp_id || 'N/A'}</span>
          </li>
          <li>
            <p>Joined:</p>
            <span className="mdr">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
          </li>
          <li>
            <p>Selected category:</p>
            <span className="mdr">{user?.coopCategory || user?.coop_category || 'N/A'}</span>
          </li>
          <li>
            <p>Confirm status:</p>
            <div className="d-flex align-items-center gap-2">
              <span className="mdr">{user?.email_verified_at ? '100%' : '80%'}</span>
              {!user?.email_verified_at && (
                <button 
                  className="cmn-btn py-0 px-2" 
                  style={{ fontSize: '10px', height: '20px', lineHeight: '20px' }}
                  onClick={handleResendEmail}
                  disabled={resending}
                >
                  {resending ? "..." : "Verify"}
                </button>
              )}
            </div>
          </li>
        </ul>
      </div>
      <div className="owner-action">
        <button onClick={logout}>
          <Image src={logout_icon} alt="image" />
          Logout
        </button>
        <button className="delete">
          <Image src={delete_2} alt="image" />
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default OwnerDetails;
