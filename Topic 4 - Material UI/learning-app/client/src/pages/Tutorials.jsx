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

  useEffect(() => {
    http.get('/tutorial').then((res) => {
      console.log(res.data);
      setTutorialList(res.data);
    });
  }, []);

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Tutorials
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Input value={search} placeholder="Search"
      onChange={onSearchChange} />
      <IconButton color="primary">
      <Search />
      </IconButton>
      <IconButton color="primary">
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
