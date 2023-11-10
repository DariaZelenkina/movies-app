import { Spin, Pagination, Input, Space, Result } from "antd";
import PropTypes from "prop-types";
import ItemList from "../item-list/item-list";
import "./search-page.css";

function SearchPage({ loading, searchResults,
  totalItems, currentPage, query, onSearch, onCurrentPageChange }) {
  const spinner = loading ? <Spin size="large" /> : null;
  const content = (!loading && totalItems === 0)
    ? <Result title="No results found" />
    : <ItemList data={searchResults} />;
  return (
    <>
      <Space>
        <Input
          placeholder="Type to search..."
          defaultValue={query}
          onChange={(e) => onSearch(e.target.value)}
        />
      </Space>
      {content}
      {spinner}
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

SearchPage.propTypes = {
  loading: PropTypes.bool.isRequired,
  searchResults: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  totalItems: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  query: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
  onCurrentPageChange: PropTypes.func.isRequired,
};

export default SearchPage;
