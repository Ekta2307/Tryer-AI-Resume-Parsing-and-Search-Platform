# Tryer - AI Resume Parsing and Search Platform

Tryer is a full-stack resume intelligence platform built with Vue, Node.js, Express, and MongoDB. It parses PDF/DOCX resumes, prevents duplicate uploads, stores structured candidate profiles, supports smart search filters, ranks candidates with TF-IDF relevance scoring, and shows resume analytics for quick hiring decisions.

## Features

- Bulk PDF/DOCX resume upload with progress indicator
- Resume parsing for name, email, phone, experience, location, skills, and projects
- Duplicate resume prevention using SHA-256 file hashing
- Clean REST API with MVC-style backend architecture
- Case-insensitive partial search by name, skills, experience, and location
- Pagination and candidate relevance score
- Resume analytics dashboard with total resumes and top skills
- Responsive Vue UI with professional blue-grey theme
- Toast notifications, loading, empty, and error states
- Vercel-ready frontend and Render-ready backend configuration

## Tech Stack

- Frontend: Vue 3, Vite, Axios
- Backend: Node.js, Express, Multer
- Database: MongoDB, Mongoose
- Parsing: pdf-parse, mammoth

## Updated Folder Structure

```text
tryer/
  README.md
  .gitignore
  resume-query-backend/
    app.js
    index.js
    .env.example
    config/
      database.js
      env.js
    controllers/
      resumeController.js
    middleware/
      errorMiddleware.js
      requestLogger.js
      uploadMiddleware.js
      validationMiddleware.js
    models/
      Resume.js
    routes/
      index.js
      resumeRoutes.js
      search.js
      upload.js
    services/
      parserService.js
      rankingService.js
      resumeService.js
    utils/
      apiResponse.js
      asyncHandler.js
      logger.js
    package.json
  resume-query-frontend/
    .env.example
    index.html
    vite.config.js
    src/
      App.vue
      main.js
      services/
        api.js
      components/
        SearchComponent.vue
        UploadComponent.vue
        layout/
          AppNavbar.vue
        resume/
          AnalyticsPanel.vue
          ResumeCard.vue
        ui/
          StateBlock.vue
          ToastMessage.vue
      assets/
        css/
          main.css
    package.json
```

## API Documentation

Base URL in development: `http://localhost:5000/api`

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/resumes` | Search resumes with filters and pagination |
| `POST` | `/resumes` | Upload one or more resumes using `multipart/form-data` field `resumes` |
| `GET` | `/resumes/analytics` | Get total resumes, top skills, and recent uploads |
| `GET` | `/search` | Backward-compatible search endpoint |
| `POST` | `/upload` | Backward-compatible upload endpoint |

### Search Query Parameters

```text
q=developer
name=kushagra
skills=vue,node,mongodb
experience=internship
location=noida
minExperience=1
page=1
limit=9
```

### Response Shape

```json
{
  "success": true,
  "message": "Resumes fetched successfully",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 9,
    "total": 0,
    "totalPages": 1
  }
}
```

## Local Setup

### Backend

```bash
cd resume-query-backend
npm install
copy .env.example .env
npm run dev
```

Update `.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/tryer
CLIENT_URL=http://localhost:3000
UPLOAD_LIMIT_MB=5
```

### Frontend

```bash
cd resume-query-frontend
npm install
copy .env.example .env
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
cd resume-query-frontend
npm run build
```

```bash
cd resume-query-backend
npm start
```

## Deployment

### Backend on Render

1. Create a new Web Service and connect the GitHub repository.
2. Set root directory to `resume-query-backend`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `MONGO_URI=<MongoDB Atlas connection string>`
   - `CLIENT_URL=<Vercel frontend URL>`
   - `UPLOAD_LIMIT_MB=5`

### Frontend on Vercel

1. Import the repository in Vercel.
2. Set root directory to `resume-query-frontend`.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variable:
   - `VITE_API_BASE_URL=<Render backend URL>/api`

## Future AI Enhancements

- LLM-based resume summarization
- Job description to resume matching
- Candidate strengths and gaps analysis
- Semantic search with embeddings
- Interview question generation per candidate
- Skill normalization using a controlled taxonomy
