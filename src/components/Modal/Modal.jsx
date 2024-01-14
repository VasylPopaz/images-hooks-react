import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ButtonList, ModalBackdrop, ModalContent } from './Modal.styled';

const modalRoot = document.querySelector('#modal-root');

export default function Modal({
  onClose,
  modalContent,
  handlePrevPhoto,
  handleNextPhoto,
}) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscapePress);
    window.addEventListener('keydown', handleSwitchImg);

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEscapePress);
      window.removeEventListener('keydown', handleSwitchImg);
    };
  });

  const handleEscapePress = event => {
    if (event.code === 'Escape') onClose();
  };

  const handleBackdropClick = event => {
    if (event.currentTarget === event.target) onClose();
  };

  const handleSwitchImg = event => {
    const { id } = modalContent;

    if (event.code === 'ArrowRight' || event.target.textContent === 'Next')
      handleNextPhoto(id);

    if (event.code === 'ArrowLeft' || event.target.textContent === 'Prev')
      handlePrevPhoto(id);
  };

  const { alt_description, urls } = modalContent;
  return createPortal(
    <ModalBackdrop onClick={handleBackdropClick}>
      <ModalContent>
        <img src={urls.full} alt={alt_description} />
        <ButtonList>
          <li>
            <button onClick={handleSwitchImg}>Prev</button>
          </li>
          <li>
            <button onClick={handleSwitchImg}>Next</button>
          </li>
        </ButtonList>
      </ModalContent>
    </ModalBackdrop>,
    modalRoot
  );
}
