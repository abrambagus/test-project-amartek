import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, 
    FormLabel, Radio, RadioGroup, TextField } from '@mui/material'

interface UserInputDialogProps {
    title: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    radioGenderValue: any;
    radioStatusValue: any;
    onClose: () => void;
    isOpen: boolean;
    onSave: () => void;
    disabled: boolean;
    isLoading: boolean;
}

const UserInputDialog = ({title, handleChange, radioGenderValue, radioStatusValue, onClose, isOpen, onSave, 
    disabled, isLoading} : UserInputDialogProps) => (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
            <TextField
                required
                margin="dense"
                name="email"
                label="Email"
                type="email"
                fullWidth
                variant="standard"
                onChange={handleChange}
            />
            <TextField
                required
                margin="dense"
                name="name"
                label="Name"
                type="text"
                fullWidth
                variant="standard"
                onChange={handleChange}
            />
            <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel>
            <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="gender"
                value={radioGenderValue ? radioGenderValue : " "}
                onChange={handleChange}
            >
                <FormControlLabel value="female" control={<Radio />} label="Female" />
                <FormControlLabel value="male" control={<Radio />} label="Male" />
            </RadioGroup>
            <FormLabel id="demo-controlled-radio-buttons-group">Status</FormLabel>
            <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="status"
                value={radioStatusValue ? radioStatusValue : " "}
                onChange={handleChange}
            >
                <FormControlLabel value="active" control={<Radio />} label="Active" />
                <FormControlLabel value="inactive" control={<Radio />} label="Inactive" />
            </RadioGroup>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Batal</Button>
            <LoadingButton onClick={onSave} disabled={disabled} loading={isLoading}>Simpan</LoadingButton>
        </DialogActions>
    </Dialog>
)


export default UserInputDialog