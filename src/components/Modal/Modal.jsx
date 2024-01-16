import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ButtonList, ModalBackdrop, ModalContent } from './Modal.styled';

const modalRoot = document.querySelector('#modal-root');

export function Modal({
  onClose,
  modalContent,
  handlePrevPhoto,
  handleNextPhoto,
}) {
  const { id } = modalContent;
  const prevButtonRef = useRef(null);
  const nextButtonRef = useRef(null);

  useEffect(() => {
    const handleKeydown = event => {
      const { code } = event;
      if (code === 'Escape') onClose();

      if (code === 'ArrowRight') handleNextPhoto(id);
      if (code === 'ArrowLeft') handlePrevPhoto(id);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [onClose, id, handleNextPhoto, handlePrevPhoto]);

  const handleBackdropClick = event => {
    if (event.currentTarget === event.target) onClose();
  };

  const handleSwitchImg = event => {
    const { target } = event;

    if (prevButtonRef.current === target) handlePrevPhoto(id);
    if (nextButtonRef.current === target) handleNextPhoto(id);
  };

  const { alt_description, urls } = modalContent;
  return createPortal(
    <ModalBackdrop onClick={handleBackdropClick}>
      <ModalContent>
        <img src={urls.full} alt={alt_description} />
        <ButtonList>
          <li>
            <button ref={prevButtonRef} onClick={handleSwitchImg}>
              &lt; Prev
            </button>
          </li>
          <li>
            <button ref={nextButtonRef} onClick={handleSwitchImg}>
              Next &gt;
            </button>
          </li>
        </ButtonList>
      </ModalContent>
    </ModalBackdrop>,
    modalRoot
  );
}
