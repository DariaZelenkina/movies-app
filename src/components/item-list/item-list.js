import { Flex } from "antd";
import PropTypes from "prop-types";
import Item from "../item/item";
import "./item-list.css";

function ItemList({ data }) {
  const elements = data.map((item) => (
    <Item
      key={item.id}
      {...item}
    />
  ));
  return <Flex className="movies-list">{elements}</Flex>;
}

ItemList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
  })).isRequired,
};

export default ItemList;
