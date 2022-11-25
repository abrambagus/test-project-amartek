import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material"

interface AlertDialogProps {
    title: string;
    onClose: () => void;
    isOpen: boolean;
    onConfirm: () => void;
    isLoading: boolean;
}

const AlertDialog = ({title, onClose, isOpen, onConfirm, isLoading}: AlertDialogProps) => (
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
            <LoadingButton onClick={onConfirm} loading={isLoading}>Yes</LoadingButton>
        </DialogActions>
    </Dialog>
)


export default AlertDialog