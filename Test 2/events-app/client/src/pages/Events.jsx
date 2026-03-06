import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccessTime, Place, Search, Clear, Edit } from '@mui/icons-material';
import dayjs from 'dayjs';
import http from '../http';
import global from '../global';

function Events() {
    const [eventsList, setEventsList] = useState([]);
    const [search, setSearch] = useState('');

    const getEvents = () => {
        http.get('/event').then((res) => {
            setEventsList(res.data);
        });
    };

    const searchEvents = () => {
        const searchText = search.trim();
        if (!searchText) {
            getEvents();
            return;
        }

        http.get(`/event?search=${searchText}`).then((res) => {
            setEventsList(res.data);
        });
    };

    useEffect(() => {
        getEvents();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            searchEvents();
        }
    };

    const onClickClear = () => {
        setSearch('');
        getEvents();
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Events
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input
                    value={search}
                    placeholder="Search"
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={onSearchKeyDown}
                />
                <IconButton color="primary" onClick={searchEvents}>
                    <Search />
                </IconButton>
                <IconButton color="primary" onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                <Link to="/addevent" style={{ textDecoration: 'none' }}>
                    <Button variant="contained">
                        Add
                    </Button>
                </Link>
            </Box>

            <Grid container spacing={2}>
                {eventsList.map((event) => {
                    return (
                        <Grid item xs={12} md={6} key={event.id}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', mb: 1 }}>
                                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                            {event.name}
                                        </Typography>
                                        <Link to={`/editevent/${event.id}`} style={{ textDecoration: 'none' }}>
                                            <IconButton color="primary" sx={{ padding: '4px' }}>
                                                <Edit />
                                            </IconButton>
                                        </Link>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                        <AccessTime sx={{ mr: 1 }} />
                                        <Typography>
                                            {dayjs(event.eventDate).format(global.datetimeFormat)}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                        <Place sx={{ mr: 1 }} />
                                        <Typography>{event.location}</Typography>
                                    </Box>

                                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                        {event.details || ''}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
}

export default Events;
