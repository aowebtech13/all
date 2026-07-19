import Select from "../select/Select";

const dateSelect = [
  { id: 1, name: "23 Nov 2021- 21 Feb 2022" },
  { id: 2, name: "23 Nov 2021- 21 Feb 2022" },
  { id: 3, name: "23 Nov 2021- 21 Feb 2022" },
];

const balance = [
  { id: 1, name: "Balance" },
  { id: 2, name: "Balance" },
  { id: 3, name: "Balance" },
];

const transactionTypes = [
  { id: "all", name: "All Types" },
  { id: "deposit", name: "Deposits" },
  { id: "withdrawal_request", name: "Withdrawals" },
  { id: "investment", name: "Investments" },
  { id: "send", name: "Send Money" },
  { id: "receive", name: "Receive Money" },
];

const Filter = ({ selectedType, onTypeChange }) => {
  const selectedTypeItem = transactionTypes.find(t => t.id === selectedType) || transactionTypes[0];

  return (
    <div className="filters-item">
      <div className="single-item">
        {/* Select  */}
        <Select data={dateSelect} btn="border" />
      </div>
      <div className="single-item">
        {/* Select */}
        <Select data={balance} btn="border" />
      </div>
      <div className="single-item">
        {/* Transaction Type Filter */}
        <Select
          data={transactionTypes}
          btn="border"
          value={selectedTypeItem}
          onChange={(item) => onTypeChange?.(item?.id || "all")}
        />
      </div>
      <div className="single-item">
        <button>Clear Filters</button>
      </div>
    </div>
  );
};

export default Filter;
