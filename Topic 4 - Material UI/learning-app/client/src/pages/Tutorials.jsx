import React, { useEffect, useState } from 'react';
import { AccessTime, Search, Clear } from '@mui/icons-material';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton } from '@mui/material';
import dayjs from 'dayjs';
import global from '../global';
import http from '../http';

function Tutorials() {
  const [tutorialList, setTutorialList] = useState([]);

  const [search, setSearch] = useState('');
  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const getTutorials = () => {
    http.get('/tutorial').then((res) => {
      setTutorialList(res.data);
    });
  };

  const searchTutorials = () => {
    http.get(`/tutorial?search=${search}`).then((res) => {
      setTutorialList(res.data);
    });
  };

  useEffect(() => {
    getTutorials();
  }, []);

  const onSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchTutorials();
    }
  };

  const onClickSearch = () => {
    searchTutorials();
  };

  const onClickClear = () => {
    setSearch('');
    getTutorials();
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Tutorials
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Input
          value={search}
          placeholder="Search"
          onChange={onSearchChange}
          onKeyDown={onSearchKeyDown}
        />
        <IconButton color="primary" onClick={onClickSearch}>
          <Search />
        </IconButton>
        <IconButton color="primary" onClick={onClickClear}>
          <Clear />
        </IconButton>
      </Box>
      <Grid container spacing={2}>
        {tutorialList.map((tutorial) => {
          return (
            <Grid item xs={12} md={6} lg={4} key={tutorial.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {tutorial.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                    <AccessTime sx={{ mr: 1 }} />
                    <Typography>{dayjs(tutorial.createdAt).format(global.datetimeFormat)}</Typography>
                  </Box>
                  <Typography sx={{ whiteSpace: 'pre-wrap' }}>{tutorial.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default Tutorials;
