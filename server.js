require('dotenv').config();
const express = require('express');
const cors = require('cors');
const SitesDB = require('./modules/sitesDB');
const siteService = new SitesDB();

const app = express();
const HTTP_PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


const connectionString = process.env.MONGODB_URI


siteService.initialize(connectionString).then(async() => {
  const count = await siteService.Site.countDocuments();
  console.log("Total documents in collection:", count); 
  siteService.getAllSites(1, 200).then(sites => console.log(`Total sites: ${sites.length}`));
})



// Root route for testing
app.get('/', (req, res) => {
  res.json({
    message: 'API Listening',
    term: 'Summer 2025',
    student: 'Abdalla Abdelgadir'
  });
});

// POST /api/sites
app.post('/api/sites', async (req, res) => {
  try {
    const newSite = await siteService.addNewSite(req.body);
    res.status(201).json(newSite);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/sites
app.get('/api/sites', async (req, res) => {
  try {
    const { page, perPage, name, region, provinceOrTerritoryName } = req.query;
    const sites = await siteService.getAllSites(
      parseInt(page), 
      parseInt(perPage), 
      name, 
      region, 
      provinceOrTerritoryName
    );
    res.json(sites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/sites/:id
app.get('/api/sites/:id', async (req, res) => {
  try {
    const site = await siteService.getSiteById(req.params.id);
    site
      ? res.json(site)
      : res.status(404).json({ error: 'Site not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/sites/:id
app.put('/api/sites/:id', async (req, res) => {
  try {
    await siteService.updateSiteById(req.body, req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/sites/:id
app.delete('/api/sites/:id', async (req, res) => {
  try {
    await siteService.deleteSiteById(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});

app.use((req, res, next) => {
  res.status(404).send("404 - We're unable to find what you're looking for.");
});

module.exports = app;
