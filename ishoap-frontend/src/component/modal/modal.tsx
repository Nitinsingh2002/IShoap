
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


interface ModallProps {
    handleClose: () => void;
    handleShow: () => void;
    show: boolean;
    handleDelete: (id: string) => Promise<void>;
    id: string
}
export function Modall({ handleClose, handleShow, show, handleDelete, id }: ModallProps) {


    const handleDeleteButton = () => {
        handleClose();
        handleDelete(id);
    }

    return (
        <>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure to delete this address ?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleDeleteButton}
                        className='bg-danger'
                        style={{ border: "1px solid red" }}
                    >
                        Delete
                    </Button>                </Modal.Footer>
            </Modal>

        </>
    )
}