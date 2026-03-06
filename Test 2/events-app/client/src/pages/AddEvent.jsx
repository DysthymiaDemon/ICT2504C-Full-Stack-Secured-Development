import { Box, Typography, TextField, Button, FormControl } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useNavigate } from 'react-router-dom';
import http from '../http';

const getDefaultEventDate = () => {
    return dayjs().add(1, 'day').minute(0).second(0).millisecond(0);
};

function AddEvent() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: '',
            details: '',
            eventDate: getDefaultEventDate(),
            location: ''
        },
        validationSchema: yup.object({
            name: yup
                .string()
                .trim()
                .max(80, 'maximum 80 characters')
                .required('Name is required'),
            details: yup
                .string()
                .trim()
                .max(800, 'maximum 800 characters'),
            eventDate: yup
                .mixed()
                .required('Event Date is required')
                .test('valid-date', 'Invalid date time', (value) => dayjs(value).isValid()),
            location: yup
                .string()
                .trim()
                .max(200, 'maximum 200 characters')
                .required('Location is required')
        }),
        onSubmit: (values) => {
            const data = {
                name: values.name.trim(),
                details: values.details.trim(),
                eventDate: dayjs(values.eventDate).format('YYYY-MM-DD HH:mm:ss'),
                location: values.location.trim()
            };

            http.post('/event', data).then(() => {
                navigate('/events');
            });
        }
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Event
            </Typography>

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
                        Add
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default AddEvent;
