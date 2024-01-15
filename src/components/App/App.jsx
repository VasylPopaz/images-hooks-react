import { useState, useEffect } from 'react';
import { Searchbar, ImageGallery, Button, Loader, Modal } from 'components';
import { getPhotos } from 'helpers/api';
import { Container } from './App.styled';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [showLoadMore, setShowLoadMore] = useState(false);

  useEffect(() => {
    if (!query) return;

    const loadingPhotos = async () => {
      try {
        setIsLoading(true);

        const { results, total, total_pages } = await getPhotos(query, page);
        const isMorePhotos = page < total_pages;

        if (!total)
          return toast.warning(
            'Sorry, there are no images matching your search query. Please try again.'
          );

        if (page === 1) {
          toast.success(`Hurray! We found ${total} images.`);
        } else {
          setTimeout(() => {
            window.scrollBy({
              top: window.innerHeight * 0.8,
              behavior: 'smooth',
            });
          }, 400);
        }
        setImages(prevState => [...prevState, ...results]);
        setShowLoadMore(isMorePhotos);

        if (!isMorePhotos) {
          toast.info(
            `We're sorry, but you've reached the end of search results.`
          );
        }
      } catch (error) {
        toast.error('Sorry, something went wrong. Please try again.');
        console.log(error.name);
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadingPhotos();
  }, [query, page]);

  const handleSubmit = searchQuery => {
    if (searchQuery === query) return;
    setImages([]);
    setQuery(searchQuery);
    setPage(1);
    setShowLoadMore(false);
    setModalContent(null);
  };

  const toggleModal = () => {
    setShowModal(prevState => !prevState);
  };

  const handleImgClick = content => {
    setModalContent(content);
    toggleModal();
  };

  const handleLoadMoreClick = () => {
    setPage(prevState => prevState + 1);
  };

  const handleNextPhoto = id => {
    const imageId = images.findIndex(img => img.id === id);

    if (imageId === images.length - 1) return setModalContent(images[0]);
    setModalContent(images[imageId + 1]);
  };

  const handlePrevPhoto = id => {
    const imageId = images.findIndex(img => img.id === id);

    if (!imageId) return setModalContent(images[images.length - 1]);
    setModalContent(images[imageId - 1]);
  };

  return (
    <Container>
      <Searchbar onSubmit={handleSubmit} />
      {images.length ? (
        <ImageGallery images={images} onClick={handleImgClick} />
      ) : null}
      {isLoading && <Loader />}
      {showLoadMore
        ? !isLoading && <Button onClick={handleLoadMoreClick} />
        : null}
      {showModal && (
        <Modal
          onClose={toggleModal}
          handleNextPhoto={() => handleNextPhoto(modalContent.id)}
          handlePrevPhoto={() => handlePrevPhoto(modalContent.id)}
          modalContent={modalContent}
        />
      )}
      <ToastContainer autoClose={2000} />
    </Container>
  );
};
