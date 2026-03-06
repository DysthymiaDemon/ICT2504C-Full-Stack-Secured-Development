import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    FormControl,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useNavigate, useParams } from 'react-router-dom';
import http from '../http';

function EditEvent() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState({
        name: '',
        details: '',
        eventDate: dayjs(),
        location: ''
    });
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        http.get(`/event/${id}`).then((res) => {
            const eventData = res.data;
            setEvent({
                name: eventData.name || '',
                details: eventData.details || '',
                eventDate: dayjs(eventData.eventDate),
                location: eventData.location || ''
            });
            setLoading(false);
        });
    }, [id]);

    const formik = useFormik({
        initialValues: event,
        enableReinitialize: true,
        validationSchema: yup.object({
            name: yup
                .string()
                .trim()
                .max(80, 'Name must be at most 80 characters')
                .required('Name is required'),
            details: yup
                .string()
                .trim()
                .max(800, 'Details must be at most 800 characters'),
            eventDate: yup
                .mixed()
                .required('Event Date is required')
                .test('valid-date', 'Invalid date time', (value) => dayjs(value).isValid()),
            location: yup
                .string()
                .trim()
                .max(200, 'Location must be at most 200 characters')
                .required('Location is required')
        }),
        onSubmit: (values) => {
            const data = {
                name: values.name.trim(),
                details: values.details.trim(),
                eventDate: dayjs(values.eventDate).format('YYYY-MM-DD HH:mm:ss'),
                location: values.location.trim()
            };

            http.put(`/event/${id}`, data).then(() => {
                navigate('/events');
            });
        }
    });

    const deleteEvent = () => {
        http.delete(`/event/${id}`).then(() => {
            navigate('/events');
        });
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Event
            </Typography>

            {!loading && (
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        autoComplete="off"
                        label="Name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        autoComplete="off"
                        multiline
                        minRows={3}
                        label="Details"
                        name="details"
                        value={formik.values.details}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.details && Boolean(formik.errors.details)}
                        helperText={formik.touched.details && formik.errors.details}
                    />
                    <FormControl fullWidth margin="normal">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                format="DD/MM/YYYY hh:mm A"
                                label="Select Date Time"
                                value={formik.values.eventDate}
                                onChange={(value) => formik.setFieldValue('eventDate', value)}
                                onClose={() => formik.setFieldTouched('eventDate', true)}
                                slotProps={{
                                    textField: {
                                        error: formik.touched.eventDate && Boolean(formik.errors.eventDate),
                                        helperText: formik.touched.eventDate && formik.errors.eventDate
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    </FormControl>
                    <TextField
                        fullWidth
                        margin="normal"
                        autoComplete="off"
                        label="Location"
                        name="location"
                        value={formik.values.location}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.location && Boolean(formik.errors.location)}
                        helperText={formik.touched.location && formik.errors.location}
                    />
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" type="submit">
                            Update
                        </Button>
                        <Button variant="contained" sx={{ ml: 2 }} color="error" onClick={() => setOpen(true)}>
                            Delete
                        </Button>
                    </Box>
                </Box>
            )}

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Delete Event</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this event?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={deleteEvent}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default EditEvent;
