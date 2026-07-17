import Link from "next/link";
import Select from "../select/Select";
import { useContext, useEffect } from "react";
import { PaylioContext } from "@/context/context";
import axiosInstance from "@/lib/axios";

const countryCode = [
  { id: 1, name: "+39" },

];

const RecipientsTab = () => {
  const { exchangeData, setExchangeData } = useContext(PaylioContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/user");
        if (res.data && !exchangeData.firstName) {
          setExchangeData(prev => ({
            ...prev,
            firstName: res.data.first_name || '',
            lastName: res.data.last_name || '',
            email: res.data.email || '',
            phone: res.data.phone || '',
          }));
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const fieldMap = {
      recipientsfname: 'firstName',
      recipientslname: 'lastName',
      recipientslAddress: 'address',
      recipientslCity: 'city',
      recipientslCode: 'postcode',
      recipientsphone: 'phone',
      bankname: 'bankName',
      accountnumber: 'accountNumber',
      sendingreason: 'loanReason',
    };

    if (fieldMap[id]) {
      setExchangeData(prev => ({
        ...prev,
        [fieldMap[id]]: value
      }));
    }
  };

  return (
    <div
      className="tab-pane fade show active"
      id="recipients"
      role="tabpanel"
      aria-labelledby="recipients-tab"
    >
      <div className="section-head">
        <h5>Add Disbursement Account Details</h5>
        <p>
          This information must be accurate or your loan disbursement will be delayed.
        </p>
      </div>
      <form action="#">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="single-input">
              <label htmlFor="recipientsfname">First Name</label>
              <input
                type="text"
                id="recipientsfname"
                placeholder="Dana"
                value={exchangeData.firstName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="single-input">
              <label htmlFor="recipientslname">Last Name</label>
              <input
                type="text"
                id="recipientslname"
                placeholder="Patton"
                value={exchangeData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="single-input">
              <label htmlFor="recipientslAddress">
                Home Address (Compulsory)
              </label>
              <input
                type="text"
                id="recipientslAddress"
                placeholder="Resident Address"
                value={exchangeData.address}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="single-input">
              <label htmlFor="recipientslCity">City/Town</label>
              <input
                type="text"
                id="recipientslCity"
                placeholder="City/Town"
                value={exchangeData.city}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="single-input">
              <label htmlFor="recipientslCode">Postcode</label>
              <input
                type="text"
                id="recipientslCode"
                placeholder="Postcode"
                value={exchangeData.postcode}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="single-input">
              <label htmlFor="recipientsphone">Phone</label>
              <div className="select-area d-flex align-items-center">
                {/* Select */}
                <Select data={countryCode} btn="bg-transparent" />
                <input
                  type="text"
                  id="recipientsphone"
                  placeholder="(070) 4567-8800"
                  value={exchangeData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <div className="single-input">
              <label htmlFor="bankname">Bank Name</label>
              <input
                type="text"
                id="bankname"
                placeholder="Bank Name"
                value={exchangeData.bankName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="col-md-12">
            <div className="single-input">
              <label htmlFor="accountnumber">Account number</label>
              <input
                type="text"
                id="accountnumber"
                placeholder="Account number"
                value={exchangeData.accountNumber}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="single-input">
              <label htmlFor="sendingreason">Reason for Loan</label>
              <input
                type="text"
                id="sendingreason"
                placeholder="Reason for Loan"
                value={exchangeData.loanReason}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-12">
            <div className="footer-area mt-40">
              <Link href="/loans/step-1">Previous Step</Link>
              <Link href="/loans/step-3" className="active">
                Next
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RecipientsTab;
