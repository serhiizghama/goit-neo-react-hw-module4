import { useState, useEffect } from "react";
import "./App.css";
import ImageGallery from "./components/ImageGallery/ImageGallery";
import SearchBar from "./components/SearchBar/SearchBar";
import { searchPhotos, DEFAULT_PER_PAGE } from "./api";
import Loader from "./components/Loader/Loader";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import LoadMoreBtn from "./components/LoadMoreBtn/LoadMoreBtn";
import ImageModal from "./components/ImageModal/ImageModal";

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loadMore, setLoadMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState("");

  useEffect(() => {
    const fetchImages = async () => {
      try {
        if (!query) return;
        setLoading(true);
        setError(false);
        const data = await searchPhotos(query, page);

        // Replace images if it's a new query, or append on load more
        setImages((prevImages) =>
          page === 1 ? data.results : [...prevImages, ...data.results]
        );

        // Show "Load More" button if there are more results
        setLoadMore(data.results.length === DEFAULT_PER_PAGE);
      } catch (error) {
        console.log(error?.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [query, page]);

  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    setPage(1);
    setImages([]);
  };

  const handleLoadMore = () => setPage((prevPage) => prevPage + 1);

  const openModal = (img) => {
    setModalImage(img);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      {error && <ErrorMessage />}
      {images.length > 0 && (
        <ImageGallery images={images} onModal={openModal} />
      )}
      {loading && <Loader />}
      {loadMore && <LoadMoreBtn onLoad={handleLoadMore} />}
      <ImageModal src={modalImage} isOpen={showModal} onClose={closeModal} />
    </>
  );
}

export default App;
