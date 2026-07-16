-- ============================================================================
-- Portfolio Management Dashboard — Seed Data
-- Run after schema.sql to populate initial data.
--
--   mysql -u root -p portfolio_db < seed.sql
-- ============================================================================

USE portfolio_db;

-- ----------------------------------------------------------------------------
-- Seed navbar items (mirrors frontend/src/data/nav.js)
-- ----------------------------------------------------------------------------
INSERT INTO navbar_items (label, href, sort_order, is_visible) VALUES
  ('Home',          '#home',          1,  TRUE),
  ('About',         '#about',         2,  TRUE),
  ('Experience',    '#experience',    3,  TRUE),
  ('Research',      '#research',      4,  TRUE),
  ('Projects',      '#projects',      5,  TRUE),
  ('Publications',  '#publications',  6,  TRUE),
  ('Testimonials',  '#testimonials',  7,  TRUE),
  ('Skills',        '#skills',        8,  TRUE),
  ('Comments',      '#comments',      9,  TRUE),
  ('Contact',       '#contact',       10, TRUE)
ON DUPLICATE KEY UPDATE label = VALUES(label);

-- ----------------------------------------------------------------------------
-- Seed profile data (mirrors frontend/src/data/profile.js)
-- ----------------------------------------------------------------------------
INSERT INTO profile (
  full_name, credentials, role_title, organization,
  summary, bio, email, phone, location,
  github_url, linkedin_url, scholar_url, facebook_url, twitter_url,
  cv_url
) VALUES (
  'Tesfa Worku Meshesha',
  'Ph.D.',
  'Research Scientist',
  'NASA Goddard Space Flight Center',
  'I study how water moves through the Earth system — rivers, watersheds, and coastlines — and build the geospatial AI and full-stack tools that turn satellite and model data into decisions.',
  'I''m a hydrologist and geospatial data scientist working at the intersection of Earth observation, machine learning, and software engineering. My research focuses on large-scale river discharge estimation, watershed modeling, and the carbon and sediment fluxes that move through freshwater systems.\n\nAt NASA Goddard Space Flight Center, I develop machine learning and physically-based models that fuse satellite remote sensing with in-situ observations to close gaps in our understanding of the global water cycle — work that feeds directly into climate and water-resource decision-making.\n\nAlongside the research, I design and build the software that makes it usable: interactive dashboards, geospatial visualization platforms, and applied machine learning pipelines — treating full-stack engineering as a core research skill, not a side project.',
  'hopee2011@gmail.com',
  '+1 (845) 332-7634',
  'Greenbelt, Maryland, USA',
  'https://github.com/tesfakokeb/',
  'https://www.linkedin.com/in/tesfa-worku-983ba459/',
  'https://scholar.google.com/citations?user=C5UML0oAAAAJ&hl=en&oi=ao',
  'https://www.facebook.com/tesfaworku.worku',
  'https://x.com/tesfaworku',
  '/Tesfa_Worku_Meshesha_CV.pdf'
);
