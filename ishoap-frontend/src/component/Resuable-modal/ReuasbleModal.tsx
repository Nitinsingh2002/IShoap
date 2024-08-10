import './reause.css'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void,
    message: string
}

export function ReusableModal({ isOpen, onClose, onConfirm, message }: ModalProps) {


    return (
        <>
            <Modal show={isOpen} onHide={onClose}>
                <Modal.Body>{message}</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={onClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={onConfirm}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal >
        </>
    );
}