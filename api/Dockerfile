# Image python:3.11-slim volontairement choisie (non-distroless)
# pour permettre la détection de CVE système par Trivy
FROM python:3.11-slim

LABEL maintainer="Enzo Reale"
LABEL project="pokemon-devsecops-api"
LABEL version="1.0.0"

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "app:app"]
