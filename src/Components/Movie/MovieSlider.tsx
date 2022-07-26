import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IGetMovies } from "../../api/movieApi";
import { makeImagePath } from "../../utils";
import MovieDetail from "./MovieDetail";

export const Slider = styled.div`
  position: relative;
  margin: 2vh;
  height: 32vh;
  padding: 0px 50px;
`;

export const SliderTitle = styled.h2`
  font-size: 1.4vw;
  gap: 20px;
  margin-bottom: 20px;
`;

export const Row = styled(motion.div)<{ position: string }>`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(6, 1fr);
  position: ${(props) => props.position};
  width: 93%;
`;

export const RowVariants = {
  hidden: (isNext: boolean) => {
    return {
      x: isNext ? window.innerWidth : -window.innerWidth,
    };
  },
  visible: {
    x: 0,
  },
  exit: (isNext: boolean) => {
    return {
      x: isNext ? -window.innerWidth : window.innerWidth,
    };
  },
};

export const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  min-height: 200px;
  max-height: 200px;
  min-width: 200px;
  max-width: 200px;
  border-radius: 5%;
  background-image: url(${(props) => props.bgphoto});
  background-size: 200px 200px;
  background-position: center center;
  cursor: pointer;

  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

export const boxVariants = {
  normal: {
    scale: 1,
  },

  hover: {
    scale: 1.2,
    y: -30,
    transition: {
      delay: 0.2,
      type: "tween",
    },
  },
};

export const Info = styled(motion.div)`
  padding: 10px;
  background-color: black;
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 10px;
    color: white;
  }
`;

export const infoVariants = {
  hover: {
    opacity: 1,
    zIndex: 100,
    transition: {
      delay: 0.2,
      type: "tween",
    },
  },
};

export const PrevIcon = styled(motion.img)`
  position: absolute;
  width: 50px;
  top: 100px;
  left: 0;
  cursor: pointer;
`;

export const NextIcon = styled(motion.img)`
  position: absolute;
  width: 50px;
  top: 100px;
  right: 0;
  cursor: pointer;
`;

interface IProps {
  kind: string;
  data?: IGetMovies;
}

function MovieSlider({ kind, data }: IProps) {
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const toggleLeave = () => setLeaving((prev) => !prev);

  // To set direction of animation.
  const [isNext, setIsNext] = useState(true);

  const offset = 6;

  // To move next slide
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      else {
        const totalMovies = data?.results.length - 1;
        const maxIndex = Math.floor(totalMovies / offset) - 1;

        toggleLeave();

        setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        setIsNext(() => true);
      }
    }
  };

  // To move previous slide
  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      else {
        const totalMovies = data?.results.length - 1;
        const maxIndex = Math.floor(totalMovies / offset) - 1;

        toggleLeave();

        setIndex((prev) => (prev === 0 ? maxIndex - 1 : prev - 1));
        setIsNext(() => false);
      }
    }
  };

  const [title, setTitle] = useState("");

  useEffect(() => {
    switch (kind) {
      case "now":
        setTitle("Playing Now");
        break;
      case "popular":
        setTitle("Popular Movies");
        break;
      case "top_rated":
        setTitle("Top Rated Movies");
        break;
    }
  });

  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };

  const onMouseClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  const bigMovieMatch = useMatch(`/movies/:movieId`);

  const prevBtn = require(`../../assets/images/prevBtn.png`);
  const nextBtn = require(`../../assets/images/nextBtn.png`);

  return (
    <>
      {/* Slider */}
      <Slider>
        <SliderTitle>{title}</SliderTitle>
        <AnimatePresence
          initial={false}
          onExitComplete={toggleLeaving}
          custom={isNext}
        >
          <Row
            position="absolute"
            variants={RowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ types: "tween", duration: 1 }}
            key={index}
            custom={isNext}
          >
            {data?.results
              .slice(1)
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <Box
                  key={movie.id}
                  whileHover="hover"
                  initial="normal"
                  variants={boxVariants}
                  transition={{ type: "tween" }}
                  onClick={() => onMouseClicked(movie.id)}
                  bgphoto={makeImagePath(movie?.poster_path || "")}
                >
                  <Info variants={infoVariants}>
                    <h4>{movie.title}</h4>
                  </Info>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
        <PrevIcon src={prevBtn} whileHover="hover" onClick={decreaseIndex} />
        <NextIcon src={nextBtn} whileHover="hover" onClick={increaseIndex} />
      </Slider>

      {/* Modal */}
      <AnimatePresence>
        {bigMovieMatch ? (
          <MovieDetail id={bigMovieMatch.params.movieId!} kind={kind} />
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default MovieSlider;
