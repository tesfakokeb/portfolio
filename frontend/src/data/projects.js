import chatGPTImg from "../Image/chatGPT.png";
import aiImg from "../Image/AI.jpeg";
import nextflixImg from "../Image/Nextflix.png";
import reactAppleImg from "../Image/react-Apple.jpeg";
import globalDischargeImg from "../Image/Globad-discharge.jpeg";
import carbonProjectImg from "../Image/Carbon-project.jpeg";
import fireImg from "../Image/fire.jpeg";
import hydrologyDashboardImg from "../Image/Hydrology-dashboard.png";
import groundwaterFlowImg from "../Image/groundwater-Flow.jpeg";
import dataVisualizeImg from "../Image/data-visualize.jpeg";

export const projectCategories = [
  "All",
  "AI-powered web apps",
  "Hydrology",
  "Remote Sensing",
  "Machine Learning",
  "Web Platform",
];

export const projects = [
  {
    id: "GTP-Clone",
    title: "GTP-Clone",
    description:
      "A browser extension that overlays a running log of a model API's intermediate reasoning steps next to its final answer, for debugging LLM-backend features during development.",
    tags: ["express", "js", "react", "nodejs", "API", "CSS", "DB", "mysql"],
    image: chatGPTImg,
    category: "AI-powered web apps",
    github: "https://github.com/tesfakokeb/GTP-CLONE/",
    demo: "https://github.com/tesfakokeb/GTP-CLONE/",
    // featured: true,
  },

  {
    id: "AI-powered forum project",
    title: "AI-powered forum project",
    description:
      "A full-stack AI-powered forum application that combines community discussions with AI-generated assistance. Built using React, Express, Node.js, and MySQL, it includes user authentication, post management, comment threads, and intelligent response generation through AI APIs.",
    image: aiImg,
    tags: ["jsx", "react", "express", "nodejs", "API", "CSS", "DB", "mysql"],
    category: "AI-powered web apps",
    github: "https://github.com/tesfakokeb/ai-powered-forum-project/",
    demo: "https://github.com/tesfakokeb/ai-powered-forum-project/",
    // featured: true,
  },

  {
    id: "Netflix_clone",
    title: "Netflix Clone",
    description:
      "Built a modern movie streaming platform inspired by Netflix using React and node.js. The application integrates movie APIs to display trending, top-rated, and popular titles while providing a clean, responsive, and user-friendly interface.",
    image: nextflixImg,
    tags: [
      "JavaScript",
      "jsx",
      "CSS",
      "React",
      "node",
      "API",
      "CSS",
      "DB",
      "mysql",
    ],
    category: "AI-powered web apps",
    github: "https://github.com/tesfakokeb/Netflix_clone/",
    demo: "https://github.com/tesfakokeb/Netflix_clone/",
    // featured: true,
  },

  {
    id: "React-apple",
    title: "React-apple",
    description:
      "A responsive Apple-inspired website built with React, JSX, and CSS, featuring a clean user interface, reusable components, smooth navigation, and a modern design optimized for desktop and mobile devices.",
    image: reactAppleImg,
    tags: ["jsx", "React", "CSS"],
    category: "AI-powered web apps",
    github: "https://github.com/tesfakokeb/react-apple/",
    demo: "https://github.com/tesfakokeb/react-apple/",
    featured: true,
  },

  {
    id: "global-river-discharge",
    title: "Global River Discharge Modeling",
    description:
      "A machine learning framework estimating daily discharge for over 8,000 river reaches worldwide by fusing satellite altimetry with hydrological priors.",
    image: globalDischargeImg,
    tags: ["Python", "FVCOM", "FORTRAN", "SWAT+", "GIS & Remote sensing"],
    category: "Hydrology" , 
    GoogleScholar:
      "https://scholar.google.com/citations?user=C5UML0oAAAAJ&hl=en&oi=ao",
    featured: true,
  },
  {
    id: "carbon-flux-modeling",
    title: "Carbon Flux Modeling",
    description:
      "Regional model quantifying fluvial carbon transport using coupled hydrological and biogeochemical simulations.",
    image: carbonProjectImg,

    tags: ["R", "MATLAB", "SWAT+", "Machine Learning"],
    category: "Machine Learning",
    github: "https://github.com/",
    demo: "https://github.com/",
    // featured: false,
  },
  {
    id: "wildfire-impact",
    title: "Wildfire Impact Assessment",
    description:
      "Geospatial pipeline assessing post-fire hydrological response using multi-temporal satellite imagery and land cover classification.",
    image: fireImg,
    tags: [
      "Google Earth Engine",
      "Python",
      "SWAT+",
      "GIS & Remote sensing",
      "R",
    ],
    category: "Remote Sensing",
    GoogleScholar:
      "https://scholar.google.com/citations?user=C5UML0oAAAAJ&hl=en&oi=ao",
    // featured: true,
  },
  {
    id: "Hydrology-dashboard",
    title: "Hydrology Dashboard",
    description:
      "An interactive, full-stack dashboard for exploring streamflow, precipitation, and drought indices across US watersheds in real time.",
    image: hydrologyDashboardImg,
    tags: ["React", "Node.js", "PostgreSQL"],
    category: "Web Platform",
    GoogleScholar:
      "https://scholar.google.com/citations?user=C5UML0oAAAAJ&hl=en&oi=ao",
    // featured: true,
  },
  {
    id: "groundwater-applets",
    title: "Interactive Groundwater Flow Applets",
    description:
      "Browser-based teaching applets that simulate groundwater flow and aquifer drawdown for hydrology courses.",
    image: groundwaterFlowImg,
    tags: ["JavaScript", "React", "MODFLOW"],
    category: "Hydrology",
    github: "https://github.com/",
    demo: "https://github.com/",
    // featured: false,
  },

  {
    id: "geospatial-viz-dashboard",
    title: "Geospatial Visualization Dashboard",
    description:
      "A high-performance web mapping dashboard for visualizing large-scale environmental datasets with time-series playback.",
    image: dataVisualizeImg,
    tags: ["React", "Mapbox GL", "Node.js", "MongoDB"],
    category: "Web Platform",
    github: "https://github.com/",
    demo: "https://github.com/",
    // featured: true,
  },
];
