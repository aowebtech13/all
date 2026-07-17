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

const filters = [
  { id: 1, name: "Filters 1" },
  { id: 2, name: "Filters 2" },
  { id: 3, name: "Filters 3" },
];

const Filter = () => {
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
        {/* Select */}
        <Select data={filters} btn="border" />
      </div>
      <div className="single-item">
        <button>Clear Filters</button>
      </div>
    </div>
  );
};

export default Filter;
