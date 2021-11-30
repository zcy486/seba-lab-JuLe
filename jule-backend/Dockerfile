FROM python:3

WORKDIR /jule-backend

ENV FLASK_APP=jule_backend_app.app:create_app

ENV FLASK_ENV=development

COPY ./requirements.txt .

RUN pip install -r requirements.txt

COPY . .

CMD ["flask", "run"]