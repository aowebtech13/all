import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import DevicesSection from "./DevicesSection";

const SecurityTab = () => {
  const { updatePassword, errors, setErrors } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updatePassword(formData);
      toast.success("Password updated successfully!");
      setFormData({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
    } catch (error) {
      console.error("Update password error:", error);
      if (error.response?.status !== 422) {
        toast.error("Failed to update password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="tab-pane fade"
      id="security"
      role="tabpanel"
      aria-labelledby="security-tab"
    >
      
      <div className="change-pass mb-40">
        <div className="row">
          <div className="col-sm-6">
            <h5>Change Password</h5>
            <p>
              You can always change your password for security reasons or reset
              your password in case you forgot it.
            </p>
            <Link href="/auth/forgot-password">Forgot password?</Link>
          </div>
          <div className="col-sm-6">
            <form onSubmit={handleSubmit}>
              <div className="row justify-content-center">
                <div className="col-md-12">
                  <div className="single-input">
                    <label htmlFor="current_password">Current password</label>
                    <input
                      type="password"
                      id="current_password"
                      value={formData.current_password}
                      onChange={handleChange}
                      placeholder="Current password"
                    />
                    {errors.current_password && <span className="text-danger">{errors.current_password[0]}</span>}
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="single-input">
                    <label htmlFor="password">New password</label>
                    <input
                      type="password"
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="New password"
                    />
                    {errors.password && <span className="text-danger">{errors.password[0]}</span>}
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="single-input">
                    <label htmlFor="password_confirmation">
                      Confirm New password
                    </label>
                    <input
                      type="password"
                      id="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      placeholder="Confirm New password"
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="btn-border w-100">
                    <button className="cmn-btn w-100" disabled={loading}>
                      {loading ? "Updating..." : "Update password"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="single-content additional-security">
        <h5>Additional security</h5>
        <div className="single-setting">
          <div className="left">
            <h6>SMS recovery</h6>
            <p>Number ending with 1234</p>
          </div>
          <div className="right">
            <button className="active">coming soon</button>
          </div>
        </div>
       
       
      </div>
      <DevicesSection />
    </div>
  );
};

export default SecurityTab;
