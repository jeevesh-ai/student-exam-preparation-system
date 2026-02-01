# Student Exam Preparation System

This project is a monorepo consisting of a React frontend and a FastAPI backend.

## Structure

```text
/
├── backend/        # FastAPI backend
├── frontend/       # React frontend
└── start_seps.bat  # Local startup script
```

## Local Development

1.  **Backend**:
    - Navigate to `backend/`
    - Activate virtual environment: `venv\Scripts\activate`
    - Run: `uvicorn main:app --reload`

2.  **Frontend**:
    - Navigate to `frontend/`
    - Run: `npm start`

Alternatively, use the root level script:
```powershell
./start_seps.bat
```

## Deployment

The frontend is configured for automatic deployment to GitHub Pages via GitHub Actions.

1.  **Automatic Deployment**: Every push to the `main` branch will trigger a build and deploy the `frontend/` folder to the `gh-pages` branch.
2.  **Configuration**:
    - Ensure your GitHub repository settings are set to deploy from the `gh-pages` branch.
    - Set the `REACT_APP_API_URL` secret in your GitHub repository if your backend URL changes.

## License
MIT
