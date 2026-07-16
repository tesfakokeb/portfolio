const contentService = require('../services/contentService');
const asyncHandler = require('../utils/asyncHandler');

const getPublications = asyncHandler(async (req, res) => {
  const publications = await contentService.getPublications();
  const { search, sort } = req.query;

  let filtered = publications;
  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(
      (p) => p.title.toLowerCase().includes(q) || p.journal.toLowerCase().includes(q)
    );
  }

  filtered = [...filtered].sort((a, b) => (sort === 'oldest' ? a.year - b.year : b.year - a.year));

  res.status(200).json({ success: true, count: filtered.length, publications: filtered });
});

module.exports = { getPublications };
