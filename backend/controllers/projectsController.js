const contentService = require('../services/contentService');
const asyncHandler = require('../utils/asyncHandler');

const getProjects = asyncHandler(async (req, res) => {
  const projects = await contentService.getProjects();
  const { category, search } = req.query;

  let filtered = projects;
  if (category && category !== 'All') {
    filtered = filtered.filter((p) => p.category === category);
  }
  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(
      (p) => p.title.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  res.status(200).json({ success: true, count: filtered.length, projects: filtered });
});

module.exports = { getProjects };
