import { Card, Typography, Image, Flex, Space, Tag, Rate } from "antd";
import { format } from 'date-fns';
import PropTypes from "prop-types";
import "./item.css";
import { GenresConsumer } from "../genres-context";
import { RatingConsumer } from "../rating-context";

const { Title, Paragraph, Text } = Typography;
const fallbackImgUrl = "https://user-images.githubusercontent.com/237508/90251955-8b9ace00-de36-11ea-8670-5dc31fc4ba61.png";

function Item({ id, genreIds, averageRating, date, poster, title, description, rating }) {
  const formattedDate = Number.isNaN(new Date(date).getTime()) ? "" : format(new Date(date), 'PP');

  return (
    <GenresConsumer>
      {
        (genres) => (
          <RatingConsumer>
            {
              (onAddRating) => {
                const genreTags = genreIds.map((genreId) => {
                  const genre = genres.find((item) => item.id === genreId);
                  const genreName = genre !== undefined ? genre.name : null;
                  return <Tag key={genreId} className="genre">{genreName}</Tag>;
                });

                let ratingClassName = "rating-value";
                if (averageRating < 3) {
                  ratingClassName += " low";
                } else if (averageRating < 5) {
                  ratingClassName += " average";
                } else if (averageRating < 7) {
                  ratingClassName += " high";
                } else {
                  ratingClassName += " very-high";
                }

                const onRate = (value) => {
                  onAddRating(value, id);
                };

                return (
                  <Card
                    bordered={false}
                    style={{ boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.15)' }}
                    bodyStyle={{ width: 451, height: 279, padding: 0 }}
                  >
                    <Flex>
                      <Image
                        alt=""
                        src={poster}
                        style={{ width: 183, height: 279 }}
                        fallback={fallbackImgUrl}
                        preview={false}
                      />
                      <Space.Compact direction="vertical" className="card-content">
                        <Title level={5} ellipsis={{ rows: 2 }}>{title}</Title>
                        <Text className="release-date">{formattedDate}</Text>
                        <Flex className="genres-wrapper">{genreTags}</Flex>
                        <Paragraph ellipsis={{ rows: 4 }} className="description">{description}</Paragraph>
                        <Rate
                          allowHalf
                          count={10}
                          value={rating}
                          className="rating-stars"
                          onChange={onRate}
                        />
                      </Space.Compact>
                      <Text className={ratingClassName}>{averageRating.toFixed(1)}</Text>
                    </Flex>
                  </Card>
                );
              }
            }
          </RatingConsumer>
        )
      }
    </GenresConsumer>
  );
}

Item.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  poster: PropTypes.string.isRequired,
  genreIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  averageRating: PropTypes.number.isRequired,
  rating: PropTypes.number.isRequired,
};

export default Item;
