import Link from "next/link";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const Pagination = () => {
  return (
    <nav
      aria-label="Page navigation"
      className="d-flex justify-content-center mt-40"
    >
      <ul className="pagination justify-content-center align-items-center mb-40">
        <li className="page-item">
          <Link className="page-link previous" href="#" aria-label="Previous">
            <FaAngleDoubleLeft />
          </Link>
        </li>
        <li className="page-item">
          <Link className="page-link previous" y href="#" aria-label="Previous">
            <FaChevronLeft />
          </Link>
        </li>
        <li className="page-item">
          <Link className="page-link" href="#">
            1
          </Link>
        </li>
        <li className="page-item">
          <Link className="page-link active" href="#">
            2
          </Link>
        </li>
        <li className="page-item">
          <Link className="page-link" href="#">
            3
          </Link>
        </li>
        <li className="page-item">
          <Link className="page-link" href="#">
            ...
          </Link>
        </li>
        <li className="page-item">
          <Link className="page-link next" href="#" aria-label="Next">
            <FaChevronRight />
          </Link>
        </li>
        <li className="page-item">
          <Link className="page-link next" href="#" aria-label="Next">
            <FaAngleDoubleRight />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
