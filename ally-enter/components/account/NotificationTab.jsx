const NotificationTab = () => {
  return (
    <div
      className="tab-pane fade"
      id="notification"
      role="tabpanel"
      aria-labelledby="notification-tab"
    >
      <div className="notification-single">
        <h6>Announcements</h6>
        <label className="switch">
          <input type="checkbox" />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="notification-single">
        <h6>Send payment</h6>
        <label className="switch">
          <input type="checkbox" />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="notification-single">
        <h6>Receive a payment</h6>
        <label className="switch">
          <input type="checkbox" />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="notification-single">
        <h6>Request payment</h6>
        <label className="switch">
          <input type="checkbox" />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="notification-single">
        <h6>Have a problem with a payment</h6>
        <label className="switch">
          <input type="checkbox" />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="notification-single">
        <h6>Special Offers</h6>
        <label className="switch">
          <input type="checkbox" />
          <span className="slider round"></span>
        </label>
      </div>
    </div>
  );
};

export default NotificationTab;
