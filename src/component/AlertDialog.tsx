import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material"

interface AlertDialogProps {
    title: string;
    onClose: () => void;
    isOpen: boolean;
    onConfirm: () => void;
}

const AlertDialog = ({title, onClose, isOpen, onConfirm}: AlertDialogProps) => (
    <Dialog
    open={isOpen}
    onClose={onClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
            {title}
        </DialogTitle>
        <DialogActions>
            <Button onClick={onClose}>No</Button>
            <Button onClick={onConfirm}>
                Yes
            </Button>
        </DialogActions>
    </Dialog>
)


export default AlertDialog