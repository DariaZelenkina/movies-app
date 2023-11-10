import { Pagination, Result } from "antd";
import PropTypes from "prop-types";
import ItemList from "../item-list/item-list";
import "./rated-page.css";

function RatedPage({ ratedResults,
  totalItems, currentPage, onCurrentPageChange }) {
  // const spinner = loading ? <Spin size="large" /> : null;
  const content = totalItems !== 0
    ? <ItemList data={ratedResults} pageNumber={currentPage} />
    : <Result title="No results found" />;
  return (
    <>
      {content}
      {/* {spinner} */}
      <Pagination
        current={currentPage}
        defaultCurrent={1}
        showSizeChanger={false}
        total={totalItems}
        showTotal={(total) => `Total ${total} items`}
        onChange={onCurrentPageChange}
      />
    </>
  );
}

RatedPage.propTypes = {
  // loading: PropTypes.bool.isRequired,
  ratedResults: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  totalItems: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onCurrentPageChange: PropTypes.func.isRequired,
};

export default RatedPage;
